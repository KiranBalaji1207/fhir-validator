/**
 * Converts a FHIR XML document into the equivalent FHIR JSON object, following
 * the standard FHIR XML<->JSON mapping rules. Runs entirely client-side using
 * the browser's built-in DOMParser - no network calls, no external libraries.
 */
(function (global) {
  const isNode = typeof module !== 'undefined' && module.exports;
  const { COMPLEX_TYPES } = isNode ? require('./complexTypes.js') : global;
  const { RESOURCE_DEFS, BASE_RESOURCE_ELEMENTS, BASE_DOMAIN_ELEMENTS } = isNode ? require('./resources.js') : global;

  function stripNs(tagName) {
    const idx = tagName.indexOf(':');
    return idx === -1 ? tagName : tagName.slice(idx + 1);
  }

  function elementChildren(el) {
    return Array.from(el.childNodes).filter((n) => n.nodeType === 1);
  }

  function findSchemaForKey(elements, key) {
    for (const el of elements) {
      if (el.choice) {
        for (const c of el.choice) {
          if (key === el.name + c.suffix) return { el, resolvedType: c.type };
        }
      } else if (el.name === key) {
        return { el, resolvedType: el.type };
      }
    }
    return null;
  }

  function elementsForType(typeName) {
    if (typeName === 'BackboneElement') return null; // resolved by caller via el.elements
    const c = COMPLEX_TYPES[typeName];
    return c ? c.elements : null;
  }

  function elementsForResource(resourceType) {
    const def = RESOURCE_DEFS[resourceType];
    let elements = BASE_RESOURCE_ELEMENTS.slice();
    const isDomainResource = !def || def.isDomainResource !== false;
    if (isDomainResource) elements = elements.concat(BASE_DOMAIN_ELEMENTS);
    if (def) elements = elements.concat(def.elements);
    return elements;
  }

  // Serialize the inner content of a <div> (Narrative.div) back to an XHTML string.
  function serializeInner(el) {
    const serializer = new XMLSerializer();
    return Array.from(el.childNodes).map((n) => serializer.serializeToString(n)).join('').trim();
  }

  /**
   * Convert one XML element to its JSON representation, given the schema
   * elements known for its *parent* context (used to resolve this tag's type).
   * knownSchemaEl: the {name, type/choice, max, elements?} entry for this tag, or null if unknown.
   */
  function convertElement(el, knownSchemaEl) {
    const tag = stripNs(el.tagName);
    const idAttr = el.getAttribute('id');
    const valueAttr = el.getAttribute('value');
    const children = elementChildren(el);

    // A schema-typed "Resource" wrapper (e.g. Bundle.entry.resource, contained)
    // wraps a single child whose tag name IS the nested resourceType.
    const declaredType = knownSchemaEl ? (knownSchemaEl.resolvedType || knownSchemaEl.type) : null;
    if (declaredType === 'Resource') {
      return convertNestedResource(el);
    }

    // Narrative.div: capture raw XHTML.
    if (tag === 'div') {
      return serializeInner(el);
    }

    // Primitive element: <foo value="..."/> possibly with id/extension children.
    if (valueAttr !== null && children.every((c) => stripNs(c.tagName) === 'extension')) {
      const typeName = knownSchemaEl ? (knownSchemaEl.resolvedType || knownSchemaEl.type) : null;
      const coerced = coercePrimitive(valueAttr, typeName);
      if (idAttr === null && children.length === 0) return coerced;
      // Has an id and/or extensions -> caller will emit a paired "_field" entry; signal via wrapper.
      return { __primitive: true, value: coerced, id: idAttr, extensions: children };
    }

    // Complex element / BackboneElement / resource wrapper: recurse into children.
    const obj = {};
    if (idAttr !== null) obj.id = idAttr;
    if (tag === 'extension' || tag === 'modifierExtension') {
      const urlAttr = el.getAttribute('url');
      if (urlAttr !== null) obj.url = urlAttr;
    }

    let schemaElements = null;
    let openEnded = false;
    if (knownSchemaEl) {
      if (knownSchemaEl.elements) {
        schemaElements = knownSchemaEl.elements; // BackboneElement inline elements
      } else {
        const typeName = knownSchemaEl.resolvedType || knownSchemaEl.type;
        if (typeName === 'Resource') {
          // handled by caller (contained / Bundle.entry.resource)
        } else {
          schemaElements = elementsForType(typeName);
          openEnded = !!(COMPLEX_TYPES[typeName] && COMPLEX_TYPES[typeName].openEnded);
        }
      }
    }

    // Group children by tag name so repeats become arrays.
    const groups = {};
    for (const child of children) {
      const childTag = stripNs(child.tagName);
      (groups[childTag] = groups[childTag] || []).push(child);
    }

    for (const [childTag, nodes] of Object.entries(groups)) {
      let childSchema = null;
      if (schemaElements) {
        const found = findSchemaForKey(schemaElements, childTag);
        if (found) childSchema = { ...found.el, resolvedType: found.resolvedType };
      }
      const isArray = childSchema ? childSchema.max === '*' : nodes.length > 1;

      const values = nodes.map((n) => convertElement(n, childSchema));
      assignConverted(obj, childTag, values, isArray);
    }

    return obj;
  }

  // Places converted value(s) onto obj, splitting primitive-with-extension wrappers
  // into "field" + "_field" as FHIR JSON requires.
  function assignConverted(obj, key, values, isArray) {
    const plainValues = values.map((v) => (v && v.__primitive ? v.value : v));
    const hasExtensionInfo = values.some((v) => v && v.__primitive && (v.id || (v.extensions && v.extensions.length)));

    if (isArray) {
      obj[key] = plainValues;
      if (hasExtensionInfo) {
        obj['_' + key] = values.map((v) =>
          v && v.__primitive && (v.id || (v.extensions && v.extensions.length))
            ? buildExtensionCompanion(v)
            : null
        );
      }
    } else {
      obj[key] = plainValues[0];
      if (hasExtensionInfo) {
        obj['_' + key] = buildExtensionCompanion(values[0]);
      }
    }
  }

  function buildExtensionCompanion(primitiveWrapper) {
    const companion = {};
    if (primitiveWrapper.id) companion.id = primitiveWrapper.id;
    if (primitiveWrapper.extensions && primitiveWrapper.extensions.length) {
      companion.extension = primitiveWrapper.extensions.map((extEl) => convertElement(extEl, { elements: COMPLEX_TYPES.Extension.elements }));
    }
    return companion;
  }

  function coercePrimitive(raw, typeName) {
    if (typeName === 'boolean') return raw === 'true';
    if (['integer', 'unsignedInt', 'positiveInt'].includes(typeName)) {
      const n = parseInt(raw, 10);
      return isNaN(n) ? raw : n;
    }
    if (typeName === 'decimal') {
      const n = Number(raw);
      return isNaN(n) ? raw : n;
    }
    return raw; // strings and everything else pass through as-is
  }

  /**
   * Handle "contained" and Bundle "entry.resource" wrappers, whose single child
   * element's tag name IS the nested resourceType.
   */
  function convertNestedResource(wrapperEl) {
    const kids = elementChildren(wrapperEl);
    if (kids.length !== 1) return null;
    return convertResourceElement(kids[0]);
  }

  function convertResourceElement(rootEl) {
    const resourceType = stripNs(rootEl.tagName);
    const schemaElements = elementsForResource(resourceType);
    const idAttr = rootEl.getAttribute('id');
    const obj = { resourceType };
    if (idAttr !== null) obj.id = idAttr;

    const groups = {};
    for (const child of elementChildren(rootEl)) {
      const childTag = stripNs(child.tagName);
      (groups[childTag] = groups[childTag] || []).push(child);
    }

    for (const [childTag, nodes] of Object.entries(groups)) {
      if (childTag === 'contained') {
        obj.contained = obj.contained || [];
        for (const n of nodes) {
          const nested = convertNestedResource(n);
          if (nested) obj.contained.push(nested);
        }
        continue;
      }
      const found = findSchemaForKey(schemaElements, childTag);
      const childSchema = found ? { ...found.el, resolvedType: found.resolvedType } : null;

      const isArray = childSchema ? childSchema.max === '*' : nodes.length > 1;
      const values = nodes.map((n) => convertElement(n, childSchema));
      assignConverted(obj, childTag, values, isArray);
    }

    return obj;
  }

  function parseFhirXml(xmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    const parserError = doc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      throw new Error('The document is not well-formed XML: ' + parserError.textContent.split('\n')[0]);
    }
    const root = doc.documentElement;
    if (!root) throw new Error('No root element found.');
    return convertResourceElement(root);
  }

  const api = { parseFhirXml, convertResourceElement };
  if (isNode) module.exports = api;
  else global.FhirXml = api;
})(typeof window !== 'undefined' ? window : globalThis);

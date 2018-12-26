import React from 'react';
import { number, any, bool, string } from 'prop-types';
import equal from 'fast-deep-equal';
import SchemaRow from '../SchemaRow';

export default class SchemaRows extends React.Component {
  static propTypes = {
    schema: any,
    indent: number.isRequired,
    id: string.isRequired,
    prefix: string.isRequired,
    required: bool,
  };

  render() {
    const {schema} = this.props
    const {type} = schema;

    if (schema === true
      || equal(schema, {})
      || (schema.type === 'object'
        && !schema.properties
        && schema.additionalProperties !== false)) {
      return this.renderAnything(schema);
    }

    if (schema.anyOf) {
      return this.renderCombination('anyOf', schema);
    } else if (schema.allOf) {
      return this.renderCombination('allOf', schema);
    } else if (schema.oneOf) {
      return this.renderCombination('oneOf', schema);
    }

    if (type === 'object' || schema.properties) {
      return this.renderObject(schema);
    } else if (type === 'array' || schema.items) {
      return this.renderArray(schema);
    } else {
      return this.renderScalar(schema);
    }
  }

  renderScalar(schema) {
    const {indent, id, prefix, required} = this.props;
    const {type} = schema;
    const ellipsis = type === 'string' ? '"…"' : '…';

    return (
      <SchemaRow
        indent={indent}
        id={id}
        sample={prefix + ellipsis}
        schema={schema}
        required={required} />
    );
  }

  renderAnything(schema) {
    const {indent, id, prefix, required} = this.props;
    const ellipsis = schema.type === 'object' ? '{…}' : '…';

    return (
      <SchemaRow
        indent={indent}
        id={id}
        sample={prefix + ellipsis}
        schema={schema}
        required={required} />
    );
  }

  renderCombination(combo, schema) {
    const {indent, id, prefix, required} = this.props;
    const alternatives = schema[combo];
    const [first, subsequent] = {
      anyOf: ['Any of:', 'or:'],
      allOf: ['All of:', 'and:'],
      oneOf: ['One of:', 'or:'],
    }[combo];

    let sample = `${prefix} // ${first}`;
    let i = 1;
    const rows = [];
    for (let alt of alternatives) {
      rows.push(<SchemaRow
        key={`${i}-header`}
        indent={indent}
        id={`${id}.${i}`}
        sample={sample}
        required={required} />);
      rows.push(<SchemaRows
        key={`${i}`}
        schema={alt}
        indent={indent + 1}
        id={`${id}.${i}`}
        prefix={''} />);
      sample = `// ${subsequent}`;
      i++;
    }
    return <React.Fragment>{rows}</React.Fragment>;
  }

  renderObject(schema) {
    const {indent, id, prefix, required} = this.props;
    const {properties, additionalProperties} = schema;
    const requiredProps = new Set(schema.required || []);
    const trailer = [];
    let additionalPropertiesRow;

    if (additionalProperties === true || additionalProperties === undefined) {
      additionalPropertiesRow = (
        <SchemaRow
          indent={indent + 1}
          id={`${id}-additionalproperties`}
          sample={'…'}
          description={'Additional properties are permitted'} />
      );
    } else if (additionalProperties === false) {
      trailer.push('Additional properties are prohibited');
    } else if (additionalProperties) {
      additionalPropertiesRow = (
        <SchemaRows
          indent={indent + 1}
          id={`${id}-additionalproperties`}
          prefix={'…'}
          schema={additionalProperties} />
      );
    }

    return (
      <React.Fragment>
        <SchemaRow
          indent={indent}
          id={`${id}-open`}
          sample={prefix + '{'}
          schema={schema}
          required={required} />{
        properties && Object.entries(properties).map(([propName, propSchema]) => (
          <SchemaRows
            key={id + '.' + propName}
            schema={propSchema}
            id={id + '.' + propName}
            indent={indent + 1}
            prefix={propName + ': '}
            required={requiredProps.has(propName)}/>
        ))
        }{
          additionalPropertiesRow
        }<SchemaRow
          indent={indent}
          id={`${id}-close`}
          sample={'}'}
          description={trailer.filter(elt => elt).join('; ')} />
      </React.Fragment>
    );
  }

  renderArray(schema) {
    const {indent, id, prefix, required} = this.props;
    const {title, description, properties, items} = schema;
    const {minItems, maxItems, uniqueItems} = schema;
    const trailer = [];

    if (minItems && maxItems) {
      if (minItems === maxItems) {
        trailer.push(`Array must have exactly ${minItems} items`);
      } else {
        trailer.push(`Array must have between ${minItems} and ${maxItems} items`);
      }
    } else if (minItems) {
      if (minItems === 1) {
        trailer.push('Array must have at least one item');
      } else {
        trailer.push(`Array must have at least ${minItems} items`);
      }
    } else if (maxItems) {
      trailer.push(`Array must have at most ${maxItems} items`);
    }

    if (uniqueItems) {
      trailer.push('items must be unique');
    }

    return (
      <React.Fragment>
        <SchemaRow
          indent={indent}
          id={id}
          sample={prefix + '['}
          schema={schema}
          required={required} />{
        items && <SchemaRows
          schema={items}
          id={id + '.items'}
          indent={indent + 1}
          prefix={''} />
        }<SchemaRow
          indent={indent}
          sample={']'}
          description={trailer.filter(elt => elt).join('; ')} />
      </React.Fragment>
    );
  }
}

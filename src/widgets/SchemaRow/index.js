import React from 'react';
import { number, any, object, bool, string } from 'prop-types';
import CodeTooltip from '../../widgets/CodeTooltip';

export default class SchemaRow extends React.Component {
  static propTypes = {
    indent: number.isRequired,
    sample: string.isRequired,
    schema: any,
    id: string,
    description: string,
    required: bool,
  };

  limits(schema) {
    const {type, minLength, minimum, maxLength, maximum} = schema;
    const isNumber = prop => typeof prop === 'number';

    const min = (isNumber(minLength) && minLength)
      || (isNumber(minimum) && minimum);

    const max = (isNumber(maxLength) && maxLength)
      || (isNumber(maximum) && maximum);

    if (isNumber(min) || isNumber(max)) {
      return `range: [${min || 0}:${max || '∞'}]`;
    }
  }

  format(schema) {
    if (schema.pattern) {
      return <p><em>Pattern: <CodeTooltip pattern={schema.pattern} /></em></p>;
    } else if (schema.format) {
      return <p><em>Format: {schema.format}</em></p>;
    } else if (schema.enum) {
      return <React.Fragment>
        <p>Value must be one of:</p>
        <ul>
          {schema.enum.map(val => (
            <li key={`${schema.$id ? schema.$id : schema.id}-${val}`}>
              <CodeTooltip pattern={val} />
            </li>
          ))}
        </ul>
      </React.Fragment>;
    }
  }

  description() {
    const {schema, required} = this.props;
    const limits = schema && this.limits(schema);
    const format = schema && this.format(schema);
    const {type, title, description} = schema || {description: this.props.description};
    const annotations = [
      type,
      limits,
      required && 'required',
    ].filter(an => an).join('; ');

    return (
      <td width="60%">
        {title && <h2>{title}</h2>}
        <p>
          {annotations !== '' && <em>({annotations}) </em>}
          {description}
        </p>
        {schema && schema.default && (
          <p><em>
            Default value: {JSON.stringify(schema.default)}
          </em></p>
        )}
        {format}
      </td>
    );
  }

  render() {
    const {indent, sample, schema, id} = this.props;

    return (
      <tr>
        <td width="40%" valign="top" style={{paddingLeft: `${indent*3}em`}}>
          {id && <a name={id} />}{sample}
        </td>
        {this.description()}
      </tr>
    );
  }
}

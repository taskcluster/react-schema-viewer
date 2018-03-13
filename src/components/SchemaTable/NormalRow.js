import React from 'react';
import Markdown from '../../widgets/Markdown';
import CodeTooltip from '../../widgets/CodeTooltip';
import styles from './styles.css';

export default class NormalRow extends React.PureComponent {
  limits(schema) {
    const isNumber = prop => typeof prop === 'number';

    const min = (isNumber(schema.minLength) && schema.minLength) ||
      (isNumber(schema.minItems) && schema.minItems) ||
      (isNumber(schema.minimum) && schema.minimum);

    const max = (isNumber(schema.maxLength) && schema.maxLength)
      || (isNumber(schema.maxItems) && schema.maxItems)
      || (isNumber(schema.maximum) && schema.maximum);

    if (isNumber(min) || isNumber(max)) {
      return `[${min || 0}:${max || '∞'}]`;
    }
  }

  formatField(schema) {
    if (schema.pattern) {
      return <CodeTooltip pattern={schema.pattern} />;
    } else if (schema.format) {
      return <span>{schema.format}</span>;
    } else if (schema.enum) {
      return (
        <ul className={styles.list}>
          {schema.enum.map(val => (
            <li key={`${schema.id}-${val}`}>
              <CodeTooltip pattern={val} />
            </li>
          ))}
        </ul>
      );
    }
  }

  render() {
    const {schema, name, type, reqSet} = this.props;
    const required = reqSet && reqSet.has(name);

    return (
      <tr>
        <td>
          <strong>
            <span>
              {name}
              <span title="required" className={styles.required}>{required && ' *'}</span>
            </span>
          </strong>
        </td>
        <td>
          {type || schema.type}{this.limits(schema)}
          <br/>
          {schema.default && <span className={styles.small}>default: {JSON.stringify(schema.default)}</span>}
        </td>
        <td>
          {this.formatField(schema)}
        </td>
        <td>
          <Markdown>{schema.description}</Markdown>
        </td>
      </tr>
    );
  }
}

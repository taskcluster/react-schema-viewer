import React from 'react';
import styles from './styles.css';
import Markdown from '../../widgets/Markdown';
import CodeTooltip from '../../widgets/CodeTooltip';

export default class NormalRow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  limits(schema) {
    const min = schema.minLength || schema.minItems || schema.minimum;
    const max = schema.maxLength || schema.maxItems || schema.maximum;
    if (min || max) {
      return `[${min || 0}:${max || '∞'}]`;
    }
  }

  formatField(schema) {
    if (schema.pattern) {
      return (
        <CodeTooltip pattern={schema.pattern} />
      );
    } else if (schema.format) {
      return (<span>{schema.format}</span>);
    } else if (schema.enum) {
      return (
        <ul className={styles.formats}>
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
          <span>{name}<span className={styles.required}>{required && '*'}</span></span>
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

import React from 'react';
import styles from './style.css';
import ReactMarkdown from 'react-markdown';

export default class NormalRow extends React.Component {
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
      return (<code className={styles.short}>{schema.pattern}</code>);
    } else if (schema.format) {
      return (<span>{schema.format}</span>);
    } else if (schema.enum) {
      return (
        <ul className={styles.formats}>
          {schema.enum.map(val => (
            <li key={`${schema.id}-${val}`}>
              <code className={styles.short}>{val}</code>
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
          <span className={required && styles.required}>{name}</span>
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
          <ReactMarkdown source={schema.description || ''}/>
        </td>
      </tr>
    );
  }
}

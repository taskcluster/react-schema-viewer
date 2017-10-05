import React from 'react';
import styles from './style.css';
import ReactMarkdown from 'react-markdown';
import NormalRow from './NormalRow';

export default class JSONSchemaTable extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  objectTable(schema, name, reqSet, key) {
    let res = [];
    if (schema.properties) {
      res = Object.entries(schema.properties).map(([name, prop]) => {
        return this.schemaTable(prop, name, reqSet, `${key}-${name}`);
      });
      if (schema.additionalProperties) {
        res.push((
          <tbody key={`${key}-additional`}>
            <tr>
              <td colSpan={4}>
                Additional properties are permitted...
              </td>
            </tr>
          </tbody>
        ));
      }
    } else if (schema.additionalProperties){
      res = this.schemaTable(schema.additionalProperties, null, '<string>', reqSet)
    } else {
      res = (
        <tbody key={key}>
          <tr>
            <td colSpan={4}>
              Anything ¯\_(ツ)_/¯
            </td>
          </tr>
        </tbody>
      );
    }
    return name ? (
      <tbody className={styles.joined} key={key}>
        <NormalRow schema={schema} name={name} type='Object of' reqSet={reqSet}/>
        <tr>
          <td colSpan={4}>
            <table>
              {res}
            </table>
          </td>
        </tr>
      </tbody>
    ) : res;
  }

  combination(schema, things, name, type, key) {
    return (
      <tbody className={styles.joined}>
        <NormalRow schema={schema} name={name} type={type}/>
        <tr>
          <td colSpan={4}>
            <table>
              {things.map((thing, i) => {
                return this.schemaTable(thing, thing.title, null, `${key}-${i}`);
              })}
            </table>
          </td>
        </tr>
      </tbody>
    );
  }

  schemaTable(schema, name, reqSet, key) {
    reqSet = new Set(schema.required || reqSet || []);
    key = `${key}-${name}`;
    if (schema.anyOf) {
      return this.combination(schema, schema.anyOf, name, 'Any of', key);
    } else if (schema.allOf) {
      return this.combination(schema, schema.allOf, name, 'All of', key);
    } else if (schema.oneOf) {
      return this.combination(schema, schema.oneOf, name, 'One of', key);
    }
    switch (schema.type) {
      case 'object': return this.objectTable(schema, name, reqSet, key);
      case 'array': return (
        <tbody className={styles.joined} key={key}>
          <NormalRow schema={schema} name={name} type='Array of' reqSet={reqSet}/>
          <tr>
            <td colSpan={4}>
              <table>
                {this.schemaTable(
                  schema.items,
                  schema.items.title,
                  reqSet,
                  `${key}-${schema.items.title}`
                )}
              </table>
            </td>
          </tr>
        </tbody>
      );
      default: return (
        <tbody key={key}>
          <NormalRow schema={schema} name={name} reqSet={reqSet}/>
        </tbody>
      );
    }
  }

  render() {
    const {schema} = this.props;
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeading}>
          <h4>
            {schema.title}&nbsp;
            {schema.id && (
              <a href={schema.id} target='_blank' rel='noopener noreferrer'>
                (source)
              </a>
            )}
          </h4>
          <ReactMarkdown source={schema.description || ''}/>
        </div>
        <table className={styles.topTable}>
          {this.schemaTable(schema, null, null, schema.id)}
        </table>
      </div>
    );
  }
}

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import { object } from 'prop-types';
import Markdown from '../../widgets/Markdown';
import NormalRow from './NormalRow';
import styles from './styles.css';

export default class JSONSchemaTable extends React.PureComponent {
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
            <Table responsive>
              {res}
            </Table>
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
            <Table>
              {things.map((thing, i) => {
                return this.schemaTable(thing, thing.title, null, `${key}-${i}`);
              })}
            </Table>
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
              <Table condensed responsive>
                {this.schemaTable(
                  schema.items,
                  schema.items.title,
                  reqSet,
                  `${key}-${schema.items.title}`
                )}
              </Table>
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

  renderHeader() {
    const { schema } = this.props;

    return (
      <div className={styles.panelHeading}>
        <h3>
          {schema.title}&nbsp;{schema.id && (
          <a href={schema.id} target='_blank' rel='noopener noreferrer'>
            (source)
          </a>
        )}
        </h3>
        <Markdown>{schema.description}</Markdown>
      </div>
    )
  }

  render() {
    const { schema } = this.props;

    return (
      <div className={styles.panel}>
        {this.renderHeader()}
        <Table condensed responsive className={styles.topTable}>
          {this.schemaTable(schema, null, null, schema.id)}
        </Table>
      </div>
    );
  }
}

JSONSchemaTable.propTypes = {
  schema: object.isRequired
};

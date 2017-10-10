import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { object, bool, oneOf, string } from 'prop-types';
import Container from '../../widgets/Container';
import NormalRow from './NormalRow';
import styles from './styles.css';

export default class JSONSchemaTable extends React.PureComponent {
  static propTypes = {
    schema: object.isRequired,
    headerBackgroundColor: string,
    condensed: bool,
  };

  static defaultProps = {
    condensed: false,
    headerBackgroundColor: '#f5f5f5'
  };

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
            <Table condensed={this.props.condensed} bordered className={styles.childTable} responsive>
              {res}
            </Table>
          </td>
        </tr>
      </tbody>
    ) : res;
  }

  combination(schema, things, name, type, key) {
    return (
      <tbody key={`combination-${key}`} className={styles.joined}>
        <NormalRow schema={schema} name={name} type={type}/>
        <tr>
          <td colSpan={4}>
            <Table bordered className={styles.childTable}>
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
              <Table condensed={this.props.condensed} responsive>
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

  render() {
    return (
      <Container
        backgroundColor={this.props.headerBackgroundColor}
        schema={this.props.schema}>
        <Table
          condensed={this.props.condensed}
          responsive
          className={styles.parentTable}>
          {this.schemaTable(this.props.schema, null, null, this.props.schema.id)}
        </Table>
      </Container>
    );
  }
}

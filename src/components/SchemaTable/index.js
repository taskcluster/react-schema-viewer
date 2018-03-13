import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { object, bool, oneOf, string } from 'prop-types';
import joiToJson from 'joi-to-json-schema';
import Container from '../../widgets/Container';
import NormalRow from './NormalRow';
import styles from './styles.css';

export default class SchemaTable extends React.PureComponent {
  static propTypes = {
    schema: object.isRequired,
    headerBackgroundColor: string,
    borderColor: string,
    maxHeight: string,
    type: string
  };

  static defaultProps = {
    headerBackgroundColor: '#f5f5f5',
    maxHeight: '100%',
    type: 'json',
    borderColor: '#ddd',
  };

  objectTable(schema, name, reqSet, key) {
    let res = [];

    if (schema.properties) {
      res = Object.entries(schema.properties).map(([name, prop]) => {
        return this.schemaTable(prop, name, reqSet, `${key}-${name}`);
      });

      if (schema.additionalProperties) {
        res.push((
          <tbody style={{ borderColor: this.props.borderColor }} key={`${key}-additional`}>
            <tr>
              <td style={{ borderColor: this.props.borderColor }} colSpan={4}>
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
        <tbody style={{ borderColor: this.props.borderColor }} key={key}>
          <tr>
            <td style={{ borderColor: this.props.borderColor }} colSpan={4}>
              Anything ¯\_(ツ)_/¯
            </td>
          </tr>
        </tbody>
      );
    }
    return name ? (
      <tbody style={{ borderColor: this.props.borderColor }} className={styles.joined} key={key}>
        <NormalRow schema={schema} name={name} type='Object of' reqSet={reqSet}/>
        <tr>
          <td style={{ borderColor: this.props.borderColor }} colSpan={4}>
            <Table bordered className={styles.childTable} responsive>
              {res}
            </Table>
          </td>
        </tr>
      </tbody>
    ) : res;
  }

  combination(schema, things, name, type, key) {
    return (
      <tbody style={{ borderColor: this.props.borderColor }} key={`combination-${key}`} className={styles.joined}>
        <NormalRow schema={schema} name={name} type={type}/>
        <tr>
          <td style={{ borderColor: this.props.borderColor }} colSpan={4}>
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

    const renderArray = () => (
      <tbody style={{ borderColor: this.props.borderColor }} className={styles.joined} key={key}>
        <NormalRow schema={schema} name={name} type='Array of' reqSet={reqSet}/>
        <tr>
          <td style={{ borderColor: this.props.borderColor }} colSpan={4}>
            <Table responsive>
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
    const renderObject = () => this.objectTable(schema, name, reqSet, key);

    switch (schema.type) {
      case 'object': return renderObject();
      case 'array': return renderArray();
      case undefined:
        if (schema.properties) {
          return renderObject();
        } else if (schema.items) {
          return renderArray();
        }
      default: return (
        <tbody style={{ borderColor: this.props.borderColor }} key={key}>
          <NormalRow schema={schema} name={name} reqSet={reqSet}/>
        </tbody>
      );
    }
  }

  render() {
    const schema = this.props.type === 'joi' ?
      joiToJson(this.props.schema) :
      this.props.schema;

    return (
      <Container
        backgroundColor={this.props.headerBackgroundColor}
        maxHeight={this.props.maxHeight}
        schema={schema}>
        <Table
          responsive
          className={styles.parentTable}>
          {this.schemaTable(schema, null, null, schema.id)}
        </Table>
      </Container>
    );
  }
}

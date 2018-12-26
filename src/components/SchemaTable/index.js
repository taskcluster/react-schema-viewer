import React from 'react';
import { object, string } from 'prop-types';
import Container from '../../widgets/Container';
import SchemaRows from '../../widgets/SchemaRows';
import styles from './styles.css';

export default class SchemaTable extends React.Component {
  static propTypes = {
    schema: object.isRequired,
    headerBackgroundColor: string,
    maxHeight: string,
  };

  static defaultProps = {
    headerBackgroundColor: '#f5f5f5',
    maxHeight: '100%',
  };

  render() {
    const { schema } = this.props;

    return (
      <Container
        backgroundColor={this.props.headerBackgroundColor}
        maxHeight={this.props.maxHeight}
        schema={schema}>
        <table width="100%">
          <tbody>
            <SchemaRows schema={schema} id={schema.$id || 'root'} indent={0} prefix='' />
          </tbody>
        </table>
      </Container>
    );
  }
}

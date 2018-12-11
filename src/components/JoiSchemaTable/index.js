import React, { PureComponent } from 'react';
import joiToJson from 'joi-to-json-schema';
import SchemaTable from '../SchemaTable';

export default class JoiSchemaTable extends PureComponent {
  render() {
    const schema = joiToJson(this.props.schema);

    return <SchemaTable schema={schema} />;
  }
}

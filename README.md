# react-jsonschema-viewer

<p align="center">
  <img src="https://raw.githubusercontent.com/taskcluster/react-jsonschema-viewer/master/viewer.png" height="250">
</p>

---

React JSON Schema Viewer takes a JSON Schema as input and uses it to generate comprehensible views.
It has full support for JSON Schema version 3 and 4.

## JSONSchemaTable

### Usage

After importing the component, it can be rendered with the required `schema` prop:

```js
import React from 'react';
import { render } from 'react-dom';
import { JSONSchemaTable } from 'react-jsonschema-viewer';

render((
  <JSONSchemaTable schema="http://example.json" />
), document.getElementById('root'));
````

### Props
| Property | Type        | Required? | Description             |
|----------|-------------|-----------|-------------------------|
| `schema` | JSON Object | Yes       | The JSON schema to view |
| `headerBackgroundColor` | string | No       | The header background color |
| `maxHeight` | string | No       | The max height of the panel |

# react-schema-viewer

<p align="center">
  <img src="https://raw.githubusercontent.com/taskcluster/react-schema-viewer/master/viewer.png" height="250">
</p>

---

React Schema Viewer takes a schema as input and uses it to generate comprehensible views.
It has full support for Joi and JSON schema (version 3 and 4).

## SchemaTable

### Props
| Property                | Type                       | Required? | Description                                                                                       |
|-------------------------|----------------------------|-----------|---------------------------------------------------------------------------------------------------|
| `schema`                | Object                     | ✓         | Schema object representation in one the supported schema types.                                   |
| `type`                  | enumerated: 'json' &#124; 'joi' | -         | Object schema validation type. Default: 'json'.                                                   |
| `headerBackgroundColor` | string                     | -         | The header background color given that a schema title is provided. Default: 'rgb(245, 245, 245)'. |
| `maxHeight`             | string                     | -         | Max height of the panel. Default: '100%'.                                                          |

### Usage

_Example: Rendering a JSON schema:_
```js
import React from 'react';
import { render } from 'react-dom';
import SchemaTable from 'react-schema-viewer';

const JSONSchema = {
  'title': 'Person',
  'type': 'object',
  'properties': {
    'firstName': {
      'type': 'string'
    },
    'lastName': {
      'type': 'string'
    },
    'age': {
      'description': 'Age in years',
      'type': 'integer',
      'minimum': 0
    }
  },
  'required': ['firstName', 'lastName']
};

render((
  <SchemaTable schema={JSONSchema} />
), document.getElementById('root'));
````

_Example: Rendering a Joi object schema:_
```js
import React from 'react';
import { render } from 'react-dom';
import SchemaTable from 'react-schema-viewer';

const joiSchema = joi.object({
  client_id: joi.string().optional(),
  addon_version: joi.string().required(),
  locale: joi.string().required(),
  session_id: joi.string(),
  page: joi.string().valid(["about:home", "about:newtab", "unknown"]),
  user_prefs: joi.number().integer().required()
});

render((
  <SchemaTable schema={joiSchema} />
), document.getElementById('root'));
````

## License

react-schema-viewer is released as [MPL 2.0](http://mozilla.org/MPL/2.0/).

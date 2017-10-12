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

react-schema-viewer is an ES-compatible module, so it can be imported as expected. If you want to use it with CJS require, you'll need to use the .default property to access the default exports:

```js
// CJS require
const SchemaViewer = require('react-schema-viewer').default;

// ES module
import SchemaViewer from 'react-schema-viewer';
```

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

## Development and Contributing

This repository uses [Neutrino](https://neutrino.js.org) and [neutrino-preset-react-components](https://github.com/eliperelman/neutrino-preset-react-components/) for developing, previewing, and building React components. To get started:

- Fork and clone this repo.
- Install the dependencies with `yarn`.
- Start the development servers with `yarn start`.
- Use CTRL-C to exit the development server.
- Use `yarn build` to generate the compiled component for publishing to npm.

Feel free to open an issue, submit a pull request, or contribute however you would like. Understand that this
documentation is still a work in progress, so file an issue or submit a PR to ask questions or make improvements.
Thanks!

## License

react-schema-viewer is released as [MPL 2.0](http://mozilla.org/MPL/2.0/).

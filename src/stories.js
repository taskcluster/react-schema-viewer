import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Stories, Story, Props } from 'neutrino-preset-react-components/lib';
import SchemaTable from './components/SchemaTable';
import JoiSchemaTable from './components/JoiSchemaTable';
import joi from 'joi-browser';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = document.getElementById('root');
const simple = {
  type: 'object',
  properties: {
    mystring: {
      type: "string",
      title: "My string",
      description: "This is my string.",
      default: "foo"
		},
    aNumber: {
      anyOf: [
        {
          description: "Literal number",
          type: "number",
          minimum: 13,
          maximum: 133,
        }, {
          description: "String representation",
          type: "string",
        }, {
          description: "Exponential notation",
          properties: {
            exp: {type: 'number'},
            mant: {type: 'number'},
          }
        }
      ],
		},
    bits: {
      type: 'array',
      title: 'Bitstring',
      minItems: 7,
      uniqueItems: true,
      items: {
        anyOf: [
          {
            type: "boolean",
            description: "Boolean bit -- True = 1, False = 0.",
          }, {
            type: "number",
            description: "Numeric bit",
            enum: [0, 1],
          }
        ]
      }
    }
  }
};

const load = async () => {
  const hookStatus = require('../schemas/hook-status.json');
  const taskDef = require('../schemas/task.json');
  const indexedTask = require('../schemas/indexed-task-response.json');
  const oneOf = await require('../schemas/post-artifact-request.json');
  const otherProps = require('../schemas/provisioner-response.json');
  const joiSchema = joi.object({
    client_id: joi.string().optional(),
    addon_version: joi.string().required(),
    locale: joi.string().required(),
    session_id: joi.string(),
    page: joi.string().valid(["about:home", "about:newtab", "unknown"]),
    user_prefs: joi.number().integer().required()
  });

  render(
    (
      <AppContainer>
        <Stories>
          <Story component={SchemaTable} >
            <Props name="Simple" schema={simple} />
            <Props name="Task Definition" schema={taskDef} />
            <Props name="Hook Status" headerBackgroundColor={'rgba(73, 204, 144, 0.1)'} schema={hookStatus} />
            <Props name="Extra Properties" schema={otherProps} />
            <Props name="One of" schema={oneOf} />
            <Props name="Index Response" schema={indexedTask} />
          </Story>
          <Story component={JoiSchemaTable} >
            <Props name="Joi example" schema={joiSchema} />
          </Story>
        </Stories>
      </AppContainer>
    ), root
  );
};

if (module.hot) {
  module.hot.accept(['./components/SchemaTable', './components/JoiSchemaTable'], load);
}

load();

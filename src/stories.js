import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Stories, Story, Props } from 'neutrino-preset-react-components/lib';
import SchemaTable from './components/SchemaTable';
import joi from 'joi-browser';

const root = document.getElementById('root');

const load = async () => {
  const treeherderConfig = await (await fetch('http://schemas.taskcluster.net/taskcluster-treeherder/v1/task-treeherder-config.json')).json();
  const getClientResponse = await (await fetch('http://schemas.taskcluster.net/hooks/v1/hook-status.json')).json();
  const taskDef = await (await fetch('http://schemas.taskcluster.net/queue/v1/task.json')).json();
  const notify = await (await fetch('http://schemas.taskcluster.net/notify/v1/email-request.json')).json();
  const index = await (await fetch('http://schemas.taskcluster.net/index/v1/indexed-task-response.json')).json();
  const oneOf = await (await fetch('http://schemas.taskcluster.net/queue/v1/post-artifact-request.json')).json();
  const otherProps = await (await fetch('http://schemas.taskcluster.net/queue/v1/provisioner-response.json')).json();
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
            <Props name="Treeherder configuration" schema={treeherderConfig} />
            <Props name="Get Client Response" borderColor="black" schema={getClientResponse} />
            <Props name="Joi example" type='joi' schema={joiSchema} />
            <Props name="Green Header Background" headerBackgroundColor={'rgba(73, 204, 144, 0.1)'} schema={getClientResponse} />
            <Props name="Task Definition" schema={taskDef} />
            <Props name="Notify Request" schema={notify} />
            <Props name="Index Response" schema={index} />
            <Props name="One of" schema={oneOf} />
            <Props name="Extra Properties" schema={otherProps} />
          </Story>
        </Stories>
      </AppContainer>
    ), root
  );
};

if (module.hot) {
  module.hot.accept('./components/SchemaTable', load);
}

load();

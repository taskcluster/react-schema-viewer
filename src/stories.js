import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Stories, Story, Props } from 'neutrino-preset-react-components/lib';
import JSONSchemaTable from './components/JSONSchemaTable';

const root = document.getElementById('root');

const load = async () => {
  const getClientResponse = await (await fetch('http://schemas.taskcluster.net/auth/v1/get-client-response.json')).json();
  const taskDef = await (await fetch('http://schemas.taskcluster.net/queue/v1/task.json')).json();
  const notify = await (await fetch('http://schemas.taskcluster.net/notify/v1/email-request.json')).json();
  const index = await (await fetch('http://schemas.taskcluster.net/index/v1/indexed-task-response.json')).json();
  const oneOf = await (await fetch('http://schemas.taskcluster.net/queue/v1/post-artifact-request.json')).json();
  const otherProps = await (await fetch('http://schemas.taskcluster.net/queue/v1/provisioner-response.json')).json();

  render(
    (
      <AppContainer>
        <Stories>
          <Story component={JSONSchemaTable} >
            <Props name="Get Client Response" schema={getClientResponse} />
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
  module.hot.accept('./components/JSONSchemaTable', load);
}

load();

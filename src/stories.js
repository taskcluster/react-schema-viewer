import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Stories, Story, Props } from 'neutrino-preset-react-components/lib';
import JSONSchemaDoc from './components/JSONSchemaDoc';

const root = document.getElementById('root');

const load = async () => {
  const getClientResponse = await fetch("http://schemas.taskcluster.net/auth/v1/get-client-response.json#");
  const taskDef = await fetch("http://schemas.taskcluster.net/queue/v1/task.json#");
  const notify = await fetch("http://schemas.taskcluster.net/notify/v1/email-request.json#");
  const index = await fetch("http://schemas.taskcluster.net/index/v1/indexed-task-response.json#");
  const oneOf = await fetch("http://schemas.taskcluster.net/queue/v1/post-artifact-request.json#");
  const otherProps = await fetch("http://schemas.taskcluster.net/queue/v1/provisioner-response.json#");
  render((
    <AppContainer>
      <Stories>
        <Story component={JSONSchemaDoc}>
          <Props name="Get Client Response" schema={await getClientResponse.json()}/>
          <Props name="Task Definition" schema={await taskDef.json()}/>
          <Props name="Notify Request" schema={await notify.json()}/>
          <Props name="Index Response" schema={await index.json()}/>
          <Props name="One of" schema={await oneOf.json()}/>
          <Props name="Extra Properties" schema={await otherProps.json()}/>
        </Story>
      </Stories>
    </AppContainer>
  ), root);
}

if (module.hot) {
  module.hot.accept('./components/JSONSchemaDoc', load);
}

load();

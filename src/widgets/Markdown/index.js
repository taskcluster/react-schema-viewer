import React from 'react';
import { string } from 'prop-types';
import markdown from 'markdown-it';

export default class Markdown extends React.PureComponent {
  render() {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: markdown().renderInline(this.props.children)
        }}
      />
    );
  }
}

Markdown.propTypes = {
  children: string.isRequired
};

Markdown.defaultProps = {
  children: ''
};

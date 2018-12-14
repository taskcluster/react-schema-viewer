import React from 'react';
import Markdown from '../Markdown';
import styles from './styles.css';

export default class Container extends React.PureComponent {

  getViewSource(schema) {
    if (schema.$id) {
      return (
        <a className={styles.source} onClick={this.props.onClick}>
          {`(${this.props.jsonView ? 'hide' : 'show'} source)`}
        </a>
      );
    }

    if (schema.id) {
      return (
        <a className={styles.source} href={schema.$id ? schema.$id : schema.id} target='_blank' rel='noopener noreferrer'>
          (view source)
        </a>
      );
    }

    return
  }

  renderHeader = () => {
    const { schema, backgroundColor } = this.props;
    return (
      <div style={{ backgroundColor }} className={styles.headerContainer}>
        <h4 className={styles.title}>
          {schema.title}&nbsp;{this.getViewSource(schema)}
        </h4>
        <Markdown>{schema.description}</Markdown>
      </div>
    );
  };

  render() {
    const { maxHeight, schema } = this.props;

    return (
      <div style={{ maxHeight }} className={styles.container}>
        <div>
          {schema.title && this.renderHeader()}
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

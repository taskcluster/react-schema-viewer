import React from 'react';
import Markdown from '../Markdown';
import styles from './styles.css';

export default class Container extends React.PureComponent {
  renderHeader = () => {
    const { schema, backgroundColor, borderColor } = this.props;

    return (
      <div style={{ backgroundColor, borderColor }} className={styles.headerContainer}>
        <h4 className={styles.title}>
          {schema.title}&nbsp;{schema.id && (
          <a className={styles.source} href={schema.id} target='_blank' rel='noopener noreferrer'>
            (source)
          </a>
        )}
        </h4>
        <Markdown>{schema.description}</Markdown>
      </div>
    );
  };

  render() {
    const { maxHeight, schema, borderColor } = this.props;

    return (
      <div style={{ maxHeight, borderColor }} className={styles.container}>
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

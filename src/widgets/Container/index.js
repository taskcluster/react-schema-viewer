import React from 'react';
import Markdown from '../Markdown';
import styles from './styles.css';

export default class Container extends React.PureComponent {
  renderHeader = () => {
    const { schema, backgroundColor } = this.props;

    return (
      <div style={{ backgroundColor }} className={styles.headerContainer}>
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
    const maxHeight = this.props.maxHeight;

    return (
      <div style={{ maxHeight }} className={styles.container}>
        <div>
          {this.renderHeader()}
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

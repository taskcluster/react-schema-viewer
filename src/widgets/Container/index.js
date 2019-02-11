import React from 'react';
import Markdown from '../Markdown';
import styles from './styles.css';

export default class Container extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      jsonView: false
    }
  }

  handleViewToggle = () => {
    this.setState({
      jsonView: !this.state.jsonView
    });
  };

  renderHeader = () => {
    const { schema, backgroundColor } = this.props;
    return (
      <div style={{ backgroundColor }} className={styles.headerContainer}>
        <h4 className={styles.title}>
          {schema.title}&nbsp;{(
            <a className={styles.source} onClick={this.handleViewToggle}>
              {this.state.jsonView ? 'hide' : 'show'} source
            </a>
          )}
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
          {!this.state.jsonView ? this.props.children : (
            <pre className={styles.preJsonView}>
              <code>{JSON.stringify(schema, undefined, 2)}</code>
            </pre>
          )}
        </div>
      </div>
    );
  }
}

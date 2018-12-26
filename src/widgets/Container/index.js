import React from 'react';
import Markdown from '../Markdown';
import styles from './styles.css';

export default class Container extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      jsonView: false,
      error: null,
    }
  }

  handleViewToggle = () => {
    this.setState({
      jsonView: !this.state.jsonView
    });
  }

  static getDerivedStateFromError(error) {
    return {error};
  }

  render() {
    const { maxHeight, schema, backgroundColor } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <div style={{ maxHeight }} className={styles.container}>
          <h4>Error Rendering Schema</h4>
          An error occurred rendering this schema:
          <pre>{error.toString()}</pre>
          Here is the content of the schema, as JSON:
          <pre>{JSON.stringify(schema, null, 2)}</pre>
        </div>
      );
    }

    return (
      <div style={{ maxHeight }} className={styles.container}>
        <div style={{ backgroundColor }} className={styles.headerContainer}>
          <h4 className={styles.title}>
            {schema.title || 'JSON Schema'}&nbsp;{(
              <a className={styles.source} onClick={this.handleViewToggle}>
                {this.state.jsonView ? 'hide' : 'show'} source
              </a>
            )}
          </h4>
        </div>
        <div>
          {!this.state.jsonView ? this.props.children : (
            <pre>
              {JSON.stringify(schema, undefined, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

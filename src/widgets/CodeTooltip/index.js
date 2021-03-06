import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import styles from './styles.css';

const PATTERN_MAX = 15;
const Pattern = ({ pattern }) => {
  if (!(pattern.length > PATTERN_MAX)) {
    return <code>{pattern}</code>
  }

  return (
    <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={(
      <Popover className={styles.popover} id="popover-positioned-bottom">
        <code>{pattern}</code>
      </Popover>
    )}>
      <code className={styles.short}>
        {pattern.slice(0, PATTERN_MAX)}
        <span className={styles.dots}>...</span>
      </code>
    </OverlayTrigger>
  );
};

export default Pattern;

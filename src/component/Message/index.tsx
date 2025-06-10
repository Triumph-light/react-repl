import React, { useState } from 'react';
import './index.less';

interface MessageProps {
  err?: string | Error | false
  warn?: string | Error
}

const Message = (props: MessageProps) => {
  const { err, warn } = props;

  const [dismissed, setDismissed] = useState(false)

  function formatMessage(err: string | Error): string {
    if (typeof err === 'string') {
      return err
    } else {
      let msg = err.message
      const loc = err.loc
      if (loc && loc.start) {
        msg = `(${loc.start.line}:${loc.start.column}) ` + msg
      }
      return msg
    }
  }

  if (dismissed || (!err && !warn)) return
  return (
    <div className={`msg ${err ? 'err' : 'warn'}`}>
      <pre>{formatMessage(err || warn!)}</pre>
      <button className="dismiss" onClick={() => setDismissed(true)}>✕</button>
    </div >
  );
};

export default Message;
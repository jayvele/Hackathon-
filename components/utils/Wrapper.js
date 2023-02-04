import React from 'react';
export default function Wrapper({ children }) {
  return (
    <>
      <div style={{ marginTop: '5.5em', marginBottom: '2em' }}>{children}</div>
    </>
  );
}

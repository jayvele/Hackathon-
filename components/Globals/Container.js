import React from 'react';
export default function Container({ styles, children }) {
  const style = `container mx-auto shadow-md shadow-slate-200 bg-white rounded-lg p-3 ${styles}`;
  return (
    <>
      <div className={style}>{children}</div>
    </>
  );
}

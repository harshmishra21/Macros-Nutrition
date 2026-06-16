import React from 'react';
import useCursor from '../../hooks/useCursor.js';

export function Cursor() {
  const { cursorRef, ringRef, gridRef } = useCursor();

  return (
    <>
      <div ref={gridRef} className="cursor-grid" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={cursorRef} className="cursor" />
    </>
  );
}

export default Cursor;

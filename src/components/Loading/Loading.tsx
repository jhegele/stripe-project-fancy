import React from 'react';
import { Spinner } from 'react-bootstrap';

export const Loading: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

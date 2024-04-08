import { createRef } from 'react';

export const navigationRef = createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

// You can add more functions based on your requirements
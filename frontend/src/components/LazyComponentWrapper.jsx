import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

const LazyComponentWrapper = ({ children, componentName = 'Component' }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message={`Loading ${componentName}...`} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyComponentWrapper;
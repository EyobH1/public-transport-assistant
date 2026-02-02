import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className="loading-spinner">
      <Loader2 className={`spinner-icon ${sizeClasses[size]}`} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
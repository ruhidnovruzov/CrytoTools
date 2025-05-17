import React from 'react';

const PageContainer = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-lg mt-10 shadow-md p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">{description}</p>
      {children}
    </div>
  );
};

export default PageContainer;
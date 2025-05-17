import React from 'react';

const CipherForm = ({
  text,
  setText,
  result,
  onEncrypt,
  onDecrypt,
  children,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
          Mətn
        </label>
        <textarea
          id="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Şifrələmək və ya deşifrələmək istədiyiniz mətni daxil edin..."
        />
      </div>

      {children}

      <div className="flex space-x-4">
        <button
          onClick={onEncrypt}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Şifrələ
        </button>
        <button
          onClick={onDecrypt}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Deşifrələ
        </button>
      </div>

      <div>
        <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-1">
          Nəticə
        </label>
        <textarea
          id="output"
          value={result}
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
          rows={4}
        />
      </div>
    </div>
  );
};

export default CipherForm;
import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import CipherForm from '../components/CipherForm';

const PlayfairCipher = () => {
  const [key, setKey] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [matrix, setMatrix] = useState([]);
  const [mode, setMode] = useState('encrypt');

  // Azərbaycan əlifbası
  const azAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const generateMatrix = (key) => {
    // Açarı təmizlə və böyük hərflərə çevir
    let processedKey = key.toUpperCase().replace(/[^A-ZÇƏĞIİÖŞÜ]/g, '');
    
    // J hərfini İ ilə əvəz et (Playfair şifri üçün)
    processedKey = processedKey.replace(/J/g, 'İ');
    
    // İstifadə edilmiş hərfləri izləmək üçün set
    const usedChars = new Set();
    
    // Matris ölçüsü (Azərbaycan əlifbası üçün 6x6)
    const matrixSize = 6;
    const newMatrix = Array(matrixSize).fill().map(() => Array(matrixSize).fill(''));
    
    let row = 0, col = 0;
    
    // Əvvəlcə açardan hərfləri əlavə et
    for (let char of processedKey) {
      if (!usedChars.has(char)) {
        newMatrix[Math.floor(row/matrixSize)][row % matrixSize] = char;
        usedChars.add(char);
        row++;
      }
    }
    
    // Sonra qalan əlifba hərflərini əlavə et
    for (let char of azAlphabet) {
      if (!usedChars.has(char) && row < matrixSize * matrixSize) {
        newMatrix[Math.floor(row/matrixSize)][row % matrixSize] = char;
        usedChars.add(char);
        row++;
      }
    }
    
    return newMatrix;
  };

  const findPosition = (matrix, char) => {
    const matrixSize = matrix.length;
    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        if (matrix[i][j] === char) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  };

  const encryptPair = (matrix, a, b) => {
    const matrixSize = matrix.length;
    const [rowA, colA] = findPosition(matrix, a);
    const [rowB, colB] = findPosition(matrix, b);
    
    if (rowA === rowB) {
      // Eyni sətirdə, sağdakı simvolu götür (çevrələnmə ilə)
      return [matrix[rowA][(colA + 1) % matrixSize], matrix[rowB][(colB + 1) % matrixSize]];
    } else if (colA === colB) {
      // Eyni sütunda, aşağıdakı simvolu götür (çevrələnmə ilə)
      return [matrix[(rowA + 1) % matrixSize][colA], matrix[(rowB + 1) % matrixSize][colB]];
    } else {
      // Düzbucaqlı hal, eyni sətirdə amma digər simvolun sütununda olan simvolu götür
      return [matrix[rowA][colB], matrix[rowB][colA]];
    }
  };

  const decryptPair = (matrix, a, b) => {
    const matrixSize = matrix.length;
    const [rowA, colA] = findPosition(matrix, a);
    const [rowB, colB] = findPosition(matrix, b);
    
    if (rowA === rowB) {
      // Eyni sətirdə, soldakı simvolu götür (çevrələnmə ilə)
      return [matrix[rowA][(colA - 1 + matrixSize) % matrixSize], matrix[rowB][(colB - 1 + matrixSize) % matrixSize]];
    } else if (colA === colB) {
      // Eyni sütunda, yuxarıdakı simvolu götür (çevrələnmə ilə)
      return [matrix[(rowA - 1 + matrixSize) % matrixSize][colA], matrix[(rowB - 1 + matrixSize) % matrixSize][colB]];
    } else {
      // Düzbucaqlı hal, şifrələmə ilə eyni
      return [matrix[rowA][colB], matrix[rowB][colA]];
    }
  };

  const processCipher = () => {
    // Açar matrisi yaradılır
    const newMatrix = generateMatrix(key);
    setMatrix(newMatrix);
    
    // Mətni təmizlə və böyük hərflərə çevir
    let processed = text.toUpperCase().replace(/[^A-ZÇƏĞIİÖŞÜ]/g, '');
    processed = processed.replace(/J/g, 'İ');
    
    // İkiləri ayır, təkrarlanan hərflər arasına X əlavə et və sonuna X əlavə et (tək olarsa)
    let digraphs = [];
    let i = 0;
    
    while (i < processed.length) {
      if (i === processed.length - 1) {
        digraphs.push([processed[i], 'X']);
        break;
      }
      
      if (processed[i] === processed[i + 1]) {
        digraphs.push([processed[i], 'X']);
        i++;
      } else {
        digraphs.push([processed[i], processed[i + 1]]);
        i += 2;
      }
    }
    
    // Hər ikini şifrələ və ya deşifrələ
    let resultText = '';
    
    for (let [a, b] of digraphs) {
      let [newA, newB] = mode === 'encrypt' ? encryptPair(newMatrix, a, b) : decryptPair(newMatrix, a, b);
      resultText += newA + newB;
    }
    
    setResult(resultText);
  };

  const handleEncrypt = () => {
    setMode('encrypt');
    processCipher();
  };

  const handleDecrypt = () => {
    setMode('decrypt');
    processCipher();
  };

  return (
    <PageContainer
      title="Playfair Şifri"
      description="Playfair şifri, mətnin iki hərfli cütlər şəklində şifrələndiyi və açar matrisindən istifadə edilən bir kriptoqrafik üsuldur."
    >
      <div className="mb-4">
        <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
          Açar
        </label>
        <input
          type="text"
          id="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Açar daxil edin"
        />
      </div>

      <CipherForm
        text={text}
        setText={setText}
        result={result}
        onEncrypt={handleEncrypt}
        onDecrypt={handleDecrypt}
      />
      
      {matrix.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Açar Matrisi</h3>
          <div className="inline-block border border-gray-300 rounded overflow-hidden">
            <table className="border-collapse">
              <tbody>
                {matrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 w-10 h-10 text-center">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default PlayfairCipher;
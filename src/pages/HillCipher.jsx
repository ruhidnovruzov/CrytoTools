import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import CipherForm from '../components/CipherForm';

const HillCipher = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [keyMatrix, setKeyMatrix] = useState([
    [2, 3],
    [1, 4]
  ]);
  const [matrixSize, setMatrixSize] = useState(2);

  // Azərbaycan əlifbası (English alphabet is used)
  const azLower = 'abcdefghijklmnopqrstuvwxyz';
  const azUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const m = azLower.length; // Əlifbanın uzunluğu (alphabet length = 26)
  
  // Matrisdəki element dəyişikliyi (Matrix element change handler)
  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...keyMatrix];
    newMatrix[row][col] = Number(value);
    setKeyMatrix(newMatrix);
  };

  // Matrix boyutunun dəyişdirilməsi (Matrix size change handler)
  const handleMatrixSizeChange = (newSize) => {
    newSize = parseInt(newSize, 10);
    if (newSize < 2) newSize = 2;
    if (newSize > 4) newSize = 4;

    setMatrixSize(newSize);
    
    // Yeni matris yaradılması (Create new matrix)
    const newMatrix = Array(newSize).fill().map(() => Array(newSize).fill(0));
    
    // Köhnə matris dəyərlərini kopyalama (Copy old matrix values)
    for (let i = 0; i < Math.min(keyMatrix.length, newSize); i++) {
      for (let j = 0; j < Math.min(keyMatrix[0].length, newSize); j++) {
        newMatrix[i][j] = keyMatrix[i][j];
      }
    }
    
    setKeyMatrix(newMatrix);
  };

  // Matris determinantının hesablanması (Calculate matrix determinant)
  const determinant = (matrix) => {
    if (matrix.length === 1) {
      return matrix[0][0];
    }
    
    if (matrix.length === 2) {
      return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]);
    }
    
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
      const subMatrix = matrix.slice(1).map(row => 
        row.filter((_, j) => j !== i)
      );
      
      det += Math.pow(-1, i) * matrix[0][i] * determinant(subMatrix);
    }
    
    return det;
  };

  // Matris minoru (Matrix minor/cofactor)
  const minor = (matrix, row, col) => {
    const subMatrix = matrix
      .filter((_, i) => i !== row)
      .map(row => row.filter((_, j) => j !== col));
    
    return determinant(subMatrix);
  };

  // Ədədin modular multiplikativ tərsini tapmaq (Find modular multiplicative inverse)
  const modInverse = (a, m) => {
    // Ensure a is positive
    a = ((a % m) + m) % m;
    
    // Extended Euclidean Algorithm
    let m0 = m, t, q;
    let x0 = 0, x1 = 1;

    if (m === 1) return 0;

    while (a > 1) {
      q = Math.floor(a / m);
      t = m;

      m = a % m;
      a = t;
      t = x0;

      x0 = x1 - q * x0;
      x1 = t;
    }

    if (x1 < 0) x1 += m0;

    return x1;
  };

  // Check if gcd is 1 (coprime)
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // Matrisin tərs matrisini tapma (Find the inverse matrix)
  const inverseMatrix = (matrix) => {
    const n = matrix.length;
    const detRaw = determinant(matrix);
    const det = ((detRaw % m) + m) % m;
    
    // Check if inverse exists (determinant must be coprime with m)
    if (gcd(det, m) !== 1) {
      return null;
    }
    
    const detInverse = modInverse(det, m);
    
    const adj = Array(n).fill().map(() => Array(n).fill(0));
    
    // Calculate cofactor matrix and then adjugate
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cofactor = Math.pow(-1, i + j) * minor(matrix, i, j);
        // Note: transpose during adjugate calculation (j,i instead of i,j)
        adj[j][i] = ((cofactor % m) + m) % m;
      }
    }

    // Multiply adjugate by inverse of determinant
    const inverse = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inverse[i][j] = (adj[i][j] * detInverse) % m;
        // Ensure positive values
        inverse[i][j] = ((inverse[i][j] % m) + m) % m;
      }
    }

    return inverse;
  };

  // Convert text to numeric vector
  const textToVector = (text, size) => {
    const vector = [];
    for (let i = 0; i < size; i++) {
      if (i < text.length) {
        const char = text[i];
        const index = azLower.indexOf(char.toLowerCase());
        vector.push(index);
      } else {
        vector.push(0); // Padding with 'a' (index 0)
      }
    }
    return vector;
  };

  // Hill şifri ilə şifrələmə (Hill cipher encryption)
  const encrypt = (text) => {
    // Yalnız əlifbada olan hərfləri saxla (Keep only letters in the alphabet)
    const filteredText = text.split('').filter(char => 
      azLower.includes(char.toLowerCase())
    ).join('');
    
    if (filteredText.length === 0) {
      return "";
    }
    
    // Mətn uzunluğu matris boyutuna bölünmədikdə doldurma (Pad text if needed)
    let paddedText = filteredText;
    while (paddedText.length % matrixSize !== 0) {
      paddedText += 'a';
    }
    
    let result = '';
    
    // Process text in blocks of size matrixSize
    for (let i = 0; i < paddedText.length; i += matrixSize) {
      const chunk = paddedText.substring(i, i + matrixSize);
      const vector = textToVector(chunk, matrixSize);
      
      // Matris vurma (Matrix multiplication)
      const resultVector = [];
      for (let j = 0; j < matrixSize; j++) {
        let sum = 0;
        for (let k = 0; k < matrixSize; k++) {
          sum += keyMatrix[j][k] * vector[k];
        }
        resultVector.push(((sum % m) + m) % m);
      }
      
      // İndeksləri hərflərə çevirmə (Convert indices back to letters)
      for (let j = 0; j < matrixSize; j++) {
        const isUpper = j < chunk.length && azUpper.includes(chunk[j]);
        const char = isUpper ? azUpper[resultVector[j]] : azLower[resultVector[j]];
        result += char;
      }
    }
    
    return result;
  };

  // Hill şifri ilə deşifrələmə (Hill cipher decryption)
  const decrypt = (text) => {
    // Yalnız əlifbada olan hərfləri saxla (Keep only letters in the alphabet)
    const filteredText = text.split('').filter(char => 
      azLower.includes(char.toLowerCase()) || azUpper.includes(char)
    ).join('');
    
    if (filteredText.length === 0) {
      return "";
    }
    
    // Matrisin tərs matrisini tapma (Find inverse matrix)
    const invMatrix = inverseMatrix(keyMatrix);
    
    if (!invMatrix) {
      return "Xəta: Matrisin tərs matrisi mövcud deyil. Lütfən başqa bir açar matrix seçin.";
    }
    
    // Mətn uzunluğu matris boyutuna bölünmədikdə doldurma (Pad text if needed)
    let paddedText = filteredText;
    while (paddedText.length % matrixSize !== 0) {
      paddedText += 'a';
    }
    
    let result = '';
    
    // Process text in blocks of size matrixSize
    for (let i = 0; i < paddedText.length; i += matrixSize) {
      const chunk = paddedText.substring(i, i + matrixSize);
      const vector = textToVector(chunk, matrixSize);
      
      // Matris vurma (tərs matris ilə) (Matrix multiplication with inverse matrix)
      const resultVector = [];
      for (let j = 0; j < matrixSize; j++) {
        let sum = 0;
        for (let k = 0; k < matrixSize; k++) {
          sum += invMatrix[j][k] * vector[k];
        }
        resultVector.push(((sum % m) + m) % m);
      }
      
      // İndeksləri hərflərə çevirmə (Convert indices back to letters)
      for (let j = 0; j < matrixSize; j++) {
        const isUpper = j < chunk.length && azUpper.includes(chunk[j]);
        const char = isUpper ? azUpper[resultVector[j]] : azLower[resultVector[j]];
        result += char;
      }
    }
    
    return result;
  };

  const handleEncrypt = () => {
    const encrypted = encrypt(text);
    setResult(encrypted);
  };

  const handleDecrypt = () => {
    const decrypted = decrypt(text);
    setResult(decrypted);
  };

  // Calculate the current determinant
  const currentDet = ((determinant(keyMatrix) % m) + m) % m;
  const isInvertible = gcd(currentDet, m) === 1;

  return (
    <PageContainer
      title="Hill Şifri"
      description="Hill şifri, matrislər üzərində əməliyyatlardan istifadə edən poliəlifba əvəzetmə şifridir. Şifrələmə/deşifrələmə üçün açar olaraq kvadrat matris istifadə olunur."
    >
      <div className="mb-4">
        <label htmlFor="matrixSize" className="block text-sm font-medium text-gray-700 mb-1">
          Matris Boyutu
        </label>
        <select
          id="matrixSize"
          value={matrixSize}
          onChange={(e) => handleMatrixSizeChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="2">2x2</option>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Açar Matris
        </label>
        <div className="grid grid-cols-4 gap-2">
          {keyMatrix.map((row, i) => (
            row.map((val, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                value={val}
                onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                className={`p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center ${j >= matrixSize || i >= matrixSize ? 'hidden' : ''}`}
                min="0"
                max="25"
              />
            ))
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Matrisin determinantı: {currentDet}
          {!isInvertible && (
            <p className="text-red-500 font-medium">
              Xəbərdarlıq: Bu matrisin tərs matrisi mövcud deyil. Deşifrələmə mümkün olmayacaq.
              (Determinant {currentDet} və {m} aralarında sadə ədəd olmalıdır)
            </p>
          )}
        </div>
      </div>

      <CipherForm
        text={text}
        setText={setText}
        result={result}
        onEncrypt={handleEncrypt}
        onDecrypt={handleDecrypt}
      />
    </PageContainer>
  );
};

export default HillCipher;
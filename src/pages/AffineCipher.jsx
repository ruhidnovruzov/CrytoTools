import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import CipherForm from '../components/CipherForm';

const AffineCipher = () => {
  const [text, setText] = useState('');
  const [a, setA] = useState(5);
  const [b, setB] = useState(8);
  const [result, setResult] = useState('');

  // Azərbaycan əlifbası
  const azLower = 'abcdefghijklmnopqrstuvwxyz';
  const azUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const m = azLower.length; // Əlifbanın uzunluğu

  // Ən böyük ortaq bölən (ƏBOB) tapma funksiyası
  const gcd = (a, b) => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  // Modular multiplikativ tərs tapma funksiyası
  const modInverse = (a, m) => {
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return 1; // Əgər tapılmazsa 1 qaytarırıq (default)
  };

  // Affin şifri ilə şifrələmə funksiyası
  const encrypt = (text) => {
    // a və m qarşılıqlı sadə (ortaq bölənləri 1) olmalıdır
    if (gcd(a, m) !== 1) {
      return `Xəta: 'a' (${a}) və əlifba uzunluğu (${m}) qarşılıqlı sadə deyil. Başqa 'a' dəyərini seçin.`;
    }

    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      
      // Kiçik hərf yoxlanışı
      let index = azLower.indexOf(char);
      if (index !== -1) {
        // Affin şifr düsturu: E(x) = (ax + b) mod m
        let newIndex = (a * index + b) % m;
        result += azLower[newIndex];
        continue;
      }
      
      // Böyük hərf yoxlanışı
      index = azUpper.indexOf(char);
      if (index !== -1) {
        let newIndex = (a * index + b) % m;
        result += azUpper[newIndex];
        continue;
      }
      
      // Əlifbada olmayan simvollar olduğu kimi qalır
      result += char;
    }
    
    return result;
  };

  // Affin şifri ilə deşifrələmə funksiyası
  const decrypt = (text) => {
    // a və m qarşılıqlı sadə (ortaq bölənləri 1) olmalıdır
    if (gcd(a, m) !== 1) {
      return `Xəta: 'a' (${a}) və əlifba uzunluğu (${m}) qarşılıqlı sadə deyil. Başqa 'a' dəyərini seçin.`;
    }

    let result = '';
    const aInverse = modInverse(a, m);
    
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      
      // Kiçik hərf yoxlanışı
      let index = azLower.indexOf(char);
      if (index !== -1) {
        // Affin şifr deşifrə düsturu: D(y) = a^(-1) * (y - b) mod m
        let newIndex = (aInverse * (index - b)) % m;
        // Mənfi indeks halında düzəliş
        if (newIndex < 0) newIndex += m;
        result += azLower[newIndex];
        continue;
      }
      
      // Böyük hərf yoxlanışı
      index = azUpper.indexOf(char);
      if (index !== -1) {
        let newIndex = (aInverse * (index - b)) % m;
        if (newIndex < 0) newIndex += m;
        result += azUpper[newIndex];
        continue;
      }
      
      // Əlifbada olmayan simvollar olduğu kimi qalır
      result += char;
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

  return (
    <PageContainer
      title="Affin Şifri"
      description="Affin şifri, E(x) = (ax + b) mod m düsturu ilə işləyən monoəlifba əvəzetmə şifridir, burada a və m qarşılıqlı sadə olmalıdır."
    >
      <CipherForm
        text={text}
        setText={setText}
        result={result}
        onEncrypt={handleEncrypt}
        onDecrypt={handleDecrypt}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="a" className="block text-sm font-medium text-gray-700 mb-1">
              a (əlifba ilə qarşılıqlı sadə olmalıdır)
            </label>
            <input
              type="number"
              id="a"
              value={a}
              onChange={(e) => setA(parseInt(e.target.value, 10))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
            {gcd(a, m) !== 1 && (
              <p className="text-red-500 text-sm mt-1">
                Xəta: 'a' ({a}) və əlifba uzunluğu ({m}) qarşılıqlı sadə deyil.
              </p>
            )}
          </div>
          <div>
            <label htmlFor="b" className="block text-sm font-medium text-gray-700 mb-1">
              b (sürüşmə)
            </label>
            <input
              type="number"
              id="b"
              value={b}
              onChange={(e) => setB(parseInt(e.target.value, 10))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
        </div>
      </CipherForm>
    </PageContainer>
  );
};

export default AffineCipher;
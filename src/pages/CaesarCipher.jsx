import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import CipherForm from '../components/CipherForm';

const CaesarCipher = () => {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(3);
  const [result, setResult] = useState('');

  // Sezar şifri ilə şifrələmə funksiyası
  const encrypt = (text, shift) => {
    let result = '';
    // Azərbaycan əlifbası - həm böyük, həm kiçik hərflər
    const azLower = 'abcdefghijklmnopqrstuvwxyz';
    const azUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      
      // Kiçik hərf yoxlanışı
      let index = azLower.indexOf(char);
      if (index !== -1) {
        // Hərfin yeni mövqeyini hesablayırıq və əlifba boyu dövrə vururuq
        let newIndex = (index + shift) % azLower.length;
        // Mənfi indeks halında düzəliş
        if (newIndex < 0) newIndex += azLower.length;
        result += azLower[newIndex];
        continue;
      }
      
      // Böyük hərf yoxlanışı
      index = azUpper.indexOf(char);
      if (index !== -1) {
        let newIndex = (index + shift) % azUpper.length;
        if (newIndex < 0) newIndex += azUpper.length;
        result += azUpper[newIndex];
        continue;
      }
      
      // Əlifbada olmayan simvollar olduğu kimi qalır
      result += char;
    }
    
    return result;
  };

  const handleEncrypt = () => {
    const encrypted = encrypt(text, shift);
    setResult(encrypted);
  };

  const handleDecrypt = () => {
    // Deşifrələmə üçün sadəcə sürüşmənin əksinə sürüşdürürük
    const decrypted = encrypt(text, -shift);
    setResult(decrypted);
  };

  return (
    <PageContainer
      title="Sezar Şifri"
      description="Sezar şifri sadə əvəzetmə şifridir və hər bir hərfi əlifbada müəyyən sayda irəli (şifrələmə) və ya geri (deşifrələmə) sürüşdürür."
    >
      <CipherForm
        text={text}
        setText={setText}
        result={result}
        onEncrypt={handleEncrypt}
        onDecrypt={handleDecrypt}
      >
        <div>
          <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-1">
            Sürüşmə (shift)
          </label>
          <input
            type="number"
            id="shift"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value, 10))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="1"
            max="31"
          />
        </div>
      </CipherForm>
    </PageContainer>
  );
};

export default CaesarCipher;
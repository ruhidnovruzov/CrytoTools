import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import CipherForm from '../components/CipherForm';

const VigenereCipher = () => {
  const [text, setText] = useState('');
  const [key, setKey] = useState('açar');
  const [result, setResult] = useState('');
  const [processedKey, setProcessedKey] = useState('');

  // Azərbaycan əlifbası
  const azLower = 'abcdefghijklmnopqrstuvwxyz';
  const azUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const m = azLower.length; // Əlifbanın uzunluğu

  // Açarın işlənməsi
  useEffect(() => {
    let processed = '';
    for (let i = 0; i < key.length; i++) {
      const char = key[i].toLowerCase();
      if (azLower.includes(char)) {
        processed += char;
      }
    }
    setProcessedKey(processed || 'açar'); // Əgər açar boşdursa default 'açar' olsun
  }, [key]);

  // Vijener şifri ilə şifrələmə
  const encrypt = (text) => {
    if (!processedKey) return text;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Kiçik hərf yoxlanışı
      let charIndex = azLower.indexOf(char.toLowerCase());
      
      if (charIndex === -1) {
        // Əlifbada yoxdursa olduğu kimi qalsın
        result += char;
        continue;
      }
      
      // Açar hərf indeksini tapırıq
      const keyChar = processedKey[keyIndex % processedKey.length];
      const keyCharIndex = azLower.indexOf(keyChar);
      
      // Şifrələmə: (mətn_indeksi + açar_indeksi) mod əlifba_uzunluğu
      const encryptedIndex = (charIndex + keyCharIndex) % m;
      
      // Orijinal hərfin böyük və ya kiçik olmasını qorumaq
      const isUpper = azUpper.includes(char);
      result += isUpper ? azUpper[encryptedIndex] : azLower[encryptedIndex];
      
      // Növbəti açar hərf indeksinə keçid
      keyIndex++;
    }
    
    return result;
  };

  // Vijener şifri ilə deşifrələmə
  const decrypt = (text) => {
    if (!processedKey) return text;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Kiçik hərf yoxlanışı
      let charIndex = azLower.indexOf(char.toLowerCase());
      
      if (charIndex === -1) {
        // Əlifbada yoxdursa olduğu kimi qalsın
        result += char;
        continue;
      }
      
      // Açar hərf indeksini tapırıq
      const keyChar = processedKey[keyIndex % processedKey.length];
      const keyCharIndex = azLower.indexOf(keyChar);
      
      // Deşifrələmə: (mətn_indeksi - açar_indeksi) mod əlifba_uzunluğu
      let decryptedIndex = (charIndex - keyCharIndex) % m;
      
      // Mənfi indeks halında düzəliş
      if (decryptedIndex < 0) decryptedIndex += m;
      
      // Orijinal hərfin böyük və ya kiçik olmasını qorumaq
      const isUpper = azUpper.includes(char);
      result += isUpper ? azUpper[decryptedIndex] : azLower[decryptedIndex];
      
      // Növbəti açar hərf indeksinə keçid
      keyIndex++;
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
      title="Vijener Şifri"
      description="Vijener şifri, hərf-hərf şifrələmə əvəzinə, fərqli açar hərflərindən istifadə edən poliəlifba əvəzetmə şifridir. Bu şifr Sezar şifrinin ümumiləşdirilmiş formasıdır."
    >
      <CipherForm
        text={text}
        setText={setText}
        result={result}
        onEncrypt={handleEncrypt}
        onDecrypt={handleDecrypt}
      >
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
            Açar
          </label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Şifrələmə açarını daxil edin"
          />
          <p className="mt-1 text-sm text-gray-500">
            İşlənmiş açar: {processedKey} (Yalnız Azərbaycan əlifbasındakı hərflər istifadə olunur)
          </p>
        </div>
      </CipherForm>
    </PageContainer>
  );
};

export default VigenereCipher;
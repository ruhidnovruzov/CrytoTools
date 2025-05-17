import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import CryptoJS from 'crypto-js';
const HashFunctions = () => {
  const [text, setText] = useState('');
  const [hashResults, setHashResults] = useState(null);

  // Sadə heş funksiyası (nümunə üçün)
  const simpleHash = (text) => {
    let hash = 0;
    if (text.length === 0) return hash;
    
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32-bit integer-ə çevirmək üçün
    }
    
    return Math.abs(hash).toString(16);
  };


  const sha256 = (text) => {
  return CryptoJS.SHA256(text).toString();
};

// MD5 funksiyası
const md5 = (text) => {
  return CryptoJS.MD5(text).toString();
};
  // CRC32 hesablama funksiyası (nümunə üçün sadələşdirilmiş)
  const crc32 = (text) => {
    const table = [];
    let c;
    
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c;
    }
    
    let crc = 0 ^ (-1);
    
    for (let i = 0; i < text.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ text.charCodeAt(i)) & 0xFF];
    }
    
    return ((crc ^ (-1)) >>> 0).toString(16);
  };

  // SHA-256 funksiyasını simulyasiya edir (əsl SHA-256 deyil)
  const simulateSHA256 = (text) => {
    // Gerçək SHA-256 hesablamaq üçün adətən crypto kitabxanasından istifadə olunur
    // Bu isə sadəcə nümunə üçün daha mürəkkəb bir heş simulyasiya edir
    const hash = [];
    const blockSize = 64;
    let result = '';
    
    // Mətni parçalara böl
    for (let i = 0; i < text.length; i += blockSize) {
      const block = text.slice(i, i + blockSize);
      let blockHash = 0;
      
      // Hər bloku emal et
      for (let j = 0; j < block.length; j++) {
        blockHash = ((blockHash << 5) - blockHash + block.charCodeAt(j)) & 0xFFFFFFFF;
      }
      
      // Blok həşini saxla
      hash.push(blockHash);
    }
    
    // Bütün blokları birləşdir
    for (let i = 0; i < hash.length; i++) {
      result += (hash[i] >>> 0).toString(16).padStart(8, '0');
    }
    
    // 64 simvola tamamla (əsl SHA-256 kimi)
    result = result.padEnd(64, '0');
    
    return result;
  };

  // MD5 funksiyasını simulyasiya edir (əsl MD5 deyil)
  const simulateMD5 = (text) => {
    // Gerçək MD5 hesablamaq üçün adətən crypto kitabxanasından istifadə olunur
    // Bu isə sadəcə nümunə üçün bir heş simulyasiya edir
    let hash = 0x67452301;
    
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) + hash) ^ char;
    }
    
    // 32 simvola tamamla (əsl MD5 kimi)
    return (hash >>> 0).toString(16).padStart(32, '0');
  };

const calculateHashes = () => {
  const results = {
    simpleHash: simpleHash(text),
    crc32: crc32(text),
    md5: md5(text), // Əsl MD5
    sha256: sha256(text) // Əsl SHA-256
  };

  setHashResults(results);
};

  return (
    <PageContainer
      title="Heş Funksiyaları"
      description="Heş funksiyaları, istənilən ölçüdə verilənləri müəyyən ölçülü bit sətrinə çevirən riyazi alqoritmlərdir. Onlar kriptoqrafiyada, verilənlərin tamlığını yoxlamaq və parolları saxlamaq üçün istifadə olunur."
    >
      <div className="mb-4">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          Mətn
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
          placeholder="Heş etmək üçün mətn daxil edin"
        />
      </div>
      
      <div className="mb-6">
        <button
          onClick={calculateHashes}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={!text.trim()}
        >
          Heş Hesabla
        </button>
      </div>
      
      {hashResults && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Heş Nəticələri</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Sadə Heş</h4>
              <div className="bg-white p-2 border border-gray-300 rounded-md break-all">
                {hashResults.simpleHash}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sadə bir heş funksiyası, mətnin əsas xüsusiyyətlərini tutmaq üçün istifadə olunur.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">CRC32</h4>
              <div className="bg-white p-2 border border-gray-300 rounded-md break-all">
                {hashResults.crc32}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                32-bitlik dövri artıqlıq yoxlaması, verilənlərin tamlığını yoxlamaq üçün istifadə olunur.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">MD5 (Simulyasiya)</h4>
              <div className="bg-white p-2 border border-gray-300 rounded-md break-all">
                {hashResults.md5}
              </div>
           
            </div>
            
            <div>
              <h4 className="font-medium mb-1">SHA-256 (Simulyasiya)</h4>
              <div className="bg-white p-2 border border-gray-300 rounded-md break-all">
                {hashResults.sha256}
              </div>
           
            </div>
          </div>
    
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-3">Heş Funksiyaları Haqqında</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Heş Funksiyalarının Xüsusiyyətləri:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Deterministikdir - eyni giriş həmişə eyni çıxışı verir</li>
              <li>Sürətlidir - heşin hesablanması effektiv olmalıdır</li>
              <li>Qarışdırıcıdır - kiçik giriş dəyişiklikləri tamamilə fərqli çıxış verir</li>
              <li>Birtərəflidir - heşdən əsas mətni bərpa etmək çətindir</li>
              <li>Toqquşma davamlıdır - eyni heş verən iki fərqli mətn tapmaq çətindir</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">İstifadə Sahələri:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Parol saxlama - istifadəçi parolları heşlənmiş formada saxlanılır</li>
              <li>Verilənlərin tamlığının yoxlanılması - faylın bütövlüyünü yoxlamaq üçün</li>
              <li>Rəqəmsal imzalar - sənədin orijinallığını təsdiqləmək üçün</li>
              <li>Blokçeyn texnologiyası - blokların əlaqələndirilməsi üçün</li>
              <li>Verilənlər bazasında indeksləmə - sürətli axtarış üçün</li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HashFunctions;
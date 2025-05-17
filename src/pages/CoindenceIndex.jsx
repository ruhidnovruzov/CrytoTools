import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';

const CoincidenceIndex = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [possibleKeyLengths, setPossibleKeyLengths] = useState([]);

  // Azərbaycan əlifbası
  const azLower = 'abcdefghijklmnopqrstuvwxyz';
  const azUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const calculateIC = (text) => {
    // Mətni təmizlə və böyük hərflərə çevir
    const cleanText = text.toUpperCase().replace(/[^A-ZÇƏĞIİÖŞÜ]/g, '');
    
    if (cleanText.length < 2) return 0;
    
    // Hər hərfin tezliyini hesabla
    const frequencies = {};
    
    // Əlifba üçün sıfır tezlik təyin et
    for (const char of azUpper) {
      frequencies[char] = 0;
    }
    
    // Hərfləri say
    for (const char of cleanText) {
      frequencies[char]++;
    }
    
    // Üst-üstə düşmə indeksini hesabla
    let sum = 0;
    for (const char in frequencies) {
      const frequency = frequencies[char];
      sum += frequency * (frequency - 1);
    }
    
    const n = cleanText.length;
    const ic = sum / (n * (n - 1));
    
    return ic;
  };

  const suggestKeyLengths = (text) => {
    // Vigenere şifri üçün mümkün açar uzunluqlarını təklif et
    const cleanText = text.toUpperCase().replace(/[^A-ZÇƏĞIİÖŞÜ]/g, '');
    
    if (cleanText.length < 20) {
      return "Analiz üçün daha uzun mətn lazımdır";
    }

    const maxKeyLength = Math.min(10, Math.floor(cleanText.length / 2));
    const results = [];

    // Fərqli açar uzunluqları üçün sınaq
    for (let keyLength = 2; keyLength <= maxKeyLength; keyLength++) {
      const columns = [];

      // Mətni sütunlara böl
      for (let i = 0; i < keyLength; i++) {
        columns[i] = '';
        for (let j = i; j < cleanText.length; j += keyLength) {
          columns[i] += cleanText[j];
        }
      }

      // Hər sütunun IC-ni hesabla
      let sumIC = 0;
      for (const column of columns) {
        sumIC += calculateIC(column);
      }

      // Orta IC hesabla
      const avgIC = sumIC / keyLength;
      
      results.push({
        keyLength,
        averageIC: avgIC
      });
    }

    // IC-yə görə sırala
    results.sort((a, b) => b.averageIC - a.averageIC);
    
    return results.slice(0, 5); // Ən yaxşı 5 nəticə
  };

  const analyze = () => {
    const ic = calculateIC(text);
    setResult(ic);
    
    const keyLengths = suggestKeyLengths(text);
    setPossibleKeyLengths(keyLengths);
  };

  return (
    <PageContainer
      title="Üst-üstə Düşmə İndeksi"
      description="Üst-üstə düşmə indeksi (Index of Coincidence), bir mətnin təsadüfi və ya bir şifrə ilə şifrələnmiş olduğunu müəyyən etmək üçün istifadə edilən statistik üsuldur."
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
          placeholder="Analiz etmək üçün mətn daxil edin"
        />
      </div>

      <div className="mb-6">
        <button
          onClick={analyze}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Analiz Et
        </button>
      </div>

      {result !== null && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Nəticə</h3>
          <p className="mb-2">Üst-üstə Düşmə İndeksi (IC): <span className="font-semibold">{result.toFixed(6)}</span></p>
          
          <div className="mt-3">
            <p className="font-medium">Təfsir:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>IC ≈ 0.06-0.07: Tək əlifba şifrələməsi (məs. Sezar şifri) və ya adi mətn</li>
              <li>IC ≈ 0.04-0.05: Poli-əlifba şifrələməsi (məs. Vigenere şifri)</li>
              <li>IC ≈ 0.038: Təsadüfi mətn</li>
            </ul>
          </div>
          
          {Array.isArray(possibleKeyLengths) && possibleKeyLengths.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Mümkün Açar Uzunluqları (Vigenere şifri üçün):</h3>
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Açar Uzunluğu</th>
                    <th className="text-left p-2">Orta IC</th>
                  </tr>
                </thead>
                <tbody>
                  {possibleKeyLengths.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-2">{item.keyLength}</td>
                      <td className="p-2">{item.averageIC.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">
                Daha yüksək IC dəyəri olan açar uzunluqları daha ehtimallıdır.
              </p>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default CoincidenceIndex;
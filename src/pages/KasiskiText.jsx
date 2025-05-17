import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';

const KasiskiTest = () => {
  const [text, setText] = useState('');
  const [gramLength, setGramLength] = useState(3);
  const [results, setResults] = useState(null);
  const [possibleKeyLengths, setPossibleKeyLengths] = useState([]);

  // Ən böyük ortaq bölən (ƏBOB) tapma funksiyası
  const gcd = (a, b) => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  // Bir massivdəki bütün ədədlərin ƏBOB-unu tapmaq
  const findGCD = (numbers) => {
    if (numbers.length === 0) return 0;
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result = gcd(result, numbers[i]);
    }
    return result;
  };

  // Bir massivdəki ədədlərin teztiklərini tapmaq
  const countFrequencies = (numbers) => {
    const freq = {};
    for (const num of numbers) {
      freq[num] = (freq[num] || 0) + 1;
    }
    return Object.entries(freq)
      .map(([number, count]) => ({ number: parseInt(number), count }))
      .sort((a, b) => b.count - a.count);
  };

  const analyzeText = () => {
    // Mətni təmizlə və böyük hərflərə çevir
    const cleanText = text.toUpperCase().replace(/[^A-ZÇƏĞIİÖŞÜ]/g, '');
    
    if (cleanText.length < gramLength * 2) {
      alert('Mətn daha uzun olmalıdır!');
      return;
    }
    
    // N-qramları tap (n hərfli qruplar)
    const ngrams = {};
    for (let i = 0; i <= cleanText.length - gramLength; i++) {
      const gram = cleanText.substring(i, i + gramLength);
      if (!ngrams[gram]) {
        ngrams[gram] = [];
      }
      ngrams[gram].push(i);
    }
    
    // Yalnız birdən çox dəfə rast gəlinən n-qramları saxla
    const repeatedNgrams = {};
    for (const gram in ngrams) {
      if (ngrams[gram].length > 1) {
        repeatedNgrams[gram] = ngrams[gram];
      }
    }
    
    // Nəticəni təşkil et
    const resultData = Object.entries(repeatedNgrams).map(([gram, positions]) => {
      // Ardıcıl mövqelər arasındakı məsafələri hesabla
      const distances = [];
      for (let i = 1; i < positions.length; i++) {
        distances.push(positions[i] - positions[i - 1]);
      }
      
      return {
        gram,
        positions,
        distances,
        count: positions.length
      };
    });
    
    // Nəticəni mövqelərin sayına görə çoxdan aza sırala
    resultData.sort((a, b) => b.count - a.count);
    
    setResults(resultData);
    
    // Mümkün açar uzunluqlarını analiz et
    if (resultData.length > 0) {
      // Bütün məsafələri topla
      const allDistances = [];
      resultData.forEach(item => {
        allDistances.push(...item.distances);
      });
      
      // Məsafələrin tezliyini hesabla
      const distanceFrequencies = countFrequencies(allDistances);
      
      // Ən çox rast gəlinən məsafələri və onların bölənlərini tap
      const factorsMap = {};
      distanceFrequencies.slice(0, 10).forEach(item => {
        const distance = item.number;
        
        // Məsafənin bölənlərini tap
        const factors = [];
        for (let i = 2; i <= Math.sqrt(distance); i++) {
          if (distance % i === 0) {
            factors.push(i);
            if (i !== distance / i) {
              factors.push(distance / i);
            }
          }
        }
        
        // Bölənləri əlavə et
        factors.forEach(factor => {
          factorsMap[factor] = (factorsMap[factor] || 0) + item.count;
        });
      });
      
      // Bölənləri tezliyinə görə sırala
      const factorFrequencies = Object.entries(factorsMap)
        .map(([factor, count]) => ({ factor: parseInt(factor), count }))
        .sort((a, b) => b.count - a.count);
      
      setPossibleKeyLengths(factorFrequencies.slice(0, 5));
    }
  };

  return (
    <PageContainer
      title="Kasiski Testi"
      description="Kasiski testi, eyni açar ilə şifrələnmiş mətnlərdə təkrarlanan hərfləri taparaq şifrənin açar uzunluğunu müəyyən etməyə kömək edən bir kriptoanaliz metodudur."
    >
      <div className="mb-4">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          Şifrələnmiş Mətn
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
          placeholder="Analiz etmək üçün şifrələnmiş mətn daxil edin"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="gramLength" className="block text-sm font-medium text-gray-700 mb-1">
          N-qram Uzunluğu
        </label>
        <input
          type="number"
          id="gramLength"
          value={gramLength}
          onChange={(e) => setGramLength(parseInt(e.target.value))}
          className="w-full sm:w-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          min="2"
          max="5"
        />
        <p className="text-sm text-gray-500 mt-1">
          Analiz etmək üçün təkrarlanan hərflərin uzunluğu (2-5 arası tövsiyə olunur)
        </p>
      </div>
      
      <div className="mb-6">
        <button
          onClick={analyzeText}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Analiz Et
        </button>
      </div>
      
      {possibleKeyLengths.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Mümkün Açar Uzunluqları</h3>
          <p className="mb-2 text-sm">
            Kasiski testi nəticələrinə əsasən, şifrə üçün ən ehtimallı açar uzunluqları:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Açar Uzunluğu</th>
                  <th className="text-left p-2">Tezlik</th>
                </tr>
              </thead>
              <tbody>
                {possibleKeyLengths.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-2 font-medium">{item.factor}</td>
                    <td className="p-2">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Daha yüksək tezliyə malik açar uzunluqları daha ehtimallıdır. Vigenere şifrəsinin açarı çox güman ki, yuxarıdakı uzunluqlardan biridir.
          </p>
        </div>
      )}
      
      {results && results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Təkrarlanan N-qramlar</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">N-qram</th>
                  <th className="text-left p-2">Təkrarlanma Sayı</th>
                  <th className="text-left p-2">Mövqelər</th>
                  <th className="text-left p-2">Məsafələr</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-2 font-medium">{item.gram}</td>
                    <td className="p-2">{item.count}</td>
                    <td className="p-2">{item.positions.join(', ')}</td>
                    <td className="p-2">{item.distances.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Yalnız ilk 10 nəticə göstərilir. Məsafələrin ən böyük ortaq böləni açar uzunluğunu göstərə bilər.
          </p>
        </div>
      )}
    </PageContainer>
  );
};

export default KasiskiTest;
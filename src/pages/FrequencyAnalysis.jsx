import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';

const FrequencyAnalysis = () => {
  const [text, setText] = useState('');
  const [frequencies, setFrequencies] = useState({});
  const [sortedFrequencies, setSortedFrequencies] = useState([]);
  const [totalChars, setTotalChars] = useState(0);

  // Azərbaycan əlifbası
  const azLower = 'abcdefghijklmnopqrstuvwxyz';
  const azUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Azərbaycan dilində hərflərin təxmini tezlikləri (nümunə)
  const azFrequencies = {
    'A': 9.17, 'B': 1.65, 'C': 0.31, 'Ç': 1.46, 'D': 3.24, 'E': 2.61, 'Ə': 8.41,
    'F': 0.09, 'G': 1.29, 'Ğ': 0.87, 'H': 1.28, 'X': 0.65, 'I': 2.14, 'İ': 7.43,
    'J': 0.04, 'K': 4.61, 'Q': 0.57, 'L': 3.21, 'M': 3.31, 'N': 5.42, 
    'O': 1.98, 'Ö': 0.76, 'P': 0.41, 'R': 3.91, 'S': 3.65, 'Ş': 1.87, 
    'T': 3.01, 'U': 1.31, 'Ü': 1.97, 'V': 0.98, 'Y': 2.57, 'Z': 0.62
  };

  useEffect(() => {
    if (text) {
      analyzeFrequency();
    }
  }, [text]);

  const analyzeFrequency = () => {
    // Mətni təmizlə və böyük hərflərə çevir
    const cleanText = text.toUpperCase().replace(/[^A-ZÇƏĞIİÖŞÜ]/g, '');
    setTotalChars(cleanText.length);
    
    if (cleanText.length === 0) {
      setFrequencies({});
      setSortedFrequencies([]);
      return;
    }
    
    // Hərflərin tezliyini hesabla
    const freq = {};
    
    // Əlifbadakı bütün hərflər üçün sıfır tezlik təyin et
    for (const char of azUpper) {
      freq[char] = 0;
    }
    
    // Hərfləri say
    for (const char of cleanText) {
      freq[char]++;
    }
    
    // Faizə çevir
    for (const char in freq) {
      freq[char] = (freq[char] / cleanText.length) * 100;
    }
    
    setFrequencies(freq);
    
    // Tezliyə görə sıralanmış massiv yarat
    const sortedArray = Object.keys(freq)
      .map(char => ({ char, frequency: freq[char] }))
      .sort((a, b) => b.frequency - a.frequency);
    
    setSortedFrequencies(sortedArray);
  };

  // Rəng generatoru
  const getBarColor = (frequency) => {
    const maxFreq = sortedFrequencies.length > 0 ? sortedFrequencies[0].frequency : 0;
    const intensity = Math.max(0, Math.min(255, Math.floor(255 * (frequency / maxFreq))));
    return `rgb(${255 - intensity}, ${150}, ${255 - intensity})`;
  };

  return (
    <PageContainer
      title="Tezlik Analizi"
      description="Tezlik analizi, şifrələnmiş mətnləri deşifrə etmək üçün istifadə olunan klassik kriptoanaliz üsuludur. Hərflərin və ya simvolların mətn içərisində nə qədər tez-tez göründüyünü araşdıraraq şifrəni açmağa kömək edir."
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

      {totalChars > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Tezlik Analizi Nəticələri</h3>
          <p className="mb-2">Cəmi təhlil edilən hərf sayı: <span className="font-medium">{totalChars}</span></p>
          
          <div className="overflow-x-auto">
            <div className="min-w-full h-64 relative mt-4">
              {sortedFrequencies.map((item, index) => (
                <div key={index} className="flex items-end h-full absolute" style={{left: `${index * (100 / azUpper.length)}%`, width: `${95 / azUpper.length}%`}}>
                  <div 
                    className="w-full rounded-t"
                    style={{
                      height: `${Math.max(1, item.frequency * 3)}%`,
                      backgroundColor: getBarColor(item.frequency)
                    }}
                  />
                  <div className="text-xs font-semibold -mb-5 w-full text-center">{item.char}</div>
                  <div className="text-xs -mb-10 w-full text-center">{item.frequency.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-semibold mb-3">Azərbaycan dili ilə müqayisə</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.keys(azFrequencies).sort().map((char) => {
                const actualFreq = frequencies[char] || 0;
                const expectedFreq = azFrequencies[char];
                const diff = actualFreq - expectedFreq;
                
                return (
                  <div key={char} className="p-2 border rounded-md bg-white">
                    <div className="text-center text-lg font-bold">{char}</div>
                    <div className="text-sm">
                      <div>Mətn: {actualFreq.toFixed(2)}%</div>
                      <div>Gözlənilən: {expectedFreq.toFixed(2)}%</div>
                      <div className={diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : ''}>
                        Fərq: {diff.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Tezliklərdəki böyük fərqlər, mətnin şifrələnmiş olduğunu və ya dil xüsusiyyətlərini əks etdirməyə bilər.
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Tezlik cədvəli</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Hərf</th>
                    <th className="p-2 text-left">Say</th>
                    <th className="p-2 text-left">Tezlik (%)</th>
                    <th className="p-2 text-left">Gözlənilən (%)</th>
                    <th className="p-2 text-left">Fərq</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFrequencies.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-2 font-medium">{item.char}</td>
                      <td className="p-2">{Math.round(item.frequency * totalChars / 100)}</td>
                      <td className="p-2">{item.frequency.toFixed(2)}%</td>
                      <td className="p-2">{(azFrequencies[item.char] || 0).toFixed(2)}%</td>
                      <td className="p-2">
                        <span className={
                          item.frequency > (azFrequencies[item.char] || 0) ? 'text-green-600' : 
                          item.frequency < (azFrequencies[item.char] || 0) ? 'text-red-600' : ''
                        }>
                          {(item.frequency - (azFrequencies[item.char] || 0)).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default FrequencyAnalysis;
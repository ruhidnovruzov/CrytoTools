import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CaesarCipher from "./pages/CaesarCipher";
import AffineCipher from "./pages/AffineCipher";
import HillCipher from "./pages/HillCipher";
import VigenereCipher from "./pages/VigenereCipher";
import PlayfairCipher from "./pages/PlayfairCipher";
import CoincidenceIndex from "./pages/CoindenceIndex";
import FrequencyAnalysis from "./pages/FrequencyAnalysis";
import KasiskiTest from "./pages/KasiskiText";
import HashFunctions from "./pages/HashFunctions";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<CaesarCipher />} />
            <Route path="/caesar" element={<CaesarCipher />} />
            <Route path="/affine" element={<AffineCipher />} />
            <Route path="/hill" element={<HillCipher />} />
            <Route path="/vigenere" element={<VigenereCipher />} />
            <Route path="/playfair" element={<PlayfairCipher />} />
            <Route path="/coincidence-index" element={<CoincidenceIndex />} />
            <Route path="/frequency-analysis" element={<FrequencyAnalysis />} />
            <Route path="/kasiski-test" element={<KasiskiTest />} />
            <Route path="/hash-functions" element={<HashFunctions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

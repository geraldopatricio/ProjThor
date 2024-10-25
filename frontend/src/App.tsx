import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

interface Hierarchy {
  [key: string]: any;
}

const App: React.FC = () => {
  const [hierarchy, setHierarchy] = useState<Hierarchy>({});
  const [levels, setLevels] = useState(0);
  const [error, setError] = useState('');
  const [word, setWord] = useState('');
  const [level, setLevel] = useState('');

  const handleLevelsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevels(parseInt(e.target.value, 10));
  };

  const handleSaveLevels = () => {
    if (levels > 5) {
      setError('O número máximo de níveis é 5.');
    } else {
      setError('');
    }
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(e.target.value);
  };

  const handleSaveWord = () => {
    if (!word || !level) return;

    // Adicionar palavra na hierarquia
    const updatedHierarchy = { ...hierarchy };
    if (level.includes('.')) {
      const parts = level.split('.');
      let current = updatedHierarchy;
      parts.forEach((part, index) => {
        if (!current[part]) current[part] = index === parts.length - 1 ? {} : {};
        current = current[part];
      });
      current[word] = {};
    } else {
      updatedHierarchy[word] = {};
    }

    setHierarchy(updatedHierarchy);
    setWord('');
    setLevel('');
  };

  const handleSaveJson = () => {
    // Enviar o JSON para o backend
    fetch('http://localhost:4000/save-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hierarchy),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        }
      });
  };

  const handleDownloadJson = () => {
    fetch('http://localhost:4000/download-json')
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Error downloading JSON');
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tree.json');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="app-container">
      <div className="input-container">
        <label>Quantos níveis de Hierarquia deseja?</label>
        <input type="number" value={levels} onChange={handleLevelsChange} /><br></br>
        <button className="primary-button" onClick={handleSaveLevels}>Gravar</button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {levels > 0 && levels <= 5 && (
        <>
          <div className="input-container">
            <label>Palavra: </label>
            <input type="text" value={word} onChange={handleWordChange} />
            <label>Nível: </label>
            <input type="text" value={level} onChange={handleLevelChange} />
            <button className="primary-button" onClick={handleSaveWord}>Salvar</button>
          </div>
          <div className="json-output-container">
            <pre>{JSON.stringify(hierarchy, null, 2)}</pre>
          </div>
        </>
      )}

      <button className="secondary-button" onClick={handleSaveJson}>Salvar</button> <br></br>
      <button className="secondary-button" onClick={handleDownloadJson}>Baixar JSON</button>
    </div>
  );
};

export default App;

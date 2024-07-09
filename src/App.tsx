// src/App.tsx
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { StructureViewer } from './components/StructureViewer';
import { fetchStructure } from './utils/fetchStructure';
import { PdbSearch } from "./components/pdbsearch/PdbSearch";

const App = () => {
  const [pdbData, setPdbData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: string) => {
    if (input?.trim() === '' || input === undefined) {
      setPdbData(null);
      return;
    }
    try {
      setError(null);
      const data = await fetchStructure(input.trim());
      setPdbData(data);
    } catch (err) {
      setError('Error fetching structure. Please try again.');
      setPdbData(null);
      console.error(err);
    }
  };
  const searchBarProps = { // make sure all required component's inputs/Props keys&types match
    onChange: handleSubmit
  }

  // @ts-ignore
  return (
      <div className="App">
        <h1>Protein Structure Viewer</h1>
        <PdbSearch {...searchBarProps} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
       {pdbData && <StructureViewer pdbData={pdbData} />}
      </div>
  );
};

export default App;

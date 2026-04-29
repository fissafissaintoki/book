import { useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { generateResult, type OperatorResult } from './lib/operatorEngine';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<OperatorResult | null>(null);

  const handleGenerate = () => {
    setResult(generateResult(input));
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
  };

  const handleCopyPrompt = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.masterPrompt);
  };

  return (
    <main className="min-h-screen bg-graphite text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-8">
        <Header />
        <InputPanel value={input} onChange={setInput} onGenerate={handleGenerate} onReset={handleReset} />
        {result && <OutputPanel result={result} onCopyPrompt={handleCopyPrompt} />}
      </div>
    </main>
  );
}

export default App;

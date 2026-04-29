import type { OperatorResult } from '../lib/operatorEngine';
import ModeBadge from './ModeBadge';
import ResultCard from './ResultCard';

interface OutputPanelProps {
  result: OperatorResult;
  onCopyPrompt: () => void;
}

const OutputPanel = ({ result, onCopyPrompt }: OutputPanelProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <ModeBadge mode={result.mode} />
        <button
          onClick={onCopyPrompt}
          className="rounded-lg border border-cyanPulse/50 px-4 py-2 text-cyanPulse hover:bg-cyanPulse/10 transition"
        >
          Masterprompt kopieren
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultCard title="1. Kernproblem" content={result.coreProblem} />
        <ResultCard title="2. Problemklasse" content={result.problemClass} />
        <ResultCard title="3. Gewählter Modus" content={result.mode} />
        <ResultCard title="4. Prompt-Use-Case" content={result.useCase} />
        <ResultCard title="5. Generierter Masterprompt" content={result.masterPrompt} />
        <ResultCard title="6. Artefakt-Vorschlag" content={result.artifact} />
        <ResultCard title="7. Nächster Schritt" content={result.nextStep} />
      </div>
    </section>
  );
};

export default OutputPanel;

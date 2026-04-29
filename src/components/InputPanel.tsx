interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onReset: () => void;
}

const InputPanel = ({ value, onChange, onGenerate, onReset }: InputPanelProps) => {
  return (
    <section className="space-y-4">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rohinput eingeben … Gedanke, Problem, Prozess, Bewerbung, Use Case, Chaos."
        className="w-full min-h-44 rounded-xl border border-steel/50 bg-zinc-950/80 p-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-electric"
      />
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onGenerate}
          className="rounded-lg bg-gradient-to-r from-cyanPulse to-electric px-5 py-3 font-semibold text-slate-950 hover:brightness-110 transition"
        >
          Operator-Modus starten
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-zinc-500/70 px-4 py-3 text-zinc-200 hover:border-cyanPulse hover:text-cyanPulse transition"
        >
          Reset
        </button>
      </div>
    </section>
  );
};

export default InputPanel;

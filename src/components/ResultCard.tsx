interface ResultCardProps {
  title: string;
  content: string;
}

const ResultCard = ({ title, content }: ResultCardProps) => {
  return (
    <article className="rounded-xl border border-steel/40 bg-metallic p-4 shadow-panel backdrop-blur-sm">
      <h3 className="text-sm uppercase tracking-widest text-cyanPulse mb-2">{title}</h3>
      <p className="text-zinc-100 leading-relaxed whitespace-pre-wrap">{content}</p>
    </article>
  );
};

export default ResultCard;

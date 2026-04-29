interface ModeBadgeProps {
  mode: string;
}

const ModeBadge = ({ mode }: ModeBadgeProps) => (
  <span className="inline-flex items-center rounded-full border border-cyanPulse/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyanPulse bg-cyanPulse/10">
    {mode}
  </span>
);

export default ModeBadge;

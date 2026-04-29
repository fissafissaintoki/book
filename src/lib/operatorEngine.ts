export type ProblemClass =
  | 'Positionierung'
  | 'Prozessproblem'
  | 'Governanceproblem'
  | 'Systembauproblem'
  | 'Reflexionsproblem'
  | 'Unklarer Rohinput';

export interface OperatorResult {
  coreProblem: string;
  problemClass: ProblemClass;
  mode: string;
  useCase: string;
  masterPrompt: string;
  artifact: string;
  nextStep: string;
}

const buckets = {
  positioning: ['bewerbung', 'job', 'profil', 'linkedin'],
  process: ['prozess', 'lager', 'wareneingang', 'sap', 'logistik'],
  governance: ['prüfen', 'risiko', 'dsgvo', 'datenschutz', 'governance'],
  system: ['prompt', 'masterprompt', 'ki-system', 'modus'],
  reflection: ['unklar', 'ich weiß nicht', 'muster', 'zukunft', 'erfahrung'],
};

const normalize = (input: string): string => input.toLowerCase();

const hasAny = (input: string, terms: string[]): boolean =>
  terms.some((term) => input.includes(term));

export const detectProblemClass = (input: string): ProblemClass => {
  const text = normalize(input);
  if (hasAny(text, buckets.positioning)) return 'Positionierung';
  if (hasAny(text, buckets.process)) return 'Prozessproblem';
  if (hasAny(text, buckets.governance)) return 'Governanceproblem';
  if (hasAny(text, buckets.system)) return 'Systembauproblem';
  if (hasAny(text, buckets.reflection)) return 'Reflexionsproblem';
  return 'Unklarer Rohinput';
};

export const detectMode = (input: string): string => {
  const problemClass = detectProblemClass(input);
  const map: Record<ProblemClass, string> = {
    Positionierung: 'POSITIONING + BUILD',
    Prozessproblem: 'OPS + ARCHITECT',
    Governanceproblem: 'GOVERNANCE + AUDIT',
    Systembauproblem: 'SYSTEM + BUILD',
    Reflexionsproblem: 'META + POSITIONING',
    'Unklarer Rohinput': 'META + BRIEFING',
  };
  return map[problemClass];
};

export const detectArtifact = (input: string): string => {
  const problemClass = detectProblemClass(input);
  const map: Record<ProblemClass, string> = {
    Positionierung: 'Bewerbungsbaustein / Profiltext / Dossier',
    Prozessproblem: 'Prozessmodell / SOP / Use Case',
    Governanceproblem: 'Risikoanalyse / Governance-Check',
    Systembauproblem: 'Masterprompt / Prompt-Modul',
    Reflexionsproblem: 'Reflexionsmatrix / Zukunfts-Ich / Erfahrungsmodell',
    'Unklarer Rohinput': 'Klärungsstruktur',
  };
  return map[problemClass];
};

export const generateMasterPrompt = (input: string, classification: ProblemClass): string => `Arbeite im Operator-Fischer-Modus.

Rohinput:
${input}

Analysiere zuerst, was hier wirklich vorliegt.
Bestimme das Kernproblem.
Ordne den Input einer Problemklasse zu (${classification}).
Wähle den passenden Modus.
Baue daraus ein konkretes Artefakt.
Prüfe Nutzen, Risiken und Wiederverwendbarkeit.
Gib am Ende den nächsten sinnvollen Schritt aus.

Antwortformat:
1. Kernproblem
2. Problemklasse
3. Modus
4. Struktur
5. Artefakt
6. Qualitätscheck
7. Nächster Schritt`;

const createCoreProblem = (input: string, problemClass: ProblemClass): string => {
  if (!input.trim()) return 'Kein Rohinput vorhanden.';
  const slice = input.trim().slice(0, 140);
  return `Im Rohinput zeigt sich ein ${problemClass.toLowerCase()} mit Fokus auf: "${slice}${input.length > 140 ? '…' : ''}"`;
};

const createUseCase = (problemClass: ProblemClass): string => {
  const map: Record<ProblemClass, string> = {
    Positionierung: 'Profil schärfen und überzeugende Außenwirkung für Job-/Karriereziel erzeugen.',
    Prozessproblem: 'Operativen Ablauf modellieren, Engpässe sichtbar machen und SOP-fähig strukturieren.',
    Governanceproblem: 'Risiken und Compliance-Lücken bewerten und absichernde Maßnahmen definieren.',
    Systembauproblem: 'Wiederverwendbares Prompt-System als modulare Arbeitsstruktur bauen.',
    Reflexionsproblem: 'Unklare Lage in Muster, Hypothesen und Entscheidungspfade übersetzen.',
    'Unklarer Rohinput': 'Rohgedanken in klaren Briefing-Rahmen und konkrete Arbeitsfragen überführen.',
  };
  return map[problemClass];
};

const createNextStep = (problemClass: ProblemClass): string => {
  const map: Record<ProblemClass, string> = {
    Positionierung: 'Nächster Schritt: 3 Zielrollen definieren und den Profiltext pro Rolle zuschneiden.',
    Prozessproblem: 'Nächster Schritt: Ist-Prozess in 6–8 Schritten erfassen und Engpass markieren.',
    Governanceproblem: 'Nächster Schritt: Top-3 Risiken priorisieren und je Risiko eine Gegenmaßnahme festlegen.',
    Systembauproblem: 'Nächster Schritt: Prompt in Module teilen (Ziel, Daten, Prüfregeln, Ausgabeformat).',
    Reflexionsproblem: 'Nächster Schritt: 5 Muster aus der Erfahrung notieren und eine Zukunftshypothese wählen.',
    'Unklarer Rohinput': 'Nächster Schritt: Ziel, Kontext und Erfolgskriterium in je einem Satz formulieren.',
  };
  return map[problemClass];
};

export const generateResult = (input: string): OperatorResult => {
  const problemClass = detectProblemClass(input);
  const mode = detectMode(input);
  return {
    coreProblem: createCoreProblem(input, problemClass),
    problemClass,
    mode,
    useCase: createUseCase(problemClass),
    masterPrompt: generateMasterPrompt(input, problemClass),
    artifact: detectArtifact(input),
    nextStep: createNextStep(problemClass),
  };
};

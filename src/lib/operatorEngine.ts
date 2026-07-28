export type ProblemClass =
  | 'Positionierung'
  | 'Prozessproblem'
  | 'Governanceproblem'
  | 'Systembauproblem'
  | 'Produktionsplanung'
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
  productionPlan?: string;
  assetSchema?: string;
  reviewGate?: string;
}

const buckets = {
  positioning: ['bewerbung', 'job', 'profil', 'linkedin'],
  process: ['prozess', 'lager', 'wareneingang', 'sap', 'logistik'],
  governance: ['prüfen', 'risiko', 'dsgvo', 'datenschutz', 'governance'],
  production: [
    'asset',
    'assets',
    'assetschema',
    'dateilogik',
    'layoutanforderung',
    'layoutanforderungen',
    'mappe',
    'produktionsplan',
    'referenz',
    'seitenprompt',
    'seitenprompts',
    'seite für seite',
    'struktur',
  ],
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
  if (hasAny(text, buckets.production)) return 'Produktionsplanung';
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
    Produktionsplanung: 'PRODUCTION + PAGE-GATE',
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
    Produktionsplanung: 'Technischer Produktionsplan / Assetschema / Seitenprompt-Briefing',
    Reflexionsproblem: 'Reflexionsmatrix / Zukunfts-Ich / Erfahrungsmodell',
    'Unklarer Rohinput': 'Klärungsstruktur',
  };
  return map[problemClass];
};

const productionPlan = `1. Referenzprüfung: Stil, Zielmedium, Format, Bildsprache, Textdichte und No-Go-Liste erfassen.
2. Strukturprüfung: Mappe in Kapitel, Seitenrollen, Pflichtinhalte und Review-Reihenfolge zerlegen.
3. Dateilogik: eindeutige IDs, Versionen, Seitenstatus und Asset-Abhängigkeiten definieren.
4. Layoutanforderung: Raster, Safe Area, Typografie, Farbwerte, Bildplätze und Exportformat festlegen.
5. Prompt-Handoff: Claude erhält pro Seite nur Referenz, Ziel, Assets, Layoutregeln und Abnahmekriterien.
6. Page-Gate: Immer genau eine Seite generieren, prüfen, freigeben und erst danach die nächste Seite starten.`;

const assetSchema = `project/
  references/          # Moodboards, Beispielseiten, Marken-/Stilreferenzen
  source/              # Rohtexte, Notizen, geprüfte Inhalte
  assets/
    images/            # Bildquellen mit Rechte-/Statusnotiz
    icons/             # SVG/PNG-Icons nach Namenskonvention
    typography/        # Fonts oder Font-Entscheidungen
  pages/
    00_cover/          # page_brief.md, prompt.md, review.md, exports/
    01_[slug]/         # eine Mappe-Seite pro Ordner
  reviews/
    mappe_review.md    # Konsistenz-, Layout- und Vollständigkeitsprüfung
  exports/             # finale PDF/PNG/SVG-Dateien`;

const reviewGate = `Review vor jeder Seitengenerierung:
- Referenz passt zur Seitenrolle.
- Benötigte Assets sind vorhanden oder als Platzhalter markiert.
- Dateiname folgt: page_[nn]_[slug]_[version].[ext].
- Layoutregeln sind konkret genug für einen einzelnen Seitenprompt.
- Output erzeugt nur die aktuelle Seite, keine Folge- oder Sammelproduktion.`;

const createProductionAddOns = (problemClass: ProblemClass) => {
  if (problemClass !== 'Produktionsplanung') return {};
  return {
    productionPlan,
    assetSchema,
    reviewGate,
  };
};

export const generateMasterPrompt = (input: string, classification: ProblemClass): string => {
  const basePrompt = `Arbeite im Operator-Fischer-Modus.

Rohinput:
${input}

Analysiere zuerst, was hier wirklich vorliegt.
Bestimme das Kernproblem.
Ordne den Input einer Problemklasse zu (${classification}).
Wähle den passenden Modus.
Baue daraus ein konkretes Artefakt.
Prüfe Nutzen, Risiken und Wiederverwendbarkeit.
Gib am Ende den nächsten sinnvollen Schritt aus.`;

  if (classification === 'Produktionsplanung') {
    return `${basePrompt}

Spezialauftrag Produktionsplanung:
- Prüfe Referenz, Struktur, Dateilogik und Layoutanforderung.
- Erstelle zuerst technischen Produktionsplan und Assetschema.
- Übergib danach ein enges Briefing für konsistente Claude-Seitenprompts und Mappe-Review.
- Generiere niemals die ganze Mappe auf einmal; arbeite Seite für Seite mit Review-Gate.

Antwortformat:
1. Kernproblem
2. Produktionsmodus
3. Technischer Produktionsplan
4. Assetschema
5. Claude-Handoff für Seitenprompts
6. Mappe-Review-Kriterien
7. Nächste einzelne Seite`;
  }

  return `${basePrompt}

Antwortformat:
1. Kernproblem
2. Problemklasse
3. Modus
4. Struktur
5. Artefakt
6. Qualitätscheck
7. Nächster Schritt`;
};

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
    Produktionsplanung: 'Eine Mappe kontrolliert vorbereiten, Seitenprompts konsistent halten und Generierung seitenweise absichern.',
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
    Produktionsplanung: 'Nächster Schritt: Seitenliste mit Nummer, Rolle, Pflichtassets und Review-Status anlegen; danach nur Seite 01 briefen.',
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
    ...createProductionAddOns(problemClass),
  };
};

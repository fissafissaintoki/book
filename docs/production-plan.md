# Technischer Produktionsplan / Assetschema

## 1. Produktionsziel

Dieser Plan übersetzt den Operator-Fischer-Ablauf in eine kontrollierte Produktionslogik für konsistente Seiten, Prompts und Mappen-Reviews.

Die Leitlinie lautet:

1. **Codex prüft Referenz, Struktur, Dateilogik und Layoutanforderung.**
2. **Codex erstellt Produktionsplan und Assetschema.**
3. **Claude baut daraus konsistente Seitenprompts und Mappe-Review.**
4. **Die Produktion läuft Seite für Seite, nicht als Komplettgenerierung.**

Ziel ist eine wiederholbare Mappe, bei der jede Seite einzeln geplant, erzeugt, geprüft und erst danach in die Gesamtstruktur übernommen wird.

## 2. Rollenmodell

| Rolle | Verantwortung | Output |
| --- | --- | --- |
| Operator Fischer | Entscheidet Ziel, Priorität, Freigabe und finale Richtung. | Freigabe, Änderungsauftrag, Abnahmekriterium |
| Codex | Prüft technische Struktur, Dateilogik, Layoutanforderung und Assetkonsistenz. | Produktionsplan, Assetschema, Prüfprotokoll |
| Claude | Formuliert konsistente Seitenprompts, Review-Fragen und Mappe-Zusammenfassung. | Seitenprompt, Review-Notizen, Konsistenzcheck |
| Generator | Erzeugt die Seite oder das visuelle/inhaltliche Artefakt nach Prompt. | Einzelne Seite, Varianten, Exportdateien |

## 3. Referenzprüfung durch Codex

Vor jeder Seitenproduktion prüft Codex die folgenden Bereiche:

### 3.1 Referenz

- Welche Zielmappe, Marke, Tonalität oder visuelle Referenz gilt?
- Welche Seiten sind bereits vorhanden?
- Welche Elemente müssen zwingend wiederkehren?
- Welche Elemente dürfen pro Seite variieren?

### 3.2 Struktur

- Gibt es eine definierte Seitenreihenfolge?
- Hat jede Seite eine eindeutige Funktion?
- Gibt es ein Inhaltsraster mit Titel, Kernbotschaft, Beleg und Call-to-Action?
- Sind Kapitel, Trenner, Inhaltsseiten und Abschlussseiten getrennt definiert?

### 3.3 Dateilogik

- Sind Seitennummern eindeutig und sortierbar?
- Sind Rohdaten, Prompts, generierte Seiten und Reviews getrennt abgelegt?
- Sind Dateinamen sprechend und revisionsfähig?
- Ist klar, welche Datei Quelle, Zwischenergebnis oder finaler Export ist?

### 3.4 Layoutanforderung

- Welches Format gilt: Hochformat, Querformat, quadratisch oder Webansicht?
- Welche Safe-Zones, Ränder, Raster und Textlimits gelten?
- Welche Farb-, Typografie- und Bildregeln gelten?
- Welche Exportauflösung und Dateitypen werden benötigt?

## 4. Empfohlene Ordnerstruktur

```text
production/
  00_reference/
    brand-notes.md
    layout-rules.md
    source-material.md
  01_plan/
    production-plan.md
    page-map.yml
    asset-schema.yml
  02_prompts/
    page-001.md
    page-002.md
  03_pages/
    page-001/
      input.md
      prompt.md
      review.md
      variants/
      final/
    page-002/
      input.md
      prompt.md
      review.md
      variants/
      final/
  04_reviews/
    mappe-review.md
    consistency-log.md
  05_exports/
    draft/
    final/
```

Die bestehende App-Struktur bleibt davon getrennt. Produktionsartefakte liegen bewusst unter `production/`, während React-Code unter `src/` und Agenten-Definitionen unter `agents/` bleiben.

## 5. Assetschema

### 5.1 `page-map.yml`

```yaml
mappe:
  id: operator-fischer-mappe
  title: Operator Fischer Produktionsmappe
  version: 1
  format: A4-portrait
  language: de
pages:
  - page_id: page-001
    number: 1
    type: cover
    title: Titel / Einstieg
    objective: Positionierung klar und stark eröffnen.
    status: planned
    dependencies: []
  - page_id: page-002
    number: 2
    type: concept
    title: Kernthese
    objective: Strategische These visuell und textlich erklären.
    status: planned
    dependencies:
      - page-001
```

### 5.2 `asset-schema.yml`

```yaml
asset:
  asset_id: page-001-hero-visual
  page_id: page-001
  category: image
  role: hero
  source: generated
  prompt_file: production/02_prompts/page-001.md
  output_path: production/03_pages/page-001/final/page-001.png
  review_status: pending
  required_checks:
    - layout_safe_zone
    - text_legibility
    - brand_consistency
    - no_unapproved_elements
```

### 5.3 Seitenakte pro Seite

Jede Seite bekommt eine eigene Akte:

```text
production/03_pages/page-001/
  input.md      # Rohbriefing, Ziel, Pflichtinhalte
  prompt.md     # Claude-Seitenprompt
  review.md     # Codex/Claude Review und Operator-Freigabe
  variants/     # Zwischenvarianten
  final/        # Freigegebene Datei(en)
```

## 6. Seitenprompt-Struktur für Claude

Claude soll pro Seite immer dasselbe Promptgerüst verwenden:

```text
# Page Prompt: {page_id}

## Ziel der Seite
{objective}

## Kontext aus der Mappe
{previous_pages_summary}

## Pflichtinhalte
{required_content}

## Layoutregeln
{layout_rules}

## Assetvorgaben
{asset_schema_excerpt}

## Tonalität
{voice_and_style}

## Negativregeln
{what_to_avoid}

## Ausgabeformat
- Seitenprompt für Generator
- Review-Checkliste
- Risiko- und Konsistenzhinweise
```

## 7. Page-by-Page Workflow

Jede Seite läuft durch dieselbe Schleife:

1. **Seitenbriefing erstellen:** Ziel, Pflichtinhalt, Layouttyp und Abhängigkeiten definieren.
2. **Codex-Strukturcheck:** Dateilogik, Schema, Reihenfolge und technische Anforderungen prüfen.
3. **Claude-Seitenprompt:** Nur für diese eine Seite einen konsistenten Prompt erstellen.
4. **Einzelseite generieren:** Keine Sammelgenerierung der gesamten Mappe.
5. **Review:** Layout, Inhalt, Konsistenz, Dateipfade und Anschluss an vorherige Seite prüfen.
6. **Freigabe oder Revision:** Operator entscheidet, ob die Seite finalisiert oder neu gebaut wird.
7. **Mappe-Log aktualisieren:** Status, offene Risiken und nächste Seite dokumentieren.

## 8. Qualitätskriterien

Eine Seite gilt erst als produktionsreif, wenn folgende Kriterien erfüllt sind:

- Der Zweck der Seite ist in einem Satz erklärbar.
- Die Seite passt zur vorherigen und nächsten geplanten Seite.
- Layoutregeln, Textlimits und Safe-Zones sind eingehalten.
- Alle Assets sind eindeutig benannt und einer Seite zugeordnet.
- Der Review enthält Entscheidung, Risiko und nächste Aktion.
- Keine Seite wurde ohne isolierten Prompt und Review in die Mappe übernommen.

## 9. Statusmodell

```text
planned -> prompted -> generated -> reviewed -> approved -> exported
                          └──────-> revision_requested
```

Jeder Statuswechsel wird in `production/04_reviews/consistency-log.md` dokumentiert.

## 10. Nächster Produktionsschritt

Als nächstes sollte nur **Seite 1** vorbereitet werden:

1. `production/01_plan/page-map.yml` mit `page-001` anlegen.
2. `production/03_pages/page-001/input.md` mit Ziel, Pflichtinhalt und Layouttyp füllen.
3. Claude erstellt daraus `production/03_pages/page-001/prompt.md`.
4. Erst danach wird Seite 1 generiert und reviewed.

Keine weiteren Seiten werden generiert, bevor Seite 1 reviewed und freigegeben ist.

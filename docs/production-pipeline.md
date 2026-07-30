# Operator-Fischer Produktionspipeline für Mappen

Diese Pipeline verhindert, dass eine Mappe ungeprüft als Sammeloutput entsteht. Codex übernimmt zuerst die technische Vorarbeit; Claude bekommt danach nur kontrollierte, konsistente Seitenbriefings.

## Rollenlogik

1. **User / Operator Fischer** liefert Ziel, Referenzmaterial, Rohstruktur und Layoutwunsch.
2. **Codex** prüft Referenz, Struktur, Dateilogik und Layoutanforderung.
3. **Codex** erstellt technischen Produktionsplan, Assetschema und Review-Gates.
4. **Claude** baut daraus konsistente Seitenprompts und einen Mappe-Review.
5. **Generierung** erfolgt Seite für Seite, nie als komplette Mappe auf einmal.

## Technischer Produktionsplan

- **Referenzprüfung:** Stil, Zielmedium, Format, Bildsprache, Textdichte, Qualitätsmaßstab und No-Go-Liste erfassen.
- **Strukturprüfung:** Mappe in Kapitel, Seitenrollen, Pflichtinhalte, Abhängigkeiten und Review-Reihenfolge zerlegen.
- **Dateilogik:** Projektordner, Seitenordner, Versionsschema, Statusnotizen und Exportnamen festlegen.
- **Layoutanforderung:** Raster, Safe Area, Typografie, Farben, Bildplätze, Icon-Stil und Exportformat definieren.
- **Prompt-Handoff:** Pro Seite nur Ziel, Referenz, Assets, Layoutregeln, Inhalt und Abnahmekriterien übergeben.
- **Page-Gate:** Eine Seite generieren, prüfen, korrigieren, freigeben; erst danach die nächste Seite starten.

## Assetschema

```text
project/
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
  exports/             # finale PDF/PNG/SVG-Dateien
```

## Namenskonvention

- Seitenordner: `NN_slug`, zum Beispiel `01_problemrahmen`.
- Arbeitsdateien: `page_[nn]_[slug]_[status].md`.
- Exportdateien: `page_[nn]_[slug]_v[version].[ext]`.
- Reviewdateien: `review_[nn]_[slug].md`.

## Review-Gate pro Seite

Vor jeder Seitengenerierung muss geklärt sein:

- Seitenrolle und Ziel sind eindeutig.
- Pflichtassets sind vorhanden oder als Platzhalter markiert.
- Layoutregeln sind konkret genug für genau eine Seite.
- Inhalt ist auf Textmenge, Hierarchie und Bildflächen begrenzt.
- Prompt erzeugt nur die aktuelle Seite, keine Folge- oder Sammelproduktion.
- Review markiert: `blocked`, `needs_revision` oder `approved`.

## Claude-Handoff-Template

```text
Erstelle nur Seite [NN]: [Seitentitel].

Referenz:
- Stil: [Beschreibung]
- Layout: [Raster / Bildflächen / Textdichte]
- No-Gos: [Liste]

Assets:
- [Datei oder Platzhalter]

Inhalt:
- Kernaussage: [eine Aussage]
- Pflichttexte: [Liste]
- Visuelle Elemente: [Liste]

Abnahmekriterien:
- Konsistent mit Mappe und Referenz.
- Exportfähig für [Format].
- Keine zusätzlichen Seiten erzeugen.
```

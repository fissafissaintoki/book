# Agenten-Setup (aus deiner Architektur)

Diese Struktur bildet genau die von dir gezeigte Pipeline ab:

1. **Market Data Feed** + **News Scraper** + **Sentiment Analyzer**
2. ➜ **Core Engine**
3. ➜ **Pattern Matcher (Oktagon-Logik)**
4. ➜ **Signal Generator (Muster → Gegenmuster)**
5. ➜ **Live Dashboard (Streamlit/React)**
6. ➜ **Watchlists**, **News-Block pro Aktie**, **Alert Layer**

## Enthalten
- `agents/registry.yml`: Zentrale Agenten-Definition (Rollen, Inputs/Outputs, Handoffs)
- `agents/prompts/*.md`: Prompt-Vorlagen je Agent für schnelle Implementierung

## Nächster Schritt
- Diese Agenten als echte Worker/Services anbinden (z. B. Python + Queue/Orchestrator),
  wobei `registry.yml` als Single Source of Truth dient.

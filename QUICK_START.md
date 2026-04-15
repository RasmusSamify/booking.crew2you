# Quick Start — Vad gör jag först?

## 1. Pusha till GitHub (5 min)

```bash
unzip crew2you-bokning-react.zip
cd crew2you-bokning-react
git init
git branch -M main
git add .
git commit -m "Initial commit: Crew2you Bokningssystem (Phase 0)"
gh repo create samify-group/crew2you-bokning --public --source=. --remote=origin --push
```

## 2. Skapa Supabase-projekt (10 min)

1. Gå till [supabase.com](https://supabase.com) → New Project
2. Region: **Stockholm (eu-north-1)** ← viktigt!
3. Plan: Pro
4. Spara: Project URL, anon key, service_role key (i 1Password)

## 3. Öppna Claude Code (1 min)

```bash
cd crew2you-bokning-react
claude
```

## 4. Kör Prompt 0 (verifiera grunden)

Kopiera Prompt 0 från `docs/CLAUDE_CODE_PROMPTS.md` och klistra in. Vänta tills Claude rapporterar "allt grönt".

## 5. Kör Prompt 1 (Supabase setup)

Klistra in Prompt 1 — fyll i din Supabase project ref och keys där det står `[SÄTT IN HÄR]`.

## 6. Sedan: Prompts 2-8 = Phase 1

Kör en prompt i taget. Mellan varje:
- Kontrollera att appen funkar (`npm run dev`)
- Commita: `git add . && git commit -m "Phase 1: [vad]"`
- Pusha: `git push`

Phase 1 ska vara klar och driftsatt på Netlify innan du går till Phase 2.

## 7. Phase 2 (prompts 9-11) = Automationer + AI

När Phase 1 funkar i drift, kör Phase 2.

## 8. Phase 3 (prompts 12-15) = Enterprise-funktioner

Sista milstolpen — Fortnox, SIE, kalendersync.

---

**Viktigast av allt: gå inte vidare till nästa prompt om föregående inte fungerar perfekt.**

Krångel? Använd debug-prompterna längst ner i `CLAUDE_CODE_PROMPTS.md`.

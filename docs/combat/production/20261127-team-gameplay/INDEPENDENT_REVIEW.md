# Revue indépendante — Relais de liaison

**27 novembre 2026 · Revue du moteur, de l’interface et des reprises locales.**

Fichiers examinés : `fight.js`, `teams.js`, `teams.html`, la recette `qa/teams.cjs` et le contrat [Relais de liaison](RELAIS_DE_LIAISON.md). La revue porte sur les quatre acteurs, la propriété des projectiles, l’engagement du relais, les K.-O. simultanés et la sauvegarde. Elle n’ajoute pas de nouvelles capacités aux kits.

## Défauts reproduits et corrigés

| Défaut | Reproduction avant correction | Correction |
| --- | --- | --- |
| Reprise d’une phase de victoire incohérente | Une sauvegarde `phase=finish`, `winner=0` passait la validation, puis le rendu levait une erreur après remplacement de l’état courant. | Vérification de la cohérence entre phase, gagnant et score avant toute mutation. Les phases intro/combat refusent aussi un gagnant déjà attribué. |
| Verrou de relais orphelin | `teamLock=true` sans intervention était accepté ; les entrées n’avaient plus d’effet même après 60 pas. | Un verrou ne peut appartenir qu’au membre actif d’un relais en cours. La reprise refuse les autres combinaisons. |
| Coordonnées d’objet manquantes | Une balise Fragile sans `x` était acceptée ; son rappel produisait une position `NaN`. | Validation des positions des objets et scans, des destinations de caisse, de la cible de Higgs et de l’ancrage/destination du treuil de Mama. |
| IA mobile pendant le relais | À un seuil de décision, avec une faible vitalité et la graine 12, l’IA lançait un dash alors que son transfert était verrouillé. | La décision CPU respecte le verrou, y compris la branche qui attribuait directement un dash. |
| Finale attribuée à un actif K.-O. | Un échange simultané éliminait les deux actifs et le dernier membre adverse, alors que la réserve alliée survivait. Le gagnant affiché était l’actif à zéro PV. | Le survivant prend le contrôle avant l’invitation de conclusion. Le membre battu reste K.-O. et n’est pas ressuscité. Vérifié dans les deux sens. |

Ces corrections restent dans le profil d’équipe et son validateur. Le repère `floorY` et les règles du duel historique ne sont pas modifiés par la revue.

## Vérification après correction

- [Six groupes indépendants de limites](teams-independent-review.json) : phases incohérentes rejetées sans mutation, verrous orphelins, objets incomplets, reprise valide avant/après transfert, engagement CPU et victoire sur échange simultané.
- [Vingt-cinq groupes du mode équipe](teams-verification.json) : coûts, contrôles, sauvegarde, délais, interruptions, ressources et attribution des projectiles.
- Présentation : vingt groupes réussis, dont 3 240 instantanés du duel identiques à la référence et 548 échantillons de replay.
- Dojo : quatorze groupes et cinquante-trois parcours réussis.
- [Rendu Canvas natif régénéré](teams-native.json) : quatre captures, soixante-cinq images décodées, empreintes actualisées.

La simulation et les contrôles d’interface utilisent l’adaptateur DOM explicite du dépôt ; les captures utilisent Canvas natif. Cette revue ne déclare ni session complète de navigateur ni réception d’une manette physique.

**SHA-256 de `fight.js` après correction :** `d616992432537129302a13c32d02dacc0dc87d5df681bf0fec877a4f9b65bc19`.

## Reproduction ciblée

```bash
node modes/echos-de-la-greve/qa/teams-independent.cjs --output=docs/combat/production/20261127-team-gameplay/teams-independent-review.json
node modes/echos-de-la-greve/qa/teams.cjs --output=docs/combat/production/20261127-team-gameplay/teams-verification.json
node modes/echos-de-la-greve/qa/teams-canvas.cjs
```

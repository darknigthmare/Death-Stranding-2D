# Vérifications — Relais et Lignes de Marée

**27 novembre 2026.** Chaque rapport indique ses sources, sa méthode et ses limites. Une réussite de simulation, de DOM adapté, de Canvas natif ou de serveur HTTP ne vaut pas une réception dans un navigateur matériel.

| Vérification | Preuve | Périmètre |
| --- | --- | --- |
| Catalogue de conception | [design-validation.json](../../extensions/lignes-de-maree/design-validation.json) | 147 IDs uniques, comptes, références, quatre chapitres, vingt lieux connexes et 24 liaisons. |
| Interface du catalogue | [catalogue-verification.json](catalogue-verification.json) | Dix groupes, 70 images, vingt arènes, recherche, filtres, dossiers, liens et focus ; DOM simulé. |
| Entrées des modes | [entrypoints-verification.json](entrypoints-verification.json) | Quatre groupes : vingt vrais liens ouvrent leur entraînement, 45 arènes en Versus, 44 en équipe et exclusion des originaux du moteur Boss distinct. |
| Source et art | [assets-manifest.json](assets-manifest.json) | Dimensions, mode, alpha, SHA-256, SHA Git et empreintes natives. |
| Personnages et ennemis | [characters-enemies-verification.json](characters-enemies-verification.json) | Trente images distinctes, identités stables, source/copie exactes. |
| Boss | [BOSS_VISUAL_REVIEW.md](BOSS_VISUAL_REVIEW.md) | Vingt bases retenues, trois corrections, contrôle réel du compositing alpha. |
| Vingt arènes | [stage-native.json](stage-native.json) | 100 cas sur vingt arènes, vrai moteur et Canvas 1280 × 720, ratio, appui, couverture et caméra ; [revue](STAGES_REVIEW.md). |
| Conservation et HTTP | [delivery-verification.json](delivery-verification.json) | Base de 450 rasters/33 SVG, 19 PNG récupérés, 70 PNG originaux ; assets, modules et documents effectivement servis. |
| Mode équipe | [teams-verification.json](../20261127-team-gameplay/teams-verification.json) | 25 groupes : ressources, entrées, interruptions, K.-O., entités, contrôleur et reprise. |
| Revue indépendante équipe | [teams-independent-review.json](../20261127-team-gameplay/teams-independent-review.json) | Six groupes supplémentaires, cas de sauvegarde invalides et échange final. |
| Rendu d’équipe | [teams-native.json](../20261127-team-gameplay/teams-native.json) | Quatre captures 1280 × 720, 65 images décodées, appuis, relais et effets réduits. |
| Présentation | [presentation-regression.json](../20261127-team-gameplay/presentation-regression.json) | 20 groupes, 3 240 états de simulation identiques, contrôles de replay. |
| Dojo | [dojo-regression.json](../20261127-team-gameplay/dojo-regression.json) | 14 groupes, 53 parcours. |
| Données des techniques | [moves-domain-verification.json](../20261127-team-gameplay/moves-domain-verification.json) | Dix groupes, valeurs extraites du moteur final, impacts, garde, annulations et seuils IA. |
| Navigateur graphique | [browser-verification.json](browser-verification.json) · [cause et limites](BROWSER_REVIEW.md) | Tentative unique bloquée : le lanceur Chromium trouve absent /usr/lib/chromium/chromium (exit 127). Aucun rendu HTML ni essai navigateur revendiqué. |
| Salon privé historique | [relay-regression.json](../20261127-team-gameplay/relay-regression.json) | Protocole, restauration déterministe, version des fichiers, HTTP et refus des traversées/symlinks. Le relais d’équipe reste local. |

## Reproduction

Depuis la racine du dépôt :

```bash
python modes/echos-de-la-greve/qa/build-original-extension.py
node modes/echos-de-la-greve/qa/original-extension.cjs
node modes/echos-de-la-greve/qa/original-entrypoints.cjs
node modes/echos-de-la-greve/qa/original-stages-canvas.cjs
node modes/echos-de-la-greve/qa/original-delivery.cjs
node modes/echos-de-la-greve/qa/teams.cjs --output=docs/combat/production/20261127-team-gameplay/teams-verification.json
node modes/echos-de-la-greve/qa/teams-independent.cjs
node modes/echos-de-la-greve/qa/teams-canvas.cjs
node modes/echos-de-la-greve/qa/reseau-logique.cjs docs/combat/production/20261127-team-gameplay/relay-regression.json
```

Le builder utilise Pillow pour lire les fichiers, sans les modifier. La recette native utilise `@napi-rs/canvas`. L’environnement doit disposer de ces dépendances ; les scripts Node de données et de serveur utilisent leurs adaptateurs explicitement déclarés. Les sources reçues ne sont jamais régénérées par ces commandes.

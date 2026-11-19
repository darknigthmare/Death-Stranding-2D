# Récupération des fichiers locaux — 19 novembre 2026

## Périmètre

Point de départ distant vérifié : PR #1, branche `codex/echos-de-la-greve`,
commit `ec3d5fda28041b5672d023c89b74ea809cfd3c56`.

Ce lot conserve les 10 fichiers suivis modifiés et les 150 fichiers non suivis
du checkout local le plus avancé. La comparaison de cinq checkouts confirme
qu'il contient tous les chemins de production présents dans les quatre autres.
Les 46 PNG générés encore accessibles hors des checkouts sont déjà représentés
à l'identique par SHA-256 dans le runtime ou les sources : ils ne sont pas
dupliqués une nouvelle fois.

Quatorze fichiers historiques supplémentaires sont archivés : six aperçus de
contrôle, deux patches et six fichiers de suivi. Les patches sont des archives,
pas des modifications à appliquer sur le code récent. Les checkpoints d'envoi
ne constituent pas une preuve de publication réussie.

L'inventaire détaillé est dans [inventaire-local-20261119.json](inventaire-local-20261119.json).
Il couvre les fichiers accessibles au moment de cette reprise. Les anciens
rapports de perte mentionnant 76 sources historiques ne prouvent pas la
récupération de chacun de ces originaux.

## État des stages avant la nouvelle génération

| Couche | Images disponibles | Images à produire |
|---|---:|---|
| Fond de base | 10 | Aucune |
| Ciel / fond intérieur éloigné | 8 | Camp MULE, bassin de goudron |
| Relief / structure distante | 6 | Camp MULE, bassin de goudron, laboratoire de Heartman, abri sous la pluie |
| Plan intermédiaire | 10 | Aucune |
| Sol indépendant | 5 | Camp MULE, bassin de goudron, laboratoire de Heartman, abri sous la pluie, usine en ruines |
| Premier plan | 10 | Aucune |

Il reste donc **11 images** pour assembler cinq plans séparés sur chacune des
dix arènes. Le moteur utilise encore le panorama de base lorsque le ciel, le
lointain ou le sol n'est pas livré. Le contrôle complet `qa/arenes.cjs` exige
déjà ces cinq plans et reste volontairement insatisfait à ce point de reprise.

## Vérifications du lot récupéré

- `qa/assets.cjs` : 151 chemins d'images présents et décodés ; poses de saut des
  huit combattants dessinées des deux côtés ; accessoires et parallaxe livrée
  vérifiés dans le moteur.
- `qa/reseau-logique.cjs` : relais et rollback vérifiés, état identique au tick 200.
- `git diff --check` : aucun défaut d'espacement.

Ces vérifications établissent la disponibilité et le fonctionnement technique.
La fidélité visuelle 1:1 aux plans officiels n'est pas certifiée par ces tests.


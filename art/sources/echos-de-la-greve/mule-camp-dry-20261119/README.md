# Camp MULE · temps sec — sources du 19 novembre 2026

Six images ont été générées séparément : un panorama opaque, le ciel, le lointain,
le plan intermédiaire, le sol et le premier plan. Les six PNG livrés conservent les
octets originaux du générateur. Aucun détourage, recadrage ou recoloriage n’a été
effectué après génération.

- `generation-plan.json` conserve les six prompts exacts et les références employées.
- `provenance.json` relie chaque sortie originale à son fichier intégré, avec son
  empreinte SHA-256 ; les chemins absolus identifient la session de production.
- `measurements.json` mesure les dimensions, les alpha, les boîtes visibles et la
  ligne de sol des PNG originaux.
- `visual-review.json` décrit la revue des images séparées et les premières
  recommandations de placement.
- `integrated-review.json` consigne la revue des deux compositions produites par
  le moteur réel, ainsi que les ancres finalement retenues.

## Placement retenu après composition

| Plan | Ancre verticale dans la source | Position dans la vue 1280 × 720 |
|---|---:|---:|
| Lointain | 679 / 724 | 598 |
| Intermédiaire | 686 / 724 | 592 |
| Sol | 300 / 724 | 588 |
| Premier plan | Bas de l’image | 720 |

Le sol atteint l’alpha 128 à y = 300 dans chacune des 2172 colonnes. Le placement
du lointain et du plan intermédiaire a été affiné après la première recommandation
pour recouvrir cette ligne de quelques pixels. Les surfaces pleines ont surtout
des alpha de 252 à 253 ; leurs valeurs originales sont conservées. Les couleurs
vives présentes dans certains pixels de contour ont un alpha de 1 à 2 et ne
produisent pas de liseré visible dans les compositions contrôlées.

Les médias joués se trouvent dans `modes/echos-de-la-greve/assets/stages/`.
Le [bilan d’intégration](../../../../docs/combat/production/AMBIANCES_VARIANTE_MULE_20261119.md)
décrit le catalogue, le son et les vérifications du lot.

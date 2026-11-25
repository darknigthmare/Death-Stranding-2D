# Quatre arènes de l’univers Death Stranding

**Échos de la Grève · 25 novembre 2026**

Les ruines de South Knot, la ferme sous la pluie temporelle, l’approche de Mountain Knot et la berge du DHV Magellan sont intégrées au catalogue jouable. Le catalogue conserve les douze lieux précédents et atteint **16 lieux, 17 configurations et 85 plans de décor**, avec les huit combattants existants. Le camp MULE conserve ses deux configurations météorologiques.

Les quatre arènes apparaissent dans la galerie des lieux et les sélections utilisant le catalogue commun. Le parcours de sélection a été vérifié pour Entraînement, Versus et Boss Battle ; le relais accepte leurs quatre identifiants. Boss Rush conserve les lieux prescrits par ses six rencontres. Les routes de l’Histoire et la campagne principale ne sont pas réécrites par ce lot.

## Identifiants et panoramas réutilisés

| Identifiant | Sujet | Panorama de sélection et de secours |
|---|---|---|
| `south-knot-ruins` | Ruines de South Knot, région centrale | `assets/static-20261125/south-knot-ruins-panorama.png` |
| `timefall-farm` | Ferme sous la pluie temporelle | `assets/static-20261125/timefall-farm-panorama.png` |
| `mountain-knot-approach` | Vallée d’approche de Mountain Knot ; la ville est hors champ | `assets/static-20261125/mountain-knot-city-panorama.png` |
| `magellan-ds2` | Berge et marais au couchant, avec le DHV Magellan en arrière-plan | `assets/static-universe-20261125/magellan-ds2-panorama.png` |

Les chemins ci-dessus désignent les panoramas déjà produits. Ils ne sont pas recopiés sous un deuxième nom. Le nom historique du fichier `mountain-knot-city-panorama.png` est conservé ; le titre public et la fiche décrivent bien une **approche montagneuse**.

Chaque lieu ajoute cinq PNG natifs sous `assets/stages/{identifiant}-…png` : `sky`, `distant`, `midground`, `floor`, `foreground`. Les vingt fichiers mesurent **1672 × 941 pixels**. Le ciel est opaque ; les quatre autres plans portent leur propre alpha. Leur intégration ne rééchantillonne, ne recadre et ne repeint pas les PNG : le moteur effectue des mises à l’échelle uniformes à partir des dimensions réelles.

## Sols, raccords et lisibilité

Le moteur dessine une scène de **1280 × 720** dont la ligne physique de sol est **y = 588**. Les valeurs 594 et 598 sont des bases de composition des arrière-plans ; elles assurent leur recouvrement derrière le sol et ne déplacent pas les collisions.

Les ancres proviennent d’une lecture des pixels natifs. La ligne de support du sol est la médiane des premières séries de cinq pixels d’alpha au moins 224 sur les colonnes centrales de l’image. Les bases des plans de fond tiennent compte de leurs dernières lignes opaques. Les fractions ci-dessous restent exprimées sur la hauteur source de 941 pixels.

| Arène | Ancre du sol → y 588 | Ancre du plan intermédiaire → y 594 | Ancre du plan lointain → y 598 |
|---|---|---|---|
| South Knot | `392 / 941` | `913 / 941` | `1` |
| Ferme | `359 / 941` | `840 / 941` | `1` |
| Approche de Mountain Knot | `376 / 941` | `1` | `1` |
| Magellan | `445 / 941` | `1` | `1` |

South Knot et la ferme contiennent une marge transparente au bas du plan intermédiaire. L’ancrage mesuré remonte cette marge hors du raccord : une ancre générique de 1 aurait laissé apparaître le ciel entre le décor et le sol. Les PNG restent inchangés.

Les cinq profondeurs conservent les facteurs de parallaxe existants : **0,14 ; 0,27 ; 0,43 ; 0,62 ; 0,8**. Les effets réduits multiplient les déplacements de décor par **0,2**. Le premier plan reste hors de la zone occupée par les combattants et leurs pieds. Si les plans essentiels ne sont pas encore disponibles, le moteur affiche le panorama original en conservant ses proportions.

Les façades, la pluie, la neige, les roseaux, l’eau et le vaisseau relèvent de la présentation. Ils n’ajoutent aucun dégât de décor, obstacle physique, changement d’arène en cours de match ou finisher contextuel. Les nouvelles images sont des plans statiques ; la pluie et la poudrerie réutilisent les effets déjà présents.

Le Magellan apparaît uniquement sur le plan lointain. Une reprise de ce PNG a réduit le vaisseau et relevé sa silhouette afin que la coque et les volumes sphériques restent visibles au-dessus de la berge. Le premier assemblage les occultait partiellement et donnait l’impression d’un échouage. Les huit captures Magellan livrées emploient le plan corrigé ; les trois autres arènes conservent leurs captures antérieures, dont les empreintes de sources ont été revérifiées.

## Ambiances

Les profils emploient le générateur sonore existant : pluie et gouttes pour South Knot, vent et pluie pour la ferme, vent de montagne pour l’approche, fond grave et signal mécanique pour Magellan. Le volume, la suspension, la pause, la réduction d’effets et la sortie continuent de suivre les réglages communs. L’ensemble du catalogue comporte maintenant **17 profils distincts**.

## Vérification exécutée et limites

| Preuve | Résultat et portée |
|---|---|
| [Mesures natives](stage-source-measurements.json) | Décodage des vingt PNG, dimensions, alpha, lignes de support, empreintes SHA-256. Les sources ne sont pas modifiées par ce relevé. |
| [Rendu natif](stage-renders/validation.json) | **32 cas, 32 captures** : quatre arènes × deux modes (`local`, `training`) × effets normaux/réduits × déplacements droite/gauche. Le vrai `fight.js` dessine avec `@napi-rs/canvas`. |
| Contrôles de rendu | Ordre des cinq plans, proportions natives, couverture horizontale, ligne de sol 588, remplissage du bas, continuité de la bande y 584–587, parallaxe, premier plan dégagé et secours par le panorama original. Les captures exportées mesurent 1280 × 720. |
| [Catalogue, interface et simulation](stages-verification.json) | Présence des 24 chemins PNG distincts (vingt plans et quatre panoramas), huit combattants, 16 lieux, 17 configurations et 85 plans. Exécution des vrais gestionnaires de menu et moteurs pour douze lancements : Entraînement, Versus et Boss Battle sur les quatre arènes. Le DOM de ce test est simulé. |
| Conservation de la simulation | **360 checkpoints identiques** : huit combattants × cinq arènes (la Grève et les quatre ajouts) × neuf séquences d’entrées. Le `fight.js` courant est comparé à celui du commit `1cfc7787a49a7aaf6d7e82df28cfea57b1535e9b`, avec les mêmes données `content.js` et `assets.js` courantes des deux côtés. Ce contrôle isole les changements du moteur ; il ne prétend pas que les quatre lieux existaient dans ce commit. |
| [Ambiances](ambiances-verification.log) | Dix-sept profils et gestion du cycle audio vérifiés sur un graphe Web Audio simulé, ainsi que l’absence de modification du checkpoint et le comportement de rollback. Ce journal ne certifie pas une écoute sur un appareil réel. |
| [Relais et HTTP](http-verification.log) | Acceptation des quatre identifiants en salon privé ; correction d’une entrée tardive à état identique. Un vrai serveur HTTP local sert les 29 images de la galerie et les 24 chemins des quatre arènes, avec et sans préfixe `/modes/echos-de-la-greve/`. Les chemins communs aux deux inventaires ne sont pas comptés comme des fichiers supplémentaires. Les réponses sont comparées octet pour octet aux fichiers locaux. |
| [Boss Rush](boss-rush-verification.json) | La suite séparée reste passée : vingt groupes, dont série complète de six victoires pilotée par les entrées, reprise et conservation des ressources. Ses règles et ses limites sont détaillées dans [BOSS_RUSH.md](BOSS_RUSH.md). |

Les rapports natifs certifient les contrôles décrits et les empreintes des fichiers qu’ils ont effectivement chargés. Ils ne sont pas une session de navigateur, une certification de fidélité canonique ou un audit de toutes les compositions possibles. La revue humaine des captures complète les assertions de géométrie. Aucun test multijoueur à travers Internet ou avec deux navigateurs distants n’est revendiqué par ce lot.

### Captures de référence

| Arène | Déplacement à droite | Déplacement à gauche |
|---|---|---|
| South Knot | [Capture](stage-renders/south-knot-ruins-right.webp) | [Capture](stage-renders/south-knot-ruins-left.webp) |
| Ferme | [Capture](stage-renders/timefall-farm-right.webp) | [Capture](stage-renders/timefall-farm-left.webp) |
| Approche de Mountain Knot | [Capture](stage-renders/mountain-knot-approach-right.webp) | [Capture](stage-renders/mountain-knot-approach-left.webp) |
| Magellan | [Capture](stage-renders/magellan-ds2-right.webp) | [Capture](stage-renders/magellan-ds2-left.webp) |

Les six autres captures de chaque arène figurent dans le tableau `captures` du rapport de rendu.

## Reproduction

Depuis la racine du dépôt, avec `@napi-rs/canvas` disponible pour le décodage et le rendu natifs. Le contrôle comparatif de simulation requiert aussi l’objet Git `1cfc7787a49a7aaf6d7e82df28cfea57b1535e9b` dans le clone :

```sh
node modes/echos-de-la-greve/qa/stage-source-measurements-20261125.cjs --output=docs/combat/production/20261125-universe/stage-source-measurements.json
ARENA_SCREENSHOTS=docs/combat/production/20261125-universe/stage-renders node modes/echos-de-la-greve/qa/arenes-canvas.cjs --stages=south-knot-ruins,timefall-farm,mountain-knot-approach,magellan-ds2
node modes/echos-de-la-greve/qa/stages-universe-20261125.cjs --output=docs/combat/production/20261125-universe/stages-verification.json
node modes/echos-de-la-greve/qa/ambiances.cjs
node modes/echos-de-la-greve/qa/reseau-logique.cjs
node modes/echos-de-la-greve/qa/boss.cjs docs/combat/production/20261125-universe/boss-rush-verification.json
```

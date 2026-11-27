# Réception des vingt panoramas — Les Lignes de Marée

**27 novembre 2026 — recette finale à 11:25 UTC.** Les vingt lieux originaux sont reçus comme **arènes à panorama unique**, raccordées au plan de combat du moteur existant. La recette finale valide **20 arènes, 100 cas de rendu et 20 captures de 1280 × 720** avec Sam et Higgs. Les cinq planches du moteur et les cinq planches des sources ont aussi été inspectées visuellement.

Ces lieux sont des créations originales pour l'extension du fan game. Cette réception ne leur attribue aucun statut officiel ou canonique et ne constitue pas une comparaison de fidélité à vingt lieux existants.

## Preuves et méthode

Le rapport [stage-native.json](stage-native.json) contient les rectangles réellement transmis à Canvas, les positions des deux combattants, les paramètres de scène, les empreintes des fichiers et les résultats des cent cas. Le script [original-stages-canvas.cjs](../../../../modes/echos-de-la-greve/qa/original-stages-canvas.cjs) charge réellement `content.js`, `asset-geometry-20261124.js`, `assets.js`, `extension-data.js`, `extension-assets.js`, `extension-runtime.js` puis `fight.js`.

Le moteur tourne sur Canvas natif à 1280 × 720, avec les assets décodés par `@napi-rs/canvas`. La simulation utilise ses entrées publiques ordinaires et `requestAnimationFrame`. Aucun état de combattant n'est fabriqué pour composer les captures. Quarante-cinq images sont décodées : les vingt panoramas et les ressources effectivement demandées par les deux combattants et le moteur.

Les cinq situations vérifiées pour chaque arène sont :

1. Début de combat après l'introduction, scène figée.
2. Déplacement des deux combattants à droite, scène toujours figée.
3. Activation des effets réduits.
4. Déplacement à droite avec la caméra ordinaire réactivée.
5. Déplacement à gauche avec cette caméra.

La scène figée garde son rectangle de panorama malgré le déplacement des combattants. Lorsque la caméra est réactivée, le panorama répond au déplacement, conserve son ratio et couvre toujours l'écran. Ce mouvement d'un plan unique n'est pas une réception de parallaxe à cinq couches.

| Contrôle final | Résultat observé |
| --- | --- |
| Arènes enregistrées et rendues sous leur propre ID | 20 sur 20 ; aucun retour silencieux vers une arène canonique |
| Cas du moteur | 100 sur 100 |
| Couverture du viewport | Complète, horizontalement et verticalement, dans les 100 cas |
| Ancrage vertical `y + hauteur × floorY` | 588 dans les 100 cas ; erreur maximale mesurée : 0 px |
| Conservation du ratio natif | Erreur maximale : 2,22 × 10⁻¹⁶ |
| Opacité de la composition finale | Alpha minimal : 255 |
| Plans d'image propres à chaque arène | Un panorama ; aucune pile de cinq couches déclarée |
| Route de transition runtime attachée à ces arènes | Aucune |
| Conservation des sources | Empreintes SHA-256 identiques avant et après la recette |

## Géométrie et appui au sol

Les vingt PNG natifs font **1672 × 941 pixels, en RGB**. Ils restent inchangés ; ils ne sont ni agrandis dans les fichiers ni présentés comme des sources 4K. Leurs octets totalisent 51 023 437 octets. Les empreintes et la provenance figurent dans [stages-generation.json](stages-generation.json).

Le fichier [stage-geometry.json](stage-geometry.json) définit, pour chaque image, une hauteur normalisée choisie sur la surface réellement praticable. Le builder la transmet à `stageGeometry[id].legacy.floorY`. Le moteur place cette ligne sur son plan physique fixe à **y = 588** et agrandit proportionnellement le panorama pour couvrir le viewport. Cette opération peut recadrer le haut ou les côtés ; elle ne déforme pas l'image et ne crée pas de nouveaux colliders à partir du décor.

La Digue et le Triage demandent un ancrage sensiblement plus haut que les salles au sol profond : les combattants doivent rester sur le dessus du quai, et non sur sa face verticale ou sur l'eau.

| Arène et capture moteur | `floorY` retenu | Repère visuel inspecté |
| --- | ---: | --- |
| [La Digue aval](stage-renders/digue-aval.webp) | 0,688 | Dalle supérieure devant le garde-corps, au-dessus du parement de digue |
| [Le Quai des refuges](stage-renders/quai-refuges.webp) | 0,820 | Quai libre devant les refuges, derrière le drainage |
| [Le Dépôt des amarres](stage-renders/depot-amarres.webp) | 0,820 | Dalle libre devant les caissons et l'escalier |
| [Le Bassin muet](stage-renders/bassin-muet.webp) | 0,850 | Sol du premier plan devant le muret ; bassin exclu de la piste |
| [Le Phare couché](stage-renders/phare-couche.webp) | 0,840 | Quai devant la rampe et les garde-corps |
| [La Serre de veille](stage-renders/serre-veille.webp) | 0,810 | Béton devant les bacs, après le drainage du fond |
| [La Station de captage](stage-renders/station-captage.webp) | 0,840 | Dalle devant les conduites et le pied de l'escalier |
| [Le Viaduc de l'Ourlet](stage-renders/viaduc-ourlet.webp) | 0,810 | Tablier entre le garde-corps et le bord de dalle |
| [Le Relais des vents](stage-renders/relais-anemometre.webp) | 0,790 | Plateforme devant le relais, au-dessus du rebord |
| [La Pente des cairns](stage-renders/pente-cairns.webp) | 0,780 | Bande horizontale devant l'escalier et le rebord |
| [Le Triage noyé](stage-renders/triage-noye.webp) | 0,670 | Dalle supérieure du quai, au-dessus du mur et de l'eau |
| [La Gare suspendue](stage-renders/gare-suspendue.webp) | 0,830 | Dalle sous le portique, devant les piliers |
| [L'Atelier du réservoir](stage-renders/atelier-reservoir.webp) | 0,840 | Dalle devant l'établi et l'escalier, avant le drainage |
| [L'Écluse noire](stage-renders/ecluse-noire.webp) | 0,830 | Dalle immédiatement devant le garde-corps |
| [Les Archives de béton](stage-renders/archive-beton.webp) | 0,830 | Sol devant les armoires, derrière la bande d'avertissement |
| [Le Col de Contrevent](stage-renders/col-contrevent.webp) | 0,840 | Dalle dégagée de neige devant la corde de sécurité |
| [Le Plateau des aiguilles](stage-renders/plateau-aiguilles.webp) | 0,810 | Bande horizontale devant les équipements et les pierres proches |
| [Le Radôme ébréché](stage-renders/radome-ebreche.webp) | 0,820 | Dalle immédiatement devant les portes et le pied de l'escalier |
| [La Terrasse des veilleurs](stage-renders/terrasse-veilleurs.webp) | 0,820 | Plateforme devant le poste, au-dessus du rebord rocheux |
| [Le Seuil de la marée](stage-renders/seuil-maree.webp) | 0,800 | Dalle du quai devant les amarres et les garde-corps |

## Revue visuelle

La première inspection porte sur les sources seules, avec des guides à 0,6, 0,7, 0,8 et 0,9 de leur hauteur. La deuxième porte sur les vingt compositions du moteur avec l'interface et les deux combattants. La Digue, le Triage, l'Écluse et le Radôme ont également été revus individuellement à la taille de capture.

Les surfaces de combat restent lisibles sur les vingt vues reçues. Les barrières, conduites et caissons sont placés derrière la piste dans les zones occupées par les combattants. Les silhouettes se détachent des matières de béton humide, de métal peint, de roche sombre et de végétation froide. Les locaux intérieurs, les infrastructures portuaires, le col enneigé et le plateau au crépuscule conservent leurs repères propres tout en partageant la direction artistique de l'extension.

Deux ancrages ont été affinés après la première passe : l'Écluse passe de 0,845 à 0,830 et le Radôme de 0,840 à 0,820. Cela conserve davantage de la passerelle supérieure et de la coque sans quitter la dalle. Les métadonnées ont été reconstruites puis les vingt arènes et les cent cas ont été rejoués avec les valeurs définitives.

Le sommet du Radôme, certaines superstructures et certaines extrémités latérales restent partiellement recadrés ou recouverts par l'interface dans la composition de combat. Cette limite de cadrage est visible dans les captures ; la source complète reste disponible et intacte. Aucun obstacle de premier plan ne masque les pieds dans les compositions reçues.

### Planches du moteur

Les captures individuelles du tableau sont des rendus à 1280 × 720. Les planches suivantes sont des dérivés de contrôle à quatre vues, avec titres ajoutés uniquement dans les planches :

- [Arènes 1 à 4](stage-renders/engine-contact-1.webp)
- [Arènes 5 à 8](stage-renders/engine-contact-2.webp)
- [Arènes 9 à 12](stage-renders/engine-contact-3.webp)
- [Arènes 13 à 16](stage-renders/engine-contact-4.webp)
- [Arènes 17 à 20](stage-renders/engine-contact-5.webp)

Les planches de sources avec guides sont conservées sous `stage-renders/source-contact-1.webp` à `source-contact-5.webp`. Ces composites de QA ne remplacent aucun asset natif et ne sont pas branchés au runtime.

## Portée de la réception

Cette passe réceptionne le panorama, son ancrage et sa projection par le moteur. Elle ne réceptionne pas cinq couches de parallaxe, des transitions entre ces lieux, des dangers interactifs, une météo dotée de règles de jeu ou une campagne parcourable. Les liaisons de conception éventuelles du catalogue ne deviennent pas des routes runtime par ce travail.

Le contrôle est exécuté avec Canvas natif, pas dans un navigateur. Il ne vérifie donc ni la mise en page HTML, ni une manette matérielle, ni les performances sur les appareils des joueurs. Les différences de rendu de texte ou de décodage propres aux navigateurs restent hors de cette preuve.

`fight.js` n'a pas été modifié pour cette réception. Les changements de géométrie sont exclusivement des données. La recette compare les empreintes des scripts et de toutes les images décodées avant et après son exécution.

## Reproduire

Depuis la racine du dépôt, après installation des dépendances déjà utilisées par les autres recettes natives :

```bash
python modes/echos-de-la-greve/qa/build-original-extension.py
node modes/echos-de-la-greve/qa/original-stages-canvas.cjs
```

Le premier script reconstruit les métadonnées depuis les sources et `stage-geometry.json`. Le second produit `stage-native.json`, les vingt captures individuelles et les cinq planches du moteur. Il ne régénère et ne retouche aucun PNG source. L'option `--output=/chemin/de/recette` permet de diriger les rapports et captures vers un autre dossier tout en conservant les sources et la géométrie du dépôt.

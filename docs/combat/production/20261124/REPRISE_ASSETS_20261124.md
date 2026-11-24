# Reprise des éléments manquants — 24 novembre 2026

## Résultat et périmètre

Le lot ajoute **42 PNG individuels** au mode **Échos de la Grève** : **35 poses pour sept combattants existants** et **sept images de projectiles ou d’effets**. Les fichiers sont reliés au rendu du jeu et au salon réseau. Chaque PNG conserve ses dimensions, ses pixels et son canal alpha natifs.

La base auditée est `darknigthmare/Death-Stranding-2D`, branche `main`, commit `ba4431587f861823e453c85bdf7e6967778329a9`. La branche de travail locale est `codex/echos-assets-fidelity-20261124`.

Le périmètre de la bible est **Death Stranding (2019) / Director’s Cut** : huit combattants, dix lieux et la variante sèche du camp MULE. Les poses absentes de sept combattants sont maintenant fournies. Mama disposait déjà des cinq poses concernées ; ses fichiers existants sont conservés.

**La correspondance canonique 1:1 n’est pas certifiée.** La continuité des tenues locales a été contrôlée, mais les poses du jeu de combat sont des adaptations. Une comparaison détaillée avec les mêmes vues officielles reste nécessaire pour certifier les visages, les fixations, les proportions et les asymétries de chaque accessoire. Le statut de fidélité est également enregistré dans les manifestes.

[Ouvrir la galerie de contrôle](index.html). Elle présente les PNG séparés sur fond sombre, clair ou en damier, quatre captures dans le moteur et les onze configurations de stages.

## 1. Personnages : 35 nouvelles poses

| Combattant | Garde | Accroupissement | Montée du saut | Sommet du saut | Descente du saut |
|---|---|---|---|---|---|
| Sam Porter Bridges | Ajoutée | Ajouté | Ajoutée | Ajouté | Ajoutée |
| Fragile | Ajoutée | Ajouté | Ajoutée | Ajouté | Ajoutée |
| Higgs Monaghan | Ajoutée | Ajouté | Ajoutée | Ajouté | Ajoutée |
| Cliff Unger | Ajoutée | Ajouté | Ajoutée | Ajouté | Ajoutée |
| Porteur MULE | Ajoutée | Ajouté | Ajoutée | Ajouté | Ajoutée |
| Die-Hardman | Ajoutée | Ajouté | Ajoutée | Ajouté | Ajoutée |
| Heartman | Ajoutée | Ajouté | Ajoutée | Ajouté | Ajoutée |
| Mama | Préexistante | Préexistant | Préexistante | Préexistant | Préexistante |

Les nouveaux fichiers sont rangés dans `modes/echos-de-la-greve/assets/fighters/<id>/`, sous les noms `guard.png`, `crouch.png`, `rise.png`, `apex.png` et `fall.png`. Un personnage, une pose et une orientation droite par image : aucune nouvelle planche de sprites n’est introduite.

Les anciennes poses de saut restent disponibles pendant le chargement des nouvelles images ou si un fichier manque dans une copie hors ligne. Les costumes optionnels conservent leur priorité lorsqu’ils fournissent leur propre pose.

### Calage anatomique

Le recadrage utilisé par le moteur est mesuré dans l’alpha, sans recadrer ni réencoder le fichier source. L’échelle conserve le rapport largeur/hauteur de l’image. Trois mesures anatomiques complètent le rectangle alpha :

- **Fragile, sommet du saut** : le parapluie descend sous la chaussure ; l’ancre utilise la semelle à `y=1324` dans le PNG natif.
- **Higgs, sommet du saut** : la cape descend légèrement sous la chaussure ; l’ancre utilise la semelle à `y=1078`.
- **Higgs, descente** : la cape remonte au-dessus de la tête ; l’échelle a été revue contre la tête et le torse de la garde, avec les semelles à `y=1374`.

Ces réglages ne changent ni la hauteur physique du saut ni les volumes de collision. Les valeurs d’échelle sont des choix de direction artistique, pas des mesures canoniques du personnage.

## 2. Projectiles et effets : sept PNG dédiés

| Fichier | Technique existante | Statut de la représentation |
|---|---|---|
| `projectiles/sam.png` | Bola de liaison | Le Bola Gun appartient au jeu d’origine ; la silhouette et la trajectoire latérale sont adaptées. |
| `projectiles/higgs.png` | Marée noire | Groupe de mains de goudron ; technique conçue pour ce mode combat. |
| `projectiles/cliff.png` | Écho de section | Trait de tir à motif militaire ; technique du fan-game. |
| `projectiles/recall.png` | Rappel de section | Trait ascendant ; technique du fan-game. |
| `projectiles/gate.png` | Ligne d’arrêt | Barrière holographique ; technique du fan-game. |
| `projectiles/heartman.png` | Impulsion témoin | Onde inspirée du moniteur ; attaque du fan-game. |
| `projectiles/memory.png` | Mémoire de phase | Onde prolongée avec écho ; attaque du fan-game. |

Le moteur charge les effets nécessaires aux combattants présents. Les dessins Canvas existants servent de repli pendant le chargement. Les accessoires déjà utilisés par les autres techniques, dont le tablier projeté de Mama et les caisses du MULE, étaient présents dans la base.

Une revue indépendante a relevé que les premières images de Higgs et du portique étaient trop courtes pour les zones de frappe existantes. La composition des mains a été reprise et le calage vertical des deux effets est établi sur **100 pixels visibles pour Higgs** et **143 pour le portique**, avec mise à l’échelle uniforme. Les dégâts, les vitesses, les durées, les commandes et les collisions restent ceux de la base.

## 3. Stages : inventaire complet, aucun fichier déclaré manquant

Les **55 couches de décor étaient déjà présentes** au début de cette reprise. Aucun stage nouveau n’est revendiqué dans ce lot. La recette contrôle les cinq plans de chacune des onze configurations :

| Configuration | Couches contrôlées |
|---|---:|
| La Grève | 5 |
| Centre de distribution | 5 |
| Champ de bataille | 5 |
| Camp des MULEs | 5 |
| Camp des MULEs, temps sec | 5 |
| Laboratoire de Heartman | 5 |
| Atelier de Mama | 5 |
| Usine en ruines | 5 |
| Abri sous la pluie temporelle | 5 |
| Bassin de goudron | 5 |
| Col de Mountain Knot | 5 |
| **Total** | **55** |

La recette vérifie le chargement, l’ordre des cinq plans, les vitesses relatives de parallaxe, leurs proportions, le débord horizontal et les raccords au sol. Elle couvre le duel local et l’entraînement, les deux directions de caméra, les effets normaux et réduits : **88 cas**. Vingt-deux captures illustrent les deux directions des onze configurations.

Ce contrôle établit la complétude et le fonctionnement des stages déclarés. Il ne transforme pas leurs compositions latérales en reproductions exactes des environnements 3D officiels.

## 4. Intégration et validation

`assets.js` déclare les nouvelles poses et les sept effets. `fight.js` choisit les poses et dessine les sources selon leur géométrie native. `index.html` et `netplay.html` chargent les mesures avant le catalogue. Le relais autorise les nouveaux fichiers et les inclut dans son empreinte de version, avec le fichier de géométrie.

Les scripts de contrôle et leurs sorties sont conservés dans le dépôt. Les résultats finaux sont récapitulés dans `validation-summary.json` à côté de ce rapport.

| Contrôle | Ce qu’il établit |
|---|---|
| `scripts/measure-combat-assets-20261124.py` | 42/42 sources natives, dimensions, SHA-256, transparence, crops et ancres. |
| `qa/assets.cjs` | Présence et décodage intégral des 210 images déclarées ; chargement des combattants, accessoires et arènes. |
| `qa/generated-assets-20261124.cjs` | Routage réel des 35 poses et sept effets dans les deux directions, repli pendant le chargement, rapports de forme et conservation des checkpoints de simulation. |
| `qa/arenes-canvas.cjs` | 55 couches, 11 configurations et 88 cas de rendu dans le moteur réel. |
| `qa/reseau-logique.cjs` | Protocole et reprise réseau, empreinte de version, distribution des assets et refus des chemins sources non publics. |
| `scripts/render-combat-assets-20261124.cjs` | Quatre captures reproductibles à 1280 × 720, prises dans le moteur réel. |

**Limite de validation :** Chromium n’a pas pu démarrer dans cet environnement. Les tests de navigateur, dont `poses.cjs`, ne sont donc pas déclarés réussis. Les tests de routage et les captures utilisent le moteur réel avec un Canvas natif ; ils ne valident pas les menus, les interactions tactiles, l’audio ni une session réseau dans un navigateur.

## 5. Points restant à une certification 1:1

1. Comparer chaque costume avec des vues officielles identifiées du premier jeu ou de Director’s Cut, à angle et éclairage comparables. Une référence locale, même cohérente, peut contenir une interprétation antérieure.
2. Fournir une vue gauche dessinée pour les équipements asymétriques. Le moteur inverse actuellement le sprite droit par miroir horizontal.
3. Revoir les poses historiques, notamment Mama et les anciens visuels de Die-Hardman, ainsi que les anciennes planches de marche et d’impact de Sam et Cliff. Ce lot comble les poses absentes ; il ne remplace pas tous les dessins historiques.
4. Documenter les animations intermédiaires et la réception lorsque leur absence nuit à la continuité. Les trois poses de saut ajoutées ne constituent pas une animation officielle reconstituée image par image.
5. Conserver le statut d’adaptation des attaques inventées et des stages réagencés en vue latérale. Une certification de fidélité des accessoires n’implique pas que ces attaques existent dans le jeu d’origine.

## 6. Provenance, fichiers et reprise

Le dossier `art/sources/echos-de-la-greve/production-20261124/` conserve :

- `characters-root.json`, `characters-a.json` et `characters-b.json` : prompts exacts, références locales et historiques de génération des personnages ;
- `projectiles-plan.json` et `projectiles.json` : direction artistique, statut canonique et historique des effets ;
- `production-assets.json` : inventaire final des 42 fichiers, dimensions, poids, empreintes et géométrie ;
- `reference-audit.md` : sources officielles et séparation entre éléments attestés et adaptations.

Les références primaires comprennent [la présentation officielle PlayStation](https://www.playstation.com/fr-fr/games/death-stranding/), [les conseils de Kojima Productions](https://www.kojimaproductions.jp/en/DSTips), [la galerie Director’s Cut](https://www.kojimaproductions.jp/en/death-stranding-dc) et [les portraits du PlayStation Blog](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/). Aucune capture officielle n’est redistribuée dans ce lot.

L’archive de livraison est un **lot d’intégration à superposer au commit de base indiqué**, contenant tous les fichiers ajoutés ou modifiés, la galerie et les preuves de validation. Ce n’est pas une copie complète du jeu. Le fichier `LIRE_AVANT_INTEGRATION.md` de l’archive donne le commit local final, l’inventaire et la procédure de reprise.

**Publication :** les modifications sont préparées localement. La revue automatique a refusé la publication vers le dépôt GitHub public et exige une autorisation donnée directement dans ce fil. Aucune nouvelle branche distante ni nouvelle PR n’a été créée pour ce lot. L’archive permet de vérifier le résultat concret avant cette dernière étape.

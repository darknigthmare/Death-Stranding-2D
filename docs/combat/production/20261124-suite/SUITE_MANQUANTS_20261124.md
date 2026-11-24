# Personnages, projectiles, stages et boss : reprise intégrée

**Échos de la Grève · 24 novembre 2026 · PR #6**

La reprise atteint **113 PNG natifs actifs** : les 42 chemins du premier lot et 71 chemins supplémentaires. Les dernières corrections remplacent les versions précédentes aux mêmes chemins, sans être comptées une seconde fois. L’[inventaire actif](active-native-images.json) donne les dimensions, tailles, empreintes Git et manifestes de chaque version réellement retenue.

Les PNG finaux sont conservés exactement tels que générés. Les retouches de masque et de pose passent par le générateur d’images ; leur résultat constitue une nouvelle source native. L’intégration ne réencode, ne redimensionne ni ne réécrit ces pixels. Les cadrages et les échelles uniformes sont appliqués au moment du dessin.

## Images livrées et raccordées

| Ensemble | PNG actifs du 24 novembre | Contenu |
|---|---:|---|
| Sam, Fragile, Cliff et MULE | 20 | Cinq mouvements séparés par combattant : garde, accroupissement, montée, sommet et descente du saut |
| Die-Hardman | 11 | Cinq mouvements, posture, action, pas, impact reçu, portrait et saut de repli |
| Higgs | 11 | Même couverture ; masque crânien d’or corrigé sur les onze images |
| Heartman | 10 | Cinq mouvements et cinq images principales détaillées : posture, action, pas, impact et portrait |
| Mama · Atelier | 10 | Neuf poses de corps et portrait |
| Mama · Maintenance du viaduc | 10 | Neuf poses humaines et portrait, remplaçant les mannequins de cette tenue du fan-game |
| Portraits de soutien | 3 | Deadman, Amelie et Bridget dans les Archives de Bridges |
| Boss et véhicule | 14 | Repos, attaque et impact pour le lion, le Catcher aquatique, la baleine et le géant ; repos et état endommagé pour le camion MULE |
| Projectiles et effets de duel | 7 | Bola, goudron, tir de Cliff, rappel, portique, impulsion et mémoire |
| Effets des boss | 4 | Orbe de goudron, pointe de goudron, anneau chiral et trait MULE |
| Port Knot City | 6 | Panorama et cinq plans indépendants |
| Incinérateur de la région Est | 6 | Panorama et cinq plans indépendants |
| Récit de Die-Hardman | 1 | Scène de rivalité détaillée, conservant sa composition et ses accessoires |
| **Total actif** | **113** | **Chaque chemin est compté une fois** |

Les images des combattants totalisent **72 fichiers : 67 poses de corps et 5 portraits**. Les quatorze états des boss prévus pour ce lot sont tous présents. Les huit combattants conservent leurs campagnes ; les trois portraits de soutien n’ajoutent pas de kit de combat. Le catalogue principal déclare **225 chemins d’image uniques**, et le catalogue Boss en ajoute **18**, soit **243 chemins** vérifiés dans l’arbre Git préparé. Ces catalogues comprennent aussi des sources historiques hors des 113 PNG de cette reprise.

Les planches de pas et d’impact de Sam et Cliff ont été inspectées : chacune contient quatre variantes peintes cohérentes avec son personnage. Aucun élément de ces planches ne manque. Une animation plus ample constituerait une amélioration distincte.

## Personnages, tenue Viaduc et géométrie

Mama Atelier, Die-Hardman, Higgs et Heartman utilisent leurs nouvelles images dans la sélection et les poses du combat. Mama Viaduc possède maintenant son propre ensemble humain : casque ocre à lampe cyan, lunettes, tenue de maintenance, scanner et bobine de câble. Cette tenue vient du fan-game ; elle n’est pas présentée comme un costume officiel.

Le moteur possède **67 crops de poses natives** : **58 pour les combattants de base et 9 pour Viaduc**. Les sept effets de duel et les dix-huit sources des boss/effets disposent aussi de leur géométrie. Le cadrage visible reçoit trois pixels de marge lorsque les limites de l’image le permettent.

Le moteur choisit la géométrie de l’image effectivement disponible. Quand une pose Viaduc charge encore, son repli Atelier utilise le crop Atelier. Les tenues historiques sans géométrie native conservent leur traitement. La même résolution s’applique en duel, en Boss Battle et au fantôme du faux départ de Higgs.

Les points d’appui suivent les mesures propres à chaque source : étendue de semelle, centroïde de contact ou bottes mesurées séparément. Pour Higgs accroupi, la cape descend sous les semelles ; le calage au sol utilise les bottes, sans déplacer le personnage à partir du bas de cape. Les poses aériennes utilisent un pivot de dessin, sans prétendre décrire un contact au sol.

Les facteurs de hauteur conservent les proportions de la tête et du torse avec une échelle identique sur les deux axes. La fente de Higgs utilise 0,80, son saut replié 0,72 et son accroupissement corrigé 0,70. Les ratios Viaduc sont mesurés à partir de la largeur peinte du casque. Ces réglages restent des choix de calage à examiner dans une scène réelle.

## Stages et salon privé

Port Knot et l’incinérateur portent le catalogue à **douze lieux et treize configurations**, avec **65 couches de décor**. Chaque nouvelle configuration possède un panorama de repli, cinq plans en parallaxe, un ancrage de sol et son profil d’ambiance. Les proportions des plans sont conservées.

Le salon privé accepte les deux nouveaux identifiants de lieu. Son service de ressources traite les nouveaux répertoires imbriqués et son empreinte de version inclut les modules et images des boss.

## Boss Battle

Le menu ouvre six rencontres : **Catcher léonin, Catcher aquatique, baleine, géant, camion MULE et convoi MULE**. Les attaques comportent une annonce avant les dégâts. Les rencontres avec les Échoués possèdent une seconde phase ; les missions MULE ajoutent les colis et leur livraison. Le convoi enchaîne deux vagues.

Les huit combattants disposent de leurs commandes et de trois signatures directionnelles adaptées au mode. Pause, perte de focus, commandes tactiles, résultats et revanche sont raccordés. Une sauvegarde distincte, `echos.boss.v1`, conserve les résultats par rencontre, combattant et difficulté, ainsi qu’une reprise valide.

La revue a corrigé des problèmes de reprise et de combat : camion vaincu pendant sa charge, Scan MULE au bord du terrain, rappels sans repère valide, orientation d’une attaque lors d’un changement de côté et zone vulnérable du géant penché. Les règles et les vérifications figurent dans la [fiche Boss Battle](BOSS_BATTLE_20261124.md).

## Vérifications réellement exécutées

Les recettes de cette reprise exécutent **le véritable code du jeu en mémoire avec des méthodes Canvas instrumentées**. Elles contrôlent les règles, les images sélectionnées et les calculs de dessin ; elles ne produisent pas une composition de pixels dans un navigateur.

| Contrôle | Résultat |
|---|---|
| Catalogue principal et Boss | 243 chemins présents dans l’arbre préparé |
| Géométrie des combattants | 67 crops finis, non vides et contenus dans leurs dimensions natives |
| Mama Atelier, Die-Hardman, Higgs, Heartman et Mama Viaduc | 10 cas personnage/tenue × côté, chacun couvrant neuf poses |
| Chargement partiel de Viaduc | Repli sur la bonne source Atelier avec sa propre géométrie, en duel et Boss |
| Deux nouveaux stages | 16 cas : duel et dojo, deux directions, effets normaux et réduits |
| Simulation des duels | 72 checkpoints identiques au runtime de référence `8afb60d` |
| Boss Battle | 18 sections réussies, 6 victoires obtenues par commandes, 1 550 checkpoints échantillonnés |
| Chemins de dessin Boss | 126 images demandées, dont les 14 états des boss et les 4 effets |
| Disponibilité de Viaduc en Boss | 20 comparaisons de checkpoints identiques |
| Revue indépendante de résolution tenue/base | 72 cas ciblés réussis sur les vraies fonctions de dessin |
| Salon privé | Création, préparation, lancement, commandes, déconnexion, reprise et résultat ; deux nouveaux stages acceptés |

La revue de résolution tenue/base utilise des images synthétiques aux crops volontairement distincts pour détecter le choix d’une mauvaise géométrie. Elle complète les contrôles d’intégration utilisant les métadonnées des PNG produits. Elle ne constitue pas une comparaison de pixels.

Les dimensions natives ont été relevées dans les sources PNG et consignées dans les manifestes ; les contrôles d’alpha applicables sont détaillés dans chaque manifeste. Les anciennes sources hors de ces manifestes utilisent des dimensions de substitution explicites dans la recette hébergée. Les vérifications de proportions natives ne sont donc pas étendues à ces sources historiques.

**Contrôles encore à exécuter sur une machine :** serveur HTTP et transports réseau réels, rendu Canvas natif des nouvelles sources, navigation et commandes dans un navigateur, revue optique des poses en scène et comparaison systématique aux images du jeu officiel. Les scripts locaux sont livrés. Les anciennes preuves Canvas du premier lot restent rattachées à ce premier lot.

## Fidélité et manques restant ouverts

Le suivi distingue la couverture d’images de la fidélité exacte aux références. Les manifestes conservent les prompts, les sources consultées, les dimensions, les empreintes et les mesures de transparence.

- Les boss dérivent de références du premier Death Stranding/Director’s Cut.
- Port Knot et l’incinérateur s’appuient sur des captures du jeu prises par des joueurs. Leur composition latérale et la piste de combat sont des adaptations.
- Le haut du corps de Mama possède une référence officielle identifiée ; les parties cachées, certaines bottes et les côtés éloignés restent moins documentés.
- Les onze images de Higgs utilisent maintenant le masque crânien d’or issu d’une capture DS1 inspectée. L’image est conservée sur un hébergement secondaire ; son équivalence binaire avec une publication officielle n’est pas établie. La correction du masque ne certifie pas tous les détails de la capuche, du costume ou des équipements.
- Viaduc et la scène de rivalité de Die-Hardman conservent les choix de création de ce projet.

| Élément | État |
|---|---|
| Heartman · cinq images principales | Livrées, intégrées et contrôlées ; comparaison canonique complète encore ouverte |
| Mama · Maintenance du viaduc | Dix images humaines livrées ; neuf poses et chargement partiel contrôlés dans les deux moteurs |
| Higgs · masque | Onze images corrigées : portrait, posture, action, pas, impact, saut de repli, garde, accroupissement et trois phases aériennes |
| Die-Hardman · rivalité | Nouvelle image native intégrée ; composition, main, clé, manche et silhouettes de la scène conservées |
| Lockne | Référence inspectable non récupérée avec les accès disponibles ; audit conservé, portrait non produit |
| Vues gauche asymétriques | Le moteur applique encore un miroir ; vues dédiées nécessaires pour préserver les accessoires du bon côté |
| Comparaison 1:1 | À poursuivre pour les détails non documentés et les adaptations |
| Validation visuelle finale | À effectuer dans un navigateur, sur les tailles d’écran cibles |

Les variantes prévues dans les lots livrés sont intégrées. **Une certification globale 1:1 de tout le catalogue reste ouverte.**

## Accès et traçabilité

- [Galerie unifiée des 113 images](index.html), avec fond clair, sombre ou damier.
- [Inventaire des versions natives actives](active-native-images.json).
- [Géométrie et comparaison Viaduc](../20261124-viaduc/mama-viaduc-contact.html).
- [Rapport d’intégration](integration-validation.json).
- [Rapport Boss](boss-simulation-report.json).
- [Revue indépendante des tenues](native-outfit-independent-review.json).
- [Recette du service de salon](relay-validation.json).
- [Premier lot et contrôles initiaux](../20261124/REPRISE_ASSETS_20261124.md).
- [PR #6](https://github.com/darknigthmare/Death-Stranding-2D/pull/6).

Commandes locales : `node modes/echos-de-la-greve/qa/suite-integration-20261124.cjs`, `node modes/echos-de-la-greve/qa/boss.cjs` et `node modes/echos-de-la-greve/qa/reseau-logique.cjs`. Le contrôle de pixels des arènes utilise `qa/arenes-canvas.cjs` avec `@napi-rs/canvas` ; les recettes existantes de PNG utilisent `sharp`.

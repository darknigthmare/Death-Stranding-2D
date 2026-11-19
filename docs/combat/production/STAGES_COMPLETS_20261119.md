# Les dix arènes disposent de leurs cinq plans — 19 novembre 2026

Le lot ferme les **11 images manquantes** de la sélection existante : le registre
passe de **39 à 50 couches**, pour **10 arènes à cinq plans**. Les dix panoramas
de base restent présents et servent de secours pendant le chargement. Les
nouveaux décors sont accessibles par les mêmes sélections en Versus et au dojo.

## Livraison

| Arène complétée | Images ajoutées | État des plans |
|---|---|---:|
| Camp MULE | Ciel, paysage et camp lointains, sol | 5/5 |
| Laboratoire de Heartman | Mobilier distant, sol | 5/5 |
| Usine en ruines | Sol | 5/5 |
| Abri sous la pluie temporelle | Abri et vallée lointains, sol | 5/5 |
| Bassin de goudron | Ciel, paysage industriel distant, sol du quai | 5/5 |

La Grève, le terminal, le champ de bataille, l’atelier de Mama et le col de
Mountain Knot avaient déjà leurs cinq plans. Le registre complet est conservé
dans [l’inventaire des cinquante couches](stage-layers-inventory-20261119.json).

Les onze PNG totalisent **20 091 683 octets**. Les deux ciels opaques font
1 672 × 941 pixels ; les quatre lointains et cinq sols font 2 172 × 724 pixels
avec un canal alpha. Chaque fichier est une copie exacte de la sortie ImageGen.
Les prompts, références, empreintes SHA-256 et dimensions réelles sont archivés
dans [la provenance du lot](../../../art/sources/echos-de-la-greve/stage-completion-20261119.json).

## Calage dans le jeu

Le bord de chaque sol a été mesuré sur les pixels effectivement produits. Le
seuil alpha 128 détermine la première rangée visible ; la médiane des colonnes
donne l’ancre. La ligne de contact du moteur reste à 588 dans une vue 1 280 × 720.

| Sol | Rangée source retenue | Hauteur native |
|---|---:|---:|
| Camp MULE | 302 | 724 |
| Heartman | 225 | 724 |
| Usine | 202 | 724 |
| Timefall | 235 | 724 |
| Bassin | 213 | 724 |

La sortie Timefall varie d’un pixel entre certaines colonnes ; les quatre
autres bords ont la même rangée sur toute leur largeur au seuil retenu. Les
surfaces pleines ont principalement un alpha compris entre 240 et 254 : elles
sont quasi opaques, et leur alpha original est conservé. Le calage vertical des
lointains et du plan intermédiaire de l’usine évite les jours entre les surfaces.
Le mobilier de Heartman rejoint également la surface de l’arène.

Les vitesses des cinq plans sont 0,14 / 0,27 / 0,43 / 0,62 / 0,8 fois le
déplacement de caméra. Les effets réduits abaissent leur amplitude à 20 %.

## Vérification

Le contrôle d’inventaire indépendant retrouve les 50 couches et décode les
**162 chemins d’images** actuellement enregistrés. Le test navigateur historique
`qa/arenes.cjs` conserve ses exigences ; il n’a pas été affaibli pour faire
accepter un lot incomplet.

Le contrôle natif `qa/arenes-canvas.cjs` exécute le véritable `fight.js` avec
`@napi-rs/canvas` : **80 cas**, soit dix arènes, deux modes, deux directions et
deux réglages d’effets. Il vérifie l’ordre des cinq images dessinées, leurs
proportions, les vitesses relatives, le débord des bords, les déplacements des
combattants, la ligne de sol et sa couverture jusqu’au bas de l’écran.

```sh
node modes/echos-de-la-greve/qa/arenes-canvas.cjs
node modes/echos-de-la-greve/qa/assets.cjs
```

Le premier script nécessite `@napi-rs/canvas`, le second `sharp`. La variable
facultative `ARENA_SCREENSHOTS` choisit le dossier des rendus. La sortie JSON
et les vues gauche/droite sont conservées dans
[les rendus de contrôle](../apercus/stages-completes-20261119/).

Chromium n’a pas pu être lancé dans cet environnement : le contrôle natif
valide le moteur et ses images, sans prétendre valider le parcours des menus
dans un navigateur. Le lot récupéré avait également passé le contrôle logique
du relais réseau, des corrections de commandes tardives et des ressources.

## Références et limites

Les panoramas existants du fan-game servent de références de composition et de
palette. Les personnages, interfaces et règles de combat ne sont pas modifiés
par ce lot. La complétude des cinquante plans est vérifiée ; la fidélité 1:1 aux
plans officiels nécessite toujours une comparaison avec les scènes sources.
Le col Mountain Knot conserve son statut de composition originale du mode.

La récupération locale a été publiée d’abord dans la
[PR #1](https://github.com/darknigthmare/Death-Stranding-2D/pull/1), au commit
`97a9b210c3ce30bbf50a2ca6271d33f9ab80842f`. Ce lot prolonge la même branche.

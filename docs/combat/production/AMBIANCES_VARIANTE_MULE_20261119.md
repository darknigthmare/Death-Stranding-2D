# Ambiances des arènes, camp MULE sec et Duel originel

## Livraison du 19 novembre 2026

Ce lot prolonge la livraison des cinquante plans des dix lieux. Il ajoute une
variante visuelle complète du camp MULE, les ambiances sonores des arènes du mode
principal et l’accès aux six décors prévus dans le Duel originel.

| Ensemble | Contenu livré |
|---|---|
| Camp MULE sec | Un panorama opaque et cinq plans PNG indépendants, dérivés du camp existant. |
| Catalogue principal | Dix lieux, onze configurations sélectionnables et 55 plans référencés. |
| Raccords des anciens décors | Grève, terminal, champ de bataille et col recalés pour supprimer les bandes de ciel au-dessus du sol. |
| Son des arènes | Onze profils synthétisés : fond continu discret et événements locaux en stéréo. |
| Réglages | Volume d’ambiance indépendant, préférence enregistrée, bouton Son commun aux combats et aux décors. |
| Duel originel | Six décors en duel direct et entraînement, choix conservé pour la revanche et les prochains lancements. |

## Essayer les ajouts

Dans **Échos de la Grève**, ouvrir **Versus** ou **Entraînement**, puis choisir
**Camp des MULEs · temps sec**. La galerie des arènes propose aussi son aperçu et
le bouton **S’entraîner ici**. Les nouveaux tournois et les salons privés peuvent
utiliser cette configuration.

Le curseur **Ambiance du décor** se trouve dans la sélection, les commandes et la
pause du mode principal. Il règle uniquement le décor. Le bouton **Son** coupe
l’ensemble. Le salon privé reprend les mêmes préférences et expose également les
deux contrôles. Un volume d’ambiance nul conserve les sons des techniques lorsque
le son général reste activé.

Depuis **Duel originel · Sam / Higgs**, choisir le décor du duel direct ou de
l’entraînement. Les six lieux sont la Grève, le centre de distribution, le camp
MULE, l’abri Timefall, le champ de bataille et le bassin de goudron. Les deux récits
Sam et Higgs se déroulent toujours sur la Grève.

## Variante sèche du camp

La variante conserve la vallée basaltique, la cascade, les tentes à gauche et la
balise à droite. La lumière devient plus claire ; le gravier reste mat, sans
flaques, et la piste est tassée. Les caisses et câbles du plan intermédiaire
encadrent les combattants. Le premier plan garde une caisse et une sangle à gauche,
une bâche et des piquets à droite, sans fermer le centre.

Le camp d’origine conserve ses images humides. Sa météo est maintenant la pluie,
en accord avec ces images. Le nouvel identifiant `mule-camp-dry` utilise la
poussière légère et porte `variantOf: 'mule-camp'`. Les identifiants déjà présents
dans les récits, tableaux et replays ne changent pas.

Le panorama et le ciel mesurent **1672 × 941**. Les quatre bandes transparentes
mesurent **2172 × 724**. Leurs pixels et leurs dimensions sont ceux du générateur.
Le sol a une entrée d’alpha constante à **300 / 724**, alignée sur la ligne de jeu
à 588. Les ancrages du lointain et du plan intermédiaire sont respectivement
**679 / 724, base 598** et **686 / 724, base 592**. Ils recouvrent le bord du sol
pour empêcher le ciel de transparaître entre les plans.

Les cinq vitesses de parallaxe restent **0,14 / 0,27 / 0,43 / 0,62 / 0,8**. Le
mouvement réduit conserve 20 % de leur amplitude. Le panorama sert de fond pendant
le chargement des couches. Les PNG d’origine sont archivés dans le catalogue joué,
et leurs empreintes sont contrôlées contre les sorties du générateur.

- [Prompts, provenance, mesures et revue visuelle](../../../art/sources/echos-de-la-greve/mule-camp-dry-20261119/).
- [Inventaire des 55 couches](stage-extension-inventory-20261119.json).
- [Rendus du lot](../apercus/stage-extension-20261119/).

### Raccords corrigés dans les décors existants

La revue complète a retrouvé quatre bandes uniformes entre le bas transparent
des images et la surface jouée : environ 40 pixels sur la Grève, une dizaine au
terminal et une vingtaine sur le champ de bataille et au col. Le registre commun
est maintenant calé sur les limites visibles des images, avec un léger recouvrement
du sol. Les images elles-mêmes restent inchangées. La correction profite aussi aux
trois lieux concernés du Duel originel.

| Lieu | Ancre et base du lointain | Ancre et base de l’intermédiaire |
|---|---|---|
| Grève | 680 / 724 ; 594 | 557 / 724 ; 596 |
| Terminal | 680 / 724 ; 594 | 701 / 724 ; 594 |
| Champ de bataille | 1 ; 594 | 696 / 724 ; 594 |
| Col de Mountain Knot | 707 / 724 ; 594 | 687 / 724 ; 594 |

Le contrôle raster rejoue les deux appels de dessin réels sur une bande transparente
de quatre pixels juste au-dessus du sol. Il vérifie que leurs pixels couvrent cette
bande sur toute la largeur. Il protège les quatre raccords corrigés et celui du camp
sec, en complément des contrôles de position et de proportion des couches.

## Ambiances sonores du mode principal

Les sons sont synthétisés par Web Audio. Aucune piste issue d’un jeu commercial
n’est ajoutée. Le volume d’ambiance initial est de 35 %. Un fond filtré discret
situe le lieu ; un événement ponctuel est placé dans l’espace stéréo en fonction
de son emplacement dans le décor et de la caméra.

| Lieu ou variante | Fond et événement local |
|---|---|
| La Grève | Souffle grave et retour du ressac. |
| Centre de distribution | Ventilation, relais grave et mouvement d’une porte. |
| Champ de bataille | Vent sourd et bref souffle radio. |
| Camp MULE humide | Pluie fine et deux notes de balise. |
| Camp MULE sec | Vent plus mat et deux notes de balise. |
| Laboratoire de Heartman | Fond intérieur feutré, ronronnement et note de moniteur. |
| Atelier de Mama | Souffle mécanique, moteur et tension du treuil. |
| Usine en ruines | Fond industriel grave et décharge d’une conduite. |
| Abri Timefall | Pluie sous l’auvent et goutte proche. |
| Bassin de goudron | Fond grave et bulle remontant à la surface. |
| Col de Mountain Knot | Vent filtré et rafale. |

La pause, la sortie du duel, la coupure du son et la fin arrêtent les sources et
déconnectent leurs nœuds. Le réseau suspend le son lorsque la connexion n’est plus
active ou que l’onglet perd le premier plan, sans arrêter sa simulation. Une
correction silencieuse ne déclenche ni source ni reprise du contexte audio. La
présentation d’une fin atteinte pendant cette correction termine les voix restantes.

L’horloge audio et le générateur de bruit restent hors des checkpoints et des
entrées enregistrées. Un retour après pause ne rattrape pas les événements sonores
manqués. Avec les effets réduits, le fond est atténué et les événements ponctuels
du décor sont supprimés. Si Web Audio est indisponible ou si le navigateur refuse
la reprise automatique, le duel continue et une interaction ultérieure peut
autoriser le son.

## Décors du Duel originel

Le prototype réutilise les registres et images du mode principal par leurs chemins
relatifs. Il conserve sa vue **1120 × 630** et sa ligne de sol à **528**. Les bases
des plans sont transposées autour de cette ligne ; leurs proportions sont
préservées et les marges couvrent les deux limites de la caméra historique.

Le décor choisi est visible sur l’écran de combat. Les préférences de ce prototype
utilisent leur propre sauvegarde. La revanche reprend le lieu joué ; les récits
restent liés à la Grève. Le fichier du moteur historique n’est pas modifié par ce
lot. Les détails de commande et d’entraînement sont affichés dans son interface.

[Les douze vues de contrôle du Duel originel](../apercus/duel-originel-arenes-20261119/)
complètent les vingt-deux vues du mode principal : **34 aperçus** sont livrés dans
ce lot.

## Vérification et limites

| Contrôle exécuté | Résultat |
|---|---|
| Ressources déclarées | 168 chemins uniques présents et images entièrement décodées. |
| Moteur principal | 88 cas : 11 configurations × 2 modes × 2 directions × 2 réglages d’effets. |
| Raccords raster | Bande y = 584–587 couverte sur les cinq décors ciblés ; alpha minimal observé entre 252 et 255. |
| Duel originel | 48 cas de rendu, 12 parcours choix/duel/revanche et 2 récits ; entraînement, commandes et persistance vérifiés. |
| Audio et interfaces | 11 profils, sources bornées, arrêt complet, autoplay, rollback silencieux, reprise réseau et volume enregistré. |
| Relais réseau | Création, lancement de la variante sèche, reprise, résultat et fermeture ; PNG servis avec le bon type et les octets exacts. |
| Déterminisme | Checkpoint complet identique après une commande tardive corrigée au pas 200 ; l’audio ne consomme pas les RNG du jeu. |
| Hygiène des fichiers | Syntaxe JavaScript et contrôle des espaces du diff. |

Les [preuves de recette](stage-extension-validation-20261119.json), le
[rapport audio détaillé](ambience-qa-20261119.json) et les rapports associés aux
captures conservent les résultats et les empreintes des sources concernées.

Les commandes de recette sont exécutables depuis la racine du dépôt :

```sh
node modes/echos-de-la-greve/qa/assets.cjs
node modes/echos-de-la-greve/qa/arenes-canvas.cjs
node modes/echos-de-la-greve/qa/ambiances.cjs
node modes/echos-de-la-greve/qa/duel-originel-arenes.cjs
node modes/echos-de-la-greve/qa/reseau-logique.cjs
git diff --check
```

Canvas natif exécute les vrais rendus des jeux. Les contrôles audio utilisent un
contexte Web Audio simulé pour suivre les sources, les connexions et les horaires.
Les parcours d’interface utilisent les vrais scripts avec un DOM de test. Ces
vérifications ne remplacent pas une écoute ni une recette interactive dans un
navigateur : Chromium ne démarre pas dans cette session, car sa socket de profil
est refusée par l’environnement.

La revue visuelle des deux compositions du camp sec confirme un sol continu, des
pieds lisibles, un centre dégagé et l’absence de liseré coloré visible après
composition. La comparaison canonique avec les plans du jeu officiel reste un
travail distinct, décrit dans la bible.

## Suite de production identifiée

Les dix lieux prévus par les deux bibles ont leurs cinq plans. Le prochain manque
graphique concerne surtout les combattants : poses dédiées de garde et
d’accroupissement pour les sept personnages autres que Mama, puis trois phases de
saut pour ces mêmes personnages. Les vues gauche dessinées séparément, les poses
de victoire et d’atterrissage restent aussi à produire. Ce lot ne les compte pas
comme livrées.

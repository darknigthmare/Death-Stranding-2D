# Gestes de défi et présentation du choix

Date : 27 novembre 2026. Application : Échos de la Grève, Death Stranding 2D.

Ce lot applique une partie jouable des rubriques 31–32 de l’extension 01. Il conserve les huit kits, leurs coups, leurs routes, les neuf modes et les rencontres Boss. Les gestes sont des créations du simulateur adaptées aux apparences des personnages ; leurs noms ne sont pas des noms officiels de techniques de Death Stranding.

## 1. Geste de défi jouable

L’action logique est `taunt`. Elle existe dans les duels locaux de `StrandFight`, y compris le dojo et les duels des parcours. Elle n’est pas transmise au salon privé et n’est pas disponible dans le moteur séparé des rencontres Boss.

| Propriété | Règle livrée |
|---|---|
| Commandes par défaut | B pour J1, P pour J2, clic du stick gauche L3, bouton tactile « Défi ». |
| Remappage | La commande figure dans les trois profils locaux, indépendamment pour J1/J2. |
| Déclenchement | Au sol, hors attaque, garde, accroupissement, étourdissement, récupération de garde et ruée. |
| Entrée | 10 pas de simulation. |
| Tenue | 28 pas de simulation. |
| Sortie | 16 pas de simulation. |
| Durée totale | 54 pas à 60 Hz, soit 0,9 seconde hors pauses et arrêts sur impact. |
| Risque | Le combattant reste exposé aux frappes, projections et projectiles. Aucune invulnérabilité. |
| Déplacement | Le geste immobilise les commandes de marche. Une direction maintenue reprend son effet à la fin. Les poussées adverses restent celles du moteur. |
| Annulation volontaire | Aucune avant la fin des 54 pas. Une attaque ou un saut appuyé pendant le geste n’est pas mis en attente. |
| Interruption adverse | Un impact met fin au geste et applique les dégâts, l’étourdissement et le recul ordinaires. Maintenir la garde pendant le geste ne le protège pas. |
| Ressources | Aucun gain de vie, de jauge ou de dégâts propre au geste. La récupération chirale ordinaire du mode continue à son rythme existant ; la récupération passive d’équilibre attend la fin du geste. |
| Répétition | Le maintien de B/P/L3 ne boucle pas le geste. Il faut relâcher puis déclencher à nouveau. |
| Fin de manche | KO, résultat, nouvelle manche, sortie et changement de zone nettoient l’état. |
| Pause | Elle fige le compteur comme le reste de la simulation. |
| Audio | Aucun doublage ou son spécifique nouveau. Le geste ne crée pas de voix répétitive. |

Le geste ne supprime pas les objets ou projectiles déjà actifs du kit. Une caisse MULE, une balise ou une émission existante garde son comportement ordinaire ; aucun nouvel objet offensif n’est créé par cette commande.

### Profils de personnalité

| Combattant | Nom du geste | Présentation prévue par le profil |
|---|---|---|
| Sam | Salut du porteur | Pouce levé, autre main sur la sangle. |
| Fragile | Sous mon parapluie | Paume ouverte invitant l’adversaire, parapluie fermé tenu bas. |
| Higgs | Le public attend | Salut théâtral, bras ouverts. |
| Cliff | Salut de section | Deux doigts portés à la tempe. |
| MULE | Scan prioritaire | Scanner portatif levé. |
| Die-Hardman | Gant ajusté | Ajustement du gant. |
| Mama | Mise au point | Ajustement des lunettes. |
| Heartman | Un instant | Consultation de l’appareil au poignet. |

`presentation-assets.js` déclare les PNG réellement livrés. Le renderer charge uniquement les entrées présentes. Chaque pose utilise sa géométrie native : `src`, `crop`, `anchorX`, `baselineY`, `heightRatio`. La pose de tenue s’affiche pendant la phase centrale ; entrée et sortie utilisent la posture existante. Il s’agit d’un cycle d’états jouable avec poses fixes, pas d’une animation dessinée image par image. L’inventaire et la recette raster du lot qualifient séparément les images produites.

Une pose dédiée absente ou non décodée se replie sur la posture du même combattant. Une tenue alternative connue, notamment **Mama — Maintenance du viaduc**, conserve ses propres poses : le PNG de geste de la tenue d’atelier ne remplace jamais son costume. Une ancienne valeur de tenue laissée dans l’interface après avoir changé de personnage ne bloque pas le geste d’un personnage qui ne possède pas cette tenue.

## 2. Choix, aperçu, confirmation et désélection

Les sélections ordinaires, Boss Battle et Boss Rush affichent un panneau « Liaison des combattants ». Il montre un emplacement par joueur ou adversaire concerné : J1 et, selon le mode, J2, IA ou mannequin. Les combattants identiques restent permis et les tenues des deux emplacements sont indépendantes.

| État | Comportement livré |
|---|---|
| Consultation | Survol ou focus d’un portrait : aperçu temporaire, sans modifier le choix confirmé. Le texte signale ce statut. |
| Confirmation | Le clic change immédiatement le combattant et les options du mode. L’animation ne bloque jamais une commande. |
| Attente | Le combattant confirmé reste affiché avec son nom, sa version et le nom du geste. |
| Remplacement | L’ancienne présentation s’efface en reculant et en descendant légèrement ; la nouvelle arrive latéralement. La sortie n’est pas la lecture inverse de l’entrée. |
| Costume | L’aperçu prend les poses et le nom de la tenue réellement sélectionnée. |
| Retour à la sélection confirmée | Quitter un aperçu rétablit les emplacements confirmés. |
| Départ de l’écran | Tous les temporisateurs de présentation sont annulés. Aucun effet ou aperçu du roster ne subsiste dans le combat. |
| Effets réduits | Les informations et choix restent identiques ; les sorties fantômes et mouvements sont supprimés. La préférence système de réduction de mouvement est également respectée par le CSS. |

L’entrée de présentation dure 260 ms. La sortie complète dure 420 ms. Une nouvelle navigation remplace immédiatement la transition précédente ; il reste au plus un temporisateur actif dans le panneau. Ces durées sont celles de l’interface, distinctes des 54 pas de simulation du geste en combat.

Le panneau anime la position et l’opacité des poses natives. Il ne revendique pas une série de dessins de sélection, de désélection, de rangement d’arme ou de rappel de compagnon. Les sélections d’équipes, assistances et relais restent décrites dans les fiches de conception de l’extension ; ce lot ne les active pas.

## 3. Sauvegardes, replays et réseau

Les préférences restent sous `echos.input.v1`. Au chargement d’un ancien profil sans `taunt`, la migration préserve les touches existantes, les noms des profils et le profil actif. Elle affecte la nouvelle commande à une touche libre, puis enregistre le résultat. Si B ou P appartient déjà à une ancienne commande, cette commande n’est pas déplacée. Si le stockage refuse l’écriture, les commandes migrées restent utilisables pour la session et le statut de sauvegarde le signale.

Les dix commandes historiques des replays gardent exactement leur codage. Les enregistrements sans commande de geste restent en version 1. Lorsqu’un appui ou relâchement `taunt` doit être enregistré, la version 2 ajoute les codes 40/41 pour J1 et 42/43 pour J2 ; les codes historiques de J2 ne sont pas décalés. Un lecteur version 1 ne peut donc pas interpréter par erreur un geste comme un déplacement.

Le salon privé garde son protocole courant. Le contrôleur réseau filtre `taunt`, les listes de commandes du salon l’excluent et `StrandFight` le refuse lorsque l’horloge réseau est active. Les checkpoints historiques ne reçoivent aucun nouvel état de geste par cette voie. Ce choix ne constitue pas une validation de taunts en ligne.

Le lien **Dossiers de liaison** est ajouté à l’accueil. Son moteur de progression et ses contenus ont leur propre rapport ; la présentation ne modifie pas les accès aux combattants, arènes ou modes existants.

## 4. Vérification

Commandes exécutées depuis la racine :

```sh
node modes/echos-de-la-greve/qa/presentation.cjs --output=docs/combat/production/20261127-extensions/presentation-verification.json
node modes/echos-de-la-greve/qa/commandes.cjs --output=docs/combat/production/20261127-extensions/commandes-verification.json
node modes/echos-de-la-greve/qa/lessons.cjs --output=docs/combat/production/20261127-extensions/lessons-verification.json
NODE_PATH="$CODEX_PRIMARY_RUNTIME_NODE_MODULES" node modes/echos-de-la-greve/qa/presentation-assets.cjs
node outils/generer_catalogue_combat.cjs
node modes/echos-de-la-greve/qa/moves-domain.cjs > docs/combat/production/20261127-extensions/moves-domain-verification.json
```

La première recette contrôle le vrai moteur et le vrai code de l’application avec un DOM/Canvas simulé : huit cycles complets, vulnérabilité aux frappes et au goudron, pause, conditions d’accès, absence de gain propre, commandes clavier/tactiles/L3 synthétiques, migration sans écrasement, exclusion réseau, choix indépendants et réduction de mouvement. Elle compare 548 instantanés lors de relectures des versions 1 et 2, effectue 40 changements rapides et vérifie la tenue de Mama face à une pose d’atelier disponible.

La recette des commandes couvre 22 paires joueur/action et conserve ses contrôles des neuf modes locaux, du clavier, des profils, des collisions, des relâchements, du focus, des manettes synthétiques et du module réseau. Les anciennes touches de fixture B ont été remplacées par une touche libre afin de tenir compte du nouveau raccourci par défaut ; les assertions de collision restent actives.

Les leçons gardent leurs dix groupes réussis et leurs 40 exécutions. Leur ancienne fixture de remappage sur B a également été déplacée vers une touche libre, sans supprimer le contrôle de collision. Le catalogue des actions a été régénéré depuis le moteur : trente attaques et sept actions utilitaires, dont le geste. Les dix groupes de `moves-domain.cjs` passent avec le vrai commit historique `2250b7c1b54b445637e0c9354133e6fecbc325de` pour la comparaison des routes ; aucune base de substitution n’a été utilisée.

### Rendu des poses natives

`presentation-native.json` consigne **17 captures Canvas natives à 1280 × 720** : les huit combattants vers la droite et vers la gauche, plus Mama en tenue de viaduc. Les gestes sont déclenchés par les commandes ordinaires du moteur, sans modifier les états des combattants dans la recette. Le renderer utilise les huit PNG dédiés et leurs crops mesurés ; le signe de la transformation native vérifie chaque orientation. La recette décode 121 chemins d’image et vérifie les empreintes inchangées des sources. Les polices natives sont disponibles dans cet environnement et le HUD est effectivement rendu.

L’inspection visuelle a porté sur `sam-right.webp`, `fragile-left.webp`, `higgs-right.webp`, `cliff-left.webp`, `mule-right.webp`, `mama-left.webp`, `heartman-right.webp`, `diehardman-left.webp` et `mama-viaduc-preserved.webp`, dans `presentation-renders/`. Dans ces images, les poses entières restent visibles, leurs pieds sont au niveau du sol, les noms des gestes sont lisibles et les fonds sont transparents avant composition. Mama atelier ne présente pas de rectangle ou de halo opaque dans le rendu composé ; Mama viaduc conserve son casque et sa tenue, sans emprunter la pose d’atelier. Aucun réglage correctif des ancrages n’a été nécessaire après cette inspection.

Ces rapports ne sont pas une validation visuelle HTML dans Chromium ni un essai de manette physique. Le wrapper Chromium du poste ne possède pas son exécutable ; la vérification navigateur n’est pas annoncée comme réussie. Les captures natives prouvent le rendu Canvas et le placement des poses ; elles ne certifient pas la mise en page du sélecteur dans un navigateur ni une identité artistique parfaite avec chaque référence canonique.

### Manques conservés

- Animation dessinée image par image des huit gestes et des cycles du roster.
- Geste propre à la tenue de Mama au viaduc et autres variantes futures.
- Taunts spécialisés contre rivaux/alliés et voix produites.
- Assistance, tag, relais, super et Rupture de lien d’équipe effectivement jouables.
- Extension du protocole réseau et recette à deux navigateurs pour les taunts.
- Réception humaine de la mise en page, des contrôles matériels et de la fidélité fine.

Ces limites ne sont pas comptées comme des fonctions produites par la présence des profils ou des deux guides.

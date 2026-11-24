# Personnages, projectiles, stages et boss : suite intégrée

**Échos de la Grève · 24 novembre 2026 · PR #6**

Cette livraison raccorde les sources déjà publiées et complète les variantes restantes des boss ainsi que les six images principales de Higgs et les cinq images principales de Heartman. Le total du 24 novembre atteint **102 PNG natifs**, dont **60 dans cette suite**. Les images restent dans leur format de génération ; aucun réencodage ou changement de pixels n’a été appliqué pendant l’intégration.

## Contenu livré

| Ensemble | PNG de cette suite | Utilisation |
|---|---:|---|
| Mama · Atelier | 10 | Posture, action, pas, impact, portrait, garde, accroupissement et trois phases du saut |
| Die-Hardman | 6 | Posture, action, pas, impact, portrait et saut de repli ; ses cinq mouvements du premier lot sont conservés |
| Higgs | 6 | Posture, action, pas, impact, portrait et saut de repli ; les cinq mouvements détaillés du premier lot restent disponibles |
| Heartman | 5 | Posture, action, pas, impact et portrait détaillés ; saut et mouvements du premier lot conservés |
| Deadman, Amelie, Bridget | 3 | Portraits présentés dans les Archives de Bridges |
| Catchers, baleine, géant, camion | 14 | Tous les états prévus pour les cinq familles de boss/véhicule |
| Effets des boss | 4 | Orbe de goudron, pointe de goudron, anneau chiral, trait MULE |
| Port Knot City | 6 | Panorama et cinq plans indépendants |
| Incinérateur de la région Est | 6 | Panorama et cinq plans indépendants |
| **Total de cette suite** | **60** | **Ajoutés aux 42 PNG du premier lot** |

Les quatorze états des boss sont : repos/attaque/impact pour le lion, le Catcher aquatique, la baleine et le géant ; repos/endommagé pour le camion MULE. **Aucune variante d’image ne manque dans ce lot de boss.**

Le catalogue principal du jeu déclare **225 chemins d’image uniques**. Le catalogue Boss ajoute quatorze images de boss et quatre effets. Les huit combattants du jeu conservent leurs fiches et campagnes ; les portraits de soutien n’ajoutent pas de kit de combat.

## Raccordement au jeu

Mama Atelier utilise ses PNG détaillés dans le sélecteur, le duel et les états de mouvement. Die-Hardman, Higgs et Heartman remplacent leurs images principales historiques. Mama Viaduc conserve son propre ensemble de tenue et sa géométrie : sélectionner ce costume ne mélange pas ses images avec celles de l’Atelier.

Le moteur utilise **58 crops de poses mesurés**, auxquels s’ajoutent les sept effets du premier lot et les dix-huit géométries propres aux boss/effets. Les crops encadrent les pixels visibles avec une marge de trois pixels. Les ancres des poses au sol sont calculées sur la bande de contact des semelles ; le saut de Die-Hardman suit les bottes plutôt que le genou le plus bas. Le fantôme du faux départ de Higgs reprend désormais le même crop et la même échelle que sa pose native.

Les hauteurs de pose sont réglées pour limiter les changements apparents de tête et de torse. Une fente profonde ne doit pas être étirée jusqu’à la hauteur d’un personnage debout. Les premiers réglages sont notamment `0.80` pour la fente de Higgs, `0.72` pour son saut replié et `0.70` pour l’attaque penchée du géant. Ce sont des choix de calage artistique à revoir en scène, pas des mesures anatomiques officielles.

Port Knot et l’incinérateur portent le catalogue à **douze lieux et treize configurations**, avec **65 couches de décor**. Chaque nouvelle configuration conserve un panorama de repli, cinq plans en parallaxe, un ancrage de sol et son profil d’ambiance. Le salon privé accepte les deux identifiants de lieu et distribue les nouvelles ressources imbriquées. Son empreinte de version inclut aussi les modules et les images des boss.

## Boss Battle

Le menu ouvre six rencontres : Catcher léonin, Catcher aquatique, baleine, géant, camion MULE et convoi. Les annonces d’attaque précèdent les dégâts. Les rencontres avec les Échoués possèdent une seconde phase ; les missions MULE ajoutent les colis et leur livraison. Le convoi comporte deux vagues.

Les huit combattants disposent de leurs commandes et de trois signatures directionnelles adaptées à ce mode. Pause, perte de focus, commandes tactiles, résultats et revanche sont raccordés à l’interface. Une sauvegarde distincte, `echos.boss.v1`, conserve les résultats par rencontre, combattant et difficulté ainsi qu’une reprise valide.

La revue a corrigé des défauts concrets : arrêt d’un camion vaincu pendant sa charge, conservation des reprises après un Scan MULE au bord du terrain, refus d’actions incohérentes sans repère, orientation d’une attaque pendant le passage de côté, et zone vulnérable du géant pendant sa pose penchée. Les détails et les contrôles finaux figurent dans la [fiche Boss Battle](BOSS_BATTLE_20261124.md).

## Vérifications réellement exécutées

La recette de cette reprise s’exécute **en mémoire avec le véritable code du jeu et des méthodes Canvas instrumentées**. Elle vérifie les choix d’images et les calculs de rendu. Elle ne dessine pas des pixels dans un navigateur.

- Les 225 chemins du catalogue principal sont présents dans l’arbre Git préparé.
- Les 58 crops de pose sont finis, non vides et contenus dans les dimensions natives déclarées.
- Mama, Die-Hardman, Higgs et Heartman passent chacun neuf poses sur les deux côtés, avec un coup reçu par la simulation réelle, des proportions conservées et les baselines de pieds attendues.
- Le saut de repli et la tenue Mama Viaduc sont exercés séparément.
- Port Knot et l’incinérateur passent **16 cas** : duel local et dojo, deux directions, effets normaux et réduits. Les cinq plans, les proportions natives, le sol et les vitesses relatives sont contrôlés.
- Les huit combattants conservent **72 checkpoints identiques** au runtime publié précédemment (`8afb60daabe1b7608ff42a16f5e92512422b3e45`) ; le chargement ou l’absence des nouvelles images ne modifie pas la simulation.
- Le véritable service de salon passe création, préparation, lancement, accusés des commandes, pause après déconnexion, reprise et résultat. Les deux nouveaux stages y sont acceptés.
- La recette Boss et la revue indépendante sont décrites dans leurs rapports séparés.

Les dimensions natives proviennent des manifestes dont les images ont été décodées lors de leur production. Les anciennes images hors de ces manifestes utilisent des dimensions de substitution dans la recette hébergée. Les contrôles de proportions natifs ne sont donc pas étendus abusivement à ces anciennes sources.

**Non exécutés pendant cette reprise :** lancement du serveur HTTP sur une machine, rendu Canvas natif du code reconstruit, navigation et commandes dans un vrai navigateur, comparaison de toutes les poses aux pixels du jeu officiel. Les scripts de recette locale sont livrés pour reprendre ces contrôles dès qu’un ordinateur est disponible. Les contrôles Canvas du premier lot restent des preuves de ce premier lot, sans être présentés comme une exécution fraîche du nouveau moteur Boss.

## Fidélité : acquis et points ouverts

Les manifestes conservent les prompts exacts, les sources consultées, les dimensions, les empreintes et les mesures de transparence. Les boss dérivent de références du premier Death Stranding/Director’s Cut. Les panoramas de Port Knot et de l’incinérateur s’appuient sur des captures du jeu prises par des joueurs ; leur composition latérale et la piste de combat sont des adaptations.

Le haut du corps de Mama a une référence officielle identifiée. Les parties cachées, certaines vues de bottes et les côtés éloignés restent moins documentés. Le portrait de Higgs utilise maintenant un masque crânien d’or repris depuis une capture DS1 inspectée. Les dix vues de corps entier conservent encore leur visière héritée ; leur correction est suivie séparément. Le masque corrigé ne certifie pas automatiquement les autres détails de la capuche ou du costume. Une finition plus détaillée ne suffit pas à établir cette correspondance.

Le suivi restant porte sur :

| Élément | État à cette livraison |
|---|---|
| Heartman · cinq images principales | Livrées et intégrées : sources détaillées de 724 × 2172 à 1274 × 1235 ; comparaison canonique complète encore ouverte |
| Mama · Maintenance du viaduc | Dix images historiques de mannequin articulé ; reprise humaine détaillée encore nécessaire |
| Masque de Higgs | Portrait corrigé et intégré ; dix vues de corps entier encore à traiter. La génération complète initiale a été refusée par le générateur ; la retouche limitée du portrait a réussi |
| Lockne | Aucune capture inspectable récupérée avec les capacités disponibles ; audit conservé, aucun faux portrait produit |
| Images narratives de rivalité | Revue de cohérence encore nécessaire, notamment Die-Hardman |
| Pas/impacts historiques de Sam et Cliff | Audit visuel effectué : quatre poses peintes par planche, identité et équipement cohérents ; aucun manque d’image. Une animation plus ample serait une amélioration distincte |
| Vues gauche asymétriques | Le miroir actuel inverse aussi l’équipement ; vues dédiées encore nécessaires pour une certification 1:1 |
| Validation finale | Revue en navigateur et comparaison systématique de chaque pose à sa référence encore nécessaires |

Le lot livré complète ses variantes prévues et leur intégration. **Il ne constitue pas une certification globale 1:1 de tout le catalogue.**

## Accès et traçabilité

- [Galerie des 60 images séparées](index.html), avec fond clair, sombre ou damier.
- [Recette d’intégration et empreintes des sources](integration-validation.json).
- [Recette du service de salon](relay-validation.json).
- [Premier lot : 42 PNG et contrôles initiaux](../20261124/REPRISE_ASSETS_20261124.md).
- Manifestes : `art/sources/echos-de-la-greve/production-20261124-suite/`.
- Code : `modes/echos-de-la-greve/`.
- [PR #6](https://github.com/darknigthmare/Death-Stranding-2D/pull/6).

Commandes locales disponibles : `node modes/echos-de-la-greve/qa/suite-integration-20261124.cjs`, `node modes/echos-de-la-greve/qa/boss.cjs`, `node modes/echos-de-la-greve/qa/reseau-logique.cjs`. Le contrôle de pixels des arènes utilise `qa/arenes-canvas.cjs` avec `@napi-rs/canvas` ; celui des PNG utilise les recettes existantes avec `sharp`.

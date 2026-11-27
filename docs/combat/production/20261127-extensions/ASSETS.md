# Huit poses natives de présentation — 27 novembre 2026

[Bilan](BILAN.md) · [Règles de présentation](PRESENTATION.md) · [Inventaire exact](native-inventory.json) · [Prompts et provenance](generation-provenance.json).

## Livraison

Huit PNG autonomes sont installés dans `modes/echos-de-la-greve/assets/presentation-20261127/`. Chaque fichier contient un seul personnage en pied et une seule pose de tenue du geste. Les octets des sorties natives sélectionnées sont copiés sans redimensionnement, assemblage ni repeinture. Les régions de dessin et les points d’appui sont déclarés séparément dans `presentation-assets.js`.

| Combattant | Fichier | Dimensions natives | Geste du simulateur |
| --- | --- | ---: | --- |
| Sam | sam-taunt.png | 854 × 1 840 | Pouce levé, autre main sur la sangle. |
| Fragile | fragile-taunt.png | 971 × 1 619 | Paume ouverte, parapluie fermé tenu bas. |
| Higgs | higgs-taunt.png | 900 × 1 747 | Bras ouverts pour un salut théâtral ; version DS1 masquée. |
| Cliff | cliff-taunt.png | 848 × 1 855 | Deux doigts portés à la tempe. |
| MULE | mule-taunt.png | 776 × 2 025 | Scanner portatif levé, main sur la sangle. |
| Mama | mama-taunt.png | 1 024 × 1 536 | Ajustement des lunettes ; tenue d’atelier. |
| Heartman | heartman-taunt.png | 724 × 2 172 | Consultation de l’appareil au poignet. |
| Die-Hardman | diehardman-taunt.png | 824 × 1 909 | Ajustement du gant ; masque crânien corrigé. |

Les huit sources sont des PNG RGBA avec une zone réellement transparente. Le recadrage de dessin est mesuré sur les pixels d’alpha supérieur à 8, avec une marge de deux pixels lorsque la source le permet. L’ancrage horizontal suit le corps ; la ligne de base suit les semelles. Cette géométrie ne change ni les collisions ni les octets des images.

Le cycle en combat utilise la posture existante pendant l’entrée et la sortie, puis le nouveau PNG pendant la tenue. Le panneau de sélection anime la position et l’opacité des images. **Huit poses nouvelles ne constituent pas huit séquences dessinées image par image.** Aucun spritesheet ou nouveau doublage n’est déclaré livré.

## Références et fidélité

Les modèles déjà intégrés au projet servent de référence de continuité. Leurs tenues DS1/DC restent distinctes des versions DS2 du catalogue. Les sources officielles consultées comprennent la [présentation des personnages du PlayStation Blog](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/) et la [page Death Stranding / Director’s Cut](https://www.playstation.com/en-us/games/death-stranding/). Les URL des images de contrôle et les prompts exacts sont conservés dans le manifeste de provenance.

Un écart concret a été corrigé sur la nouvelle pose de Die-Hardman : le masque robotique hérité de l’ancien modèle a été remplacé par un masque crânien en carbone, avec orbites, nez, dents et fixation de joue, à partir de [cette référence officielle](https://blog.de.playstation.com/uploads/sites/13/2021/10/e33dc8f7a181bc63118e9be298f8b3c358b0f672.jpg). Le premier essai est exclu de la livraison. Cette correction **ne certifie pas les autres poses anciennes de son kit** : leur masque et la continuité visuelle entre postures restent à corriger dans un lot dédié.

Mama a reçu une passe de détourage dédiée. Certaines prévisualisations affichent encore les couleurs RGB stockées sous des pixels transparents ; le contrôle porte sur l’alpha réel et la composition dans le moteur. Les captures natives montrent le décor à travers les espaces autour de son corps et de son scanner, sans plaque de fond. La tenue Viaduc garde ses poses propres pendant le geste ; elle ne reçoit pas le costume d’atelier.

La fidélité 1:1 reste le critère cible, pas une certification globale de ce lot. Les gestes sont des créations du simulateur, et non des animations officielles reproduites. Les détails fins, inscriptions, accessoires et asymétries demandent une réception comparative complémentaire. Le moteur retourne horizontalement les PNG pour l’autre côté ; une telle inversion peut également retourner les inscriptions et détails asymétriques. Aucune seconde source native de profil gauche n’a été produite.

## Vérification des pixels et du rendu

La recette [presentation-native.json](presentation-native.json) décode les huit PNG et **121 chemins image** utilisés par ses cas. Elle rend le vrai `StrandFight` sur Canvas natif à 1 280 × 720, avec des polices disponibles et un HUD visible.

**17 captures indépendantes** sont énumérées dans le [rapport natif](presentation-native.json) : les huit combattants dans les deux orientations, puis Mama au viaduc. Neuf vues ont été inspectées visuellement pour les huit gestes et la conservation de cette tenue. Les contrôles d’orientation, de dessin, de géométrie et d’intégrité couvrent les dix-sept cas. Les pieds suivent le sol ; aucun personnage n’est rogné dans les captures retenues.

Quelques preuves :

- [Sam — pouce levé](presentation-renders/sam-right.webp)
- [Higgs — salut](presentation-renders/higgs-right.webp)
- [Mama — lunettes](presentation-renders/mama-right.webp)
- [Die-Hardman — gant et masque](presentation-renders/diehardman-right.webp)
- [Mama — tenue Viaduc préservée](presentation-renders/mama-viaduc-preserved.webp)

Ces fichiers sont des captures de vérification du moteur, pas des assets de personnages supplémentaires. Ils ne valident pas la mise en page HTML dans un navigateur.

## Inventaire et limites restantes

L’[inventaire de livraison](inventory-verification.json) contrôle les **442 PNG/WebP préexistants**, tous inchangés, et les huit nouveaux PNG. Le dépôt compte ainsi 450 rasters dans ce périmètre d’assets. Les sorties natives récentes passent de 257 à **265** ; l’union des chemins d’images exposés par les catalogues passe de 387 à **395**. Ces trois comptes décrivent des périmètres différents.

Les poses intermédiaires complètes, les variantes de tenue, les séquences de sélection dessinées, les chorégraphies de duo et la correction exhaustive des anciens modèles restent à produire. La publication des sources et du présent manifeste ne transforme pas ces manques en éléments livrés.

# Mama — Maintenance du viaduc

Production du 24 novembre 2026 pour **Death Stranding 2D / Échos de la Grève**.

## Résultat

Dix PNG natifs détaillés remplacent visuellement les anciennes représentations articulées de Mama dans la tenue Viaduc : neuf poses de corps et un portrait. Les fichiers sont livrés sous `modes/echos-de-la-greve/assets/fighters/mama/viaduc/<pose>.png`. Les anciens WebP restent conservés.

La [planche de comparaison](mama-viaduc-contact.html) affiche les dix sources, leur calage relatif, les deux orientations et, en option, les anciennes versions. Le [manifeste](mama-viaduc-manifest.json) contient les prompts, les références, les empreintes, les dimensions et les mesures de transparence. La [géométrie](mama-viaduc-geometry.json) fournit les crops et les paramètres à intégrer au costume.

## Identité de la tenue

« Maintenance du viaduc » est **un costume existant du fan-game**, pas une tenue officielle de Death Stranding.

Avant la génération, les dix sources WebP du projet ont été récupérées et inspectées. Elles fixent les éléments à conserver :

- casque jaune ocre avec lampe cyan et bord sombre ;
- lunettes rondes et cheveux sombres attachés sous le casque ;
- haut de travail gris clair, pantalon cargo gris beige ;
- sangle de sécurité diagonale ocre, harnais sombre et attaches métalliques ;
- protection d’épaule et bracelets d’outillage à indicateurs cyan ;
- genouillères sombres bordées d’ocre et bottes de travail grises ;
- une bobine de câble jaune dans un boîtier circulaire sombre à trois branches ;
- le même outil compact sombre à insert orange.

Le visage humain provient du portrait Mama Atelier nouvellement généré et inspecté dans ce projet, blob `03fa02f38025fc71878533604de2f9faedbb0b7f`. Cette référence sert au visage, aux lunettes, aux cheveux et au niveau de détail des matériaux. Elle n’est pas présentée comme une capture officielle.

La stance Viaduc a ensuite servi de référence commune aux neuf variantes pour limiter les changements de visage, de costume et de matériel. Les accessoires de maintenance ne sont pas remplacés par un équipement inventé à partir du seul nom du personnage.

## Sources livrées

| Pose | Usage | Dimensions natives | heightRatio | Blob Git |
| --- | --- | --- | ---: | --- |
| stance | Attente | 1024 × 1536 | 1.000000 | `378bdbad3745b52e819ca88082ed373d8a70b28d` |
| action | Action | 1024 × 1536 | 0.837788 | `d2fa73012ef5c88fe7c4825c22cb96df85b67a12` |
| step | Déplacement | 1024 × 1536 | 0.929651 | `3fe8f5373abc8205bcaf9ad6b0cb59d85e319db1` |
| hit | Impact | 1024 × 1536 | 0.898993 | `541111f4608671869740554d65ced4e420b47c98` |
| guard | Garde | 1024 × 1536 | 0.883495 | `73ceb5f4828cc2579a6e4058a6fb4db5bd8db823` |
| crouch | Accroupissement | 1024 × 1536 | 0.601209 | `9ca8a67a49de2de1614ffedf9b63b9d38f1a19aa` |
| rise | Montée | 1024 × 1536 | 0.952602 | `4220bd171910ec118e645640c2f706f9a9bbc79c` |
| apex | Sommet | 1024 × 1536 | 0.705235 | `d7804c27ffab0fd194b4c7398c1c4a95ca9c5637` |
| fall | Descente | 1024 × 1536 | 0.924250 | `0d213432a396f062ab235a433c9b88e6fee6870a` |
| portrait | Portrait | 1254 × 1254 | — | `4580ff24e531a65d5218f1bc9ce55b979f0a369d` |

Les dix PNG totalisent **19 127 287 octets**. Chaque fichier possède son empreinte SHA-256 dans le manifeste.

Onze appels à l’outil intégré `image_gen.imagegen` ont été nécessaires : dix poses initiales et une correction ciblée de l’apex. Dans son premier résultat, la bobine était devenue une bobine ouverte à câble sombre. La correction a rétabli le boîtier fermé à trois branches, le câble jaune et la boucle argentée, en conservant la pose aérienne. La variante rejetée n’est pas utilisée par le catalogue livré.

**Les dix sources finales gardent exactement leurs octets de génération.** Aucun recadrage matériel, rééchantillonnage, étirement, réencodage ou retouche de pixels n’a été appliqué. Les crops et les miroirs appartiennent uniquement au rendu.

## Calage des poses

Toutes les sources regardent nativement vers la droite. Le moteur peut les retourner horizontalement pour l’autre côté.

La boîte de la silhouette est mesurée sur les pixels dont l’alpha dépasse 8, puis augmentée de trois pixels de marge. Le crop reste à l’intérieur de la taille native. Cette marge conserve les contours de la silhouette.

L’ancre horizontale est le centroïde des centres de pixels dont l’alpha dépasse 96, dans une bande basse de hauteur égale à l’arrondi supérieur de 1,5 % de la boîte alpha. La baseline est la limite basse exclusive de la silhouette, au bord de la botte la plus basse. La montée, l’apex et la descente conservent ce repère de botte ; la hauteur de saut relève ensuite du moteur.

Le facteur de hauteur conserve la taille apparente de la tête. Le casque rigide commun fournit un repère mesurable : sa largeur peinte en ocre est relevée dans une zone supérieure inspectée visuellement pour exclure les sangles et les genouillères. La règle de couleur utilisée est inscrite dans le manifeste.

Pour chaque pose de corps :

```text
heightRatio =
  hauteur_crop_pose / hauteur_crop_stance
  × largeur_casque_stance / largeur_casque_pose
```

Le rendu utilise ce facteur **uniformément sur les deux axes**. À une hauteur de stance de 170 px, la largeur peinte du casque atteint environ 27,205 px dans les neuf poses. Les différences de flexion et de perspective restent visibles ; la hauteur de chaque silhouette n’est pas forcée à celle d’un personnage debout.

L’accroupissement utilise donc un ratio d’environ 0,601 et l’apex un ratio d’environ 0,705. Ils replient les membres sans agrandir la tête ni comprimer le corps. L’action, plus large et inclinée, utilise environ 0,838.

Ce calage fournit une base anatomique cohérente pour l’intégration. Les paramètres détaillés comprennent `crop`, `anchorX`, `baselineY`, `heightRatio` et `nativeFacing`. Le costume doit disposer de sa propre géométrie ; reprendre celle des anciens WebP annulerait ce travail. Le portrait est destiné à l’interface et ne reçoit pas d’ancre de contact au sol.

## Vérification effectuée

Les dix images natives ont été affichées et inspectées : visage humain, détails de la tenue, silhouette de la pose, casque, mains et bottes complets. Le portrait possède volontairement un cadrage de buste. Aucun contour significatif n’atteint le bord du fichier ; l’outil de la pose action conserve quatre pixels jusqu’au bord droit.

Les PNG ont été décodés en mémoire en JavaScript hébergé, sans ordinateur attaché. Le contrôle porte sur le format RGBA8, le flux de compression et son intégrité Adler32, les dimensions, l’histogramme alpha, les boîtes de silhouettes et les contacts. Tous les fichiers possèdent des pixels entièrement transparents.

Certaines prévisualisations montrent une teinte diffuse derrière le personnage. Les échantillons de ces zones sont à alpha zéro dans les données PNG : cette couleur cachée ne constitue pas un fond opaque à conserver dans le rendu.

Les mesures utilisent le décodeur en lecture seule identifié par le blob `87d9ea6b7ca144a9edc4b1344f16c5af406265aa`, complété en mémoire par les sommes de centres de pixels de la bande de contact et la mesure du casque. Les octets d’entrée ne sont pas modifiés.

Le JavaScript de la planche de comparaison a été compilé. **Aucun navigateur ni Canvas natif n’a été utilisé pour vérifier cette page ou ces sprites en scène.** La recette d’intégration doit contrôler le chargement de la tenue, son repli, les deux orientations et la conservation du gameplay après raccordement.

## Limites de fidélité

Le lot restaure Mama comme personnage humain détaillé dans une tenue identifiée et documentée du projet. Il ne prétend pas transformer cette tenue de maintenance en costume canonique, ni certifier une correspondance image par image avec un modèle officiel.

Les neuf poses de corps sont des sources distinctes pour les états du moteur. Elles ne constituent pas une animation complète de toutes les phases intermédiaires des attaques et déplacements.

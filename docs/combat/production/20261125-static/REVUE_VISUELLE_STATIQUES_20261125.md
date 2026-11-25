# Revue visuelle indépendante — quinze images statiques

**Échos de la Grève · 25 novembre 2026**

## Périmètre et résultat

La revue couvre **les quinze PNG natifs du répertoire `static-20261125`** : cinq images de personnages, trois ennemis, quatre grenades et trois panoramas. Les trois premières images ont été examinées au début de la reprise ; leurs observations sont consolidées ici avec les douze suivantes. Chaque image native et les références nommées dans le [rapport JSON](visual-review-independent-20261125.json) ont été ouvertes et inspectées.

**Quinze images acceptées pour une présentation statique, avec les limites de sujet et de fidélité détaillées ci-dessous.** Chaque fichier contient une seule frame. Aucun pixel natif n’a été modifié ; les SHA-256 ont été vérifiés après la revue et les neuf empreintes déjà consignées concordent encore.

La revue porte sur le cadrage, le sujet unique, les principaux détails visibles et la composition de la transparence. Elle ne certifie pas une fidélité canonique globale 1:1, un nouveau combattant jouable ou une arène complète à cinq plans.

## Dimensions et transparence

| Image | Dimensions natives | Mode | Pixels entièrement transparents | Inspection |
|---|---|---|---:|---|
| Lockne — portrait | 1189 × 1323 | RGBA | 40.62 % | Vérifiée |
| Lockne — silhouette fixe | 1024 × 1536 | RGBA | 76.18 % | Vérifiée |
| Deadman — silhouette fixe | 1024 × 1536 | RGBA | 67.14 % | Vérifiée |
| Amelie — robe rouge | 1024 × 1536 | RGBA | 75.54 % | Vérifiée |
| Bridget Strand — lit médical | 1536 × 1024 | RGBA | 41.72 % | Vérifiée |
| Échoué flottant — Gazer | 1024 × 1536 | RGBA | 78.85 % | Vérifiée |
| Soldat squelettique de Cliff — casque à filet | 1024 × 1536 | RGBA | 59.84 % | Vérifiée |
| MULE gris de la région Est | 1024 × 1536 | RGBA | 68.78 % | Vérifiée |
| Grenade hématique | 1024 × 1536 | RGBA | 64.75 % | Vérifiée |
| Grenade EX n° 0 | 724 × 2172 | RGBA | 78.70 % | Vérifiée |
| Grenade EX n° 1 | 724 × 2172 | RGBA | 77.04 % | Vérifiée |
| Grenade EX n° 2 | 724 × 2172 | RGBA | 76.79 % | Vérifiée |
| Ruines de South Knot | 1672 × 941 | RGB | 0.00 % | Vérifiée |
| Ferme sous la pluie temporelle | 1672 × 941 | RGB | 0.00 % | Vérifiée |
| Approche de Mountain Knot | 1672 × 941 | RGB | 0.00 % | Vérifiée |

Les douze images détourées ont été composées, uniquement pour le diagnostic, sur un fond gris clair et un fond vert sombre. Aucun grand halo ni rectangle de fond n’est visible dans ces compositions. Certains aperçus qui ignorent l’alpha exposent des halos colorés contenus dans les composantes RGB masquées par alpha zéro ; ceux-ci ne doivent pas être confondus avec un fond opaque.

Les pixels des personnages matériels sont souvent proches d’alpha 253. Des pixels très faibles peuvent atteindre les bords ; le JSON distingue donc les limites de tous les pixels non nuls des limites au-dessus d’alpha 16. Le Gazer conserve volontairement davantage de transparence particulaire. Les trois panoramas sont des images RGB opaques, comme attendu.

### Famille EX : même format, géométrie légèrement différente

Les trois capsules occupent des fichiers de **724 × 2172 px**, mais les retouches générées ne conservent pas exactement tous les pixels de la silhouette. Leurs hauteurs visibles mesurées au-dessus d’alpha 16 sont **2000 px pour EX0, 2071 px pour EX1 et 2070 px pour EX2**. EX1 et EX2 sont donc environ 3,5 % plus hautes dans leur canevas. Elles sont entièrement cadrées, avec respectivement 15 et 18 pixels de marge visible sous l’extrémité inférieure. Une intégration nécessitant une taille physique identique devra utiliser la géométrie propre à chaque fichier ; la revue ne prétend pas un alignement pixel à pixel des trois images.

## Observations par sujet

### Lockne — portrait

Un portrait unique, tête complète et buste cadré ; coiffure asymétrique sombre, col bleu marine et boucles dorées cohérents avec la capture inspectée. Œil bleu du côté gauche de l’image, donc droit anatomique, et œil noisette du côté droit. Aucun miroir appliqué.

**Limite :** Les traits sont transposés dans un nouveau rendu frontal ; cette comparaison visuelle ne démontre pas une égalité géométrique du visage avec le modèle du jeu.

### Lockne — silhouette fixe

Un personnage, tête et chaussures entières ; haut col bleu marine, pans asymétriques, manches grises, coiffure et boucle dorée présents. Œil droit anatomique bleu conservé ; aucun miroir appliqué.

**Limite :** La référence holographique couvre surtout tête et cuisses. Pantalon inférieur, bottines et détails cachés restent une reconstruction non certifiée 1:1.

### Deadman — silhouette fixe

Un personnage entier, tête et chaussures dans le cadre ; costume sombre, chemise bordeaux, lunettes, barbe, cravate, barrette, gants et bracelet lumineux cohérents avec la capture officielle inspectée.

**Limite :** La capture ne documente pas entièrement pantalon et chaussures. Ces parties et certains accessoires fins restent reconstruits, sans certification 1:1.

### Amelie — robe rouge

Un personnage complet ; robe rouge croisée à manches longues, ceinture nouée du côté gauche anatomique, collier, ourlet sous le genou et escarpins rouges. Les pieds et les mains sont dans le cadre.

**Limite :** La vue de face ne montre pas l’ourlet et les chaussures ; leur présence est appuyée par une autre capture de dos. Les détails des chaussures vus de face restent interprétés.

### Bridget Strand — lit médical

Une seule Bridget allongée dans un lit complet ; foulard rose/lilas, blouse blanche plissée, couverture bordeaux, barrières et roulettes présents. Aucun élément majeur du groupe personnage/lit coupé.

**Limite :** Adaptation d’un groupe personnage et accessoire, pas sprite d’une Bridget debout. Les jambes sont couvertes ; le cadrage ne prouve pas une tenue complète sous la couverture.

### Échoué flottant — Gazer

Une seule silhouette humaine flottante, sans costume, avec corps particulaire sombre et cordons. Tête, mains, pieds et cordon principal restent visibles dans le cadre. Transparence plus diffuse que celle des personnages matériels, cohérente avec le sujet.

**Limite :** Pose et répartition des particules diffèrent de la capture ; il s’agit d’une adaptation latérale statique, pas d’une reproduction d’un instant du jeu.

### Soldat squelettique de Cliff — casque à filet

Un seul soldat complet, deux bottes et arme entièrement cadrées. Crâne, casque à filet, tenue usée et cordons sombres cohérents avec la variante de la capture.

**Limite :** La capture source montre des soldats accroupis et partiellement occultés. Pose debout, bas du vêtement et détails d’arme sont adaptés ; aucune époque ou modèle de fusil précis n’est certifié.

### MULE gris de la région Est

Une silhouette complète, capuche grise et masque noir, poche thoracique jaune, armature de fret, capteur et bâton électrique. Tête, bottes, sommet du capteur et pointe lumineuse sont dans le cadre.

**Limite :** Les détails fins des sangles et du matériel sont reconstruits depuis des captures de jeu à petite échelle. Ce MULE ne remplace pas la référence manquante du terroriste Homo Demens.

### Grenade hématique

Un objet isolé entier ; corps blanc opaque avec fenêtre rouge, base rouge perforée, tête métallique sombre, anneau rectangulaire et levier latéral. Ces éléments sont visibles dans la référence détaillée. Les marquages principaux restent lisibles.

**Limite :** Angle et détails de surface reconstruits ; l’intégralité des petits caractères, numéros et dimensions mécaniques n’est pas certifiée contre la capture source.

### Grenade EX n° 0

Un objet isolé complet, capsule longue à embout noir ajouré, chambre translucide beige pâle, anneau bas et extrémité arrondie. Forme générale cohérente avec la capture du présentoir inspectée.

**Limite :** La référence montre plusieurs capsules dans leur présentoir sous une perspective oblique. L’objet isolé à grande échelle et ses détails fins sont une reconstruction ; ses proportions ne sont pas certifiées par mesure 1:1.

### Grenade EX n° 1

Capsule unique et complète, contenu orange, embout noir ajouré, anneau bas et extrémité arrondie. La variante de couleur correspond à la capture du présentoir inspectée.

**Limite :** Même famille visuelle que EX0, avec géométrie légèrement différente après génération : hauteur visible de 2071 px contre 2000 px pour EX0. La forme générale est conservée mais les pixels ne sont pas strictement alignés.

### Grenade EX n° 2

Capsule unique et complète, contenu turquoise, embout noir ajouré, anneau bas et extrémité arrondie. La variante de couleur correspond à la capture du présentoir inspectée.

**Limite :** Même famille visuelle que EX0, avec géométrie légèrement différente après génération : hauteur visible de 2070 px contre 2000 px pour EX0. La forme générale est conservée mais les pixels ne sont pas strictement alignés.

### Ruines de South Knot

Panorama unique et complet ; ruines, pont métallique, route rompue et pluie cohérents avec la référence inspectée. Bande de terrain latérale dégagée au premier plan.

**Limite :** Composition latérale et piste de combat adaptées ; aucune séparation en cinq plans produite par ce PNG.

### Ferme sous la pluie temporelle

Panorama unique et complet ; champs dorés, machines jaunes, structures courbes, balises lumineuses et relief enneigé correspondent aux éléments visibles de la référence.

**Limite :** Position des éléments et piste latérale adaptées ; ce fichier ne constitue pas une arène jouable ni un jeu de couches.

### Approche de Mountain Knot

Panorama unique et complet d’une vallée enneigée, relief à droite, brume, lignes verticales et arc-en-ciel. Aucun bâtiment urbain identifiable dans la génération.

**Limite :** Titre corrigé vers Approche de Mountain Knot. Le nom de fichier historique contient city ; il ne doit pas servir de preuve d’une skyline de la ville. Les structures urbaines restent à documenter.

## Décisions de périmètre conservées

- Le fichier historiquement nommé `mountain-knot-city-panorama.png` est présenté comme **Approche de Mountain Knot**. Il ne complète pas les structures urbaines de Mountain Knot City.
- Le soldat est nommé **casque à filet**, sans attribution d’époque ni modèle d’arme certifié.
- Bridget reste **allongée dans son lit médical** ; aucune tenue debout n’est revendiquée.
- Le **MULE gris de la région Est** remplit le créneau du terroriste Homo Demens différé. Cette substitution ne résout pas le manque de référence détaillée du terroriste.
- Le portrait et le corps de Lockne sont deux images du même personnage. Son œil droit anatomique bleu et sa coiffure asymétrique ne doivent pas être inversés par miroir pour produire une nouvelle référence.

## Traçabilité

Le [rapport JSON](visual-review-independent-20261125.json) contient les chemins exacts, tailles en octets, dimensions, empreintes SHA-256, statistiques d’alpha, limites visibles et observations par fichier. Les références sont désignées par leur nom dans le dossier de référence de la reprise ; leur provenance est suivie par le manifeste de production.

Les diagnostics composités sont des copies temporaires de contrôle. Les quinze livrables natifs conservent leurs octets. Les limites de fidélité et de documentation décrites ici doivent accompagner toute annonce de couverture du lot.

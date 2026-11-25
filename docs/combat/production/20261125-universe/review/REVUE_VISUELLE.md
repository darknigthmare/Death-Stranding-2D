# Revue visuelle indépendante — lot univers du 25 novembre 2026

**Aucune anomalie visuelle bloquante restante observée sur les 34 PNG définitifs.** La revue couvre les 14 images de base DS2, les 20 plans des quatre nouvelles arènes et huit captures du moteur, une dans chaque direction par arène. La reprise du seul plan lointain du Magellan a rétabli une lévitation visible ; ses deux captures finales ont été revues. Les adaptations de cadrage et les limites des références sont consignées ci-dessous.

Les PNG de production ont été lus sans retouche, recadrage ni réencodage. Les planches WebP et les vues sur fonds unis de ce dossier servent uniquement à la revue. Les sources, versions, références officielles ou licenciées et empreintes natives sont reliées dans le [manifeste de production](../../../../../art/sources/echos-de-la-greve/production-20261125-universe/manifest.json). Le [rapport de lot](../LOT_UNIVERS_20261125.md) décrit leur intégration.

## Périmètre et preuves

| Ensemble | Quantité | Vérification effectuée |
|---|---:|---|
| Portraits détourés | 7 | Comparaison des tenues et détails visibles avec les références ; composition sur deux fonds |
| Sujets en pied | 3 | Dollman, Samouraï rouge et chat chiral ; extrémités, marges et silhouette |
| Instrument isolé | 1 | Guitare de Higgs ; références partielles et statue licenciée ; composition à 100 % |
| Panoramas DS2 | 3 | Magellan, Plate Gate et tempête de sable ; composition et opacité |
| Plans d’arène | 20 | Ciel, lointain, plan intermédiaire, sol et premier plan pour chacun des quatre lieux |
| Captures moteur examinées indépendamment | 8 | South Knot, ferme, Mountain Knot et Magellan, cadrages droite et gauche en 1280 × 720 |

Les mesures détaillées figurent dans [technical-inspection.json](technical-inspection.json), les observations par image dans [independent-review.json](independent-review.json) et les correspondances des planches dans [contact-sheets.json](contact-sheets.json).

La composition a été effectuée avec `@napi-rs/canvas` sur un fond sombre `#14231f` et un fond neutre `#c8c9c2`. Les captures d’arène utilisent le véritable rendu de `fight.js`, produit par `qa/arenes-canvas.cjs`. La [validation moteur](../stage-renders/validation.json) conserve ses propres mesures et ses 32 cas automatisés. La présente inspection visuelle porte sur huit de ces captures, et ne constitue pas une validation dans un navigateur.

## Les 14 images de base

Les noms de références de la dernière colonne sont les identifiants du manifeste de production.

| Image | Constat visuel | Adaptation ou limite conservée | Référence |
|---|---|---|---|
| Sam, tenue DRAWBRIDGE | Cheveux foncés mouillés, haut noir sans manches et marquage cohérents ; aucun halo dans les compositions natives | Portrait serré, coupé au bas du buste ; aucune silhouette entière déduite | `sam_ds2_pc` |
| Fragile DS2 | Béret, marquages DRAWBRIDGE, cheveux courts, col à formes de mains et côté de la main levée cohérents | La cigarette de l’affiche est absente, tandis que le geste près des lèvres reste présent | `fragile_ds2_poster` |
| Higgs DS2 | Armure orange, plastron ambré, longs cheveux et maquillage pâle avec traces sombres/dorées reconnaissables | Variante DS2 distincte du masque doré DS1 ; buste seulement | `higgs` |
| Tomorrow | Cheveux blonds et haut sombre sans manches cohérents | Cette version reprend l’affiche au haut sombre ; elle ne représente pas la robe blanche de l’autre référence | `tomorrow` |
| Neil | Étoffe sombre au cou, cheveux et équipement lisibles | Grandes lames de l’affiche omises pour le portrait ; bas du corps non représenté | `neil` |
| Rainy | Pull jaune zippé, pot fleuri, deux mains lisibles et sac clair à gauche du spectateur | Cadrage de portrait ; pas de doigt supplémentaire évident au contrôle visuel | `rainy` |
| Tarman | Moignon noirci à gauche du spectateur, main intacte avec bague à droite ; casquette, lunettes et jumelles conservées | Chat retiré du portrait et traité comme sujet séparé | `tarman` |
| Dollman | Deux chaussures, tête et main levée entières ; costume bordeaux, nœud papillon, chaussettes rouges et visage segmenté | Pose adaptée, avec main levée du même côté à l’écran que dans la référence | `dollman` |
| Samouraï rouge | Deux mains sur le manche, pointe de lame, cadre dorsal et deux bottes dans le cadre ; cinq plaques claires du masque et œil central rouge lisibles | Bas des jambes et chaussures reconstruits : l’affiche officielle coupe cette zone | `red_samurai` |
| Chat chiral | Ramures, queue, pattes et corps inclus ; yeux jaunes et matière noire brillante cohérents | Pose assise reconstruite depuis le chat présent sur l’épaule de Tarman | `tarman` |
| Guitare de Higgs | Corps orange anguleux, commandes noires, câble bouclé, manche et extrémité lumineuse cohérents ; câble et pointe non coupés | Captures officielles partielles complétées par une statue licenciée ; détail des proportions interprété | `higgs_guitar_duel_detail`, `higgs_guitar_shoulder_detail`, `higgs_guitar_statue_parts_licensed` |
| Magellan, panorama | Silhouette industrielle, volumes sous la coque, terrain humide et coucher de soleil reconnaissables | Personnage de premier plan retiré ; position et échelle du vaisseau adaptées | `magellan` |
| Plate Gate, panorama | Colonnes minérales et masses suspendues reconnaissables | Personnages retirés et premier plan recomposé | `plate_gate` |
| Tempête de sable, panorama | Front de sable, voitures poussiéreuses, lignes électriques et bâtiments bas cohérents | Sam retiré de la scène ; espace latéral adapté | `sandstorm` |

Ces constats concernent ce que montrent les références disponibles. Les parties reconstruites sont documentées comme des adaptations du projet, sans certification de correspondance intégrale avec les modèles du jeu.

## Transparence, marges et anatomie visible

Les **34 PNG définitifs se décodent correctement**, pour un total de **53 577 560 octets**. Les 13 images de base examinées dans la revue préliminaire sont identiques octet pour octet à leurs fichiers définitifs. La reprise finale du Magellan a modifié uniquement son plan lointain : les 33 autres PNG sont restés identiques. Les 34 empreintes SHA-256 ont été comparées à celles du manifeste de production et correspondent.

Le lot comprend **27 PNG avec transparence** et **7 images opaques** : les trois panoramas et les quatre ciels. Tous les plans d’arène mesurent **1672 × 941 pixels**. Les portraits peuvent toucher le bord du cadre au niveau des épaules ou du buste : ce cadrage ne permet pas de les qualifier de personnages en pied.

Sam possède bien un alpha minimal de **0** et maximal de **254**. Son sujet utilise notamment des valeurs 253–254. Ces valeurs ont été conservées. Les couleurs RGB présentes dans des pixels transparents peuvent apparaître dans certaines prévisualisations brutes ; elles ne produisent pas de halo visible dans les compositions Canvas examinées. Le même contrôle sur deux fonds a confirmé le détourage du Samouraï rouge. Pour la guitare, l’alpha va de **0 à 255**, avec **74,50 % de pixels totalement transparents** ; aucun halo rouge n’apparaît dans les vues composées à 100 %.

Les marges suivantes sont mesurées autour des pixels d’alpha ≥ 128, dans le PNG natif. Les détails translucides du bord peuvent s’étendre au-delà de cette limite.

| Sujet entier | Gauche | Haut | Droite | Bas |
|---|---:|---:|---:|---:|
| Dollman | 119 px | 40 px | 182 px | 18 px |
| Samouraï rouge | 63 px | 13 px | 10 px | 16 px |
| Chat chiral | 114 px | 30 px | 71 px | 41 px |
| Guitare de Higgs | 14 px | 14 px | 15 px | 18 px |

Les chaussures des deux personnages en pied, les extrémités du chat, le câble de la guitare et sa pointe ne sont pas coupés. La marge droite du Samouraï rouge est la plus serrée de ces quatre sujets ; elle est à conserver lors d’une éventuelle mise en atlas.

## Les 20 plans et les quatre compositions d’arène

Chaque ligne couvre les cinq plans correspondants, examinés séparément sur deux fonds puis dans les captures du moteur.

| Arène | Plans examinés | Observation dans les deux cadrages moteur |
|---|---|---|
| South Knot en ruines | Ciel opaque ; pont lointain détouré ; bâtiments et rampe au plan intermédiaire ; route humide ; débris périphériques | Sol continu, absence de bande vide au raccord, pieds et silhouettes lisibles |
| Ferme de précipitations | Ciel opaque ; montagne lointaine ; champs, robots et clôture au plan intermédiaire ; piste de terre ; herbes et pierres périphériques | Raccord clôture/sol continu ; piste dégagée ; végétation du premier plan hors des pieds |
| Approche de Mountain Knot | Ciel opaque avec arc inversé ; massif lointain ; vallée rocheuse ; sol enneigé ; rochers bas au premier plan | Reliefs raccordés sans bande vide ; silhouettes contrastées sur la neige ; pieds lisibles |
| Magellan | Ciel de coucher de soleil ; vaisseau et relief uniquement dans le lointain ; marais au plan intermédiaire ; sol humide ; débris bas | Une seule occurrence du vaisseau, coque et sphères entières en suspension au-dessus du marais ; sol continu et piste dégagée |

**Cadrage final du Magellan.** La coque et les volumes sphériques sont entiers dans les deux captures finales, avec un espace visible entre le vaisseau et le marais. La silhouette ne chevauche pas le HUD et n’apparaît qu’une fois, dans le plan lointain. Une première composition masquait sa partie basse derrière la berge, donnant l’impression qu’il était posé : ce seul plan a été régénéré avec une silhouette plus petite et placée plus haut. Le panorama autonome et les quatre autres plans sont conservés. L’échelle et la position restent une adaptation de composition pour le cadre de combat 1280 × 720 ; l’ancienne tentative est identifiée comme remplacée dans le manifeste de production.

## Planches et vues de détail

Les planches regroupent 10 ou 11 vues chacune. Les fonds unis servent à rendre visibles les contours ; ils ne sont pas incorporés aux PNG de production.

| Planche | Contenu | Fichiers |
|---|---|---|
| 01 | 11 sujets détourés | [Fond sombre](01-personnages-objets-dark.webp) · [Fond neutre](01-personnages-objets-neutral.webp) |
| 02 | 3 panoramas et 8 captures principales du moteur | [Panoramas et rendus](02-panoramas-rendus-dark.webp) |
| 03 | 10 plans de South Knot et de la ferme | [Fond sombre](03-plans-south-knot-farm-dark.webp) · [Fond neutre](03-plans-south-knot-farm-neutral.webp) |
| 04 | 10 plans de Mountain Knot et du Magellan | [Fond sombre](04-plans-mountain-magellan-dark.webp) · [Fond neutre](04-plans-mountain-magellan-neutral.webp) |

Les vues de détail conservent l’échelle de composition à 100 % : [Sam sur fond sombre](detail-sam-dark.webp), [Sam sur fond neutre](detail-sam-neutral.webp), [guitare sur fond sombre](detail-guitare-dark.webp) et [guitare sur fond neutre](detail-guitare-neutral.webp).

La revue n’ajoute aucune animation et n’étend pas le périmètre des portraits aux parties du corps qu’ils ne montrent pas. Elle valide la lisibilité des fichiers et des compositions examinés, avec les adaptations de référence explicitement conservées ci-dessus.

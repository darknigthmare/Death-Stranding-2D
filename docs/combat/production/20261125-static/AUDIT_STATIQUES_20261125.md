# Audit des sujets statiques manquants

**Death Stranding 2D · Échos de la Grève · 25 novembre 2026**

## Périmètre et état de référence

Cet audit prépare la reprise demandée : personnages et costumes en pose fixe, ennemis, boss, projectiles et décors. Il ne demande aucune nouvelle animation ni suite de poses de mouvement. La référence artistique reste **Death Stranding / Director’s Cut**, conformément à la bible actuelle.

L’état inspecté est le commit [`25bf4faa156d105e2bc2a03ee74b59a1b48f366f`](https://github.com/darknigthmare/Death-Stranding-2D/commit/25bf4faa156d105e2bc2a03ee74b59a1b48f366f), branche `codex/echos-assets-fidelity-20261124`, [PR #6](https://github.com/darknigthmare/Death-Stranding-2D/pull/6). L’arbre Git comprend 617 fichiers suivis, soit 688 entrées en comptant les répertoires. Les constats ci-dessous décrivent cette base, avant les ajouts du 25 novembre.

Le catalogue JavaScript a été chargé en mémoire puis chaque chemin d’image contrôlé sur disque. **Les 225 chemins du catalogue principal et les 18 chemins propres aux boss existent tous.** Il n’y a donc pas de fichier référencé absent dans ces deux catalogues. Les nouveaux sujets proposés complètent la couverture artistique ; ils ne réparent pas 243 liens cassés.

| Ensemble vérifié | Couverture dans la base |
|---|---|
| Combattants | Huit : Sam, Fragile, Higgs, Cliff, MULE, Die-Hardman, Mama, Heartman. |
| Tenue supplémentaire | Mama · Maintenance du viaduc, création de ce fan-game. Ses PNG humains sont déjà actifs. |
| Soutiens | Deadman, Amelie et Bridget disposent chacun d’un portrait ; aucun corps entier séparé n’est présent. |
| Boss et véhicule | Lion, Catcher aquatique, baleine et géant : repos, attaque, impact ; camion MULE : repos et état endommagé. Quatorze images. Le convoi réemploie les ressources MULE. |
| Projectiles et effets | Sept effets de duel, quatre effets de boss ; onze images dédiées. |
| Décors | Douze lieux, treize configurations avec la variante sèche du camp MULE ; un panorama et cinq plans par configuration. Soixante-cinq couches. |
| Production du 24 novembre | L’inventaire natif actif déclare 113 chemins uniques. Ce nombre concerne ce lot, pas toutes les images historiques du dépôt. |

Sources : [catalogue principal](../../../../modes/echos-de-la-greve/assets.js), [contenu jouable](../../../../modes/echos-de-la-greve/content.js), [catalogue Boss](../../../../modes/echos-de-la-greve/boss-assets.js), [inventaire natif actif](../20261124-suite/active-native-images.json), [rapport du 24 novembre](../20261124-suite/SUITE_MANQUANTS_20261124.md).

## Plan retenu : quinze images statiques

**Ces lignes constituent le plan de production, pas une déclaration de génération ou de livraison.** Leur statut initial est « absent de la base inspectée ». Les fichiers effectivement produits, leurs références, leurs empreintes et leur raccordement doivent être consignés dans le manifeste du nouveau lot. Le plan a été ajusté pendant la reprise : MULE gris de la région Est à la place du terroriste insuffisamment documenté, Bridget allongée dans son lit, soldat nommé par son casque à filet sans attribution d’époque, et approche montagneuse plutôt que ville de Mountain Knot.

| ID proposé | Image à produire | Manque constaté dans la base | Condition de fidélité / intégration |
|---|---|---|---|
| `lockne-portrait` | Lockne, portrait | Manque explicitement suivi ; aucun portrait présent. | Récupérer et inspecter une référence propre à Lockne : coiffure, col, fermeture et tenue. Ne pas recolorer Mama pour fabriquer ce personnage. |
| `lockne-body` | Lockne, corps entier fixe | Aucun sprite autonome de Lockne. | Documenter séparément les parties du corps ou du vêtement non visibles sur les références. |
| `deadman-body` | Deadman, corps entier fixe | Un portrait existe ; aucun corps entier séparé. | Conserver l’identité du portrait et comparer la tenue à une référence du jeu. |
| `amelie-body` | Amelie, corps entier fixe | Un portrait existe ; aucun corps entier séparé. | Reprendre la tenue retenue dans le dossier existant avec une référence visible du corps entier. |
| `bridget-body` | Bridget Strand, allongée dans son lit | Un portrait existe ; aucune silhouette avec son lit n’est présente. | La référence montre une Bridget malade, foulard, blouse blanche et couverture bordeaux dans un lit médical. Elle ne documente pas une tenue debout. |
| `bt-gazer` | Échoué humain flottant, silhouette fixe | Aucun sprite autonome identifié. Les boss animaux/géant ne couvrent pas ce sujet. | Valider la silhouette, les proportions, le cordon et l’apparence contre une capture inspectée. |
| `cliff-skeleton-nethelmet` | Soldat squelettique de Cliff, casque à filet, pose fixe | Les soldats sont évoqués dans la bible, sans fichier de sprite séparé. | Reprendre la variante à casque à filet de la capture inspectée ; aucune époque ni type d’arme précis n’est certifié par ce libellé. |
| `mule-eastern-gray` | MULE gris de la région Est, pose fixe | La variante grise documentée par les conseils officiels ne possède pas de sprite séparé identifié. | Conserver capuche grise, visage couvert, équipement de fret et perche électrique de la référence ; ne pas présenter cet ennemi comme un Homo Demens. |
| `hematic-grenade` | Grenade hématique, objet isolé | Aucun fichier dédié identifié. | Reproduire l’objet tenu/lancé ; un effet rouge ne remplace pas le modèle de grenade. |
| `ex-grenade-0` | Grenade EX n° 0, objet isolé | Aucun fichier dédié identifié. | Référence de la variante exacte ; conserver ses détails visibles. |
| `ex-grenade-1` | Grenade EX n° 1, objet isolé | Aucun fichier dédié identifié. | Même règle ; ne pas inventer une différence de forme ou de couleur. |
| `ex-grenade-2` | Grenade EX n° 2, objet isolé | Aucun fichier dédié identifié. | Même règle ; ne pas fabriquer de texte pseudo officiel illisible. |
| `south-knot-ruins-panorama` | Ruines de South Knot, panorama latéral | Ce lieu n’apparaît pas dans les treize configurations existantes. | Nouveau décor de production ; la piste latérale est une adaptation. Un panorama ne constitue pas cinq plans de parallaxe. |
| `timefall-farm-panorama` | Ferme sous la pluie temporelle, panorama latéral | Aucun panorama dédié identifié. L’abri `timefall-shelter` est déjà présent mais couvre un autre lieu. | Documenter les éléments effectivement visibles dans la référence ; composition adaptée au combat. |
| `mountain-knot-city-panorama` | Approche de Mountain Knot, panorama latéral | Aucun panorama autonome correspondant à la référence montagneuse retenue. Le col `mountain-pass` existe déjà. | Le nom de fichier conserve l’identifiant initial ; le titre visible est « Approche de Mountain Knot ». La référence et son adaptation montrent une vallée neigeuse, sans skyline urbaine. La ville elle-même reste à documenter. |

Total proposé : **cinq images de personnages, trois ennemis, quatre projectiles/objets et trois panoramas**. Le portrait et le corps de Lockne sont deux images d’un même personnage, pas deux personnages.

**Cible différée : `homo-demens-terrorist`.** La référence récupérée est un hologramme ; elle ne permet pas de valider suffisamment le costume et l’équipement d’un sprite opaque détaillé. Le MULE gris remplit le créneau de production du lot sans résoudre ce manque. Les structures urbaines de Mountain Knot restent également hors de cette livraison de panoramas d’approche.

## Sujets déjà couverts à ne pas compter une seconde fois

Les images principales de Mama, Die-Hardman, Higgs et Heartman ont déjà des remplacements PNG détaillés. Les SVG de Mama et de Die-Hardman restent conservés parmi les sources historiques ; leur présence ne signifie pas que ces sujets attendent encore une première image détaillée.

Les onze images de Higgs ont déjà reçu la correction du masque crânien doré. Les variantes du camion et les états des quatre Échoués géants sont présents. Les planches historiques de Sam et de Cliff ne sont pas absentes ; les refaire en davantage de poses serait un travail d’animation exclu de cette reprise.

Les treize configurations déjà complètes sont : `shore`, `terminal`, `battlefield`, `mule-camp`, `mule-camp-dry`, `heartman-lab`, `mama-workshop`, `ruined-factory`, `timefall-shelter`, `tar-basin`, `mountain-pass`, `port-knot`, `incinerator`. Chacune possède cinq couches. Les trois panoramas proposés élargissent donc la sélection de lieux ; leur découpage éventuel en plans sera un livrable supplémentaire distinct.

## Fidélité, provenance et statut de jeu

La bible distingue les sujets issus du jeu officiel des créations d’Échos de la Grève. Mama Viaduc, les scènes de rivalité écrites pour le mode, les techniques de Die-Hardman/Heartman et une partie des effets sont des créations du fan-game. Les onze projectiles/effets déjà présents ne constituent donc pas une couverture des grenades canoniques.

Une image nouvellement produite doit conserver son prompt, les références réellement inspectées, sa taille, son empreinte et les écarts encore connus. « Généré », « intégré à une galerie », « raccordé au moteur » et « comparé à une référence 1:1 » sont des états distincts. Une transparence technique valide ne certifie pas l’identité d’un personnage ni son costume.

Le [dossier Lockne du 24 novembre](../../../../art/sources/echos-de-la-greve/production-20261124-suite/lockne-reference-audit.json) explique précisément le blocage précédent : pas de pixels inspectables de sa coiffure, de son col ou de sa tenue. Il reste une preuve historique de l’état antérieur, même si une nouvelle référence permet de produire son portrait aujourd’hui.

Les vues gauche asymétriques restent un sujet ouvert : le moteur emploie un miroir. Elles ne sont pas ajoutées automatiquement au présent lot, qui privilégie les sujets statiques absents.

## Raccordement conseillé

Les Archives de Bridges possèdent actuellement trois cartes et les portraits `deadman`, `amelie`, `bridget`. Lockne peut compléter ces dossiers. Les corps entiers, les ennemis et les objets peuvent être rendus consultables dans une galerie statique du mode avec leur catégorie et leur provenance.

La [bible](../../BIBLE_COMBAT.md) précise qu’une fiche ou un portrait isolé ne suffit pas à compter un personnage parmi les combattants jouables. Aucun nouveau moveset, affrontement ou personnage sélectionnable ne doit être déduit de cette seule production d’images. De même, un panorama livré peut être consultable sans être annoncé comme une arène jouable à cinq plans.

## Vérifications exécutées pour cet audit

- Révision locale et révision distante de la PR concordantes au commit de référence.
- Lecture de la bible, des catalogues principal/Boss, du rapport précédent, de l’inventaire natif et de l’audit Lockne.
- Évaluation des catalogues en mémoire et contrôle d’existence des 243 chemins d’image : aucun absent.
- Inspection de l’arbre suivi : portraits de soutien présents, corps entiers et autres sujets candidats absents à cette révision.

Cet audit ne réalise pas de comparaison optique exhaustive des images existantes. Il ne revendique ni génération, ni validation 1:1, ni mise en jeu des quinze candidats. Le manifeste et le rapport du nouveau lot doivent fournir ces résultats lorsqu’ils sont établis.

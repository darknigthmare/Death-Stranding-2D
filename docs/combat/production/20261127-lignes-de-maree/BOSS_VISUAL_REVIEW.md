# Bases visuelles de boss — Les Lignes de Marée

Date : 27 novembre 2026.

## Livraison

**20 bases originales de boss, une image par boss, ont été générées et contrôlées.** Il s’agit de créations de fan non canoniques pour l’extension du jeu. Elles sont destinées au codex et à la préparation de futures poses ; ce lot n’implémente aucun combat de boss.

Le dossier `modes/echos-de-la-greve/assets/lignes-de-maree/bosses/` contient les vingt PNG actifs. Leur nom est dérivé sans ambiguïté de l’identifiant : `ldm-boss-<slug>` correspond à `<slug>-base.png`. Le nom affiché « La Gardienne de la serre » conserve l’identifiant stable `ldm-boss-maitresse-serre`.

Le manifeste [bosses-generation.json](bosses-generation.json) conserve, pour chaque image, le prompt exact, les chemins de référence utilisés lors des éditions, le chemin natif de sortie, son identifiant de fichier, ses dimensions, les empreintes SHA-256 source et destination, les statistiques alpha, les réserves visuelles et les candidats remplacés.

## Contrôles effectués

- Les vingt fichiers sont des PNG RGBA natifs, issus de l’outil intégré `image_gen.imagegen`. Neuf utilisent le format portrait 1024 × 1536 ; onze le format paysage 1536 × 1024.
- Les vingt copies sont identiques octet pour octet à leur source. Total des fichiers actifs : **35 551 109 octets**. Aucun recadrage, agrandissement, recoloriage, détourage manuel, nettoyage alpha ou réencodage n’a été appliqué aux assets.
- Les vingt images ont été vues individuellement. Chaque base retenue contient un seul sujet et sa silhouette entière ; les accessoires ou cordons font partie du même sujet.
- Les vingt PNG ont ensuite été chargés dans Canvas natif et dessinés sur un damier de contrôle. Les cinq planches ont été inspectées : elles confirment la transparence effective. Le fond gris apparent de certains aperçus bruts correspond à du RGB conservé sous alpha zéro ; il ne constitue pas un fond visible dans la composition Canvas.
- Le canal alpha natif s’étend de 0 à 254, sans normalisation à 255. Selon l’image, environ 43 % à 86 % des pixels sont strictement transparents.
- Les empreintes des sources ont été vérifiées avant et après le rendu de QA. Les planches de contrôle sont des captures distinctes ; elles ne remplacent pas les PNG actifs.

La vérification est reproductible avec `python docs/combat/production/20261127-lignes-de-maree/verify_bosses.py`. Les planches sont reproduites avec `node docs/combat/production/20261127-lignes-de-maree/render_boss_alpha.cjs`, depuis la racine du dépôt. Le premier script nécessite encore les sorties natives à leur emplacement pour confirmer l’identité source/copie.

## Corrections par génération

23 sorties ont été reçues pour les 20 bases actives. Trois premiers candidats sont conservés dans leur répertoire d’origine et décrits dans le manifeste, mais ne sont pas utilisés comme bases actives.

| Boss | Problème du premier candidat | Correction retenue |
|---|---|---|
| Le Veilleur des balises | Le modèle avait ajouté des sacs, sangles, une antenne et un cordon coupé par le bord supérieur. | Équipement retiré par édition ImageGen ; corps uniquement organique et cordon replié dans le cadre. |
| Le Cétacé de rive | Le modèle avait ajouté des caisses, un harnais et du matériel radio. | Équipement retiré par édition ImageGen ; corps de goudron, nageoires, queue et cordon conservés. |
| L’Araignée des haubans | Orientation initiale vers la gauche. | Réorientation par édition ImageGen vers la droite, avec les six appuis conservés. |

Aucune de ces corrections n’a été réalisée par transformation locale des pixels.

## Revue des vingt bases

Toutes les lignes ci-dessous désignent des **bases fixes retenues**, avec des réserves de conception lorsqu’elles sont nécessaires. Le profil est dirigé vers la droite ; plusieurs corps utilisent une légère perspective pour rendre leurs membres ou équipements lisibles.

| Boss | Fichier actif | Contrôle visuel | Réserve pour la production |
|---|---|---|---|
| Le Consignateur | `consignateur-base.png` | Porteur humain robuste, graphite et jaune, charge rectangulaire, matraque et bouclier complets. Profil droit lisible. | Le bouclier et la charge se chevauchent en projection ; détail à maintenir dans les futures poses. |
| La Remorque du ressac | `remorque-ressac-base.png` | Tracteur cargo autonome, caisse intégrée, six roues suggérées par les trois roues du côté visible, suspensions et mât lisibles ; véhicule entier. | Le chargement de toit est une interprétation additionnelle du modèle. Base en vue latérale légèrement perspective ; pas de vues techniques des roues cachées. |
| Le Veilleur des balises | `veilleur-balise-base.png` | Après édition : corps humanoïde de goudron sans équipement, longs bras abaissés, profil droit, cordon entier et replié dans le cadre. | Effet de matière humide très brillant. |
| Le Treuil d’amarre | `treuil-amarre-base.png` | Treuil industriel autonome sur chenilles, grand tambour horizontal, carters, câble et bras intégrés, silhouette entière. | Les accessoires techniques du châssis sont interprétés par le modèle. |
| Le Cétacé de rive | `cetace-de-rive-base.png` | Après édition : cétacé exclusivement organique de goudron, profil droit, nageoires, queue et cordon entiers ; caisses et harnais retirés. | Marges latérales inférieures aux 8 % demandés, mais les extrémités sont dans le cadre. |
| La Gardienne de la serre | `maitresse-serre-base.png` | Femme mûre, tenue ivoire et verte, pack fermé, outil d’irrigation émoussé, mains et bottes entières ; visage de profil droit. | Marge haute étroite. |
| Le Collecteur noir | `collecteur-noir-base.png` | Amphibien bas de goudron, tête massive tournée à droite, quatre membres visibles, dos bosselé et cordon entier ; aucun équipement. | Marges latérales étroites. Vue de côté avec légère perspective pour séparer les quatre membres. |
| La Grue verrou | `grue-verrou-base.png` | Grue utilitaire autonome, quatre appuis hydrauliques visibles, cabine fermée et flèche entière tournée à droite ; aucun opérateur. | Linguet de sécurité du crochet peu lisible ; à préciser dans les poses rapprochées. Flèche presque horizontale ; son repli devra être résolu avec les poses d’animation. |
| Le Contremaître du pont | `contremaitre-pont-base.png` | Contremaître humain robuste, orange et graphite, casque blanc, barre émoussée à deux mains et attelles de portage visibles ; corps complet. | Corps légèrement trois-quarts, visage de profil droit. |
| Le Cerf de brume | `cerf-de-brume-base.png` | Cervidé de goudron aux longues pattes, bois irréguliers sombres et cordon dorsal ; silhouette complète tournée à droite, sans ornement manufacturé. | Sommet des bois proche du cadre. Silhouette sombre à vérifier sur les stages sombres avant tout emploi en combat. |
| Le Chef de triage | `chef-triage-base.png` | Vieil homme en uniforme ardoise et rouille, plaques scellées sur gilet, bouclier rectangulaire et lance-signal abaissé ; profil droit entier. | Superposition du bouclier au torse à conserver dans les futures poses. |
| La Rame sans conducteur | `rame-sans-conducteur-base.png` | Unité ferroviaire de fret autonome, longue caisse fermée, bogies et fixation haute intégrés, aucune voie ou scène ; unité entière orientée à droite. | Fixation haute évoquant le rail aérien, mais support technique de roulement à confirmer à l’animation. |
| Le Porteur sans retour | `porteur-sans-retour-base.png` | Humanoïde courbé de goudron, grande masse dorsale organique, bras très longs, tête et jambes entières ; cordon visible et aucune caisse fabriquée. | Masse dorsale plus fondue que des strates de chargement distinctes. Vue latérale avec légère perspective. |
| Le Mécanisme de l’écluse | `mecanisme-ecluse-base.png` | Plateforme chenillée, deux grands carters de transmission et pince hydraulique horizontale orientée à droite ; ensemble autonome entier. | Échelle géante suggérée par rambardes, sans personnage étalon. |
| L’Archiviste fermée | `archiviste-fermee-base.png` | Femme mûre aux cheveux argentés courts, deux caisses d’archives hermétiques, terminal d’avant-bras et matraque courte ; profil droit entier. | Veste du brief interprétée comme long manteau utilitaire. |
| L’Alpiniste du seuil | `alpiniste-seuil-base.png` | Humain en tenue grise et olive de montagne, corde assurée au sac, attelles de portage, bâton court et bottes givrées ; profil droit entier. | Il s’agit d’un visage original généré, pas d’un personnage canonique identifié. |
| L’Araignée des haubans | `araignee-hauban-base.png` | Après édition : arthropode de goudron orienté à droite, six appuis distincts visibles, corps bas et cordon entièrement dans le cadre ; aucun équipement. | Vue latérale légèrement trois-quarts pour rendre les six appuis lisibles. |
| Le Radôme errant | `radome-errant-base.png` | Grand dôme géodésique ivoire sur plateforme graphite, quatre modules chenillés latéraux visibles, conduites et feux ambrés ; machine entière. | Les quatre chenilles apparaissent alignées de profil ; distribution de l’autre côté non définie. |
| Le Léviathan de faille | `leviathan-faille-base.png` | Créature continue de type anguille, tête émoussée à droite, queue entière en courbe, petite nageoire dorsale et cordon ; aucune patte ou machine. | Corps relativement épais à l’avant ; longueur réelle de boss à fixer au moteur. |
| Le Dernier Amarré | `dernier-amarre-base.png` | Humanoïde massif de goudron recroquevillé, épaules larges, jambes fines, mains ouvertes et cordon thoracique unique ; silhouette entière à droite. | Posture suspendue et accroupie, sans assise physique ; contacts au sol à définir. |

La marge de 8 % demandée dans les prompts n’est pas constante. Les sujets acceptés restent dans le cadre, mais certains bois, queues, chaussures et machines se rapprochent davantage des bords. Aucun cadrage n’a été corrigé artificiellement.

## Preuves de transparence

- [Planche 1 : Consignateur, Remorque, Veilleur, Treuil](boss-alpha-review/boss-alpha-1.png).
- [Planche 2 : Cétacé, Gardienne, Collecteur, Grue](boss-alpha-review/boss-alpha-2.png).
- [Planche 3 : Contremaître, Cerf, Chef de triage, Rame](boss-alpha-review/boss-alpha-3.png).
- [Planche 4 : Porteur, Mécanisme, Archiviste, Alpiniste](boss-alpha-review/boss-alpha-4.png).
- [Planche 5 : Araignée, Radôme, Léviathan, Dernier Amarré](boss-alpha-review/boss-alpha-5.png).
- [Rapport du rendu Canvas et empreintes des planches](boss-alpha-review/canvas-review.json).

Ces preuves concernent le décodage PNG et la composition alpha. Elles ne constituent pas une validation de lisibilité de chaque boss sur tous les stages ni une preuve d’animation.

## Périmètre de gameplay

| Élément | Ajout de ce lot |
|---|---:|
| Bases visuelles originales de boss | 20 |
| Boss avec IA et combats implémentés | 0 |
| Cycles d’animation de boss | 0 |
| Phases, attaques, hitboxes ou transitions de boss | 0 |
| Modifications du moteur pendant ce lot visuel | 0 |

Les attaques, phases, dimensions de collision, points faibles, transitions, réactions aux impacts et sons restent à produire et à intégrer. Les documents de conception existants définissent ces boss ; une base peinte ne suffit pas à les rendre jouables.

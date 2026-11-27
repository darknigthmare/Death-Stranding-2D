# Les Lignes de Marée — bilan de livraison

**27 novembre 2026 · Death Stranding 2D · Échos de la Grève**

La passe livre une **méga-extension originale de 147 fiches et 70 bases visuelles**, raccorde **20 nouvelles arènes statiques**, et implémente le mode local **Relais de liaison** à deux membres par camp. Elle publie aussi le complément de fidélité précédemment conservé en local : 19 PNG, les phases du geste et le neuvième exercice du dojo.

[Catalogue du jeu](../../../../modes/echos-de-la-greve/extension.html) · [Relais de liaison](../../../../modes/echos-de-la-greve/teams.html) · [Bible originale complète](../../extensions/lignes-de-maree/BIBLE_EXTENSION.md) · [Catalogue structuré](../../extensions/lignes-de-maree/catalog.json) · [Sources](../../extensions/lignes-de-maree/SOURCES.md) · [Vérifications](VERIFICATION.md).

## 1. Ce qui est disponible dans le jeu

**Relais de liaison** utilise les huit kits existants. Deux membres distincts par camp peuvent affronter une IA ou un deuxième joueur sur le même poste. Le partenaire intervient avec un corps visible et vulnérable, puis retourne en réserve ; le relais transfère réellement le contrôle. Les jauges individuelles, coûts, interruptions, K.-O., objets persistants et reprise sont traités dans le moteur du duel. L’appui coûte 25 Cohésion, le relais 15 ; la Cohésion démarre à 50 et récupère 6 par seconde active. L’enregistrement dédié revient en pause. Le [contrat de réalisation](../20261127-team-gameplay/RELAIS_DE_LIAISON.md) donne toutes les règles et les commandes remappables.

**Les vingt arènes originales** sont sélectionnables en Versus, Entraînement et Relais de liaison. Chaque panorama garde son ratio natif et reçoit une ligne d’appui mesurée dans le vrai décor. Le bouton d’essai de son dossier ouvre la sélection d’entraînement correspondante. Le moteur Boss conserve ses 24 choix historiques compatibles et son option de lieu conseillé ; les nouveaux panoramas n’y sont pas ajoutés sans sa propre mesure de géométrie. Les décors sont statiques : les cent couches autonomes de la cible, les effets météo propres, les dangers de mission et les passages de campagne ne sont pas déduits de leur panorama.

**Le catalogue des Lignes de Marée** réunit 147 dossiers avec recherche, filtres par famille, filtre des images reçues, relations cliquables et téléchargement du PNG natif. Les boutons et badges distinguent la conception, l’image reçue et l’arène jouable. Les dix nouveaux personnages, vingt ennemis et vingt boss n’entrent pas dans les sélecteurs de kits ou de rencontres : leurs mécaniques et leurs cycles propres restent à produire.

## 2. Conception de l’extension

Le corridor côtier vit de refuges, d’eau traitée, d’abris et de voies de fret. Ses responsables ont parfois fini par retenir les ressources qu’ils voulaient protéger. Dix spécialistes tentent de rendre le passage et le choix à leurs habitants. La région est fictive et volontairement non située dans la chronologie officielle. Le dénouement concerne cette communauté et la circulation de ses ressources, sans modifier le destin des personnages canoniques.

La direction visuelle combine béton usé, roche noire, métal fonctionnel, protections étanches, caisses et outils lisibles, avec signalisation ambre ou cyan mesurée. Les appareils gardent une fonction matérielle. Les humains ne reçoivent ni DOOMS gratuit ni sang hématique générique ; les combats particuliers relèvent des reconstitutions du fan-game. Les [contraintes et sources](../../extensions/lignes-de-maree/SOURCES.md) séparent ces choix originaux de l’information officielle.

### Dix personnages

| Nom de terrain | Identité | Spécialité de jeu conçue |
| --- | --- | --- |
| Balise | Maëlle « Balise » Rocher | Ancrage / interception |
| Lest | Jonas « Lest » Vale | Pression lente / anti-approche |
| Suture | Inès « Suture » Sorel | Défense / contrôle court |
| Relais | Elias « Relais » Reed | Placement / information |
| Isobare | Naya « Isobare » Quill | Distance / tempo |
| Contrevoie | Oren « Contrevoie » Pike | Portée / vol de tempo |
| Vigie | Alma « Vigie » Voss | Mobilité sobre / punition |
| Écluse | Tariq « Écluse » Moss | Saisie / contrôle du sol |
| Sillage | Jun « Sillage » Akiyama | Mobilité / ressources brèves |
| Archive | Célia « Archive » Ward | Feintes / placement méthodique |

Chaque fiche possède trois techniques spéciales distinctes, une assistance, une technique majeure, une conclusion, un geste, une sélection/désélection, trois costumes conçus, une introduction, trois relations de rivalité et un épilogue. **Trente costumes conçus ne sont pas trente costumes dessinés.** Les minutages et dégâts sont des valeurs de conception, pas un équilibrage validé en match.

### Vingt stages dans quatre secteurs

| Secteur | Lieux |
| --- | --- |
| Le rivage retient | La Digue aval, Le Quai des refuges, Le Dépôt des amarres, Le Bassin muet, Le Phare couché |
| Ce qui nous maintient | La Serre de veille, La Station de captage, Le Viaduc de l’Ourlet, Le Relais des vents, La Pente des cairns |
| La circulation des voix | Le Triage noyé, La Gare suspendue, L’Atelier du réservoir, L’Écluse noire, Les Archives de béton |
| Laisser partir | Le Col de Contrevent, Le Plateau des aiguilles, Le Radôme ébréché, La Terrasse des veilleurs, Le Seuil de la marée |

Les vingt lieux appartiennent à un graphe connexe de **24 liaisons réciproques**. Les entrées, conditions de première ouverture et retours sont écrits dans le catalogue. Ils ne constituent pas encore un parcours de campagne exécuté par le moteur.

### Ennemis, boss et contenu associé

Les vingt ennemis comprennent **dix humains, quatre automates logistiques et six manifestations Échouées**. Leurs fiches définissent rôle, signal préalable, fenêtres d’attaque et de reprise, contre, issue et budget de présence. La conception interdit les attaques inévitables hors écran et privilégie l’immobilisation ou la restitution contre les humains.

Les vingt boss possèdent chacun **trois phases**, une condition de victoire, des objectifs et une possibilité de reprise définie. Le Consignateur protège ses cargaisons jusqu’à en retenir les destinataires ; les phases prévoient la réponse au bouclier et l’ouverture de ses consoles de péage. Les machines comme le Treuil amarré ou le Mécanisme de l’écluse utilisent leurs fonctions industrielles. Les manifestations de poix occupent une autre famille visuelle. Ces vingt bases sont des silhouettes de rencontre, sans simulation de boss ni cycle de phase ajouté à ce stade.

| Famille | Quantité conçue | Réception graphique de cette passe |
| --- | ---: | --- |
| Personnages | 10 | 10 postures natives |
| Stages | 20 | 20 panoramas natifs et raccordement statique |
| Ennemis | 20 | 20 bases natives |
| Boss | 20 | 20 bases natives |
| Accessoires | 20 | Fiches uniquement |
| Gadgets | 10 | Fiches uniquement |
| Véhicules | 4 | Fiches uniquement |
| Projectiles et pièces mobiles | 12 | Fiches uniquement |
| Missions | 20 | Déroulement, objectifs et reprises conçus |
| Bonus | 6 | Règles conçues |
| Duos | 5 | Contributions et séquences conçues |
| **Total** | **147** | **70 PNG actifs** |

## 3. Réception et conservation des fichiers

Les 70 PNG actifs représentent **145 362 802 octets**. Les personnages, ennemis et boss conservent leur transparence native ; les vingt décors sont des panoramas RGB de 1672 × 941. Aucun sprite de ce lot n’est extrait d’une planche collective. Les copies intégrées sont identiques aux sorties reçues ; les manifestes consignent dimensions, chemins, empreintes et prompts. Les propositions écartées ne gonflent pas le total des bases acceptées.

- [Dix personnages](characters-generation.json) et [vingt ennemis](enemies-generation.json), avec [revue visuelle](VISUAL_ASSETS.md).
- [Vingt panoramas](stages-generation.json), [mesures d’appui](stage-geometry.json), [recette native](stage-native.json) et [revue des arènes](STAGES_REVIEW.md).
- [Vingt boss acceptés](bosses-generation.json), trois corrections sélectionnées et [revue des silhouettes sur transparence](BOSS_VISUAL_REVIEW.md).
- [Inventaire courant des 70 bases](assets-manifest.json) et [contrôle global de livraison](delivery-verification.json).

Les **450 rasters et 33 SVG du commit de base `7e000d36f2eb0fa4578b545bfb3d8b334acd516a` sont préservés**. Les 19 PNG du complément de fidélité sont également conservés et raccordés. Le dossier d’assets du mode contient donc **539 rasters = 450 + 19 + 70**. Les captures de recette et candidats hors runtime ne sont pas inclus dans ce compte. Le remplacement du hold Heartman conserve son ancienne source, comme l’établit le [bilan de fidélité](../20261127-fidelity/BILAN.md).

Les comptes de jeu courant sont **huit kits jouables, dix modes, six rencontres Boss historiques, 45 configurations d’arène locales**, dont 44 compatibles avec le relais après exclusion de la liaison quai-hangar. Le catalogue original n’ajoute aucun kit à partir d’une image seule et n’altère aucun accès existant.

## 4. Vérification et portée

La recette d’équipe compte **25 groupes**, complétés par **six groupes de revue indépendante**. Cette revue a corrigé des reprises incohérentes, un verrou d’entrée orphelin, des coordonnées d’objet manquantes, un dash IA pendant le relais et l’attribution de la finale après un échange simultané. Le membre vivant reçoit maintenant le contrôle de la victoire, tandis que son partenaire reste K.-O. Quatre captures utilisent le moteur Canvas et 65 images réellement décodées.

La non-régression de présentation conserve **3 240 états identiques** au moteur de référence, dans 20 groupes ; le dojo passe 14 groupes et 53 parcours. Le catalogue original passe dix groupes sur données, intégrité, enregistrement des arènes et contrôleur dans un DOM simulé. Quatre groupes supplémentaires lancent les vingt liens d’entraînement et vérifient les sélecteurs réels de Versus, Boss Battle et équipe. Les vingt panoramas passent **100 cas natifs** avec un appui à y = 588 exactement et aucune marge vide dans l’écran. Les rapports d’arènes, de livraison HTTP, de données de coups et du salon privé sont détaillés dans [VERIFICATION.md](VERIFICATION.md).

Ces preuves couvrent la simulation réelle, les images décodées, la géométrie et le service HTTP. La [tentative de navigateur](BROWSER_REVIEW.md) est bloquée par le binaire Chromium absent (code 127), y compris avec les fichiers temporaires sur un volume disposant d’espace. Elles ne certifient pas une partie complète jouée dans Chromium, une manette physique, l’accessibilité de tout le navigateur ni l’équilibrage humain. Les images originales visent une cohérence de spin-off ; elles ne sont ni des références officielles ni une preuve de fidélité 1:1 des actifs canoniques historiques.

## 5. Manquants qui restent à produire

Pour les Lignes de Marée, la prochaine unité jouable complète requiert les poses d’action, les pièces détachées, le kit, les collisions, le comportement IA et la reprise d’un premier original. Elle peut ensuite recevoir sa mission et sa rencontre majeure. Le registre conserve les dix kits, vingt IA, vingt boss à trois phases, vingt missions, cent plans de décor, trente costumes, trente scènes personnelles, dix conclusions, cinq duos et les contenus associés.

Pour le socle de la bible, les supers collectives, Ruptures d’équipe, scènes dramatiques, clashes/QTE, bonus avancés, profil réseau d’équipe et profil contre Boss restent ouverts. Les corrections canoniques Die-Hardman et Higgs DS2 refusées par le contrôle de génération du complément précédent restent non reçues ; aucune création originale ne les remplace. Les besoins de kits DS2, d’animations intermédiaires, de sons et d’asymétries sont conservés dans le [registre principal](../../REGISTRE_PRODUCTION.md#relais-lignes-maree-20261127).

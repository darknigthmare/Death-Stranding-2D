# Death Stranding 2D

Téléchargez le dépôt et extrayez-le, puis ouvrez [JOUER.html](JOUER.html) dans un navigateur. L’écran titre propose la campagne **La Ligne silencieuse** et le mode de combat **Échos de la Grève**. Conservez le dossier `campagne/catalogue/` pour que la campagne charge ses cinq lots de données.

## Échos de la Grève

Le projet couvre **l’ensemble de l’univers Death Stranding** : premier jeu, Director’s Cut, **Death Stranding 2: On the Beach**, romans et adaptations officielles, y compris les projets annoncés. Le [registre des œuvres et versions](docs/combat/UNIVERS_DS.md) distingue leurs sources, leurs continuités et leur état de publication. Les versions DS2 et les costumes restent identifiés séparément.

Le roster jouable existant compte huit combattants : Sam, Fragile, Higgs, Cliff, le porteur MULE, Die-Hardman, Mama et Heartman. Ce socle ne limite pas les futurs personnages ; une présence dans le catalogue reçoit d’abord son rôle de combattant, boss, compagnon, soutien ou personnage narratif. Les huit histoires comprennent chacune trois duels et trois scènes illustrées : leurs 24 images originales sont complétées par 24 plans, soit 48 plans consultables. Les dix modes **Histoire, Campagne, Arcade, Versus, Boss Battle, Boss Rush, Tournoi, Entraînement, Défis et Relais de liaison** sont accessibles depuis le même accueil. Le mode fonctionne aussi directement depuis [le menu de combat](modes/echos-de-la-greve/index.html).

La **Campagne · Les Nœuds rompus** relie six chapitres du simulateur : quatre duels et deux rencontres Boss, avec quatorze interludes et une galerie propre. Elle raconte une perturbation du réseau interne de la reconstitution, sans modifier les événements officiels ni **La Ligne silencieuse**. La difficulté reste fixée pour la partie ; une interruption ou une défaite permet de reprendre au début du chapitre. Les autres progressions restent séparées. [Récit, fonctionnement et recette](docs/combat/production/20261125-completion/CAMPAGNE_NOEUDS_ROMPUS.md).

Pour essayer le MULE et sa caisse, ouvrez **Entraînement**, choisissez **MULE**, puis **Camp des MULEs**. Dans le profil de commandes par défaut, **H** balaie la piste avec le capteur. Vers l’adversaire + **H** dépose la caisse. Un coup fort à proximité la pousse. En direction opposée + **H**, le MULE rappelle la caisse le long du sol. Le menu **Commandes** donne les touches de chaque joueur. **Retour à la campagne** ramène à l’écran titre.

Versus et Entraînement proposent **vingt-deux lieux, vingt-trois zones graphiques et vingt-cinq configurations**. Elles réemploient **120 images de couche distinctes**, pour 125 liaisons de couches. Ils comprennent **Port Knot City**, **l’Incinérateur de la région Est**, la variante **Camp des MULEs · temps sec** et les sept ajouts des deux premiers lots du 25 novembre : **ruines de South Knot**, **ferme sous la pluie temporelle**, **approche de Mountain Knot**, **DHV Magellan**, **Plate Gate**, **lisière urbaine sous la tempête de sable** et **dunes sous le vent**. L’extension ajoute le **stand de tir DC**, le **viaduc nocturne DS2** et le **ravin rouge DS2**, ces deux derniers noms restant descriptifs. Chaque configuration dispose d’un aperçu et de cinq plans indépendants. Les nouveaux tournois utilisent aussi ces décors, à l’exception de la configuration liée décrite ci-dessous. Les tableaux sauvegardés dans la première version retrouvent leurs arènes d’origine. [Rendus historiques des arènes](docs/combat/apercus/stage-extension-20261119/) · [Variante sèche, ambiances et Duel originel](docs/combat/production/AMBIANCES_VARIANTE_MULE_20261119.md)

La configuration **Quai → hangar · liaison du simulateur** commence au terminal. Un coup lourd ou une projection réussi vers un bord peut ouvrir un passage de 36 ticks vers le hangar, une fois par manche. Le quai et le hangar restent aussi sélectionnables seuls. Cette liaison est une reconstitution du projet ; elle garde ses règles explicites et est exclue des rencontres Boss. [Règles, contre-jeu et recette](docs/combat/production/20261125-domains/TRANSITIONS.md).

Dans **Commandes → Mes commandes**, trois profils nommables conservent des touches principales et secondaires indépendantes pour J1/J2. Les libellés du jeu suivent le profil choisi. Les manettes que le navigateur expose avec une disposition standard disposent d’entrées de combat, avec zone neutre réglable ; le menu reste commandé au clavier, à la souris ou au toucher. Le salon privé choisit son profil local indépendamment du siège. Le Duel originel conserve ses commandes historiques. [Commandes, affectations et limites de validation](docs/combat/production/20261125-domains/COMMANDES.md).

Le panneau **Données du duel**, dans Commandes et au dojo, présente les trente attaques du moteur : délais, coûts, dégâts, portées, garde et annulations. Les [huit fiches et trois profils IA](docs/combat/ACTIONS_ET_IA.md) distinguent les valeurs actuelles des objectifs de conception et des règles Boss. Avant Versus et Arcade, les [28 paires de relations](docs/combat/RELATIONS_SIMULATEUR.md) proposent un bref échange passable, explicitement écrit pour le simulateur. Les histoires et la campagne conservent leurs récits.

Chaque arène possède un fond sonore et des sons de décor localisés. Le curseur **Ambiance du décor**, dans la sélection, les commandes et la pause, règle leur volume séparément des techniques. Le bouton **Son** coupe tout. Le salon privé reprend ces préférences.

Le réglage **Décor statique** immobilise le fond, sa météo et ses mouvements décoratifs à l’instant du choix. Les combattants, projectiles, repères et annonces continuent. Il se combine avec **Effets réduits**, garde sa propre préférence et accompagne les duels, rencontres Boss et le salon privé. [Arènes, profil statique et portée des vérifications](docs/combat/production/20261125-completion/RUNTIME.md).

En **Tournoi**, **Revoir le duel** relance un match joué depuis le tableau sauvegardé. Au dojo, sélectionnez **Enregistrer J2**, puis **Lire en boucle** pour travailler une réponse. Dans **Défis**, enchaînez les sept autres combattants en **Survie**, avec 100 PV initiaux et +15 PV après chaque victoire jusqu’à 100, ou gagnez **Livraison sous pression** en gardant le scellé intact.

### Extensions du guide et dossiers de liaison — 27 novembre 2026

Le guide général de la bible a été vérifié octet pour octet. Les **deux extensions originales** sont ajoutées avec leur provenance : [Tag, Taunts, Bonus](docs/combat/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) et [Slots verrouillés, Déblocages, Abonnés](docs/combat/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt). Leur [application au projet](docs/combat/EXTENSIONS_COMBAT.md) couvre les 38 rubriques supplémentaires, soit 68 rubriques associées à la bible.

Les huit combattants disposent d’un **geste de défi vulnérable de 0,9 seconde** dans les duels locaux et le dojo : B pour J1, P pour J2, L3 ou le bouton tactile, selon le profil de commandes. Huit PNG autonomes fournissent les poses de tenue du geste. La sélection distingue aperçu, confirmation et désélection, avec mouvement réduit. Les anciens raccourcis et replays restent compatibles ; le salon privé et les rencontres Boss conservent leurs commandes existantes. [Présentation et tests](docs/combat/production/20261127-extensions/PRESENTATION.md).

Les **[Dossiers de liaison](modes/echos-de-la-greve/progression.html)**, accessibles depuis l’accueil, réunissent 59 fiches. Huit souvenirs écrits se débloquent par une histoire terminée **OU** quatre exercices avec le même combattant. Les acquis restent enregistrés séparément ; les combattants, tenues, arènes et modes déjà disponibles gardent leur accès. Les sept bases DS2 sans kit portent « Kit en préparation », avec les identités masquées par défaut. Aucun abonnement réel n’est raccordé. [Progression et conditions](docs/combat/production/20261127-extensions/PROGRESSION.md).

Ce premier lot du 27 novembre portait les sorties natives récentes à **265** et les chemins d’images exposés à **395**. À la clôture de ce premier lot, les équipes/tag, les duos et les bonus avancés restaient à réaliser. Le relais local est maintenant livré dans le complément décrit ci-dessous ; duos et bonus avancés restent ouverts. [Bilan historique, 17 rendus natifs et limites](docs/combat/production/20261127-extensions/BILAN.md).

### Phases du geste et neuvième exercice — complément du 27 novembre

Les gestes de Sam, Fragile, Higgs DS1, Cliff, du MULE, de Mama Atelier et de Heartman ont maintenant des poses propres d’entrée et de sortie. Mama Viaduc reçoit ses trois poses et conserve son costume pendant le cycle comme dans la sélection. Le geste central de Heartman est corrigé pour garder son équipement au même poignet que sa posture active. Cette continuité ne certifie pas à elle seule chaque détail canonique. Les 54 pas, la vulnérabilité et les interruptions du geste restent inchangés.

Dans **Entraînement → Parcours du dojo**, **Le geste expose** demande de terminer un geste à bonne distance puis d’interrompre celui du partenaire avec un coup léger. Les quatre exercices requis pour les souvenirs restent les mêmes. Une référence fixe de décharge du Maser Handgun DS2 rejoint aussi le catalogue. Le complément reçoit **19 PNG natifs**, conserve les 450 images raster antérieures et porte les chemins d’images actifs à **413**. Les PNG récents comptent 284 fichiers conservés, dont 283 actifs après remplacement du hold Heartman. [Bilan, preuves et manquants précis](docs/combat/production/20261127-fidelity/BILAN.md).

La correction du masque **et du costume** de Die-Hardman ainsi qu’une silhouette entière de Higgs DS2 ont été refusées par le contrôle automatique de génération ; aucun remplacement n’est déclaré livré pour ces deux sujets. Les poses intermédiaires complètes, les asymétries lors du miroir et les autres besoins du registre restent ouverts. La fidélité 1:1 est l’objectif de comparaison documenté, sans certification globale du projet.

### Les Lignes de Marée et Relais de liaison — complément du 27 novembre

**[Les Lignes de Marée](modes/echos-de-la-greve/extension.html)** ouvre une extension originale cohérente avec l’univers : **10 personnages, 20 stages, 20 ennemis et 20 boss**, illustrés par **70 nouveaux PNG natifs indépendants**. Le catalogue réunit **147 fiches** avec 20 missions, 20 accessoires, 10 gadgets, 4 véhicules, 12 projectiles ou pièces mobiles, 6 bonus et 5 duos. Quatre secteurs et 24 liaisons relient les vingt lieux. La [bible complète](docs/combat/extensions/lignes-de-maree/BIBLE_EXTENSION.md) décrit les techniques, campagnes personnelles, costumes, objectifs, télégraphes et trois phases de chaque boss. Ce sont des créations du fan-game, identifiées comme telles, sans événements ajoutés au canon officiel.

Les **20 panoramas sont sélectionnables comme arènes statiques** en Versus, Entraînement et Relais de liaison. Le bouton **Essayer cette arène** d’une fiche ouvre sa sélection d’entraînement. Les fichiers conservent leur ratio et une ligne de sol mesurée ; les cinq plans de parallaxe de chaque lieu, les dangers et les 24 passages de campagne restent à réaliser. Les vingt nouvelles configurations portent le total disponible à **45**, dont **44 compatibles avec le relais** après exclusion de la liaison quai-hangar.

Le nouveau **[Relais de liaison](modes/echos-de-la-greve/teams.html)** joue deux membres par camp, avec les huit kits existants, contre une équipe IA ou une autre personne sur le même poste. Chaque membre garde sa vie, son Chiral et son équilibre. Un appui coûte **25 Cohésion** ; un relais volontaire, **15**. L’appui est réellement touchable ; le survivant prend automatiquement la relève après un K.-O. L’enregistrement est séparé et reprend en pause. Les commandes partagées **Finalité / RT** et **Geste / L3** deviennent respectivement Appui et Relais pendant le combat. [Règles, reprise et recette](docs/combat/production/20261127-team-gameplay/RELAIS_DE_LIAISON.md).

Les dix nouveaux personnages, vingt ennemis et vingt boss disposent de leur **conception et de leur base visuelle** ; leurs kits, IA et animations propres ne sont pas encore jouables. Le catalogue les distingue des vingt arènes reçues. Les 450 anciennes images raster et les 19 PNG du complément de fidélité sont conservés à l’identique, pour **539 images raster dans les assets du mode**. Les candidats écartés et captures de recette ne sont pas inclus dans ce total. [Bilan de livraison et manquants précis](docs/combat/production/20261127-lignes-de-maree/BILAN.md).

### Affronter les boss

**Boss Battle** ouvre six rencontres : Catcher léonin, Catcher aquatique, baleine, géant, camion MULE et convoi MULE. Choisissez l’un des huit combattants, la difficulté et l’arène. Les attaques sont annoncées avant l’impact. Après avoir immobilisé un camion, récupérez sa cargaison avec **Colis / Appui** (**T** par défaut) et livrez-la au dépôt gauche ; le convoi comporte deux vagues. Le menu **Commandes** donne les techniques du combattant. Les résultats et la reprise sont sauvegardés séparément des campagnes.

Le lot univers du 25 novembre a ajouté **Boss Rush**, alors huitième mode intégré et testé en simulation : les six boss s’enchaînent sur leurs lieux conseillés. La série commence à **120 PV** ; une victoire rend **20 PV**, jusqu’à 120, et l’énergie et la garde reviennent à 100 pour la rencontre suivante. Une défaite termine la série. La reprise et les records restent séparés de Boss Battle et de Survie. [Règles du Boss Rush et portée des vérifications](docs/combat/production/20261125-universe/BOSS_RUSH.md).

La reprise du 24 novembre réunit **113 images natives** de personnages, tenues, projectiles, boss, décors et récit. Elle comprend Mama Atelier et Viaduc, les images principales de Heartman et Die-Hardman, ainsi que les onze images de Higgs avec son masque crânien corrigé. Les [Archives de Bridges](modes/echos-de-la-greve/archives.html) présentent notamment Deadman, Amelie, Bridget et Lockne. Le premier lot statique du 25 novembre apporte quinze autres PNG : portraits, silhouettes, ennemis, grenades et panoramas. Ces deux lots antérieurs représentent **128 images natives actives**, préservées dans la nouvelle livraison sans les compter comme de nouvelles créations.

Le [catalogue Silhouettes et horizons](modes/echos-de-la-greve/static-assets.html) présente **66 images fixes** : 32 DS1 / Director’s Cut, **33 DS2** et une reconstitution du simulateur. Il distingue personnages, tenues, ennemis, véhicules, équipements et paysages, avec leurs versions et leurs sources. Les Archives réunissent **16 dossiers**, dont douze pour DS2. Les nouveaux dossiers présentent Lucy, Doctor, Heartman DS2 et The President ; une fiche ou une image fixe ne constitue pas un nouveau combattant.

Le [lot univers](docs/combat/production/20261125-universe/LOT_UNIVERS_20261125.md) avait livré **34 nouveaux PNG** et porté les sorties natives récentes actives à **162**. Le complément livre **53 PNG sélectionnés** : treize bases fixes, vingt-quatre plans des histoires, un panorama et quinze couches de décor. Les **215 PNG natifs récents actifs** comprennent les 162 précédents préservés et ces 53 ajouts. Les images originales des routes sont conservées. Aucune nouvelle animation n’est générée dans cette phase. Le [bilan du complément](docs/combat/production/20261125-completion/LOT_COMPLETION_20261125.md), le [chapitre 17 de la bible](docs/combat/BIBLE_COMBAT.md#17-complément-de-production-campagne-et-plans-narratifs--25-novembre-2026) et le [registre de production](docs/combat/REGISTRE_PRODUCTION.md) détaillent les livraisons, les limites et les manques encore identifiés.

Le lot domaines ajoute **14 PNG natifs** : panorama et cinq couches du hangar, puis Maser Gun DC, catapulte DC, Roadster DC, Buddy Bot DC, rampe de saut DC, pont chiral DC, panorama du stand de tir DC et module Yamato DS2. À la réception du lot domaines, les **229 PNG récents actifs** comprenaient les 215 précédents inchangés et ces 14 ajouts. Le stand de tir y était au catalogue seulement ; l’extension lui ajoute maintenant ses couches jouables, et le wagon Yamato ne certifie pas les autres variantes de monorail. La mitrailleuse MP DS2 n’a pas de fichier livré et reste ouverte. [Sources, adaptations et limites](docs/combat/UNIVERS_DS.md#11-références-du-lot-domaines) · [Lot domaines de la bible](docs/combat/BIBLE_COMBAT.md#lot-domaines-20261125) · [Bilan de livraison](docs/combat/production/20261125-domains/LOT_DOMAINES_20261125.md).

Le [lot extension](docs/combat/BIBLE_COMBAT.md#lot-extension-20261125) livre huit exercices guidés dans l’Entraînement et un [compendium des six Boss](docs/combat/BOSS_ET_RENCONTRES.md) avec leurs propres chiffres. Les exercices passent dix groupes et quarante parcours ; deux exercices sont aussi capturés en Canvas natif, sans polices système. Les preuves distinguent DOM simulé, rendu natif et HTTP réel ; aucun navigateur ni matériel manette n’est revendiqué. **Vingt-huit PNG natifs fixes** ajoutent onze bases et trois arènes ; les vingt-quatre cas d’arènes et dix-sept groupes de galerie sont réussis. L’inventaire vérifie **257 PNG récents** — dont 229 précédents inchangés — et **387 chemins d’images uniques**, tous présents. Les huit combattants, neuf modes et six Boss sont conservés ; aucune animation nouvelle n’est produite. Le Strider holographique reste non livré après un refus de génération, sans relance, et est exclu de tous les comptes. [Bilan, sources et limites](docs/combat/production/20261125-extension/BILAN.md).

Les recettes séparent le rendu avec Canvas natif, les parcours d’interface dans un DOM simulé, le graphe audio simulé et le serveur HTTP réel. Elles ne prétendent pas remplacer une session de navigateur, une manette physique ou une partie multijoueur sur Internet. Les entrées de manette du lot Commandes sont vérifiées par échantillons synthétiques, à travers les vrais moteurs.

[Galerie des 113 images](docs/combat/production/20261124-suite/index.html) · [État d’intégration, vérifications et fidélité restant à établir](docs/combat/production/20261124-suite/SUITE_MANQUANTS_20261124.md) · [Règles de Boss Battle](docs/combat/production/20261124-suite/BOSS_BATTLE_20261124.md)

### Jouer à deux dans un salon privé

L’hôte lance le relais depuis la racine du projet avec Node.js 18 ou ultérieur.

```sh
node modes/echos-de-la-greve/netplay-server.cjs
```

Sur ce poste, ouvrir `http://127.0.0.1:8080/netplay.html`, créer le salon et copier son invitation. Pour jouer depuis deux machines, la page **Salon privé en réseau** explique comment rendre le relais accessible sur le réseau local et utiliser l’adresse de l’hôte. Chaque joueur choisit son combattant et se déclare prêt. L’hôte choisit l’arène et lance le duel.

Le [Duel originel](modes/echos-de-la-greve/duel-originel/index.html) propose le duel direct Sam/Higgs et l’entraînement dans six décors : la Grève, le centre de distribution, le camp MULE, l’abri Timefall, le champ de bataille et le bassin de goudron. Le choix du décor est mémorisé pour la revanche. Ses deux récits restent sur la Grève, et ses commandes sont affichées sur l’écran de combat.

- [Bible du mode de combat et fonctions jouables](docs/combat/BIBLE_COMBAT.md)
- [Guide Combat Games v1.0 associé à la bible : périmètre, écarts et priorités](docs/combat/BIBLE_COMBAT.md#12-intégration-du-guide-combat-games-v10)
- [Œuvres, versions et sources de tout l’univers Death Stranding](docs/combat/UNIVERS_DS.md)
- [Registre de production : éléments livrés, manques, priorités et dépendances](docs/combat/REGISTRE_PRODUCTION.md)
- [Actions chargées, huit fiches et profils IA](docs/combat/ACTIONS_ET_IA.md)
- [Matrice des 28 paires de relations du simulateur](docs/combat/RELATIONS_SIMULATEUR.md)
- [Conception historique du duel entre Sam et Higgs](docs/combat/DUELS_SAM_HIGGS.md)

### Raccorder un autre export v0.58

Depuis la racine du dépôt, cette commande ajoute l’entrée d’Échos de la Grève à une nouvelle copie de votre export. Gardez le fichier HTML généré au même niveau que le dossier `modes/`.

```sh
python3 outils/integrer_duels.py "/chemin/vers/export-v0.58.html" --sortie Mon_export_avec_combat.html
```

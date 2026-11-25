# Lot domaines — commandes, combat, données et bases visuelles

**25 novembre 2026 · Death Stranding 2D / Échos de la Grève**

Ce lot prolonge le travail intégré dans `main` au commit `2250b7c1b54b445637e0c9354133e6fecbc325de`. Il ajoute des commandes configurables, une entrée manette standard, la première liaison d’arène, le catalogue des valeurs réellement exécutées, une matrice de rencontres et quatorze PNG statiques. La bible, les sources et le registre qualifient séparément ce qui est jouable, ce qui reste une base visuelle et ce qui appartient à la fiction du simulateur.

**Publication :** [commit de production `d7ce813`](https://github.com/darknigthmare/Death-Stranding-2D/commit/d7ce8137633b3013481008a1af5242f13dbe7399), branche `codex/echos-domains-20261125`, destination [main](https://github.com/darknigthmare/Death-Stranding-2D/tree/main). L’ouverture de PR a rencontré une erreur interne du connecteur, sans création de PR. Le chemin de publication retenu est une fusion Git à deux parents, avec contrôle de la référence attendue et égalité entre l’arbre distant et l’arbre local vérifié.

[Jeu local](../../../../modes/echos-de-la-greve/index.html) · [Catalogue des images](../../../../modes/echos-de-la-greve/static-assets.html) · [Bible, chapitre 18](../../BIBLE_COMBAT.md#lot-domaines-20261125) · [Registre de production](../../REGISTRE_PRODUCTION.md).

## 1. Commandes personnalisables et manettes

Le bouton **Commandes** du jeu et du salon ouvre trois profils nommables. Chaque profil contient J1 et J2, avec une touche principale par action et une seconde facultative. La saisie gère les collisions entre les deux joueurs, l’annulation, les défauts, les données enregistrées invalides et l’indisponibilité du stockage. Le choix local de commandes dans le salon est indépendant de la place réseau.

Clavier, tactile et manette sont agrégés : relâcher une source ne coupe pas une action encore tenue par une autre. Le dernier relâchement, la perte de focus, la pause et les changements de configuration nettoient les états. La revue indépendante a permis de corriger une surbrillance tactile qui pouvait rester active après la fin d’un maintien clavier.

Les manettes reconnues comme **standard** disposent d’une zone neutre réglable, d’une attribution stable et d’un réarmement après pause ou déconnexion. Les neuf modes locaux et le salon utilisent le module commun. J2 demeure réservé aux situations où le mode prévoit effectivement un deuxième humain. La navigation des menus reste au clavier ou au toucher. Le Duel originel conserve son interface et ses commandes historiques ; l’exclusion est indiquée dans l’éditeur.

L’aide et les objectifs emploient les actions du mode : les rencontres Boss distinguent notamment Projection, Colis/Appui et Charge chirale. Les anciens rappels de touches fixes ont été retirés des objectifs et du HUD Boss.

La [fiche Commandes](COMMANDES.md) détaille les profils, la table de défauts, les boutons de manette, les cas de pause et la portée par mode. La [recette](commandes-verification.json) exécute les vrais handlers de l’application et les moteurs locaux dans un hôte DOM simulé ; les échantillons Gamepad ne remplacent pas un essai matériel.

## 2. Première liaison : quai → hangar

La configuration **Quai → hangar · liaison du simulateur** commence sur le quai du centre. Un coup lourd standard ou une projection non bloquée, réussi au sol vers un bord, peut ouvrir le passage. Le K.-O. et la fin du temps priment. Un seul passage est permis par manche.

Le passage dure **36 ticks, soit 0,6 seconde à 60 Hz**. Il n’ajoute aucun dégât ni coût et suspend le chrono de manche. À l’arrivée, les ressources après le coup sont conservées ; actions, marqueurs et projectiles sont nettoyés. Les deux combattants retrouvent simultanément le contrôle, face à face, avec un écart de 260 unités.

Le centre ordinaire et le hangar choisi seul restent des duels sans passage. Le choix lié est explicite en Versus, au dojo et en salon privé. Il est exclu du moteur Boss et des nouveaux tirages automatiques de tournoi. Les sauvegardes de tournoi déjà existantes conservent leurs arènes et résultats.

Les checkpoints, le retour arrière réseau et les replays enregistrent la version de liaison `terminal-quay-hangar@1`. Les deux zones sont demandées dès le début ; le chargement d’une image ne décide pas du résultat de simulation. Le hangar constitue une reconstitution du même centre dans le projet, sans assertion de géographie canonique.

La [fiche de transition](TRANSITIONS.md) et sa [preuve logique](transitions-verification.json) couvrent les conditions, priorités, retours, replays et limites. Les captures montrent [le quai](linked-renders/terminal-linked-right-quay.webp), [l’annonce](linked-renders/terminal-linked-right-passage.webp) et [l’arrivée](linked-renders/terminal-linked-right-hangar.webp).

## 3. Données du duel et profils IA

Les [Actions et IA](../../ACTIONS_ET_IA.md) décrivent les **30 définitions d’attaque** : six communes et vingt-quatre techniques réparties entre les huit kits. Les fiches donnent démarrage, activité, récupération nominale, coût, dégâts, volumes, trajet, garde, annulations et conditions. Six fiches complémentaires expliquent les actions universelles de déplacement, défense et finalité.

Un extracteur conservé dans le dépôt relit les définitions du moteur sans les modifier. Les données structurées alimentent le catalogue consultable dans **Commandes** et au dojo. Les paramètres de `StrandFight` restent l’autorité ; l’ajout documentaire ne remplace ni les règles présentes par les valeurs cibles de conception, ni les règles distinctes du moteur Boss.

Les trois profils IA sont décrits par leurs cadences et conditions de décision réelles. Les probabilités sont rattachées à leurs branches, sans les présenter comme des fréquences globales ni attribuer une perception humaine à l’IA.

Le [rapport du domaine](ACTIONS_RELATIONS_IA.md) précise la convention de comptage des ticks et les cas où un avantage ou une portée ne peut pas être réduit à une valeur unique.

## 4. Relations entre les huit combattants

La [matrice du simulateur](../../RELATIONS_SIMULATEUR.md) couvre **28 paires, 56 échanges orientés et huit miroirs**. Elle est intégrée aux entrées de Versus et Arcade, avec un accès explicite pour passer l’échange et commencer le combat.

Ces répliques sont des créations du projet, signalées **Fiction du simulateur**. Les huit kits conservent leur version DS1/Director’s Cut ; les échanges ne leur attribuent pas des connaissances ou tenues DS2. Les routes Histoire, les textes de campagne, les rivalités et les finalités existantes restent inchangés. Aucun doublage ni animation de dialogue supplémentaire n’est compté.

## 5. Images natives et intégration à la bible

Le lot comprend **14 PNG natifs** : six pour le hangar, puis huit bases sourcées. Chaque image conserve ses octets et sa résolution d’origine. La vérification décode onze images avec transparence et trois opaques, pour **22 323 710 octets**. Les **215 images natives des lots précédents sont inchangées**, portant le total récent actif à **229**.

| Sujet ajouté | Œuvre ou statut | Utilisation livrée |
|---|---|---|
| Hangar : panorama et cinq couches | Reconstitution Échos de la Grève | Zone jouable et passage depuis le quai ; panorama au catalogue |
| Maser Gun | Director’s Cut | Arme fixe isolée ; distincte du Maser Handgun DS2 |
| Catapulte de fret | Director’s Cut | Structure fixe de catalogue |
| Roadster | Director’s Cut | Véhicule fixe, trois quarts arrière |
| Buddy Bot | Director’s Cut | Robot porteur chargé, pose fixe |
| Rampe de saut | Director’s Cut | Structure fixe avec son arc jaune |
| Pont chiral | Director’s Cut | Passerelle translucide isolée |
| Stand de tir | Director’s Cut | Panorama fixe de catalogue ; aucune arène jouable ajoutée |
| Wagon de monorail Yamato | DS2 · On the Beach | Module blanc suspendu ; livrée et version distinctes |

La galerie passe à **52 entrées** : 22 DS1/DC, 29 DS2 et une reconstitution du projet. Le filtre d’œuvre distingue cette dernière. Chaque nouvelle carte renvoie à son passage de bible et à sa référence qualifiée.

La [revue visuelle](REVUE_VISUELLE.md), les [sources](reference-research.json), la [vérification native](native-assets-verification.json) et le [manifeste avec prompts](../../../../art/sources/echos-de-la-greve/production-20261125-domains/manifest.json) conservent la provenance, les parties observées, les adaptations et les échecs de génération. Les détails masqués ou trop petits dans les captures ne reçoivent pas une certification de fidélité 1:1.

## 6. Réception technique

| Domaine | Résultat vérifié |
|---|---|
| Commandes | 16 groupes ciblés ; touche remappée et manette synthétique raccordées au vrai moteur pour chacun des neuf modes |
| Campagne | Six rencontres gagnées, deux défaites/reprises, sauvegarde isolée, interludes et 55 chemins requis présents |
| Combat ordinaire | 336 checkpoints identiques à la base, avec le même catalogue courant fourni aux deux moteurs |
| Présentation | 650 comparaisons de simulation identiques entre décor statique et animé |
| Transition et réseau simulé | Huit déclenchements joueur/côté/attaque, 802 états de replay identiques et 13 retours de checkpoint, dont un traversant le changement de zone |
| Tournoi | 200 tirages sans liaison implicite ; 200 anciennes sauvegardes reprises sans changer leurs arènes ni résultats |
| Rendu natif | Huit cas du hangar, 26 vues de liaison et 14 restaurations RGBA identiques |
| Données du duel | 640 impacts, 300 annulations, 34 mesures d’avantage, 207 cas conditionnels et 24 seuils IA |
| Relations | 56 orientations et huit miroirs ; routes et scènes préexistantes inchangées |
| Galerie | 52 entrées, filtres et liens de documentation vérifiés dans un DOM simulé |
| Distribution HTTP | Nouveaux modules, 52 images de galerie, 48 images de huit zones étendues et 48 plans narratifs servis avec les octets et types MIME attendus, avec et sans préfixe |
| Images | 14 copies natives identiques et 215 images précédentes préservées |

Le [journal HTTP](http-verification.log), la [preuve galerie](static-gallery-verification.json), l’[inventaire courant](catalogue-inventory.json) et les rapports de chaque domaine sont joints. Les preuves de lots antérieurs ne sont pas remplacées par des chiffres plus récents.

Les tests exécutent les moteurs réels et, selon le cas, Canvas natif ou un hôte DOM simulé. Ils ne valident pas un navigateur matériel, une manette physique, deux machines distantes ni une mise en page mobile rendue. Les parcours Playwright adaptés ne sont pas annoncés exécutés. L’équilibrage compétitif humain reste à éprouver.

## 7. Manquants toujours identifiés

Le périmètre de la bible reste tout l’univers DS, sans plafond de huit identités. Ce lot ne transforme pas les portraits et accessoires du catalogue en kits jouables. Restent notamment les kits supplémentaires, leurs interactions et leur équilibrage, les autres liaisons, des arènes encore limitées au panorama, les fiches détaillées du moteur Boss, les voix et musiques produites, les langues supplémentaires et les essais sur navigateur/manette/réseau réels.

La mitrailleuse MP DS2 possède une référence officielle inspectée, mais **aucun PNG livré** : les deux sorties ont été refusées par le service de génération. La première tentative du Maser Gun a également été refusée ; le second essai identique a produit la base retenue. Ces essais ne sont pas comptés comme du contenu livré.

Support Skeleton, flacon de réparation, Watcher, Armed Survivalist, Blood Boomerang, Tar Cannon, grenade holographique et autres variantes de monorail conservent leurs limites de référence ou de production. Le [registre](../../REGISTRE_PRODUCTION.md) maintient leur statut, leurs dépendances et les critères de réception, avec les adaptations et projets dérivés séparés des jeux.

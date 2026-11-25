# Échos de la Grève

## Bible du mode de combat de Death Stranding 2D

**Édition de conception du 18 novembre 2026, mise à jour du 25 novembre 2026 · Périmètre : l’ensemble de l’univers Death Stranding.**

**Mise à jour du 25 novembre 2026 : Guide Combat Games v1.0 associé ; lots univers, complément et domaines réceptionnés. Le lot extension prépare huit exercices guidés, un compendium propre aux six rencontres Boss, douze bases fixes et trois arènes supplémentaires. Les références visuelles sont inspectées ; la production et les recettes en cours sont distinguées au [§19](#lot-extension-20261125). Les §13–18 conservent les états datés de leurs lots.**

Deux silhouettes se font face sur la laisse de mer. Sam se baisse pour poser une caisse. L’autre joueur dispose d’un instant pour avancer. S’il se précipite, Sam peut l’attendre, lien en main. S’il s’arrête, Sam regagne son équilibre et choisit la distance du prochain échange. Ce geste ordinaire de porteur résume le duel que nous voulons construire.

### Référentiel commun associé

Le [Guide général Combat Games v1.0](references/Combat_Games_Guide_General_v1.0.txt) complète cette bible selon le contexte d’Échos de la Grève. Le [chapitre 12](#12-intégration-du-guide-combat-games-v10) associe ses 30 rubriques aux chapitres existants, précise leur statut et fixe les contrôles attendus. Les règles actuellement chargées, la conception cible et les références officielles restent identifiées séparément. Le [registre de l’univers](UNIVERS_DS.md) précise les œuvres, éditions, continuités, sources et projets annoncés ; le [chapitre 16](#16-univers-complet-boss-rush-et-nouvelles-arènes--25-novembre-2026) donne le bilan du lot univers livré. Le [registre de production](REGISTRE_PRODUCTION.md) suit les éléments présents et manquants par domaine, avec ID, œuvre/version, rôle, source, priorité, dépendances et preuve. Le [chapitre 17](#17-complément-de-production-campagne-et-plans-narratifs--25-novembre-2026) documente le complément livré et ses preuves locales. Le [chapitre 18](#lot-domaines-20261125) suit les actions, relations, contrôles, transition et références du lot domaines. Le [chapitre 19](#lot-extension-20261125) suit les exercices, le compendium Boss et les nouvelles références en production.

### Périmètre de cette édition

| Ensemble | Contenu | Lecture |
|---|---|---|
| Univers de référence | Death Stranding, Director’s Cut, Death Stranding 2: On the Beach, romans, adaptations officielles et projets annoncés. | Périmètre complet ; chaque œuvre garde son statut et sa continuité dans [UNIVERS_DS.md](UNIVERS_DS.md). |
| Premier noyau | Sam, Fragile, Higgs, Cliff. La Grève, le terminal Bridges et le champ de bataille de Cliff. | Distribution et lieux retenus pour la première réalisation, sans limiter les extensions. |
| Jeu de combat cible | Règles chiffrées, commandes techniques, 8 fiches de combat, 8 histoires individuelles, 8 arènes de la cible initiale et réalisation des fatalités. | Spécifications de production. Les valeurs proposées demandent des essais en jeu. |
| Socle intégré avant le lot univers | Huit combattants, huit histoires individuelles, douze lieux et une variante sèche du camp MULE, six rencontres Boss et sept modes d’accueil. | Existant issu de la suite du 24 novembre et de la fusion des lots antérieurs ; huit combattants ne sont pas un plafond. |
| Lot univers du 25 novembre | Boss Rush, quatorze images fixes DS2 et vingt plans pour quatre nouvelles arènes sont intégrés. | Huit modes, seize lieux, dix-sept configurations et quatre-vingt-cinq couches ; le §16 précise les comptes et la portée des vérifications. |
| Complément du 25 novembre | 13 bases fixes, 24 plans narratifs, 1 panorama et 15 couches pour 3 arènes ; campagne Les Nœuds rompus et profil statique. | 53 PNG livrés ; neuf modes, dix-neuf lieux, vingt configurations et cent couches vérifiés localement au §17. Aucun nouveau combattant ou animation déduit des images. |
| Lot domaines du 25 novembre | Catalogue des actions/IA, matrice des relations, commandes reconfigurables, hangar et liaison explicite ; 14 nouvelles images fixes. | 19 lieux, 20 zones graphiques, 22 configurations, 105 couches distinctes ; preuves et limites au §18. |
| Lot extension du 25 novembre | Huit exercices dirigés, compendium des six Boss, douze bases fixes et trois arènes supplémentaires en production. | Références inspectées ; livraisons, intégration et validation suivies séparément au §19. Les neuf modes et huit kits restent le socle. |
| Fidélité | Le chapitre 11 associe les décisions visuelles à des images publiées par les créateurs et l’éditeur. | Chaque costume, accessoire et côté du corps demande une comparaison visuelle avant validation 1:1. |

Les mentions **source** renvoient à l’œuvre officielle et à sa version identifiées. Les rencontres, dialogues, noms de techniques, effets de jauge et plans de mise en scène ci-dessous sont **des créations du mode annexe**. L’entrée dans la simulation isole ses résultats du récit de la campagne principale. Les boutons, règles et minutages qui suivent décrivent la cible de conception. Le menu Commandes de la version jouée fait foi pour les fonctions disponibles.

### Socle jouable et extension du 25 novembre

Depuis la campagne v0.58, le bouton **Échos de la Grève** ouvre les huit histoires de Sam, Fragile, Higgs, Cliff, du porteur MULE, de Die-Hardman, de Mama et de Heartman. Ces huit kits et leurs identifiants constituent le roster existant à préserver ; le catalogue de l’univers accueille aussi de nouveaux personnages et des versions DS2 distinctes. Chaque combattant dispose de trois adversaires, d’une introduction, d’une rencontre avec son rival et d’un épilogue. Une victoire valide le chapitre dans le navigateur. Une défaite permet de rejouer immédiatement la même rencontre. Les scènes vues se retrouvent dans la galerie. Le menu donne aussi accès au **Duel originel**, avec ses deux récits et son propre système de commandes.

Le tournoi tire un tableau de quatre, six ou huit **participants**, choisis parmi les huit combattants jouables. À six, deux participants distincts passent directement en demi-finale. Un ou deux joueurs peuvent s’inscrire. Les duels entre deux IA produisent un score simulé. Un duel comprenant un humain se joue au clavier, avec les commandes tactiles ou avec une manette standard exposée par le navigateur ; les limites de validation matérielle figurent au §18. Une victoire exige deux manches. Le tableau sauvegardé restitue les emplacements, les scores et le prochain duel. Un nouveau tirage enregistre aussi l’arène de chaque rencontre. Les anciens tableaux conservent leur choix parmi les trois premiers terrains.

Les huit parcours totalisent vingt-quatre scènes de galerie. Dans **L’inventaire du matin**, le MULE rencontre Mama au camp, Die-Hardman au terminal et Sam au camp. Die-Hardman termine sa campagne devant Cliff, Mama devant Die-Hardman et Heartman sur la Grève face à Higgs. [Sélection des huit combattants](apercus/selection.webp)

Le socle intégré rassemble les dix lieux du chapitre 7, **Port Knot City**, **l’Incinérateur de la région Est** et la variante **Camp des MULEs · temps sec**, sélectionnables en Versus et au dojo. Il compte treize configurations, chacune avec cinq plans, soit soixante-cinq couches. Le lot du 25 novembre ajoute les ruines de South Knot, la ferme sous la pluie temporelle, l’approche de Mountain Knot et la berge du DHV Magellan dans DS2. Ce lot atteint **seize lieux, dix-sept configurations et quatre-vingt-cinq couches**, avec vingt nouveaux plans intégrés (§16). Le complément ajoute Plate Gate, la lisière urbaine sous le front de sable et les dunes : ce complément atteint **dix-neuf lieux, vingt configurations et cent couches** (§17). Le lot domaines ajoute le hangar et une configuration de liaison : **dix-neuf lieux, vingt zones graphiques, vingt-deux configurations et cent cinq couches distinctes**, pour cent dix liaisons de couches (§18). Le hangar reste une zone du terminal, et la configuration liée réemploie les plans du quai. Chaque configuration possède un panorama et cinq images indépendantes : ciel ou fond intérieur, lointain, plan intermédiaire, sol et premier plan. Les plans se déplacent à des vitesses distinctes. Le camp d’origine garde son gravier humide sous la pluie ; sa variante conserve le même lieu sous un ciel plus clair, avec un sol sec et une poussière légère. Les histoires gardent leurs lieux scénarisés. [Rendus historiques du socle des arènes](apercus/stage-extension-20261119/) · [Lot de la variante sèche et des ambiances](production/AMBIANCES_VARIANTE_MULE_20261119.md).

Les huit combattants disposent de poses individuelles de garde, accroupissement, montée, sommet et descente du saut. Mama Atelier, Die-Hardman, les six poses principales de Higgs et les cinq images principales de Heartman emploient désormais des PNG détaillés. Les points d’appui et les crops de ces sources natives sont mesurés séparément ; les proportions de chaque pose sont conservées. La fente et le saut replié de Higgs ont une hauteur réduite pour éviter de grossir sa tête et son torse. Mama Viaduc possède maintenant dix images humaines séparées et une géométrie native propre ; son chargement partiel se replie sur Atelier avec le bon cadrage. Les planches de pas et d’impact de Sam et Cliff ont été revues : elles contiennent chacune quatre variantes peintes cohérentes avec leurs stances, et ne constituent pas un manque d’images. Une animation plus ample serait une amélioration distincte. Les captures historiques suivantes documentent les états antérieurs : [Die-Hardman contre Cliff](apercus/diehardman-duel.webp) · [L’ancrage de Mama](apercus/mama-duel.webp) · [Le signal de Heartman](apercus/heartman-duel.webp).

Le moteur fonctionne à 60 pas de simulation par seconde. Une manche dure 75 secondes. Un K.-O. décisif ouvre la finalité pendant 2,25 secondes. Au temps, la vitalité départage les combattants. Une égalité réinitialise leurs positions et réduit leur vitalité à un point pour un échange décisif.

Pendant l’invite **Rupture**, chaque joueur utilise sa commande **Finalité** : **Y** pour J1 et **O** pour J2 dans le profil par défaut. Le geste démarre dans l’arène. Une illustration propre au vainqueur prend ensuite l’écran avant le résultat du match. Les commandes tactiles proposent le bouton **Fin**. Si le joueur laisse passer l’invite, le résultat s’affiche directement.

| Vainqueur | Finalité illustrée | Dernier plan |
|---|---|---|
| Sam | Cargaison sécurisée | Sous la pluie, Sam serre la sangle de la caisse tandis que BB reste visible contre sa poitrine. |
| Fragile | Dernier saut | Sous son parapluie ouvert, Fragile traverse un voile chiral où son reflet se dédouble. |
| Higgs | Rideau de goudron | Un gant écarte un pli de goudron qui renvoie le reflet du masque d’or. |
| Cliff | Rappel de section | Cliff porte la radio à son oreille. Quatre silhouettes reprennent forme dans la brume. |
| MULE | Hors inventaire | Le scanner classe l’écho du rival comme un colis. |
| Die-Hardman | Levée de consigne | Les trois portes virtuelles libèrent le passage. |
| Mama | Travée de retour | Un point lumineux traverse les segments de pont suspendus. |
| Heartman | Intervalle | La silhouette se dissipe le long d’une trace lumineuse. |

La finalité du MULE déclenche deux balayages de son capteur sur l’écho adverse. Le signal et l’encadrement du code de fret se distinguent des manifestations de Cliff.

| Combattant | Signature neutre · 28 points chiraux | Avant + signature | Arrière + signature |
|---|---|---|---|
| Sam | Bola de liaison | **Reprise d’appui**, 14 points. Absorbe un coup léger pendant 6 pas. | **Parade au lien**, 18 points. Échange les positions sur une frappe de mêlée interceptée. |
| Fragile | Pas de Grève | **Éventail de pluie**, 18 points. Intercepte une cible haute ou aérienne. | **Point de retour**, 16 points par activation. Pose un repère pour 180 pas et permet d’y revenir. |
| Higgs | Marée noire | **Empreinte d’or**, 21 points. Le piège s’arme au bout de 20 pas et frappe près du sol. | **Faux départ**, 14 points. Recule pendant 10 pas en laissant un leurre visuel. |
| Cliff | Écho de section | **Poste avancé**, 18 points. Place une balise pendant 160 pas devant Cliff. | **Rappel de section**, 16 points. Un écho monte depuis le poste et le dissipe. |
| MULE | Balayage de capteur. Le scan mémorise pendant 120 pas la position touchée. Une garde l’arrête. | **Consigne mobile**, 18 points. Pose une caisse pour 180 pas. Un fort à portée la pousse de 112 pixels. Son contact inflige 6 points de dégâts. | **Saisie de lot**, 16 points. Rappelle la caisse aux pieds de l’opérateur. Son trajet inflige 7 points et se défend par un saut ou une garde accroupie. Le rappel à vide conserve la jauge. |
| Die-Hardman | Ordre de maintien. Une interception à mi-hauteur donne un sceau pour 120 pas. | **Ligne d’arrêt**, 18 points. Le portique sous sceau reste actif deux pas de plus. | **Relève**, 16 points. Le sceau est consommé pour gagner 44 pixels de portée. |
| Mama | Point d’ancrage. Le point est posé 130 pixels devant Mama et tient 200 pas. | **Tablier**, 18 points. La travée part de l’ancrage et va deux fois plus vite que sans ancrage. | **Treuil**, 16 points. Mama rejoint l’ancrage en huit pas. À vide, la jauge reste intacte. |
| Heartman | Impulsion témoin. Près du battement, la vitesse de l’onde passe de 7,5 à 10 pixels par pas. | **Mémoire de phase**, 18 points. Pose une mémoire pour 120 pas. Une seconde activation y déclenche l’onde. | **Syncope du signal**, 16 points. Une esquive de six pas laisse une empreinte translucide. |

Les directions suivent la position adverse. La touche de signature est **H pour J1** et **L pour J2** dans le profil par défaut ; Commandes affiche les affectations du profil actif (§18). Le dojo permet de vérifier ces interactions contre un mannequin immobile, en garde ou piloté par l’IA. La case **Zones de touche** montre le volume vulnérable de chaque combattant et la portée de ses coups de mêlée actifs. La fiche **Commandes** donne les gestes communs et les techniques du combattant. La caisse MULE est un prop détouré indépendant. Le même fichier sert pour la pose au sol, la poussée et le rappel. [La caisse entre le MULE et Sam dans leur duel au camp](apercus/consigne-mobile.webp)

### Sommaire

1. [Entrer dans le mode](#1-entrer-dans-le-mode)
2. [Règles du duel](#2-règles-du-duel)
3. [Commandes et lecture des coups](#3-commandes-et-lecture-des-coups)
4. [Huit combattants](#4-huit-combattants)
5. [Huit histoires individuelles](#5-huit-histoires-individuelles)
6. [Fatalités de la Grève](#6-fatalités-de-la-grève)
7. [Arènes et parallaxe](#7-arènes-et-parallaxe)
8. [Tournoi et modes complémentaires](#8-tournoi-et-modes-complémentaires)
9. [Direction des sprites et du son](#9-direction-des-sprites-et-du-son)
10. [Production et recette](#10-production-et-recette)
11. [Références officielles](#11-références-officielles)
12. [Intégration du Guide Combat Games v1.0](#12-intégration-du-guide-combat-games-v10)
13. [Premier lot du 24 novembre](#13-premier-lot-des-poses-et-effets--24-novembre-2026)
14. [Suite intégrée du 24 novembre](#14-suite-intégrée--personnages-décors-boss-et-archives--24-novembre-2026)
15. [Silhouettes et horizons](#15-silhouettes-et-horizons--25-novembre-2026)
16. [Univers complet, Boss Rush et nouvelles arènes](#16-univers-complet-boss-rush-et-nouvelles-arènes--25-novembre-2026)
17. [Complément de production, campagne et plans narratifs](#17-complément-de-production-campagne-et-plans-narratifs--25-novembre-2026)
18. [Actions, relations, commandes et première liaison](#lot-domaines-20261125)
19. [Exercices, compendium Boss et extension visuelle](#lot-extension-20261125)

Registres associés : [œuvres, versions et sources de l’univers Death Stranding](UNIVERS_DS.md) · [production par domaine et dépendances](REGISTRE_PRODUCTION.md).

## 1. Entrer dans le mode

**Guide associé : §§01, 09, 19 et 24.** Le contrat avec La Ligne silencieuse, campagne principale du projet, est précisé au §12.6 ; les routes d’Échos restent les histoires individuelles du simulateur.

Au terminal, **Échos de la Grève** ouvre une reconstitution d’empreintes chirales. Le stand de tir du Director’s Cut fournit un précédent diégétique pour les exercices accessibles à un terminal [3]. La rencontre de personnages d’époques différentes et l’existence de cette machine relèvent de notre fiction. Un personnage battu quitte la reconstitution. Le jeu principal conserve inventaire, livraisons, BB et progression.

| Écran cible | Choix du joueur | Réponse attendue |
|---|---|---|
| Entrée | Histoire, Versus, Tournoi, Entraînement, Défis, Galerie | Retour immédiat au terminal depuis l’accueil. Le dernier mode dispose du focus. |
| Sélection | Combattant, apparence, aide aux commandes | Portrait lisible de près, aperçu plein pied de profil, portée de prédilection et un coup signature explicable en une phrase. |
| Avant-match | Arène, rival, commandes | Bouton pour passer la scène et conserver ses sous-titres dans la galerie. En tournoi, les règles affichées correspondent au tableau. |
| Manche | Jauges, chronomètre, score, témoin de technique | Le centre de l’écran appartient aux silhouettes. L’annonce de contre apparaît du côté du joueur concerné. |
| Résultat | Revanche, poursuivre, revoir la scène ou quitter | Victoires de manche et progression de tableau s’inscrivent à la confirmation du résultat. Un retour au menu garde la même issue. |

La première minute d’apprentissage fait découvrir le jeu par trois actions. Avancer jusqu’à la caisse montre la portée des pas. Bloquer un coup lourd montre la durée de retour en garde. Répondre par deux coups courts puis une technique fait entendre trois impacts, dont le dernier change de timbre. La leçon suivante permet de refaire exactement cet échange depuis l’autre côté de l’écran.

## 2. Règles du duel

**Guide associé : §§04, 05, 22 et 23.** Les règles de ce chapitre décrivent la cible. Le tableau du §12.3 distingue les paramètres du moteur principal inspecté, notamment 100 points de vie, 75 secondes et la jauge chirale.

### Ressources, temps et victoire

- **Vitalité** : 1 000 points par combattant pour les premiers essais. À zéro, l’arbitre attribue la manche. L’égalité de dégâts infligés au même pas de simulation produit une manche nulle.
- **Lien** : de 0 à 100 points. Un coup qui touche rapporte 6 points à l’attaquant et 4 au défenseur, une défense réussie en rapporte 2 au défenseur. Une attaque en plusieurs impacts applique ces gains une seule fois. Une version renforcée consomme 50, une technique ultime 100. La jauge repart à zéro à chaque duel et se conserve d’une manche à l’autre.
- **Ressource personnelle** : colis réel de Sam, balise de Fragile, empreinte de Higgs ou ordre de Cliff. Chaque combattant n’entretient qu’un seul de ces objets à la fois. Une silhouette et un pictogramme indiquent sa présence même lorsque les couleurs se ressemblent.
- **Règle d’arcade cible** : deux manches gagnantes, 60 secondes par manche. Au temps écoulé, comparer les points restants. Une égalité relance une manche de départage de 30 secondes avec 250 points chacun. Si les deux terminent encore à égalité, le prochain impact net dont les dégâts sont strictement supérieurs à ceux de l’autre joueur décide. Les dégâts simultanés égaux prolongent le jeu.
- **Interruption** : les menus hors ligne gèlent le temps. Au retour de la fenêtre, une touche volontaire rend le contrôle. Le redémarrage d’entraînement neutralise les entrées enfoncées.

### Distance et défense

La largeur du corps de Sam, vu de côté en garde, vaut **1 unité (u)**. À 0,8 u, une projection peut prendre. Entre 1 et 2 u, les bras, les épaules et les accessoires dominent. À 3 u et plus, le porteur peut reprendre un colis, le commandant programmer une salve et l’adversaire préparer une approche. À l’échelle cible, le terrain jouable mesure 12 u. Le recul du défenseur absorbé par le bord est appliqué à l’attaquant pour écarter les deux corps.

L’arrière bloque les attaques médianes et hautes. Le bas-arrière bloque les basses et les médianes. Une attaque marquée **surplomb** demande la garde debout. Les projections échouent sur une cible aérienne. Une déprojection dans les 7 images suivant le contact replace les deux joueurs au neutre à 1,4 u. La garde parfaite couvre les 3 premières images d’une nouvelle direction de garde et réduit le recul. Le deuxième contact d’un même mouvement suit la règle ordinaire.

**Relevée.** Une mise au sol termine le combo. La garde redevient disponible dès la première image contrôlable. Une roulade de relevée dépense 50 points de Lien, déplace le personnage de 1 u et annonce sa sortie par 9 images de récupération. Une projection demande au moins 6 images après une sortie de blocage ou une relevée.

### Impacts, combos et équité

La simulation avance à 60 pas par seconde. Un coup progresse de l’anticipation aux images actives, puis à la récupération. La pose graphique peut tenir deux pas de simulation. Les volumes d’attaque et de réception suivent le temps du moteur. Le gel d’impact recommandé vaut 3 pas sur un coup léger, 5 sur un coup lourd et 7 sur une ultime. Il suspend les deux combattants et le chronomètre de la manche.

Les coups normaux autorisés peuvent passer de léger à fort, puis à spécial, sur contact. Un coup manqué poursuit sa récupération. La table individuelle peut accorder un enchaînement spécifique sur blocage. L’échelle de dégâts après le premier impact descend à 80 %, 65 %, 50 %, puis 40 % sur les impacts suivants. Le deuxième coup qui soulèverait la même cible la fait retomber et clôt le combo. Une prise, une ultime et une fatalité cinématique terminent leur séquence sans remise en boucle.

**Exemple chiffré de réglage.** Un léger brut de 40, un fort de 70 et une technique de 100 produisent 40 + 56 + 65 = 161 points. La cible garde 839 points. Une séquence de coups normaux et spéciaux sans Lien qui excède 350 points déclenche une revue d’équilibrage, particulièrement au bord de l’écran.

## 3. Commandes et lecture des coups

**Guide associé : §§04, 05, 19 et 20.** La notation technique ci-dessous est une cible de conception. Les fiches C du §12.9 relient chaque action aux commandes et données de la version du moteur concernée.

Les chiffres représentent le pavé numérique, vu par un personnage tourné vers la droite. **6** avance, **4** recule, **2** s’accroupit, **8** saute. **1**, **3**, **7** et **9** sont les diagonales. Le moteur inverse la direction horizontale quand le combattant change de côté. **L** signifie léger, **F** fort, **T** technique, **P** prise. La flèche « → » relie deux actions successives. Le signe « + » les demande ensemble.

| Action | Entrée technique cible | Apprentissage et contre-jeu |
|---|---|---|
| Pas rapide | 66 ou 44 | Départ identifiable par le transfert de poids. Aucune invulnérabilité sur le pas avant. |
| Attaques de base | 5L, 5F, 2L, 2F, j.L, j.F | 5 signifie direction neutre, j. signifie en l’air. Le fort accroupi sert d’anti-air sauf exception indiquée. |
| Spéciales | 236T, 214T, 22T | Trois gestes par combattant. Commandes directes alternatives par direction + technique sur un profil dédié. |
| Projection | P à moins de 0,8 u | Une pression entre aussi la déprojection. Le moteur résout une prise mutuelle comme un dégagement. |
| Version renforcée | Même spéciale avec T+F | Coût de 50. L’icône de la liste des coups précise si le gain porte sur la distance, les dégâts ou la durée. |
| Ultime | 236236T | Coût de 100 à l’activation. Une bulle d’aide indique portée et hauteur avant la première utilisation. |
| Fatalité | Action dédiée pendant l’invite de victoire | Raccourci remappable. Laisser passer l’invite donne directement le salut de victoire. |

Fenêtre de commande proposée de 12 images pour un quart de cercle, tolérance d’entrées simultanées de 3 images et mémoire de 5 images avant la fin d’une récupération. Les priorités sont ultime, renforcée, spéciale, prise, normale. Une commande invalide retombe sur la normale si un bouton de normale a été pressé. Sur changement de côté, les directions déjà enregistrées conservent leur orientation au moment de la saisie.

| Classe de mouvement | Démarrage / actif / récupération en images | Dégâts de départ | Utilisation |
|---|---|---|---|
| 5L | 5 / 3 / 9 | 40 | Vérifier la distance. À −1 à la garde, le défenseur reprend l’initiative. |
| 5F | 10 / 3 / 18 | 70 | Punir une récupération. À −6 si le coup est bloqué au contact. |
| 2L | 6 / 2 / 10 | 35 | Ouvrir la garde debout à courte portée. |
| 2F | 9 / 4 / 21 | 65 | Couvrir une entrée aérienne. À −9 sur garde au sol. |
| j.L / j.F | 5 / 4 / jusqu’au sol ou 9 / 5 / jusqu’au sol | 35 / 75 | Deux angles d’entrée. Prévoir 4 images de récupération d’atterrissage. |
| P | 7 / 2 / 24 si échec | 105 | Briser une garde prolongée. Déprojection ou saut anticipé la battent. |

Toutes les données chiffrées de cette bible sont des valeurs de départ du fan-game. La notation des fiches spéciales exprime **démarrage / activité / récupération**. Pour un projectile ou une zone persistante, « activité » désigne la durée de l’objet autonome et « récupération » celle du lanceur après émission. Le dojo doit pouvoir afficher les valeurs effectivement chargées par le moteur.

## 4. Huit combattants

**Guide associé : §§02, 03, 05, 07 et 16.** Les huit identités, les costumes et les objets de kit sont distingués au §12.4. Les fiches B et C complètent ces tableaux sans attribuer les créations du simulateur au canon officiel.

Les quatre premières fiches approfondissent le noyau du prototype. Les quatre suivantes documentent son extension initiale. Les huit fiches décrivent l’existant et sa cible de combat ; elles ne plafonnent pas le roster futur. Les versions DS2 et les autres candidats de l’univers reçoivent des fiches distinctes avant toute décision de rôle jouable. Chacune donne six normales, trois spéciales, une projection, une ultime et deux exercices de combo. Le terme « exercice » désigne un enchaînement à vérifier dans la version réglée.

### Sam Porter Bridges · équilibré, mi-distance

**Source.** Porteur, harnais de cargaison, Odradek, capsule et lien. Le jeu permet d’utiliser le lien en parade et de lancer une caisse. Le Director’s Cut ajoute notamment des coups de genou [1–3]. **Geste à conserver.** Après un mouvement lourd, son bassin revient sous son chargement avant que ses mains remontent.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Coup court, épaule, pied rasant, genou ascendant, paume aérienne, botte de porteur | 5L, 5F, 2L, 2F, j.L, j.F | L’épaule avance de 0,35 u. Le genou monte devant le torse. La botte descend presque à la verticale. |
| Colis de lest | 236T | 16 / 24 / 18. Projectile médian à 95 points. Une caisse démo tombe au sol et demeure visible. Avec la caisse déjà au sol, l’entrée la récupère à moins de 1 u en 16 images. |
| Parade au lien | 214T | 4 / 5 / 25. Intercepte une frappe de contact, fait pivoter Sam et replace l’adversaire de l’autre côté. Les projections et projectiles passent. |
| Reprise d’appui | 22T | 8 / 6 / 18. Absorbe un impact médian léger pendant le planté de botte. À la fin, Sam regagne sa caisse si elle est à portée. |
| Arrimage / Dernière livraison | P / ultime | La prise tire le modèle d’un demi-tour autour de la caisse. L’ultime place la caisse près de la borne, puis percute l’écho adverse avec le chariot holographique, 235 points. |

**Maîtrise.** Débuter par 5L → 5F → 236T. Plus tard, lire un fort adverse avec 214T, changer de côté, puis reprendre l’espace avec 5F. Le jet renforcé rebondit une fois et parcourt une unité de plus. Une caisse lâchée loin de Sam limite ses possibilités jusqu’à ce qu’il revienne la chercher.

### Fragile · déplacement, punition des coups manqués

**Source.** Dirige Fragile Express et peut se téléporter. Son parapluie sert de repère visuel au saut dans les chambres privées [4, 8]. **Geste à conserver.** Torse droit, pas mesuré, toile segmentée identifiable avant que l’image se dissipe.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Revers ganté, pointe du parapluie fermé, pas bas, ouverture montante, genou aérien, revers descendant | 5L, 5F, 2L, 2F, j.L, j.F | Le 5F couvre 1,6 u avec une pointe étroite. Le 2F déploie la toile au-dessus de l’épaule sans protéger les chevilles. |
| Entre deux quais | 236T | 12 / déplacement de 5 / 16. Saut spatial de 1,8 u vers l’avant, précédé de deux gouttes ascendantes. Les 7 dernières images de sortie restent vulnérables. |
| Point de retour | 214T | 15 / balise de 180 / 13. Pose un repère sur place. Une seconde entrée avant expiration rappelle Fragile jusqu’au repère. L’adversaire peut attendre sur la sortie visible. |
| Éventail de pluie | 22T | 11 / 4 / 20. Arc médian de 85 points devant le visage, efficace contre le saut court. Un adversaire bas placé au contact passe sous l’extrémité. |
| Changement de quai / Correspondance | P / ultime | La prise échange les places. Pour l’ultime, la poignée tombe, Fragile la reprend à la sortie du saut et l’ombre de l’adversaire se replie, 215 points. |

**Maîtrise.** 2L → 5F → 22T exerce la confirmation au contact. Autre exercice, poser 214T, faire manquer un lourd avec 236T, revenir au repère, puis 5F. La version renforcée d’Entre deux quais allonge le saut d’une demi-unité. L’entrée et la sortie restent annoncées aussi longtemps.

### Higgs Monaghan · pièges et occupation du sol

**Source.** Chef des Homo Demens, masque doré et contrôle des Échoués [4, 5]. Le costume de référence est sa tenue encapuchonnée du premier jeu. **Geste à conserver.** Avant une manifestation, ouvrir la main loin du masque pour offrir une lecture claire de profil.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Doigts tendus, manche de cape, talon rasant, revers montant, paume en vol, drapé descendant | 5L, 5F, 2L, 2F, j.L, j.F | Le 5F dessine un arc dont seule l’extrémité porte loin. Le drapé retombe avant que la silhouette retrouve sa garde. |
| Main du ressac | 236T | 20 / 8 / 24. Une main de goudron médiane surgit à 2 u, 90 points. La trace au sol annonce le point de sortie et laisse un passage près de Higgs. |
| Empreinte d’or | 214T | 18 / 150 au sol / 16. Une empreinte basse s’arme en 20 images et s’efface au premier contact, 60 points. La poser à nouveau déplace la précédente. |
| Faux départ | 22T | 9 / 10 / 20. Un double visuel achève le pas pendant que Higgs recule de 0,7 u. Le double laisse le décor visible à travers ses jambes. |
| Invitation / Marée noire | P / ultime | La prise entraîne l’écho dans un cercle sombre, puis le rejette au sol. Une ombre immense accompagne l’ultime, médiane, 245 points si l’appel initial porte. |

**Maîtrise.** 5L → 5F → 236T près de la zone distante. Pour l’embuscade, armer 214T, céder du terrain avec 22T, puis placer 5F sur la réaction à l’empreinte. La main renforcée couvre une unité supplémentaire. Entrer près de lui pendant l’appel interrompt la préparation.

### Clifford Unger · commandement à distance

**Source.** Cliff et ses soldats apparaissent dans les champs de bataille du premier jeu. Les silhouettes de ses hommes et leurs liens appartiennent à sa mise en scène [4, 5]. **Geste à conserver.** Un ordre part de la main tandis que son regard reste tourné vers l’adversaire. Les têtes des spectres répondent avec un léger retard.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Main d’arrêt, choc de crosse stylisé, pas de boue, appel montant, revers aérien, botte lourde | 5L, 5F, 2L, 2F, j.L, j.F | Le 5F repousse bien au centre. Le pied lourd laisse une longue récupération si l’adversaire recule. |
| Ligne fantôme | 236T | 23 / 10 / 18. Un spectre dessine une ligne médiane traversant l’espace après un signe visible, 85 points. Une attaque sur Cliff avant émission annule l’ordre. |
| Poste avancé | 214T | 19 / 160 / 15. Introduit un seul soldat en fond de piste à 2,2 u. L’ordre suivant part de sa position et le dissipe. Sa balise reste dans la bande de sol. |
| Rappel de section | 22T | 12 / 6 / 22. Le soldat interrompt son attente et produit un arc montant, 75 points. Sans soldat, la radio réagit par un clic court et Cliff revient au neutre. |
| Changement de secteur / Extinction des feux | P / ultime | La prise déplace l’adversaire vers la balise. À l’ultime trois silhouettes ferment les éclairages du champ virtuel, 235 points au premier contact confirmé. |

**Maîtrise.** 5L → 5F → 236T en portée de couverture. Pour défendre un saut, placer 214T, attendre le départ adverse, puis 22T. La ligne renforcée part plus vite après le signal. S’approcher pendant la pose lui retire du temps et l’oblige à défendre seul.

### MULE · extension, allonge et récupération de cargaison

**Source.** Les MULEs repèrent les cargaisons, patrouillent autour de leurs camps et utilisent des capteurs [2]. Le rôle jouable représente un membre anonyme de la faction. Son indicatif de campagne est un ajout du fan-game. **Geste à conserver.** Le visage se tourne d’abord vers la caisse la plus proche, puis vers son adversaire.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Paume, allonge de hampe, crochet bas, hampe montante, genou, pointe descendante | 5L, 5F, 2L, 2F, j.L, j.F | Une portée de 1,9 u rend le fort efficace à distance. L’espace sous la hampe reste exposé au contact. |
| Balayage de capteur | 236T | 18 / 12 / 17. Un anneau marque durant 120 images la dernière coordonnée touchée autour de l’adversaire. Il produit un son distinct en cas de blocage. |
| Consigne mobile | 214T | 16 / 180 / 18. Pose une caisse de simulation à 1,2 u. Le prochain fort à portée la fait glisser d’une unité, 65 points au contact. |
| Saisie de lot | 22T | 13 / 3 / 24. Déplace la caisse vers l’opérateur. Son trajet touche au niveau des pieds, 70 points. La version renforcée augmente la distance de rappel. |
| Réquisition / Mauvais destinataire | P / ultime | La prise rapproche la cible d’une caisse. À l’ultime, un convoyeur virtuel l’emporte jusqu’à la sortie de la piste, 225 points. |

**Maîtrise.** 2L → 5F → 236T valide une lecture de portée. Pour défendre la caisse, la poser, laisser l’adversaire avancer puis utiliser 22T derrière sa garde haute. Un saut anticipé lui fait perdre l’avantage de position.

### Die-Hardman · extension, contre et reprise d’initiative

**Source.** Figure de commandement de Bridges. Son masque sombre, son uniforme et sa retenue structurent sa planche de référence [4]. Les commandes du terminal de combat sont inventées. **Geste à conserver.** Maintenir le regard stable pendant les ordres et un court silence après l’action.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Main ouverte, avant-bras, pas court, coude ascendant, revers aérien, descente de botte | 5L, 5F, 2L, 2F, j.L, j.F | Le léger contrôle la courte distance. L’avancée du fort est plus petite que celle de Sam. |
| Ordre de maintien | 236T | 11 / 5 / 21. Intercepte un coup médian de contact et attribue un sceau d’autorisation valable 120 images. Une attaque basse contourne la posture. |
| Ligne d’arrêt | 214T | 17 / 6 / 22. Un portique holographique se lève à 1,5 u, frappe médiane de 75. Avec un sceau, il reste visible deux images de plus. |
| Relève | 22T | 8 / 4 / 16. Un pas en arrière et une frappe de retour, 65 points. Le sceau ajoute de l’allonge et se consomme au départ. |
| Passage refusé / Dernier ordre | P / ultime | La prise place la cible face au portique. Une rangée de portes se ferme dans l’ultime, dont la dernière repousse l’écho au bord, 230 points. |

**Maîtrise.** 5L → 5F → 214T. Deuxième exercice, intercepter le mannequin avec 236T, puis dépenser le sceau par 22T juste hors de sa portée. Une alternance de frappes basses et de projections l’oblige à quitter sa posture.

### Mama · extension, construction et contrôle des trajectoires

**Source.** Ingénieure de Bridges et sœur de Lockne. Son atelier et son lien personnel avec un Échoué motivent le soin apporté aux fils et à l’espace vide [4, 6]. Son avatar d’exercice manipule uniquement des constructions techniques. **Geste à conserver.** Le curseur de sa main précède d’une image l’apparition de l’objet projeté.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Gant, boîtier, pas rasant, outil relevé, paume aérienne, botte descendante | 5L, 5F, 2L, 2F, j.L, j.F | Le 5F déplace l’adversaire vers le futur point de montage. Les coups en l’air couvrent peu d’espace. |
| Point d’ancrage | 236T | 18 / 200 / 16. Dépose un point d’assemblage visible à 1,8 u. Tout point précédent est retiré à l’émission. |
| Tablier | 214T | 16 / 10 / 21. Depuis l’ancrage, un segment horizontal de pont holographique balaie 1 u à mi-hauteur, 85 points. Sans ancrage, la projection réduite couvre 0,5 u devant le boîtier. |
| Treuil | 22T | 12 / déplacement de 8 / 15. Rapproche Mama de l’ancrage visible puis l’efface. La variante renforcée lui permet de conserver le point une fois. |
| Enrouleur / Portée libre | P / ultime | La prise décale les deux corps d’une demi-unité. L’ultime bâtit trois travées autour de l’écho, sur lesquelles roule une charge d’essai, 230 points. |

**Maîtrise.** 5L → 5F → 214T au contact. Pour punir une entrée, poser 236T, faire ouvrir le tablier puis revenir par 22T. Un adversaire qui traverse la zone avant l’installation impose un duel de près difficile.

### Heartman · extension, tempo et défense de position

**Source.** Ce chercheur de Bridges visite la Grève toutes les 21 minutes pendant trois minutes [4, 7]. Le rythme ludique suivant est l’enregistrement accéléré d’un moniteur de simulation. **Geste à conserver.** Aux instants calmes, il reste un chercheur attentif au cadran de son appareil.

| Coup cible | Entrée | Mise en jeu |
|---|---|---|
| Paume, boîtier tenu à deux mains, pointe de pied, revers montant, main aérienne, botte courte | 5L, 5F, 2L, 2F, j.L, j.F | Normales courtes. Le son des pas et l’inclinaison de la tête marquent le retour au neutre. |
| Impulsion témoin | 236T | 15 / 16 / 18. Une onde de mesure traverse 1,7 u, 70 points. Sur le battement du moniteur, la portée gagne 0,5 u. |
| Mémoire de phase | 214T | 14 / 120 / 17. Enregistre sa position au sol. Une nouvelle pression libère une seule onde à cet endroit puis efface le repère. |
| Syncope du signal | 22T | 10 / 6 / 24. Interrompt l’image de l’avatar pendant une fenêtre d’esquive virtuelle. L’indicateur de pieds reste visible. La version renforcée abrège la récupération. |
| Échantillon / Fenêtre de retour | P / ultime | La prise ramène le duo à portée courte. À l’ultime, l’écho adverse se fige entre deux points d’un tracé lumineux, puis est relâché, 220 points. |

**Maîtrise.** 2L → 5F → 236T. Pour l’exercice de tempo, enregistrer 214T, reculer d’une unité puis déclencher 214T dans la fenêtre de battement. Le signal visuel pulse toutes les 60 images indépendamment de la musique. L’adversaire peut compter le même tempo.

<a id="5-huit-campagnes"></a>

## 5. Huit histoires individuelles

**Guide associé : §§07–10 et 24.** Ce chapitre décrit huit routes individuelles. Le §12.6 les associe à La Ligne silencieuse sans les confondre avec une campagne transversale du mode combat.

Les huit parcours jouables suivent les séquences ci-dessous. Les dialogues et les récits sont originaux. Chaque parcours tient dans trois duels scénarisés et se rejoue en arcade sans les images. Une défaite reprend le duel en cours. Un ending débloqué devient consultable d’un seul geste.

### Sam — Livraison sans adresse

**Trajet.** Terminal contre Fragile → champ de bataille contre Cliff → Grève contre Higgs.

**Intro.** Un lecteur refuse la caisse que Sam dépose sur le comptoir. À l’intérieur, des bracelets de porteurs s’entrechoquent. Quelqu’un a essuyé l’étiquette d’une main encore pleine de sel. Sam prend un bracelet, le resserre autour de la poignée et soulève la caisse entière.

**Rival.** Sur la Grève, Higgs bouche la dernière borne avec son masque et tend l’étiquette à bout de bras. « Tu comptes faire signer qui ? » Sam passe la sangle sur son épaule. « Celui qui viendra après moi. » La caméra descend à hauteur de botte. Le premier pas jouable s’imprime dans le sable humide.

**Ending.** Sous l’auvent d’un relais, Sam aligne les bracelets dans la caisse ouverte et laisse le lecteur allumé. Au matin, un emplacement est vide. Sur le verre embué du lecteur, cinq marques de doigts forment le premier reçu.

### Fragile — Le dernier quai

**Trajet.** Terminal contre Sam → champ de bataille contre Cliff → Grève contre Higgs.

**Intro.** Une imprimante recrache un bon Fragile Express taché à l’angle gauche. Fragile change de quai. Une seconde imprimante lui rend le même papier, avec la même tache. Elle place les deux feuilles côte à côte et remarque qu’elles ont séché malgré la pluie.

**Rival.** Higgs l’attend avec un parapluie déjà ouvert sur un cercle d’or. « Ton arrivée est marquée. » Elle lâche les bons qui se collent au sable. « Je choisis encore où je pose le pied. » Elle ferme son propre parapluie. Le cercle pâlit au premier déplacement.

**Ending.** Fragile revient à un quai désert. Le toit fuit à l’endroit où attendent les porteurs. Elle y laisse son parapluie ouvert, coince la poignée dans le banc et repart à pied. Sous la toile, un troisième bon reste sec.

### Higgs — Sans public

**Trajet.** Grève contre Fragile → champ de bataille contre Cliff → terminal contre Sam.

**Intro.** Un applaudissement grésille quand Higgs remet son masque. Il l’ôte. Silence. Il le remet plus lentement, attend le même claquement de mains, puis salue une rangée de sièges vides.

**Rival.** Quand Higgs écarte les bras, Sam vérifie d’abord la boucle de sa caisse. « Regarde-moi au moins. » Sam lève les yeux une seconde. « Elle glisse. » Il la pose en douceur. C’est le choc du fermoir sur le métal qui lance le duel.

**Ending.** Après sa victoire, Higgs commande un rappel. Un petit lecteur caché sous le seul siège éclairé recommence les mêmes applaudissements. Il reconnaît le frottement de son propre gant dans l’enregistrement. Il coupe le son au milieu du geste et quitte la pièce avec le lecteur.

### Cliff — La fréquence muette

**Trajet.** Champ de bataille contre Higgs → terminal contre Fragile → Grève contre Sam.

**Intro.** Dans une tranchée vide, un vieux poste renvoie trois notes de berceuse. Les soldats spectraux tournent la tête en même temps. Cliff baisse sa radio. Les notes continuent une demi-seconde après l’extinction du voyant.

**Rival.** Sam a retrouvé le dernier émetteur. Cliff avance la main puis s’arrête. Sam pose l’appareil entre eux. « Tu peux l’écouter ici. » Cliff regarde l’antenne comme si elle allait lui montrer une direction. L’écho des hommes apparaît aux deux extrémités de l’écran.

**Ending.** La radio offre enfin un signal clair. Cliff coupe pourtant le récepteur. Derrière la cloison du simulateur, quelqu’un fredonne les trois notes. Cliff fait signe à ses hommes de rester, puis s’assied pour écouter le quatrième son.

### MULE — L’inventaire du matin · extension

**Trajet.** Camp contre Mama → terminal contre Die-Hardman → camp contre Sam.

**Intro.** Sur la dernière ligne du registre, une caisse vide rapporte plus de valeur que tout le stock du camp. L’opérateur la soulève, l’oreille collée au couvercle. Une voix très faible demande qu’on lui rapporte son nom.

**Rival.** Sam vient chercher le carton. Le MULE passe son lecteur sur lui-même par réflexe. Le numéro de sa manche et la ligne du registre se superposent. Il pose son lecteur sur la caisse et défend la seule chose qu’il puisse encore réclamer à son nom.

**Ending.** Le lendemain, le camp retrouve tout son chargement. La case « propriétaire » est vide sur chaque bon. Hors de la clôture, l’opérateur coupe l’étiquette de sa manche et s’inscrit sur le registre des départs avec une écriture mal assurée.

### Die-Hardman — Une porte ouverte · extension

**Trajet.** Terminal contre MULE → usine contre Mama → champ de bataille contre Cliff.

**Intro.** Un ordre signé de sa main maintient une vieille porte fermée. Derrière, un capteur continue de compter des passages. Die-Hardman entre seul dans l’exercice pour savoir qui sa signature retient encore.

**Rival.** Cliff fait signe à ses hommes de s’arrêter devant le seuil. Die-Hardman tient la clé mais ne l’insère pas. « Donne-moi l’ordre », dit l’écho. Die-Hardman retire son gant. « Il y en a déjà eu assez. »

**Ending.** La porte s’ouvre sur un couloir vide. Die-Hardman dicte la correction au registre, cette fois sous son propre nom. Il laisse la clé au-dessus du guichet, assez bas pour qu’une autre personne puisse l’atteindre.

### Mama — La portée du fil · extension

**Trajet.** Atelier contre Heartman → usine contre MULE → terminal contre Die-Hardman.

**Intro.** Au-dessus de son établi tient une passerelle miniature. Des deux côtés, chaque attache tient bon. Pourtant le milieu descend de quelques millimètres toutes les nuits. Mama dessine sur le papier le seul poids qu’elle n’a pas compté, celui d’une personne qui attend.

**Rival.** Le terminal de Die-Hardman refuse le passage tant que le test de charge reste ouvert. « Le prochain porteur ne devrait pas servir d’essai. » Mama place la maquette dans le faisceau. « C’est pour ça que je viens la traverser moi-même. »

**Ending.** Deux ombres passent sur la passerelle de test, l’une après l’autre. Dans l’atelier, Mama range la maquette dans une boîte encore trop grande et déroule assez de fil pour une deuxième traversée.

### Heartman — La seconde de trop · extension

**Trajet.** Laboratoire contre Fragile → atelier contre Mama → Grève contre Higgs.

**Intro.** Heartman trouve à la fin d’un relevé une seconde qui ne contient aucun battement. Il joue l’enregistrement une deuxième fois. Dans cette seconde, il entend une chaise qu’on recule pour lui faire une place.

**Rival.** Higgs occupe la chaise sur la Grève. « Tu veux du temps ? » Heartman dépose son carnet fermé sur le sable. « Je veux savoir qui attendait. » Le moniteur assure seul l’accompagnement pendant le premier échange.

**Ending.** De retour au laboratoire, le chercheur abandonne la correction qu’il comptait apporter à sa courbe. Il aligne une deuxième tasse sur la table. Le dernier plan montre deux cercles de chaleur sur le bois, dont l’un commence juste à s’effacer.

### Mise en images et progression

Une intro emploie deux illustrations originales et une insertion de l’accessoire. La rivalité garde le terrain visible pendant les deux répliques, puis coupe sur la pose de garde. L’ending alloue le dernier tiers du temps à une image fixe avec mouvement local. Prévoir 8 à 12 secondes pour une intro, 6 à 10 pour le rival et 12 à 18 pour une fin, avec avance manuelle disponible. Le mode Histoire conserve l’identifiant du personnage, l’étape atteinte et la liste des scènes vues. En cas d’abandon entre deux manches, la reprise revient au début du duel en cours.

## 6. Fatalités de la Grève

**Guide associé : §06.** Le terme « finalité de la Grève » désigne ici un finisher du simulateur. Le §12.5 sépare ultime, finalité, victoire et épilogue, et relie les noms actuels aux scènes cibles ci-dessous.

À la dernière manche gagnante, le simulateur suspend l’écho adverse et ouvre une invite de 120 images. Une action dédiée déclenche la scène. Les images décrivent la dissolution d’une reconstitution ou une évacuation. On peut donc faire jouer une fatalité à Sam tout en lui donnant un geste cohérent de porteur. Une option permet d’enchaîner directement sur la victoire. Les deux chemins donnent le même résultat de tournoi et les mêmes récompenses.

| Combattant | Fatalité originale | Trois plans de réalisation | Son final |
|---|---|---|---|
| Sam | **Reçu de livraison** | Sam retient le reflet défaillant avec son lien. Le reflet se stabilise dans un cadre de chargement. Sam signe la remise du cadre intact. | Clic du fermoir, confirmation douce de la borne. |
| Fragile | **Quai de sortie** | La toile ouverte masque un instant les silhouettes. L’écho se retrouve sous un abri lointain. Fragile ferme la toile au premier plan. | Petit bruit sec des baleines du parapluie. |
| Higgs | **Dernier spectateur** | Une rangée de mains sombres applaudit. L’écho se dissout dans son reflet. Higgs salue et la rangée s’immobilise en plein geste. | Un applaudissement isolé prend du retard. |
| Cliff | **Rompez** | Les soldats entourent le halo de l’écho. Cliff baisse deux doigts et le cercle s’ouvre. Un dernier soldat guide le reflet vers le brouillard. | Radio éteinte, semelles qui s’éloignent. |
| MULE | **Hors inventaire** | Le capteur balaie deux fois. Le code de l’écho s’efface du registre. Le portique s’ouvre devant sa silhouette libérée. | Deux bips dont le second est plus bas. |
| Die-Hardman | **Levée de consigne** | Le masque remplit le cadre. Une porte descend entre les combattants. Une seconde porte s’ouvre derrière l’écho et laisse entrer le jour. | Verrou relâché. |
| Mama | **Travée de retour** | Mama assemble un tablier entre deux plans. L’écho le traverse en perdant sa texture. Elle retire la dernière fixation une fois le passage libre. | Tension d’un câble qui retombe. |
| Heartman | **Intervalle** | La courbe du moniteur entoure les deux avatars. L’écho tient sur un point lumineux. La caméra retrouve la chaise vide et un tracé régulier. | Un battement clair suivi de l’ambiance du laboratoire. |

Limiter chaque séquence à environ quatre secondes. La caméra conserve la position des deux corps jusqu’au premier changement de plan, y compris près d’un mur. En tournoi, une validation commune passe directement au résultat. En cas de perte de focus, le vainqueur enregistré avant la scène reste acquis.

## 7. Arènes et parallaxe

**Guide associé : §§13–15, 17 et 18.** Le §12.8 distingue présentation, interactions, dangers et connexions. Le socle du 24 novembre comprend douze lieux, treize configurations et soixante-cinq couches. Le lot du §16 ajoute quatre arènes et vingt plans, portant ce lot à seize lieux, dix-sept configurations et quatre-vingt-cinq couches. Les trois arènes DS2 du §17 portent ensuite le catalogue à dix-neuf lieux, vingt configurations et cent couches ; la caisse MULE reste un objet de kit.

Le terminal ouvre sur une ligne de pieds commune. Dans une arène extérieure, une pente dessinée derrière les combattants peut conduire le regard vers l’horizon. La bande sur laquelle ils se tiennent reste horizontale. Dans un intérieur, les joints du dallage et le bas des portes donnent l’échelle. Un joueur qui passe du camp au laboratoire doit pouvoir juger la portée de sa projection avec le même pas.

Les quatre routes d’extension du chapitre 5 nomment un camp, une usine, un atelier et un laboratoire. L’abri de Fragile complète les huit arènes en reprenant le lieu décrit dans l’étude du Duel originel. Deux compositions complètent cette sélection. Le bassin de goudron vient de l’étude du Duel originel. Le col de Mountain Knot est une vue originale imaginée pour ce mode. Les indications ci-dessous décrivent le cadrage latéral et la mise en scène du fan-game.

| Arène | Motif derrière les silhouettes | Premier plan et repère pour le duel |
|---|---|---|
| La Grève | Le ressac trace une ligne longue sous le ciel pâle. Les roches éloignées encadrent les joueurs. | Laisse de mer et galets bas aux bords. L’empreinte d’or de Higgs doit se lire avant que le regard ne rencontre l’écume. |
| Centre de distribution | Une baie de livraison chaude s’ouvre dans une façade froide. Sa largeur donne l’échelle du site Bridges. | Butée, grille de drainage et câble à terre. Lire la position des pieds de Sam malgré le reflet sur le quai. |
| Champ de bataille | Un second parapet et des troncs coupés étagent la brume derrière Cliff. | Bois détrempé et câble de campagne. Réserver un espace visuel aux soldats spectraux appelés par Cliff. |
| Camp MULE | Tentes, mâts et caisses stockées dans un fond de vallée. Les colis constituent le point d’intérêt de la faction. | Maintenir les éléments de camp et les longueurs de sangle sous les chevilles ou sur les côtés. Une vraie détection de fret doit rester identifiable devant ces objets. |
| Laboratoire de Heartman | Le mobilier habité, les rangements et la lumière froide du dehors racontent les intervalles passés à attendre. | Un fil ou un instrument en bord de cadre donne de la profondeur. Préserver l’espace devant le thorax, où se lit le défibrillateur de Heartman. |
| Atelier de Mama | Un établi et la trame d’un plafond endommagé donnent deux profondeurs à un même volume. | Une pièce mécanique isolée et un câble bas suffisent à situer la piste. La ligne d’un futur ancrage doit pouvoir traverser le centre d’un seul regard. |
| Usine en ruines | Les travées du complexe industriel reprennent le lieu ajouté par le Director’s Cut. Une ouverture découpe les silhouettes devant les conduites [8]. | Plancher en béton et rive de métal. Un joint transversal donne un repère de recul à proximité du mur. |
| Abri sous la pluie temporelle | Le rideau de pluie au-delà de l’auvent fait sentir la profondeur et la limite entre sec et humide. | Les objets de l’abri encadrent le premier plan. La pointe et les baleines du parapluie de Fragile doivent rester lisibles en profil. |
| Bassin de goudron · arène supplémentaire | Un bassin noir reflète les vestiges industriels et le ciel à l’extérieur de la piste. | Margelle continue aux pieds. Réserver les reflets dorés les plus francs aux techniques de Higgs. |
| Col de Mountain Knot · arène supplémentaire | La succession des crêtes enneigées situe le duel en altitude. Un passage dégagé se dessine au milieu de la pente. | Les reliefs du premier plan restent bas. Les bords des bottes émergent sur la neige, même quand les deux joueurs se rapprochent. |

**Découpage intégré au 19 novembre 2026.** Les dix arènes disposent chacune de cinq images indépendantes : ciel ou fond intérieur, lointain, plan intermédiaire, sol et premier plan, soit **50 couches livrées sur 50**. Les onze dernières images complètent le camp MULE, Heartman, l’usine, l’abri Timefall et le bassin de goudron. Le panorama opaque reste disponible pendant le chargement ou dans une ancienne copie privée de certaines images. Les PNG sont conservés dans leurs dimensions natives et les pixels générés n’ont pas été retouchés.

**Extension du même jour.** Le camp MULE dispose aussi d’une variante sèche, décrite dans l’étude du Duel originel : tentes et balises aux mêmes emplacements, vallée basaltique, gravier mat et piste tassée. Cette variante ajoute un panorama et cinq plans PNG, portant le catalogue à **55 couches pour 11 configurations de 10 lieux**. L’identifiant `mule-camp-dry` reste rattaché au lieu `mule-camp` ; les anciens tableaux, récits et replays conservent leur identifiant d’origine. [Provenance, réglages et recette du lot](production/AMBIANCES_VARIANTE_MULE_20261119.md).

La même revue a corrigé le bas visible des plans de la Grève, du terminal, du champ de bataille et du col : leurs bandes de fond rejoignent maintenant la ligne de sol sans laisser apparaître un ruban de ciel. Un contrôle raster protège ces quatre raccords et celui du camp sec, dans les deux directions et avec les effets réduits.

Dans la vue de 1 280 × 720, le sol de simulation passe à 588. Le moteur déplace les cinq plans de **0,14 / 0,27 / 0,43 / 0,62 / 0,8** fois le décalage caméra. L’option d’effets réduits conserve cet ordre avec une amplitude de 20 %. Chaque ancre de sol est mesurée dans son image réelle ; les bases des structures et accessoires sont calées pour rejoindre la surface sans laisser voir une bande du ciel. Les proportions sont préservées et les couches débordent du cadre des deux côtés. [Bilan du lot, provenance et rendus](production/STAGES_COMPLETS_20261119.md).

## 8. Tournoi et modes complémentaires

**Guide associé : §§11, 12 et 20–24.** Boss Battle propose les six rencontres décrites au §14. Boss Rush les enchaîne selon les règles du §12.7 et du lot livré au §16. Le §12.10 décrit la portée du salon privé et des replays déjà présents.

Le **Duel originel** propose six décors en duel direct et entraînement : Grève, terminal, camp MULE, abri Timefall, champ de bataille et bassin de goudron. Son sélecteur illustré et sa sauvegarde propre conservent le choix du lieu ; la revanche reprend ce lieu. L’entraînement propose un adversaire immobile, en garde ou piloté par l’IA, un changement de lieu et une remise en place des combattants. Les récits de Sam et Higgs restent sur la Grève. Les cinq plans sont adaptés à sa vue de 1120 × 630 et à son sol à 528 sans modifier le moteur historique.

### Lire et reprendre un tableau

À quatre participants, deux demi-finales déterminent la finale. À six, deux des quatre rencontres du premier tour comportent une exemption, et les deux autres se jouent ou se simulent. À huit, quatre quarts de finale ouvrent le tournoi. Une exemption qualifie une entrée sans lui attribuer de victoire en manches. Le tirage sauvegarde l’identité du participant, son combattant et sa place dans le tableau. J1 et J2 peuvent donc choisir Sam et rester reconnaissables jusque dans le résultat.

**Exemple à six.** J2 rencontre une IA pendant que J1 attend sa demi-finale. L’écran de duel indique les commandes J1 pour cet humain seul. À la fin, le tableau attribue pourtant le résultat à l’entrée J2 qui s’était qualifiée. Si les deux humains se retrouvent en finale, chacun récupère son côté de commandes. Une fermeture du jeu entre ces deux rencontres doit restituer les deux qualifiés et le premier score. Une fermeture en cours de combat renvoie au duel restant à jouer.

| Mode | Parcours du joueur | Vérification |
|---|---|---|
| Histoire | Choisir un combattant, lire son introduction, battre ses trois adversaires et revoir les scènes débloquées dans la galerie. | La revanche reprend au duel perdu. Une scène rejouée dans la galerie ne valide aucun chapitre supplémentaire. |
| Arcade | Disputer les trois duels de la route du personnage à la suite. | Les adversaires et leur ordre correspondent à la route affichée avant le premier duel. |
| Versus | Choisir les deux combattants et l’arène, puis affronter une IA ou un deuxième joueur local. | Les deux combattants peuvent être identiques. Un changement de côté inverse l’avant et l’arrière de chaque personnage. |
| Entraînement | Choisir un mannequin immobile, en garde ou piloté par l’IA. Activer l’affichage des volumes et éprouver une technique. | Lire le début de la portée et la hauteur du contact, puis recommencer côté opposé. Le mannequin récupère sa vitalité après un K.-O. |
| Tournoi | Inscrire un ou deux humains, tirer le tableau et aller jusqu’au champion. | Une rencontre entre deux IA fournit son score. Le joueur peut reprendre le prochain duel ou revoir le tableau terminé. |

**Données des coups.** La case du dojo affiche le démarrage, l’activité, la récupération et la phase en cours pour chaque combattant. La durée de vie d’un projectile ou d’un repère reste distincte de celle du geste qui l’a créé.

**Enregistrer le mannequin.** Au dojo, sélectionner **Enregistrer J2**, saisir la séquence au clavier J2 ou sur la seconde rangée tactile, puis choisir **Lire en boucle**. Le compteur affiche la durée de la prise. Les événements sont datés au pas de simulation à 60 Hz, y compris les pressions brèves. La pause gèle la tête de lecture. **Replacer au centre** conserve la prise pour repartir à distance égale.

**Revoir un tournoi.** Après une rencontre jouée, **Revoir le duel** restitue les choix de combattants, les commandes et la graine de l’IA. Le lecteur peut mettre en pause et revenir au tableau. Les matchs simulés entre IA et les anciens résultats gardent leur score.

**Survie.** Sept duels d’une manche opposent le combattant choisi aux sept autres. La vitalité démarre à 100 ; après une victoire, elle augmente de 15 points, jusqu’à 100. La reprise d’un échec conserve la vitalité d’entrée de ce duel. Le registre distingue la difficulté, le combattant et les parcours avec ou sans reprise.

**Boss Battle et Boss Rush.** Boss Battle donne accès séparément aux six rencontres, avec choix du combattant, de la difficulté et de l’arène. Le Boss Rush du 25 novembre reprend ces six rencontres dans un ordre fixe, avec 120 PV initiaux, récupération de 20 PV plafonnée à 120 et rétablissement de l’énergie et de la garde à 100 entre rencontres. Une défaite termine la série. Sa reprise et ses records disposent de leur propre sauvegarde ; les règles de Survie restent distinctes. Voir le [règlement Boss Rush](production/20261125-universe/BOSS_RUSH.md).

**Livraison sous pression.** Le porteur entre au camp avec une caisse scellée. Une touche directe sur J1 rompt le scellé. La garde le protège. Une victoire en portant la caisse intacte ajoute le sceau du camp à la galerie, même après fermeture et réouverture du jeu.

## 9. Direction des sprites et du son

**Guide associé : §§10, 17, 18 et 22.** Les fiches F et J du §12.9 associent chaque scène ou asset à sa source, ses usages, son ancrage et sa preuve de contrôle ; les besoins d’animation suivent la phase de production du lot.

### Un geste, un point d’appui

Préparer chaque pose sur fond transparent, personnage entier, initialement tourné vers la droite. Repérer la semelle qui porte le poids ainsi que la position du bassin. Prenons une fente de Fragile. La position du buste descend, sa largeur augmente et la main arrive devant la ligne des épaules. Recadrer sur la boîte visible, conserver dans le moteur l’ancrage mesuré entre les semelles, puis visionner l’entrée et la sortie de la pose sur le même dallage. Un glissement du pied arrière se corrige dans le calage du dessin. Un adversaire touché trop tôt demande de revoir les volumes dans le dojo.

| Mouvement à dessiner | Départ | Pose caractéristique | Retour et contrôle |
|---|---|---|---|
| Garde et déplacement | Genoux souples, regard à hauteur du rival. | Au pas avant, le pied qui se lève libère la cheville arrière. Le harnais, le pan de cape ou le parapluie suivent avec retard. | Reposer le pied puis ramener le centre de masse. Vérifier le même cycle face à gauche. |
| Coup léger et fort | Un retrait bref donne sa direction au léger. Le fort engage plus tôt le bassin. | La main, la caisse ou le bras d’ordre se détache nettement du torse. | Récupération raccourcie sur le léger, rééquilibrage lisible sur le fort. Compter les pas du moteur, même si un dessin reste affiché plusieurs pas. |
| Impact et garde | Déterminer si le coup touche, est bloqué ou passe à côté. | Sur un impact, décaler d’abord le buste. En garde, fermer les avant-bras au contact. | Reprendre le contrôle à la fin de l’étourdissement ou du blocage. La pose visible et la durée de perte de contrôle se vérifient séparément. |
| Saut et réception | Plier les jambes avant la poussée. | Lire un point haut et le déplacement horizontal sans suivre le décor. | Premier contact des semelles, flexion, retour en garde. Comparer les hauteurs de la capsule et du masque avant et après. |
| Victoire et finalité | L’invite conserve la position des corps obtenue au K.-O. | Le geste en arène se prolonge dans un plan illustré propre au gagnant. | Garder le vainqueur et le score lorsqu’on passe au résultat. Éprouver les deux côtés et chaque adversaire miroir. |

**Lecture des personnages.** Sam amortit la charge par les hanches. Fragile économise ses gestes, la ligne du parapluie prolonge la main. Higgs ouvre le cadre autour du masque avec son poids porté en arrière. Chez Cliff, le regard reste fixe pendant que la main donne l’ordre. Un miroir horizontal de la silhouette inverse aussi le côté du matériel. Une future vue gauche dessinée devra reprendre les asymétries corporelles de la référence, en particulier l’équipement de Sam.

### La laisse de mer sur la Grève

Derrière les combattants, les côtes d’un cétacé et le basalte forment un plan indépendant. Lors d’un déplacement de caméra de 100 pixels, le panorama glisse de 14 pixels, la laisse de mer de 43 et les galets du premier plan de 80. La zone centrale reste dégagée pour lire le lien de Sam et l’empreinte de Higgs. Le test des arènes contrôle l’ordre de ces vitesses dans les deux sens.

### Écouter une action sans regarder le HUD

Chaque technique acceptée déclenche le son du combattant. La sangle de Sam frotte avant le clic du fermoir. Les baleines du parapluie de Fragile claquent puis leur souffle s’efface. Chez Higgs, une masse grave se soulève avant la retombée d’une goutte. Le déclic de Cliff ouvre un souffle de radio. Le scanner du MULE monte en fréquence puis reçoit un bip. Au relais grave de Die-Hardman répond un signal de terminal. Le treuil de Mama monte dans l’aigu puis fait résonner le métal. Heartman associe une pulsation sourde à une note de moniteur. Le navigateur synthétise ces sons. L’impact, la garde et la rupture d’équilibre ont leurs propres signaux au moment du contact. Le bouton Son coupe aussi la traîne en cours. Les poses, les effets et les jauges restent lisibles pendant le silence.

Les dix-sept configurations d’arène ont aussi un fond sonore synthétisé et un événement localisé : ressac, porte, radio, balise, moniteur, treuil, conduite, goutte, bulle ou rafale. **Ambiance du décor** règle leur volume séparément des techniques ; le réglage initial est de 35 % et la préférence est partagée avec le salon privé. Pause, sortie, fin et coupure du son libèrent toutes les voix. Les effets réduits conservent un fond plus discret et suppriment les événements intermittents. Les horloges audio restent hors des checkpoints ; le rattrapage réseau est silencieux, y compris lorsqu’il reconstruit le duel sans checkpoint. [Détail des profils et de la recette](production/AMBIANCES_VARIANTE_MULE_20261119.md).

## 10. Production et recette

**Guide associé : §§00, 25–28.** Le registre EDG-G00–EDG-G29, les statuts séparés et les lots du §12.11 encadrent toute extension. Les tests cités ci-dessous sont des moyens de validation, avec leur portée propre.

Pour intégrer un personnage d’extension, commencer par un duel miroir complet. Résoudre le portrait et les pieds sur une arène neutre, relier les commandes, puis contrôler chaque technique dans les deux directions. Brancher ensuite les trois adversaires de la route, l’illustration du rival et la finalité. Un portrait ou une fiche de personnage isolés ne suffisent pas pour le compter dans la sélection jouable.

| Essai reproductible | Observation attendue |
|---|---|
| Extraire une copie du dépôt, ouvrir `JOUER.html`, lancer Échos de la Grève, puis revenir à la campagne. | La campagne, ses cinq lots et le menu de combat s’ouvrent par leurs chemins relatifs. Le bouton de retour mène à l’écran titre. |
| Entrer en Versus avec deux personnages identiques et permuter les côtés. | Chaque joueur conserve ses commandes. La technique « avant » et sa portée suivent l’orientation de l’avatar. |
| Laisser les deux personnages aux extrémités de chaque arène, puis les rapprocher jusqu’au contact. | Sol continu, bords pleins, pied avant reconnaissable, tête et avertissements visibles pendant le changement de zoom. |
| Jouer une campagne, perdre au rival, gagner la revanche et rouvrir la galerie. | Même duel après la défaite, un épilogue pour le gagnant du parcours et des images correspondant au point de vue choisi. |
| Terminer un duel décisif de chaque côté, déclencher la finalité, puis recommencer en laissant l’invite expirer. | Dans le premier essai, l’image appartient au vainqueur. Dans le second, le résultat arrive directement. |
| Reprendre un tableau à six après une qualification automatique et un match joué. | Les exemptions concernent deux entrées distinctes. Les qualifiés, les scores et les places du tour suivant sont conservés. |

Les scénarios automatisés se trouvent dans `modes/echos-de-la-greve/qa/`. Le test `parcours.cjs` exerce les transitions des menus et la progression. Le test `techniques.cjs` pilote le moteur réel, décode le catalogue d’images et compare les commandes sur les deux côtés. Le test `mule.cjs` suit le marqueur et la caisse de chaque côté du terrain, y compris pendant une pause, un blocage ou un saut. Les épreuves ont leur scénario dans `defis.cjs`. Les tests `extensions.cjs`, `poses.cjs`, `dojo.cjs` et `replays.cjs` couvrent les nouveaux combattants, la marche, les impacts, l’enregistrement du mannequin et la restitution des matchs du tournoi. [Captures en jeu](apercus/)

Le contrôle `arenes.cjs` définit un parcours navigateur complet ; sa présence ne prouve pas une exécution dans le lot courant. Le complément `arenes-canvas.cjs` peut exécuter le même `fight.js` avec un Canvas natif quand Chromium n’est pas disponible. Le périmètre historique de onze configurations, duel local et entraînement, deux directions et effets normaux/réduits représentait 88 cas de rendu. Il contrôlait les fichiers réellement dessinés, les proportions, les vitesses relatives, le débord horizontal et l’ancre de sol. Les nouvelles configurations doivent apparaître dans un rapport actualisé avant d’être couvertes par cette preuve ; ces essais ne valident ni les menus d’un navigateur ni la fidélité canonique des décors.

## 11. Références officielles

Les sources de ce chapitre documentent le socle DS1 / Director’s Cut des premières fiches. Le [registre UNIVERS_DS.md](UNIVERS_DS.md#8-références-primaires-consultées) les complète pour DS2, les romans, les adaptations et les projets annoncés. Une œuvre annoncée appartient au périmètre documentaire sans que ses éléments non dévoilés soient inventés ou présentés comme déjà disponibles.

**Guide associé : §§02 et 29.** Les références Death Stranding de ce chapitre restent les sources du projet ; les inspirations S1–S5 du guide sont qualifiées séparément au §12.12.

Les numéros ci-dessous renvoient aux fiches des chapitres 1 à 7. La présentation, le rôle et l’équipement du personnage viennent des sources indiquées. Les noms des techniques d’Échos de la Grève, leur coût, les dialogues de rivalité et les cadrages latéraux appartiennent au fan-game.

| Réf. | Élément à comparer | Source primaire |
|---|---|---|
| 1 | Sam porteur, capsule de BB et apparence générale du premier épisode. Examiner l’attache de la capsule et l’encombrement du chargement. | [PlayStation France · Death Stranding](https://www.playstation.com/fr-fr/games/death-stranding/) |
| 2 | Détection des MULEs, cargaison dans la main, parade au lien et vues du terrain. Comparer la relation entre l’outil, les hanches et le fret. | [Kojima Productions · Conseils pour la région orientale](https://www.kojimaproductions.jp/en/DSTips) |
| 3 | Stand de tir du Director’s Cut et gestes ajoutés au répertoire de Sam, dont le coup de genou sauté. | [PlayStation France · Nouveautés du Director’s Cut](https://www.playstation.com/fr-fr/editorial/how-death-stranding-directors-cut-expands-kojimas-sci-fi-epic/) |
| 4 | Portraits illustrés et fonctions de Die-Hardman, Higgs, Fragile, Heartman et Cliff. Vérifier les traits, le masque, la capuche et la découpe des tenues du premier épisode. | [PlayStation Blog · Personnages de Death Stranding](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/) |
| 5 | Téléportation de Fragile, rapport de Higgs aux Échoués et rencontres de Sam avec Cliff sur les champs de bataille. | [PlayStation Blog · Récit du premier épisode](https://blog.de.playstation.com/2025/06/23/death-stranding-was-bisher-geschah/) |
| 6 | Première rencontre entre Sam et Mama, environnement de travail et mise en scène de son lien avec un Échoué. Comparer l’espace autour de sa main avec le plan d’origine. | [PlayStation Blog · Présentations de la Gamescom 2019](https://blog.playstation.com/2019/08/20/death-stranding-new-footage-and-character-spotlight-videos/) |
| 7 | Heartman, sa cadence de vie et son équipement dans son espace de recherche. Examiner ses gestes entre deux consultations du moniteur. | [PlayStation · Présentation filmée de Heartman](https://www.youtube.com/watch?v=jKFJrET-3EI) |
| 8 | L’usine en ruines du Director’s Cut et le saut de Fragile depuis le parapluie de la chambre privée. | [Kojima Productions · Guide du Director’s Cut](https://www.kojimaproductions.jp/en/death-stranding-directors-cut-beginners-guide) |

Pour valider une correspondance 1:1, relever la version du jeu et le plan officiel comparé, puis placer la capture et le sprite à même hauteur de tête. Examiner le profil, chaque accessoire visible, son côté, sa fixation et la palette sous une lumière comparable. Un élément caché sur toutes les vues consultées reste à documenter. Conserver séparément l’état de chaque pose et les mouvements restant à dessiner.

## 12. Intégration du Guide Combat Games v1.0

**Intégration documentaire du 25 novembre 2026.** Le [Guide général Combat Games v1.0](references/Combat_Games_Guide_General_v1.0.txt), fourni par Darknigthmare, est associé à cette bible. Ses 30 rubriques servent de référentiel commun ; les choix propres à Échos de la Grève déterminent leur application. Le guide est conservé intégralement, sans modification : 55 172 octets, SHA-256 **4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7**.

**Historique du rapprochement.** La première association du guide a été établie par lecture du [commit ba4431587f86](https://github.com/darknigthmare/Death-Stranding-2D/tree/ba4431587f861823e453c85bdf7e6967778329a9). Elle recensait alors huit combattants, dix lieux, onze configurations et six modes d’accueil. Cette photographie historique ne décrit pas les ajouts ultérieurs.

**État de référence réceptionné avant le complément du §17.** La fusion de référence `56af3d8` réunit le guide, la suite du 24 novembre et les quinze images fixes du premier lot du 25 novembre. Elle comprend six rencontres Boss Battle, douze lieux, treize configurations, soixante-cinq couches et sept modes. Le lot univers livré ajoute Boss Rush, documenté par son [rapport de vérification](production/20261125-universe/boss-rush-verification.json), et quatre arènes / vingt plans supplémentaires (§16). L’[inventaire daté du lot univers](production/20261125-universe/catalogue-inventory.json) confirme huit modes, seize lieux, dix-sept configurations, quatre-vingt-cinq couches, 29 images de galerie et 12 dossiers d’Archives. Une inspection de code, un essai de simulation et un rendu visuel ont des portées distinctes ; les preuves datées sont indiquées avec leurs limites.

### 12.1. Périmètre conservé et ordre des références

| Champ de la fiche projet A | Application à Échos de la Grève |
|---|---|
| Projet et rôle | Mode annexe de combat de Death Stranding 2D, accessible depuis La Ligne silencieuse. |
| Œuvres de référence | Ensemble de l’univers Death Stranding : DS1, Director’s Cut, DS2: On the Beach, romans, adaptations et projets officiellement annoncés. [UNIVERS_DS.md](UNIVERS_DS.md) conserve œuvre, édition, statut de publication et continuité. |
| Fiction | Reconstitutions d’empreintes dans un simulateur. Rencontres, dialogues, noms de techniques et dispositifs propres au mode sont des créations du projet. |
| Format | Socle de duel latéral 1 contre 1, une piste, caméra commune, simulation à 60 pas par seconde ; rencontres Boss Battle et série Boss Rush avec leurs règles propres. |
| Support observé | Navigateur, JavaScript et Canvas ; clavier, tactile et entrée de manette standard. Le lot domaines vérifie des échantillons Gamepad synthétiques, sans manette physique certifiée. Le salon privé emploie un relais Node.js. Chaque plateforme et périphérique conserve sa propre recette. |
| Roster | Huit identités jouables existantes : sam, fragile, higgs, cliff, mule, diehardman, mama, heartman. Ce socle n’est pas un plafond. Nouveaux personnages, versions DS2, costumes, boss, compagnons et PNJ reçoivent un rôle et un statut distincts. |
| Contenu narratif du mode | Huit histoires individuelles de trois duels et trois scènes chacune ; campagne transversale Les Nœuds rompus intégrée et vérifiée dans un DOM/Canvas simulés, distincte de La Ligne silencieuse (§17). |
| Décors | Dix-neuf lieux / vingt configurations / cent couches intégrés, dont les trois arènes DS2 supplémentaires vérifiées au §17. Le camp MULE conserve sa variante sèche. |
| Direction artistique | Personnages entiers lisibles de profil, matériaux et accessoires reconnaissables, pieds ancrés, paysages en plans séparés. La conformité 1:1 se contrôle pose par pose. |
| Langue et audio | Textes français dans les catalogues inspectés ; signaux et ambiances synthétisés. Une autre langue, un doublage ou une bande musicale complète nécessite un lot de production distinct. |
| Phase du lot univers | Documentation, images fixes autonomes et plans de décor ; ajout logiciel de Boss Rush et raccordement des arènes. Aucune nouvelle animation générée dans ce lot ; les images seules ne valent pas de nouveaux combattants jouables. |
| Duel originel | Sous-mode historique avec moteur, commandes, récits et préférences enregistrées séparément ; ses valeurs ne deviennent pas celles du mode principal par défaut. |

**Cinq piliers d’arbitrage :** reconnaître le personnage et son équipement ; lire la distance et le retour en garde ; donner un contre-jeu aux outils chiraux ; préserver le sens des gestes de livraison et de liaison ; distinguer ce qui est imaginé, produit, intégré et vérifié.

L’ordre de lecture est le suivant :

1. Les consignes du projet fixent le périmètre de tout l’univers Death Stranding et la phase demandée pour chaque lot.
2. Les sources officielles du chapitre 11 et de [UNIVERS_DS.md](UNIVERS_DS.md) étayent l’identité et les éléments attestés dans une œuvre et une version données ; leurs continuités ne sont pas fusionnées automatiquement.
3. La bible décrit le jeu cible et qualifie ses adaptations.
4. Le code et la version identifiée attestent les règles chargées ; un essai daté atteste leur fonctionnement dans la situation testée.
5. Le guide commun complète les fiches et les contrôles. Une inspiration issue d’une autre licence ne modifie pas automatiquement notre univers ou notre moteur.

Les cinq statuts de fidélité du guide s’appliquent à chaque fiche : **canon attesté**, **adaptation jouable**, **original compatible**, **alternatif / crossover**, **à confirmer**. Un personnage attesté peut avoir un kit composé d’adaptations et de créations. Les noms « Ordre de maintien », « Mémoire de phase » ou « Travée de retour » restent ceux du projet. Une scène originale n’acquiert pas un statut canonique parce qu’elle utilise des personnages officiels.

### 12.2. Association des 30 rubriques

Les identifiants **EDG-G00 à EDG-G29** assurent la traçabilité vers le guide. **Retenue** signifie que l’exigence s’applique à la conception ; cela ne signifie pas qu’elle est implémentée. **Différée** conserve un module dans la feuille de route. **À décider** désigne un choix encore ouvert. **Non applicable** exclut un élément du périmètre courant avec sa raison. L’état de réalisation est indiqué séparément.

Les priorités sont celles du guide : **P0** fondations et dépendances techniques, **P1** enrichissements narratifs et rencontres, **P2** extensions choisies. Un système déjà réalisé, comme le tournoi, reste dans le périmètre même si sa famille figure en P2 dans le guide.

| ID / guide | Association à la bible | Décision et priorité | Application, état et preuve attendue |
|---|---|---|---|
| EDG-G00 · utilisation | Préambule, §10, §12 | Retenue · P0 | Employer ce registre et les six axes de suivi ; chaque futur lot désigne sa portée, ses dépendances et sa preuve de recette. |
| EDG-G01 · identité | §1, §11, §12.1, UNIVERS_DS | Retenue · P0 | Conserver le simulateur 2D et les cinq piliers ; couvrir tout l’univers Death Stranding en distinguant œuvres, versions et annonces. Les plateformes supplémentaires restent à décider. |
| EDG-G02 · fidélité | §4, §7, §11 | Retenue · P0/P1 | Associer œuvre, version et référence visuelle à chaque élément ; contrôler asymétries, personnalité et adaptations. Les images actuelles ne sont pas certifiées 1:1 par cet ajout. |
| EDG-G03 · roster | §4, §12.4, UNIVERS_DS | Retenue · P0 | Préserver les huit kits et IDs existants sans en faire un plafond ; inventorier DS1, DS2 et les autres œuvres, puis distinguer combattants, variantes, costumes, soutiens, PNJ et boss. Une fiche ou une image ne rend pas automatiquement un candidat jouable. |
| EDG-G04 · fondations | §2–3, §12.3 | Retenue · P0 | Maintenir un relevé séparé des règles chargées et des règles cibles ; recette des gardes, côtés, égalités, interruptions et ressources. |
| EDG-G05 · actions | §3–4, §8, §12.9, §18 | Retenue ; fiches du duel livrées · P0 | [30 actions, huit kits et six gestes communs](ACTIONS_ET_IA.md) extraits de StrandFight : coûts, volumes, garde, annulations, conditions et avantage contextualisé. Recette ciblée reçue ; les chiffres ne sont pas transposés à boss.js ou au Duel originel. |
| EDG-G06 · conclusions | §4, §6, §12.5 | Retenue · P1 | Séparer ultime, finalité, victoire et épilogue. Finalités déjà branchées ; ultimes/renforcées cibles non branchées dans le moteur principal inspecté. |
| EDG-G07 · relations | §4–5, §12.4, §18 | Retenue ; matrice intégrée · P1 | [28 paires, 56 orientations et huit miroirs](RELATIONS_SIMULATEUR.md) de fiction du simulateur, avant Versus/Arcade et passables. Les routes et la campagne gardent leurs textes ; aucune relation officielle nouvelle affirmée. |
| EDG-G08 · histoires | §5, §8, §12.6 | Retenue · P1 | Huit routes déjà définies dans le catalogue ; compléter raison et conséquence de chaque duel. Vérifier début, reprise, rivalité, fin et galerie pour chacune. |
| EDG-G09 · campagne globale | §1, §5, §12.6, §17 | Retenue ; campagne intégrée, recette logique passée · P1 | La Ligne silencieuse reste la campagne principale. Les Nœuds rompus ajoute une campagne interne au simulateur, six chapitres et quatorze interludes, distincte des huit routes ; parcours complet gagné dans la recette à DOM simulé (§17). |
| EDG-G10 · scènes | §5–6, §9, §12.9, §17 | Retenue · P1 | Les 24 scènes cataloguées conservent leurs illustrations ; 24 plans complémentaires sont livrés et intégrés, sans modifier textes ni rivalités. Les quatorze interludes de campagne réemploient les visuels existants. Distinguer scène, illustration et plan. |
| EDG-G11 · boss | §8, §12.7, §14, §16, §19 | Retenue ; Boss Battle et Boss Rush intégrés · P1 | Six rencontres Boss Battle existantes ; Boss Rush implémenté et testé en simulation avec son règlement et sa reprise propres. Un compendium propre à boss.js est en production (§19) ; les chiffres du duel ne lui sont pas appliqués. Les nouveaux boss, notamment DS2, demandent une fiche I et une recette ; un rival final ou une image ne vaut pas boss intégré. |
| EDG-G12 · modes | §1, §8, §12.7, §16 | Retenue · P0/P1 | Huit modes réceptionnés : Histoire, Arcade, Versus, Boss Battle, Boss Rush, Tournoi, Entraînement et Défis ; Campagne du simulateur intégrée comme neuvième mode, avec recette logique au §17. Galerie, Archives, salon privé et Duel originel restent des accès distincts. Vérifier entrée, jeu, résultat, reprise et sortie. |
| EDG-G13 · arènes | §7, §9, §12.8, §16–18 | Retenue · P0/P1 | 19 lieux, 20 zones graphiques, 22 configurations, 105 couches distinctes et 110 liaisons de couches. Le hangar est une zone du terminal et la configuration liée réemploie le quai. Fiches, sources, sol, limites, ancrages et rendus qualifiés par lot. |
| EDG-G14 · activité des décors | §7, §9, §12.8 | Retenue · P1 | Séparer présentation, interactions, dangers et transitions. Effets réduits présents ; profil statique intégré dans le complément, avec parité de simulation, pixels et persistance vérifiés dans leurs hôtes documentés (§17). |
| EDG-G15 · connexions | §7, §12.8, §18 | Retenue ; première liaison intégrée · P1 | terminal-linked réalise quai → hangar : lourd/projection non bloqué au bord, 36 ticks, une fois par manche. [Fiche H et recette](production/20261125-domains/TRANSITIONS.md) : KO/temps prioritaires, arrivée contrôlable, checkpoints, replay et deux clients simulés. Les autres pistes restent sans passage. |
| EDG-G16 · objets secondaires | §4, §7, §12.4 et §12.9 | Retenue selon les rôles · P0/P1 | Catalogues séparés pour projectiles, objets de kit, invocations, compagnons, PNJ et ennemis. Camion et convoi MULE existent en rencontres Boss ; un véhicule pilotable ou de nouvelles vagues d’ennemis demandent un cadrage propre. |
| EDG-G17 · assets | §7, §9–11, §12.9 | Retenue · P0/P1 | Un sujet exploitable par source autonome, alpha réel si détouré, échelle, marges et ancrage contrôlés. Un atlas n’efface pas les sources ; une scène narrative peut réunir plusieurs acteurs. |
| EDG-G18 · présentation | §2–3, §7, §9 | Retenue · P0/P1 | Relier états, dessins, collisions, VFX, SFX et caméra ; conserver le 60 Hz et les signaux utiles en mode réduit ou sans son. |
| EDG-G19 · interface | §1, §3, §8, §18 | Retenue ; remappage intégré · P0 | Profils de commandes J1/J2 et contrôleur partagé ; données du duel et échanges avant-match intégrés. [Recette Commandes](production/20261125-domains/COMMANDES.md) à DOM simulé ; manettes synthétiques, pas de périphérique matériel certifié. |
| EDG-G20 · apprentissage | §1, §3–4, §8, §18–19 | Retenue · P0 | Dojo, volumes, prises J2 et fiches des actions chargées disponibles. Les nouveaux tableaux explicitent coûts, limites et récupération. Huit exercices dirigés de portée, garde, punition, ressources, signatures et annulation sont en production (§19), avec critères observés dans le moteur actuel ; aucune leçon d’une action cible absente. |
| EDG-G21 · IA | §8, §10, §12.10, §18 | Retenue ; profils du duel documentés · P0 | Trois cadences et probabilités conditionnelles, huit notes de comportement, 24 cas de seuils vérifiés. Les réponses non spécialisées et l’absence de planificateur universel restent visibles ; le score IA–IA du tournoi est un autre calcul. |
| EDG-G22 · équilibre et confort | §2–3, §7–10 | Retenue · P0/P1 | Matrice des confrontations, coins et sorties de pression ; options de confort sans perte d’information. Les règles cibles de réduction de dégâts restent distinctes du code chargé. |
| EDG-G23 · réseau et replays | §8–10, §12.10 | Retenue · P0 | Salon privé, prédiction, checkpoints, resimulation et replays déjà présents. Qualifier la portée du relais et tester latence, reconnexion et versions ; classement/crossplay restent à décider hors du périmètre courant. |
| EDG-G24 · progression | §1, §5, §8, §12.6–12.7 | Retenue · P0 | Préserver routes, galerie, tournoi, défis, préférences et sauvegardes distinctes de Boss Battle / Boss Rush ; Les Nœuds rompus ajoute `echos.campaign.v1`. Vérifier reprise et migration. Aucun bonus de la campagne principale n’est transféré au duel sans règle dédiée. |
| EDG-G25 · suivi | §10, §12.9–12.11 | Retenue · P0 | Identifiants stables, dépendances et six axes de statut. Compter séparément personnages, scènes, configurations, couches et validations. |
| EDG-G26 · recette | §10, §12.11 | Retenue · P0 | Relier chaque lot à des essais reproductibles ; une référence à un test existant n’est pas une nouvelle exécution de ce test. |
| EDG-G27 · fiches | §4–7, §12.9 | Retenue · P0/P1 | Employer les dix modèles A–J du guide comme compléments aux fiches existantes, avec liens vers les IDs du dépôt et inconnues visibles. |
| EDG-G28 · application | §10, §12.11 | Retenue · P0 | Avant tout lot : lire ce chapitre, inventorier, réutiliser les acquis, traiter les écarts puis produire et vérifier dans la phase demandée. |
| EDG-G29 · inspirations | §3, §11, §12.12 | Retenue comme référence méthodologique | Conserver S1–S5 dans le guide associé ; elles ne sont pas des preuves du canon de Death Stranding. Employer le glossaire pour décrire précisément les fonctions. |

### 12.3. Règles chargées et règles cibles

Les chapitres 2–4 restent le cahier de conception. Le tableau suivant fixe la différence avec le moteur principal inspecté, [fight.js](../../modes/echos-de-la-greve/fight.js). Il ne concerne pas le moteur historique du Duel originel. Une évolution de valeur devra mettre à jour les fiches, le dojo, les replays et les règles du salon privé dans le même lot.

| Sujet | Moteur principal inspecté | Cible conservée / décision |
|---|---|---|
| Simulation | 60 pas par seconde. | Cible commune à préserver indépendamment de l’affichage. |
| Vitalité | 100 au départ d’une manche ordinaire. | 1 000 au §2 ; changement d’échelle et rééquilibrage à décider. |
| Équilibre | 100 initialement ; rupture à zéro puis récupération. | Documenter ce système comme règle actuelle ; ne pas le confondre avec la jauge cible de Lien. |
| Ressource offensive | Chiral : 42 au départ, plafond 100, gains et régénération propres au moteur. | Lien : 0 au départ, gains décrits au §2, renforcée à 50 et ultime à 100. Cible distincte. |
| Entre les manches | Recréation des combattants ; retour des jauges à leurs valeurs initiales. | Conservation du Lien entre manches au §2. Migration à décider. |
| Chronomètre | 75 secondes. | 60 secondes au §2. Aucun remplacement automatique. |
| Victoire | Deux manches gagnantes ; une manche dans les défis. | Règles à préciser par mode, sans appliquer la règle arcade à tous les défis. |
| Égalité | Repositionnement, vitalité à 1 chacun, période de 15 secondes ; nouvelle égalité traitée de nouveau. | Départage cible de 30 secondes à 250 points puis impact décisif, selon le §2. |
| Garde | Bouton dédié, combiné à l’accroupissement pour la garde basse. | Arrière / bas-arrière, garde parfaite et déprojection décrites au §2 : cible à rapprocher des actions réellement présentes. |
| Saisie | Signature neutre, avant et arrière ; conservation d’une entrée jusqu’à 9 pas dans la file du moteur. | Quarts de cercle, priorités et tampon de 5 images proposés au §3. Les directions et noms ne se traduisent pas automatiquement. |
| Ultimes et renforcées | Aucune action dédiée branchée dans le moteur principal inspecté. | Conceptions conservées aux §3–4, à réaliser et équilibrer si retenues pour une prochaine version. |
| Combos | Annulations conditionnées par une touche confirmée et par la classe d’action. | Réduction successive 80 / 65 / 50 / 40 % et limites détaillées au §2 : objectifs supplémentaires, pas formule actuelle démontrée. |
| Finalité | Après K.-O. décisif : invite de 135 pas, soit 2,25 s ; séquence déclenchée de 108 pas, soit 1,8 s. | Invite de 120 pas et scène d’environ 4 s au §6 : version cible de mise en scène. |

Les dégâts d’une cible à 1 000 points ne doivent pas être divisés par dix et annoncés comme données du moteur sans vérification de l’action, de ses effets et de ses ressources. Les six normales décrites dans une fiche ne prouvent pas six animations propres déjà produites. Un relevé de données doit toujours indiquer **moteur, version, unité et contexte**. Le [catalogue actuel des actions et de l’IA](ACTIONS_ET_IA.md) et son [JSON](data/actions-et-ia.json) remplissent ce rôle pour StrandFight ; Commandes et le dojo exposent les mêmes données.

### 12.4. Personnages, relations et éléments secondaires

Le [catalogue de contenu](../../modes/echos-de-la-greve/content.js) conserve ses huit identifiants. Les mentions « extension » des fiches du chapitre 4 décrivent l’histoire de leur production : le MULE, Die-Hardman, Mama et Heartman font partie des huit entrées du catalogue actuel. Le registre de l’univers dépasse ces huit combattants. Sam DS2, Fragile DS2 et Higgs DS2 gardent leur œuvre, leur période et leur tenue ; leurs images ne remplacent pas les versions DS1 des kits existants. Dollman, Tomorrow, Rainy, Tarman, Neil et les autres candidats reçoivent un rôle documenté avant une éventuelle intégration au combat.

| ID existant | Expression du personnage dans le mode | Qualification à conserver |
|---|---|---|
| sam | Portage, reprise d’appui, lien et projectile de liaison. | Les outils attestés inspirent le kit ; délais, dégâts et enchaînements sont des adaptations du duel. |
| fragile | Déplacement, arrivée annoncée et repère de retour. | La capacité de saut inspire les outils ; balises et fenêtres de vulnérabilité sont réglées pour le jeu. |
| higgs | Goudron, empreinte au sol, feinte de départ. | Silhouette et motifs tirés de la référence ; zones, timings et réponses conçus pour le mode. |
| cliff | Ordre, poste avancé, salves et rappel. | Les manifestations sont des objets de son kit ; elles ne constituent pas des combattants jouables supplémentaires. |
| mule | Détection, pose, poussée et récupération d’une caisse. | Représentant anonyme de faction ; histoire et mécanique de caisse adaptées au fan-game. |
| diehardman | Interception, sceau et dispositifs de terminal. | Le rôle de commandement est la référence ; les pouvoirs du terminal de combat sont une création du simulateur. |
| mama | Ancrage, travée et treuil de l’avatar d’exercice. | Constructions techniques du simulateur, sans attribuer ces attaques au personnage officiel comme des pouvoirs attestés. |
| heartman | Moniteur, mémoire et impulsion sur un tempo visible. | Traduction ludique de recherche et de mesure ; le rythme de combat ne remplace pas son rythme narratif. |

La garde-robe de Mama comporte les entrées Atelier et Maintenance du viaduc dans les fichiers inspectés. Cela n’atteste pas une garde-robe complète pour les huit personnages. Un costume conserve le kit et les collisions ; une modification de capacités ou de morphologie reçoit une fiche de variante et une recette spécifique.

**Relations à traiter en priorité.** Sam / Higgs et Fragile / Higgs demandent des références de relation et un contexte de scène. Sam / Cliff demande une attention particulière à la période et aux informations connues des personnages. Mama / Die-Hardman, MULE / Sam et Heartman / Higgs possèdent déjà des rencontres de route écrites pour le simulateur. Leur dialogue précis est original. Les autres paires peuvent employer des entrées génériques fidèles ; une rencontre miroir représente deux empreintes, sans créer un événement dans la chronologie officielle.

Une entrée de relation comprend les deux IDs, la nature de la relation attestée ou inventée, la période, les sources, la route concernée et les scènes. La [matrice livrée](RELATIONS_SIMULATEUR.md) choisit explicitement la fiction du simulateur pour les 28 paires, leurs 56 orientations et huit miroirs. Elle ne constitue pas un relevé de relations canoniques. Les répliques déjà écrites au chapitre 5 restent les textes de référence ; les nouveaux échanges ne sont présentés qu’avant Versus/Arcade et peuvent être passés immédiatement.

**Catalogues séparés.** La caisse du MULE est un objet de kit avec propriétaire et durée de vie. La balise de Fragile, l’empreinte de Higgs et l’ancrage de Mama sont des marqueurs de simulation. Les échos de Cliff sont des manifestations liées à ses actions. Les silhouettes, portes, moniteurs et machines de fond restent des éléments de présentation tant qu’une règle de gameplay n’est pas définie. BB conserve son rôle narratif et visuel dans ce périmètre ; aucune fiche de combattant ne lui est attribuée. Le choix de l’étude du [Duel originel, chapitre 12](DUELS_SAM_HIGGS.md#12-finalités-narration-et-progression) est maintenu : BB est à protéger et sa capsule ne sert ni de cible ni de projectile.

Pour chaque projectile : propriétaire, émission, vitesse, trajectoire, collision, durée, nombre d’impacts, garde, dissipation, VFX et son doivent être liés à la fiche C. Les règles de réflexion ou de destruction ne sont décrites comme disponibles que si elles existent dans le moteur visé ; toute règle nouvelle reste une cible identifiée et versionnée.

### 12.5. Ultimes, finalités et fins narratives

Quatre objets documentaires sont désormais nommés distinctement :

- **Ultime** : action puissante pendant le duel, encore au stade de cible dans le moteur principal.
- **Finalité de la Grève** : conclusion après la condition de victoire définie, appelée aussi « fatalité » dans le chapitre 6 historique.
- **Victoire** : pose, annonce et résultat du match.
- **Épilogue** : résolution narrative de la route, consultable dans la galerie.

| Personnage | Finalité actuellement nommée dans le catalogue | Scène cible du chapitre 6 |
|---|---|---|
| Sam | Cargaison sécurisée | Reçu de livraison |
| Fragile | Dernier saut | Quai de sortie |
| Higgs | Rideau de goudron | Dernier spectateur |
| Cliff | Rappel de section | Rompez |
| MULE | Hors inventaire | Hors inventaire |
| Die-Hardman | Levée de consigne | Levée de consigne |
| Mama | Travée de retour | Travée de retour |
| Heartman | Intervalle | Intervalle |

Ces correspondances identifient des versions de réalisation, pas seize finalités intégrées. Une victoire au temps ne déclenche pas l’invite de K.-O. décisif dans le moteur inspecté. Le passage au résultat et les récompenses doivent donner la même issue, que le joueur déclenche la scène ou laisse passer l’invite.

La dissolution, l’évacuation ou la libération d’une empreinte restent le principe de conclusion. Pour une future cible géante, mécanique ou immatérielle, la fiche D doit prévoir une variante de sortie du simulateur qui ne dépend pas d’une anatomie humanoïde. Cette compatibilité reste à concevoir et tester. Une finalité de stage recevrait une fiche distincte ; aucune n’est déclarée disponible ici.

### 12.6. Association à La Ligne silencieuse et aux histoires individuelles

La **campagne globale du projet est La Ligne silencieuse**. Le chapitre 5 d’Échos décrit **huit histoires individuelles**, chacune avec trois combats et trois scènes cataloguées. Le mot « campagne » employé pour un parcours de combattant dans l’interface ou les textes historiques ne lui donne pas le rôle d’une intrigue globale commune.

La liaison documentaire avec la campagne principale porte sur quatre contrats :

1. **Entrée et retour.** Depuis l’accueil du projet, entrer dans Échos puis retrouver l’écran titre de la campagne ; la recette doit vérifier les chemins relatifs et les données requises.
2. **Continuité.** Les alliances, affrontements miroir et retours d’empreintes appartiennent au simulateur. Leurs résultats ne réécrivent ni les événements officiels ni l’histoire de La Ligne silencieuse.
3. **Sauvegarde.** Livraisons, inventaire, état de BB et progression de l’aventure restent dans leur domaine. Routes, galerie, tournoi, défis et préférences du combat gardent leurs données propres.
4. **Récompenses.** Une scène ou un sceau obtenu dans Échos conserve son usage annoncé. Tout transfert vers la campagne principale devra nommer la récompense, les conditions, la migration et les effets sur l’équilibre.

La présente association ne certifie pas la complétude narrative de La Ligne silencieuse : sa chronologie, ses chapitres et ses checkpoints relèvent de sa documentation et de sa recette. La campagne transversale **Les Nœuds rompus** est désormais intégrée et son parcours logique complet est vérifié (§17) : six chapitres à points de vue alternés, quatre duels, deux rencontres Boss et une conclusion propre. Une fermeture du réseau **interne à la reconstitution** isole ses empreintes ; les personnages rétablissent leurs possibilités de réponse. Aucun événement officiel ni état de La Ligne silencieuse n’est modifié. Cette campagne ne résulte pas d’un simple assemblage des huit listes d’adversaires.

Chaque fiche E reprend la route déjà définie dans le catalogue, puis complète : raison du combat, version du personnage, lieu, enjeu, conséquence, scène d’entrée et sortie, statut narratif et reprise. Les fiches F conservent textes et sous-titres séparément des illustrations. Un plan supplémentaire est une tâche d’asset ; il n’augmente pas à lui seul le nombre d’histoires.

### 12.7. Boss, Boss Rush et sélection des extensions

**Boss Battle est intégré depuis la suite du 24 novembre.** Il propose six rencontres : Catcher léonin, Catcher aquatique, baleine de goudron, géant de goudron, camion MULE et convoi MULE. Les quatre Échoués disposent de signaux d’attaque et d’une deuxième phase ; les missions MULE demandent d’immobiliser les véhicules puis de livrer les colis. Le convoi constitue une rencontre à deux vagues. Les huit combattants, les difficultés, les résultats et la reprise indépendante sont documentés dans la [fiche Boss Battle](production/20261124-suite/BOSS_BATTLE_20261124.md).

**Boss Rush est intégré et testé dans le lot univers du 25 novembre.** Il enchaîne les mêmes six rencontres, dans cet ordre fixe et sur leurs lieux conseillés. Le [règlement Boss Rush](production/20261125-universe/BOSS_RUSH.md) et le [rapport de vérification](production/20261125-universe/boss-rush-verification.json) donnent les règles et la portée exacte des scénarios exécutés. Il constitue le huitième mode d’accueil ; il ne produit ni un septième boss ni de nouvelles animations.

| Règle | Survie existante | Boss Rush du 25 novembre |
|---|---|---|
| Adversaires | Les sept autres combattants, un duel d’une manche chacun. | Les six rencontres Boss Battle ; le convoi conserve ses deux vagues. |
| Vie initiale et plafond | 100 PV. | 120 PV. |
| Après une victoire | +15 PV, plafonnés à 100. | +20 PV, plafonnés à 120, appliqués une seule fois au résultat. |
| Autres ressources | Règles du moteur de duel. | Énergie et garde à 100 au début de la rencontre suivante ; objets, projectiles et états temporaires réinitialisés. |
| Défaite | Possibilité de rejouer avec la vitalité d’entrée du duel ; reprise comptée. | La série se termine. Recommencer repart au premier boss avec 120 PV. |
| Reprise et records | Suivi du défi, du combattant, de la difficulté et des reprises. | Clé `echos.boss-rush.v1`, indépendante de Boss Battle (`echos.boss.v1`) ; reprise en combat ou entre deux rencontres, sans soin supplémentaire. |

Le chrono, les attaques et les objectifs de chaque rencontre restent ceux de Boss Battle. La série conserve combattant, tenue et difficulté ; le score cumule les scores des rencontres et le temps cumulé exclut introductions, pauses et interludes. Les records de réussite demandent les six victoires. Le Rush reste solo local ; il n’emprunte pas les replays de duel, le tournoi ou le relais privé.

**Étendre les boss à tout l’univers.** Les candidats DS2 et les autres œuvres entrent dans l’inventaire, avec leur source et leur version. Le lot d’images fixes peut fournir une étude de silhouette ou une arme ; il ne livre pas implicitement une rencontre ni une IA. Pour chaque nouveau boss, la fiche I précise :

| Champ de la fiche I | Prescription pour les extensions |
|---|---|
| Identité et source | Nom attesté, œuvre, édition, période et référence consultée. Distinguer le modèle officiel de la rencontre créée pour le simulateur. Les éléments non dévoilés d’une œuvre annoncée restent à documenter. |
| Type et version | Duel adapté, élite, créature géante, machine ou rencontre à objectif ; un boss réemployant une identité jouable conserve un profil de règles distinct. |
| Phases, si retenues | Déclencheurs, comportements, transitions d’état et retour au contrôle ; une hausse de vie seule ne constitue pas une nouvelle phase. |
| Contre-jeu | Signal et réponse pour chaque attaque ; immunités, vulnérabilités et compatibilité avec les styles jouables explicites. |
| Arène et objectifs | Lieu, configuration, caméra, limites, fret ou objectif propre à la rencontre ; aucun rôle de boss déduit d’une machine de décor. |
| Fin et reprise | Victoire, échec, sauvegarde, finalité compatible, récompense et effet éventuel sur un mode ; aucun changement de La Ligne silencieuse par défaut. |
| Validation | Familles de jeu prévues, distances extrêmes, phases, simultanéité, interruption et reprise ; séparer simulation et vérification visuelle. |

| Module supplémentaire du guide | Statut dans le périmètre actuel |
|---|---|
| Tournoi, Survie, Livraison sous pression | Présents ; préserver règles, recette et sauvegardes. |
| Boss Battle | Six rencontres intégrées ; nouveaux boss à documenter et réaliser individuellement. |
| Boss Rush | Intégré et testé en simulation dans le lot du 25 novembre ; règles, reprise et portée des preuves au §16. |
| Personnages et lieux DS2 | Inclus pleinement dans le catalogue ; quatorze images fixes et arène Magellan livrées, sans attribution automatique d’un kit jouable. |
| Romans, films et série | Inclus avec leurs statuts : œuvres publiées ou projets annoncés ; les contenus inconnus restent à documenter. Voir [UNIVERS_DS.md](UNIVERS_DS.md). |
| Crossover | Les éléments officiellement présents dans Death Stranding sont référencés dans leur édition ; d’autres croisements restent un choix explicite de conception. |
| Campagne globale propre au mode combat | Les Nœuds rompus : six chapitres et quatorze interludes intégrés, parcours complet gagné dans la recette à DOM simulé (§17). Association à La Ligne silencieuse conservée au §12.6. |
| Tag, équipes successives, coop contre boss, affrontements à plusieurs | À décider ; chaque module nécessite ses propres règles et une recette. |
| Matchmaking, classement et crossplay | À décider ; le salon privé existant ne démontre pas ces services. |
| Hub exploratoire, avatar et arbres RPG dans le mode | Non applicables au périmètre courant du duel annexe ; un besoin d’exploration relève d’abord de la campagne principale ou d’un cadrage séparé. |

### 12.8. Arènes : quatre axes, interactions et connexions

| Axe du guide | État observé | Contrat de conception |
|---|---|---|
| Présentation | Parallaxe, météo, ambiances et événements visuels/sonores ; effets réduits ; profil statique réceptionné dans le complément. | Conserver sol, limites et informations dans les trois profils ; une option de décor ne fige pas les états du combat. |
| Interactions | Objets de certains kits, notamment la caisse MULE. | Une interaction de décor commune exige sa fiche H, son objet, sa commande, sa portée et son contre-jeu. |
| Dangers | Aucun système général de dégâts de météo ou d’événement de stage identifié dans les fichiers inspectés. | Ne pas attribuer de dégâts à la pluie, au goudron ou aux machines de fond par leur seule présence visuelle. |
| Transitions | Une liaison explicite terminal-linked change la zone du quai vers le hangar pendant la manche. | Fiche H, arrivée jouable, une utilisation par manche et priorités KO/temps. Les pistes ordinaires et les Boss ne gagnent pas implicitement cette règle. |

Les interactions, dangers et transitions autorisés sont annoncés avant le match et partagés par les participants ; les options purement visuelles peuvent rester locales si elles préservent toutes les informations utiles.

La variante **mule-camp-dry** reste une configuration de **mule-camp**, avec changement de présentation. Elle ne crée ni un lieu supplémentaire ni une règle de friction ou de dégâts. Les corps restent sur la piste horizontale commune ; les variations de relief visibles au fond ne modifient pas les collisions du duel.

**Profil statique réceptionné.** `staticScenery` et `setStaticScenery` figent la présentation au moment de l’activation : parallaxe, horloge de météo et phase décorative. Simulation, combattants, projectiles, annonces et marqueurs utiles continuent. Le choix reste distinct des effets réduits ; `echos.v1.staticScenery` conserve la préférence. Le [rapport du complément](production/20261125-completion/RUNTIME.md) documente parité, pixels, persistance et retour au décor animé. La transition réelle de zone demeure visible en profil statique et fait l’objet de sa propre recette.

**Première connexion réceptionnée : quai → hangar.** La configuration `terminal-linked` commence dans `terminal` et permet un passage vers `terminal-hangar`. Ce rapprochement géographique est une reconstitution du projet. Le hangar et le quai restent aussi sélectionnables sans liaison. La [fiche H](production/20261125-domains/TRANSITIONS.md) décrit le déclencheur, les bandes au bord, le contre-jeu et le traitement complet des états :

- Coup lourd standard ou projection réussi, non bloqué, deux combattants au sol, frappe dirigée vers le bord et victime à x ≤ 144 ou x ≥ 1136.
- Un passage de 36 ticks par manche, sans coût ni dégât de décor ajouté ; chrono et ressources préservés pendant le passage après résolution du coup.
- Actions, files, marqueurs et projectiles neutralisés ; touches tenues et scellé du colis conservés. Arrivée au sol à x = 510 / 770, symétrique selon le côté, sans frappe automatique.
- K.-O., égalités, temps écoulé et rétablissement de vitalité au dojo prioritaires. Nouvelle manche : retour au quai, passage rétabli.
- Version `terminal-quay-hangar@1`, checkpoints et replay explicites. Les modes permis et l’exclusion des tirages de tournoi ou des rencontres Boss sont précisés par la fiche.

Les recettes logique, réseau simulé et Canvas natif vérifient le départ, l’arrivée contrôlable et la restauration. Elles ne prouvent pas une session de réseau public. Cette première liaison ne transforme pas les 22 configurations en un réseau universel de zones.

### 12.9. Fiches A–J, identifiants et inventaires

Les [dix fiches types du guide, section 27](references/Combat_Games_Guide_General_v1.0.txt) complètent les tableaux actuels ; elles n’annulent pas les informations déjà spécifiques aux personnages, routes et lieux.

| Fiche | Référence existante / association | Complément à renseigner |
|---|---|---|
| A · Projet | §12.1 et préambule | Périmètre de version, périphériques validés, budget de performances et décisions ouvertes. |
| B · Personnage | §4 et ID de content.js | Version, période, relations, adaptations, costumes et liens vers actions, route, scènes et assets. |
| C · Action/projectile | [Actions et IA](ACTIONS_ET_IA.md), [JSON](data/actions-et-ia.json), moteur et dojo | 30 attaques du duel documentées et testées sur cas ciblés ; contexte d’avantage explicite. Compatibilité Boss et équilibre global restent des périmètres distincts. |
| D · Finisher | §6 et §12.5 | Nom actuel/cible, cibles compatibles, séquence, remplacement, passage abrégé et résultat persistant. |
| E · Route | §5 et liste route du personnage | Cause et conséquence de chaque duel, statut narratif, sauvegarde, reprise et récompense. |
| F · Chapitre/scène | §5–6, texte et catalogue d’images | Plans, continuité, émotions, lumière, sous-titres, sons, entrée/sortie et références. |
| G · Arène | §7, arenas et stageDetails | Lieu/configuration, source, période, dimensions, sol, limites, couches, activités et quatre axes. |
| H · Interaction/transition | [Quai → hangar](production/20261125-domains/TRANSITIONS.md), §12.8 | Premier passage reçu ; réutiliser le contrat et les cas limites pour toute nouvelle liaison, sans supposer sa présence sur les pistes ordinaires. |
| I · Boss | §12.7 | Version, phases, signaux, vulnérabilités, compatibilité roster, victoire, reprise et règles Boss Rush. |
| J · Asset/suivi | §9–11 et inventaires de production | Fichier source/intégré, dimensions, alpha, orientation, ancrage, dépendances, provenance et preuve de contrôle. |

**Convention d’identification documentaire.** Réutiliser d’abord les clés existantes du moteur. Les namespaces ci-dessous servent aux fiches ; ils ne renomment pas les clés des sauvegardes :

| Exemple de fiche | Dépendances à associer |
|---|---|
| CHAR:sam | ID sam ; route correspondante ; actions ; portraits ; poses ; finalité et scènes. |
| MOVE:mule:consigne-mobile | CHAR:mule ; objet de caisse ; règle de pose ; règle de poussée ; VFX/SFX ; essais garde/saut/rappel. |
| ROUTE:mama | CHAR:mama ; ordre Heartman → MULE → Die-Hardman ; lieux définis dans content.js ; scènes intro/rival/ending. |
| SCENE:heartman:ending | ROUTE:heartman ; texte du catalogue ; illustration ; continuité ; état de galerie. |
| STAGE:mule-camp-dry | Lieu parent mule-camp ; météo sèche ; panorama ; cinq couches ; ambiance ; validation de rendu. |
| LINK:terminal:quai-hangar | Configuration terminal-linked ; zones terminal / terminal-hangar ; règles terminal-quay-hangar@1 ; [fiche et preuves](production/20261125-domains/TRANSITIONS.md). |

Les assets autonomes demandés pour un futur lot gardent un sujet exploitable par image source, le corps entier lorsque nécessaire et un vrai fond transparent. Les décors et scènes narratives peuvent être opaques. Les planches et atlas déjà intégrés restent documentés ; leur existence ne supprime pas le contrôle de chaque pose ni les besoins futurs de sources autonomes. Si le lot demandé porte seulement sur les sprites de base, les autres états sont inventoriés sans lancer leur production.

Chaque fiche suit séparément :

| Axe | États ou preuve à conserver |
|---|---|
| Lore | Source identifiée, vérifiée ou incertaine ; adaptation et création qualifiées. |
| Conception | À définir, documentée ou validée pour un périmètre nommé. |
| Assets | Manquants, en production, produits ou vérifiés ; référence et version de chaque fichier. |
| Intégration | Absente, partielle ou intégrée, avec emplacement effectif. |
| Validation | Non testée, en échec ou validée ; essai, date et version précise. |
| Publication | Locale, commit, PR, fusion ou version livrée ; conserver la référence effective après l’action. |

**Inventaire historique au commit ba4431587f86 :** huit identités de combattants ; huit routes ; 24 entrées de scène ; dix lieux ; onze configurations ; 55 couches ; six modes. **Socle réuni avant le lot univers :** les mêmes huit kits, huit routes et 24 scènes, avec douze lieux, treize configurations, 65 couches, six rencontres Boss et sept modes. **État après le lot univers :** huit modes avec Boss Rush ; seize lieux, dix-sept configurations et 85 couches ; quatorze images fixes DS2 et vingt nouveaux plans livrés. Le §16 en donne l’inventaire et les preuves. **État après le complément :** neuf modes avec Les Nœuds rompus ; dix-neuf lieux, vingt configurations et cent couches ; 43 images fixes au catalogue, 16 portraits aux Archives et 24 plans narratifs supplémentaires intégrés. Le §17 et le registre de production associent ces comptes à leurs preuves locales. **Lot domaines :** 19 lieux, 20 zones graphiques, 22 configurations, 105 couches distinctes et 110 liaisons de couches ; une même image réemployée n’est pas un nouveau PNG. Le §18 distingue ce relevé des livraisons antérieures. Ces unités restent séparées ; les huit identités ne limitent pas le catalogue de l’univers. Les illustrations de finalité, poses, costumes, replays, accès à la galerie et salon privé appartiennent à d’autres catégories. Ce bilan n’est ni un décompte exhaustif de tous les fichiers ni un pourcentage global de réalisation. Tout futur taux indique son périmètre, son unité et son dénominateur : éléments ayant passé une étape / éléments retenus et applicables à cette étape. Un dénominateur nul donne « non applicable » ; une complétude de bout en bout exige les mêmes éléments à toutes les étapes requises.

### 12.10. Réseau, IA, accessibilité et sauvegardes

Le salon privé est déjà structurant pour P0. [netplay.js](../../modes/echos-de-la-greve/netplay.js) et [netplay-server.cjs](../../modes/echos-de-la-greve/netplay-server.cjs) définissent sélection, état prêt, commandes datées, prédiction locale, checkpoints, retour en arrière et resimulation. Le relais ordonne les entrées et compare les résultats déclarés ; il n’exécute pas lui-même une simulation autoritaire du combat. Les salons en mémoire ne constituent pas une sauvegarde durable de service.

Le guide est appliqué en conservant cet acquis et en demandant, pour toute nouvelle règle : sérialisation des objets, aléatoire reproductible, compatibilité de version, reconnexion, résultat cohérent et reconstruction silencieuse des effets audio. Matchmaking, classement, anti-triche de service et crossplay ne sont pas déduits de l’existence d’un salon.

Les replays de tournoi concernent les matchs effectivement joués et enregistrés. Les scores simulés entre IA ne créent pas rétrospectivement un enregistrement d’entrées. Le salon possède aussi son parcours de dernier duel et d’export ; chaque format doit conserver les informations de version nécessaires ou annoncer l’incompatibilité.

Pour l’IA, les [fiches livrées](ACTIONS_ET_IA.md#difficultés-et-décisions-ia) distinguent intervalle de décision, distance, tirages conditionnels, usage de ressources et réponses effectivement présentes aux outils. Elles n’inventent ni taux d’erreur humain ni délai de perception séparé. Une difficulté supérieure ne doit pas masquer une exception aux règles ; une exception de boss sera explicite. Le calcul rapide d’un résultat IA–IA dans le tournoi reste une simulation de score, distincte de l’IA du moteur.

Pour l’accessibilité, conserver les textes de commande, les effets réduits, les repères non exclusivement colorés et les réglages sonores disponibles. Le [lot Commandes](production/20261125-domains/COMMANDES.md) réalise profils J1/J2, remappage et lecture de manette ; sa recette emploie un DOM et des manettes synthétiques. Les contrôles matériels, de contraste et de lisibilité restent à qualifier par périphérique. Les volumes dédiés aux ambiances ne prouvent pas l’existence de pistes voix et musique séparées. Une aide qui change une action de combat est une règle à partager ; une simplification purement visuelle peut rester locale si elle conserve les informations.

Toute évolution de sauvegarde doit identifier le schéma, les anciennes valeurs, la conversion, le comportement sur données manquantes et la conservation du résultat acquis. Les clés de personnage, d’arène et de variante déjà utilisées ne sont pas renommées par les nouveaux IDs documentaires.

### 12.11. Ordre de production et critères d’acceptation

La priorité immédiate est de fermer les écarts de documentation qui peuvent fausser un lot de production. Les modules supplémentaires viennent après leur preuve technique.

| Lot | Priorité / dépendance | Résultat attendu avant de le dire terminé |
|---|---|---|
| 1 · Références et règles | P0 ; existant à préserver | Fiches et menu de commandes distinguent moteur principal, Duel originel et cible ; chaque chiffre porte son contexte ; sources et adaptations sont qualifiées. |
| 2 · Actions et apprentissage | P0 ; règles identifiées | Les fiches C du duel sont livrées et leur recette ciblée reçue (§18). Les exercices dirigés supplémentaires et la matrice d’équilibrage restent distincts de la consultation des chiffres. |
| 3 · Assets et scènes | P1 ; fiches et inventaire | Références visuelles, asymétries, alpha, ancrages et réduction contrôlés ; une route représentative se parcourt de l’intro à l’épilogue avant extension du lot. |
| 4 · Profils d’arène | P1 ; présentation existante | Présentations normale, réduite et statique réceptionnées (§17), avec recette de la liaison en profil statique (§18). Les activités visuelles ne créent pas de dégâts implicites. |
| 5 · Boss et Boss Rush | P1 ; six rencontres existantes et fiche I par extension | Préserver Boss Battle ; vérifier la succession, les ressources, les objectifs et la reprise du Rush. Pour chaque nouveau boss DS1, DS2 ou autre œuvre : source, contre-jeu, victoire/échec/reprise et fin compatibles. |
| 6 · Connexion représentative | P1 ; première liaison livrée | Quai → hangar reçu : déclenchement défendable, arrivée contrôlable, limite par manche, KO/temps prioritaires et reproduction de replay/checkpoints. Les futures liaisons conservent ces obligations. |
| 7 · Extensions | P2 ; périmètre décidé | Fiche de mode, coût de contenu et recette complète avant annonce de disponibilité. |

Les essais de réception prioritaires sont : changements de côté ; miroirs et costumes ; attaques simultanées ; K.-O. et temps écoulé ; ressources entre manches ; coin, projectiles et marqueurs ; fin déclenchée ou passée ; reprise de route et de tournoi ; sortie vers la campagne ; perte de focus ; reconnexion et replay de version compatible. Les nouveaux boss et transitions ajoutent leurs scénarios particuliers.

Le dossier [qa du mode](../../modes/echos-de-la-greve/qa/) contient les scénarios de combat, boss, réseau, son, ambiances et galerie. Le lot univers conserve ses preuves dans le [dossier de production du 25 novembre](production/20261125-universe/). Le [journal HTTP](production/20261125-universe/http-verification.log) porte sur un serveur local réel et les fichiers servis. Le [rapport Boss Rush](production/20261125-universe/boss-rush-verification.json) exécute le moteur et l’interface réels dans un hôte à DOM/Canvas simulés. Les [contrôles d’arène](production/20261125-universe/ARENAS.md) comprennent aussi le rendu du vrai moteur avec `@napi-rs/canvas`, documenté par ses [captures et empreintes](production/20261125-universe/stage-renders/validation.json). Ces rendus ne constituent pas une session de navigateur. L’[inspection indépendante des PNG](production/20261125-universe/review/REVUE_VISUELLE.md) reste une preuve visuelle distincte. Pour tout lot, enregistrer résultat, date et version ; cette mise à jour documentaire n’ajoute pas à elle seule une validation du gameplay.

**Définition de terminé :** une fiche est complète pour son périmètre et ses inconnues sont compatibles avec le niveau annoncé ; un sprite a passé les contrôles visuels et techniques de son périmètre ; un combattant réagit et se joue dans les modes annoncés ; une arène possède les configurations promises ; une route se termine et reprend ; un boss dispose de ses réponses et de sa reprise ; un mode s’ouvre, se joue, produit un résultat et se quitte correctement. Aucun de ces états n’est remplacé par le seul comptage de fichiers.

**Instruction d’application au projet.** Pour poursuivre Échos de la Grève, lire cette bible, [UNIVERS_DS.md](UNIVERS_DS.md), [REGISTRE_PRODUCTION.md](REGISTRE_PRODUCTION.md) et le guide associé ; identifier le moteur et la version concernés ; préserver les huit kits existants tout en couvrant l’ensemble de l’univers Death Stranding. Séparer les versions DS1/Director’s Cut, DS2 et celles des adaptations ; garder le statut annoncé des œuvres à venir. Relier chaque ajout à EDG-Gxx et à sa fiche ; distinguer source, adaptation et création ; conserver les écarts non résolus ; produire dans la phase demandée. Pour le lot actuel, livrer une image fixe par asset ou plan prévu et aucune nouvelle animation. Vérifier les fonctions annoncées, puis mettre à jour les statuts, les preuves et les comptes par unité, sans compter une fusion comme une génération.

### 12.12. Sources associées et vocabulaire

Le chapitre 11 et [UNIVERS_DS.md](UNIVERS_DS.md) forment le référentiel des sources officielles, avec œuvre, version, date et niveau de preuve. Les inspirations **S1–S5** du guide restent consultables dans sa section 29 : séparation histoire individuelle / aventure globale, coopération éventuelle, campagne et défis distincts, interactions adaptées aux personnages. Elles n’imposent ni avatar RPG, ni coopération, ni finalités empruntées à une autre licence. Leur date de consultation du 25 novembre 2026 est celle déclarée par le guide ; cette intégration ne prétend pas avoir revérifié les cinq pages.

Trois références primaires du chapitre 11 ont été consultées pour le rapprochement du 25 novembre 2026 :

- [Kojima Productions · Conseils pour la région orientale](https://www.kojimaproductions.jp/en/DSTips) : lien en parade, cargaison utilisée en contact ou lancée, détection du fret et possibilités d’éviter une confrontation. Ces gestes étayent les thèmes de Sam et du MULE ; leurs règles de duel restent des adaptations.
- [Kojima Productions · Guide du Director’s Cut](https://www.kojimaproductions.jp/en/death-stranding-directors-cut-beginners-guide) : gestion du chargement et accès au stand de tir depuis des terminaux. Le simulateur d’Échos et les rencontres d’empreintes demeurent une création du projet.
- [PlayStation · Nouveautés du Director’s Cut](https://www.playstation.com/fr-fr/editorial/how-death-stranding-directors-cut-expands-kojimas-sci-fi-epic/) : exercices au stand de tir, gestes supplémentaires et possibilité de rejouer les combats de boss. Cette dernière fonction inspire les rencontres rejouables ; le règlement du Boss Rush d’Échos demeure une création propre au projet.

Pour la traçabilité technique, le relevé initial reposait sur content.js, assets.js, fight.js, app.js, tournament.js, netplay.js, netplay-server.cjs et duel-originel/interface.js au commit ba4431587f86. Les rapports des §13–15 documentent les lots ultérieurs ; les fichiers et rapports du §16 documentent le lot univers, dont boss.js ; le §17 conserve le complément reçu, et le §18 suit le lot domaines. Les liens relatifs donnent les fichiers de travail ; chaque rapport daté fixe la portée de son observation. Le tableau du duel (§12.3) conserve les écarts de conception non résolus ; les règles Boss sont suivies séparément.

**Vocabulaire appliqué :** un lieu peut avoir plusieurs configurations ; une scène peut demander plusieurs plans ; une route est une histoire individuelle ; une transition de stage se déroule à l’intérieur d’un affrontement ; un objet de kit appartient au combattant ; un danger de décor possède une règle de gameplay ; une finalité conclut un match déjà décidé ; une cible de conception n’est pas une fonction livrée ; une fidélité 1:1 ne désigne pas une image carrée.

## 13. Premier lot des poses et effets — 24 novembre 2026

Sam, Fragile, Higgs, Cliff, le MULE, Die-Hardman et Heartman ont reçu dans le premier lot cinq PNG individuels supplémentaires : garde, accroupissement, montée, sommet et descente du saut. Les cinq poses de Mama étaient déjà présentes. Les nouvelles sources sont natives et transparentes ; leurs crops, proportions et ancres sont mesurés dans `asset-geometry-20261124.js`, sans modification des pixels. Le moteur conserve les poses historiques comme repli pendant le chargement et respecte les poses d’un costume optionnel lorsqu’elles existent.

Sept effets déjà prévus dans la simulation disposent d’une image dédiée : bola de Sam, mains de goudron de Higgs, trait de Cliff, trait ascendant du rappel, portique de Die-Hardman, impulsion et mémoire de Heartman. Les effets ancrés au sol sont dimensionnés à la hauteur de frappe existante. Les sources sont affichées sans étirement ; les règles de combat et les checkpoints de simulation restent indépendants du chargement des images.

Ce premier lot porte sur **42 nouvelles images**. Les **55 couches des onze configurations d’arène** étaient complètes et ont été contrôlées à nouveau. Le catalogue déclarait alors **210 fichiers d’image**. La suite ci-dessous remplace les dessins principaux de Mama et de Die-Hardman. Les planches historiques de marche/impact et l’inversion par miroir restent des points distincts à revoir pour une certification canonique 1:1. La continuité avec les tenues locales ne constitue pas cette certification.

[Rapport du lot, validation et limites](production/20261124/REPRISE_ASSETS_20261124.md) · [Galerie des éléments séparés et rendus](production/20261124/index.html) · [Inventaire natif et empreintes](../../art/sources/echos-de-la-greve/production-20261124/production-assets.json).

## 14. Suite intégrée : personnages, décors, boss et Archives — 24 novembre 2026

La reprise réunit **113 PNG natifs actifs**, soit les 42 chemins du premier lot et 71 chemins supplémentaires. Les dernières versions remplacent les anciennes aux mêmes chemins sans être comptées deux fois. On compte 72 images de combattants/tenues, trois portraits de soutien, quatorze états de boss/véhicule, onze projectiles/effets, douze images pour Port Knot et l’incinérateur, et une scène de rivalité de Die-Hardman.

Le catalogue principal contient **225 chemins d’image uniques** ; les boss et leurs effets ajoutent **18 chemins**, pour un total vérifié de **243**. La production du 24 novembre complète ces catalogues, qui conservent aussi des images historiques.

Mama Viaduc utilise désormais neuf poses humaines et un portrait, en conservant sa tenue de maintenance du fan-game. Les deux moteurs choisissent la géométrie de l’image réellement disponible, y compris en cas de chargement partiel. Le jeu utilise **67 crops natifs de combattants**, dont neuf propres à cette tenue. La scène de rivalité de Die-Hardman reprend sa composition avec des matériaux détaillés.

**Boss Battle** propose six rencontres : Catcher léonin, Catcher aquatique, baleine, géant, camion MULE et convoi. Les quatre Échoués ont des annonces d’attaque et une deuxième phase. Les missions MULE comportent l’immobilisation des véhicules et la livraison des colis ; le convoi enchaîne deux vagues. Les huit combattants sont disponibles. Résultats et reprise utilisent `echos.boss.v1`. Les règles figurent dans la [fiche Boss Battle](production/20261124-suite/BOSS_BATTLE_20261124.md).

Les **Archives de Bridges** présentaient Deadman, Amelie et Bridget comme dossiers illustrés dans le lot du 24 novembre. Lockne les rejoint dans la reprise du 25 novembre décrite ci-dessous. Le roster de duel compte huit combattants.

La recette fraîche du vrai moteur en mémoire couvre dix cas personnage/tenue × côté, seize cas sur les nouveaux décors et **72 checkpoints de duel inchangés**. La recette Boss passe **18 sections**, dont six victoires par commandes et les livraisons. Une revue indépendante ajoute 72 cas de résolution entre tenue et source de base. Ces contrôles ne remplacent pas le rendu natif et les interactions dans un navigateur, encore indisponibles pendant cette reprise.

Les **onze images de Higgs** ont reçu le masque crânien d’or d’une capture DS1 inspectée. La comparaison **1:1 reste ouverte** pour les autres détails non documentés, les vues gauche asymétriques et les adaptations latérales. Le portrait de Lockne était encore bloqué le 24 novembre faute de référence inspectable récupérée ; le lot suivant résout ce manque. Les manifestes distinguent références officielles, captures de joueurs et choix du fan-game.

[État détaillé et points ouverts](production/20261124-suite/SUITE_MANQUANTS_20261124.md) · [Galerie unifiée des 113 images](production/20261124-suite/index.html) · [Inventaire actif](production/20261124-suite/active-native-images.json) · [Recette d’intégration](production/20261124-suite/integration-validation.json).

## 15. Silhouettes et horizons — 25 novembre 2026

**Instantané du premier lot statique du 25 novembre.** Son manifeste et ses quinze fichiers demeurent conservés comme état de production daté ; le lot suivant du §16 avait porté le catalogue à 29 images. Les comptes ultérieurs sont séparés aux §17–18.

Ce premier lot ouvre **Silhouettes et horizons** avec **quinze nouveaux PNG statiques** : cinq images de personnages, trois ennemis, quatre grenades et trois panoramas. Les filtres par catégorie, le choix d’un fond sombre ou neutre, l’agrandissement et le téléchargement donnent accès à chaque source native. Chaque fichier contient un seul sujet et une seule image ; aucune animation n’est ajoutée dans ce lot.

Lockne reçoit un portrait après sa réunion avec Mama et une silhouette séparée. Le portrait complète les Archives ; son œil droit anatomique est bleu, à gauche de l’image, et il ne doit pas être retourné. Deadman apparaît en costume sombre, Amelie dans sa robe rouge mi-longue avec escarpins, et Bridget allongée dans son lit médical. Le Gazer, un soldat squelettique à casque à filet et un MULE gris de la région Est complètent les ennemis statiques. Les objets isolés comprennent la grenade hématique niveau 1 et les capsules EX n° 0, 1 et 2.

Les nouveaux horizons de ce premier lot sont **les ruines de South Knot**, **la ferme sous la pluie temporelle** et **l’approche de Mountain Knot**. Ce dernier montre une vallée montagneuse, sans ville visible. **À la clôture de ce lot statique**, ces trois panoramas étaient consultables dans le catalogue sans leurs cinq plans ni raccordement jouable ; le socle restait alors à treize configurations et soixante-cinq couches. Le lot univers du §16 réalise leur passage en arènes et ajoute une quatrième arène autour du DHV Magellan. Ce constat historique du premier lot ne décrit donc pas le catalogue jouable courant.

Les quinze PNG natifs, totalisant 24 554 809 octets, sont conservés sans édition de pixels après génération. Leurs dimensions réelles, empreintes, prompts, vingt références utilisées et limites de reconstruction figurent dans le manifeste. Les douze détourés ont été examinés sur deux fonds ; les trois panoramas sont opaques. Le comportement du catalogue a été contrôlé sur son JavaScript réel dans un DOM simulé. Aucun rendu navigateur natif ni validation globale 1:1 n’est revendiqué. Le soldat Homo Demens reste différé faute de référence colorée assez claire ; les détails de costume masqués dans les captures et les vues gauche asymétriques restent à documenter.

[Catalogue](../../modes/echos-de-la-greve/static-assets.html) · [Rapport du lot](production/20261125-static/LOT_STATIQUE_20261125.md) · [Manifeste natif et sources](../../art/sources/echos-de-la-greve/production-20261125-static/manifest.json) · [Revue visuelle indépendante](production/20261125-static/REVUE_VISUELLE_STATIQUES_20261125.md) · [Vérification du catalogue](production/20261125-static/GALERIE_VERIFICATION_20261125.md).


## 16. Univers complet, Boss Rush et nouvelles arènes — 25 novembre 2026

**34 nouveaux PNG livrés, quatre arènes intégrées et Boss Rush disponible.** Le périmètre documentaire couvre désormais tout l’univers Death Stranding. [UNIVERS_DS.md](UNIVERS_DS.md) enregistre jeux, éditions, romans, adaptations et œuvres annoncées, leurs sources et leurs continuités. Les huit combattants existants restent disponibles et conservent leurs identifiants ; ils ne plafonnent pas le catalogue ni les extensions futures. Les variantes DS2 de Sam, Fragile et Higgs ne remplacent pas leurs versions DS1 dans le moteur.

### 16.1. Production fixe et comptes séparés

Le lot livre **quatorze images fixes DS2** : sept portraits (Higgs, Rainy, Tomorrow, Tarman, Fragile, Sam et Neil), trois sujets entiers (Dollman, chat chiral et Red Samurai), une guitare autonome de Higgs, puis trois panoramas (Magellan, Plate Gate et tempête de sable). Chaque fichier porte un sujet ou un plan exploitable. Un portrait, un compagnon ou une silhouette d’ennemi ne devient pas un combattant jouable par sa seule présence dans la galerie.

Il livre aussi **vingt plans**, soit cinq images indépendantes pour chacune de quatre arènes :

| ID d’arène | Lieu et œuvre de référence | Dépendance de production |
|---|---|---|
| `south-knot-ruins` | Ruines de South Knot · DS1 | Panorama du premier lot statique ; cinq plans et raccordement du lot univers. |
| `timefall-farm` | Ferme sous la pluie temporelle · DS1 | Panorama du premier lot statique ; cinq plans et raccordement du lot univers. |
| `mountain-knot-approach` | Approche de Mountain Knot · DS1 | Vallée montagneuse distincte du Col de Mountain Knot déjà jouable ; cinq plans et raccordement du lot univers. |
| `magellan-ds2` | DHV Magellan, berge au couchant · DS2 | Nouveau panorama et cinq plans ; recomposition latérale de la source officielle. |

Plate Gate et la tempête de sable restent des panoramas de catalogue dans ce lot ; aucune arène jouable supplémentaire n’est déduite de leur image.

| Unité suivie | Socle avant ce lot | Ajout livré | Total vérifié pour ce lot |
|---|---:|---:|---:|
| Images natives actives des lots récents | 128 = 113 du 24 novembre + 15 du premier lot statique du 25 | 34 = 14 images DS2 + 20 plans | 162 |
| Lieux de combat | 12 | 4 | 16 |
| Configurations d’arène | 13, avec la variante sèche du camp MULE | 4 | 17 |
| Couches d’arène | 65 | 20 | 85 |
| Modes d’accueil | 7 | Boss Rush | 8 |
| Rencontres Boss | 6 | Réutilisées par le Rush | 6 |
| Combattants jouables | 8 | Aucun nouveau kit annoncé par ce lot d’images | 8, sans plafond pour les futurs lots |
| Nouvelles animations générées dans ce lot | — | 0 | 0 |
| Images du catalogue statique | 15 DS1 / Director’s Cut | 14 DS2 | 29 |
| Dossiers des Archives | 4 | 8 DS2 | 12 |

Ces comptes sont établis par l’[inventaire du catalogue](production/20261125-universe/catalogue-inventory.json) et l’[inventaire des images natives actives](production/20261125-universe/active-native-images.json). Les **34 nouveaux PNG occupent 53 577 560 octets**. La production a comporté 35 sorties de génération : le premier plan lointain du Magellan a été remplacé par une reprise, sans créer un 35e fichier actif. Les **128 PNG antérieurs sont préservés**, avec contrôle des empreintes Git / SHA ; leur fusion ne constitue pas une nouvelle génération. Le projet référence **292 chemins d’image uniques**, tous présents ; les **162 PNG récents actifs** sont un sous-ensemble de ce catalogue global.

### 16.2. Boss Rush et progression

Boss Rush réutilise les six rencontres existantes, avec 120 PV initiaux, +20 PV après une victoire jusqu’à 120, puis énergie et garde à 100 au début de la rencontre suivante. Une défaite arrête la série. Sauvegarde, reprise et records sont séparés de Boss Battle, des défis et des routes narratives. Le [règlement détaillé](production/20261125-universe/BOSS_RUSH.md) fait référence ; la Survie garde ses sept adversaires, son plafond de 100 PV et sa récupération de 15 PV.

### 16.3. Sources, fidélité et preuve de réception

Les versions, références et limites d’observation sont consignées dans le [registre de l’univers](UNIVERS_DS.md). Les détails hors cadre d’un portrait restent des adaptations à vérifier. La guitare s’appuie sur des captures officielles et une référence de statue sous licence, identifiées séparément ; les jambes du Red Samurai ne disposent pas encore d’une référence officielle complète inspectée. La production d’une image n’établit pas une fidélité 1:1 globale.

Le [rapport du lot univers](production/20261125-universe/LOT_UNIVERS_20261125.md) et son [manifeste de production](../../art/sources/echos-de-la-greve/production-20261125-universe/manifest.json) réunissent les fichiers livrés, dimensions natives, empreintes, prompts, références et contrôles. Les PNG sont copiés dans leur format natif ; les planches et captures de revue sont des dérivés séparés. Les images, les fonctions jouables, la revue visuelle et la publication conservent leurs statuts propres.

La vérification logicielle comprend les scénarios de Boss Rush et de galerie en **DOM/Canvas simulés**, la distribution des ressources par **HTTP réel**, ainsi que le rendu du moteur d’arène avec **Canvas natif (`@napi-rs/canvas`)**. Le [rapport d’arènes](production/20261125-universe/ARENAS.md), le [rapport de simulation et d’interface](production/20261125-universe/stages-verification.json) et les [captures natives](production/20261125-universe/stage-renders/validation.json) détaillent les cas et les empreintes réellement contrôlés. La reprise du plan lointain du Magellan rend son survol plus lisible et fait l’objet d’une relance ciblée des vérifications et de la [revue visuelle](production/20261125-universe/review/REVUE_VISUELLE.md). Ces preuves ne sont pas une session de navigateur natif, une validation de toutes les compositions ni une certification canonique globale.

Le [contrôle de galerie](production/20261125-universe/static-gallery-verification.json) porte sur 29 images et leurs métadonnées d’œuvre/version. Les [mesures des vingt plans](production/20261125-universe/stage-source-measurements.json) documentent dimensions et transparence ; l’[inventaire global](production/20261125-universe/catalogue-inventory.json) confirme les 292 chemins présents. Les rapports historiques des §13–15 conservent les comptes et limites propres à leur date.

[Catalogue des images fixes](../../modes/echos-de-la-greve/static-assets.html) · [Registre de l’univers](UNIVERS_DS.md) · [Règles et portée des essais Boss Rush](production/20261125-universe/BOSS_RUSH.md) · [Rapport de simulation Boss Rush](production/20261125-universe/boss-rush-verification.json) · [Journal HTTP](production/20261125-universe/http-verification.log) · [Dossier QA](../../modes/echos-de-la-greve/qa/).


## 17. Complément de production, campagne et plans narratifs — 25 novembre 2026

**Instantané du complément : 53 PNG livrés et intégrés ; recettes locales reçues.** Les comptes ci-dessous décrivent la livraison du complément ; le lot domaines suivant est séparé au §18. La publication distante conserve ses références dans le rapport daté. Ce chapitre continue le lot univers du §16. Les rapports antérieurs restent des photographies datées de leurs propres livraisons. Les nouvelles lignes du [registre de production](REGISTRE_PRODUCTION.md) distinguent ce qui est référencé, conçu, produit, intégré et validé ; aucun total de ce chapitre n’annonce une fusion ou une publication distante.

### 17.1. Lot retenu et comptes de production

| Ensemble retenu | Quantité du complément | État constaté |
|---|---|---|
| Bases fixes supplémentaires | 13 PNG : 4 nouveaux portraits, 3 variantes de tenue, 3 véhicules et 3 équipements/modules | Fichiers natifs livrés, décodés et intégrés au catalogue ; quatre portraits ajoutés aux Archives, sans animation nouvelle. |
| Plans des huit histoires | 24 PNG : 8 `intro_second`, 8 `intro_insert`, 8 `ending_final` | Livrés et raccordés aux 24 originaux ; 24 séquences / 48 plans vérifiés, fichiers servis par HTTP réel. |
| Panorama et arènes | 1 panorama de dunes + 15 couches pour 3 arènes | Livrés ; mesures et 24 rendus avec Canvas natif vérifiés, sol des dunes repris et revu. |
| Total d’images nouvelles retenues | **53 PNG sélectionnés et livrés** | 55 sorties natives obtenues ; deux sorties remplacées et une tentative sans image documentées séparément. |
| Campagne Les Nœuds rompus | 6 chapitres, 14 interludes | Intégrée ; parcours complet gagné avec les moteurs réels dans un DOM/Canvas simulés ; illustrations réemployées. |
| Profil de décor statique | Duel, Boss, salon privé | Intégré ; parité de simulation, gel des pixels, persistance et reconstruction vérifiés dans les hôtes documentés. |

Les treize bases sont **Lucy, Doctor, The President, Heartman DS2 ; Tomorrow en robe blanche, Sam aux cheveux gris du visuel promotionnel, Fragile dans sa première tenue promotionnelle ; Tri-Cruiser, camion DS2, DHV Magellan isolé ; coffin board, capsule de fret déployée et Maser Handgun**. Le monorail possède une référence documentaire, mais n’est pas retenu dans ces treize productions. Le nouveau panorama de dunes est compté avec les décors, pas une seconde fois parmi les bases.

Les trois arènes portent le catalogue à **19 lieux / 20 configurations / 100 couches**, selon les [mesures et essais locaux](production/20261125-completion/RUNTIME.md). Les huit combattants existants restent les mêmes. La campagne est intégrée comme neuvième mode local et possède sa [preuve de parcours logique](production/20261125-completion/campaign-qa.json). Les Archives comptent désormais **16 portraits**, dont les quatre nouveaux dossiers Lucy, Doctor, The President et Heartman DS2. La galerie compte **43 images fixes : 15 DS1/DC et 28 DS2**, dont les treize nouvelles bases et le panorama de dunes. Les [contrôles de galerie](production/20261125-completion/static-gallery-verification.json) portent sur les fichiers et le contrôleur exécuté dans un DOM simulé ; ils ne valent pas une validation de navigateur. L’[inventaire consolidé](production/20261125-completion/catalogue-inventory.json) relève **345 chemins d’image uniques, tous présents**. Les **215 PNG natifs récents actifs** comprennent 162 fichiers antérieurs inchangés et les 53 nouveaux, qui occupent **94 766 168 octets**. La [vérification des natifs](production/20261125-completion/native-assets-verification.json) atteste le décodage et l’identité des originaux et copies ; le [bilan du complément](production/20261125-completion/LOT_COMPLETION_20261125.md) conserve leurs limites.

### 17.2. Sources et versions des nouvelles bases

Le [manifeste de recherche](production/20261125-completion/reference-research.json) conserve les URL des pages et images, les crédits, le cadrage, les dimensions, les SHA et les zones cachées. Les nouvelles sources sont associées dans [UNIVERS_DS.md](UNIVERS_DS.md#10-références-du-complément-et-rôles-à-concevoir).

Les quatre nouveaux personnages sont documentés par les images du dossier officiel de distribution DS2. Ce dossier est antérieur à la sortie : ses identifications et détails visibles sont exploités, pas ses spéculations narratives de l’époque. Les références cadrées en buste donnent des **portraits**, pas une certification de costume en pied. Le Heartman en costume bleu de DS2 reste distinct du kit DS1 ; Sam aux cheveux gris et Fragile première tenue restent marqués comme versions promotionnelles anciennes.

Le Tri-Cruiser est nommé dans les publications consultées. La capture du camion est légendée **truck** : le nom exact « Pickup Off-Roader » n’est pas établi par les sources primaires de ce lot. La capsule de fret montre le module lancé et ses ailes, pas toute la catapulte au sol. Le Maser Handgun est identifiable dans la roue d’armes d’une courte vidéo officielle ; sa vignette limite la vérification des petits détails. Les images de *Share of the Week* restent créditées à leurs joueurs et à leur publication PlayStation. Isoler un véhicule d’une scène ou reconstituer une partie masquée relève de l’adaptation du projet.

### 17.3. Plans supplémentaires des huit histoires

Les **24 scènes actuelles sont déjà illustrées**. Le complément livre trois plans par route sans réécrire leurs textes : un second moment de l’introduction, un insert d’accessoire sans texte lisible et le dernier moment exact de l’ending. Les scènes de rivalité restent inchangées.

| Partie | Assemblage retenu | Critère narratif |
|---|---|---|
| Introduction | Image originale → `intro_second` → `intro_insert` | Le second plan montre un autre moment du même texte ; l’insert précise l’objet, sans ajouter de révélation. |
| Rivalité | Image originale | Même texte, même rival, même lieu et même progression. |
| Ending | Image originale → `ending_final` | Le dernier plan réalise le geste final écrit, sans inventer le destinataire, la voix ou l’identité laissés hors champ. |

Les [24 briefs et relevés de livraison](production/20261125-completion/story-completion-briefs.json) portent les textes copiés du catalogue, les tenues DS1, les lieux, actions, compositions, légendes françaises et fichiers livrés sous `assets/story-completion-20261125/`. Leur SHA de source désigne le `content.js` réceptionné avec ce complément ; les 24 textes, titres, finalités, légendes et chemins avaient été comparés aux données chargées à cette date. Le lot domaines conserve ces textes et les revérifie par sa recette de non-régression, sans réécrire l’empreinte de ce rapport historique. Les huit titres d’ending et les huit noms de finalité restent mappés séparément dans le [registre](REGISTRE_PRODUCTION.md#6-routes-plans-supplémentaires-et-campagne-transversale). Le masque crânien doré de Higgs suit le portrait de combattant corrigé ; son ancienne image d’introduction sert de référence de décor. La production n’ajoute ni autre fin de route, ni nouveau pouvoir, ni animation. Le carrousel manuel conserve la sauvegarde de scène existante ; la recette vérifie le retour galerie, la progression et le maintien du focus et du défilement.

### 17.4. Campagne transversale Les Nœuds rompus

Une reconstitution ferme six liaisons de son propre réseau interne. Sam, Fragile, Mama, Heartman et Die-Hardman cherchent à rouvrir ces échanges en conservant la singularité des empreintes. Les points de vue et rencontres alternent ; le texte précise que les souvenirs ne sont ni des personnes ressuscitées ni des événements officiels réécrits. [Texte et contrat de campagne](../../modes/echos-de-la-greve/campaign.js).

| Chapitre / ID | Point de vue et rencontre | Lieu |
|---|---|---|
| Balise sans adresse · `balise-sans-adresse` | Sam / MULE | Camp MULE |
| Le détour d’Higgs · `detour-higgs` | Fragile / Higgs | Ruines de South Knot |
| L’ordre fermé · `ordre-ferme` | Mama / Die-Hardman | Usine en ruines |
| Ce qui répond encore · `memoire-ouverte` | Heartman / Cliff | Champ de bataille |
| Le convoi des retours · `convoi-des-retours` | Die-Hardman / convoi MULE, deux vagues et deux colis | Ferme sous la pluie temporelle |
| Le dernier lien · `dernier-lien` | Sam / baleine de goudron | Grève |

Le prologue, les six scènes d’avant et six d’après, puis **Une place pour chaque voix** forment quatorze interludes. Les illustrations sont réemployées : panoramas et portraits du socle DS1/DC. Quatre duels en deux manches gagnantes précèdent deux grandes rencontres aux règles Boss. La difficulté est fixée pour la partie ; les ressources reviennent à leur valeur d’entrée à chaque chapitre, sans appliquer les soins du Boss Rush ni ceux de Survie.

La sauvegarde `echos.campaign.v1` reste indépendante des routes, de Boss Battle et de Boss Rush. La recette vérifie début, victoire, défaite, interruption, reprise, validation du bon résultat de chapitre, galerie dédiée et conclusion dans le DOM/Canvas simulé documenté. Cette campagne demeure distincte de **La Ligne silencieuse**, des huit histoires individuelles et des finalités post-K.-O.

### 17.5. Trois arènes DS2 et profil statique

| Arène | Source et adaptation | Images livrées |
|---|---|---|
| `plate-gate-ds2` · Plate Gate, colonnes suspendues | Paysage officiel déjà associé au panorama du lot univers ; piste horizontale du duel créée pour le projet. | Ciel, lointain, intermédiaire, sol et premier plan. |
| `sandstorm-ds2` · Lisière urbaine, tempête de sable | Rue et front de sable de la référence PlayStation ; pas de dégâts de météo déduits du panorama. | Cinq couches avec centre et repères de combat lisibles. |
| `dunes-ds2` · Dunes sous le vent | Référence Kojima 2024, soleil bas et reliefs de sable ; nouveau panorama latéral. | Un panorama et cinq couches, dont une bande jouable horizontale dégagée. |

Le profil **Décor statique** se distingue d’**Effets réduits**. Il immobilise la présentation du fond à l’instant du choix ; la simulation, les combattants, projectiles, marqueurs et annonces utiles continuent. La préférence `echos.v1.staticScenery` doit être conservée au retour de menu et dans les parcours concernés. La recette compare les résultats des mêmes entrées avec le décor animé, réduit et statique. Les rendus natifs du Canvas et les essais de logique restent des preuves distinctes de l’utilisation d’un navigateur.

### 17.6. Gameplay DS2 à concevoir après les bases

Le [registre multidomaine](REGISTRE_PRODUCTION.md) garde le chemin **source → rôle → kit à concevoir → production → intégration → recette**. Les pistes ci-dessous ne sont pas des fonctions livrées ni un engagement de rendre tous les personnages jouables.

| Source / sujet | Rôle à étudier | Fiche et dépendances avant gameplay |
|---|---|---|
| Higgs DS2 et guitare documentée | Variante de kit ou grande rencontre, à décider | Fiches B/C/I séparées de Higgs DS1 ; mouvements attestés, signaux, portée, contre-jeu et référence de corps complet. |
| Neil et Red Samurai | Personnage/rencontre ou ennemi d’élite | Identité et version, apparence complète, comportements sourcés ; un portrait et une base fixe ne valent pas IA. |
| Dollman, Tomorrow, Rainy, Tarman, Doctor, Lucy, President | Soutien, compagnon, PNJ ou présence narrative | Fonction propre au mode à décider ; aucun rôle de combat imposé par une image. |
| Sam, Fragile et Heartman DS2 | Variantes documentaires ; kit distinct seulement si justifié | Distinguer identité, tenue, période et capacités ; conserver les kits DS1 existants. |
| Tri-Cruiser, camion, Magellan, coffin board, capsule | Véhicule, équipement, décor ou objectif | Volume, échelle, état piloté/non piloté, commandes et sérialisation ; pas de pilotage livré par l’image. |
| Maser Handgun | Arme / effet électrique adapté | Fiche C : commande, charge, portée, cible, coût, interruption et contre-jeu ; géométrie source limitée à la vue inspectée. |
| Watcher, Armed Survivalists, boomerang sanguin, grenade holographique | Ennemi, arme ou projection | Existence textuelle attestée ; référence visuelle identifiée encore manquante. Ne pas produire une fidélité présentée comme acquise. |

### 17.7. Réception du complément

**Galerie et Archives : contrôles de fichiers et de contrôleur reçus.** Les [15 contrôles du catalogue](production/20261125-completion/static-gallery-verification.json) vérifient 43 images, 16 portraits d’Archives, les filtres d’œuvre/catégorie, les dimensions natives, les téléchargements et les liens de version. Les [14 nouveaux PNG du catalogue](production/20261125-completion/gallery-png-decode.json) sont intégralement décodables. Les images natives sont conservées ; un PNG fixe ne rend pas son sujet jouable. Le [rapport Galerie et HTTP](production/20261125-completion/GALERIE_ET_HTTP.md) distingue cette réception du contrôle HTTP complet, exécuté après livraison des 24 plans narratifs.

**Arènes et décor statique : recette reçue.** Le [rapport des moteurs et décors](production/20261125-completion/RUNTIME.md) associe les [24 cas de rendu natif](production/20261125-completion/stage-renders/validation.json), les [comparaisons statique/animé](production/20261125-completion/static-scenery-verification.json), les [sélections et lancements d’arène](production/20261125-completion/stages-verification.json), les [rencontres Boss](production/20261125-completion/boss-verification.json) et les [vingt profils sonores](production/20261125-completion/ambiances-verification.log). La vérification distingue Canvas natif, DOM simulé et graphe Web Audio simulé. Le sol définitif des dunes utilise le support 435/941 ; les cadrages gauche et droite ont été revus.

**Campagne et carrousel : recette logique reçue.** Le [rapport de campagne](production/20261125-completion/CAMPAGNE_NOEUDS_ROMPUS.md) et sa [preuve JSON](production/20261125-completion/campaign-qa.json) documentent six rencontres gagnées en difficulté Débutant avec les vrais moteurs et de vraies commandes, dans un hôte à DOM/Canvas simulés. Les sauvegardes extérieures sont préservées ; les textes et ordres des huit routes restent identiques. Les 24 séquences / 48 emplacements sont parcourus. La recette finale `--require-assets` est passée : `logicPassed`, `assetsComplete`, `assetsRequired` et `passed` sont vrais ; les 55 chemins requis sont présents, sans manquant. Aucun navigateur ou décodage des pixels n’est revendiqué par cette preuve.

Le lot conserve les images natives et les métadonnées de génération, ainsi que les références avec leur provenance qualifiée. La réception distingue 13 bases, 24 plans et 16 images de décor, leur utilisation dans les écrans annoncés et l’absence de chemins manquants. Les quatre nouveaux portraits des Archives relient chaque sujet à sa version et à sa référence. Les huit finalités actuelles restent disponibles sous leurs noms, sans substitution par les titres d’ending.

**Revue narrative : 24 versions actives consolidées.** La [revue finale des scènes](production/20261125-completion/REVUE_SCENES_LOT3.md) associe chaque SHA courant à la revue applicable, clôt la reprise du parapluie de Fragile et conserve les réserves secondaires des deux premiers lots. Aucun point central ne demande encore une reprise ciblée. Cette conclusion ne certifie ni les détails non lisibles ni une fidélité 1:1.

**Distribution HTTP : recette reçue.** Le [journal HTTP](production/20261125-completion/http-verification.log) confirme 43 images de galerie, 42 chemins des sept arènes ajoutées sur les deux lots et 48 plans narratifs. Les contenus et types MIME correspondent aux fichiers réels, avec et sans préfixe de chemin. Les modules de campagne, liens documentaires, empreintes et exclusions sont également vérifiés.

Le [bilan du lot](production/20261125-completion/LOT_COMPLETION_20261125.md) et le [manifeste de génération](../../art/sources/echos-de-la-greve/production-20261125-completion/manifest.json) consignent les images sélectionnées, sorties remplacées et limites. Les **53 assets retenus** proviennent de **55 sorties d’image natives** : le premier sol des dunes et le premier plan final de Fragile ont été remplacés. Une tentative de `fragile-intro-second` n’a pas produit d’image, puis a été relancée avec succès ; elle ne constitue ni une sortie native ni un asset supplémentaire. Aucune animation nouvelle n’a été générée.

Les preuves nomment leur méthode : **DOM simulé**, **moteur réel**, **Canvas natif**, **graphe audio simulé** ou **HTTP réel**. Elles ne constituent pas une session de navigateur ou une validation multijoueur sur Internet. La publication sera consignée après l’action effective.


<a id="lot-domaines-20261125"></a>
## 18. Actions, relations, commandes et première liaison — 25 novembre 2026

**Périmètre : lot domaines, base `2250b7c1b54b445637e0c9354133e6fecbc325de`, branche `codex/echos-domains-20261125`.** Les réalisations ci-dessous sont présentes localement, avec des preuves adaptées à chaque domaine. La publication et la fusion ne sont pas déduites de ces fichiers. Le guide intégral reste inchangé ; les trente rubriques continuent d’organiser les dépendances.

### 18.1. Actions des huit kits et profils IA

Le [catalogue des actions](ACTIONS_ET_IA.md) couvre les **30 définitions d’attaque du duel** : six communes, vingt-quatre techniques et huit fiches de combattant. Six gestes complémentaires décrivent mouvement, garde et finalité. Les données structurées ([JSON](data/actions-et-ia.json), [module](../../modes/echos-de-la-greve/moves-data.js)) proviennent des constantes de StrandFight, extraites en mémoire sans modifier ses règles. Coûts, dégâts, portées, volumes, types de garde, marqueurs, invulnérabilités, échecs et annulations sont liés à l’action réelle.

Les valeurs S/A/R restent nominales : l’action disparaît à S+A+R+1 et le prochain démarrage sans annulation est possible au pas suivant. Le premier et le dernier contact actif ont un avantage distinct. La [recette des fiches](production/20261125-domains/moves-verification.json) vérifie 30 timings, 640 impacts, 300 cas d’annulation, 34 mesures d’avantage, 207 cas conditionnels et 24 seuils IA. Elle utilise les fonctions réelles avec des états unitaires préparés, sans navigateur. Elle ne remplace pas une matrice d’équilibrage humain.

Les trois profils IA décrivent cadences, distances, ressources et branches réellement employées, sans transformer les probabilités conditionnelles en fréquences globales. Les huit notes de kit rendent visibles les réponses spécialisées et celles qui ne le sont pas. La difficulté du duel n’ajoute aucun multiplicateur de dégâts. Le calcul rapide d’un score IA–IA du tournoi reste indépendant.

Commandes et le dojo présentent ces chiffres sous **Données du duel**. Les rencontres Boss utilisent `boss.js` et n’affichent pas ces données comme les leurs. Le Duel originel reste également distinct. Les renforcées, ultimes et paramètres cibles des §2–4 ne deviennent pas disponibles par cette documentation.

### 18.2. Relations du simulateur

La [matrice des relations](RELATIONS_SIMULATEUR.md) livre **28 paires, 56 échanges orientés et huit miroirs**. Elle conserve les empreintes DS1 / Director’s Cut, qualifie chaque échange comme fiction du simulateur et n’affirme aucune relation canonique nouvelle. [relationships.js](../../modes/echos-de-la-greve/relationships.js) retourne les deux répliques selon l’ordre des combattants ; une identité inconnue ne crée pas de dialogue implicite.

Ces échanges apparaissent seulement avant **Versus et Arcade**, avec **Combattre · passer l’échange**. Histoire et Les Nœuds rompus conservent leurs récits. Les textes, routes, scènes et finalités sont comparés à la base par la recette. Les voix et animations propres à ces nouvelles répliques restent absentes. Le [rapport Actions, relations et IA](production/20261125-domains/ACTIONS_RELATIONS_IA.md) associe livrables, mesures et limites.

### 18.3. Commandes et périphériques

Les [commandes reconfigurables](production/20261125-domains/COMMANDES.md) sont partagées entre l’application et le salon privé. Les profils conservent les affectations distinctes de J1 et J2 ; l’interface présente les boutons du profil actif. Les conflits, restaurations, pertes de focus, relâchements et états de manette sont vérifiés par la [recette du contrôleur et des handlers](production/20261125-domains/commandes-verification.json).

La présence d’une entrée Gamepad API et de contrôles synthétiques ne vaut pas certification d’une manette matérielle. Les limites de navigateur, disposition de clavier et périphérique restent précisées par la fiche. Ces changements n’altèrent pas les IDs d’action du moteur ni les récits existants. Le Duel originel ne charge pas ce contrôleur partagé et conserve ses commandes historiques, sans prise en charge manette annoncée par ce lot.

### 18.4. Quai et hangar : une liaison explicite

La [première fiche H réalisée](production/20261125-domains/TRANSITIONS.md) relie le quai au hangar reconstitué dans `terminal-linked`. Un lourd standard ou une projection non bloqué au sol, dirigé vers une bande de bord, déclenche **36 ticks** de passage au maximum une fois par manche. Les KO et fins de temps ont priorité. Les ressources après le coup et le scellé du colis sont conservés ; objets transitoires et files d’attaque sont effacés. Les commandes tenues restent connues et les deux combattants arrivent face à face, à distance symétrique.

Le quai ordinaire et le hangar indépendant restent sans transition. Le choix lié n’est pas tiré automatiquement par les nouveaux tournois et est exclu du sélecteur Boss. Sa version entre dans les bandes et checkpoints. La recette comprend le replay, la restauration de zone et deux moteurs clients avec commandes retardées ; il ne s’agit pas de deux navigateurs sur Internet. Le profil statique fige la décoration mais montre toujours le changement réel de zone.

Le catalogue atteint **19 lieux, 20 zones graphiques et 22 configurations sélectionnables**. Le hangar porte `zoneOf: terminal` ; la variante liée réutilise les images du quai. Les **105 chemins de couches distincts** forment **110 liaisons de couches**, soit cinq par configuration. Six nouveaux PNG composent le hangar : panorama et cinq couches. Le stand de tir du catalogue reste un panorama fixe non jouable.

### 18.5. Bases fixes, sources et limites

**Quatorze PNG natifs sont livrés** : six images du hangar et huit bases de catalogue, pour 22 323 710 octets. Onze possèdent de la transparence et trois sont opaques. La [vérification des natifs](production/20261125-domains/native-assets-verification.json) confirme les copies et les 215 fichiers antérieurs inchangés : le total récent actif atteint 229 PNG. La galerie compte **52 entrées : 22 DS1/DC, 29 DS2 et une reconstitution du projet** ; les Archives restent à 16 dossiers. Les bases sont le Maser Gun DC, la catapulte DC, le Roadster DC, le Buddy Bot DC, la rampe de saut DC, le pont chiral DC, le panorama du stand de tir DC et un module de monorail DS2 en livrée Yamato. Le [registre des sources et versions](UNIVERS_DS.md#11-références-du-lot-domaines) associe chaque ID à une référence inspectée et à ses parties masquées ou sous-résolues. Le [dossier de recherche](production/20261125-domains/reference-research.json) conserve URLs, observations et empreintes.

Le hangar est une **reconstitution du projet**, sans géographie canonique affirmée. Le monorail Yamato ne certifie pas une autre cabine ou livrée jaune. Le Maser Gun DC reste distinct du Maser Handgun DS2 déjà présent. Ces images ne créent ni véhicule pilotable ni nouvelle attaque. Aucune animation n’est générée dans ce lot.

La mitrailleuse MP DS2 a une référence inspectée mais **aucun fichier livré après deux refus de génération**. Elle reste ouverte, avec l’exosquelette de soutien trop masqué, le flacon de réparation illisible, les variantes de monorail non documentées et les ennemis/outils encore sans identification visuelle suffisante. Le périmètre de tout l’univers n’est pas clos par ce lot.

### 18.6. Réception et suite du registre

Le [bilan du lot domaines](production/20261125-domains/LOT_DOMAINES_20261125.md) associe les livraisons, les comptes et la publication effective lorsqu’elle est consignée. Les [preuves d’actions](production/20261125-domains/moves-verification.json), [de commandes](production/20261125-domains/commandes-verification.json) et [de transitions](production/20261125-domains/transitions-verification.json) qualifient séparément fonctions réelles et hôtes simulés. Les [rendus du hangar](production/20261125-domains/stage-renders/validation.json) et de [la liaison](production/20261125-domains/linked-renders/validation.json) utilisent Canvas natif ; ils ne sont pas des captures de navigateur. Les images de référence ne donnent aucune certification 1:1 des faces invisibles.

La [revue visuelle](production/20261125-domains/REVUE_VISUELLE.md) et le [manifeste de génération](../../art/sources/echos-de-la-greve/production-20261125-domains/manifest.json) associent les 14 fichiers reçus, les 52 entrées de galerie et les essais sans sortie. L’[inventaire consolidé](production/20261125-domains/catalogue-inventory.json) confirme **359 chemins d’image distincts, tous présents**, dont les 14 nouveaux PNG et les 215 natifs antérieurs inchangés. La [recette de galerie](production/20261125-domains/static-gallery-verification.json) passe 16 groupes sur les 52 entrées ; les neuf nouvelles cartes possèdent leurs deux ancres documentaires. Le [journal HTTP final](production/20261125-domains/http-verification.log) vérifie les modules et fichiers réellement servis, sous la version `54275b88dc7536168038`. La publication conserve sa référence effective dans le bilan. Les priorités ouvertes restent concrètes : références non identifiées, kit/rencontre propre à chaque futur candidat, fiches du moteur Boss, exercices dirigés du dojo, essais matériels des commandes et mesure d’équilibre. Les besoins de réseau, son, progression, accessibilité et localisation restent suivis dans le [registre de production](REGISTRE_PRODUCTION.md), sans pourcentage global inventé.


---

<a id="lot-extension-20261125"></a>
## 19. Exercices, compendium Boss et extension visuelle — 25 novembre 2026

**État du checkpoint : en production, sur le socle `8d274a015e0edf314a853630031d5eb507354811`.** Le présent chapitre distingue les références inspectées, les travaux engagés et les livraisons restant à contrôler après restauration de l’environnement. Il ne vaut ni recette de l’extension, ni annonce de fusion. Le socle conserve huit combattants et neuf modes ; l’Entraînement accueille les exercices, sans créer un dixième mode.

Le Guide général v1.0 demeure conservé intégralement, à l’empreinte `4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7`. Les [trente associations EDG](#122-association-des-30-rubriques), les cibles de conception et les règles actuellement chargées restent séparées. Les [sources du lot](production/20261125-extension/reference-research.json) et le [registre de l’univers](UNIVERS_DS.md#references-extension-20261125) relient les nouvelles propositions à leurs images officielles.

### 19.1. Huit exercices pour les actions réellement présentes

Le contrat de production porte sur les huit exercices ci-dessous. Les distances et pas sont ceux de la simulation actuelle ; ce ne sont pas des mesures physiques du canon Death Stranding.

| ID | Exercice | Critère prévu dans le moteur actuel |
| --- | --- | --- |
| `distance` | Entrer et sortir de portée | Rester immobile quinze pas à 65–105 px du mannequin, puis atteindre au moins 250 px. |
| `reach` | Faire toucher un coup léger | Terminer un léger dans le vide depuis au moins 150 px, puis réussir un impact léger. |
| `guard-high` | Tenir la garde debout | Bloquer trois légers sans perte de PV. |
| `guard-low` | Protéger les jambes | Bloquer trois balayages sans perte de PV. |
| `punish` | Punir un coup dans le vide | Laisser un lourd manquer, sans blocage, puis toucher d’un léger pendant sa récupération. |
| `resource` | Dépenser puis récupérer | Payer le coût réel d’une signature neutre, puis laisser la recharge du dojo remonter à 60 sans nouvelle attaque. |
| `signatures` | Les trois signatures | Atteindre la phase active des signatures neutre, avant et arrière ; conserver les préparations propres à chaque kit. |
| `combo` | Confirmer puis enchaîner | Annuler un léger confirmé vers un lourd et obtenir les deux impacts dans le même combo. |

Les huit kits restent sélectionnables. L’élève utilise les commandes J1 reconfigurées, tactiles ou de manette standard ; le mannequin suit un script et les entrées J2 externes sont verrouillées pendant l’exercice. Tous les exercices restent accessibles, la reprise recommence l’exercice et la nouvelle tentative est libre. Le contrat prévoit de conserver les validations acquises sous `echos.lessons.v1`.

Les fiches [Actions et IA](ACTIONS_ET_IA.md) restent le référentiel des trente attaques du duel. Une préparation nécessaire à une signature ne doit pas être effacée pour rendre une leçon artificiellement triviale. Les fichiers de preuve attendus sont `production/20261125-extension/DOJO.md` et `lessons-verification.json` ; leur recette finale doit être relue après restauration. Une manette synthétique ne constitue pas une recette sur matériel physique.

### 19.2. Compendium propre au moteur Boss

La production du compendium porte sur les six rencontres, huit motifs d’attaque adverses, trente actions joueur — six communes et vingt-quatre signatures — et trois difficultés extraits de `boss.js`. Elle doit préciser délais, coûts, dégâts, volumes, défense, exposition, transport, conditions de fin et limites. Les chiffres de [StrandFight](ACTIONS_ET_IA.md) restent ceux du duel et ne sont pas transposés à ces grandes rencontres.

Les sorties prévues sont `BOSS_ET_RENCONTRES.md`, `data/boss-et-rencontres.json` et le module consultable `boss-data.js`. Le bilan `production/20261125-extension/BOSS_COMPENDIUM.md` et sa preuve `boss-compendium-verification.json` distingueront extraction et essais réellement exécutés. À ce checkpoint, aucune validation nouvelle n’est attribuée à ces fichiers.

La fiche Camion doit distinguer neutralisation du véhicule et livraison de son colis. Le Convoi conserve deux vagues et deux colis. Les règles des parcours restent indépendantes : Survie à 100 PV avec soin de 15 plafonné à 100 ; Boss Rush à 120 PV avec soin de 20 plafonné à 120, énergie et garde rétablies à 100, arrêt à la défaite et reprise propre ; campagne avec remise des ressources au début de chaque chapitre. Une description pédagogique ne modifie aucune de ces règles.

### 19.3. Douze bases visuelles sourcées

Les douze sujets sont absents du catalogue de 52 cartes contrôlé au début du lot. La [recherche détaillée](production/20261125-extension/reference-research.json) conserve page officielle, URL de l’image, version, rôle proposé, cadrage, éléments visibles et inconnues. Huit références sont classées A pour la lisibilité du sujet ; quatre sont classées B parce que le rendu est petit ou partiel. Ce classement mesure l’utilité du cadrage, sans certifier une fidélité 1:1.

| Groupe | Sujets retenus | Rôle et limites |
| --- | --- | --- |
| DS2 | Pizza Chef | Portrait de PNJ ; les vues inspectées ne fournissent pas un modèle neutre complet debout. Aucun statut jouable déduit. |
| Half-Life réellement inclus dans DS PC/DC | Gant gravitationnel, camion Lambda, hologramme Strider | Équipement, variante de véhicule et décoration. Le gant est documenté côté dorsal ; le Strider reste un hologramme. |
| Cyberpunk réellement inclus dans DS PC/DC | Sam avec accessoires, Reverse Trike, hologramme Atlas Trauma Team | Variante de Sam, véhicule et décoration ; aucun nouveau kit ni appareil pilotable déduit. |
| DS1 et ses variantes PC | Reverse Trike standard, borne MULE, Sam avec lunettes Ludens argentées, squelette de vitesse argenté, plaque d’armure argentée | Bases de véhicule, structure, costume et équipement. Les trois rendus argentés proviennent d’un petit visuel promotionnel ; aucun niveau chiffré d’équipement n’est inventé. |

Les zones cachées et les détails trop petits restent explicitement adaptés dans toute production suivante. Le disque Rubber Pizza vu par la tranche et le générateur dont le sommet est coupé restent des réserves hors sélection. La mitrailleuse MP DS2 ne fait l’objet d’aucune nouvelle tentative dans ce lot. Les identités d’ennemis non confirmées, dont les références Watcher insuffisantes, restent ouvertes.

### 19.4. Trois arènes supplémentaires en préparation

| ID | Référence et interprétation | Production prévue |
| --- | --- | --- |
| `firing-range-dc` | Stand de tir Director’s Cut : adaptation du panorama déjà livré au catalogue. Son statut « catalogue seulement » décrit le lot domaines (§18), avant cette extension. | Cinq couches nouvelles ; panorama existant réemployé. |
| `night-viaduct-ds2` | Capture officielle DS2 011 de février 2024 : chaussée humide, lumières cyan et ville sombre. Nom descriptif ; localisation canonique précise non identifiée. | Un panorama et cinq couches. |
| `red-ravine-ds2` | Capture officielle DS2 014 de février 2024 : roches sombres, arbres nus, lumière rouge et pluie. Nom descriptif ; localisation et silhouettes lointaines non identifiées davantage. | Un panorama et cinq couches. |

Ces scènes relèvent de la reconstitution de combat du projet. Les images sources ne prouvent ni danger météorologique jouable, ni nouveau Boss, ni transition entre arènes. Le lot prévoit dix-sept images d’arènes : quinze couches et deux panoramas ; le panorama du stand de tir est réemployé, donc exclu des nouvelles sorties.

### 19.5. Réception, preuves et manques conservés

Le périmètre prévu est de **vingt-neuf PNG fixes** : douze bases et dix-sept images d’arènes. Ce total est un objectif de production, pas un inventaire livré. Les 229 PNG récents du socle devront être préservés ; les comptes d’images, cartes et configurations seront arrêtés sur les chemins réellement intégrés et mesurés.

La réception doit relier chaque fichier à sa source, son rôle, son format natif, ses dimensions, son empreinte et sa revue visuelle. Les recettes distingueront serveur HTTP réel, logique du moteur, Canvas natif, DOM simulé et éventuels essais de navigateur réellement disponibles. Aucun résultat non restauré ne sera présenté comme une recette finale de ce lot.

Les variantes restent distinctes de leurs identités et versions ; aucune base fixe n’augmente automatiquement le roster jouable. Les autres œuvres et projets Death Stranding restent dans le périmètre du [registre de l’univers](UNIVERS_DS.md), avec leurs statuts. Le [registre de production](REGISTRE_PRODUCTION.md) conserve les manques de réseau, audio, accessibilité, progression, localisation, contrôles et contenu : cette extension ne clôt pas l’univers entier.

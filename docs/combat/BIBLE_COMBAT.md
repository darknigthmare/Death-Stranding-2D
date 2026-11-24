# Échos de la Grève

## Bible du mode de combat de Death Stranding 2D

**Édition de conception du 18 novembre 2026 · Référence artistique : Death Stranding et Director’s Cut.**

Deux silhouettes se font face sur la laisse de mer. Sam se baisse pour poser une caisse. L’autre joueur dispose d’un instant pour avancer. S’il se précipite, Sam peut l’attendre, lien en main. S’il s’arrête, Sam regagne son équilibre et choisit la distance du prochain échange. Ce geste ordinaire de porteur résume le duel que nous voulons construire.

### Périmètre de cette édition

| Ensemble | Contenu | Lecture |
|---|---|---|
| Premier noyau | Sam, Fragile, Higgs, Cliff. La Grève, le terminal Bridges et le champ de bataille de Cliff. | Distribution et lieux retenus pour la première réalisation. |
| Jeu de combat cible | Règles chiffrées, commandes techniques, 8 fiches de combat, 8 campagnes, 8 arènes et réalisation des fatalités. | Spécifications de production. Les valeurs proposées demandent des essais en jeu. |
| Version jouable | Huit combattants, huit campagnes, dix lieux et une variante sèche du camp MULE, tournoi à élimination, dojo et deux défis. | Le tableau ci-dessous donne les règles chargées par le moteur. |
| Fidélité | Le chapitre 11 associe les décisions visuelles à des images publiées par les créateurs et l’éditeur. | Chaque costume, accessoire et côté du corps demande une comparaison visuelle avant validation 1:1. |

Les mentions **source** renvoient au jeu officiel. Les rencontres, dialogues, noms de techniques, effets de jauge et plans de mise en scène ci-dessous sont **des créations du mode annexe**. L’entrée dans la simulation isole ses résultats du récit de la campagne principale. Les boutons, règles et minutages qui suivent décrivent la cible de conception. Le menu Commandes de la version jouée fait foi pour les fonctions disponibles.

### Version jouable · huit combattants, dix lieux et une variante météo

Depuis la campagne v0.58, le bouton **Échos de la Grève** ouvre les huit histoires de Sam, Fragile, Higgs, Cliff, du porteur MULE, de Die-Hardman, de Mama et de Heartman. Chaque combattant dispose de trois adversaires, d’une introduction, d’une rencontre avec son rival et d’un épilogue. Une victoire valide le chapitre dans le navigateur. Une défaite permet de rejouer immédiatement la même rencontre. Les scènes vues se retrouvent dans la galerie. Le menu donne aussi accès au **Duel originel**, avec ses deux récits et son propre système de commandes.

Le tournoi tire un tableau de quatre, six ou huit **participants**, choisis parmi les huit combattants jouables. À six, deux participants distincts passent directement en demi-finale. Un ou deux joueurs peuvent s’inscrire. Les duels entre deux IA produisent un score simulé. Un duel comprenant un humain se joue au clavier ou avec les commandes tactiles. Une victoire exige deux manches. Le tableau sauvegardé restitue les emplacements, les scores et le prochain duel. Un nouveau tirage enregistre aussi l’arène de chaque rencontre. Les anciens tableaux conservent leur choix parmi les trois premiers terrains.

Les huit parcours totalisent vingt-quatre scènes de galerie. Dans **L’inventaire du matin**, le MULE rencontre Mama au camp, Die-Hardman au terminal et Sam au camp. Die-Hardman termine sa campagne devant Cliff, Mama devant Die-Hardman et Heartman sur la Grève face à Higgs. [Sélection des huit combattants](apercus/selection.webp)

Les dix lieux du chapitre 7 et la variante **Camp des MULEs · temps sec** sont sélectionnables en Versus et au dojo. Chaque configuration possède un panorama et cinq images indépendantes : ciel ou fond intérieur, lointain, plan intermédiaire, sol et premier plan. Les plans se déplacent à des vitesses distinctes. Le camp d’origine garde son gravier humide sous la pluie ; sa variante conserve le même lieu sous un ciel plus clair, avec un sol sec et une poussière légère. Les histoires gardent leurs lieux scénarisés. [Rendus actuels des arènes](apercus/stage-extension-20261119/) · [Lot de la variante sèche et des ambiances](production/AMBIANCES_VARIANTE_MULE_20261119.md).

En combat, les poses de garde et d’action de Sam, Fragile et Cliff ont des points d’appui distincts. Le moteur aligne les pieds sur la même ligne au passage d’une image à l’autre. Pour les deux fentes, la hauteur de rendu descend à 80 % de la garde de Fragile et à 78 % de celle de Cliff. Higgs dispose de sa propre garde, avec la main ramenée vers le torse. La mesure du pied d’appui permet de passer de cette garde à la main tendue de son attaque. Fragile, Higgs, le MULE et Heartman disposent chacun de quatre poses peintes. Mama et Die-Hardman emploient des figurines articulées originales, dessinées de profil. Pour Sam et Cliff, deux planches transparentes contiennent chacune quatre positions intermédiaires. Le pas lève le talon arrière et avance le genou opposé. Le recul garde les semelles au sol, fléchit les hanches et déplace le haut du corps. Les captures proviennent des duels lancés au dojo. [Die-Hardman contre Cliff](apercus/diehardman-duel.webp) · [L’ancrage de Mama](apercus/mama-duel.webp) · [Le signal de Heartman](apercus/heartman-duel.webp)

Le moteur fonctionne à 60 pas de simulation par seconde. Une manche dure 75 secondes. Un K.-O. décisif ouvre la finalité pendant 2,25 secondes. Au temps, la vitalité départage les combattants. Une égalité réinitialise leurs positions et réduit leur vitalité à un point pour un échange décisif.

Pendant l’invite **Rupture**, J1 appuie sur **Y** ou J2 sur **O**. Le geste démarre dans l’arène. Une illustration propre au vainqueur prend ensuite l’écran avant le résultat du match. Les commandes tactiles proposent le bouton **Fin**. Si le joueur laisse passer l’invite, le résultat s’affiche directement.

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

Les directions suivent la position adverse. La touche de signature est **H pour J1** et **L pour J2**. Le dojo permet de vérifier ces interactions contre un mannequin immobile, en garde ou piloté par l’IA. La case **Zones de touche** montre le volume vulnérable de chaque combattant et la portée de ses coups de mêlée actifs. La fiche **Commandes** donne les gestes communs et les techniques du combattant. La caisse MULE est un prop détouré indépendant. Le même fichier sert pour la pose au sol, la poussée et le rappel. [La caisse entre le MULE et Sam dans leur duel au camp](apercus/consigne-mobile.webp)

### Sommaire

1. [Entrer dans le mode](#1-entrer-dans-le-mode)
2. [Règles du duel](#2-règles-du-duel)
3. [Commandes et lecture des coups](#3-commandes-et-lecture-des-coups)
4. [Huit combattants](#4-huit-combattants)
5. [Huit campagnes](#5-huit-campagnes)
6. [Fatalités de la Grève](#6-fatalités-de-la-grève)
7. [Arènes et parallaxe](#7-arènes-et-parallaxe)
8. [Tournoi et modes complémentaires](#8-tournoi-et-modes-complémentaires)
9. [Direction des sprites et du son](#9-direction-des-sprites-et-du-son)
10. [Production et recette](#10-production-et-recette)
11. [Références officielles](#11-références-officielles)

## 1. Entrer dans le mode

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

Les quatre premières fiches approfondissent le noyau du prototype. Les quatre suivantes ouvrent le roster cible. Chacune donne six normales, trois spéciales, une projection, une ultime et deux exercices de combo. Le terme « exercice » désigne un enchaînement à vérifier dans la version réglée.

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

## 5. Huit campagnes

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

**Survie.** Sept duels d’une manche opposent le combattant choisi aux sept autres. Après une victoire, la vitalité restante augmente de 15 points, jusqu’à 100. La reprise d’un échec conserve la vitalité d’entrée de ce duel. Le registre distingue la difficulté, le combattant et les parcours avec ou sans reprise.

**Livraison sous pression.** Le porteur entre au camp avec une caisse scellée. Une touche directe sur J1 rompt le scellé. La garde le protège. Une victoire en portant la caisse intacte ajoute le sceau du camp à la galerie, même après fermeture et réouverture du jeu.

## 9. Direction des sprites et du son

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

Les onze configurations d’arène ont aussi un fond sonore synthétisé et un événement localisé : ressac, porte, radio, balise, moniteur, treuil, conduite, goutte, bulle ou rafale. **Ambiance du décor** règle leur volume séparément des techniques ; le réglage initial est de 35 % et la préférence est partagée avec le salon privé. Pause, sortie, fin et coupure du son libèrent toutes les voix. Les effets réduits conservent un fond plus discret et suppriment les événements intermittents. Les horloges audio restent hors des checkpoints ; le rattrapage réseau est silencieux, y compris lorsqu’il reconstruit le duel sans checkpoint. [Détail des profils et de la recette](production/AMBIANCES_VARIANTE_MULE_20261119.md).

## 10. Production et recette

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

Le contrôle `arenes.cjs` conserve son parcours navigateur complet. Le complément `arenes-canvas.cjs` permet de tester directement le même `fight.js` avec Canvas natif quand Chromium n’est pas disponible : onze configurations d’arène, duel local et entraînement, deux directions, effets normaux et réduits, soit 88 cas de rendu. Il vérifie les cinq fichiers réellement dessinés, les proportions, les vitesses relatives, le débord horizontal et l’ancre de sol ; il ne valide pas les menus du navigateur ni la fidélité canonique des décors.

## 11. Références officielles

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

## 12. Reprise des poses et effets — 24 novembre 2026

Sam, Fragile, Higgs, Cliff, le MULE, Die-Hardman et Heartman disposent maintenant de cinq PNG individuels supplémentaires : garde, accroupissement, montée, sommet et descente du saut. Les cinq poses de Mama étaient déjà présentes. Les nouvelles sources sont natives et transparentes ; leurs crops, proportions et ancres sont mesurés dans `asset-geometry-20261124.js`, sans modification des pixels. Le moteur conserve les poses historiques comme repli pendant le chargement et respecte les poses d’un costume optionnel lorsqu’elles existent.

Sept effets déjà prévus dans la simulation disposent d’une image dédiée : bola de Sam, mains de goudron de Higgs, trait de Cliff, trait ascendant du rappel, portique de Die-Hardman, impulsion et mémoire de Heartman. Les effets ancrés au sol sont dimensionnés à la hauteur de frappe existante. Les sources sont affichées sans étirement ; les règles de combat et les checkpoints de simulation restent indépendants du chargement des images.

La reprise porte donc sur **42 nouvelles images**. Les **55 couches des onze configurations d’arène** étaient complètes et ont été contrôlées à nouveau. Le catalogue déclare désormais **210 fichiers d’image**. Les anciens dessins de Mama et de Die-Hardman, les planches historiques de marche/impact et l’inversion par miroir restent des points distincts à revoir pour une certification canonique 1:1. La continuité avec les tenues locales ne constitue pas cette certification.

[Rapport du lot, validation et limites](production/20261124/REPRISE_ASSETS_20261124.md) · [Galerie des éléments séparés et rendus](production/20261124/index.html) · [Inventaire natif et empreintes](../../art/sources/echos-de-la-greve/production-20261124/production-assets.json).

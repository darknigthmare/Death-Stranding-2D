# Les Duels de la Grève

Bible de conception du mode de combat de Death Stranding 2D · Version de travail 1.0 · 18 novembre 2026

## 1. Le colis entre deux adversaires

Sur la Grève, Sam voit une mallette dans le ressac. À l’intérieur, un récepteur continue d’appeler. Higgs pose la botte sur la poignée. Le joueur pourrait avancer en attaquant. Il peut aussi s’arrêter à une longueur de bras, laisser Higgs se découvrir, récupérer le centre et enfin remettre la mallette à son destinataire. La dernière image du parcours de Sam est celle d’une livraison.

Le mode est un duel latéral à deux combattants, avec des manches courtes et une caméra commune. Son fil conducteur est la distance qui sépare deux personnes d’un objet qu’elles veulent pour des raisons différentes. La corde de Sam change une défense en initiative, le masque de Higgs annonce une menace distante et la lourdeur d’une caisse se lit dans le retour en garde. Les colis narratifs restent en dehors des zones de collision, sauf dans les défis consacrés à la livraison.

**Périmètre.** Le premier Death Stranding et sa Director’s Cut fixent les silhouettes, les accessoires et le vocabulaire. Six parcours, six arènes et leurs règles complètes forment la cible décrite ici. La première tranche porte sur Sam, Higgs et la Grève. Le bilan de réalisation joint au jeu précise ce qui fonctionne dans la version livrée. Les minutages, les commandes abstraites et les statistiques ci-dessous sont des valeurs de conception à tester.

**Réalisation au 19 novembre 2026.** Le [Duel originel](../../modes/echos-de-la-greve/duel-originel/index.html) permet de choisir les six lieux du chapitre 10 en duel direct et en entraînement. Chacun utilise cinq plans du catalogue commun, adaptés au sol du prototype. Le choix est conservé pour la revanche, et les deux récits Sam/Higgs restent sur la Grève. L’entraînement expose une cible immobile, en garde ou pilotée par l’IA. Le [bilan de livraison](production/AMBIANCES_VARIANTE_MULE_20261119.md) distingue ces fonctions des règles de conception encore à produire.

**Place dans le projet.** L’entrée « Les Duels de la Grève » appartient aux activités annexes. Un joueur doit pouvoir livrer un colis dans la campagne principale, ouvrir les duels, puis reprendre sa partie à son dernier point de sauvegarde. Le premier lancement propose Histoire ou Entraînement. Les suivants retrouvent le dernier mode utilisé. L’intégration finale doit maintenir les progressions des deux activités dans des espaces de sauvegarde distincts.

## 2. Références et fidélité visuelle

| Élément du premier jeu | Conséquence pour le duel |
| --- | --- |
| Sam relie les survivants et transporte des marchandises. L’équilibre et l’état du fret comptent durant ses déplacements. [1, 2, 3] | Sa garde protège la capsule. Une sangle qui se tend et un pas d’arrêt précèdent la poussée du paquetage. La caisse de combat est vide et sanglée séparément. |
| Les MULEs repèrent le fret à l’aide de capteurs. Sam dispose du lien pour immobiliser un adversaire. [2] | La MULE vise la caisse et marque la zone où elle croit la trouver. Sam peut détourner un assaut de près grâce au lien. Le scan de sa garde et les effets chiffrés sont propres au mode. |
| Higgs porte le masque doré, commande les Homo Demens et exerce un pouvoir sur les Échoués. [4] | La forme du masque doit rester identifiable dès la sélection. Les appels de goudron et leurs délais sont écrits pour permettre une réponse équitable dans un duel. |
| Fragile dirige Fragile Express, peut se déplacer par saut et partage un passé avec Higgs. [4, 5] | Le point d’arrivée de son saut est visible. Le colis narratif reste à son point de départ. Son parcours traite des traces laissées sur les livraisons. |
| Cliff est lié à des champs de bataille et à des soldats squelettiques. [4] | Une silhouette de soldat traverse une voie annoncée. Le joueur doit pouvoir lire simultanément Cliff, la silhouette et leurs délais. |
| Le rivage de la Grève, ses animaux échoués et ses grands espaces font partie de l’iconographie originale. [6] | L’horizon reste bas et le plan des combattants dégagé. Le tournoi et les rencontres prennent la forme de scènes recomposées, écrites pour le fan game. |

Aucun dialogue de scénario ci-dessous n’est une réplique du jeu d’origine. Nell Ward, la MULE individuelle, le colis au récepteur, le tournoi et les rencontres sont des créations du mode. Les fins ferment le point de vue d’un personnage au sein de cette fiction. Elles n’ajoutent aucun événement à la chronologie officielle.

**Point d’ancrage du scénario.** Sam et Higgs ont une confrontation sur la Grève dans le premier jeu. Les duels exploitent cet écho pour construire deux récits symétriques. Ils donnent un sens différent au même colis. [7]

**Contrôle d’une silhouette.** Choisir une tenue DS1 précise pour chaque personnage. Réunir une vue de face, un profil et un dos pris dans une même séquence de référence. Vérifier l’implantation du scanner, de la capsule, du masque, des courroies et de la capuche dans les deux orientations. Les portraits de sélection montrent le visage ou le masque en trois quarts. La garde en jeu montre la pose entière, de profil, poids porté sur les pieds. Pour chaque écart, consigner la pièce, la vue qui le montre et l’ajustement attendu. Seul ce contrôle permettrait de qualifier un élément de conforme à sa référence.

## 3. Une manche, image par image

| Règle cible | Valeur et résolution |
| --- | --- |
| Format | Duel en deux manches gagnantes, 60 secondes par manche. 1 000 points de vitalité par combattant. Chronomètre, fenêtres de défense et collisions avancent sur une simulation à 60 Hz. |
| Départ et fin | Départ à 3 unités d’écart. Une unité correspond à la largeur d’un combattant en garde. À zéro point, le perdant entre en chute. À la fin du chrono, le pourcentage de vitalité départage. |
| Égalité | Double KO ou égalité au temps donne une manche aux deux. Si les deux atteignent simultanément le seuil de victoire, jouer une manche décisive de 20 secondes à 300 points. En cas de nouvelle égalité, rejouer cette manche en inversant les côtés. |
| Mobilité | Marche avant et arrière, accroupissement, saut avant ou arrière. Avant deux fois lance un pas rapide de 12 images. Arrière deux fois crée de l’espace sur 16 images. Le pas rapide ne traverse pas l’adversaire. |
| Garde | Arrière protège debout des coups médians et descendants. Bas-arrière protège des médians et des coups bas. Les prises touchent les deux gardes. Une garde réussie retire 0 point sur un normal, 5 sur un spécial. Les dégâts de garde laissent au moins 1 point. |
| Lien | Chaque combattant possède une jauge de 0 à 100. Un coup distinct qui touche rapporte 10 à l’attaquant et 6 au défenseur. En garde, chacun reçoit 3. Une attaque multiple rapporte une seule fois. Départ à 25 de Lien, puis report du solde d’une manche à l’autre. |
| Poussée de secours | À partir de 50 de Lien, G + L pendant une garde repousse à 1,5 unité. Coût payé au déclenchement. Zéro dégât. Cette sortie rend le centre au défenseur mais retarde l’accès à la signature à 75. |
| Impact | Arrêt commun de 4 images sur léger, 7 sur lourd, 9 sur une signature qui touche. Chrono, adversaires, projectiles et délai de téléportation gèlent ensemble. Le tampon d’entrées continue à recevoir les commandes. |

### Lecture des commandes

L désigne le coup léger, P le coup puissant, S le spécial et G la prise. Les flèches sont relatives à l’adversaire. Une direction suivie de « + » se maintient pendant l’appui. Un tiret long entre deux coups indique leur succession. La signature se déclenche avec G + S à partir de 75 de Lien, consommés à l’activation. Le mode simplifié associe chaque accord de touches à un bouton configurable et conserve les mêmes délais. Une action de fin à l’écran n’utilise jamais une commande tenue avant la victoire.

| Action commune | Amorçage / activité / récupération en images | Lecture en match |
| --- | --- | --- |
| L debout | 5 / 2 / 9 | Médian de 45 points. À courte distance, permet de vérifier si l’adversaire est touché avant la suite. |
| P debout | 11 / 3 / 17 | Médian de 85 points. Éloigne l’adversaire. Sur garde, le défenseur reprend l’initiative avec 6 images d’avance. |
| Bas + L | 6 / 2 / 12 | Bas de 35 points. Arrête la marche arrière. Une garde basse ouvre la possibilité d’un saut descendant chez l’attaquant. |
| Bas + P | 9 / 4 / 20 | Anti-aérien de 90 points. Vise la zone au-dessus de l’épaule et manque les cibles accroupies. |
| Saut + L ou P | 6 / 3 / 6 ou 10 / 4 / 8 | Coup descendant de 45 ou 80 points. La récupération indiquée démarre à l’atterrissage. Une arrivée trop haute laisse à la défense le temps de se relever. |
| G | 5 / 2 / 21 | Prise de 105 points dans 0,65 unité. Une autre prise dans les 7 images suivant le contact permet de se dégager. Le saut évite une prise au sol. |

**Échelle du premier lot.** Le prototype affiche 100 points de vie et propose déjà deux kits individualisés. La cible de réglage étend cette échelle à 1 000, ajoute les techniques directionnelles, le dégressif de combo et la poussée de secours. Un coup compté à 12 dans le prototype correspond à 120 avant rééquilibrage sur cette échelle. Le prototype accorde une nouvelle manche en cas d’égalité et conserve le Lien entre les manches.

**Décisions de moteur.** Mémoriser les entrées pendant 5 images. Résoudre les actions simultanées par ordre signature, poussée de secours, spécial, prise, puissant, léger. L’orientation change quand les combattants se dépassent, puis se fige pendant l’attaque en cours. Les déplacements utilisent une boîte de corps. Les tests de touche utilisent des volumes distincts pour l’attaque et la réception. Un accessoire flottant et une sangle ne donnent aucune portée supplémentaire par leur seule présence à l’écran.

**Enchaînements.** Sur touche, L ou bas + L peut enchaîner P. P peut engager un spécial pendant les 5 premières images de son impact. La fenêtre d’étourdissement cible est de 14 images après L et 22 après P. Les coûts en Lien s’appliquent une seule fois. Le multiplicateur de dégâts du combo est successivement 100 %, 85 %, 70 %, puis 55 %, arrondi à l’entier inférieur à chaque touche. Un spécial suspend ces annulations. Une chute termine le combo et le réveil accorde 5 images protégées. Ainsi, L — P — spécial récompense une ouverture et laisse ensuite rejouer la défense.

**Exemple à l’écran.** Sam atteint Higgs avec L, enchaîne P et confirme sa poussée à 95. La perte totale est 183 points, soit 45 + 72 + 66. Si Higgs garde L, Sam termine sa récupération ou risque un puissant lancé séparément. Le journal d’entraînement distingue ces deux cas et indique le premier instant où Higgs aurait pu agir.

## 4. Sam Porter Bridges · Rester debout

Sam est le point d’entrée du roster. Son gros paquetage rend le démarrage lisible. Sa meilleure distance est d’environ une unité. Il peut convertir un contact en recul adverse, ou sacrifier cette avancée pour attendre un coup et le détourner. Sa capsule reste contre le torse, protégée pendant les rotations.

| Commande | Mouvement cible | Réponse adverse |
| --- | --- | --- |
| S | **Lien de brin**. Sam projette son lien sur 1,65 unité à l’image 9, attire la cible vers lui et inflige 120 points. | Rester hors de portée ou garder puis reprendre le terrain pendant le retour du lien. |
| Arrière + S | **Reprise d’appui**. Contre un coup médian direct entre les images 4 et 9, puis change de côté et inflige 85 points. Sur échec, reprise de 23 images. | Marquer une pause, frapper bas ou présenter une prise. Le lien tendu rend le contre visible. |
| Avant + S | **Poussée du paquetage**. Avance sur 1,25 unité en 12 images, impact médian de 95. La distance repoussée vaut 0,7 unité. | Garder puis avancer pendant les 9 images de désavantage de Sam, ou passer au-dessus avant le contact. |
| Bas + S | **Caisse au sol**. Sam dépose un étui vide à portée de pied. Une glissade basse part à l’image 20 et disparaît après 2 unités. 70 points. Un seul étui à la fois. | Sauter, garder bas ou gagner l’espace pendant la pose. |
| G + S | **Relève du porteur**. Trois pas lourds annoncés par les attaches, puis impact de 190 points à l’image 17. Fin à distance de marche. | Garde debout ou basse. Le bruit des attaches précède toute collision. |

**Deux routes à apprendre.** Au contact, L — P — Poussée du paquetage replace le duel au milieu du terrain. Depuis le saut, P juste avant l’atterrissage — L — P — Caisse au sol termine bas si l’adversaire est resté dans la portée de l’étui. Une validation d’entraînement marque le moment où enchaîner, puis laisse rejouer la même distance de départ.

**Noms des gestes de base.** Direct du porteur (léger), Heurt de cargaison (puissant), Balayage de botte (bas), Frappe descendante (saut), Entrave au brin (prise). Le léger sort plus vite que le grand heurt.

**Parcours « Le destinataire ».** Intro au ras des galets. Le récepteur grésille sous la poignée de la caisse. Sam éteint son scanner pour mieux entendre. « Je t’entends. Reste en ligne. » Ordre cible des rencontres : MULE au camp, Nell au quai, Higgs sur la Grève.

**Rival.** Higgs appuie sur le couvercle avec la semelle. « Tu sais seulement ce que tu transportes ? » Sam remet une sangle sur son épaule. « Je sais que quelqu’un attend. » Sur le dernier mot, la caméra reprend la largeur du duel.

**Finalité et ending.** « Dernière livraison » : Sam immobilise l’écho adverse avec son lien, récupère la mallette et la pose hors de la marée. Dans la dernière illustration, une main la tire à travers une porte entrouverte. Une voix dit « Reçu ». Le voyant du récepteur s’éteint. Seuls restent le vent et le mouvement du sable.

## 5. Higgs Monaghan · Faire avancer l’autre

Higgs cherche à fermer un morceau de terrain, puis à punir la mauvaise décision. Le goudron s’étend à ses pieds avant d’atteindre sa cible. La pose du masque et la main libre annoncent deux options différentes. Près du coin, ses longues récupérations deviennent son point faible.

| Commande | Mouvement cible | Réponse adverse |
| --- | --- | --- |
| S | **Onde de goudron**. Une vague sombre parcourt l’arène près du sol après 14 images. Impact médian de 100. Le goudron se retire après le passage. | Garde haute ou basse, saut ou pression pendant l’amorce. La ligne ne suit plus la cible après son départ. |
| Avant + S | **Relais du masque**. Une empreinte fixe annonce un déplacement de 1,5 unité à l’image 18. Aucun dégât. Higgs reste exposé 12 images à l’arrivée. | Viser l’empreinte ou reculer à la distance de l’arrivée. Le marqueur persiste si Higgs passe derrière. |
| Bas + S | **Main de la Grève**. Une empreinte se forme à 1,3 unité. Elle monte à l’image 19, inflige 95 au sol ou en l’air, puis disparaît. | Quitter la zone ou garder. L’empreinte ne peut suivre un saut. |
| G + S | **Marée de la Grève**. Trois empreintes convergent en une seule vague médiane de 205 points à l’image 24. | Garder dès que les trois traces se rejoignent, ou interrompre Higgs avant l’émission. |

**Deux routes à apprendre.** L — P — Main de la Grève convertit un contact si la poussée de P aligne l’adversaire sur l’empreinte. Onde de goudron gardée — Relais du masque est une feinte de position avec une interruption possible entre les deux. Afficher « pression » dans la liste d’essais pour la distinguer d’un combo garanti.

**Noms des gestes de base.** Revers du masque (léger), Frappe du pèlerin (puissant), Reflux (bas), Chute du masque (saut), Étreinte de goudron (prise). La portée supérieure du puissant coûte des images de récupération.

**Parcours « Un seul spectateur ».** Intro sur un trépied vide, fabriqué avec du bois flotté. Higgs y pose son masque et parle à son propre reflet. « On reprend depuis le début. » Il distingue les pas de quelqu’un qui s’éloigne. Rencontres : Nell au bassin, Fragile sous l’abri, Sam sur la Grève.

**Rival.** Sam lui tourne d’abord le dos pour protéger la mallette du ressac. Higgs : « Regarde-moi quand tout s’arrête. » Sam boucle la sangle en silence. Le duel commence sur le petit claquement du fermoir.

**Finalité et ending.** « Marée noire » : un cercle de goudron efface la silhouette adverse de ce souvenir. Higgs salue le rivage vide puis efface son propre reflet avec le talon. Ses pas le ramènent au trépied. Il attend un applaudissement. Un volet de métal bat au vent, deux fois, puis le générique apparaît.

## 6. Fragile · Choisir le point d’arrivée

Fragile règne sur les changements de distance. Elle crée une arrivée lisible, profite d’une hésitation et perd l’initiative si le rival a attendu. Tenue sombre et col montant de Fragile Express. Le parapluie protège de la pluie dans les scènes et donne son mouvement d’ouverture à une feinte de duel.

| Commande | Mouvement cible | Réponse adverse |
| --- | --- | --- |
| S | **Saut de Fragile**. Une empreinte humide annonce une arrivée à 1,1 unité devant elle. Disparition aux images 11 à 15, arrivée avec 9 images de récupération. | Avancer avant la disparition ou viser l’empreinte. Une marque au sol et un son court indiquent la position. |
| Avant + S | **Livraison express**. Pas glissé et contact médian de 85 points à l’image 11. Elle s’arrête au contact. | Protéger le centre, puis reprendre un léger après blocage. Sa manche plissée annonce le départ. |
| Bas + S | **Parapluie fermé**. Le profil du parapluie dessine un arc anti-aérien à l’image 10. 80 points, faible couverture au sol. | Rester au sol et avancer à la retombée. Le mouvement échoue si l’adversaire reste accroupi. |
| G + S | **Correspondance**. Deux arrivées lumineuses s’éteignent, la troisième fixe l’impact médian à l’image 21. 175 points. | Conserver sa garde sur la dernière empreinte. L’arrivée finale est annoncée au moins 12 images avant l’impact. |

**Deux routes à apprendre.** L — P — Livraison express constitue son enchaînement court. Après Parapluie fermé sur un saut, avancer vers le point de chute puis s’arrêter hors de portée de prise. Le prochain choix, léger ou recul, dépend de la réaction au réveil.

**Parcours « L’encre sous la pluie ».** Une étiquette Fragile Express porte deux numéros de commande. Fragile passe le pouce sur l’encre fraîche et découvre la première adresse. « Celui-là aussi, je vais le vérifier. » Rencontres : MULE au camp, Sam au quai, Higgs sous l’abri.

**Rival.** Higgs lui tend le colis d’une seule main. « Tout ça pour un nom sur du papier ? » Fragile décolle l’étiquette supérieure et la laisse tomber. « Pour la personne à cette adresse. » Le plan coupe sur ses bottes à la fin de la flaque.

**Finalité et ending.** « Accusé de réception » : le rival se retourne vers une trace de saut vide. Fragile, revenue à pied vers le colis, rabat son parapluie. Au terme du parcours, deux anciens destinataires lui présentent leurs bordereaux. Elle sort un stylo et prend le temps de comparer chaque signature avec eux.

## 7. Clifford Unger · Attendre la relève

Cliff s’impose à mi-distance et crée un second rythme d’attaque. Le soldat lié à lui est un signal à suivre du regard. Une seule silhouette militaire peut être active, et ses effets cessent à la fin de la manche. Le fil qui sort du goudron se tend avant chaque intervention.

| Commande | Mouvement cible | Réponse adverse |
| --- | --- | --- |
| S | **Relève**. Une silhouette apparaît derrière Cliff. Une ombre s’avance 26 images plus tard sur 2 unités et touche au milieu pour 80 points. | Repérer le fil rouge puis garder, ou interrompre Cliff avant la 12e image pour annuler l’appel. |
| Avant + S | **Marche de cendre**. Avancée lourde de 0,9 unité. Contact médian à l’image 13, 100 points. | Bloquer le contact et punir la longue récupération. Cliff ne traverse pas un adversaire accroupi. |
| Bas + S | **Rappel du fil**. Rappelle une silhouette active. Son passage au point de départ produit un impact bas de 65 points après 15 images. Sans silhouette, Cliff attend 12 images. | Quitter le fil ou garder bas. Les traces de retour sont visibles avant que Cliff ne puisse reprendre son déplacement. |
| G + S | **Dernier rassemblement**. Les ombres s’alignent et traversent une seule fois la voie médiane à l’image 25. 195 points. | Avancer sur l’amorce ou garder. La largeur de l’effet garde visible le haut du corps adverse. |

**Deux routes à apprendre.** L — P — Marche de cendre assure les dégâts de proximité. Relève — marche arrière — Rappel du fil tend un piège au sol. Une pause ou un saut évitent le rappel et rendent le terrain au rival.

**Parcours « Le bruit dans l’écouteur ».** Sous un ciel de fumée, le grésillement d’un poste se transforme en respiration régulière. Cliff pose son casque sur la table pour écouter jusqu’au bout. Rencontres : Nell dans le bassin, Higgs sur la Grève, Sam dans la tranchée recomposée.

**Rival.** Sam tient son scanner replié. Cliff écoute encore. « Le son vient de toi ? » Sam pose une main sur la capsule. « Il y a plusieurs battements ici. » L’écho du poste continue pendant une seconde, puis s’arrête au début du combat.

**Finalité et ending.** « Cessez le feu » : Cliff lève une paume. Les liens des soldats retombent et l’écho adverse sort du champ. Sur la dernière image, des chaises vides entourent le petit poste. Cliff y accroche son casque. Il peut enfin entendre la respiration sans le bruit de la bataille.

## 8. La MULE · Suivre le mauvais signal

Cette combattante est un individu inventé de la faction des MULEs. Ses choix de couleur, de visière, de harnais et de scanner s’appuient sur les équipements DS1. Son nom reste absent du tableau de sélection. Sa manière de récupérer une caisse qu’on lui laisse donne au joueur un indice sur son rôle.

| Commande | Mouvement cible | Réponse adverse |
| --- | --- | --- |
| S | **Ping de fret**. Pose une marque à la position actuelle du rival au bout de 16 images. La marque dure 90 images et reste fixe. Aucun dégât direct. | Sortir de la marque. Un anneau court sur le sol et un bip indiquent sa taille et sa durée restante. |
| Avant + S | **Récupération prioritaire**. Course de 1,25 unité vers l’avant. Impact médian de 75 à l’image 13, porté à 110 si le rival se trouve sur la marque, qui se consume. | Bloquer ou laisser passer l’assaut en sautant. La MULE s’arrête avant le bord du terrain. |
| Bas + S | **Balise rasante**. Le capteur racle le sol sur 0,9 unité. Bas de 70 à l’image 12. Une balise utilisée efface la marque de fret active. | Garde basse ou retrait. Forcer l’usage de la balise prive la MULE de son bonus suivant. |
| G + S | **Inventaire complet**. Les signaux du camp se superposent avant une ruée médiane à l’image 20. 185 points. La marque éventuelle est effacée. | Bloquer la ruée. La vibration du récepteur reproduite en sous-titre annonce le départ. |

**Deux routes à apprendre.** L — P — Récupération prioritaire est plus rentable près d’une marque déjà posée. Ping de fret à distance — marche avant — prise punit une garde trop patiente. Le ping laisse le temps au rival de changer d’emplacement.

**Parcours « Objet non réclamé ».** Au dépôt, tous les casiers sonnent ensemble. Un colis vide porte un dessin de porteur fait à la main. La MULE efface les autres alarmes une par une pour suivre celle-ci. Rencontres : Fragile sous l’abri, Higgs sur la Grève, Nell au camp.

**Rivale.** Nell pose le dessin sur le sol. « Voilà ce que tu cherchais. » La MULE garde les deux mains sur le récepteur et attend le bip. Il ne vient pas. Elle avance la première.

**Finalité et ending.** « Hors inventaire » : le scan marque toutes les caisses d’un anneau, puis le vainqueur choisit d’en laisser une au rival. Dans le casier du camp, la MULE colle le dessin à hauteur des yeux. Le récepteur retrouve un signal dans la caisse voisine. Elle baisse le volume.

## 9. Nell Ward, dite Relais · Maintenir le passage

Nell est une porteuse vétérane originale de Bridges. Un rouleau de sangles fixé à la hanche et deux petits étuis latéraux la distinguent de Sam. Aucune capsule BB, aucun pouvoir de saut. Son jeu repose sur une ancre unique. La rivale peut la voir et choisir comment traverser l’espace disponible.

| Commande | Mouvement cible | Réponse adverse |
| --- | --- | --- |
| S | **Balise de relève**. Pose l’ancre sous ses pieds à l’image 18. Elle persiste 180 images. Une deuxième pose remplace la première. | Prendre le milieu pendant sa pose. L’ancre seule ne cause aucun dégât. |
| Avant + S | **Passage de corde**. Si l’ancre est devant elle à moins de 2 unités, Nell s’y déplace en 14 images. Sinon elle fait un pas de 0,5 unité. Contact médian de 80 à l’arrivée. | Garder face à l’arrivée. Nell ne peut atteindre l’autre côté d’un rival qui bloque sa trajectoire. |
| Bas + S | **Sangle tendue**. Une impulsion basse parcourt la distance entre Nell et son ancre après 16 images. 85 points. Consomme l’ancre. Sans ancre, geste de récupération de 12 images. | Se tenir hors du segment, sauter ou garder bas. Une sangle claire rend les deux extrémités visibles. |
| G + S | **Passage dégagé**. Une balise improvisée se déploie devant elle et déclenche une poussée médiane à l’image 20. 180 points. | Garder puis reprendre le milieu. Cette signature fonctionne aussi lorsque l’ancre a été consommée. |

**Deux routes à apprendre.** L — P — Passage de corde finit court en terrain libre. Près d’une ancre, bas + L — P — Sangle tendue oblige à préparer le placement avant l’ouverture. La zone d’entraînement signale un ancrage trop éloigné avant de relancer l’essai.

**Parcours « Le dernier quart ».** À la fermeture d’un quai, Nell entend un second clic derrière la porte du sas. Une vieille caisse attend encore son bordereau. Elle ressort ses sangles. « On me rendra les clés demain. » Rencontres : Sam au quai, Cliff dans la tranchée, MULE au camp.

**Rivale.** Au camp, la MULE tient le mauvais bordereau à l’envers. Nell lui montre le dessin sur le carton. « Regarde la main qui l’a signé. » Un deuxième scanner répond dans le lointain. Les deux se disputent une dernière fois le passage.

**Finalité et ending.** « Quai libre » : la sangle de Nell soulève un rideau de fret dans le souvenir et ouvre une sortie au rival. De retour au quai, elle trace au pochoir une flèche vers le dépôt des objets perdus. Une silhouette s’y engage avant que la peinture ait séché. Nell raccroche les clés.

## 10. Six arènes à construire par plans

Le terrain de compétition mesure 12 unités entre les murs, avec une ligne de pieds horizontale et des limites identiques sur les six cartes. À l’écran, le terrain déborde le cadre. Pour chaque unité de caméra, le lointain se décale de 0,08 unité, le moyen de 0,28, le proche de 0,60 et le sol de 1. Conserver au moins 15 % de débord de chaque côté de chaque plan aux cadrages prévus. Les événements d’ambiance suivent des boucles indépendantes du chronomètre.

| Arène et duel associé | Lointain / moyen / proche | Événement et lecture |
| --- | --- | --- |
| **La Grève** · Sam et Higgs | Ciel gris et ligne d’eau / cétacé échoué et cordons à l’horizon / galets noirs et eau basse. Le sol porte le reflet des pieds. | Une vague remonte après la manche puis se retire avant la reprise. Les empreintes d’attaque de Higgs reçoivent un liseré distinct du ressac. |
| **Quai de distribution** · Nell | Collines froides / volumes rectangulaires de Bridges et grande porte / butées, sangles et rampe. | Une porte se referme au loin entre les manches. Les bandes au sol donnent un repère de portée sans flèche clignotante. |
| **Camp des MULEs** · MULE | Butte et ciel sec / tentes, caisses et mâts / sol tassé, câbles bas derrière la piste. | Une impulsion parcourt les mâts en fond. Sa couleur, sa hauteur et son trajet diffèrent de l’anneau de combat de la MULE. |
| **Abri sous la pluie temporelle** · Fragile | Faible ligne de montagne / rideau de pluie hors abri / bord de l’auvent et eau qui goutte derrière les jambes. | Un ruissellement signale la frontière du sec. Les gouttes décoratives restent derrière les mains et le parapluie. |
| **Tranchée de la mémoire** · Cliff | Ciel bas et crêtes / parapets et silhouettes immobiles / planches sombres et reflets. | Au terme d’une manche, les ombres de fond disparaissent. Celles que Cliff appelle sont les seules à entrer sur le plan de jeu. |
| **Bassin de goudron** · Higgs | Ligne de falaises / surface sombre et carcasses industrielles / margelle de béton à hauteur des pieds. | Une bulle se rompt loin du centre. Les remous du fond sont mats, les coups de Higgs possèdent un bord contrasté. |

**Caméra.** Suivre le milieu des deux combattants et limiter doucement le déplacement près d’un mur. Réduire le zoom au-delà de 5 unités d’écart. Vérifier que les deux silhouettes, leurs points d’appui et les avertissements au sol restent dans la zone visible en 16:9 et en 16:10. Sur téléphone tenu verticalement, conserver l’arène en paysage dans une fenêtre dédiée aux commandes déportées sous l’image.

**Version compétitive.** Pluie, grisaille, souffle et scintillements n’affectent ni les collisions ni les timings. L’option « effets réduits » coupe secousses, éclairs et avant-plan mobile. Les anneaux et silhouettes d’attaque conservent leur avertissement statique. La variante narrative peut modifier les sons et la couleur du ciel entre les manches.

## 11. Parcours, tournoi et entraînement

**Histoire.** Choisir un visage ouvre un carton de contexte et une illustration pleine largeur. La route cible se déroule en trois duels, chacun en deux manches gagnantes. Le dernier est le rival nommé de la fiche. Le premier lot utilise une rencontre avec son propre écho et le rival sur la Grève. Les futures routes à trois rencontres sont celles indiquées dans les six fiches. Après défaite, Rejouer réinitialise seulement le duel perdu. Quitter garde le dernier chapitre atteint dans la cible complète. Revoir une scène depuis la galerie ne modifie pas l’avancement.

**Arcade.** Cinq adversaires, sans miroir avant épuisement du roster. Le rival clôt l’échelle. Le résultat indique les manches perdues, les reprises et le temps de jeu hors pause. Le joueur peut recommencer l’adversaire perdu. Une reprise invalide seulement la ligne « parcours sans reprise ». La galerie conserve les séquences déjà obtenues.

**Versus.** Local à deux et solo contre IA. Chaque côté choisit son personnage et sa variante de couleur, puis les joueurs choisissent un lieu. Autoriser un miroir Sam contre Sam. Donner à J2 une marque de HUD hachurée et un liseré de costume ajustable. Après le score final, proposer Revanche avec les mêmes réglages, Changer de combattant et Retour aux Duels.

**Tournoi cible.** Tableau de 4 ou 8 places à élimination simple. Le nombre de places désigne des entrants, pas des personnages distincts. Les humains peuvent choisir le même personnage. Chaque entrée a un identifiant et un nom d’affichage. Les places restantes sont attribuées à l’IA ou indiquées comme exemptes avant le lancement. Tirer les positions à partir d’une graine enregistrée. Répartir les exemptions au premier tour pour éviter une paire de places vides quand des adversaires sont disponibles. Le chemin quart, demi, finale est visible avant le premier combat.

| Cas de tournoi | Règle de progression |
| --- | --- |
| Deux humains ou un humain contre l’IA | Afficher les noms des entrants et l’affectation des commandes avant le duel. Deux manches gagnantes. La fiche résultat avance le vainqueur dans la case reliée. |
| Deux IA | Permettre de regarder ou de produire le résultat à partir de la graine du match et des profils de difficulté. Conserver identifiant, score et vainqueur. |
| Exemption | Avancement automatique sans match et sans victoire comptée dans les statistiques de duel. Une seule place occupée dans tout le tableau empêche le lancement. |
| Déconnexion d’une manette | Geler la simulation et le chrono. Proposer réaffectation ou abandon confirmé. L’identité de l’entrant reste attachée à sa place. |
| Interruption ou reprise | Sauver le tableau après chaque résultat. La validation possède un identifiant de match unique. Reprendre relance le duel inachevé au début et ne duplique aucun vainqueur. |
| Finale | Présenter la branche parcourue, les scores et la pose de victoire. Le bouton Nouveau tournoi repasse par l’inscription. Le bouton Revoir affiche le tableau terminé. |

**Exemple.** Dans un tableau de huit places avec six entrants, deux reçoivent un laissez-passer. Deux quarts joués produisent les deux autres demi-finalistes. Les deux demi-finales et la finale ajoutent trois rencontres. Le tournoi comporte au total cinq combats effectivement disputés et une seule personne sacrée.

**Entraînement.** Un atelier libre et trois exercices par combattant. Le premier apprend la distance d’un normal, le deuxième convertit une ouverture, le troisième apprend à défendre contre sa propre signature. Le mannequin peut rester immobile, garder tout, garder après le premier coup, sauter ou rejouer une séquence enregistrée. Les outils avancés affichent entrées, dégâts, avance sur garde, zones de touche et redémarrage immédiat au centre ou dans un coin. L’exercice de Sam affiche le moment précis où le lien attrape la cible. Celui de Higgs fait recommencer le passage sous le même avertissement au sol.

**Difficulté de l’IA.** Trois profils cibles. Débutant attend 22 images au moins avant de répondre à un mouvement visible, avec une seule décision par ouverture. Porteur attend 15 images et tente un enchaînement court. Vétéran attend 10 images et sait abandonner un piège devenu dangereux. L’IA n’accède qu’aux états visibles et aux événements déjà présentés au joueur. En entraînement, afficher la décision et le délai de réaction.

**Défis complémentaires.** Dans Survie, la vitalité restante passe au combat suivant avec une restauration de 15 % du maximum après victoire. Dans Livraison sous pression, sortir d’un duel avec une caisse intacte vaut un sceau de galerie. Un objectif raté explique la cause sur le résultat et autorise un nouvel essai. Le classement local distingue le mode, la difficulté, les reprises et la version des règles. Le registre associe chaque record à sa difficulté et au préréglage des règles.

**Extension en ligne et rediffusion.** Dans un salon privé, deux joueurs indiquent leur état prêt avant le choix d’arène. Lancer un duel classé seulement si les versions de règles et d’assets concordent. Enregistrer entrées, graine, version, identifiants des participants et résultat. Pour le rollback, conserver des états récents, prédire temporairement une entrée manquante puis resimuler à la réception de l’entrée réelle. Les sons d’impact doivent être dédoublonnés et la médiane de latence affichée. Valider deux clients simulés à 40, 90 et 160 ms et avec des paquets perdus avant d’activer un classement public. Une rediffusion doit retrouver l’instantané final du match. En cas de version incompatible, garder le résultat lisible et l’indiquer avant la lecture.

## 12. Finalités, narration et progression

La finalité récompense le dernier échange par un geste identifiable. Sam termine une livraison, Cliff dissipe son escouade, Fragile annule le rendez-vous que son rival croyait contrôler. Les conséquences se produisent dans le souvenir ou sur la Grève. Le BB reste un personnage à protéger. Sa capsule ne sert jamais de cible ou de projectile.

**Déclenchement cible.** La victoire décisive par KO ouvre une fenêtre de 120 images. Un appui neuf sur le bouton de fin joue la finalité du vainqueur. Sans appui, le perdant se relève et la pose de victoire démarre. Une victoire au temps utilise une salutation courte. La finalité garde le résultat du match acquis. Dans un même duel, presser à nouveau le bouton, passer le plan ou rouvrir le menu ne peut ni rejouer l’événement ni redonner de récompense.

**Découpage.** Réserver 12 images au regard, 36 à l’action et 30 à la réaction, puis une demi-seconde de repos avant le score. Dans la scène de Sam, la main s’arrête au-dessus du fermoir, la caisse sort du ressac et le voyant cesse de battre. Dans celle de Higgs, le reflet se décale, le goudron s’ouvre et le rivage redevient immobile. La variante courte conserve le geste et le dernier son. Les six séquences restent lisibles sans sous-titres et leurs indications sonores sont aussi visibles.

**Bibliothèque narrative.** Chaque personnage reçoit trois illustrations séparées pour l’introduction, la rivalité et l’ending. Le plan du rival montre les deux protagonistes hors des superpositions de texte. Réserver le quart inférieur de l’image aux sous-titres adaptatifs. Les dialogues possèdent des identifiants stables par scène et par locuteur pour permettre la traduction et la relecture. Une scène déjà débloquée peut être passée via un appui long et revue depuis la galerie.

| Déblocage cible | Condition | Contenu obtenu |
| --- | --- | --- |
| Première livraison | Terminer le parcours de Sam | Trois illustrations de son parcours avec légendes, plus sa pose de victoire dans la galerie. |
| Hors service | Réussir le contre puis l’enchaînement demandé en entraînement | Fiche de lecture de la garde adverse et exemple rejouable. |
| Deux points de vue | Terminer les parcours des deux rivaux d’une paire | Écoute des deux scènes de rivalité avec sous-titres et illustrations respectives. |
| Dernière case | Gagner un tournoi à quatre ou huit | Tableau historique du tournoi, avec accès aux résultats de chaque rencontre. |

Tous les combattants produits pour une version sont disponibles en Versus et en Entraînement dès son premier lancement. Les distinctions récompensent les parcours et leur maîtrise. Un joueur qui perd un match garde les contenus déjà obtenus.

## 13. Fabriquer les sprites, les décors et le son

**Un personnage par image.** Les sources maîtres sont des PNG RGBA en sRGB. Pour la garde, utiliser un cadre vertical commun et prévoir de la marge autour des bottes, du paquetage et de l’accessoire à sa plus grande portée. Nommer la tenue, le côté, l’action et l’index d’image. Consigner la ligne des pieds et le point d’ancrage dans les données d’animation. Recadrer à l’export en gardant les décalages. Les portraits et illustrations d’histoire ont leur propre cadrage. Une peinture de sélection recadrée à la taille d’un combattant ne vaut pas une pose de jeu.

**Animation cible par combattant.** Produire d’abord une garde de 8 images, marche avant et arrière de 8 chacune, démarrage et freinage de 4 chacun, puis trois phases de saut de 3, 4 et 3 images. Ajouter accroupissement et relèvement de 3 chacun, deux gardes de 4 chacune, deux réactions de 4 chacune, chute de 6 et relève de 6. Pour chaque normal, livrer anticipation, contact, prolongement et récupération. Pour chaque technique, livrer aussi au moins une image du signal qui annonce le danger. Les poses sont tenues plusieurs images de simulation selon l’action. La fluidité artistique ne doit jamais déplacer les fenêtres de touche déjà validées.

**Gauche et droite.** Préparer deux orientations dessinées dès qu’un accessoire asymétrique est visible. Le scanner et les marquages de Sam conservent leur implantation. Le fil, la capuche et les sangles gardent un sens clair pendant les passages de côté. Les ombres sont un calque moteur indépendant. En revue, afficher A puis B face au même mur et vérifier capsule, masque, mains, pied d’appui et lisibilité des silhouettes sur le goudron.

**Séparation et niveau de définition.** Les scènes d’histoire et les paysages peuvent viser un master 3 840 × 2 160. Documenter aussi les dimensions natives de chaque source générée. L’agrandissement d’un fichier ne vaut pas une génération native à cette définition. Pour un décor, livrer le ciel opaque, au moins deux plans intermédiaires transparents et le sol séparé. Contrôler les bords dévoilés par le déplacement de caméra. Un panoramique aplati peut servir de fond au prototype, mais la production définitive réclame les cinq éléments du devis ci-dessous.

| Lot cible du contenu complet | Quantité et livrable de contrôle |
| --- | --- |
| Sélection et combat | 6 portraits distincts et 6 gardes complètes de base. Revue commune des échelles sur une capture de duel, puis animation en images individuelles. |
| Narration | 18 illustrations, soit 6 introductions, 6 rivalités et 6 fins. Ajouter 6 storyboards de finalité, chacun avec amorce, action et résolution. |
| Décors | 6 arènes × 5 éléments séparés (ciel, lointain, moyen, proche, sol), soit 30 exports avant les variations météo. |
| Sons | Par personnage, sons de pas, de tissu, d’accessoire, d’impact et de signature. Par arène, une ambiance de fond et au moins un son localisable. Les cris de victoire et les musiques de fin ont une commande de volume indépendante. |

**Direction sonore.** Le cliquetis du paquetage distingue Sam, la sangle se tend avant le déplacement de Nell, le capteur de la MULE répond sur deux hauteurs, et l’arrivée de Fragile s’annonce par un coup de toile. Cliff fait entendre un souffle radio, Higgs un froissement de grains sous le masque. Réserver la bande médium aux signaux qui annoncent une action et baisser la musique pendant la courte réplique du rival. Les sons et compositions sont créés pour le fan game. Fournir versions isolées et boucles sans rupture.

**Interface et accessibilité.** Le HUD fixe le nom et la vitalité dans les coins hauts, les manches sous chaque nom et le Lien sous la ligne de pieds, en dehors de la piste. Au toucher ou à la souris, le menu pause donne accès à la liste de coups sans perdre la position. Autoriser remappage, sous-titres, musique et vibrations séparées, réduction des secousses et icônes en complément des couleurs. Sur écran tactile, faire migrer les actions de J1 en bas à droite et la croix en bas à gauche, avec taille et espacement réglables.

## 14. Production et critères d’acceptation

| Étape | Livrable de sortie | Essai de validation |
| --- | --- | --- |
| A · Boucle de duel | Deux combattants, un décor, sélection, manches, victoire, reprise, quatre entrées de mode. | Du menu au résultat et retour. Gagner et perdre de chaque côté. Vérifier KO, temps, double KO, pause et redimensionnement. |
| B · Fluidité | Jeu de poses et deux orientations pour Sam et Higgs, séparation définitive des plans, sons d’amorce et d’impact. | Contrôler les pieds fixes sur trois cycles de garde, les extrémités et la capsule dans les deux sens, les raccords des plans aux bords. |
| C · Quatre combattants supplémentaires | Six kits complets, routes à trois rencontres, scènes de rivalité et six finalités. | Valider chaque spécial contre garde, saut, prise et contre. Jouer chaque route de l’intro au générique et après une défaite. |
| D · Tournoi et maîtrise | Tableau configurable, exercices, galerie et historique des combats. | Tableau à 4 et 8, test à 6 entrants, noms identiques pour deux joueurs distincts, reprise après une demi-finale, enregistrement unique du champion. |
| E · Intégration au jeu principal | Lancement depuis le menu annexe, sauvegarde propre, réglages d’accès, chargement différé des ressources. | Lancer une partie existante, jouer un duel, revenir à la livraison, comparer le lieu, la cargaison et la progression de la campagne avant/après. |

**Contrats de données cibles.** Un identifiant stable par combattant, technique, arène et scène. L’animation indique durée de chaque pose, ancre, zones de touche et événement sonore. Un instantané de duel conserve positions, orientations, états, chronos, vie, Lien et générateur aléatoire de l’IA. La sauvegarde de progression contient une version de schéma, des chapitres débloqués et le tableau de tournoi. Une écriture interrompue doit pouvoir repartir du dernier résultat entier.

**Répartition des coûts.** Toujours charger la sélection. Pour un duel, charger seulement les deux combattants choisis, le lieu et les sons communs. Libérer les textures du match au retour au menu. Viser une image en moins de 16,7 ms à 60 Hz sur le matériel cible défini par le projet. Mesurer séparément calcul des collisions, mise à jour de l’IA et rendu. Les autres images peuvent être préparées en tâche de fond pendant le résultat, avec contrôle du poids du lot.

**Recette de combat.** Contrôler les six portraits à la même échelle. Pour chaque paire de combattants, essayer les deux côtés et inverser les contrôleurs. Compter 15 paires distinctes, 30 affectations orientées et 6 miroirs. Vérifier les interruptions, les coûts de jauge à 49, 50, 74, 75 et 100, le premier et le dernier instant de chaque fenêtre, les coins et les changements de côté. Rejouer un historique d’entrées en simulation fixe avec des rendus à 30, 60 et 120 Hz et comparer les résultats.

**Registre de fidélité.** Pour approuver une image, joindre la source officielle, l’édition et la tenue retenues, les points de comparaison visibles et une capture du résultat au format d’intégration. Classer chaque divergence par silhouette, équipement, couleur, orientation ou créature de fond. Un rendu propre peut encore demander une correction de forme. Le statut « validé » requiert une comparaison humaine.

## Sources primaires

[1] PlayStation France. Présentation du premier jeu, connexion des survivants et rôle de Sam. https://www.playstation.com/fr-fr/games/death-stranding/

[2] Kojima Productions. Conseils sur la région orientale, fret, MULEs, capteurs et lien. https://www.kojimaproductions.jp/en/DSTips

[3] PlayStation Blog. Équilibre, répartition du fret et Odradek dans le premier jeu. https://blog.playstation.com/2019/11/07/hit-the-ground-running-with-these-day-one-death-stranding-tips/

[4] PlayStation Blog Allemagne. Portraits illustrés de Sam, Higgs, Fragile et Clifford Unger, avec accessoires et capacités. https://blog.de.playstation.com/?p=141754

[5] Kojima Productions. Entretien avec Léa Seydoux sur le rôle et le caractère de Fragile. https://www.kojimaproductions.jp/index.php/en/behind-the-scenes-with-l%C3%A9a-seydoux

[6] Hideo Kojima, PlayStation Blog France. Présentation E3 2018 de la plage, des animaux échoués et de Sam. https://blog.fr.playstation.com/?p=77553

[7] PlayStation Blog Allemagne. Retour narratif sur le premier épisode, incluant la confrontation de Sam et Higgs. https://blog.de.playstation.com/2025/06/23/death-stranding-was-bisher-geschah/

Date de consultation des références : 18 novembre 2026.

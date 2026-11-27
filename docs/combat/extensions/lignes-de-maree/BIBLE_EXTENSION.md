# Les Lignes de Marée

## Bible de la méga-extension originale

**Death Stranding 2D · Échos de la Grève · Conception 1.0 du 27 novembre 2026.**

[Catalogue complet](catalog.json) · [Sources et limites du canon](SOURCES.md) · [Plan de production](PRODUCTION.md) · [Bible principale](../../BIBLE_COMBAT.md) · [Extensions du guide](../../EXTENSIONS_COMBAT.md).

Les Lignes de Marée ajoute une continuité originale au fan-game : dix spécialistes, vingt lieux reliés, vingt types d’ennemis et vingt rencontres majeures. Leur ambition visuelle est celle d’un spin-off cohérent avec Death Stranding. Ces créations ne sont ni des personnages officiels, ni des lieux retrouvés dans une œuvre existante. Le catalogue précise les futurs kits, les règles de rencontre et les besoins de production ; une fiche complète ou un PNG fixe ne suffit pas à rendre son contenu jouable.

**État de réception du 27 novembre : 70 bases visuelles reçues, dont les 20 panoramas raccordés comme arènes statiques. Les 10 kits originaux, 20 IA ennemies, 20 rencontres boss et missions restent en conception prête à implémenter. Le [bilan de la passe](../../production/20261127-lignes-de-maree/BILAN.md) et les statuts de `catalog.json` précisent cette frontière.**

## 1. Promesse et place dans le projet

Un corridor côtier dépend de refuges, de réserves d’eau et de voies de fret fragiles. Plusieurs responsables ont fini par confondre protection et rétention : les colis sont gardés, les reçus conservés et les personnes traitées comme une interruption du service. Dix spécialistes cherchent à remettre les choses en circulation, chacun avec une raison personnelle de garder quelque chose. Le dénouement consiste à rendre un passage et un choix aux habitants. Il ne réécrit pas le destin de Sam et ne crée pas une nouvelle extinction.

Le récit occupe une région fictive volontairement non localisée sur la carte canonique, à une époque non datée. Les techniques s’appuient sur des familles de matériel déjà cohérentes avec l’univers ; les assemblages locaux, leurs noms et les machines ennemies restent originaux. Les reconstitutions du terminal permettent les combats BT sans attribuer au sang des dix humains une propriété qui appartient aux sources de référence.

| Domaine | Cible conçue | Ce que cette unité signifie |
| --- | --- | --- |
| characters | 10 | Fiches de futurs combattants, pas ajout automatique au roster |
| stages | 20 | Lieux distincts ; cinq plans séparés à produire chacun |
| enemies | 20 | Comportements et silhouettes distincts |
| bosses | 20 | Rencontres à trois phases et objectifs propres |
| props | 20 | Objets autonomes |
| gadgets | 10 | Équipement propre aux dix spécialistes |
| vehicles | 4 | Transport et missions |
| projectiles | 12 | Fichiers indépendants des lanceurs |
| missions | 20 | Quatre chapitres de cinq missions |
| bonusChallenges | 6 | Épreuves de terminal |
| duos | 5 | Cinq paires prioritaires |

## 2. Règles de cohérence

| ID | Règle | Application |
| --- | --- | --- |
| LDM-L01 | Statut original | Tous les nouveaux noms, lieux, rencontres et techniques sont des créations de ce fan-game. La qualité visée est celle d’un spin-off, sans attribution officielle ni intégration au canon. |
| LDM-L02 | Continuité latérale | Corridor côtier fictif non localisé sur la carte officielle et époque volontairement non datée. Aucun événement de DS1/DC/DS2 n’est modifié, aucun personnage canonique n’a de nouvelle parenté ou mort. |
| LDM-L03 | Humains ordinaires | Les dix spécialistes sont humains, sans rapatriement ni téléportation, sans DOOMS distribué gratuitement et sans BB utilisé comme arme. L’équipement et les limites de chaque kit restent visibles. |
| LDM-L04 | Non-létal humain | Les confrontations humaines visent immobilisation, reddition ou récupération du fret. Les conclusions de simulation n’introduisent pas de décès dans la campagne. |
| LDM-L05 | Hématiques bornés | L’efficacité hématique n’est pas attribuée au sang ordinaire des originaux. Les rencontres BT sont des reconstitutions utilisant un consommable simulé documenté ; aucune faculté biologique nouvelle. |
| LDM-L06 | Timefall et matière | La pluie temporelle use les contenants et structures exposés ; la mise en scène évite de guérir ou ressusciter par la pluie. Le spray protège/répare le contenant, pas son contenu déjà endommagé. |
| LDM-L07 | Technologie contrainte | Énergie, masse, terrain et couverture réseau limitent les dispositifs. Les machines originales sont des outils civils détournés localement, sans autonomie ou armement miraculeux déclaré canonique. |
| LDM-L08 | Manifestations locales | Les noms des dix boss et six ennemis BT sont des appellations originales d’archives de simulation, jamais de nouvelles espèces officielles, divinités ou causes du Death Stranding. |
| LDM-L09 | Lisibilité compétitive | Les hazards sont des objectifs scénarisés optionnels. Le profil Versus utilise un sol fixe, des limites symétriques et des effets sans collision ; le décor ne cache pas les télégraphes. |
| LDM-L10 | Fidélité des originaux | Le 1:1 porte sur la cohérence entre la fiche originale approuvée, ses futures poses et accessoires. Il ne peut certifier une ressemblance à une source canonique inexistante. |

Les sources officielles établissent les contraintes générales, pas l’existence de ces originaux. La distinction entre fait sourcé et adaptation est détaillée dans [SOURCES.md](SOURCES.md). La fidélité 1:1 d’un original sera contrôlée contre sa fiche validée et ses poses de référence. Pour un élément canonique, elle reste contrôlée contre son œuvre et sa version.

## 3. Direction visuelle, son et lecture du combat

La matière prime : textile étanche lourd, métal et polymères usés, mousses de protection, sangles fonctionnelles, boue, condensation et corrosion localisée. La palette reste minérale : graphite, bleu acier, vert olive froid, ivoire sale et touches de signalisation orange ou ambre. Le blanc lumineux, le cyan et l’or restent rares et ont une fonction lisible. Les silhouettes humaines sont des silhouettes de travail ; la taille des colis, la position du dos et les outils font lire le rôle avant la couleur.

Une image contient un seul personnage, un seul adversaire, un seul projectile ou un seul prop. Une arène reçoit un panorama de composition puis cinq images autonomes : ciel, lointain, intermédiaire, sol et premier plan. Un panorama n’est pas décrit comme cinq plans parce que le moteur le déplace. Les cordes, filets, crochets, caisses et effets sont séparés de leur lanceur quand leur mouvement l’exige. Aucun logo officiel inventé, aucun BB utilitaire, aucun masque célèbre collé à un original.

Les attaques sont d’abord annoncées par une prise d’appui, une action d’outil et un son fonctionnel. Câble tendu, frein qui monte, vanne qui se ferme, pas dans l’eau et souffle d’un filtre portent l’information. Les voix restent originales, sans imitation d’acteur. Une annonce sonore possède un équivalent visuel et textuel ; tremblements, flashs et brume peuvent être réduits sans perdre le contre.

## 4. Les dix spécialistes

Les chiffres ci-dessous sont un point de départ de conception à 60 pas/seconde. Ils ne certifient pas un équilibrage ni une intégration au moteur. La jauge Chiral est un budget de simulation ; les personnages n’acquièrent pas de pouvoirs biologiques. Les costumes changent l’apparence et gardent les collisions.

### Maëlle « Balise » Rocher

**ID :** `ldm-char-balise` · **Rôle :** Ancrage / interception · **Âge :** 38 ans.

Sauvetage côtier. Retrouver les personnes derrière les colis anonymes.

**Silhouette :** Femme athlétique, cheveux noirs courts, combinaison graphite étanche, demi-plastron orange sauvetage, bobine de corde hanche gauche, mousquetons et bottes lourdes.

**Limite :** Surcharge morale : elle refuse de quitter une balise de secours active.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Courte traction au lien | T | 28 | 18 / 4 / 24 | Une corde lancée à 2,4 largeurs de corps retient brièvement au sol ; garde ou saut évitent la boucle. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Ancrage de rappel | 6+T | 18 | 24 / 1 / 21 | Pose un anneau d’ancrage à 1,5 corps ; aucune collision avant 24 pas et un seul anneau. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Reprise de corde | 4+T | 16 | 10 / 6 / 22 | Rejoint l’anneau par traction physique visible, sans traverser le rival ni éviter les coups gratuitement. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Ligne de vie :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Passage sécurisé — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Passage sécurisé :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Vérifie son mousqueton. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — Une lumière pour personne**

Introduction : Une balise clignote à côté d’un colis sans destinataire ; Maëlle décide de suivre ses retours.

| Rival original | Désaccord |
| --- | --- |
| Oren « Contrevoie » Pike | Désaccord sur la priorité du fret et du passage. |
| Tariq « Écluse » Moss | Vérifier une solution de terrain avant d’exposer un refuge. |
| Célia « Archive » Ward | Choisir une restitution équitable après le conflit. |

Lieux : La Digue aval, La Serre de veille, Le Seuil de la marée. Rencontre finale : **Le Consignateur**.

Épilogue : Elle pose un panneau de passage commun : chacun peut demander secours sans céder ses données.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-balise` du catalogue.

### Jonas « Lest » Vale

**ID :** `ldm-char-lest` · **Rôle :** Pression lente / anti-approche · **Âge :** 52 ans.

Manutention lourde. Acheminer un groupe électrogène sans sacrifier les derniers refuges.

**Silhouette :** Homme noir trapu et large, crâne rasé, barbe grise courte, tenue kaki sombre, exosquelette industriel au bas du dos et aux jambes, caisse courte sanglée.

**Limite :** Batterie et inertie : une charge manquée impose un long retour en appui.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Épaule de portage | T | 28 | 23 / 4 / 24 | Poussée de charge à 1,2 corps ; un seul léger absorbé pendant 4 pas, aucun projectile. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Calage du caisson | 6+T | 18 | 24 / 1 / 21 | Pose son caisson bas, qui ferme une approche au sol pendant 120 pas puis est repris. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Délestage contrôlé | 4+T | 16 | 10 / 6 / 22 | Reprend le caisson et recule de 0,6 corps ; absent, aucune dépense ni action gratuite. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Appui massif :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Charge déposée — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Charge déposée :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Resserre son harnais. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — Le poids partagé**

Introduction : Un moteur s’arrête au milieu du quai ; Jonas choisit de porter les batteries plutôt que les vendre.

| Rival original | Désaccord |
| --- | --- |
| Elias « Relais » Reed | Désaccord sur la priorité du fret et du passage. |
| Jun « Sillage » Akiyama | Vérifier une solution de terrain avant d’exposer un refuge. |
| Maëlle « Balise » Rocher | Choisir une restitution équitable après le conflit. |

Lieux : Le Quai des refuges, L’Atelier du réservoir, Le Seuil de la marée. Rencontre finale : **La Remorque du ressac**.

Épilogue : Le générateur alimentera la cuisine et le sas : le chargement le plus lourd aura été partagé.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-lest` du catalogue.

### Inès « Suture » Sorel

**ID :** `ldm-char-suture` · **Rôle :** Défense / contrôle court · **Âge :** 43 ans.

Secours et tri médical. Rouvrir un itinéraire de secours fermé à ceux sans contrat de livraison.

**Silhouette :** Femme métisse, cheveux bouclés attachés, combinaison ivoire usée et graphite, kit médical rigide flanc droit, petit tissu bordeaux court au col, gants.

**Limite :** Aucune guérison instantanée : la trousse stabilise les objectifs de mission, pas la vitalité en boucle.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Lien de contention | T | 28 | 18 / 4 / 24 | Interception au lien à très courte portée ; ne prend ni projectile ni cible aérienne. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Écran de tri | 6+T | 18 | 24 / 1 / 21 | Déploie une petite cloison de tri simulée, durable un impact ou 100 pas, sans soin de vie. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Décalage de secours | 4+T | 16 | 10 / 6 / 22 | Pas latéral représenté par un recul de 0,7 corps ; sortie vulnérable et trousse toujours tenue. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Couverture sanitaire :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Évacuation calme — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Évacuation calme :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Vérifie sa trousse. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — Sans formulaire**

Introduction : Une demande de secours a été refusée pour inventaire incomplet ; Inès emporte sa trousse.

| Rival original | Désaccord |
| --- | --- |
| Naya « Isobare » Quill | Désaccord sur la priorité du fret et du passage. |
| Oren « Contrevoie » Pike | Vérifier une solution de terrain avant d’exposer un refuge. |
| Célia « Archive » Ward | Choisir une restitution équitable après le conflit. |

Lieux : La Serre de veille, La Station de captage, Le Seuil de la marée. Rencontre finale : **La Gardienne de la serre**.

Épilogue : Elle classe la dernière urgence sous le nom de son patient et laisse le formulaire ouvert.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-suture` du catalogue.

### Elias « Relais » Reed

**ID :** `ldm-char-relais` · **Rôle :** Placement / information · **Âge :** 29 ans.

Maintenance des relais. Rétablir des appels d’urgence à travers les coupures du réseau local.

**Silhouette :** Homme est-asiatique mince, cheveux noirs raides, combinaison bleu ardoise, sac radio haut et étroit, antenne repliable unique à gauche, terminal compact.

**Limite :** Le scanner ne lit ni l’avenir ni les BT à travers tous les obstacles ; son repère est une information de simulation.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Impulsion balisée | T | 28 | 18 / 4 / 24 | Impulsion de scanner non offensive mémorisant une position 90 pas ; n’attaque pas une cible invisible. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Pose de relais | 6+T | 18 | 24 / 1 / 21 | Pose un seul répéteur, qu’un contact adverse détruit et qui étend de 0,4 corps la prochaine impulsion. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Décrochage court | 4+T | 16 | 10 / 6 / 22 | Replie l’antenne et décale son appui ; le répéteur reste à sa place avec son propriétaire. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Signal partagé :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Canal ouvert — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Canal ouvert :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Écoute son oreillette. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — Les mots incomplets**

Introduction : Le dernier appel arrive incomplet ; Elias refuse de remplacer la voix par une estimation.

| Rival original | Désaccord |
| --- | --- |
| Jonas « Lest » Vale | Désaccord sur la priorité du fret et du passage. |
| Alma « Vigie » Voss | Vérifier une solution de terrain avant d’exposer un refuge. |
| Tariq « Écluse » Moss | Choisir une restitution équitable après le conflit. |

Lieux : Le Relais des vents, Le Dépôt des amarres, Le Seuil de la marée. Rencontre finale : **Le Radôme errant**.

Épilogue : La liaison revient avec ses silences et ses hésitations ; il laisse chaque refuge choisir quand répondre.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-relais` du catalogue.

### Naya « Isobare » Quill

**ID :** `ldm-char-isobare` · **Rôle :** Distance / tempo · **Âge :** 34 ans.

Observation météo. Maintenir une route fiable lorsque les prévisions sont transformées en péages.

**Silhouette :** Femme autochtone haute silhouette, tresse courte, parka graphite vert froid, capuchon rabattu, anémomètre compact épaule droite, plaques céramiques mates.

**Limite :** Elle observe le temps sans le commander ; fumée et abris sont matériels et localisés.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Capsule de brume | T | 28 | 18 / 4 / 24 | Capsule de fumée de simulation : atténue le fond dans une petite zone sans masquer les silhouettes ni inverser les commandes. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Abri de passage | 6+T | 18 | 24 / 1 / 21 | Pose un écran d’abri court ; bloque un seul projectile de simulation et se replie sous un coup fort. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Pas sous le vent | 4+T | 16 | 10 / 6 / 22 | Pas de retrait synchronisé sur son geste météo ; aucune modification du vent réel ni du chronomètre. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Fenêtre calme :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Front traversé — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Front traversé :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Observe l’anémomètre. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — Laisser passer le temps**

Introduction : Une fenêtre météo a été volontairement retirée des avis publics ; Naya publie son relevé.

| Rival original | Désaccord |
| --- | --- |
| Inès « Suture » Sorel | Désaccord sur la priorité du fret et du passage. |
| Elias « Relais » Reed | Vérifier une solution de terrain avant d’exposer un refuge. |
| Maëlle « Balise » Rocher | Choisir une restitution équitable après le conflit. |

Lieux : Le Relais des vents, La Terrasse des veilleurs, Le Seuil de la marée. Rencontre finale : **Le Cerf de brume**.

Épilogue : Le panneau annonce une marge d’incertitude et plusieurs trajets, pour laisser les voyageurs décider.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-isobare` du catalogue.

### Oren « Contrevoie » Pike

**ID :** `ldm-char-contrevoie` · **Rôle :** Portée / vol de tempo · **Âge :** 46 ans.

Ancien récupérateur de fret. Restituer les cargaisons volées sans redevenir le collecteur qu’il était.

**Silhouette :** Homme blanc massif, cheveux très courts, ancienne tenue cargo ocre réparée, large gilet sans symbole officiel, perche électrique démontable à droite, gants isolés.

**Limite :** Sa perche consomme une batterie ; la récupération de fret ne devient jamais un vol permanent d’équipement adverse.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Perche d’arrêt | T | 28 | 18 / 4 / 24 | Balayage de perche à 2 corps, lisible et lent ; garde basse adaptée selon la table finale, batterie consommée. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Bola de retour | 6+T | 18 | 24 / 1 / 21 | Tire une bola de simulation basse non létale ; saut ou garde arrête la retenue. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Prise de sangle | 4+T | 16 | 10 / 6 / 22 | Attrape une sangle à courte portée, déprojection possible ; aucun vol d’objet de progression. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Ouverture de convoi :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Fret restitué — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Fret restitué :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Éteint puis range sa perche. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — L’adresse retrouvée**

Introduction : Une caisse porte encore une marque qu’il utilisait ; Oren retrouve l’adresse effacée.

| Rival original | Désaccord |
| --- | --- |
| Maëlle « Balise » Rocher | Désaccord sur la priorité du fret et du passage. |
| Inès « Suture » Sorel | Vérifier une solution de terrain avant d’exposer un refuge. |
| Célia « Archive » Ward | Choisir une restitution équitable après le conflit. |

Lieux : Le Triage noyé, Le Quai des refuges, Le Seuil de la marée. Rencontre finale : **Le Chef de triage**.

Épilogue : Il remet la dernière caisse et repart avec un reçu signé par son destinataire.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-contrevoie` du catalogue.

### Alma « Vigie » Voss

**ID :** `ldm-char-vigie` · **Rôle :** Mobilité sobre / punition · **Âge :** 61 ans.

Reconnaissance des routes. Décrire une voie sûre dont aucune machine n’a enregistré les petites traversées.

**Silhouette :** Femme noire sèche et musclée, cheveux gris très courts, tenue olive sombre, manteau court dissymétrique, jumelles rabattues sur poitrine, bottes de montagne.

**Limite :** Jumelles et expérience n’accordent pas de visée à travers les murs ni d’invulnérabilité.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Appui décalé | T | 28 | 18 / 4 / 24 | Avancée courte après feinte de pied, vulnérable pendant le déplacement. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Balise de pied | 6+T | 18 | 24 / 1 / 21 | Pose une balise visible au sol ; repère d’entraînement sans piège invisible ni dégâts autonomes. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Retrait de pente | 4+T | 16 | 10 / 6 / 22 | Recule vers la balise si le trajet est libre ; portée plafonnée et récupération identique sur échec. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Angle sûr :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Route dégagée — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Route dégagée :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Nettoie ses jumelles. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — Les chemins absents**

Introduction : Alma remarque que la vieille piste absente des cartes est encore entretenue par quelqu’un.

| Rival original | Désaccord |
| --- | --- |
| Elias « Relais » Reed | Désaccord sur la priorité du fret et du passage. |
| Naya « Isobare » Quill | Vérifier une solution de terrain avant d’exposer un refuge. |
| Jun « Sillage » Akiyama | Choisir une restitution équitable après le conflit. |

Lieux : La Pente des cairns, Le Col de Contrevent, Le Seuil de la marée. Rencontre finale : **L’Alpiniste du seuil**.

Épilogue : Elle trace plusieurs chemins et laisse à côté la place pour le suivant.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-vigie` du catalogue.

### Tariq « Écluse » Moss

**ID :** `ldm-char-ecluse` · **Rôle :** Saisie / contrôle du sol · **Âge :** 40 ans.

Technicien des ouvrages. Rendre la circulation de l’eau et du fret aux refuges qui en dépendent.

**Silhouette :** Homme moyen-oriental, barbe courte, combinaison pétrole et gris, protections de chantier aux genoux, sangle roulée épaule gauche, pince industrielle émoussée.

**Limite :** Ses outils agissent à portée ; aucune commande hydraulique ne vise le corps d’un humain.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Sangle de verrou | T | 28 | 18 / 4 / 24 | Prise à la sangle avec fenêtre de déprojection ; échoue si cible aérienne. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Butée mobile | 6+T | 18 | 24 / 1 / 21 | Pose une butée de chantier destructible après armement, limitée à un objet. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Reprise de palan | 4+T | 16 | 10 / 6 / 22 | Traction courte de la butée, sans mouvement d’arène ni interaction hydraulique sur un corps. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Arrêt de sécurité :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Sas libéré — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Sas libéré :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Contrôle la sangle. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — La clé locale**

Introduction : Un sas ne s’ouvre plus pour les petits porteurs ; Tariq emporte sa propre clé mécanique.

| Rival original | Désaccord |
| --- | --- |
| Maëlle « Balise » Rocher | Désaccord sur la priorité du fret et du passage. |
| Elias « Relais » Reed | Vérifier une solution de terrain avant d’exposer un refuge. |
| Jonas « Lest » Vale | Choisir une restitution équitable après le conflit. |

Lieux : L’Écluse noire, La Station de captage, Le Seuil de la marée. Rencontre finale : **Le Mécanisme de l’écluse**.

Épilogue : L’ouvrage est réparé avec une commande locale utilisable sans validation distante.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-ecluse` du catalogue.

### Jun « Sillage » Akiyama

**ID :** `ldm-char-sillage` · **Rôle :** Mobilité / ressources brèves · **Âge :** 25 ans.

Réparation des transports. Empêcher que les machines réparables soient abandonnées avec leurs cargaisons.

**Silhouette :** Personne androgyne japonaise compacte, cheveux noirs mi-courts sous bonnet graphite, combinaison grise et bleu froid, gants mécano, châssis de réparation dorsal bas.

**Limite :** La réparation n’est pas magique ni instantanée ; les interventions se font hors attaque et consomment des pièces.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Pas de roulement | T | 28 | 18 / 4 / 24 | Esquive au sol courte, sans invulnérabilité ; rapprochement rapide mais faible garde. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Coin de maintenance | 6+T | 18 | 24 / 1 / 21 | Pose un coin de roue bas visible, qui peut être retiré par un coup léger à portée. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Reprise d’outil | 4+T | 16 | 10 / 6 / 22 | Récupère son coin et change d’appui ; aucune réparation de vitalité et aucun stock illimité. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Remise en marche :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Moteur au repos — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Moteur au repos :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Tourne une clé dans sa paume. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — Ce qui roule encore**

Introduction : Le journal d’entretien contient plus de noms de porteurs que de numéros de série.

| Rival original | Désaccord |
| --- | --- |
| Jonas « Lest » Vale | Désaccord sur la priorité du fret et du passage. |
| Alma « Vigie » Voss | Vérifier une solution de terrain avant d’exposer un refuge. |
| Oren « Contrevoie » Pike | Choisir une restitution équitable après le conflit. |

Lieux : L’Atelier du réservoir, La Gare suspendue, Le Seuil de la marée. Rencontre finale : **La Rame sans conducteur**.

Épilogue : Jun fixe une fiche de réparation ouverte sur chaque véhicule remis en route.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-sillage` du catalogue.

### Célia « Archive » Ward

**ID :** `ldm-char-archive` · **Rôle :** Feintes / placement méthodique · **Âge :** 57 ans.

Archivage des liaisons. Sauver les témoignages sans transformer leur conservation en confiscation.

**Silhouette :** Femme blanche grande, cheveux argent attachés, tenue graphite et mastic, manteau de pluie court structuré, deux étuis hermétiques au flanc gauche, terminal avant-bras droit.

**Limite :** Les hologrammes sont des leurres de simulation ; ni personnes ressuscitées ni données privées obtenues sans consentement.

| Technique | Commande cible | Coût | Anticipation / actif / retour | Effet et contre |
| --- | --- | --- | --- | --- |
| Reçu leurre | T | 28 | 18 / 4 / 24 | Projette un seul reçu holographique clairement non corporel ; aucun dégât, aucun second combattant. Garder puis punir la récupération ; la portée reste affichée au dojo. |
| Cache de passage | 6+T | 18 | 24 / 1 / 21 | Place un étui-refuge au sol ; objet de positionnement qui se dissipe après 120 pas. Contester la pose avant armement ou sortir du repère ; un seul objet actif. |
| Réponse différée | 4+T | 16 | 10 / 6 / 22 | Rappelle le leurre, puis donne un bref coup d’étui si le rival s’est avancé à portée ; aucune lecture des entrées. Attendre le déplacement annoncé et frapper sa récupération ; aucune traversée intangible. |

**Assistance — Trace commune :** 25 Cohésion, annonce de 24 pas, 5 actifs et 26 de sortie ; partenaire vulnérable et une seule intervention.

**Super — Dossier rendu — séquence :** 100 Chiral, contact confirmé ; maîtrise non létale puis retour au neutre. **Conclusion — Dossier rendu :** après victoire uniquement, immobilisation relâchée et passage ouvert ; adversaire vivant.

**Geste :** Scelle son étui. Entrée/tenue/sortie 10/28/16, vulnérable, sans gain de jauge. La sélection vérifie l’outil ; la désélection le range et retire le personnage sans bloquer le nouveau choix.

**Campagne — La copie et la voix**

Introduction : La date de remise d’une lettre a été remplacée par une date de stockage ; Célia ouvre le dossier.

| Rival original | Désaccord |
| --- | --- |
| Oren « Contrevoie » Pike | Désaccord sur la priorité du fret et du passage. |
| Inès « Suture » Sorel | Vérifier une solution de terrain avant d’exposer un refuge. |
| Maëlle « Balise » Rocher | Choisir une restitution équitable après le conflit. |

Lieux : Les Archives de béton, Le Triage noyé, Le Seuil de la marée. Rencontre finale : **L’Archiviste fermée**.

Épilogue : Les originaux retournent à leurs propriétaires ; les copies ne restent que si ceux-ci le demandent.

**Costumes :** Terrain — Tenue de base de la fiche, équipement fonctionnel complet.; Pluie longue — Surcouche étanche correspondant à la même silhouette ; outils et côtés conservés.; Retour au refuge — Surcouche déposée, harnais allégé ; mêmes collisions et capacités en simulation.

**Production :** portrait, stance, actions, impacts, saut, entrée/tenue/sortie du geste, sélection/désélection, trois scènes de récit et conclusion sont des unités distinctes. Le détail figure dans `ldm-char-archive` du catalogue.

## 5. Les vingt lieux et leur continuité

Les liens sont bidirectionnels et l’ensemble est connecté. Le premier parcours ouvre les liaisons par mission ; le retour permet de revisiter. Les raccourcis représentent des passages de service de ce corridor fictif, sans déplacement instantané accordé aux personnages. Portes, escaliers, ponts, câbles et conduites doivent rejoindre des volumes plausibles.

### Chapitre 1 — Le rivage retient

Sauver un accès avant de réclamer sa destination.

#### La Digue aval

`ldm-stage-digue-aval` — Premier point de secours et apprentissage du passage partagé.

Digue basse en béton usé, rivage basaltique noir, océan froid brumeux, refuges de secours étanches et câbles d’ancrage ; voie horizontale humide dégagée.

**Objectif :** Livrer une caisse étanche à la balise sans la laisser dans l’eau. **Rencontre :** Le Consignateur.

**Scénario :** Rafales de pluie visibles sur le fond ; abri utile seulement en mission. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Quai des refuges, La Serre de veille. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Quai des refuges

`ldm-stage-quai-refuges` — Quai habité reliant les petits refuges du corridor.

Petit quai de fret reliant trois refuges préfabriqués gris pâle, bollards et rails de chargement, béton humide, mer bleu acier et falaises noires.

**Objectif :** Acheminer trois lots vers leurs refuges plutôt que tout conserver au quai. **Rencontre :** La Remorque du ressac.

**Scénario :** Grue au fond et activité de fret désactivée sur la ligne de duel. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** La Digue aval, Le Dépôt des amarres. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Dépôt des amarres

`ldm-stage-depot-amarres` — Réserve de cordages nécessaire aux routes de secours.

Dépôt abrité de cordages et matériel de sauvetage, bobines sur rayonnages du fond, caisses ivoire étanches, lampes ambre et large sol caoutchouté libre.

**Objectif :** Récupérer deux bobines et réarmer une ligne de secours. **Rencontre :** Le Veilleur des balises.

**Scénario :** Palan de fond suspendu ; collisions uniquement sur accessoires explicitement marqués en mission. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Quai des refuges, Le Bassin muet, Le Triage noyé. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Bassin muet

`ldm-stage-bassin-muet` — Première archive des phénomènes de poix au contact des quais.

Bassin de marée abandonné rempli de poix derrière un quai de service sec ; ossatures d’entrepôts submergées au loin et brume à rares particules pâles.

**Objectif :** Observer trois repères depuis le quai sec, puis évacuer. **Rencontre :** Le Treuil d’amarre.

**Scénario :** Montée de poix annoncée par jauge et grondement dans le profil scénario. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Dépôt des amarres, Le Phare couché. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Phare couché

`ldm-stage-phare-couche` — Ancien signal côtier devenu point de rendez-vous.

Tour de navigation cylindrique effondrée sur des rochers noirs au fond ; passerelle de contournement intacte au premier plan, pluie et vagues distantes.

**Objectif :** Récupérer le module de la balise effondrée et rejoindre le passage stable. **Rencontre :** Le Cétacé de rive.

**Scénario :** Ressac derrière la passerelle, sans déplacer les combattants en Versus. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Bassin muet, La Serre de veille. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

### Chapitre 2 — Ce qui nous maintient

Eau, nourriture, météo et chemin ne doivent pas devenir des péages.

#### La Serre de veille

`ldm-stage-serre-veille` — Centre de subsistance indépendant qui refuse les prélèvements forcés.

Serre modulaire étanche sous pluie, vitres renforcées, cultures modestes derrière une allée de béton libre, irrigation fonctionnelle et éclairage blanc froid.

**Objectif :** Stabiliser l’alimentation des cultures et remettre les filtres demandés. **Rencontre :** La Gardienne de la serre.

**Scénario :** Buée et gouttes restent hors silhouettes ; panne d’alimentation annoncée en mission. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** La Digue aval, Le Phare couché, La Station de captage. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### La Station de captage

`ldm-stage-station-captage` — Ressource en eau protégée par des dispositifs de contrôle local.

Station de captage et filtration, réservoirs cylindriques fermés et unités de filtres derrière un pont de maintenance antidérapant ; tuyaux reliés et portes ancrées.

**Objectif :** Changer deux filtres et transférer l’eau vers le refuge prioritaire. **Rencontre :** Le Collecteur noir.

**Scénario :** Pompes en alternance et sols signalés humides, sans glissade aléatoire en Versus. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** La Serre de veille, Le Viaduc de l’Ourlet. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Viaduc de l’Ourlet

`ldm-stage-viaduc-ourlet` — Passage limité par une autorité de chantier qui réclame les cargaisons.

Viaduc de béton praticable au-dessus d’une gorge noire, tablier horizontal, garde-corps au fond, ancienne voie haute distante, nuages bas et mince cascade.

**Objectif :** Traverser avec charge équilibrée puis déverrouiller le chemin de service. **Rencontre :** La Grue verrou.

**Scénario :** Vent latéral désactivé en compétition ; vibrations scénarisées télégraphiées. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** La Station de captage, Le Relais des vents, Le Col de Contrevent. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Relais des vents

`ldm-stage-relais-anemometre` — Lieu des prévisions et de la confiance entre porteurs.

Relais météo sur lande sombre, mât à coupelles derrière un abri étanche, chemins de câbles, indicateurs cyan sobres et herbes inclinées hors de la voie.

**Objectif :** Relever trois instruments et transmettre la fenêtre météo aux refuges. **Rencontre :** Le Contremaître du pont.

**Scénario :** Rafales annoncées par manches à air, avec fenêtres calmes reproductibles. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Viaduc de l’Ourlet, La Pente des cairns. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### La Pente des cairns

`ldm-stage-pente-cairns` — Voie entretenue à la main par les voyageurs.

Sentier de secours en corniche horizontale stable, cairns simples et cordes ancrées aux extrémités, mousse sombre, basalte et falaises brumeuses superposées.

**Objectif :** Poser deux ancrages puis escorter un porteur jusqu’à l’abri. **Rencontre :** Le Cerf de brume.

**Scénario :** Pierres tombantes uniquement hors voie de duel ; danger de mission marqué avant impact. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Relais des vents, Le Triage noyé, La Terrasse des veilleurs. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

### Chapitre 3 — La circulation des voix

Rendre les machines, les caisses et les témoignages à leur usage.

#### Le Triage noyé

`ldm-stage-triage-noye` — Nœud de redistribution devenu un dépôt de rétention.

Triage de fret inondé, conteneurs et aiguillages à demi submergés au fond, quai surélevé intact comme voie de combat, eau noire et petites lampes ambre.

**Objectif :** Identifier quatre caisses grâce aux reçus puis les remettre aux bonnes voies. **Rencontre :** Le Chef de triage.

**Scénario :** Montée d’eau distante ; rails au sol non bloquants en Versus. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Dépôt des amarres, La Pente des cairns, La Gare suspendue. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### La Gare suspendue

`ldm-stage-gare-suspendue` — Liaison aérienne de fret dont le service automatique s’est enfermé.

Gare de monorail de fret surélevée, chariot à l’arrêt sur rail suspendu fonctionnel, colonnes porteuses, plancher de maintenance libre et lumière froide.

**Objectif :** Couper une boucle de retour et rendre la cargaison à son destinataire. **Rencontre :** La Rame sans conducteur.

**Scénario :** Mouvements du chariot au fond ; rame active seulement en Boss/scénario. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Triage noyé, L’Atelier du réservoir. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### L’Atelier du réservoir

`ldm-stage-atelier-reservoir` — Point de réparation des transports sans privilège de propriétaire.

Atelier de réparation contre un grand réservoir d’eau, manomètres et armoires fermées, outils suspendus au fond, matières grises et olive usées, sol libre.

**Objectif :** Réparer trois sous-ensembles avec un stock de pièces limité. **Rencontre :** Le Porteur sans retour.

**Scénario :** Outils suspendus immobiles et machines de fond non dangereuses en Versus. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** La Gare suspendue, L’Écluse noire. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### L’Écluse noire

`ldm-stage-ecluse-noire` — Interface entre eau propre, bassin fermé et circulation du corridor.

Écluse séparant les eaux côtières d’un bassin contaminé, lourdes portes derrière pont de service, treuils ancrés sur les côtés, fer gris froid et rouille.

**Objectif :** Ouvrir le sas de service dans l’ordre vérifié sans inonder les refuges. **Rencontre :** Le Mécanisme de l’écluse.

**Scénario :** Portes arrière et alarme hydraulique ; séquence scénarisée clairement temporisée. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** L’Atelier du réservoir, Les Archives de béton. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Les Archives de béton

`ldm-stage-archive-beton` — Lieu où conserver peut devenir une manière de confisquer.

Archives souterraines dans bunker de béton, cassettes hermétiques derrière vitrines, petit terminal cyan pâle, porte reliée au mur, lampes sur batterie ambre.

**Objectif :** Restituer trois témoignages avec accord des propriétaires et exporter leur reçu. **Rencontre :** L’Archiviste fermée.

**Scénario :** Aucune hazard ; perte de lumière de mission avec balises accessibles sans couleur seule. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** L’Écluse noire, Le Col de Contrevent, Le Seuil de la marée. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

### Chapitre 4 — Laisser partir

Le corridor s’ouvre quand ses habitants gardent le choix du passage.

#### Le Col de Contrevent

`ldm-stage-col-contrevent` — Dernier passage terrestre vers les sites d’observation.

Col exposé de roche sombre et neige tassée, piste renforcée horizontale, cordes fixées aux piquets aux bords, pentes naturelles et nuages d’altitude froids.

**Objectif :** Préparer la corde, alléger le fret puis franchir la fenêtre calme. **Rencontre :** L’Alpiniste du seuil.

**Scénario :** Rafales et neige visuelles en Versus ; adhérence fixe. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Viaduc de l’Ourlet, Les Archives de béton, Le Plateau des aiguilles. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Plateau des aiguilles

`ldm-stage-plateau-aiguilles` — Zone dégagée où le silence permet de lire les manifestations.

Plateau basaltique ouvert, aiguilles rocheuses érodées dans le lointain, câble de maintenance bas à l’horizon, voie de pierre charbon et mousse rare.

**Objectif :** Repérer le trajet sûr, éviter les ancrages instables et rejoindre le relais. **Rencontre :** L’Araignée des haubans.

**Scénario :** Filaments sombres en arrière-plan ; aucun effet camouflant les attaques. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Col de Contrevent, Le Radôme ébréché. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Radôme ébréché

`ldm-stage-radome-ebreche` — Dernier maillon de communication utilisable avant l’estran.

Radôme météo endommagé sur bâtiment technique bas, escaliers rejoignant les portes, conduits et clôtures coupe-vent derrière large aire de béton humide.

**Objectif :** Rétablir trois circuits de communication et désactiver la boucle de poursuite. **Rencontre :** Le Radôme errant.

**Scénario :** Balayage lumineux non éblouissant ; rotation uniquement en arrière-plan. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Le Plateau des aiguilles, La Terrasse des veilleurs. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### La Terrasse des veilleurs

`ldm-stage-terrasse-veilleurs` — Point de veille où le corridor se voit enfin comme un ensemble.

Terrasse de secours taillée dans falaise noire, petit abri d’observation étanche et télescope replié derrière voie libre, horizon de mer brumeux et lampe chaude.

**Objectif :** Recevoir les confirmations des quatre secteurs et choisir l’heure d’évacuation. **Rencontre :** Le Léviathan de faille.

**Scénario :** Brume par nappes séparées des silhouettes, aucun flash requis. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** La Pente des cairns, Le Radôme ébréché, Le Seuil de la marée. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

#### Le Seuil de la marée

`ldm-stage-seuil-maree` — Conclusion locale : accepter de laisser passer les personnes et leurs biens.

Large rivage noir traversé par une chaussée d’évacuation en béton, barrières hydrauliques lointaines, horizon argent très bas et quelques particules pâles.

**Objectif :** Faire franchir le dernier lot et enregistrer un passage public réversible. **Rencontre :** Le Dernier Amarré.

**Scénario :** Ressac limité à l’arrière-plan en Versus ; marée du scénario annoncée par jauge. **Versus :** sol horizontal fixe, bornes symétriques et hazards désactivés.

**Connexions :** Les Archives de béton, La Terrasse des veilleurs. **Plans à produire :** ciel/plafond 0,05 ; lointain 0,18 ; intermédiaire 0,42 ; sol 1 ; premier plan 1,08. Chaque plan conserve son propre fichier et ses points d’appui.

## 6. Les vingt ennemis

Les dix humains sont neutralisés sans exécution. Les quatre unités mécaniques sont immobilisées par leur fonction, leur batterie ou leurs verrous. Les six formes BT sont des appellations originales de reconstitution, pas une taxonomie canonique. Deux attaques seulement peuvent être actives simultanément dans une vague. Une caméra doit montrer l’auteur et la zone du télégraphe avant toute attaque.

### Guetteur de cargaison

`ldm-enemy-guetteur-cargo` · humain · alerte. Récupérateur humain mince en tenue cargo ocre rapiécée, sac étroit, scanner tenu en main, matraque en caoutchouc basse et capuche ouverte sur visage.

**Attaque — Balayage de fret :** 32 pas d’annonce, 6 actifs, 30 de récupération. Le scanner se déploie et émet deux impulsions sonores.

**Contre :** Sortir du cône avant sa fermeture ; neutraliser le capteur réduit l’alerte. **Issue :** Capteur arrêté puis immobilisation au lien.

**Lieu :** Le Dépôt des amarres. **Élément mobile :** ldm-projectile-scanner-pulse.

### Lieur de quai

`ldm-enemy-lieur-de-quai` · humain · entrave. Ancien porteur de quai en combinaison moutarde sombre et graphite, bobines à ceinture, outil de retenue à deux branches arrondies et gros gants de travail.

**Attaque — Boucle courte :** 28 pas d’annonce, 6 actifs, 30 de récupération. La bobine quitte la hanche et le bras recule.

**Contre :** Reculer hors portée ou garder ; punir le rembobinage. **Issue :** Désarmement puis reddition.

**Lieu :** La Digue aval. **Élément mobile :** ldm-projectile-restraint-cable.

### Porteur-bélier

`ldm-enemy-porteur-belier` · humain · charge. Porteur humain lourd, large cadre de fret rectangulaire au dos, tenue brune étanche, renforts d’assistance aux jambes et épaule rembourrée sans pointe.

**Attaque — Épaule de fret :** 42 pas d’annonce, 6 actifs, 30 de récupération. Le caisson est abaissé et le pied d’appui gratte le sol.

**Contre :** Esquiver la ligne engagée ; attaquer le flanc après arrêt. **Issue :** Équilibre perdu puis prise au lien.

**Lieu :** Le Quai des refuges. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

### Courrier leurre

`ldm-enemy-courrier-leurre` · humain · diversion. Coursier humain fin en tenue ardoise/ocre, caisse-leurre légère contre le torse, scanner d’épaule compact, garde agile et chaussures pratiques.

**Attaque — Lancer de caisse vide :** 30 pas d’annonce, 6 actifs, 30 de récupération. Le colis léger est montré avant le lancer.

**Contre :** Garder ou laisser passer, puis surveiller la course de fuite. **Issue :** Récupération du leurre et immobilisation.

**Lieu :** Le Bassin muet. **Élément mobile :** ldm-projectile-decoy-case.

### Vigile isolant

`ldm-enemy-vigile-isolant` · humain · garde. Garde humain de dépôt, vêtements isolants gris mats superposés, protection rectangulaire polymère à l’avant-bras, petit bâton électrique bas et gants épais.

**Attaque — Coup de bâton isolé :** 25 pas d’annonce, 6 actifs, 30 de récupération. Avant-bras protégé levé, voyant court sur bâton.

**Contre :** Attendre la frappe, passer sur l’autre flanc ou punir son retour. **Issue :** Garde rompue puis reddition.

**Lieu :** Le Dépôt des amarres. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

### Lanceur de filet

`ldm-enemy-lanceur-filet` · humain · distance. Garde de fret humain au lance-filet pneumatique compact, gilet moutarde/gris, capuche sombre et bobine sécurisée à la hanche ; outil non létal.

**Attaque — Filet de retenue :** 40 pas d’annonce, 6 actifs, 30 de récupération. Chargeur se ferme avec claquement et visée marquée.

**Contre :** Sauter la trajectoire ou interrompre avant départ ; filet destructible. **Issue :** Lanceur déchargé et lien au sol.

**Lieu :** La Serre de veille. **Élément mobile :** ldm-projectile-restraint-net.

### Poseur de capteurs

`ldm-enemy-poseur-capteur` · humain · zone. Technicien humain gris et ocre, jalons repliés sur un côté du sac, petit palet capteur tenu dans un gant, posture basse et prudente.

**Attaque — Pose de capteur :** 36 pas d’annonce, 6 actifs, 30 de récupération. S’accroupit et déplie un petit jalon.

**Contre :** Contester la pose ; détruire le jalon visible d’un coup. **Issue :** Jalon désactivé et technicien maîtrisé.

**Lieu :** Le Relais des vents. **Élément mobile :** ldm-projectile-sensor-puck.

### Racleur de dépôt

`ldm-enemy-racleur-depot` · humain · balayage. Récupérateur humain en combinaison charbon/rouille, cadre de traîneau replié au dos, levier de manutention émoussé, casque civil et traces de graisse.

**Attaque — Revers de levier :** 38 pas d’annonce, 6 actifs, 30 de récupération. Le levier est tenu à deux mains à hauteur de hanche.

**Contre :** Reculer, sauter après l’annonce ou punir la longue récupération. **Issue :** Outil posé et conflit terminé.

**Lieu :** Le Triage noyé. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

### Arbitre de convoi

`ldm-enemy-arbitre-convoi` · humain · soutien. Responsable de convoi humain en tenue olive sombre à bandes logistiques ambre usées, casque simple, lanceur non létal abaissé et ceinture utilitaire.

**Attaque — Marquage de convoi :** 34 pas d’annonce, 6 actifs, 30 de récupération. Signal sonore et bras levé, jamais tir depuis hors écran.

**Contre :** Casser la ligne de vue puis neutraliser le marqueur. **Issue :** Le chef de patrouille se rend après désarmement.

**Lieu :** La Gare suspendue. **Élément mobile :** ldm-projectile-stun-cartridge.

### Mécanicien fermeur

`ldm-enemy-mecanicien-fermeur` · humain · saisie. Mécanicien humain en combinaison pétrole lourde, pince industrielle rembourrée courte, visière relevée, gros gants et bobine orange à la hanche.

**Attaque — Fermeture de pince :** 45 pas d’annonce, 6 actifs, 30 de récupération. Pince grande ouverte et mouvement de pieds très court.

**Contre :** Sortir de la portée ou frapper pendant l’ouverture. **Issue :** Pince verrouillée à vide et prise non létale.

**Lieu :** L’Écluse noire. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

### Patrouilleur à chenilles

`ldm-enemy-patrouilleur-chenille` · machine · pression-sol. Petit robot industriel sans pilote, hauteur de taille humaine, deux chenilles caoutchouc, châssis graphite bas, capteur de fret frontal et voyant ambre.

**Attaque — Avancée contrôlée :** 38 pas d’annonce, 6 actifs, 30 de récupération. Voyant ambre pulsé et moteur monte en régime.

**Contre :** Passer derrière lors du freinage ; toucher le boîtier batterie. **Issue :** Batterie isolée, unité immobilisée.

**Lieu :** Le Triage noyé. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

### Drone cordier

`ldm-enemy-drone-cordier` · machine · aerien. Drone cargo original à quatre ventilateurs carénés, châssis graphite étanche, tambour de treuil fermé et crochet court sécurisé dessous ; aucun missile.

**Attaque — Descente de crochet :** 44 pas d’annonce, 6 actifs, 30 de récupération. Drone stabilisé, câble déverrouillé et zone sous lui marquée.

**Contre :** Quitter la zone ; frapper le treuil lors du rembobinage. **Issue :** Atterrissage forcé puis coupure sûre.

**Lieu :** La Gare suspendue. **Élément mobile :** ldm-projectile-winch-hook.

### Chariot verrou

`ldm-enemy-chariot-verrou` · machine · obstacle. Chariot cargo autonome à quatre roues épaisses, châssis acier bas, plaque barrière rabattable à l’avant, coque gris pâle mouillée et lampe de sécurité.

**Attaque — Plaque de blocage :** 42 pas d’annonce, 6 actifs, 30 de récupération. Plaque se lève lentement, roues se verrouillent.

**Contre :** Attaquer l’arrière après la pose ; ne pas pousser contre le verrou frontal. **Issue :** Deux verrous libérés et chariot déplacé.

**Lieu :** L’Atelier du réservoir. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

### Borne traqueuse

`ldm-enemy-borne-traqueuse` · machine · information. Unité mobile de maintenance de capteurs : trois supports courts à roues, mât étanche jaune/gris, petit disque de scan replié et lumière ambre.

**Attaque — Balayage mobile :** 34 pas d’annonce, 6 actifs, 30 de récupération. Mât tourne à vitesse constante et bip accélère.

**Contre :** Utiliser une couverture ou désactiver le boîtier après balayage. **Issue :** Bloc scanner mis hors tension.

**Lieu :** Le Radôme ébréché. **Élément mobile :** ldm-projectile-scanner-pulse.

### Échoué à l’ancre

`ldm-enemy-echoue-ancre` · bt · suspension. Apparition BT originale adulte mince et haute, poix noire semi-translucide en légère suspension, cordon fin montant du torse, sans insigne ni chair exposée.

**Attaque — Appel de paumes :** 54 pas d’annonce, 6 actifs, 30 de récupération. Cordon tendu et empreintes noires matérialisent la zone.

**Contre :** Se déplacer calmement hors de la zone, puis viser la fenêtre de simulation. **Issue :** Stabilité d’empreinte dissipée ou évitement validé.

**Lieu :** Le Bassin muet. **Élément mobile :** ldm-projectile-tar-palm.

### Échoué rampant

`ldm-enemy-echoue-rampe` · bt · rapprochement. Apparition BT originale basse rampante, avant-bras étirés et jambes repliées, cordon suspendu, matière noire mouillée à rares paillettes pâles.

**Attaque — Rampe d’approche :** 48 pas d’annonce, 6 actifs, 30 de récupération. Avant-bras se posent, surface sombre ondule.

**Contre :** Reculer avant accélération ; frapper seulement après son arrêt. **Issue :** Empreinte dissipée dans le simulateur.

**Lieu :** Le Phare couché. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

### Échoué de dérive

`ldm-enemy-echoue-derive` · bt · traversee. Apparition BT originale humaine en suspension, inclinée en avant, bras bas, long cordon libre vers le haut et quelques gouttes de poix isolées.

**Attaque — Dérive oblique :** 50 pas d’annonce, 6 actifs, 30 de récupération. Le cordon penche et la silhouette s’étire dans la direction.

**Contre :** Garder sa distance ; éviter la ligne puis répondre à l’arrêt. **Issue :** Dissipation sans attribution de mort narrative.

**Lieu :** La Station de captage. **Élément mobile :** ldm-projectile-tar-droplet.

### Empreinte de relève

`ldm-enemy-empreinte-releve` · bt · piege-sol. Manifestation BT originale : une main et un avant-bras de poix émergent d’un monticule noir compact, cordon fin recourbé ; aucune chair coupée.

**Attaque — Saisie de relève :** 46 pas d’annonce, 6 actifs, 30 de récupération. Petite tache visible puis doigts apparaissent avant la saisie.

**Contre :** Ne pas marcher sur la tache ; attaquer après l’échec ou contourner. **Issue :** Zone dissipée et voie libre.

**Lieu :** L’Écluse noire. **Élément mobile :** ldm-projectile-tar-palm.

### Échoué du promontoire

`ldm-enemy-echoue-guetteur` · bt · observation. Apparition BT originale longue et stationnaire, buste penché, épaules étroites, bras longs et cordon suspendu visible, particules or éteint rares.

**Attaque — Fixation du promontoire :** 62 pas d’annonce, 6 actifs, 30 de récupération. Torse se redresse et cordon tremble ; zone de regard matérialisée.

**Contre :** Rompre la ligne de vue ou rester derrière couverture avant impulsion. **Issue :** Contourner ou dissiper l’empreinte.

**Lieu :** Le Plateau des aiguilles. **Élément mobile :** ldm-projectile-tar-ripple.

### Échoué enserreur

`ldm-enemy-echoue-enserreur` · bt · saisie-large. Apparition BT originale voûtée de taille moyenne, avant-bras larges repliés en saisie, cordon fin au torse, tête humanoïde proportionnée et poix luisante.

**Attaque — Enserrement lent :** 66 pas d’annonce, 6 actifs, 30 de récupération. Bras très ouverts et masse penchée ; annonce grave soutenue.

**Contre :** Reculer au lieu de frapper sa garde ; longue récupération après échec. **Issue :** Dissipation de l’empreinte et libération du passage.

**Lieu :** Le Seuil de la marée. **Élément mobile :** outil/partie articulée ; aucune image de projectile requise pour cette attaque.

## 7. Les vingt rencontres majeures

Chaque boss possède une condition de victoire et trois états de rencontre, et non trois palettes. Les seuils 100 %, 66 % et 33 % portent sur garde, systèmes ou stabilité selon la nature de la cible. Un scénario peut avancer par objectifs ; retirer des points n’est pas la seule condition. Les seuils et minutages sont des réglages de prototype à éprouver.

### Le Consignateur — Le péage des cargaisons

`ldm-boss-consignateur` · humain · **Lieu :** La Digue aval.

Il pense que garder tous les colis empêche leur perte, mais retient leurs destinataires.

**Silhouette :** Humain âgé robuste en équipement cargo graphite/moutarde, lourd cadre de caisse au dos, bâton de retenue et petit bouclier polymère usé ; visage découvert.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Repousse au bouclier | 60 / 48 | Punir la poussée manquée sur le côté découvert. |
| 2 | Interception à la perche | 72 / 42 | Désamorcer ses deux consoles de péage pendant les reprises. |
| 3 | Retenue de passage | 90 / 60 | Obtenir la restitution du registre puis faire tomber sa garde. |

**Victoire :** Garde 100 % → 0 % puis action de reddition au lien ; aucune mort.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### La Remorque du ressac — Le convoi bloqué

`ldm-boss-remorque-ressac` · machine · **Lieu :** Le Quai des refuges.

Le protocole local de retour répète une consigne devenue impossible.

**Silhouette :** Gros tracteur cargo autonome à six roues avec caisson intégré bas, acier ivoire/graphite corrodé au sel, suspensions robustes et petit mât de scan.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Charge en ligne | 60 / 48 | Le klaxon et les roues orientées révèlent la ligne de charge. |
| 2 | Freinage de travers | 72 / 42 | Toucher les boîtiers de frein seulement après une charge. |
| 3 | Retour au quai | 90 / 60 | Désaccoupler le caisson lorsque les deux freins sont isolés. |

**Victoire :** Trois organes isolés ; tracteur arrêté, fret intact.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Veilleur des balises — La balise sans voix

`ldm-boss-veilleur-balise` · bt · **Lieu :** Le Dépôt des amarres.

Reconstitution d’une apparition observée ; aucune origine cosmologique déclarée.

**Silhouette :** Immense apparition BT humanoïde très mince, bras bas asymétriques, cordon fin montant du torse, rares reflets or pâle sur poix noire brillante.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Paume de repérage | 60 / 48 | La paume noircit le sol 60 pas avant contact. |
| 2 | Lignes de pas | 72 / 42 | Bouger entre les lignes annoncées ; utiliser le repère découvert. |
| 3 | Appel du quai | 90 / 60 | Maintenir l’accès à la balise pendant sa dernière manifestation. |

**Victoire :** Stabilité de simulation à zéro OU sortie par deux balises activées.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Treuil d’amarre — Ce qui retient

`ldm-boss-treuil-amarre` · machine · **Lieu :** Le Bassin muet.

Le treuil continue de retenir la ligne de sauvetage comme s’il s’agissait de fret.

**Silhouette :** Treuil industriel colossal sur lourd châssis chenillé bas, grande bobine horizontale de câble, guide replié, capots renforcés et lampes ambre.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Tension de câble | 60 / 48 | Câble visible et moteur chargé avant tir ; passer hors du couloir. |
| 2 | Balayage du guide | 72 / 42 | Couper le circuit pendant le déroulage, sans couper un câble sous charge près des civils. |
| 3 | Rembobinage forcé | 90 / 60 | Bloquer la bobine après libération de ses deux attaches. |

**Victoire :** Trois points d’alimentation consignés puis frein mécanique verrouillé.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Cétacé de rive — La route submergée

`ldm-boss-cetace-de-rive` · bt · **Lieu :** Le Phare couché.

Cétacé original de l’archive du corridor, distinct des rencontres officielles.

**Silhouette :** Immense BT original évoquant une baleine noire de poix, tête arrondie large, long corps bas et nageoires rabattues, cordon ascendant et or discret.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Souffle de poix | 60 / 48 | La tête s’incline et le quai est marqué avant le souffle. |
| 2 | Retournement lourd | 72 / 42 | Rester sur les plots sûrs ; fenêtre sur la crête après retournement. |
| 3 | Ressac de rive | 90 / 60 | Protéger le module de balise puis rejoindre le quai d’extraction. |

**Victoire :** Dissipation d’empreinte OU évacuation avec module sécurisé.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### La Gardienne de la serre — La serre fermée

`ldm-boss-maitresse-serre` · humain · **Lieu :** La Serre de veille.

Elle craint qu’une ouverture de la serre expose les récoltes et les habitants.

**Silhouette :** Gardienne humaine de serre, fin de cinquantaine, combinaison ivoire et vert sombre renforcée, réservoir fermé compact, bâton de contrôle d’irrigation émoussé.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Poussée de contrôle | 60 / 48 | Le bâton est levé deux temps avant frappe. |
| 2 | Brume de séparation | 72 / 42 | Éteindre les brumisateurs avec leur commande locale, sans endommager les cultures. |
| 3 | Dernier sas | 90 / 60 | La convaincre par restitution du filtre après maîtrise non létale. |

**Victoire :** Garde rompue puis remise du filtre ; la Gardienne rejoint le réseau local.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Collecteur noir — La réserve contaminée

`ldm-boss-collecteur-noir` · bt · **Lieu :** La Station de captage.

Forme amphibienne originale de reconstitution ; ne contrôle pas toute l’eau.

**Silhouette :** Grand BT amphibien trapu évoquant une salamandre noire, quatre pattes massives, tête obtuse et dos bas, inclusions or rares et cordon fin dorsal.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Bond de collecte | 60 / 48 | Les pattes se compressent et la destination est affichée avant bond. |
| 2 | Traînée de poix | 72 / 42 | Contourner la traînée et viser la reprise de stabilité. |
| 3 | Repli au bassin | 90 / 60 | Rétablir deux vannes de protection pour préserver l’eau. |

**Victoire :** Empreinte dissipée ET deux vannes fermées, ou évacuation sans perte d’eau.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### La Grue verrou — Le pont sans accès

`ldm-boss-grue-verrou` · machine · **Lieu :** Le Viaduc de l’Ourlet.

Un détournement du programme de manutention a transformé le service en barrière.

**Silhouette :** Grue industrielle de maintenance sur quatre appuis hydrauliques, corps central bas, flèche repliée et crochet fermé, matières ivoire/graphite usées.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Pose de crochet | 60 / 48 | Le crochet est suspendu à une ligne visible, jamais téléporté. |
| 2 | Déplacement de charge | 72 / 42 | Toucher les stabilisateurs après leur pose, dans ordre au choix. |
| 3 | Verrou de flèche | 90 / 60 | Immobiliser le crochet vide et isoler l’unité. |

**Victoire :** Trois stabilisateurs désactivés, charge déposée hors voie.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Contremaître du pont — Le tarif du passage

`ldm-boss-contremaitre-pont` · humain · **Lieu :** Le Relais des vents.

Il justifie la confiscation de matériel par la maintenance, mais ne rend plus les comptes.

**Silhouette :** Contremaître humain puissant en combinaison orange sombre/graphite, renforts d’assistance aux jambes, genouillères, barre de levage émoussée et casque blanc.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Barre de poussée | 60 / 48 | Appui bas et barre au torse annoncent une frappe lente. |
| 2 | Charge de contrepoids | 72 / 42 | Contourner le contrepoids ; empêcher le verrou sans frapper les ouvriers absents de l’arène. |
| 3 | Fermeture du chantier | 90 / 60 | Faire ouvrir le passage de service après sa reddition. |

**Victoire :** Deux panneaux rouverts puis garde à zéro et reddition.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Cerf de brume — Entre les cairns

`ldm-boss-cerf-de-brume` · bt · **Lieu :** La Pente des cairns.

Silhouette cervidé originale : aucune créature canonique nouvelle revendiquée.

**Silhouette :** Grand BT cervidé à longues jambes, tête noire étroite, bois irréguliers modestes de poix, corps mince et cordon au garrot ; aucun œil lumineux.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Fente des bois | 60 / 48 | Tête inclinée et deux pas d’élan, trajectoire visible même en brume réduite. |
| 2 | Pas de brume | 72 / 42 | Passer sous la portée haute seulement pendant le recovery ; pas de saut aveugle. |
| 3 | Course de traversée | 90 / 60 | Garder les cairns lisibles et rejoindre l’abri. |

**Victoire :** Dissipation OU trois cairns activés et extraction.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Chef de triage — Les reçus sans adresse

`ldm-boss-chef-triage` · humain · **Lieu :** Le Triage noyé.

L’ordre de stockage a remplacé le service de livraison.

**Silhouette :** Chef de triage humain âgé en tenue logistique ardoise/rouille, gilet large à scellés, bouclier rectangulaire au bras gauche et lanceur non létal abaissé.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Salve d’arrêt | 60 / 48 | Lanceur bas puis laser de simulation fin avant salve non létale. |
| 2 | Bouclier mobile | 72 / 42 | Garder la salve, puis viser le flanc du bouclier. |
| 3 | Ordre de rétention | 90 / 60 | Restituer les trois reçus pour annuler les consignes. |

**Victoire :** Trois reçus identifiés et warden neutralisé sans violence létale.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### La Rame sans conducteur — Le retour perpétuel

`ldm-boss-rame-sans-conducteur` · machine · **Lieu :** La Gare suspendue.

Le boss est la logique de boucle de la rame, pas un train vivant.

**Silhouette :** Navette autonome monobloc de fret sur rail surélevé, long caisson bas graphite/gris pâle, suspensions et attelage intégrés, lampe ambre ; sans rails de décor.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Passage de rame | 60 / 48 | Signal lumineux et son de rail avant chaque déplacement. |
| 2 | Arrêt contrarié | 72 / 42 | Atteindre les boîtiers au freinage ; zone de duel sur quai sécurisé. |
| 3 | Boucle finale | 90 / 60 | Couper la boucle et libérer le wagon de fret, sans chute. |

**Victoire :** Deux boîtiers et une commande principale désactivés.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Porteur sans retour — Le poids sans destinataire

`ldm-boss-porteur-sans-retour` · bt · **Lieu :** L’Atelier du réservoir.

Métaphore visuelle originale du portage ; aucun porteur canonique identifié.

**Silhouette :** Grand BT humanoïde voûté dont le dos forme une masse de poix évoquant une charge, bras très longs, jambes humanoïdes et cordon montant.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Chute du fardeau | 60 / 48 | Dos s’abaisse et ombre du fardeau dessine la zone. |
| 2 | Balayage d’avant-bras | 72 / 42 | Punir les mains au sol après impact ; ne pas frapper la masse haute. |
| 3 | Dépôt impossible | 90 / 60 | Acheminer le colis témoin jusqu’au terminal pendant la fenêtre calme. |

**Victoire :** Dissipation de l’empreinte puis livraison du témoin de simulation.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Mécanisme de l’écluse — La vanne unique

`ldm-boss-mecanisme-ecluse` · machine · **Lieu :** L’Écluse noire.

Système détourné ; l’eau et la poix ne deviennent pas un projectile magique.

**Silhouette :** Ensemble mobile industriel d’entraînement de vanne sur chenilles, deux grands carters de crémaillères et pince hydraulique horizontale, graphite mouillé.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Course de crémaillère | 60 / 48 | Alarme hydraulique et flèche indiquent le côté actif. |
| 2 | Pince de verrou | 72 / 42 | Désactiver le côté inactif, puis se retirer avant inversion. |
| 3 | Cycle de reflux | 90 / 60 | Mettre l’ouvrage en commande locale après arrêt des deux circuits. |

**Victoire :** Deux circuits isolés et commande locale validée sans ouvrir l’eau vers refuges.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### L’Archiviste fermée — La voix confisquée

`ldm-boss-archiviste-fermee` · humain · **Lieu :** Les Archives de béton.

Elle conserve pour protéger, mais a cessé de demander la permission.

**Silhouette :** Administratrice humaine âgée aux cheveux argent courts, veste utilitaire longue graphite/ivoire, deux étuis d’archives au dos, bâton arrondi et terminal au bras.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Frappe d’étui | 60 / 48 | Elle montre l’étui avant frappe ; copie holographique sans corps. |
| 2 | Leurre de dossier | 72 / 42 | Ignorer la copie, interrompre la manipulation du terminal. |
| 3 | Dernière fermeture | 90 / 60 | Rendre la première lettre à son destinataire pour déclencher la sortie du conflit. |

**Victoire :** Rupture de garde puis restitution autorisée des dossiers.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### L’Alpiniste du seuil — Le col réservé

`ldm-boss-alpiniste-seuil` · humain · **Lieu :** Le Col de Contrevent.

Il pense que seuls les porteurs équipés méritent la traversée.

**Silhouette :** Humain alpiniste haut de quarante ans passés, tenue d’expédition grise et olive, renforts aux jambes, corde sécurisée, courte perche de secours et visage visible.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Pointe de perche | 60 / 48 | Corde posée et perche rentrée avant chaque engagement. |
| 2 | Barrage de corde | 72 / 42 | Ne pas poursuivre sur la corde ; punir la perche rentrée. |
| 3 | Reprise de pente | 90 / 60 | Libérer les deux ancrages publics puis obtenir reddition. |

**Victoire :** Deux ancrages accessibles et humain immobilisé, corde de secours conservée.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### L’Araignée des haubans — Les haubans du plateau

`ldm-boss-araignee-hauban` · bt · **Lieu :** Le Plateau des aiguilles.

Forme arthropode originale à six pattes, nom de porteur non taxonomie.

**Silhouette :** Immense BT arthropode noir à six longues pattes ancrées, corps central compact bas, cordon dorsal et quelques joints or sombre ; pas d’armure.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Pied d’ancrage | 60 / 48 | Les six appuis sont annoncés un par un ; aucune patte ne tombe hors caméra. |
| 2 | Balayage de fil | 72 / 42 | Passer entre deux appuis et viser la patte en récupération. |
| 3 | Traversée basse | 90 / 60 | Dégager trois couloirs de cordons dans la reconstitution. |

**Victoire :** Dissipation OU trois couloirs dégagés et sortie du plateau.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Radôme errant — L’observation qui poursuit

`ldm-boss-radome-errant` · machine · **Lieu :** Le Radôme ébréché.

Machine de mesure détournée localement ; aucun rayon énergétique destructeur.

**Silhouette :** Grand robot de communication météo sur quatre chenilles basses, radôme géodésique gris pâle, base technique graphite et conduits fonctionnels.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Balayage de radar | 60 / 48 | Tour du radôme régulier et bip directionnel. |
| 2 | Translation du châssis | 72 / 42 | Utiliser les angles morts matérialisés ; toucher le circuit après arrêt. |
| 3 | Recherche circulaire | 90 / 60 | Repasser l’antenne en mode météo, puis arrêter le châssis. |

**Victoire :** Trois dérivations débranchées et mode maintenance confirmé.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Léviathan de faille — Ce qui remonte

`ldm-boss-leviathan-faille` · bt · **Lieu :** La Terrasse des veilleurs.

Manifestation anguilliforme originale, pas dragon ni EE.

**Silhouette :** Immense BT anguilliforme noir, corps aquatique continu allongé, tête lisse émoussée, petite nageoire dorsale et cordon fin, courbure latérale douce.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Percée de faille | 60 / 48 | Surface noire se soulève et marque la courbe avant émergence. |
| 2 | Retour en arc | 72 / 42 | Rester sur la dalle ; frapper seulement à l’atterrissage de la masse. |
| 3 | Traînée longue | 90 / 60 | Transmettre les confirmations pendant les fenêtres entre vagues. |

**Victoire :** Dissipation OU trois confirmations et repli protégé.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

### Le Dernier Amarré — Laisser partir

`ldm-boss-dernier-amarre` · bt · **Lieu :** Le Seuil de la marée.

Dernière reconstitution symbolique de l’attachement ; aucune extinction empêchée par les OC.

**Silhouette :** Immense BT humanoïde assis et voûté, épaules larges et longues jambes fines, mains basses ouvertes, un cordon montant du torse et très peu d’or.

| Phase | Attaque / mécanisme | Annonce / récupération | Lecture et résolution |
| --- | --- | --- | --- |
| 1 | Main ouverte | 60 / 48 | Les mains s’ouvrent lentement ; deux zones possibles annoncées 90 pas avant. |
| 2 | Cordon de retour | 72 / 42 | Cesser la pression, libérer la voie puis utiliser la fenêtre de stabilité. |
| 3 | Dernier appel | 90 / 60 | Activer les quatre confirmations de secteur pour extraire les derniers colis. |

**Victoire :** Quatre confirmations et empreinte dissipée OU évacuation complète sans combat final forcé.

**Échec et reprise :** Vitalité du porteur à zéro ou objectif de fret perdu ; reprise au début de la phase sans perte d’inventaire principal. **Sauvegarde cible :** phase, objectifs, PV, consommables, état du boss et graine.

## 8. Campagne globale, missions et déblocages

La campagne contient vingt étapes réparties en quatre chapitres. Les séquences briefing, préparation, approche, objectif, rencontre ou contournement, livraison et débrief forment le contrat d’état. Le checkpoint est écrit après livraison et ouverture de route, avec validation des IDs ; il ne doit pas capturer une conclusion en cours.

| Mission | Lieu | Objectif |
| --- | --- | --- |
| Le colis sans nom | La Digue aval | Livrer une caisse étanche à la balise sans la laisser dans l’eau. |
| Trois adresses | Le Quai des refuges | Acheminer trois lots vers leurs refuges plutôt que tout conserver au quai. |
| La ligne de secours | Le Dépôt des amarres | Récupérer deux bobines et réarmer une ligne de secours. |
| Les repères du bassin | Le Bassin muet | Observer trois repères depuis le quai sec, puis évacuer. |
| Un signal à relever | Le Phare couché | Récupérer le module de la balise effondrée et rejoindre le passage stable. |
| Ce qui pousse encore | La Serre de veille | Stabiliser l’alimentation des cultures et remettre les filtres demandés. |
| L’eau choisit sa route | La Station de captage | Changer deux filtres et transférer l’eau vers le refuge prioritaire. |
| Le prix du passage | Le Viaduc de l’Ourlet | Traverser avec charge équilibrée puis déverrouiller le chemin de service. |
| Une prévision ouverte | Le Relais des vents | Relever trois instruments et transmettre la fenêtre météo aux refuges. |
| Les pierres laissées | La Pente des cairns | Poser deux ancrages puis escorter un porteur jusqu’à l’abri. |
| Rendre les reçus | Le Triage noyé | Identifier quatre caisses grâce aux reçus puis les remettre aux bonnes voies. |
| Annuler le retour | La Gare suspendue | Couper une boucle de retour et rendre la cargaison à son destinataire. |
| Réparer avant de partir | L’Atelier du réservoir | Réparer trois sous-ensembles avec un stock de pièces limité. |
| La clé du sas | L’Écluse noire | Ouvrir le sas de service dans l’ordre vérifié sans inonder les refuges. |
| Les voix ont un propriétaire | Les Archives de béton | Restituer trois témoignages avec accord des propriétaires et exporter leur reçu. |
| Prendre le col ensemble | Le Col de Contrevent | Préparer la corde, alléger le fret puis franchir la fenêtre calme. |
| Entre les appuis | Le Plateau des aiguilles | Repérer le trajet sûr, éviter les ancrages instables et rejoindre le relais. |
| Le relais rendu | Le Radôme ébréché | Rétablir trois circuits de communication et désactiver la boucle de poursuite. |
| Toutes les réponses | La Terrasse des veilleurs | Recevoir les confirmations des quatre secteurs et choisir l’heure d’évacuation. |
| Laisser le passage | Le Seuil de la marée | Faire franchir le dernier lot et enregistrer un passage public réversible. |

Un futur personnage se débloquera par sa rencontre ou son exercice de découverte après disponibilité de son kit. Aucun cadenas ne doit promettre de rendre jouable un contenu absent. Les dix nouveaux dossiers peuvent être consultés dès leur publication ; les huit combattants existants et leurs accès ne sont pas retirés. Aucun abonnement ou achat ne conditionne cette extension conçue ici.

## 9. Équipes, assistances et conclusions

La cible reprend le système de Cohésion et de relais documenté dans les extensions du guide. L’assistance coûte 25 et le duo 100. Les projectiles et objets gardent leur propriétaire lors d’un relais ; il faut définir leur expiration, leur compteur de contacts et leur nettoyage au KO. Une intervention ne devient pas un troisième combattant permanent.

| Paire | Super de duo | Contribution propre |
| --- | --- | --- |
| Maëlle « Balise » Rocher + Tariq « Écluse » Moss | Passage tenu | Balise fixe le point de traction ; Écluse referme une sangle de simulation puis libère la voie. |
| Jonas « Lest » Vale + Jun « Sillage » Akiyama | Le poids remis en route | Lest dépose le caisson ; Sillage cale sa trajectoire puis tous deux le récupèrent sans le jeter sur un humain. |
| Inès « Suture » Sorel + Célia « Archive » Ward | La voix préservée | Suture crée l’espace de retrait ; Archive restitue le dossier et referme la simulation. |
| Elias « Relais » Reed + Naya « Isobare » Quill | Fenêtre commune | Relais annonce le couloir ; Isobare pose une fumée bornée et guide un retrait à pied. |
| Oren « Contrevoie » Pike + Alma « Vigie » Voss | L’adresse retrouvée | Vigie marque l’appui ; Contrevoie immobilise au lien puis rend la caisse au terminal. |

Les conclusions collectives s’ouvrent après résultat et concernent la restitution du fret, l’ouverture du passage ou la sortie d’empreintes. Elles n’exécutent pas les personnages originaux et n’ajoutent pas un événement aux œuvres canoniques. Un duo absent de la production utilise une conclusion individuelle disponible avec son libellé exact.

## 10. Les autres contenus associés

### Vingt props

| ID | Nom | Description / règle |
| --- | --- | --- |
| ldm-prop-balise-secours | Balise de secours | Point de validation d’une traversée ; lisible sans couleur. Boîtier de détresse fixe avec lampe ambre et bouton protégé. Point de validation d’une traversée ; lisible sans couleur. |
| ldm-prop-bobine-sauvetage | Bobine de sauvetage | Requis pour ouvrir certaines liaisons de secours. Bobine grise avec corde tressée orange usée, poignée et mousqueton. Requis pour ouvrir certaines liaisons de secours. |
| ldm-prop-caisson-filtres | Caisson de filtres | Objectif fragile, jamais projectile de combat. Caisse étanche ivoire courte et lourde avec deux poignées. Objectif fragile, jamais projectile de combat. |
| ldm-prop-batterie-refuge | Batterie de refuge | Alimente un sas ou une pompe après livraison. Bloc graphite avec connecteur protégé et indicateur ambré. Alimente un sas ou une pompe après livraison. |
| ldm-prop-collecteur-pluie | Collecteur de pluie | Décor fonctionnel ou nœud de mission. Auvent fermé vers filtre, tuyau et réservoir, détails étanches. Décor fonctionnel ou nœud de mission. |
| ldm-prop-terminal-local | Terminal de commande locale | Active le mode maintenance une fois les risques isolés. Console basse sécurisée, écran pâle, boutons physiques. Active le mode maintenance une fois les risques isolés. |
| ldm-prop-caisse-leurre | Caisse leurre | Leurre explicite ; version lancée séparée du prop posé. Petit colis creux usé avec poignée souple. Leurre explicite ; version lancée séparée du prop posé. |
| ldm-prop-borne-passage | Borne de passage | Objectif de déverrouillage non payant. Poteau court anthracite avec lecteur et feu bicolore doublé de formes. Objectif de déverrouillage non payant. |
| ldm-prop-etui-temoignage | Étui de témoignage | Ne s’ouvre que dans le récit avec accord du propriétaire. Étui hermétique plat ivoire à scellé mécanique. Ne s’ouvre que dans le récit avec accord du propriétaire. |
| ldm-prop-butte-atelier | Butée d’atelier | Objet unique de contrôle au sol dans les kits conçus. Cale métallique arrondie graphite à poignée orange. Objet unique de contrôle au sol dans les kits conçus. |
| ldm-prop-ancrage-roche | Ancrage de roche | Permet corde et continuité entre deux plateformes. Piton industriel repliable fixé correctement dans basalte. Permet corde et continuité entre deux plateformes. |
| ldm-prop-armoire-isolante | Armoire isolante | Abrite le circuit vulnérable d’une machine. Coffre technique gris fermé, pieds et câbles à entrée protégée. Abrite le circuit vulnérable d’une machine. |
| ldm-prop-recu-papier | Reçu de livraison | Preuve de destination, texte final créé hors image. Feuillet synthétique froissé dans pochette étanche transparente. Preuve de destination, texte final créé hors image. |
| ldm-prop-lit-camp | Lit de camp | Repos de récit ; aucun soin instantané en duel. Couchette pliante graphite sous abri avec couverture pliée. Repos de récit ; aucun soin instantané en duel. |
| ldm-prop-filtre-usage | Filtre usagé | Ancien composant à récupérer après maintenance. Cartouche cylindrique marquée par l’eau et les dépôts. Ancien composant à récupérer après maintenance. |
| ldm-prop-filtre-neuf | Filtre neuf | Pièce de remplacement ; ne confondre avec munition. Cartouche identique propre dans capuchons de transport. Pièce de remplacement ; ne confondre avec munition. |
| ldm-prop-caisson-outils | Caisson d’outils | Réserve limitée de pièces de maintenance. Boîte pétrole basse à attaches et mousse de maintien. Réserve limitée de pièces de maintenance. |
| ldm-prop-panneau-trajet | Panneau de trajet | Porte le texte de navigation généré par interface, pas une image illisible. Plaque utilitaire mate sur deux pieds, balises géométriques. Porte le texte de navigation généré par interface, pas une image illisible. |
| ldm-prop-balise-meteo | Balise météo | Donne fenêtre de vent dans scénario. Mini-mât avec coupelles, pale, boîtier et haubans attachés. Donne fenêtre de vent dans scénario. |
| ldm-prop-scelle-restaure | Scellé restitué | Récompense narrative de restitution, jamais monnaie payante. Petit fermoir mécanique avec attache textile claire. Récompense narrative de restitution, jamais monnaie payante. |

### Dix équipements de spécialiste

| ID | Nom | Description / règle |
| --- | --- | --- |
| ldm-gadget-anneau-rappel | Anneau de rappel | Un seul point actif ; portée bornée et trajet physique. Anneau d’ancrage et lien de secours. Un seul point actif ; portée bornée et trajet physique. |
| ldm-gadget-support-caisson | Support de caisson | Absorbe un léger selon fenêtre de kit, batterie limitée. Armature de portage basse articulée. Absorbe un léger selon fenêtre de kit, batterie limitée. |
| ldm-gadget-trousse-tri | Trousse de tri | Stabilise uniquement objectifs de secours hors duel. Trousse médicale rigide fermée. Stabilise uniquement objectifs de secours hors duel. |
| ldm-gadget-repeteur-local | Répéteur local | Un objet destructible ; pas de révélation omnisciente. Petit relais à antenne rabattable. Un objet destructible ; pas de révélation omnisciente. |
| ldm-gadget-abri-compact | Écran de passage | Bloque un projectile simulé puis se replie. Petite surcouche de protection textile sur deux tiges. Bloque un projectile simulé puis se replie. |
| ldm-gadget-perche-reprise | Perche de reprise | Batterie limitée et récupération longue après frappe. Perche isolée démontable. Batterie limitée et récupération longue après frappe. |
| ldm-gadget-marqueur-piste | Marqueur de piste | Repère visible, jamais piège invisible. Jalon réfléchissant bas. Repère visible, jamais piège invisible. |
| ldm-gadget-pince-sangle | Pince de sangle | Prise déprojectable, aucune hydraulique sur corps. Pince à mâchoires arrondies et sangle. Prise déprojectable, aucune hydraulique sur corps. |
| ldm-gadget-coin-maintenance | Coin de maintenance | Pose unique et récupération nécessaire. Cale de roue à prise large. Pose unique et récupération nécessaire. |
| ldm-gadget-etui-copie | Étui de copie | Leurre de simulation, pas mémoire arrachée à un humain. Étui documentaire et projecteur local compact. Leurre de simulation, pas mémoire arrachée à un humain. |

### Quatre transports

| ID | Nom | Description / règle |
| --- | --- | --- |
| ldm-vehicle-tracteur-cotier | Tracteur côtier de secours | Transport lourd sur quai ; batterie, freinage et zones de recharge limités. Petit tracteur électrique civil six roues, treuil et plateau cargo bas. Transport lourd sur quai ; batterie, freinage et zones de recharge limités. |
| ldm-vehicle-navette-fret | Navette de fret locale | Transport scénarisé entre gare et triage ; aucun véhicule libre annoncé. Wagon utilitaire unique sur voie surélevée. Transport scénarisé entre gare et triage ; aucun véhicule libre annoncé. |
| ldm-vehicle-plateforme-remorquage | Plateforme de remorquage | Mission de déplacement de fret ; équilibre et arrêt obligatoires. Chariot de service bas avec deux essieux et caisse protégée. Mission de déplacement de fret ; équilibre et arrêt obligatoires. |
| ldm-vehicle-atelier-roulant | Atelier roulant | Point de réparation de mission après ravitaillement ; aucun soin automatique en combat. Utilitaire compact de maintenance avec compartiments latéraux étanches. Point de réparation de mission après ravitaillement ; aucun soin automatique en combat. |

### Douze projectiles et éléments mobiles

| ID | Nom | Description / règle |
| --- | --- | --- |
| ldm-projectile-scanner-pulse | Impulsion de capteur | Élément détaché de son lanceur et de la cible. Onde de scanner pâle et fine, un arc autonome.  |
| ldm-projectile-restraint-cable | Boucle de retenue | Élément détaché de son lanceur et de la cible. Lien tressé souple avec deux masses arrondies légères.  |
| ldm-projectile-decoy-case | Caisse leurre lancée | Élément détaché de son lanceur et de la cible. Petit caisson creux identique au prop mais autonome.  |
| ldm-projectile-restraint-net | Filet de retenue | Élément détaché de son lanceur et de la cible. Filet industriel souple déployé avec quatre poids ronds.  |
| ldm-projectile-sensor-puck | Palet capteur | Élément détaché de son lanceur et de la cible. Petit disque graphite avec pied de pose et voyant ambre.  |
| ldm-projectile-stun-cartridge | Cartouche de simulation | Élément détaché de son lanceur et de la cible. Projectile neutre non balistique photoréaliste, petit boîtier d’impulsion.  |
| ldm-projectile-winch-hook | Crochet sécurisé | Élément détaché de son lanceur et de la cible. Crochet industriel fermé avec poignée et extrémité arrondie.  |
| ldm-projectile-tar-palm | Paume de poix | Élément détaché de son lanceur et de la cible. Main de goudron non charnelle et flaque compacte.  |
| ldm-projectile-tar-droplet | Goutte de poix | Élément détaché de son lanceur et de la cible. Goutte noire brillante étirée avec filament court.  |
| ldm-projectile-tar-ripple | Ride de poix | Élément détaché de son lanceur et de la cible. Petit arc de poix noir au sol sans décor attaché.  |
| ldm-projectile-smoke-capsule | Capsule de fumée | Élément détaché de son lanceur et de la cible. Cylindre fermé gris avec bande blanche et mécanisme sobre.  |
| ldm-projectile-hematic-sim | Capsule hématique simulée | Élément détaché de son lanceur et de la cible. Capsule de reconstitution marquée par interface, nuage rouge sombre indépendant.  |

### Six stages bonus

| ID | Nom | Description / règle |
| --- | --- | --- |
| ldm-bonus-scelles | Scellés intacts | Trier six caisses par destinataire dans un temps confortable. Scène de terminal et props d’entraînement explicitement simulés. Trier six caisses par destinataire dans un temps confortable. |
| ldm-bonus-parades | La bonne tension | Parer cinq poussées annoncées avec le Strand de simulation. Scène de terminal et props d’entraînement explicitement simulés. Parer cinq poussées annoncées avec le Strand de simulation. |
| ldm-bonus-filtres | Changer sans perdre | Remplacer trois filtres avec ordre de vannes clairement montré. Scène de terminal et props d’entraînement explicitement simulés. Remplacer trois filtres avec ordre de vannes clairement montré. |
| ldm-bonus-balises | Une lumière chacun | Activer quatre balises avec deux partenaires et des relais limités. Scène de terminal et props d’entraînement explicitement simulés. Activer quatre balises avec deux partenaires et des relais limités. |
| ldm-bonus-horde | Dernière relève | Protéger une caisse contre sept vagues courtes de récupérateurs simulés. Scène de terminal et props d’entraînement explicitement simulés. Protéger une caisse contre sept vagues courtes de récupérateurs simulés. |
| ldm-bonus-freinage | Arrêt au repère | Arrêter trois plateformes de fret dans leurs zones, puis sécuriser les charges. Scène de terminal et props d’entraînement explicitement simulés. Arrêter trois plateformes de fret dans leurs zones, puis sécuriser les charges. |

## 11. Intégration et recette

Le fichier `catalog.json` est la source structurée de conception. Le client peut en afficher les dossiers avec statuts d’illustration et de disponibilité séparés. Un futur adaptateur doit refuser une entrée sans kit runtime, même si sa stance existe. La sauvegarde prévue `echos.ldm.v1` reste distincte des sauvegardes existantes. L’admission en Versus exige collisions, commandes, directions, nettoyage des entités, sérialisation et profil neutre de terrain.

La production vérifie des fichiers réels, leurs dimensions, leurs empreintes et leur lecture ; elle ne compte pas les briefs comme des images. Les nouvelles bases doivent ensuite recevoir les poses manquantes, les projectiles séparés et les couches de décor. L’acceptation visuelle compare les côtés anatomiques à la fiche, conserve les proportions natives et vérifie le pied d’appui.

Le [plan de production](PRODUCTION.md) donne les unités et dépendances. Le [contrôle de conception](design-validation.json) vérifie le catalogue et ses références ; il ne remplace pas une partie en navigateur ni une revue visuelle des PNG. Les états runtime publiés par le rapport de la passe font foi pour ce qui est réellement jouable.

# Actions, relations et IA — réception du lot domaines

**25 novembre 2026 · base `2250b7c1b54b445637e0c9354133e6fecbc325de` · règles du duel, sans changement d’équilibrage.**

## Livraison et provenance des données

Le [catalogue des actions et de l’IA](../../ACTIONS_ET_IA.md) décrit les **30 définitions d’attaque** de `StrandFight` : six attaques communes et trois techniques propres à chacun des huit combattants. Chaque fiche renseigne commande, démarrage, activité, récupération nominale, coût, dégâts, volume ou trajet, garde, annulation, conditions d’échec et restrictions. Six fiches complémentaires couvrent marche, accroupissement, saut, pas rapide, garde et finalité. Les valeurs ne sont pas celles de la cible à 1 000 PV : le duel actuel commence à 100 PV, équilibre 100 et chiral 42, pour 75 secondes.

Le [JSON exploitable](../../data/actions-et-ia.json) contient les tables brutes, les fiches commentées et les trois profils IA. Le [module consultable](../../../../modes/echos-de-la-greve/moves-data.js) expose `forFighter(id)`, qui associe les six attaques communes et les trois techniques à la puissance réelle du combattant. Les dégâts de la caisse précisent qu’ils concernent sa poussée ; sa pose seule n’en inflige aucun. Mémoire distingue de même la première pose de sa seconde activation offensive.

L’[extracteur conservé dans le dépôt](../../../../outils/generer_catalogue_combat.cjs) charge `content.js` et `fight.js` dans une VM et ajoute un accès de lecture à leur fermeture **en mémoire seulement**. Il ne réécrit pas le moteur. Les descriptions conditionnelles sont maintenues dans [action-notes.json](../../data/action-notes.json). Le JSON, le module et la fiche sont régénérables ensemble. Leurs paramètres ne commandent jamais la simulation : les sources moteur restent l’autorité.

Le périmètre est nommé **Données du duel** dans Commandes et au dojo. Les rencontres Boss exécutent un autre moteur, avec d’autres délais, dégâts, défenses et ressources. L’interface n’y affiche donc pas ces chiffres comme des règles de Boss. Le présent catalogue n’annonce pas une fiche exhaustive des actions de `boss.js`, ni du Duel originel.

## Délais, interactions et avantage temporel

Les unités sont les pas de simulation à 60 Hz et les unités de la scène 1280 × 720. La première activité est à `t = S`, la dernière à `S + A − 1`. Le moteur efface l’action à `S + A + R + 1`, puis permet le prochain démarrage sans annulation au pas suivant. La récupération nominale `R` ne suffit donc pas à calculer le retour au contrôle. Cette convention est conservée, sans « correction » silencieuse du jeu.

Les fiches distinguent la durée de l’action de celle de son projectile ou marqueur. Le Coup lourd pousse **sa propre caisse MULE immobile** : le moteur exige le marqueur `crate` de l’attaquant (`f.marker`). Cette interaction appartient donc au porteur MULE dans les kits présents. Les captures de position, retours, coûts payés malgré une absence de poste, refus avant dépense, armement de mine, invulnérabilités et interceptions sont décrits par technique. La garde n’inflige aucun grattage de PV dans ce moteur ; son critère ne dépend pas du côté de l’attaquant. L’impulsion horizontale initiale ajoute la poussée déclarée en touche, ou 44 % de cette poussée en garde ; les bornes, contacts de corps et mises à jour suivantes déterminent le déplacement effectif. Une touche confirmée autorise certaines annulations, tandis qu’une touche gardée ne les autorise pas. Les ruptures d’équilibre et les échanges simultanés conservent leurs règles existantes.

L’avantage chiffré compare le premier démarrage possible des deux combattants pour un contact fixé au premier ou au dernier pas actif, sans annulation, rupture, déplacement ou interception. Il ne constitue pas une promesse d’avantage dans toutes les situations. Aucun chiffre universel n’est attribué à une pose ou à un projectile dont le temps de trajet varie.

## Profils IA réellement présents

Débutant, Porteur et Vétéran ont respectivement des intervalles de décision de **5–20, 5–16 et 5–12 pas**. Les probabilités documentées de garde, contre et attaque à distance sont conditionnelles à leur branche. Elles ne sont pas des fréquences globales de match. La difficulté du duel ne multiplie ni les PV ni les dégâts du combattant.

Chaque kit indique les décisions effectivement présentes : traitement de la caisse du MULE, poste de Cliff, sceau de Die-Hardman, ancrage de Mama et mémoire/tempo de Heartman. Les branches génériques ou les réponses non spécialisées restent identifiées. Le bot consulte l’état actuel lors de sa décision ; aucun délai de perception humain séparé ni planificateur universel de pièges n’est inventé. Les scores IA–IA rapides du tournoi demeurent une autre simulation.

## Matrice des rencontres et intégration narrative

La [matrice de relations](../../RELATIONS_SIMULATEUR.md) contient **28 paires, 56 échanges orientés et huit miroirs**. [relationships.js](../../../../modes/echos-de-la-greve/relationships.js) expose `get(p1, p2)` ; une identité inconnue renvoie `null`. La réponse porte le statut « Fiction du simulateur », la version DS1 / Director’s Cut et `officialRelation: false`. Les objets de référence sont gelés, et les lignes retournées sont des copies.

Le premier combattant choisi parle, puis le second répond. Les dialogues sont intégrés avant Versus et Arcade, avec l’action explicite **Combattre · passer l’échange**. Ils ne réécrivent pas les rivalités de Histoire, les textes de campagne, les ordres d’adversaires, les titres d’ending ou les finalités. Les miroirs représentent deux empreintes de la reconstitution, sans prétendre à un événement officiel. Les répliques n’attribuent pas aux kits DS1 des connaissances ou costumes DS2. Aucun doublage ni nouvelle animation de dialogue n’est livré.

## Recette et limites

La [preuve des actions et relations](moves-verification.json) exécute les fonctions réelles au moyen du même principe de lecture en mémoire, avec des états unitaires explicitement préparés.

| Contrôle exécuté | Couverture reçue |
|---|---:|
| Tables et identité des sources | 30 actions, huit kits |
| Fin d’action et prochain démarrage | 30 timings |
| Volumes de mêlée et côtés | 18 cas |
| Impacts, dégâts, ressources et garde | 640 cas, dont 320 avec garde |
| Annulations autorisées ou refusées | 300 cas |
| Avantage aux premier et dernier contacts | 34 mesures |
| Marqueurs, rythmes, invulnérabilités, interceptions et limites | 207 cas |
| Cadences et seuils de choix IA | 24 cas |
| Relations et invariance des récits | 56 orientations, huit miroirs ; routes et scènes identiques à la base |

Les dix contrôles passent. Les empreintes du moteur, du contenu et des deux modules figurent dans le rapport. La [recette Commandes](commandes-verification.json) suit séparément le raccord aux véritables handlers de l’application, l’affichage du catalogue et l’entrée de dialogue dans un **DOM simulé**. Les [règles des commandes](COMMANDES.md) précisent remappage et manettes ainsi que leur portée de test.

Cette recette n’utilise pas de navigateur, ne rend pas de pixels et ne mesure pas l’équilibrage humain. Elle ne prouve ni toutes les confrontations prolongées, ni toutes les réponses IA possibles à chaque projectile, ni la compatibilité de toutes les techniques avec chaque Boss. Ces dépendances restent visibles dans le registre. Les ultimes, renforcées et paramètres cibles n’ont pas été rendus disponibles par l’ajout de fiches.

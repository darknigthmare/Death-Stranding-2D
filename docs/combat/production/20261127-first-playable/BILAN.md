# Premier kit original et première rencontre — 27 novembre 2026

Cette passe rend **Balise jouable en Versus local, Entraînement libre et Relais de liaison**, et ajoute **le Consignateur à Boss Battle**. Elle prolonge les 70 bases visuelles et les 20 arènes statiques de la première réception des Lignes de Marée.

Les contenus originaux appartiennent au projet amateur Death Stranding 2D. Leur direction suit les contraintes de l’extension ; leur présence ne constitue pas une attribution officielle ni une modification du canon.

## Ce qui devient jouable

| Élément | Livraison | Accès |
| --- | --- | --- |
| Balise | Trois normales, trois techniques, ancre destructible, traction physique, appui « Ligne de vie », ressources, IA locale et sauvegarde | Dossier Balise → Entraînement ; sélection en Versus et Relais |
| Consignateur | Rencontre autonome à trois phases, deux consoles, registre, reddition non létale et reprise de phase | Dossier Consignateur → Boss Battle |
| Art | 30 poses Balise, 12 poses Consignateur, cinq objets raccordés et une variante de corde conservée | Registres mesurés, découpes alpha et appuis au sol |
| Interface | Grand aperçu de Balise, fiche des coups, guides de rencontre, vitesse et reprise | Pages existantes du jeu |

Les sélecteurs locaux compatibles proposent désormais **neuf combattants**. Les modes de récit, arcade, tournoi, défis, exercices guidés, Boss et réseau conservent leurs huit kits canoniques. Boss Battle propose sept rencontres ; Boss Rush garde son parcours de six rencontres. Les arènes restent au nombre de 45 configurations locales et 44 pour le Relais.

Le déblocage narratif de Balise est une cible de campagne. Cette première passe ouvre le personnage directement dans les trois modes compatibles et ne simule pas une mission de déblocage inexistante.

## Balise : déplacer le combat par des outils physiques

Maëlle « Balise » Rocher utilise son matériel de sauvetage côtier. Sa bobine reste attachée au côté anatomique gauche. Les nouveaux dessins reprennent sa tenue graphite et orange, son harnais, ses mousquetons et sa corde grise mouchetée rouge.

| Action | Coût | Amorçage / activité / reprise | Effet |
| --- | ---: | --- | --- |
| Contact de contrôle | Aucun | 7 / 3 / 12 pas | 5 dégâts |
| Coup de harnais | Aucun | 15 / 4 / 24 pas | 10 dégâts |
| Relevé de garde | Aucun | 13 / 4 / 25 pas | 8 dégâts |
| Courte traction au lien | 28 Chiral | 18 / 4 / 24 pas | Lien de 2,4 largeurs de corps ; garde et saut restent des réponses |
| Ancrage de rappel | 18 Chiral | 24 / 1 / 21 pas | Un objet à 1,5 corps, quatre secondes de durée, destructible |
| Reprise de corde | 16 Chiral | 10 / 6 / 22 pas | Consomme l’ancre ; traction au plus de 11 pixels par pas pendant six pas |
| Ligne de vie, en appui | 25 Cohésion | 24 / 5 / 26 pas | 6 dégâts ; partenaire visible et interceptable |

Ces valeurs utilisent la simulation à 60 pas par seconde. La traction ne donne aucune invulnérabilité et ne traverse pas le rival. Les ancrages conservent leur propriétaire dans une équipe ; un relais rappelle l’objet du membre sortant sans rembourser sa ressource.

Dans la configuration clavier initiale du joueur 1, **H** déclenche la technique, **D + H** pose l’ancre en regardant à droite et **A + H** rappelle Balise vers son ancre. Les directions s’inversent avec l’orientation. Le menu Commandes affiche la configuration réellement enregistrée.

Les sauvegardes, replays et scénarios de test locaux qui utilisent le kit portent la version de règles `balise-1`. Le vrai mode réseau ne charge pas ce kit.

## Consignateur : obtenir le passage et la restitution

Le Consignateur reste un humain équipé de matériel cargo, d’un petit bouclier et d’une perche de retenue. Sa jauge de 300 mesure la garde. La rencontre utilise la Digue d’aval.

| Phase | Progression de garde | Objectif | Annonce / reprise à vitesse normale |
| --- | --- | --- | --- |
| 1 | 300 → 198 | Punir les poussées manquées et le côté découvert | 60 / 48 pas |
| 2 | 198 → 99 | Désamorcer les deux consoles pendant les reprises | 72 / 42 pas |
| 3 | 99 → 0 | Obtenir le registre puis faire céder la garde | 90 / 60 pas |
| Conclusion | Garde à zéro | S’approcher et confirmer la reddition par une interaction | Adversaire vivant |

Atteindre zéro ne suffit pas à gagner : le registre doit être restitué, les consoles désamorcées et l’interaction finale effectuée. La commande utilise l’action **Prise / interaction**, soit **T** dans la configuration initiale. Le guide reprend la touche personnalisée.

La rencontre propose les vitesses 75 %, 100 % et 125 %. Les échecs par vitalité, intégrité du registre ou chrono permettent de reprendre le début de la phase perdue lorsque le checkpoint est valide. Les ressources, objectifs, temps restant, position de rencontre et graine font partie du contrat de reprise.

Le Consignateur accepte les huit combattants canoniques. L’extension de Balise au moteur Boss est une unité distincte encore à réaliser.

## Réception des images

La passe ajoute **48 PNG natifs autonomes** : 30 poses de Balise, 12 du Consignateur et six objets. Cinq objets sont raccordés : boucle de corde, ancre, console active, console inactive et registre. La boucle orange initiale reste conservée comme variante ; la version grise mouchetée rouge assure la cohérence avec les poses.

Chaque direction utilise un dessin distinct. Le moteur ne retourne pas horizontalement ces sprites, ce qui évite d’échanger les côtés de l’équipement. Les fichiers sources restent intacts ; les registres décrivent les découpes, facteurs de hauteur et ancres d’appui mesurés.

La réception compare les nouveaux dessins aux références originales déjà présentes et contrôle leur composition dans la scène. Elle ajoute des poses clés et deux appuis de marche ; elle ne fournit pas tous les cycles dessinés intermédiaires de la bible.

**Les 539 rasters antérieurs et les 33 SVG historiques sont préservés.** Les actifs raster deviennent 587. Les planches et captures de vérification sont conservées dans le dossier documentaire et ne sont pas comptées comme actifs du jeu.

## Vérifications et traçabilité

Le détail des commandes, preuves, limites et résultats est dans [VERIFICATION.md](VERIFICATION.md). Les règles de Balise sont documentées dans [BALISE.md](BALISE.md), celles du Consignateur dans [CONSIGNATEUR.md](CONSIGNATEUR.md). Les prompts et blobs retenus sont dans [art-generation.json](art-generation.json) ; les mesures réelles dans [assets-reception.json](assets-reception.json).

Les vérifications distinguent les simulations déterministes, les interfaces sous hôte DOM de test, le rendu Canvas natif et les parcours dans Chromium. Une capture ou une fiche de conception ne remplace pas l’essai du système correspondant.

## Manquants qui restent ouverts

| Lot | Reste après cette passe |
| --- | --- |
| Personnages originaux | Neuf autres kits ; cycles complets et variantes des dix personnages ; super, conclusion et campagne de Balise |
| Ennemis | Les vingt IA, leurs attaques et leurs animations, au-delà des bases visuelles reçues |
| Boss originaux | Dix-neuf rencontres ; campagnes et récompenses du Consignateur |
| Stages | Vingt missions et leurs objectifs ; cent plans autonomes, météo et transitions |
| Contenus associés | Cinq duos, six bonus, gadgets, véhicules, scènes et costumes |
| Fidélité et exploitation | Corrections canoniques encore ouvertes, recette de manettes physiques et équilibrage humain |

Ces éléments restent signalés dans la bible et le registre de production. Aucun état documentaire ne les transforme en contenu jouable.

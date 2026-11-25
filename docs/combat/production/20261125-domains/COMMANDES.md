# Commandes reconfigurables et manette standard

**Lot du 25 novembre 2026 · Échos de la Grève.** Le remappage est utilisable depuis le bouton **Commandes** du jeu local et du salon privé. Le module partagé [input.js](../../../../modes/echos-de-la-greve/input.js) remplace les deux tables de touches auparavant séparées. Les moteurs continuent à recevoir leurs dix actions existantes ; leurs règles et identifiants de combat restent inchangés par cette fonction.

Cette livraison répond au remappage prévu par la [bible, §3 et §12.10](../../BIBLE_COMBAT.md). Elle comprend l’éditeur, la persistance, les libérations de touches, la mise à jour de l’aide et une entrée pour les manettes reconnues comme standard. La [recette des commandes](commandes-verification.json) distingue les modules réels, les surfaces simulées et les échantillons de manette utilisés.

## Parcours disponible

Le joueur ouvre **Commandes**, descend dans **Mes commandes**, choisit un profil et **Joueur 1** ou **Joueur 2**, puis sélectionne la touche à remplacer. Le texte annonce l’action attendue. Une pression valide applique la touche et rend le focus au bouton correspondant. Le bouton **Annuler la saisie** et **Échap** annulent sans modifier le profil. **Tab** quitte la capture et conserve la navigation du navigateur. Un changement de fenêtre annule également la capture.

Trois emplacements nommables sont conservés. Chacun contient deux configurations indépendantes, une pour J1 et une pour J2. Chaque action garde une touche principale obligatoire et peut recevoir une seconde touche. Retirer la seconde touche laisse la première disponible. Les valeurs initiales conservent les commandes précédentes de l’interface principale :

| Action | J1 par défaut | J2 par défaut |
|---|---|---|
| Gauche | Q / A | ← |
| Droite | D | → |
| Saut | Z / W | ↑ |
| Bas | S | ↓ |
| Coup léger | F | J |
| Coup lourd | G | K |
| Signature | H | L |
| Garde | R | U |
| Projection | T | I |
| Finalité | Y | O |

Une touche appartient à une seule action dans le profil actif, y compris entre J1 et J2. Une collision affiche la commande qui la possède et laisse les valeurs précédentes intactes. **Restaurer J1** ou **Restaurer J2** remet les valeurs de ce joueur ; si cela empiète sur une touche personnalisée de l’autre joueur, la restauration est refusée avec une explication. **Restaurer J1 et J2** restaure l’ensemble du profil. Les autres profils ne sont pas remplacés.

Échap reste la commande de pause hors ligne et d’annulation de saisie. Tab et les modificateurs restent disponibles pour la navigation. Les raccourcis Ctrl, Alt et ⌘ ne déclenchent pas de coup. Entrée et Espace peuvent être attribuées au combat ; lorsqu’un bouton, lien ou résumé possède le focus, elles conservent leur rôle d’activation de l’interface. Le canevas est accessible au clavier pour revenir au combat. Le bouton **Fermer** reste en tête de la fenêtre de commandes pendant son défilement.

## Portée par mode

Les neuf modes locaux ont chacun reçu une vérification de déplacement par touche remappée et par échantillon de manette standard, à travers le vrai moteur chargé par l’application. Le tableau `modeInputs` du [rapport JSON](commandes-verification.json) conserve ce résultat par identifiant. Il s’agit d’un contrôle de raccordement des entrées, pas d’une partie complète avec manette matérielle.

| Mode | J1 | J2 local | Portée de la manette |
|---|---|---|---|
| Histoire | Clavier remappé, tactile, manette | Adversaire IA | Première manette |
| Arcade | Clavier remappé, tactile, manette | Adversaire IA | Première manette |
| Versus | Clavier remappé, tactile, manette | Actif si « Joueur 2 · local » | Deux manettes si deux humains |
| Tournoi | Le combattant humain seul utilise J1 | Actif lors d’un duel entre deux humains | Même attribution que les commandes du duel |
| Défis | Clavier remappé, tactile, manette | Adversaire IA | Première manette |
| Entraînement | Clavier remappé, tactile, manette | Actif pour « Enregistrer J2 » | La seconde manette commande le mannequin enregistré |
| Boss Battle | Clavier remappé, tactile, manette | Sans second joueur | Première manette |
| Boss Rush | Clavier remappé, tactile, manette | Sans second joueur | Première manette |
| Campagne du simulateur | Clavier remappé, tactile, manette | Sans second joueur | Première manette ; moteurs duel et Boss conservés |
| Salon privé | Profil local J1 ou J2, au choix | Le second humain joue depuis son propre client | Première manette locale |

Dans les grandes rencontres, les actions internes `throw` et `finish` gardent leur adaptation **Colis / Appui** et **Charge chirale**. Leurs touches suivent le profil J1. L’éditeur nomme explicitement la première **Projection · Colis / Appui en Boss**, afin de relier les noms d’action. Les objectifs, messages de colis et rappels du HUD utilisent ces noms plutôt que des touches fixes. Au dojo, l’enregistrement J2 reçoit les actions logiques remappées ; le lecteur de mannequin conserve son format. Les relectures de tournoi et de salon ignorent les nouvelles commandes de combat locales.

**Le Duel originel est exclu de cette intégration.** Sa page et son moteur historiques ne chargent pas `input.js`, ses commandes ne sont pas remappées par ces profils et aucune prise en charge manette de ce lot n’y est annoncée. Aucun fichier de `duel-originel/` n’a été modifié. L’éditeur affiche cette distinction. Les neuf modes ci-dessus concernent l’interface principale d’Échos de la Grève, pas ce prototype historique.

## Manette et neutralisation des entrées

Le navigateur doit exposer un périphérique dont `mapping` vaut `standard`. Les directions utilisent la croix et le stick gauche. La zone neutre est de **25 %** par défaut, réglable entre les valeurs proposées de **15 % à 60 %**. Un périphérique sans disposition standard reconnue n’est pas interprété au hasard ; son état apparaît dans l’aide.

| Fonction | Position standard retenue |
|---|---|
| Saut | Haut de la croix / du stick, ou bouton inférieur du groupe droit |
| Léger / lourd / signature | Boutons gauche / haut / droit du groupe droit |
| Garde | Épaule ou gâchette gauche |
| Projection / colis / appui | Épaule droite |
| Finalité / charge chirale | Gâchette droite |
| Pause / reprise hors ligne | Menu / Options |

Les indices proviennent de la [disposition Standard Gamepad du W3C](https://www.w3.org/TR/2026/WD-gamepad-20261119/#remapping). Les lettres ou symboles affichés ne remplacent pas la position du bouton : ils varient selon la manette. Les menus restent utilisables au clavier, à la souris et au toucher ; aucune navigation de menu à la manette ni vibration n’est livrée ici.

Les deux premières manettes détectées reçoivent J1 puis J2 en local. Si J1 se déconnecte, la manette de J2 conserve son attribution. Une nouvelle connexion, une pause, un changement de profil ou un retour de focus demande un retour des sticks et boutons à l’état neutre avant de reprendre les entrées. Une déconnexion met le jeu local en pause et libère les actions. Dans le salon, elle transmet une libération et laisse le clavier disponible, sans suspendre la simulation distante.

Le contrôleur compte les sources qui maintiennent une action. Par exemple, relâcher F ne relâche pas le coup léger tant qu’un bouton tactile ou de manette le maintient encore. La dernière source relâchée émet la sortie correspondante. Les relâchements de clavier utilisent l’identité physique de la touche, afin de rester corrects si la casse, un modificateur ou le focus change avant le relâchement. Focus sur un contrôle de menu, fenêtre masquée, pause, changement de configuration et sortie du combat neutralisent les entrées actives.

## Persistance, réseau et données de combat

La clé est **`echos.input.v1`**, schéma **1**. Elle contient le profil actif, les trois profils J1/J2, leurs noms, l’activation et la zone neutre de la manette, ainsi que le choix du profil local du salon. Les sauvegardes de routes, tournoi, défis, Boss et campagne ne sont pas réutilisées. Un document invalide charge les valeurs par défaut avec un message ; il n’est pas écrasé par sa seule lecture. Si le stockage est refusé ou plein, le réglage reste utilisable pour la session et son état de sauvegarde est annoncé. Une modification valide depuis un autre onglet actualise les commandes et libère les entrées précédentes.

Dans le salon, **Mes touches dans ce salon** choisit J1 ou J2 indépendamment du numéro de siège distant. J1 est sélectionné initialement ; les flèches appartiennent désormais au profil J2 explicitement sélectionnable, au lieu d’être des alias implicites de J1 propres au salon. L’aide affiche exactement la configuration locale utilisée. Le réseau continue d’échanger `left`, `right`, `up`, `down`, `light`, `heavy`, `special`, `guard`, `throw` et `finish`. Les touches physiques, noms de profil et états de manette restent locaux. Ouvrir l’éditeur réseau neutralise le combattant mais ne met pas le duel distant en pause ; cette conséquence est affichée dans la fenêtre. Déconnexion du relais et résultat déclaré empêchent de nouvelles pressions.

Les labels du tableau Commandes, des signatures, des finalités, de l’aide du dojo et des boutons tactiles suivent le profil. Les boutons tactiles conservent leurs noms d’action lisibles ; leurs libellés accessibles et leurs infobulles donnent les touches courantes. Le panneau **Données du duel** affiche les [fiches chargées](../../ACTIONS_ET_IA.md) uniquement pour les duels et le dojo ; les grandes rencontres gardent leurs données propres.

Les [échanges du simulateur](../../RELATIONS_SIMULATEUR.md) sont proposés avant Versus et Arcade avec un bouton pour combattre immédiatement. Histoire et campagne conservent leurs scènes. Le raccord [Quai → hangar](TRANSITIONS.md) affiche sa règle dans la sélection et l’avant-duel, puis annonce le passage. Sa configuration liée est exclue du sélecteur Boss ; le hangar indépendant reste sélectionnable. La transition conserve les touches tenues selon le contrat du moteur : l’interface n’ajoute aucune remise à zéro automatique pendant ce passage.

## Vérification et limites

La [recette ciblée](commandes-verification.json) exécute le module partagé, son éditeur, l’application et le salon. Elle couvre les vingt couples joueur/action, les profils et restaurations, collisions, données invalides, capture et annulation, focus, modificateurs, répétition clavier, sources simultanées, zones neutres, boutons standard, déconnexion et réarmement. Les neuf modes locaux sont ouverts par leurs vrais handlers, puis déplacés avec les vrais moteurs. J2 est également contrôlé dans Versus local et l’enregistrement du dojo. Pour le salon, le contrôleur est réel et le relais ainsi que le moteur sont des adaptateurs de test explicitement déclarés ; la recette ne revendique pas une partie réseau matérielle.

La revue indépendante a relevé un défaut de surbrillance lorsque clavier et tactile maintenaient le même coup : le bouton pouvait rester allumé après le dernier relâchement clavier. Le nettoyage se fait désormais au relâchement logique agrégé. La recette reproduit les deux sources, les relâche successivement et vérifie que la surbrillance disparaît lorsque la dernière source cesse.

La [non-régression de campagne](campaign-input-regression.json) conserve le parcours complet : six victoires, deux défaites suivies de reprise, deux livraisons de convoi, interludes, conclusion, isolation des sauvegardes et 55 chemins requis présents. Les données des huit routes et les 24 séquences / 48 emplacements narratifs restent vérifiées. Le contrôle existant des préférences et reconstructions réseau est conservé dans [network-input-regression.log](network-input-regression.log).

Commandes reproductibles depuis la racine du dépôt :

```sh
node modes/echos-de-la-greve/qa/commandes.cjs --output=docs/combat/production/20261125-domains/commandes-verification.json
node modes/echos-de-la-greve/qa/campaign.cjs --require-assets --output=docs/combat/production/20261125-domains/campaign-input-regression.json
node modes/echos-de-la-greve/qa/ambiances.cjs --network-only
```

Ces preuves utilisent un DOM et un Canvas simulés. Les échantillons Gamepad sont synthétiques ; **aucune manette physique, aucun navigateur natif et aucun contrôle de mise en page mobile rendu ne sont revendiqués**. Les parcours Playwright existants ont reçu les sélecteurs du nouvel écran avant-match et du bouton Fermer ; leur exécution navigateur n’est pas annoncée par ce lot. Les fichiers du Duel originel restent hors périmètre.

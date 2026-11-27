# Relais de liaison — réalisation du profil équipe local

**27 novembre 2026 · Death Stranding 2D / Échos de la Grève**

Le [profil équipe de la bible](../../EXTENSIONS_COMBAT.md#4-assistance-relais-duos-et-ruptures-de-lien--conception-retenue) possède désormais une première réalisation jouable : **deux membres par camp, assistance, transfert de contrôle, Cohésion, auto-relais après K.-O. et sauvegarde locale dédiée**. Le mode utilise le moteur Canvas du duel, ses huit kits et leurs images déjà intégrées. Les règles d'équipe ne s'activent que lorsqu'une composition à deux membres est transmise au moteur.

[Ouvrir Relais de liaison](../../../../modes/echos-de-la-greve/teams.html) · [Recette simulation et interface](teams-verification.json) · [Rendus Canvas natifs](teams-native.json).

## Jouer

Dans **Relais de liaison**, choisir deux kits différents pour chaque camp et une arène. Un miroir entre camps est permis. Le deuxième camp peut être contrôlé par l'IA ou par une deuxième personne sur le même poste. Les arènes à transition sont exclues de cette première version ; leurs règles de propriété et d'arrivée demandent une extension propre.

Les coups, les signatures directionnelles, la garde, les projections et le déplacement conservent les commandes du profil existant. Les deux commandes d'équipe utilisent des emplacements déjà remappables :

| Commande en équipe | Profil clavier par défaut | Manette standard |
| --- | --- | --- |
| Appui du partenaire | J1 : **Y** ; J2 : **O** | Gâchette droite, RT / R2 |
| Relais volontaire | J1 : **B** ; J2 : **P** | Clic du stick gauche, L3 |
| Pause / reprise | **Échap**, ou bouton à l'écran | Menu / Options |

Les libellés tactiles affichent les touches du profil courant. Dans l'éditeur partagé, l'emplacement **Finalité** pilote l'appui pendant le combat ; **Geste de défi** pilote le relais. À l'invitation de fin, la commande d'appui redevient la finalité individuelle. Le geste de défi n'est pas exposé dans ce profil équipe. Les menus et quatre choix de membre restent accessibles au clavier et au toucher.

La réserve et sa barre de vie apparaissent en bas du Canvas, avec la Cohésion et les récupérations de chaque équipe. Un état textuel séparé du Canvas affiche les quatre vitalités. **Effets réduits** stabilise aussi le décor ; les corps d'assistance, télégraphes et projectiles utiles restent visibles.

## Règles effectivement implémentées

| Élément | Réalisation |
| --- | --- |
| Composition | Deux kits distincts parmi Sam, Fragile, Higgs DS1, Cliff, MULE, Die-Hardman, Mama et Heartman. |
| Vie / Chiral / équilibre | Trois valeurs propres à chaque membre ; 100 PV au début du combat. La réserve ne régénère ni ses PV ni son Chiral. Un projectile émis peut encore donner son gain de Chiral à son propriétaire. |
| Cohésion | Capacité 100 ; départ à 50 ; +0,1 par pas actif, soit 6 par seconde de simulation à 60 Hz. |
| Suspension des horloges | Pause, hitstop, introduction et scènes de fin suspendent la recharge et les horloges d'équipe. |
| Assistance | 25 Cohésion ; annonce de 18 pas avant son action ; présence totale de 60 pas, puis 360 pas de récupération. |
| Vulnérabilité de l'appui | Corps distinct réellement touchable par mêlée, projectiles et pièges. Une interruption empêche l'action qui n'a pas encore été émise ; les dégâts portent sur la réserve. Aucun remboursement. |
| Relais | 15 Cohésion ; actif au sol, neutre, hors garde, dash, geste, attaque et réception de coups. Transfert au pas 15 ; engagement total de 30 pas ; récupération de 240 pas après sortie ou interruption. |
| Interruption du relais | Un coup sur le membre présent interrompt le transfert ou sa fin d'entrée. Le débit reste engagé. Le membre déjà entré garde le contrôle après la récupération du coup. |
| Engagement unique | Une équipe ne mobilise qu'un partenaire à la fois. Une deuxième commande refusée ne consomme rien. Les deux camps peuvent appeler simultanément. |
| K.-O. de l'actif | Le survivant entre automatiquement, même avec zéro Cohésion ou une récupération de relais active ; ses ressources et délais sont conservés. |
| Défaite | Deux membres à zéro PV. Aucune résurrection. |
| Temps | 75 secondes actives ; comparaison de la somme des PV des deux membres, équivalente à la somme des proportions avec les deux maximums de 100 PV. |
| Égalité au temps | PV et ressources conservés ; survivants replacés, actions/objets de la phase précédente retirés ; le prochain avantage net de dégâts décide. Des dégâts simultanés égaux ne départagent pas. |
| Double K.-O. final | **Égalité**, sans créer de survivant. Cette précision complète le départage du document de conception. |
| Combo d'équipe | Historique partagé entre actif et appui, conservé au relais. Les deux premiers contacts gardent leur coefficient ; réduction de 8 points de pourcentage par contact supplémentaire, plancher à 45 %. Ce réglage initial est propre au mode équipe. |

Les horloges utilisent les pas de simulation, pas le temps mural. Une interface lente, une pause ou une réouverture de sauvegarde ne génère pas de Cohésion supplémentaire.

## Les huit appuis du simulateur

Ces fonctions sont des adaptations de l'exercice de combat. Elles ne déclarent pas une nouvelle capacité canonique des personnages.

| Réserve | Appui | Comportement reçu |
| --- | --- | --- |
| Sam | Liaison de couverture | Un projectile de liaison à hauteur du torse, propriétaire Sam. |
| Fragile | Quai de passage | Frappe courte de parapluie devant elle ; fenêtre de contact aux pas 18 à 21. |
| Higgs DS1 | Empreinte de repli | Petite manifestation de goudron à distance bornée devant l'appui. |
| Cliff | Couverture de section | Une émission de couverture ; aucun nouveau membre d'équipe ou soldat permanent. |
| MULE | Livraison interceptée | Une caisse d'exercice mobile au ras du sol, indépendante de sa Consigne native. |
| Die-Hardman | Consigne de couverture | Portique virtuel bref à portée annoncée. |
| Mama | Travée d'essai | Petit segment technique du simulateur. Aucun enfant Échoué n'est employé comme projectile. |
| Heartman | Mesure croisée | Une impulsion du moniteur de simulation, sans soin ni réanimation. |

Les entrées et sorties utilisent les postures existantes ; la courte action réutilise une pose déjà intégrée au kit. **Aucun nouveau cycle dessiné d'assistance ou de tag n'est compté comme produit dans ce lot.** Les participants sont néanmoins des acteurs du combat réel, avec durée, collisions, dégâts et états de contrôle.

## Objets et attribution

Chaque projectile conserve **camp et membre émetteur**. Un bola lancé par Sam demeure le sien après l'entrée de Fragile ; il n'adopte ni sa puissance ni son gain de Chiral. Le plafond de trois projectiles simultanés est partagé au sein de l'équipe ; une émission excédentaire ne crée pas de quatrième projectile.

Le passage en réserve rappelle le poste de Cliff et l'ancrage de Mama, sans remboursement. La caisse MULE devient inerte et garde son expiration. La balise de Fragile et la mémoire de Heartman ne sont utilisables que par leur propriétaire actif, avec durée conservée. L'empreinte de Higgs garde son propriétaire, son armement et son expiration ; elle reste dessinée même si Higgs est en réserve. Un K.-O. retire les objets posés du membre mort après les contacts du pas courant. La fin d'une manche nettoie les objets des quatre membres.

Les contacts des actifs, des appuis et des projectiles sont collectés avant l'application des dégâts. Ce relevé commun permet un échange de coups simultané ; aucun camp n'annule le coup de l'autre simplement parce qu'il est parcouru en premier.

## Sauvegarde et reprise

**Enregistrer et quitter** place le combat en pause puis écrit `echos.teams.v1`. La sauvegarde conserve la composition, le mode IA/local, la difficulté, l'arène, les quatre états de combattant, les valeurs de Cohésion, les récupérations, l'intervention en cours, les projectiles, les objets et les générateurs déterministes.

La reprise vérifie le schéma `relay-1`, les kits, les plages de ressources, les actions et les propriétaires. Elle redémarre **en pause**, sans touche physique maintenue, avec un bouton **Reprendre**. Un changement de roster, de difficulté ou d'arène incompatible ne charge pas silencieusement la partie dans une autre configuration.

Si l'écriture est refusée, le combat reste disponible en pause et l'interface dit que le stockage est indisponible. Elle ne prétend pas avoir enregistré la partie et ne ferme pas la scène. Les progressions, replays, campagnes, Boss et Dossiers de liaison précédents utilisent leurs clés existantes, sans conversion par ce module.

## Vérification et limites

La recette comporte **25 groupes** sur le moteur réel et l'interface sous adaptateur DOM explicite : coûts atomiques, insuffisance de ressource, conditions du tag, pas exact de transfert, non-régénération, délais, pause/hitstop, assistance blessée ou K.-O., interruption de départ, appels simultanés, plafond de projectiles, auto-relais, propriété après changement, expiration d'objets, somme de vitalité, départage, double K.-O., combo partagé, huit appuis, reprise, corruption et stockage refusé. Les mises en situation de combat difficiles à atteindre sont injectées via le format de reprise validé ; les actions qui les vérifient passent ensuite par la simulation ordinaire.

Les contrôles historiques de présentation et de dojo restent réussis : **20 groupes de présentation**, dont **3 240 états identiques** à la simulation de référence, et **14 groupes de dojo / 53 parcours**. Ils ne prouvent pas la réception matérielle d'une manette.

La réception graphique fournit **quatre captures Canvas natives à 1280 × 720**, avec **65 images réellement décodées**, comprenant les deux camps, l'entrée simultanée des appuis, le transfert de contrôle et les effets réduits. Les sources graphiques sont vérifiées par SHA-256 après rendu. Le [rendu des deux appuis](team-renders/both-supports-enter.webp) et le [transfert vers Fragile](team-renders/control-transferred.webp) montrent l'état observé, pas une maquette.

Les rendus Canvas ne valident pas la mise en page HTML dans un navigateur. Chromium et une manette physique n'ont pas été réceptionnés pour ce lot. Le mode reste local : pas de session réseau en équipe, pas d'équipe contre Boss, pas de nouvelle route narrative collective. Les supers duos, Ruptures d'équipe, fins dramatiques, clashes et QTE restent à réaliser. Les dix personnages originaux de l'extension ne deviennent pas des kits jouables par leur présence dans un catalogue ; ils devront obtenir leur implémentation et leurs cycles propres.

### Reproduire la recette

```bash
node modes/echos-de-la-greve/qa/teams.cjs --output=docs/combat/production/20261127-team-gameplay/teams-verification.json
node modes/echos-de-la-greve/qa/teams-canvas.cjs
node modes/echos-de-la-greve/qa/presentation.cjs
node modes/echos-de-la-greve/qa/lessons.cjs
```

Le rendu natif utilise `@napi-rs/canvas`. Les trois autres commandes utilisent Node et les adaptateurs de contrôle déjà fournis dans le dépôt.

## Géométrie des panoramas de l'extension

Le moteur accepte aussi `stageGeometry[id].legacy.floorY`, une ligne de sol mesurée entre 0 et 1 dans un panorama natif. Lorsque ce repère est fourni, le dessin conserve son ratio et place cette ligne au niveau de combat `FLOOR`, en couvrant le haut, le bas et la marge de caméra. Sans ce repère, le centrage historique demeure. Ce raccord ne fabrique pas de couches de parallaxe ; il permet aux nouveaux panoramas documentés de conserver une assise cohérente avec les combattants.


## Revue indépendante de clôture

La [revue indépendante](INDEPENDENT_REVIEW.md) a reproduit puis corrigé les reprises incohérentes, un verrou orphelin, des coordonnées d’objet absentes, le dash de l’IA pendant un relais et l’attribution de la finale après un échange simultané. Ses [six groupes supplémentaires](teams-independent-review.json) complètent les 25 groupes initiaux. Les captures et empreintes du moteur ont été régénérées après correction. Le vainqueur d’un échange final est désormais le membre survivant, tandis que son partenaire reste K.-O.

# Quai → hangar : première liaison du simulateur

Statut : réalisé et recette ciblée réussie le 25 novembre 2026. Ce document est la fiche H de la liaison `terminal-quay-hangar`, version 1 (`terminal-quay-hangar@1`). Les limites des preuves sont précisées ci-dessous.

## Périmètre et choix explicite

La configuration `terminal-linked` propose **Quai → hangar · liaison du simulateur**. Elle commence sur le quai du centre de distribution et permet un passage vers une zone intérieure reconstituée. Le rapprochement de ces deux pistes appartient au simulateur du projet ; il ne prétend pas décrire une liaison géographique canonique.

Le centre de distribution ordinaire (`terminal`) conserve son duel sans passage. La zone `terminal-hangar`, sélectionnée seule, est également une piste sans liaison. Les routes existantes ne changent pas implicitement de règles. Le choix lié est proposé en Versus contre l’IA ou local, au dojo et dans les salons privés. Le sélecteur des rencontres Boss le filtre, car leur moteur ne réalise pas cette transition.

Les nouveaux tirages automatiques de tournoi excluent les configurations portant une liaison. Les arènes et résultats des tournois déjà sauvegardés restent conservés ; les anciennes sauvegardes sans identifiant d’arène gardent leur repli historique dans l’interface. Le moteur sait enregistrer et relire une bande liée, y compris celle d’un salon privé, mais ce support ne constitue pas un changement implicite des règles du tournoi.

## Déclenchement, priorité et contre-jeu

Les limites physiques demeurent x = 48 et x = 1232, sur le sol y = 588. Les deux bandes de déclenchement occupent les 96 pixels intérieurs : x ≤ 144 ou x ≥ 1136. Un repère de combat signale chaque bande sur la piste.

Un **coup lourd standard** (`heavy`) ou une **projection** (`grab`) doit toucher sans être bloqué, avec les deux combattants au sol. La victime doit se trouver dans une bande ; la frappe doit partir de l’intérieur vers le bord correspondant. Aucun projectile, attaque spéciale, coup léger, déplacement seul, coup bloqué ou interception défensive n’ouvre le passage. S’éloigner du bord, esquiver ou intercepter la frappe l’empêche ; la garde arrête le coup lourd mais conserve la vulnérabilité habituelle à la projection.

Toutes les collisions d’un tick sont résolues avant de décider du passage. Si plusieurs contacts pourraient le demander, l’ordre déterministe des contacts retient le premier candidat, sans produire deux passages. Un K.-O., un double K.-O., une fin de temps, une égalité au temps ou un rétablissement de vitalité du dojo annule ce candidat. Les règles ordinaires du résultat ou de la mort subite passent alors en premier.

Il n’y a **aucun dégât de décor ni coût supplémentaire**. Les dégâts, pertes d’équilibre, gains chiraux et éventuelle rupture du scellé du colis sont ceux du coup déjà résolu.

## Passage et arrivée

Le moteur entre dans la phase `transition` pendant exactement **36 ticks**, soit 0,6 seconde à 60 Hz. Le tick global continue ; le chrono de manche, la régénération, les combattants et les projectiles ne progressent pas. Le tick du coup déclencheur a déjà consommé son unité de temps normale. Le quai reste affiché durant l’annonce, puis le hangar apparaît à l’arrivée.

Les valeurs exactes de vitalité, d’équilibre et de chiral sont conservées après le coup, ainsi que le scellé du colis. Les actions, combos, étourdissements, dashs, vitesses, marqueurs, scans, projectiles, particules et commandes mises en attente sont effacés ; cela inclut le marqueur de sceau (`seal`) de Die-Hardman. Les touches physiquement tenues restent connues : déplacement et garde peuvent reprendre au premier tick jouable. Une attaque pressée durant le passage n’est pas mise en attente ; il faut la relâcher puis la presser après l’arrivée.

L’arrivée est symétrique et neutre. L’attaquant arrive à x = 510 et sa cible à x = 770 pour une sortie à droite ; l’ordre spatial s’inverse pour une sortie à gauche. Les deux combattants sont au sol, se font face et disposent d’un écart de 260 pixels. Aucun dégât, étourdissement ou attaque automatique ne suit l’arrivée. Ils retrouvent leurs commandes au même tick. La caméra de combat revient au centre.

Un passage au maximum est autorisé par manche, sans retour pendant cette manche. La manche suivante recrée le quai et son passage disponible. Le redémarrage du dojo applique le même rétablissement. Une pause fige le décompte ; quitter ou arrêter le moteur détruit la rencontre en cours et ses éventuels rappels d’image. Aucune sauvegarde externe autonome n’est créée par la liaison.

## Réseau, enregistrement et restauration

La configuration sélectionnée reste `terminal-linked` dans les résultats et les bandes. Son état mutable comporte l’identifiant et la version de liaison, la zone active, son utilisation, le côté du déclenchement et le joueur attaquant. Cet état entre dans les checkpoints uniquement pour cette configuration ; les checkpoints des pistes ordinaires conservent leur structure antérieure.

La restauration remet la phase, son décompte, la zone et le décor correspondant. Un état de liaison incompatible est refusé avant toute mutation. Les bandes de duel lié exigent `stageRules: "terminal-quay-hangar@1"` ; une bande sans cette version n’est pas interprétée avec des règles implicites. Les bandes ordinaires antérieures restent compatibles. Le salon privé partage la configuration et l’empreinte du moteur. Ses règles existantes de présence et de suspension restent applicables ; le passage n’utilise aucun délai asynchrone extérieur au tick du match. Les commandes retardées sont réconciliées par les mêmes checkpoints que le reste du duel.

Les deux décors sont demandés au début de la rencontre. Leur disponibilité ou leur vitesse de décodage ne commande jamais la simulation. Le profil **Décor statique** continue de figer les paramètres de présentation, mais le changement réel de zone demeure visible. Les repères et l’annonce de passage sont des informations de combat et restent affichés avec les effets réduits ou le décor statique.

## Images et géométrie

`terminal-linked` réutilise les six chemins du quai existant, sans copie de pixels. Le hangar utilise le panorama `assets/static-domains-20261125/terminal-hangar-panorama.png` et cinq PNG `assets/stages/terminal-hangar-{sky,distant,midground,floor,foreground}.png`.

Les six sources natives mesurent 1672 × 941. Les couches conservent leur rapport d’aspect. Le support stable du plan de sol est mesuré à y = 447 avec un alpha d’au moins 250 sur au moins 98,5 % de la largeur pendant quatre lignes ; `anchorY: 447/941` l’ancre au sol physique y = 588. Le seuil plus souple de 224 situe le bord central médian à y = 443 ; le choix de 447 place la bande stable, au-delà de cet anticrénelage. Les fonds lointain et intermédiaire sont ancrés à leur base native, respectivement y = 598 et y = 594 dans la scène. Les sources natives ne sont ni découpées ni recolorées pour cette intégration.

Le catalogue contient désormais **19 lieux, 20 zones graphiques, 22 configurations sélectionnables et 105 chemins de couches distincts**. Le hangar est une zone du centre (`zoneOf: "terminal"`) ; la configuration liée est une variante explicite qui réutilise le quai. Ces trois niveaux ne doivent pas être additionnés comme des lieux distincts.

## Recette ciblée et preuves

| Preuve | Résultat observé |
| --- | --- |
| [transitions-verification.json](transitions-verification.json) | 8 déclenchements : deux joueurs × deux côtés × lourd/projection, dont quatre approches entièrement pilotées par commandes depuis les positions initiales. 36 ticks exacts, ressources inchangées pendant le passage et contrôle immédiat à l’arrivée. |
| Même rapport logique | Coups bloqués/légers, mauvais sens, centre de piste, projectile et victime aérienne exclus ; marqueurs, scans, projectiles et combos effacés ; scellé intact ou rompu conservé ; touches tenues et absence de mise en attente d’attaque vérifiées. |
| Même rapport logique | K.-O., K.-O. au dernier tick, double K.-O., temps, égalité au temps, échange simultané, vitalité rétablie du dojo, retour de manche, limite d’utilisation, pause et arrêt pendant le passage vérifiés. Un ancien rappel d’image ne peut pas modifier la rencontre suivante. |
| Même rapport logique | 5 points de reprise JSON, 7 restaurations incompatibles refusées avant mutation, 650 comparaisons identiques entre décor statique et animé. |
| Même rapport logique | 336 checkpoints identiques au moteur de `2250b7c1b54b445637e0c9354133e6fecbc325de`, sur les 21 configurations sans liaison et quatre kits représentatifs. Le même catalogue actuel est fourni aux deux moteurs pour isoler le changement de simulation. |
| Même rapport logique | Duel complet piloté par commandes : 802 ticks, 25 événements, puis 802 états de rediffusion identiques. Deux moteurs clients, dont un avec commandes retardées de 7 ou 60 ticks : 13 retours de checkpoint, dont un traversant le changement réel de zone, puis état final identique. |
| Même rapport logique | 200 nouveaux tirages de tournoi sans liaison ; 200 sauvegardes produites par la version précédente reprises en conservant leurs arènes et résultats déjà acquis ; métadonnées absentes des très anciennes sauvegardes laissées intactes. |
| [stage-source-measurements.json](stage-source-measurements.json) | Dimensions, alpha, empreintes et support du sol mesurés sur les cinq PNG de couches inchangés. |
| [stage-renders/validation.json](stage-renders/validation.json) | 8 rendus du hangar avec le vrai moteur et Canvas natif : local/dojo, gauche/droite, effets normaux/réduits. Raccord au sol : alpha minimal 255 ; composition finale : 255 ; premier plan dans la zone des combattants : alpha maximal 1. Rapport d’aspect, ancrage et repli sur panorama contrôlés. |
| [linked-renders/validation.json](linked-renders/validation.json) | 26 rendus liés vérifiés avec les PNG natifs : deux côtés, décor animé/statique, quai/annonce/hangar. 14 restaurations visuelles exactement identiques en RGBA, dont deux redémarrages réseau conservant la composition statique tenue au bord. |
| [commandes-verification.json](commandes-verification.json) | Raccords des véritables handlers d’interface : sélection liée, hangar indépendant et exclusion de la configuration liée du choix Boss. L’hôte DOM est simulé. |

Les contrôles de rendu et la revue visuelle n’ont révélé ni bande de ciel au raccord, ni obstacle de premier plan masquant les pieds. Les captures du hangar ont aussi fait l’objet d’une lecture indépendante. Les quatre captures de liaison sont [le quai avant impact](linked-renders/terminal-linked-right-quay.webp), [l’annonce du passage](linked-renders/terminal-linked-right-passage.webp), [l’arrivée après une sortie à droite](linked-renders/terminal-linked-right-hangar.webp) et [l’arrivée après une sortie à gauche](linked-renders/terminal-linked-left-hangar.webp).

### Portée des résultats

La simulation a exécuté les vrais moteurs. Les branches rares de collision et de résultat utilisent explicitement des positions ou ressources préparées au moyen du checkpoint public ; elles sont distinguées des parcours entièrement pilotés par commandes. Les deux clients de la recette sont des moteurs simulés avec un calendrier de livraison déterministe, pas deux navigateurs distants. Les pixels sont rendus par `@napi-rs/canvas`, pas par un navigateur. La recette ne prouve donc ni la latence d’un réseau public, ni une session matérielle de manette, ni tous les comportements de chaque navigateur. Elle ne prétend pas valider l’équilibrage compétitif ou une nouvelle géographie canonique.

Les empreintes des fichiers réellement exécutés ou décodés figurent dans chaque rapport. La recette principale utilise `fight.js` SHA-256 `17c3cfcdee2291dad721b312ee060ca3d341cb0734c30d57128152fa6d3e3f23` et `tournament.js` SHA-256 `85f058fd5be04cec19b423b321d23846228bdc6538e39105fe4086fea310a9b6`. Les rapports du lot précédent restent inchangés.

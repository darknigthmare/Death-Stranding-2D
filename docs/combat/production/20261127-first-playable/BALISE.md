# Balise — premier kit original local

Lot de production du 27 novembre 2026. Identifiant du catalogue : **ldm-char-balise**. Clé moteur : **balise**. Règles déterministes : **balise-1**.

## Périmètre réalisé

Maëlle « Balise » Rocher devient sélectionnable lorsque son manifeste d’art complet est chargé, en Versus local ou contre le CPU, en entraînement et en Relais. Le module est additif : sans lui, ou sans toutes ses poses et ses deux objets, le moteur conserve ses huit combattants historiques.

Le kit relie les trois spéciales et les trois normales chiffrées de la fiche originale au moteur de duel. Les déplacements, gardes, sauts, balayage, projection, gestion de l’équilibre et recharges passives utilisent les règles communes existantes. La ressource reste le **chiral de simulation**, un budget du simulateur ; ces chiffres ne prêtent aucun pouvoir surnaturel au personnage.

Les campagnes personnelles, l’Arcade, les Défis, le Tournoi, le parcours de boss et les salons réseau ne reçoivent pas automatiquement ce personnage. Leur sélection relève de l’application et demeure sur les kits déjà raccordés. Le manifeste de Balise ne contient aucune fausse route narrative.

Les super, conclusion dédiée et trois costumes de la bible restent en production. Une victoire de Balise utilise sa pose de victoire et passe directement au résultat de manche ; elle ne déclenche pas une conclusion recyclée d’un autre personnage.

## Commandes et chiffres du catalogue

Dans le tableau, L désigne l’attaque légère, F l’attaque forte et T la technique. Ce sont les actions logiques du catalogue, pas des lettres de clavier. Avec la configuration initiale de J1, la technique utilise H ; le menu Commandes affiche les touches personnalisées.

Les directions 6 et 4 désignent l’avant et l’arrière par rapport à l’adversaire au moment de la commande. La direction choisie reste capturée même si le bouton est pressé pendant une récupération.

| Commande | Technique | Coût | Démarrage | Activité | Récupération | Dégâts |
|---|---|---:|---:|---:|---:|---:|
| L | Contact de contrôle | 0 | 7 | 3 | 12 | 5 |
| F | Coup de harnais | 0 | 15 | 4 | 24 | 10 |
| 2 + F | Relevé de garde | 0 | 13 | 4 | 25 | 8 |
| T | Courte traction au lien | 28 | 18 | 4 | 24 | 10 |
| 6 + T | Ancrage de rappel | 18 | 24 | 1 | 21 | 0 |
| 4 + T | Reprise de corde | 16 | 10 | 6 | 22 | 0 |

Les valeurs sont exprimées en ticks de simulation à 60 Hz. Le gel d’impact suspend les compteurs de combat : le temps mural peut donc être supérieur à la somme affichée. Le coût est prélevé une seule fois au début d’une technique admissible. Un échec, une garde, une interruption ou la destruction ultérieure d’un objet ne restitue pas ce coût. Les gains de contact et la recharge passive restent ceux du mode utilisé.

Les trois normales propres ont des clés internes distinctes. Les définitions communes des huit combattants historiques ne sont pas modifiées. Leurs enchaînements sur contact confirmé restent disponibles.

### Courte traction au lien

La largeur physique commune est de 44 pixels. Les 2,4 largeurs prévues correspondent à une portée de **105,6 pixels depuis le centre**, indépendamment du cadrage ou de la largeur visuelle du dessin. Le volume d’attaque couvre la zone basse du corps, entre 8 et 54 pixels au-dessus des pieds.

La boucle peut toucher une seule fois dans ses quatre ticks actifs. Une cible doit être au sol. Une garde haute ou basse conserve les points de vie et annule la traction ; un saut évite la boucle. Un coup confirmé inflige 10 dégâts, applique 18 ticks d’étourdissement au sol et une courte impulsion physique vers Balise. Aucun ennemi n’est immobilisé à distance en dehors de cette collision.

Les paramètres secondaires de combat sont explicites dans le module : équilibre 14 et poussée -3. Ce sont des choix de mise en œuvre, puisque le catalogue ne les chiffre pas.

Au dojo, l’option de volumes de collision affiche aussi la portée au repos. Elle permet d’évaluer la punition d’un lancer trop court.

### Ancrage de rappel

Le point annoncé est fixé au début de la commande à **66 pixels**, soit 1,5 largeur de corps. Il est borné à la piste, de 48 à 1 232 pixels. La silhouette et le repère de préparation n’ont aucune collision.

Le véritable anneau apparaît au tick 24. Si la zone est occupée par un adversaire au sol ou son partenaire entrant, la pose échoue et affiche « Zone d’ancrage occupée ». Interrompre Balise avant ce tick empêche également la création. Une nouvelle pose réussie remplace l’ancien anneau : il n’existe jamais deux ancres appartenant au même membre.

L’ancre persiste **240 ticks de combat**, soit quatre secondes hors gel d’impact. Elle n’inflige aucun dégât. Son petit volume de collision mesure 24 pixels de large et 30 pixels de haut ; un balayage ou un projectile suffisamment bas peut la détruire. Les frappes qui passent au-dessus ne la touchent pas. La destruction consomme le contact qui atteint l’objet, sans blesser automatiquement son propriétaire, créer de combo ou accorder de chiral.

L’ancre expire normalement pendant le démarrage d’un rappel. Son horloge n’est jamais prolongée gratuitement pour garantir la réussite d’une commande.

### Reprise de corde

La commande exige une ancre vivante appartenant au même combattant, au même camp et, en équipe, au même emplacement de membre. Elle est refusée sans prélèvement si l’objet est absent, étranger ou déjà atteint.

Au tick 10, le rappel consomme l’ancre encore disponible. Balise se déplace ensuite jusqu’à **11 pixels par tick**, pendant six ticks actifs. Depuis sa position de pose, cela couvre les 66 pixels qui séparent les deux points. Si elle s’est éloignée davantage, la traction reste limitée à 66 pixels au total ; cet éloignement ne produit pas un déplacement instantané.

Le trajet est vérifié avant chaque déplacement. Une collision avec le corps adverse, y compris un partenaire entrant, arrête le mouvement du côté d’origine. La traction ne pousse pas ce corps pour se frayer un passage et n’accorde aucune invulnérabilité. Les limites de l’arène restent actives.

La disparition de l’ancre pendant les dix ticks de démarrage produit une récupération payée avec le message « Ancrage perdu ». Une attaque reçue coupe le geste selon les règles ordinaires. Le coût déjà dépensé reste perdu.

Les vitesses, la durée de vie et le volume destructible de l’ancre sont les paramètres physiques de ce premier raccordement. Ils sont centralisés dans original-kits.js pour permettre l’équilibrage sans modifier les huit kits précédents.

## Relais et Ligne de vie

| Paramètre | Valeur |
|---|---:|
| Coût de cohésion | 25 |
| Télégraphe | 24 ticks |
| Fenêtre active | 5 ticks |
| Sortie | 26 ticks |
| Durée totale | 55 ticks |
| Dégâts de l’appui | 6 |
| Récupération d’appui après sortie | 360 ticks |

Balise apparaît physiquement derrière le combattant actif, avec le placement commun du Relais. Le lien ne touche que si sa portée rencontre une cible présente. La réserve ne produit aucun contact automatique hors champ. Le corps du partenaire est interceptable avant l’émission ; une interruption empêche l’attaque et conserve le coût de cohésion payé.

La boucle d’appui est gardable et évitable en sautant. Elle utilise le même volume de portée que la spéciale, avec 6 dégâts, 12 d’équilibre, 14 d’étourdissement et une impulsion -2. Ces valeurs secondaires complètent les phases et le coût définis par la bible.

Les gains d’un contact sont attribués à Balise, même lorsqu’elle intervient comme partenaire. Les ressources du combattant actif ne récupèrent pas ce crédit. Le passage en réserve rappelle son ancre sans remboursement ; un changement de combattant ne transfère jamais l’objet à un autre propriétaire.

## Art et rendu

Le lot raccorde **30 poses clés orientées** : quinze états, chacun dessiné pour la gauche et pour la droite. Les trente poses sont reçues dans un répertoire autonome, y compris une stance droite nettoyée ; la base préexistante reste préservée. Deux objets sont raccordés au kit. La première boucle orange reste conservée comme variante, tandis que la boucle active reprend la corde grise mouchetée rouge.

États attendus : stance, garde, accroupissement, saut, frappe légère, frappe lourde, impact reçu, traction, pose d’ancre, rappel, chute, provocation, victoire et deux appuis de marche.

Le moteur choisit réellement le fichier de la direction requise. Il ne retourne pas horizontalement la stance pour simuler l’autre côté. Le dévidoir et les autres asymétries doivent rester du même côté anatomique dans les dessins. Le crochet et l’anneau utilisent leurs propres fichiers.

Chaque image possède un cadrage alpha mesuré, une ancre horizontale des appuis, une ligne de sol et une échelle verticale. Le rendu conserve ses proportions. Une image en cours de décodage revient à la stance du même personnage et de la même direction, puis à une silhouette de chargement si nécessaire.

La pose de saut sert à la montée et à la descente. Les dessins `fall` représentent une défaite au sol, vivante ; le changement de signe de la vitesse verticale ne les déclenche pas.

**Ces dessins sont des poses clés.** Ils ne constituent pas une animation complète image par image, ni un jeu de transitions de sélection, d’entrées, de sorties et de conclusions finalisé. La provocation conserve les phases 10 / 28 / 16 du moteur et son exposition aux coups, avec une pose spécifique et sans bonus.

### Contrat du manifeste

Le fichier original-kits-assets.js précède original-kits.js ; tous deux sont chargés après assets.js et avant fight.js.

```js
window.StrandOriginalKitsAssets = {
  version: 1,
  kits: {
    balise: {
      ready: true,
      poses: {
        stance: {
          right: { src, crop: [x, y, width, height], anchorX, baselineY, heightRatio },
          left:  { src, crop: [x, y, width, height], anchorX, baselineY, heightRatio }
        }
        // Les quatorze autres états ont exactement la même structure.
      },
      props: {
        anchor:   { src, crop: [x, y, width, height], anchorX, baselineY },
        ropeHook: { src, crop: [x, y, width, height], anchorX, baselineY }
      }
    }
  }
};
```

Les coordonnées crop sont des pixels natifs. anchorX et baselineY sont des fractions du cadrage, entre 0 et 1. heightRatio rapporte la hauteur de la pose à la hauteur de combat de 176 pixels.

Une pose, une direction, un objet ou une mesure obligatoire manquante rend le kit inactif. Le drapeau ready doit être publié après vérification des fichiers, des cadrages et des ancrages.

## Intégration et sauvegarde

Le module expose enabled, artReady, originalCharacterIds, canonicalCharacterIds, localModes et compatibleLocalOnly. La correspondance catalogue/moteur est publiée dans catalogueToEngine et engineToCatalogue.

La fiche publique est enregistrée dans StrandContent.fighters.balise après l’initialisation des assets historiques. Son tableau techniques contient les trois commandes, noms, coûts, descriptions et compteurs utilisables dans l’écran Commandes. Les champs storyReady et finisherReady restent false. Le tableau public frameData (également exposé par StrandOriginalKits.moveSheets.balise) fournit les six coups chiffrés : category, input, key, name, cost, start, active, recover et damage. La stance droite est aussi enregistrée dans StrandAssets.fighters.balise et StrandAssets.portraits.balise pour les écrans de sélection et de Relais.

Les enregistrements de duel avec Balise portent obligatoirement originalRules: "balise-1". Un ancien moteur, un module désactivé ou un enregistrement dépourvu de ce contrat refuse leur lecture. Les bandes des huit combattants historiques conservent leur format.

Les sauvegardes d’équipe gardent rules: "relay-1" et ajoutent originalRules: "balise-1" quand une sélection contient Balise. La validation vérifie l’identité du propriétaire de l’ancre, le membre, sa durée de vie, ses coordonnées, les actions autorisées et la destination d’un rappel. Un mouvement original injecté dans un membre canonique est rejeté.

L’horloge déterministe interne peut servir aux recettes locales en passant explicitement originalRules: "balise-1". Elle ne vaut pas disponibilité dans un salon réseau : le filtre de sélection du salon reste distinct.

## Vérification reproductible

Commande : **node qa/original-kits.cjs**.

Le script exécute le code livré et injecte ses points d’observation uniquement dans le processus de test. Il fournit un hôte Canvas simulé et des descripteurs d’images de test. Il vérifie les identités, les chiffres du catalogue, les coûts, la garde, le saut, les portées, l’armement, la durée de vie, l’interruption, les collisions d’objets, les deux bords, le rappel physique, l’appui, les propriétaires, les sauvegardes, le replay et le choix des dessins orientés.

La régression des huit kits compare chaque état public au fight.js du commit 07c818cd3942c0e1925bb0cc32dfe73da19ff297, avec le nouveau module absent puis chargé : **6 400 ticks comparés**. Le checkout CI doit inclure cet historique, ou définir ORIGINAL_KITS_BASE_SOURCE vers son fight.js extrait. L’absence de référence fait échouer le test.

Les **26 groupes** ont été exécutés avec succès sous Node dans la CI, sur les fichiers livrés, avec **6 400 états canoniques identiques** à la référence. Les huit raccords orientés de corde, les bords d’arène et l’absence de mutation de la simulation pendant le rendu font partie de cette recette. La mesure des 48 PNG, les planches des 30 poses Balise dans un Canvas natif et le parcours clavier d’ancrage/rappel dans Chromium complètent cette preuve. Les contextes Canvas simulés restent explicitement limités à la recette de mécanique ; les rapports et captures distincts sont réunis dans [VERIFICATION.md](VERIFICATION.md).

## Restant de cette fiche

Le kit local ne clôt pas toute la fiche de production. Restent notamment : les animations intermédiaires, les trois costumes, la super à 100 chiral avec confirmation, la conclusion dédiée, les transitions complètes de sélection/désélection, la route « Une lumière pour personne » et ses adversaires, ainsi que leur intégration aux autres modes.

## Raccord visuel de la corde

Les prolongements du lien utilisent les extrémités de corde déjà peintes dans chaque PNG. Les coordonnées sont normalisées au crop mesuré, puis projetées avec le placement exact du sprite, séparément pour les deux directions. La matière grise à marques rouges prolonge les images reçues. Lorsqu’un prolongement reviendrait derrière la boucle native, notamment à un bord ou pendant la rétraction, il n’est pas dessiné. Les fichiers PNG, les collisions et les timings restent intacts.

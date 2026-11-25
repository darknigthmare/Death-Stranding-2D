# Les Nœuds rompus — campagne du simulateur

## Livraison

**Échos de la Grève propose une campagne transversale complète en six chapitres.**
L’entrée « Campagne du simulateur » apparaît parmi les neuf modes de l’accueil.
Le parcours alterne cinq points de vue, quatre duels en deux manches gagnantes
et deux grandes rencontres jouées par les moteurs existants. Il possède son
prologue, une scène avant et après chaque chapitre, puis sa conclusion :
**14 interludes textuels** avec une galerie indépendante.

Le récit est une **fiction originale du simulateur**. La fermeture concerne
le réseau interne de la reconstitution. Les personnages sont des empreintes ;
leurs rencontres ne constituent ni des événements officiels, ni des
résurrections, ni une modification de **La Ligne silencieuse**. Les six
chapitres emploient les kits DS1 / Director’s Cut existants. Les huit routes
individuelles conservent leurs textes, leurs adversaires et leur progression.

La campagne réemploie les panoramas et portraits existants. Ses 14 écrans
narratifs ne correspondent pas à 14 nouvelles images générées.

## Parcours livré

| Nº | Chapitre et identifiant | Point de vue | Rencontre | Arène | Liaison narrative |
|---|---|---|---|---|---|
| 1 | Balise sans adresse — `balise-sans-adresse` | Sam | Duel contre le porteur MULE | Camp des MULEs | Récupérer une trace sans effacer le registre du camp. |
| 2 | Le détour d’Higgs — `detour-higgs` | Fragile | Duel contre Higgs | Ruines de South Knot | Séparer une liaison du détour qui la replie sur elle-même. |
| 3 | L’ordre fermé — `ordre-ferme` | Mama | Duel contre Die-Hardman | Usine en ruines | Corriger deux consignes incompatibles et ouvrir le relais. |
| 4 | Ce qui répond encore — `memoire-ouverte` | Heartman | Duel contre Cliff | Champ de bataille | Isoler un fragment de mémoire sans lui promettre un retour à la vie. |
| 5 | Le convoi des retours — `convoi-des-retours` | Die-Hardman | Convoi MULE : deux vagues, deux colis à livrer | Ferme sous la pluie temporelle | Rapporter les pièces du relais au dépôt situé à gauche. |
| 6 | Le dernier lien — `dernier-lien` | Sam | Baleine de goudron | La Grève | Dégager le dernier relais et laisser circuler six réponses distinctes. |

Le prologue, **Six liaisons interrompues**, présente la balise et les six
fermetures. La conclusion, **Une place pour chaque voix**, résout l’arc :
les fragments restent distincts et peuvent se répondre. La phrase
« Relier sans effacer » accompagne cette résolution.

## Progression et reprise

Le joueur choisit la difficulté d’une nouvelle partie : **Débutant**, **Porteur**
ou **Vétéran**. Elle reste fixée pour ses six chapitres. Le combattant et l’arène
suivent le récit. Chaque chapitre commence avec les ressources de départ de
son moteur ; aucune réserve de Boss Rush n’est transportée dans cette campagne.

Une victoire valide le chapitre et ouvre son interlude. Une défaite propose de
recommencer ce chapitre en conservant les précédents. Quitter une rencontre ou
fermer la page permet de reprendre **au début du chapitre interrompu** : cette
limite est indiquée dans le parcours, les scènes et le menu de pause. Il n’y a
pas de reprise au milieu d’un duel dans ce nouveau mode. Une victoire déjà
enregistrée reprend directement à son interlude après rechargement.

Sur téléphone ou écran peu haut, la pause de campagne occupe la fenêtre et
peut défiler : son explication de reprise, le volume et les deux actions ne
dépendent pas de la petite hauteur du canvas. Le focus passe sur Reprendre
à l’ouverture, puis revient au bouton Pause lors de la reprise.

La sauvegarde utilise exclusivement **`echos.campaign.v1`**, avec les règles
`les-noeuds-rompus-20261125-v1`. Les rencontres Boss démarrent avec
`isolated: true` et rendent `saved: null` : leur progression appartient à la
campagne. Les sauvegardes Boss Battle, Boss Rush, Histoire, Tournoi et campagne
principale restent indépendantes.

La galerie garde les interludes débloqués même après une nouvelle partie.
Relire un interlude ou la conclusion ne modifie pas la partie courante et ne
valide pas de nouveau chapitre. Le remplacement d’une campagne inachevée
passe par un écran qui explique son effet. Si le stockage local refuse une
écriture, la progression continue en mémoire et l’interface indique qu’elle
sera perdue à la fermeture.

## Scènes des huit routes et décor statique

Les scènes Histoire disposent d’un carrousel manuel, sans transition animée :

- **Introduction :** illustration originale, second plan, insertion d’accessoire.
- **Rivalité :** illustration originale.
- **Épilogue :** illustration originale, plan final complémentaire.

Cela représente **24 séquences et 48 emplacements d’illustration**, dont
24 plans complémentaires produits dans le présent lot. Les données ordonnées
et leurs légendes proviennent de `StrandAssets.storyFrames`. Le carrousel
affiche le compteur et la légende, fournit Précédent / Suivant, accepte les
flèches du clavier, annonce le changement et remet le focus sur une commande
active. L’image et la légende changent sur place : le défilement de la page et
la région d’annonce restent stables. Les dialogues et champs de saisie
conservent leurs propres touches.
L’action Entrer / Terminer / Retour à la galerie reste disponible à chaque
plan. La galerie rejoue la séquence depuis sa première illustration.

Le bouton **Décor statique** conserve sa préférence dans
`echos.v1.staticScenery`, séparément d’Effets réduits. L’application transmet
le choix aux duels, aux grandes rencontres, au Boss Rush et à la nouvelle
campagne. Les moteurs continuent les combattants et annonces pendant que
leur décor est figé ; leur vérification détaillée figure dans le rapport
du chantier moteur.

## Vérifications exécutées

La preuve principale est [campaign-qa.json](campaign-qa.json), produite par
[`qa/campaign.cjs`](../../../../modes/echos-de-la-greve/qa/campaign.cjs).
Elle exécute les modules réels `app.js`, `campaign.js`, `fight.js` et `boss.js`
dans un hôte JavaScript avec DOM événementiel, Canvas et horloge simulés.
Les résultats de ce parcours proviennent des commandes de jeu et des trames
`requestAnimationFrame`. Aucun point de vie n’est modifié pour obtenir une
victoire ; aucun callback de victoire n’est déclenché artificiellement.
Des fixtures de résultat synthétiques sont employées séparément pour les
tests unitaires du format de sauvegarde et sont identifiées comme telles.

| Rencontre réelle, difficulté Débutant | Résultat observé | Vitalité finale |
|---|---|---:|
| Sam / MULE | Victoire, 2–0 | 55 |
| Fragile / Higgs | Victoire, 2–0 | 83 |
| Mama / Die-Hardman | Victoire, 2–0 | 65 |
| Heartman / Cliff | Victoire, 2–0 | 85 |
| Die-Hardman / convoi | Victoire, 2 vagues et 2 colis livrés | 76 |
| Sam / baleine | Victoire | 94 |

Les tests couvrent aussi deux défaites réelles par absence de commande
(Fragile / Higgs et Die-Hardman / convoi), leurs reprises, le clavier, les
commandes tactiles et leur annulation, la pause, le manuel, la perte de focus,
le retour au parcours et le rechargement. Les deux types de moteur reprennent
au début du chapitre ; une victoire reprend à son interlude. Les 14 scènes
se débloquent, la conclusion ne compte qu’une fois et la galerie reste sans
effet sur la progression.

Les octets des sauvegardes extérieures sont comparés avant et après tout
le parcours, y compris ses rechargements. Le journal de stockage confirme
qu’aucune sauvegarde Boss Battle / Boss Rush n’a même été lue par la campagne.
Les huit ordres de route et les 24 textes originaux sont comparés à
`c3fa7ea`. Les 24 séquences et leurs 48 plans sont parcourus ; les commandes,
compteurs, légendes, limites et retours de focus sont contrôlés. Un parcours
Histoire original entre encore dans son vrai duel après le troisième plan
d’introduction.

La régression [boss-verification.json](boss-verification.json) passe également
**21 groupes de contrôles**, dont les six victoires Boss, la série Boss Rush,
les checkpoints, les rencontres isolées et les écrans historiques de l’app.

**Portée de la preuve :** le parcours complet a été gagné en difficulté
Débutant ; les trois choix et la conservation de la difficulté sont testés,
sans prétendre valider tout l’équilibrage Porteur / Vétéran. Ce test ne lance
pas de navigateur, ne décode pas les pixels des images et ne vérifie pas la
mise en page réelle. Les champs `browser`, `nativeCanvas` et
`imagePixelsDecoded` du JSON restent donc à `false`.

## Reproduction et contrôle des illustrations

**La recette finale avec `--require-assets` a réussi après livraison des
24 plans complémentaires**, retouche finale de Fragile comprise. Le JSON
indique `logicPassed: true`, `assetsRequired: true`, `assetsComplete: true`
et `passed: true`. Les **55 chemins d’images contrôlés** par cette recette
sont présents ; la liste des fichiers absents est vide. Le parcours réel,
les galeries, le carrousel et les retours de focus ont été réexécutés avec
la version finale de la pause mobile.

Depuis la racine du dépôt :

```sh
node modes/echos-de-la-greve/qa/campaign.cjs --require-assets --output=docs/combat/production/20261125-completion/campaign-qa.json
node modes/echos-de-la-greve/qa/boss.cjs docs/combat/production/20261125-completion/boss-verification.json
```

`--require-assets` exige la présence des illustrations déclarées. Pendant
une production en cours, le test logique peut aussi être exécuté
sans cette option : le JSON distingue alors `logicPassed`, `assetsComplete`
et la liste `imageFiles.missing`. Avant publication, l’exécution avec cette
option doit produire une liste vide. Ce contrôle de présence ne remplace pas
la revue visuelle des PNG du lot.

## Fichiers de ce chantier

- `modes/echos-de-la-greve/campaign.js` : récit, catalogue immuable, sauvegarde et transitions.
- `modes/echos-de-la-greve/campaign.css` : présentation de la campagne et des séquences manuelles.
- `modes/echos-de-la-greve/app.js` : accueil, parcours, galeries, résultats, carrousel et préférence de décor.
- `modes/echos-de-la-greve/index.html` : chargement des modules et bouton de préférence.
- `modes/echos-de-la-greve/qa/campaign.cjs` : contrôles du récit, de la sauvegarde, du parcours réel et des scènes.

Les ajouts moteurs et `assets.storyFrames` appartiennent au chantier moteur
coordonné ; les 24 nouvelles illustrations appartiennent au lot de production
visuelle. Les nouveaux liens du serveur HTTP sont intégrés au niveau du lot.

# Raccordement des poses de geste

Date : 27 novembre 2026. Base auditée : `main`, commit `7e000d3`.

Ce lot raccorde des dessins distincts aux trois phases déjà jouables du geste de défi. Le compteur, les commandes, la vulnérabilité, les interruptions et le codage des replays restent ceux du lot précédent. Une pose fixe par phase constitue trois dessins clés ; ce n’est pas une animation complète dessinée image par image.

## Contrat des images et des tenues

Chaque entrée conserve le descripteur natif `src`, `crop`, `anchorX`, `baselineY`, `heightRatio`. Les images restent dans leur format natif ; les crops sont des régions de dessin et ne réécrivent pas les fichiers PNG.

| Clé du descripteur | Phase de simulation | Bornes de `taunt.frame` |
|---|---|---|
| `tauntEntry` | Entrée | 0 à 9 |
| `taunt` | Tenue | 10 à 37 |
| `tauntExit` | Sortie | 38 à 53 |
| Posture ordinaire | Geste terminé | État supprimé au pas 54 |

La clé historique `taunt` demeure la pose de tenue, ce qui conserve la compatibilité avec les premiers descripteurs. `StrandPresentation.gestureAssets(id, outfit)` résout l’identité du costume avant de chercher les trois phases :

```js
StrandPresentationAssets.mama = {
  taunt: atelierHold,
  tauntEntry: atelierEntry,
  tauntExit: atelierExit,
  outfits: {
    viaduc: {
      taunt: viaducHold,
      tauntEntry: viaducEntry,
      tauntExit: viaducExit
    }
  }
};
```

Les variables de cet exemple représentent les descripteurs mesurés. La racine concerne la tenue par défaut ou `atelier`. Une vraie tenue alternative utilise exclusivement son entrée `outfits`. Une ancienne valeur de tenue qui n’existe pas chez le combattant courant ne crée pas une variante fictive et conserve le costume de base.

Une phase absente, en échec ou non encore décodée utilise la posture de la tenue choisie. Si cette posture attend également son décodage, le moteur affiche sa silhouette temporaire pendant le geste ; il ne remplace pas Mama viaduc par Mama atelier. L’arrivée tardive d’une image change le dessin au prochain rendu sans recommencer ni prolonger le geste.

## Périmètre des sources

Les sept ensembles de base livrés pour Sam, Fragile, Higgs DS1, Cliff, MULE, Mama atelier et Heartman ajoutent leurs entrées et sorties sous `assets/fidelity-20261127/presentation/`. Les poses centrales des six premiers restent les PNG du lot `presentation-20261127`. Heartman reçoit également une nouvelle pose centrale `heartman-taunt.png` pour garder l’écran sur le même bras que sa posture actuelle. Cette correction vise la continuité du modèle du projet ; elle ne certifie pas le côté canonique du bracelet en l’absence d’une référence officielle vérifiée.

Mama viaduc reçoit un ensemble séparé : `mama-viaduc-taunt-entry.png`, `mama-viaduc-taunt.png` et `mama-viaduc-taunt-exit.png`. Cela porte le périmètre de présentation à dix-huit nouvelles poses natives. Les noms de gestes appartiennent au simulateur ; ces poses ne créent pas de nouvelles techniques ou de nouveaux événements de la chronologie de Death Stranding.

Le sous-lot de nouvelles poses et de correction du kit de Die-Hardman a été suspendu après un refus de production d’image. Aucun fichier prévu mais absent n’est déclaré dans le runtime. Die-Hardman conserve sa pose centrale du lot précédent et sa posture existante en entrée et sortie. La correction de son ancien masque sur l’ensemble du kit reste un travail non livré.

La présence réelle de chaque fichier et ses mesures sont consignées dans l’inventaire natif du lot. Le renderer accepte une livraison partielle sans annoncer qu’une phase manquante possède un nouveau dessin.

## Réglages de confort et sélecteur

Avec les effets réduits, le combat conserve la séquence déjà utilisée : posture, pose centrale, posture. Il n’ajoute pas les deux nouvelles poses décoratives. Les 54 pas d’exposition et les réactions aux impacts restent identiques.

Le sélecteur continue à utiliser la pose centrale pour un choix confirmé et la posture ordinaire pour un aperçu. Il connaît désormais la pose centrale propre à Mama viaduc. Les deux emplacements d’un miroir conservent leurs costumes indépendants. Un échec de chargement HTML replie l’image sur la posture du bon costume. Aucun nouveau temporisateur de sélection n’a été ajouté ; les entrées et sorties CSS du panneau et leurs réglages de confort gardent leur fonctionnement précédent.

## Vérification de la logique

Commande :

```sh
node modes/echos-de-la-greve/qa/presentation.cjs --output=docs/combat/production/20261127-fidelity/presentation-verification.json
```

La recette exécute les vrais scripts du moteur et de l’application avec des adaptateurs DOM/Canvas explicitement simulés et des descripteurs d’image de test. Elle ne produit pas de pixels natifs et ne simule pas un périphérique matériel réel.

| Contrôle réalisé | Résultat |
|---|---|
| Groupes de recette | 20 réussis |
| Comparaison avec le vrai moteur de `7e000d3` | 3 240 instantanés identiques, nouvelles images disponibles dans le renderer actuel |
| Bornes des phases | 126 échantillons : neuf choix de costume, deux joueurs, sept bornes par cycle |
| Interruption d’un geste | Six cas, couvrant les trois phases pour J1 et J2 ; la pose d’impact reprend immédiatement |
| Phases de tenue absentes ou non décodées | Sept cas, dont posture de viaduc également indisponible |
| Replays v1/v2 | 548 instantanés comparés |
| Navigation rapide | 40 changements, aucun temporisateur abandonné |
| Contrôles conservés | Huit cycles complets, migration, clavier/tactile/L3 synthétiques, exclusion réseau et Boss, réduction des effets, aperçu et confirmation |

Les tests de phases utilisent aussi le cas réellement prévu pour Die-Hardman : une pose centrale présente et deux phases absentes. Les dimensions et couleurs des images de fixture ne constituent pas une preuve de fidélité artistique.

## Vérification des pixels natifs

La recette `qa/presentation-assets.cjs` a été adaptée aux trois phases et aux costumes explicites. Le passage complet a réussi : ses preuves sont [presentation-native.json](presentation-native.json) et les captures de `presentation-renders/` dans ce lot. Les preuves du lot `20261127-extensions` restent intactes.

```sh
NODE_PATH="$CODEX_PRIMARY_RUNTIME_NODE_MODULES" node modes/echos-de-la-greve/qa/presentation-assets.cjs
```

Le passage complet produit 58 captures à 1280 × 720 : trois phases, deux orientations et neuf choix de costume, puis trois captures de confort et un repli volontaire de Mama viaduc. Chaque capture utilise les commandes ordinaires, sans écriture de l’état des combattants.

| Contrôle natif réalisé | Résultat |
|---|---|
| Captures complètes | 58 réussies, deux orientations réellement tracées et contrôlées |
| Sources de geste | 25 PNG actifs : dix-huit nouveaux et sept poses centrales conservées |
| Images chargées par les combats de contrôle | 138 chemins distincts décodés |
| Captures utilisant un dessin de geste | 51 : cinquante cas ordinaires et la tenue de Mama viaduc avec effets réduits |
| Captures utilisant la posture de repli | Sept : quatre phases non livrées de Die-Hardman, deux phases décoratives désactivées et un échec de décodage simulé pour Mama viaduc |
| Intégrité | Empreintes des scripts et des sources inchangées pendant la recette ; dimensions et crops natifs contrôlés |
| Texte natif | Disponible, avec 250 familles de polices présentes ; aucun résultat de navigateur revendiqué |

La revue visuelle a couvert une orientation de chacune des dix-huit nouvelles poses, à partir des rendus partiels puis des captures complètes : entrée droite et sortie gauche pour Sam, Fragile, Higgs, Cliff, MULE et Mama atelier ; les trois phases pour Heartman et Mama viaduc. Les pieds restent posés sur la ligne du sol, les équipements portés restent visibles et les gestes gardent leur continuité. Chez Heartman, le bracelet reste sur le même bras que la posture actuelle dans les trois dessins. Le compositing réel des deux tenues de Mama ne fait pas apparaître le halo RGB caché sous les pixels transparents de certaines prévisualisations de PNG. Aucun ajustement des géométries mesurées n’a été nécessaire après cette revue.

Les captures de repli de Mama viaduc et l’entrée à effets réduits ont également été inspectées : elles conservent sa tenue Viaduc, son casque, son scanner et ses protections. L’entrée de Die-Hardman montre explicitement l’ancienne posture de son kit. La validation automatique porte sur les 58 captures ; cette revue visuelle ciblée ne prétend pas être une inspection manuelle exhaustive des 58 fichiers.

Un défaut de la recette native a été corrigé avant le passage final : la réutilisation d’une même surface après plusieurs redimensionnements provoquait un placement incorrect de certains glyphes du HUD dans le backend Canvas. La recette crée maintenant une surface et un contexte frais pour chaque capture. Cette correction concerne seulement le banc de vérification ; elle ne modifie ni le moteur ni les images sources. Les captures finales examinées affichent les noms des deux combattants à leur place.

La recette vérifie les fichiers et leurs empreintes, les crops, les signes de transformation correspondant aux deux orientations, la présence de transparence dans les PNG et l’opacité du cadre composé. Si les polices natives sont absentes, elle omet leurs appels de dessin et le signale, sans prétendre avoir validé les glyphes. Elle ne certifie ni la mise en page HTML dans un navigateur ni une identité artistique parfaite avec toutes les références.

## Audit du kit de Die-Hardman restant à homogénéiser

L’inventaire a été confirmé en évaluant `assets.js` et en capturant les `Image.src` demandés par le vrai `StrandFight.start`. Le chargement de portrait relève de l’interface ; le finisher est chargé dans les duels hors entraînement. Les mêmes dix poses de combat sont reprises par `boss.js`.

| Source active, relative au mode | Usage réel |
|---|---|
| `assets/fighters/diehardman/stance.png` | Attente, repli et phases de geste non livrées |
| `assets/fighters/diehardman/action.png` | Pose d’exécution des attaques |
| `assets/fighters/diehardman/step.png` | Marche et ruée |
| `assets/fighters/diehardman/hit.png` | Étourdissement après impact |
| `assets/fighters/diehardman/guard.png` | Garde et récupération de garde |
| `assets/fighters/diehardman/crouch.png` | Accroupissement |
| `assets/fighters/diehardman/rise.png` | Montée du saut |
| `assets/fighters/diehardman/apex.png` | Sommet du saut |
| `assets/fighters/diehardman/fall.png` | Descente du saut |
| `assets/fighters/diehardman/jump.png` | Repli aérien si une pose de phase n’est pas décodée |
| `assets/fighters/diehardman/portrait.png` | Sélections ordinaires/Boss, portrait de campagne et Dossiers de liaison |
| `assets/finishers/diehardman.webp` | Illustration plein écran de « Levée de consigne », 1672 × 941 |
| `assets/presentation-20261127/diehardman-taunt.png` | Pose centrale du geste, conservée dans ce lot |

La posture, l’action, le portrait et le finisher ont été inspectés visuellement lors de l’audit : leur ancien masque géométrique ne correspond pas à la correction de la pose centrale. Les dix poses, le portrait et le finisher forment donc un ensemble à revoir ensemble avant de considérer cette harmonisation terminée. Aucun de ces douze fichiers n’a été corrigé dans ce lot.

Les anciens fichiers `assets/fighters/diehardman-*.webp`, l’ancien `diehardman-jump.png` à la racine de `fighters/` et le SVG source ne sont pas les sources actives déclarées. Changer uniquement `replacementRoot.diehardman` dans `assets.js` ne suffirait pas : les clés `guard`, `crouch`, `rise`, `apex` et `fall` sont initialement construites séparément. Une future correction doit raccorder les dix clés et leurs dix géométries mesurées, puis le portrait et le finisher.

La route Histoire possède aussi six sources actives distinctes : `story/diehardman-intro.webp`, `story/diehardman-rival.png`, `story/diehardman-ending.webp`, puis les trois PNG `story-completion-20261125/diehardman-{intro-second,intro-insert,ending-final}.png`. Ce corpus, ainsi que les apparitions dans les récits d’autres combattants, demande un audit narratif séparé. L’ancienne version `story/diehardman-rival.webp` est remplacée par le PNG dans les mappings courants.

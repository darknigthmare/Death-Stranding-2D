# Quinze images fixes · Silhouettes et horizons

**Death Stranding 2D — Échos de la Grève · 25 novembre 2026**

Ce lot poursuit la production de sujets absents de la base du 24 novembre : personnages de soutien, ennemis, objets et décors de **Death Stranding / Director’s Cut**. Il livre **15 vrais PNG natifs**, chacun avec un seul sujet et une seule image. Ils totalisent **24 554 809 octets**. Aucun recadrage, agrandissement, changement de couleur ou autre édition de pixels n’a été appliqué après la génération.

Les quinze sources sont consultables depuis le menu **Silhouettes et horizons**. Le portrait de Lockne complète aussi les **Archives de Bridges**. Les autres silhouettes restent des assets statiques de production : ce lot ne crée pas de moveset, de personnage sélectionnable, d’effet de grenade en simulation ou d’arène à cinq plans.

**PR de livraison : [#6](https://github.com/darknigthmare/Death-Stranding-2D/pull/6)** · Branche `codex/echos-assets-fidelity-20261124` · Base de cette reprise : [`25bf4faa`](https://github.com/darknigthmare/Death-Stranding-2D/commit/25bf4faa156d105e2bc2a03ee74b59a1b48f366f).

## Contenu livré

Tous les fichiers sont sous `modes/echos-de-la-greve/assets/static-20261125/`.

| Fichier PNG | Sujet | Dimensions natives | Fond |
|---|---|---:|---|
| `lockne-portrait.png` | Lockne, portrait après la réunion | 1189 × 1323 | Alpha |
| `lockne-body.png` | Lockne, silhouette entière | 1024 × 1536 | Alpha |
| `deadman-body.png` | Deadman, costume sombre | 1024 × 1536 | Alpha |
| `amelie-body.png` | Amelie, robe rouge mi-longue | 1024 × 1536 | Alpha |
| `bridget-body.png` | Bridget dans son lit médical | 1536 × 1024 | Alpha |
| `bt-gazer.png` | Échoué humanoïde suspendu | 1024 × 1536 | Alpha |
| `cliff-skeleton-nethelmet.png` | Soldat squelettique, casque à filet | 1024 × 1536 | Alpha |
| `mule-eastern-gray.png` | MULE gris de la région Est | 1024 × 1536 | Alpha |
| `hematic-grenade.png` | Grenade hématique niveau 1 | 1024 × 1536 | Alpha |
| `ex-grenade-0.png` | Capsule EX n° 0, liquide beige pâle | 724 × 2172 | Alpha |
| `ex-grenade-1.png` | Capsule EX n° 1, liquide orange | 724 × 2172 | Alpha |
| `ex-grenade-2.png` | Capsule EX n° 2, liquide turquoise | 724 × 2172 | Alpha |
| `south-knot-ruins-panorama.png` | Ruines de South Knot | 1672 × 941 | Opaque |
| `timefall-farm-panorama.png` | Ferme sous la pluie temporelle | 1672 × 941 | Opaque |
| `mountain-knot-city-panorama.png` | Approche de Mountain Knot | 1672 × 941 | Opaque |

Les cinq images de personnages représentent quatre personnes : Lockne possède deux vues. Bridget et son lit forment un seul ensemble détouré. Le nom de fichier `mountain-knot-city-panorama` conserve l’identifiant prévu initialement, mais le titre public est **Approche de Mountain Knot**, puisque l’image ne contient pas de skyline urbaine. Ces dimensions sont celles des sorties natives ; elles ne sont pas annoncées comme de la 4K.

## Références et décisions de fidélité

Le [manifeste](../../../../art/sources/echos-de-la-greve/production-20261125-static/manifest.json) conserve les **prompts exacts**, les vingt références réellement utilisées, les URL des pages et images, leur provenance et leurs empreintes SHA-256. Quatre références inspectées supplémentaires documentent les variantes et les limites restantes. Les originaux de consultation ne sont pas présentés comme des assets produits par le projet.

**Lockne.** Les [captures de jeu après la réunion](https://nokuat.hatenablog.com/entry/2019/12/14/155059) ont permis de lever le blocage du lot précédent : coiffure, boucles, col marine croisé et hétérochromie. Son œil droit anatomique est bleu et apparaît à gauche de l’image. Le catalogue et les Archives n’appliquent pas de miroir. La vue du costume s’arrête aux cuisses : les jambes et chaussures de la silhouette sont une reconstruction signalée, et non une partie vérifiée 1:1.

**Deadman, Amelie et Bridget.** La [présentation officielle de Deadman](https://blog.playstation.com/2019/08/20/death-stranding-new-footage-and-character-spotlight-videos/) documente le costume sombre et la chemise bordeaux. Sa blouse médicale rouge, visible dans un [autre article PlayStation](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/), reste une variante valide du portrait historique. Les captures avant et [arrière d’Amelie](https://www.theregister.com/2020/08/28/death_stranding/) confirment une robe rouge mi-longue et des escarpins rouges. Pour Bridget, la [vue de la scène hospitalière](https://www.gq-magazine.co.uk/games/article/death-stranding-review) justifie la pose allongée, la couverture bordeaux et le lit ; aucune tenue debout n’est supposée.

**Ennemis.** Les [conseils officiels Kojima Productions](https://www.kojimaproductions.jp/en/DSTips) fournissent les références du Gazer et du MULE gris. Le soldat squelettique suit une [image promotionnelle réhébergée](https://wallpapers.com/wallpapers/death-stranding-cliff-s-skeleton-soldiers-4l7as12hy78zfvql.html) avec casque à filet ; le rapport ne lui attribue pas une époque ou un modèle d’arme certifié. Le MULE gris remplace dans le plan du lot le soldat Homo Demens, dont la seule référence récupérée était un hologramme monochrome. Ce remplacement ne résout pas ce manque.

**Grenades.** La [vue d’équipement DS1](https://www.gamepressure.com/death-stranding/how-to-get-the-first-weapons/zccca5) montre la grenade hématique avec corps blanc opaque, base rouge perforée, jauge sombre, anneau angulaire et long levier. Les micro-marquages et l’usure restent reconstruits. Les capsules EX suivent les [captures du distributeur](https://steamcommunity.com/sharedfiles/filedetails/?id=2523254433) ; le type n° 2 est aussi identifié dans une [capture sous-titrée](https://www.gamesradar.com/death-stranding-ex-grenades/). EX1 et EX2 sont des variantes générées à partir d’EX0 : elles gardent le même format de fichier, mais leur silhouette visible est environ **3,5 % plus haute**. Leur géométrie n’est donc pas décrite comme identique au pixel.

**Panoramas.** Les trois références proviennent de la [collection Death Stranding d’Atmoph](https://atmoph.com/en/products/deathstranding), partenaire licencié. Leurs principaux repères sont repris et le premier plan est adapté à une lecture latérale. Il s’agit de compositions de production, sans certification géographique 1:1. Le découpage de chacun en cinq plans reste à produire.

## Intégration

La nouvelle page [Silhouettes et horizons](../../../../modes/echos-de-la-greve/static-assets.html) utilise un catalogue séparé, `window.StrandStaticCatalogue`. Elle propose quatre filtres, un fond sombre ou neutre, une fenêtre d’agrandissement avec dimensions réelles et le téléchargement du PNG original. Une image qui ne charge pas est retirée du décompte. Les proportions sont conservées ; les panoramas et le lit de Bridget disposent de cartes larges.

Le menu du mode et les Archives donnent accès à ce catalogue. `assets.js` enregistre le nouveau portrait de Lockne et les Archives passent de trois à quatre dossiers. Les sources de gameplay, les catalogues de poses et les arènes ne reçoivent aucun nouveau raccordement de combat. Le périmètre jouable reste **huit combattants, treize configurations d’arène et six rencontres Boss**.

## Vérifications réalisées

| Vérification | Résultat |
|---|---|
| PNG décodés | 15 / 15, tous uniques et à une seule image |
| Copie native | SHA-256 des quinze sorties générées identique aux fichiers intégrés |
| Revue des transparences | 12 détourés examinés sur gris clair et vert sombre, sans grand halo ni fond rectangulaire visible |
| Panoramas | 3 images RGB opaques, cadrages complets |
| Catalogue | 15 chemins présents et dimensions cohérentes ; répartition 5 / 3 / 4 / 3 |
| JavaScript / HTML | Syntaxe valide des quatre scripts concernés ; deux pages sans identifiant dupliqué ni référence locale manquante |
| Interactions | 11 groupes de contrôles sur le JavaScript réel exécuté dans un DOM simulé |
| Rendu navigateur natif | Non vérifié ; aucun résultat visuel de navigateur n’est revendiqué |

La [revue indépendante](REVUE_VISUELLE_STATIQUES_20261125.md) et son [JSON de mesures](visual-review-independent-20261125.json) donnent les bornes alpha, dimensions et limites par image. La [vérification du catalogue](GALERIE_VERIFICATION_20261125.md) et son [JSON](gallery-dom-validation.json) séparent les contrôles de comportement de la validation visuelle navigateur, qui reste indisponible. Ces contrôles ne constituent pas une certification globale de fidélité 1:1.

## Reste à produire ou à documenter

- Les cinq plans de chacun des trois nouveaux panoramas, puis leur intégration en arènes.
- Une référence suffisamment claire et colorée pour un soldat Homo Demens.
- Les structures urbaines de Mountain Knot, distinctes du panorama d’approche.
- Les détails de costume absents des captures, les vues gauche asymétriques et les autres personnages secondaires ou variantes qui n’ont pas encore été audités.

Les boss déjà couverts, les poses existantes et les couches des treize arènes ne sont pas recomptés comme manquants. L’[audit de départ](AUDIT_STATIQUES_20261125.md) conserve cet état de référence. Les nouvelles animations restent hors du périmètre demandé.

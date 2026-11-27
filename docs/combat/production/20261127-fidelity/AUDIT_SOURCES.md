# Audit des sources et de la continuité visuelle — 27 novembre 2026

## Résultat du lot

**18 PNG de présentation ont été reçus, inspectés et copiés sans transformation dans le projet.** Ce lot comprend les 14 entrées/sorties de Sam, Fragile, Higgs DS1, Cliff, MULE, Mama Atelier et Heartman, les trois phases propres à Mama Viaduc, ainsi qu’un nouveau geste maintenu pour Heartman afin de conserver le même poignet que son modèle de combat. Les commandes exactes, références d’entrée hachées, chemins natifs, dimensions, couches alpha et SHA-256 se trouvent dans [presentation-generation.json](presentation-generation.json).

Vingt appels individuels et séquentiels à image_gen ont fourni vingt images. Deux ont été écartées lors du contrôle de continuité : une sortie MULE transférant le scanner à l’autre main, et une première proposition Heartman conservant l’inversion de poignet. Ces deux images n’ont jamais été copiées dans les actifs du jeu. Ce sont des rejets de qualité après réception, pas des refus de modération. Aucun refus ni nouvelle tentative technique n’est enregistré dans ce sous-lot de présentation.

**La correction visuelle de Die-Hardman n’a pas été produite.** La tentative initiale de nouvelle stance a été refusée à la sortie par le générateur (`moderation_blocked`, catégorie `other`, requête `4bffa5af-c38d-438e-ad7f-c5459534d593`). Le lot prévu de 18 images Die-Hardman a été suspendu sans relance ; aucun de ses anciens fichiers ni chemins actifs n’a été remplacé. Voir [diehardman-generation.json](diehardman-generation.json).

Ces résultats attestent la production et la continuité contrôlée des poses retenues. Ils ne constituent ni une certification de fidélité exhaustive 1:1, ni la reproduction d’animations officielles. Les gestes restent des créations du simulateur. Les vérifications du rendu et du comportement jouable relèvent de [FIDELITY_PRESENTATION.md](FIDELITY_PRESENTATION.md), du [bilan des actifs](ASSETS.md) et de leurs preuves ; elles ne sont pas déduites du seul succès de génération.

## Périmètre et méthode de l’audit Die-Hardman

Base examinée : `7e000d36f2eb0fa4578b545bfb3d8b334acd516a` (main après PR8), puis contrôle des mêmes chemins durant le lot. Le catalogue a été évalué en lecture seule depuis [content.js](../../../../modes/echos-de-la-greve/content.js), [assets.js](../../../../modes/echos-de-la-greve/assets.js) et [presentation-assets.js](../../../../modes/echos-de-la-greve/presentation-assets.js). Une traversée des chaînes de chemins donne **19 fichiers raster uniques Die-Hardman exposés**, même si certains sont réutilisés par plusieurs propriétés.

Chaque visuel cité ci-dessous a été inspecté. Les comparaisons portent sur le masque, le vêtement, la silhouette et la présence du personnage. Il ne s’agit pas d’un audit exhaustif de tous les pixels, de toutes les versions du personnage ou de tous les modèles de la galerie.

## Références officielles Die-Hardman

| Référence | Source vérifiée | Observations utiles | Limite |
| --- | --- | --- | --- |
| DHM-MASK | [PlayStation Blog, 19 octobre 2021](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/) ; [image originale](https://blog.de.playstation.com/uploads/sites/13/2021/10/e33dc8f7a181bc63118e9be298f8b3c358b0f672.jpg) | Masque noir à texture tissée, forme de crâne humain, grandes ouvertures ovales laissant voir les yeux, nez sculpté et dents individualisées, fixation ronde couleur laiton sur la joue, inscription blanche LUDENS sur le front. Col gris haut et pièce de cou sombre large visibles. | Gros plan : ne vérifie ni le dos, ni les chaussures, ni l’ensemble du manteau. Les petits numéros et inscriptions ne sont pas certifiés caractère par caractère. |
| DHM-BODY | [Kojima Productions, entretien avec Tommie Earl Jenkins, 25 mai 2022](https://www.kojimaproductions.jp/en/interview-with-TommieEarlJenkins) ; [composition originale](https://www.kojimaproductions.jp/sites/default/files/2022-05/coveringimage.jpg) | Gros plan en jeu non masqué et concept officiel en pied masqué. Le buste montre col montant, ascot large et cordons colorés ; le concept montre un long manteau sombre ouvert, un gilet gris, un pantalon à bande latérale et des bottes. | Le concept est un dessin de conception, pas une vue orthographique du modèle final. Le gros plan non masqué ne justifie pas de remplacer la version masquée utilisée en combat. |
| Contexte DS1/DC | [Page officielle PlayStation du jeu](https://www.playstation.com/en-us/games/death-stranding/) | Sépare le jeu original et Director’s Cut ; permet de retrouver les bandes-annonces officielles. | Aucune nouvelle vue détaillée du costume n’a été certifiée à partir de cette page. |

Les empreintes et qualifications de ces deux images sont consignées dans [reference-research.json](reference-research.json). La version mobile de la composition Kojima montre la même composition et n’apporte pas d’angle indépendant. Les références masquée et non masquée ne sont pas fusionnées en une nouvelle apparence de lore.

Les textes de présentation d’un article destiné à limiter les spoilers ne sont pas réutilisés comme preuve de tous les événements ou de toutes les révélations du récit. Cet audit utilise avant tout les images officielles observées pour la comparaison visuelle.

Les bandes-annonces de briefing [PlayStation](https://www.youtube.com/watch?v=OC7-E9fO1tc) et [PlayStation Australia](https://www.youtube.com/watch?v=MGstbhbvDIQ) ont été identifiées comme pistes complémentaires. Aucune image à un instant précis n’a été inspectée dans cette recherche : elles ne sont donc pas invoquées comme preuve d’un détail du modèle.

## Die-Hardman : chemins actifs et défauts constatés

Le préfixe commun des fichiers dans les tableaux suivants est `modes/echos-de-la-greve/`. Les clés indiquées appartiennent à `StrandAssets`, sauf mention explicite de `StrandPresentationAssets`.

### Onze PNG du combattant à corriger

Dans ces onze fichiers, l’ancien masque ressemble à une plaque robotique anguleuse : fente horizontale étroite, grille à la bouche, décoration géométrique dorée au front. Cette forme diverge du crâne tissé de la référence officielle. Le vêtement récurrent est un costume de ville court avec col blanc pointu, cravate fine et pochette ; il diverge aussi du col haut et de l’ascot observés, ainsi que de la silhouette longue du concept officiel.

| Fichier exact | Propriétés actives principales | État |
| --- | --- | --- |
| [assets/fighters/diehardman/stance.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/stance.png) | `fighters.diehardman`, `poses.diehardman.stance` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/action.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/action.png) | `actions.diehardman`, `poses.diehardman.action` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/step.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/step.png) | `steps.diehardman`, `poses.diehardman.step` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/hit.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/hit.png) | `hits.diehardman`, `poses.diehardman.hit` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/jump.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/jump.png) | `jumps.diehardman`, `poses.diehardman.jump` | Ancien masque et tenue à reprendre ; saut de repli conservé |
| [assets/fighters/diehardman/guard.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/guard.png) | `poses.diehardman.guard` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/crouch.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/crouch.png) | `poses.diehardman.crouch` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/rise.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/rise.png) | `poses.diehardman.rise` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/apex.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/apex.png) | `poses.diehardman.apex` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/fall.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/fall.png) | `poses.diehardman.fall` | Ancien masque et tenue à reprendre |
| [assets/fighters/diehardman/portrait.png](../../../../modes/echos-de-la-greve/assets/fighters/diehardman/portrait.png) | `portraits.diehardman` | Ancien masque et col à reprendre |

[fight.js](../../../../modes/echos-de-la-greve/fight.js) charge ces poses dans son catalogue de combattants ; [boss.js](../../../../modes/echos-de-la-greve/boss.js) reprend les mêmes images de joueur. Le portrait est réutilisé par les écrans qui consultent le catalogue : chaque usage ne représente pas un nouveau fichier à générer.

### Quatre autres visuels contenant l’ancien masque ou son profil

| Fichier exact | Chemin de lecture | Observation |
| --- | --- | --- |
| [assets/story/diehardman-intro.webp](../../../../modes/echos-de-la-greve/assets/story/diehardman-intro.webp) | `story['diehardman-intro']`, `storyFrames.diehardman.intro[0].src` | Vue de dos/profil devant une porte ; profil du masque et ancien col visibles |
| [assets/story/diehardman-ending.webp](../../../../modes/echos-de-la-greve/assets/story/diehardman-ending.webp) | `story['diehardman-ending']`, `storyFrames.diehardman.ending[0].src` | Profil/dos près du bureau et du microphone ; ancien masque et costume |
| [assets/story-completion-20261125/diehardman-intro-second.png](../../../../modes/echos-de-la-greve/assets/story-completion-20261125/diehardman-intro-second.png) | `storyFrames.diehardman.intro[1].src` | Lecture d’un registre ; ancien masque nettement visible de profil |
| [assets/finishers/diehardman.webp](../../../../modes/echos-de-la-greve/assets/finishers/diehardman.webp) | `finishers.diehardman` | Ancien masque en premier plan, porte ouverte en arrière-plan |

Cela porte à **15** le nombre de fichiers actifs où l’ancien masque ou son profil demande une correction : onze PNG du combattant et quatre images de récit/finisher.

### Geste maintenu et trois cadrages sans masque

| Fichier exact | Chemin de lecture | Conclusion de l’inspection |
| --- | --- | --- |
| [assets/presentation-20261127/diehardman-taunt.png](../../../../modes/echos-de-la-greve/assets/presentation-20261127/diehardman-taunt.png) | `StrandPresentationAssets.diehardman.taunt.src` | Masque déjà rapproché du crâne tissé, mais costume court, col blanc et cravate fine hérités. La correction de tenue reste à faire. |
| [assets/story/diehardman-rival.png](../../../../modes/echos-de-la-greve/assets/story/diehardman-rival.png) | `story['diehardman-rival']`, `storyFrames.diehardman.rival[0].src` | Gros plan main/clé et gant posé ; aucune tête Die-Hardman visible. Pas de défaut de masque démontré dans ce cadrage. |
| [assets/story-completion-20261125/diehardman-intro-insert.png](../../../../modes/echos-de-la-greve/assets/story-completion-20261125/diehardman-intro-insert.png) | `storyFrames.diehardman.intro[2].src` | Main gantée sur un registre ; aucun masque visible. |
| [assets/story-completion-20261125/diehardman-ending-final.png](../../../../modes/echos-de-la-greve/assets/story-completion-20261125/diehardman-ending-final.png) | `storyFrames.diehardman.ending[1].src` | Main déposant une clé ; aucun masque visible. |

Les manches/cuffs de ces trois inserts pourront nécessiter une revue de continuité si une nouvelle tenue est produite. Ils ne sont pas comptés comme trois masques incorrects supplémentaires.

Le lot Die-Hardman suspendu comptait les onze images du combattant, les quatre images de récit/finisher ci-dessus et trois phases de geste : **18 images prévues, zéro sortie reçue**. Une intention de remplacement n’est pas une correction livrée.

### Fichiers hérités non actifs et contrôle demandé sur Mama

Les fichiers `assets/fighters/diehardman-{stance,action,step,hit,portrait}.webp`, `assets/fighters/diehardman-jump.png` et `assets/story/diehardman-rival.webp` sont supplantés par les chemins PNG du catalogue. Ils ne sont pas ajoutés au besoin de production comme sept remplacements actifs supplémentaires.

[assets/story/mama-rival.webp](../../../../modes/echos-de-la-greve/assets/story/mama-rival.webp) a été inspecté : il présente une maquette/installation sous éclairage d’inspection et **ne contient pas de Die-Hardman**. [assets/story/mule-rival.webp](../../../../modes/echos-de-la-greve/assets/story/mule-rival.webp) montre MULE et Sam ; aucun masque Die-Hardman n’y a été identifié.

## Heartman : remplacement précis et limite de la référence

Le modèle actif [fighters/heartman/stance.png](../../../../modes/echos-de-la-greve/assets/fighters/heartman/stance.png) porte son écran sur le bras proche, également muni du brassard métallique. L’ancien [presentation-20261127/heartman-taunt.png](../../../../modes/echos-de-la-greve/assets/presentation-20261127/heartman-taunt.png) le transférait au bras éloigné. Cette incohérence a été constatée par traçage visuel de l’épaule, du coude et du poignet, sans inférer le côté anatomique canonique du personnage.

Le nouveau [fidelity-20261127/presentation/heartman-taunt.png](../../../../modes/echos-de-la-greve/assets/fidelity-20261127/presentation/heartman-taunt.png) utilise une consultation à un seul avant-bras : l’écran reste sur le bras proche, et l’autre bras reste au repos. Ses entrée et sortie gardent ce même équipement sur le même bras. L’ancien PNG est conservé avec ses octets d’origine ; le manifeste enregistre le chemin remplacé et son hash. La première tentative nouvelle avait répété l’inversion et a été exclue.

La [photographie officielle publiée par PlayStation](https://blog.de.playstation.com/uploads/sites/13/2021/10/5f5df86afac1999f1932ac0b44ae0fdcd91bb127.jpg) a été consultée depuis [l’article du 19 octobre 2021](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/). Elle montre le visage et le haut du buste, sans les poignets. Le [Character Spotlight officiel du 26 juillet 2019](https://www.youtube.com/watch?v=jKFJrET-3EI) est une piste identifiée ; ses images n’ont pas été inspectées ici. Le changement est donc qualifié de **correction de continuité avec le modèle actif**, et non de validation d’un côté anatomique officiel.

## Autres manques visuels réellement non produits

Le contrôle tient compte des images déjà présentes dans la galerie et des poses jouables existantes. Produire de nouveau un portrait déjà livré n’achèverait pas un kit.

| Besoin | État constaté | Conséquence pour la suite |
| --- | --- | --- |
| Entrée/tenue/sortie des gestes des sept kits du sous-lot | Les transitions manquantes sont maintenant produites ; Heartman dispose en plus d’un hold corrigé | Il s’agit de trois poses clés, pas d’une animation dessinée image par image. |
| Trois phases propres à Mama Viaduc | Produites dans ce lot ; la tenue conservait auparavant sa pose neutre | Garder l’étiquette de reconstruction du simulateur, aucune prétention de costume officiel 1:1. |
| Phases Die-Hardman et apparence cohérente | Non produites après refus ; les anciens chemins restent actifs | Réserve explicite de fidélité, aucun crédit de livraison pour le lot suspendu. |
| Orientation opposée préservant les asymétries | Pas de famille indépendante gauche/droite relevée ; le moteur utilise le miroir des sprites | Les équipements asymétriques et écritures peuvent changer de côté. Une vraie famille opposée demande des dessins dédiés. |
| Kits en pied DS2 à partir des portraits | Sam Drawbridge, Fragile au béret, Higgs DS2, Tomorrow, Rainy, Tarman et Neil ont des bases/portraits mais pas de familles complètes de poses jouables | Vérifier chaque version et chaque vêtement avant de produire le corps, puis le mouvement. Un portrait n’est pas un combattant livré. |
| Autres portraits et variantes DS2 | Lucy, Doctor, Heartman DS2, President, Tomorrow robe blanche, Sam promotionnel gris, Fragile de période antérieure et Pizza Chef ne constituent pas des kits complets | Garder les variantes séparées ; ne pas réutiliser un équipement d’une autre période pour remplir les vues absentes. |
| Chorégraphies assist/tag/switch/duo | Conception documentaire, familles visuelles dédiées non produites | Dépend du développement et de la validation du comportement en équipe ; aucune annonce de fonction livrée sur la seule base d’un dessin. |
| Intermédiaires d’animation | Les poses clés ne couvrent pas tous les intervalles, anticipations, contacts et récupérations | Prévoir un travail spécifique de continuité ; les durées de jeu ne créent pas de nouveaux dessins. |

Dollman DS2, le samouraï rouge DS2 et le chat chiral ont déjà des bases en pied ; Deadman, Amelie et Lockne ont également des visuels en pied, et Bridget sa présentation en lit médical. Sam et Cliff disposent déjà de séries complémentaires de marche/impact. Ces images ne sont donc pas décrites comme totalement absentes. Les besoins restants portent sur la complétude d’une version ou d’un kit. Le détail DS2 maintenu par le responsable du lot figure dans [MANQUANTS_DS2.md](MANQUANTS_DS2.md).

## Historique des refus à ne pas relancer

| Sujet | Preuve | État à conserver |
| --- | --- | --- |
| `machine-gun-mp-ds2` | [Manifeste domaines du 25 novembre](../../../../art/sources/echos-de-la-greve/production-20261125-domains/manifest.json), deux refus de sortie `illicit`, seconde requête `94ef4207-8115-4c99-bf0d-af4948cece83` | Aucun asset reçu/intégré pour ce sujet ; aucune relance dans ce lot. |
| `strider-hologram-half-life-dc` | [Manifeste extension du 25 novembre](../../../../art/sources/echos-de-la-greve/production-20261125-extension/manifest.json), refus `other`, requête `1aca92a3-6ef7-4261-8dad-136d11672db6` | `not-generated-not-integrated`, `retry:false` ; non relancé. |
| Nouvelle stance Die-Hardman | [Manifeste dédié du présent lot](diehardman-generation.json), refus de sortie `other` | Zéro image ; l’ensemble des 18 corrections prévues est suspendu sans relance. |
| Higgs DS2 en pied | [Manifeste statique du présent lot](static-generation.json), refus de sortie `other`, requête `730e9ec2-bac8-4521-a8d5-9ad6d1c68ecc` | Aucun nouveau corps reçu pour ce sujet, aucune relance. Il s’agit d’un sujet distinct des éditions de gestes Higgs DS1 reçues ici. |

Le Maser Gun de Director’s Cut possède déjà un [PNG livré](../../../../modes/echos-de-la-greve/assets/static-domains-20261125/maser-gun-dc.png), bien que son manifeste conserve un premier essai sans image : il n’est pas compté comme absent. L’illustration de décharge du Maser Handgun DS2 réalisée par le responsable de ce lot est un sujet distinct, documenté séparément dans [static-generation.json](static-generation.json).

Les deux rejets de continuité de cette production sont listés dans `outputsRejectedForContinuity` de [presentation-generation.json](presentation-generation.json). Ils restent distingués des refus du service : aucun refus de modération n’a été contourné ou relancé pour fabriquer ces 18 poses.

## Limites de fidélité maintenues

Les références officielles vérifiées servent à identifier les écarts et les éléments visibles. Une vue de visage, une image de concept ou une pose de statue dérivée ne suffit pas à certifier l’ensemble d’un costume, son dos, ses asymétries ou chaque équipement. La cohérence avec un sprite local évite une partie des discontinuités, mais peut aussi conserver les écarts déjà présents dans ce sprite.

Les 18 PNG de ce sous-lot restent des sorties natives d’image_gen, sans recadrage, recoloration, redimensionnement, suppression de fond par script ou retouche de pixels. Les mesures de dimension, alpha et empreinte sont des lectures de fichier. Certaines images Mama gardent des couleurs RGB de fond sous alpha zéro ; les pixels extérieurs contrôlés sont transparents. Plusieurs silhouettes approchent les bords du canevas : le rendu doit se fonder sur la géométrie réellement décodée, et non supposer une marge uniforme.

Aucun changement de récit, nouveau pouvoir, relation canonique ou événement officiel n’est déduit de ces gestes. La bible et le registre continuent de distinguer le lore établi, la fiction du simulateur, la conception d’une fonction et son implémentation vérifiée : [BIBLE_COMBAT.md](../../BIBLE_COMBAT.md), [REGISTRE_PRODUCTION.md](../../REGISTRE_PRODUCTION.md), [EXTENSIONS_COMBAT.md](../../EXTENSIONS_COMBAT.md).

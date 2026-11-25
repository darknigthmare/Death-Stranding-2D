# Galerie fixe, Archives et distribution HTTP

**Échos de la Grève · complément du 25 novembre 2026.**

## Catalogue et versions

La galerie contient **43 images fixes** : les 29 entrées précédentes sont conservées, et 14 nouvelles entrées s’y ajoutent. La répartition par œuvre est **15 DS1 / Director’s Cut et 28 DS2**. Les Archives passent de 12 à **16 portraits**, avec Lucy, Doctor, Heartman DS2 et The President. Ces fiches documentent une version visuelle ; elles n’ajoutent pas de combattant au roster.

| Ajout | Nombre | Classement |
|---|---:|---|
| Lucy, Doctor, Heartman DS2, The President | 4 | Personnages |
| Tomorrow en robe blanche, Sam aux cheveux gris promotionnels, Fragile première tenue promotionnelle | 3 | Tenues et variantes |
| DHV Magellan isolé, Tri-Cruiser, camion DS2 | 3 | Véhicules |
| Coffin board, capsule de fret déployée, Maser Handgun | 3 | Objets et équipements |
| Dunes sous le vent | 1 | Décors · Panorama |

Chaque ajout conserve son ID, son fichier natif, ses dimensions mesurées, sa désignation de version et un lien vers la bible et la fiche de référence correspondante. L’introduction précise la nature fixe de tout le catalogue ; la visionneuse porte l’étiquette **Image fixe**. Les filtres d’œuvre et de catégorie se combinent ; les nouvelles catégories *Tenues et variantes* et *Véhicules* rendent les versions et objets séparément accessibles. Les téléchargements pointent vers les mêmes PNG que les cartes et la visionneuse.

Les différences de proportions sont conservées. Aucun redimensionnement, réencodage, découpage ni correction d’alpha des PNG n’a été effectué par l’intégration du catalogue. Les limites de cadrage et les parties reconstituées restent décrites dans les [références de recherche](reference-research.json) et le [registre de l’univers](../../UNIVERS_DS.md#10-références-du-complément-et-rôles-à-concevoir).

## Preuves reçues

| Vérification | Résultat et portée | Preuve |
|---|---|---|
| Contrôleur de galerie | 15 contrôles réussis : filtres, état vide et retour, œuvres/versions, proportions déclarées, téléchargement, zoom, fermeture/focus, images absentes, liens documentaires et Archives. Le contrôleur livré s’exécute dans un DOM simulé. | [static-gallery-verification.json](static-gallery-verification.json) |
| Catalogue réel | 43 IDs uniques, catégories reconnues, PNG présents et dimensions natives conformes ; 16 images dans le balisage des Archives. Les 28 liens documentaires des 14 ajouts atteignent leurs fichiers et ancres. | Même rapport |
| Lecture des nouveaux fichiers | Les 14 nouveaux PNG du catalogue ont été décodés intégralement avec Pillow ; taille, dimensions, mode, alpha et SHA sont consignés. Aucun fichier image n’a été modifié. | [gallery-png-decode.json](gallery-png-decode.json) |

Ces contrôles ne certifient ni la mise en page dans un navigateur, ni le comportement natif du clavier et des dialogues, ni une fidélité canonique pixel à pixel. Le décodage des fichiers est une preuve différente du rendu et de l’inspection visuelle.

## Serveur et empreinte de version

Le relais distribue les modules `campaign.js` et `campaign.css`, ainsi que les PNG des dossiers `assets/static-completion-20261125/` et `assets/story-completion-20261125/`. L’empreinte de version inclut ces modules, les sources de la galerie, les Archives et les images admises, parcourues récursivement dans un ordre stable.

Les liens documentaires de la galerie sont servis par une liste explicite de trois fichiers : `BIBLE_COMBAT.md`, `UNIVERS_DS.md` et `REGISTRE_PRODUCTION.md`, sous `docs/combat/`. Ils sont distribués en **texte brut UTF-8**. Aucun moteur de rendu Markdown n’est ajouté. Les autres documents, les fichiers source hors liste et les traversées de chemin restent refusés ; les liens symboliques ne sont pas inclus dans l’inventaire des assets.

**Contrôle HTTP complet réussi le 25 novembre 2026 à 14:55:18 UTC.** La recette a comparé les octets et les types MIME des **43 images du catalogue**, des **42 chemins des sept arènes** ajoutées sur les deux lots et des **48 plans narratifs**, avec et sans le préfixe `modes/echos-de-la-greve/`. Les modules de campagne, les liens documentaires, l’empreinte de version et les exclusions sont également vérifiés. Le [journal HTTP](http-verification.log) enregistre la version réelle du relais `25e43537ac3a62dba891`.

La recette de protocole vérifie aussi la création d’un salon, ses deux places, les choix, le lancement, les accusés, la reprise, le résultat et la fermeture. Le moteur réel retrouve le même état après correction d’une commande tardive au pas 200, dans son hôte simulé. Les mutations utilisées pour tester l’empreinte ont lieu dans des fichiers de test temporaires, jamais dans les PNG livrés. Le serveur HTTP tourne réellement sur l’interface locale ; ce résultat ne prétend pas tester deux navigateurs ou une connexion multijoueur sur Internet.

Sources de code : [catalogue](../../../../modes/echos-de-la-greve/static-assets-data.js), [contrôleur](../../../../modes/echos-de-la-greve/static-assets.js), [Archives](../../../../modes/echos-de-la-greve/archives.html), [serveur](../../../../modes/echos-de-la-greve/netplay-server.cjs), [recette galerie](../../../../modes/echos-de-la-greve/qa/static-gallery.cjs), [recette réseau](../../../../modes/echos-de-la-greve/qa/reseau-logique.cjs).

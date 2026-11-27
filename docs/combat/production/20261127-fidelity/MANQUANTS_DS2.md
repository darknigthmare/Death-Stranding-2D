# Huit manques DS2 à documenter avant production

Audit local du 27 novembre 2026, base `7e000d36f2eb0fa4578b545bfb3d8b334acd516a`.

Ce document conserve huit cibles identifiées comme absentes avant le cadrage du lot de fidélité. Une seule a reçu un complément dans ce lot : une image fixe de la décharge du Maser Handgun DS2. Les sept autres demeurent sans nouvelle livraison. Une référence textuelle, un portrait ou une prévision ne constitue pas un asset reçu.

## État constaté dans le jeu

L’audit de la base constate 65 cartes, dont 32 DS2 : treize personnages, trois tenues, un ennemi, cinq objets, quatre véhicules et six panoramas. Les 65 fichiers sont présents et leurs SHA-256 sont tous distincts. Le [catalogue exécuté](../../../../modes/echos-de-la-greve/static-assets-data.js) reçoit ensuite une carte supplémentaire de décharge Maser : il atteint 66 cartes, dont 33 DS2. Le moteur comporte huit combattants DS1/Director’s Cut, sans kit DS2. Les [Dossiers de liaison](../../../../modes/echos-de-la-greve/progression-data.js) conservent 59 fiches, dont sept bases DS2 signalées « Kit en préparation ».

Les détails des références déjà consultées sont conservés dans [UNIVERS_DS.md](../../UNIVERS_DS.md), le [registre](../../REGISTRE_PRODUCTION.md), le [manifeste du lot univers](../../../../art/sources/echos-de-la-greve/production-20261125-universe/manifest.json) et le [manifeste de recherche du complément](../20261125-completion/reference-research.json). Les observations ci-dessous décrivent le contenu de ces preuves locales ; aucune nouvelle consultation visuelle externe n’est revendiquée dans cet audit.

## Cibles prioritaires

Les IDs ont été proposés lors de l’audit. Seul `maser-handgun-ds2-discharge` correspond désormais à une nouvelle carte réellement livrée ; les sept autres restent documentaires. Aucun ne devient une clé de sauvegarde ou un combattant jouable.

| Cible et ID proposé | Manque exact | Preuve actuelle et inconnues | Raccordement possible après réception |
| --- | --- | --- | --- |
| **Higgs DS2, armure rouge en pied** — `higgs-ds2-red-armour-body` | Portrait et guitare isolée disponibles ; aucun corps DS2 complet. | Poster officiel en buste. Le manifeste univers référence aussi une statue officiellement licenciée en pied et deux captures de jeu pour la guitare. La statue est une source dérivée ; jambes, chaussures et accessoires doivent être confrontés au jeu avant une affirmation de fidélité complète. | Silhouette de galerie et complément du dossier Higgs DS2. Le Higgs DS1 conserve sa version propre. |
| **Sam DS2, Drawbridge sans manches, en pied** — `sam-ds2-drawbridge-body` | Le fichier existant est un buste ; aucune silhouette complète de cette tenue. | Capture PC 2026 : cheveux foncés et haut noir sans manches Drawbridge. Jambes et chaussures non établies. Le Sam promotionnel gris et la tenue claire du visuel Sam/Lou ne fournissent pas automatiquement le bas de cette variante. | Base de silhouette et complément du dossier Sam DS2. |
| **Fragile DS2, béret et col Drawbridge, en pied** — `fragile-ds2-drawbridge-body` | Portrait Drawbridge et portrait promotionnel ancien disponibles ; aucun plein pied de la tenue Drawbridge. | Poster : béret, col et haut de tenue. Bas du costume non établi. La tenue promotionnelle ancienne éclairée en rouge est une variante séparée. | Carte de version distincte et complément du dossier Fragile DS2. |
| **Neil DS2, écharpe sombre, en pied** — `neil-ds2-body` | Portrait seulement ; aucune silhouette, animation ou rencontre intégrée. | Poster : visage, écharpe, haut de l’équipement et lames au premier plan. Bas du corps absent de la référence. | Galerie de personnages et dossier documentaire ; une rencontre éventuelle demande une conception propre. |
| **Boomerang sanguin DS2** — `blood-boomerang-ds2` | Aucune image isolée, carte ou trajectoire correspondante. | Arme nommée dans la [source PlayStation Allemagne](https://blog.de.playstation.com/?p=192267) déjà référencée. Son design complet n’a pas été inspecté dans les preuves du dépôt. | Objet fixe de galerie. États porté, lancé et retour à documenter séparément avant tout usage de combat. |
| **Grenade holographique d’Échoué DS2** — `bt-holographic-grenade-ds2` | Aucun objet ni hologramme propre à cet équipement. | Effet décrit par le [compte rendu PlayStation](https://blog.playstation.com/2025/05/08/death-stranding-2-on-the-beach-hands-on-report/). Forme physique et projection précise non associées à une image identifiée dans les preuves actuelles. | Carte d’équipement ; projection éventuellement séparée, sur référence explicite. |
| **Watcher DS2 identifié** — `watcher-ds2-body` | Aucun modèle local identifié avec confiance comme Watcher. | Existence et détection par la vue attestées par le même compte rendu. Une capture générique de créatures de goudron ne prouve pas cette identité. | Base d’ennemi dans la galerie. L’image ne livre ni IA ni comportement Boss. |
| **Décharge du Maser Handgun DS2** — `maser-handgun-ds2-discharge` | **Partiellement livré : image fixe reçue et intégrée à la galerie.** Aucune séquence animée ou attaque correspondante intégrée. | La [vidéo officielle du guide](https://gmedia.playstation.com/is/content/SIEPDC/global_pdc/en/games/pdps/d/de/death-stranding-2/_guide/videos/death-stranding2-stealth-video-01-20jun25.mp4), arrêt à 10,0 secondes, fournit l’arc blanc bleuté adapté en PNG transparent de 2 172 × 724. Les observations et le SHA de la référence sont consignés dans [reference-research.json](reference-research.json) et la sortie dans [static-generation.json](static-generation.json). Durée, phases et comportement d’attaque restent ouverts. Le Maser Gun DC est une autre arme. | Carte « Effet fixe de référence » réellement livrée ; [source et limites](ASSETS.md#maser). Aucun tir jouable ni nouveau droit de sélection. |

## Éléments déjà présents et versions à préserver

### Mise à jour de la tentative Higgs DS2 du 27 novembre

Une tentative distincte de production de la silhouette `higgs-ds2-red-armour-body`, à partir du portrait officiel, d’une capture de jeu Kojima et d’une statue entière sous licence, a été refusée par le service d’image : `moderation_blocked`, catégorie de sortie `other`, requête `730e9ec2-bac8-4521-a8d5-9ad6d1c68ecc`. Aucun PNG n’a été reçu et aucune nouvelle tentative n’est lancée. Le détail est conservé dans [static-generation.json](static-generation.json). La cible demeure absente ; aucune carte, aucun chemin d’image et aucune modification du dossier Higgs DS2 ne sont ajoutés.

### Assets et versions déjà livrés

- Dollman en pied, chat chiral isolé, guitare de Higgs, Maser Handgun DS2, DHV Magellan isolé, Tri-Cruiser, camion DS2, coffin board, capsule de fret et module de monorail Yamato sont déjà livrés.
- Le samouraï rouge possède une base en pied. Le poster source coupe toutefois les jambes : l’asset comporte une adaptation du bas du corps. Une amélioration de sa fidélité serait une révision d’un fichier existant, pas un nouveau manque comblé. Il n’est pas identifié comme Armed Survivalist ou comme Higgs par ressemblance.
- Tomorrow en haut sombre et Tomorrow en robe blanche sont deux versions déjà livrées en portrait. Le bas de la robe et les chaussures restent à établir. Rainy, Tarman, Lucy, Doctor, Heartman DS2, The President et Pizza Chef disposent également de portraits, sans plein pied complet déduit.
- Le monorail jaune reste une variante absente : la livrée Yamato ne la remplace pas. La capsule DS2 et la catapulte complète Director’s Cut ne documentent pas une installation complète de catapulte DS2.

## Réserves et éléments conceptuels

Le canon à goudron et son jet, le monorail jaune et la catapulte complète DS2 restent des réserves P2. Leur source visuelle exacte doit être complétée avant production. L’arme MP DS2 et le Strider Half-Life ont des refus de génération enregistrés dans les lots antérieurs ; cet audit ne propose aucune nouvelle tentative.

Pour les huit cibles, aucun kit, animation de combat, assistance, déblocage ou comportement Boss n’est annoncé comme livré. La décharge Maser est la seule nouvelle image DS2 de ce lot et demeure une référence fixe. Les bases DS2 des Dossiers de liaison restent distinctes d’un droit d’accès à un combattant. Cette image de galerie ne crée aucune condition de progression et ne modifie pas les sauvegardes existantes.

## Réception requise pour modifier cet état

Chaque nouvelle livraison devra associer l’identité et la tenue à une référence précise, consigner les parties visibles et inconnues, conserver les octets natifs, mesurer dimensions et transparence, relier le fichier à sa carte réelle et recevoir une vérification visuelle. Une référence promotionnelle ou sous licence garde sa provenance explicite. Les seuls éléments réellement comparés peuvent recevoir une conclusion de fidélité.

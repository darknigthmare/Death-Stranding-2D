# Lot extension du 25 novembre 2026

## Résultat livré

Ce lot poursuit Échos de la Grève dans le périmètre complet de Death Stranding. Il ajoute trois arènes, huit exercices guidés dans le mode Entraînement, un guide des six rencontres Boss, onze bases de galerie et leur traçabilité. Le périmètre documentaire couvre DS1 / Director’s Cut, DS2 et les autres œuvres avec leurs statuts propres. La couverture livrée reste un sous-ensemble de cet univers.

Base d’intégration : `8d274a015e0edf314a853630031d5eb507354811`. Les anciens identifiants, images et sauvegardes sont préservés ; les progrès du dojo utilisent la clé séparée `echos.lessons.v1`.

| Domaine | Avant | Après ce lot |
|---|---:|---:|
| Combattants avec kit jouable | 8 | 8 |
| Modes locaux | 9 | 9 |
| Rencontres Boss | 6 | 6 |
| Cartes de galerie statique | 52 | 65 |
| Cartes DS1 / Director’s Cut | 22 | 32 |
| Cartes DS2 | 29 | 32 |
| Carte de simulation du projet | 1 | 1 |
| Lieux / zones / configurations | 19 / 20 / 22 | 22 / 23 / 25 |
| Calques d’arène uniques / liaisons | 105 / 110 | 120 / 125 |
| Chemins d’images uniques exposés par les catalogues | 359 | 387 |
| Images natives des lots récents | 229 | 257 |
| Nouvelles images d’animation dans ce lot | — | 0 |

Les 28 nouveaux PNG comprennent **15 calques**, **2 panoramas** et **11 bases statiques**. Le panorama du stand de tir déjà présent est réutilisé sans modification et n’est pas recompté. Les 13 nouvelles cartes de galerie sont les deux panoramas DS2 et les onze bases. Les WebP de recette sont des preuves de rendu distinctes de ces 28 PNG.

## Contenu et accès

### Dojo

Le mode **Entraînement** propose huit exercices : portée, coup léger, garde debout, garde basse, punition d’un coup dans le vide, gestion des ressources, trois signatures et confirmation/enchaînement. Les objectifs reposent sur les entrées et événements du moteur. La progression, les reprises, les échecs et les commandes remappées sont gérés dans l’application. Voir [DOJO.md](DOJO.md).

### Boss

Le compendium décrit les six rencontres et leurs variantes à partir du moteur Boss distinct du duel. Il expose 30 actions et huit types de motifs, les annonces, phases, conditions et réponses mesurées. Les informations sont accessibles avant les combats Boss, Boss Rush et rencontres de campagne. Voir [BOSS_ET_RENCONTRES.md](../../BOSS_ET_RENCONTRES.md) et [BOSS_COMPENDIUM.md](BOSS_COMPENDIUM.md). Les seuils décrivent le jeu livré, pas des statistiques canoniques de la licence.

### Arènes

- `firing-range-dc` : Stand de tir · Director’s Cut ; cinq nouveaux calques autour du panorama existant.
- `night-viaduct-ds2` : Viaduc nocturne · DS2 ; panorama et cinq calques.
- `red-ravine-ds2` : Ravin rouge · vision DS2 ; panorama et cinq calques.

Les noms des deux scènes DS2 sont descriptifs. Les pistes planes, dégagements des combattants et parallaxes sont des adaptations au combat 2D. Chaque couche reste une image native distincte. Les seuils de sol et ancrages sont mesurés dans [stage-source-measurements.json](stage-source-measurements.json).

### Bases fixes

Pizza Chef DS2 ; Sam avec accessoires Cyberpunk ; Reverse Trike Cyberpunk ; gant gravitationnel Half-Life ; camion Lambda Half-Life ; Reverse Trike standard DS1 ; borne MULE ; hologramme Atlas Trauma Team ; Sam avec lunettes Ludens argentées ; squelette de vitesse argenté ; plaque d’armure argentée.

Ces portraits, véhicules, équipements et décorations sont accessibles dans la galerie avec œuvre, version, source et lien vers la bible. Ils ne constituent pas de nouveaux kits jouables. Le gant est une seule pièce. L’Atlas conserve son rôle d’hologramme décoratif ; aucun niveau chiffré n’est attribué aux équipements argentés.

## Vérification exécutée

| Recette | Résultat | Preuve |
|---|---|---|
| Inventaire d’intégration | 387 chemins présents ; 28 empreintes natives conformes ; aucun ancien asset modifié ou supprimé | [integration-verification.json](integration-verification.json) |
| Galerie | 17 groupes réussis, 65 cartes, filtres, dialogue, liens, dimensions PNG | [static-gallery-verification.json](static-gallery-verification.json) |
| Arènes | 24 cas sur trois arènes, déplacement dans les deux sens, modes local/entraînement, effets normaux/réduits, couches et repli panorama | [arena-renders/validation.json](arena-renders/validation.json) |
| Dojo | 10 groupes et 40 parcours réussis via les entrées du moteur ; huit combattants pour les objectifs dépendant de leur profil | [lessons-verification.json](lessons-verification.json) |
| Dojo avec Canvas natif | Deux exercices au stand de tir, 29 images décodées, captures 1280 × 720 | [lessons-native-verification.json](lessons-native-verification.json) |
| Compendium Boss | 14 groupes, 48 démarrages, durées et conditions du moteur, 18 rendus de guide | [boss-compendium-verification.json](boss-compendium-verification.json) |
| Serveur HTTP et protocole | Ressources réellement servies avec les deux préfixes ; trois nouvelles arènes admises ; refus de traversée, lien symbolique et fichiers privés ; checkpoint identique au tick 200 après commande tardive | [network-verification.json](network-verification.json) |

Les captures emploient le vrai renderer et un Canvas natif. Le runtime ne dispose d’aucune police système : les images, barres, positions et compositions sont vérifiées, **pas les glyphes du HUD**. La logique d’interface est testée avec un DOM simulé ; les événements de manette sont synthétiques. Ces preuves ne valident ni la mise en page HTML d’un navigateur, ni une manette physique, ni une session distante entre deux navigateurs. Une lecture visuelle des trois compositions d’arène a complété les mesures.

Le guide fourni `Combat_Games_Guide_General_v1.0.txt` reste inchangé, SHA-256 `4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7`. Sa correspondance avec les 30 lignes EDG de la bible est conservée.

### Reproduire les principales recettes depuis la racine

```sh
node modes/echos-de-la-greve/qa/extension-inventory.cjs
node modes/echos-de-la-greve/qa/static-gallery.cjs
node modes/echos-de-la-greve/qa/lessons.cjs
node modes/echos-de-la-greve/qa/boss-compendium.cjs
node modes/echos-de-la-greve/qa/reseau-logique.cjs
```

Les scripts Canvas nécessitent `@napi-rs/canvas` ; leurs options et limites sont décrites dans les preuves et le document du dojo. Les résultats enregistrés sont des mesures datées, et les chemins locaux du poste de production ne sont pas nécessaires au jeu.

## Sources et traçabilité

- [Bible §19](../../BIBLE_COMBAT.md#lot-extension-20261125)
- [Univers DS et références qualifiées](../../UNIVERS_DS.md)
- [Registre de production et tâches encore ouvertes](../../REGISTRE_PRODUCTION.md)
- [Recherche de références, URL et empreintes](reference-research.json)
- [Inventaire des PNG natifs](native-inventory.json)
- [Manifeste de génération avec prompts](../../../../art/sources/echos-de-la-greve/production-20261125-extension/manifest.json)

Les références visuelles proviennent de Kojima Productions, PlayStation et 505 Games. Les sources de petite taille restent classées B et leurs détails secondaires sont adaptés. Aucune fidélité 1:1 n’est certifiée. Les crossovers sont rattachés à leur présence documentée dans Death Stranding ; ils n’importent pas l’ensemble de leurs univers dans le roster.

## Manques restant ouverts

L’hologramme Strider Half-Life n’est pas livré : le service d’images a refusé cette génération (catégorie `other`, requête `1aca92a3-6ef7-4261-8dad-136d11672db6`). Aucune relance, aucune carte et aucun substitut ne le comptent comme réalisé.

Les réserves dont les références restent partielles, les personnages sans kit, les animations non demandées et la recette humaine de jouabilité demeurent qualifiés dans le registre. Les onze bases fixes n’achèvent pas ces tâches. Le périmètre complet de la licence est maintenu ; ce bilan ne revendique pas l’exhaustivité de tous ses contenus.

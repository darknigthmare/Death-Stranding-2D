# Complément de l’univers, campagne et scènes — 25 novembre 2026

**Échos de la Grève · réception locale du complément.**

Le lot livre **53 PNG sélectionnés**, une campagne en six chapitres, trois arènes et un réglage de décor statique. Il complète les images et systèmes déjà intégrés, conserve les huit combattants et leurs routes, et documente les manques encore identifiés. Le périmètre reste **tout l’univers Death Stranding**, avec des versions et des rôles distincts ; cette réception ne signifie pas que chaque élément de la franchise est recensé ou réalisé.

Références de suivi : [bible §17](../../BIBLE_COMBAT.md#17-complément-de-production-campagne-et-plans-narratifs--25-novembre-2026), [registre multidomaine](../../REGISTRE_PRODUCTION.md), [œuvres et sources](../../UNIVERS_DS.md), [manifeste de génération](../../../../art/sources/echos-de-la-greve/production-20261125-completion/manifest.json).

## 1. Comptes avant et après

L’état « avant » est celui du [lot univers réceptionné](../20261125-universe/LOT_UNIVERS_20261125.md), conservé comme instantané historique.

| Unité | Avant | Après le complément |
|---|---:|---:|
| Combattants jouables | 8 | 8 |
| Modes d’accueil | 8 | 9 |
| Rencontres Boss | 6 | 6, avec réemploi de deux dans la campagne |
| Routes individuelles / scènes | 8 / 24 | 8 / 24, textes et ordres conservés |
| Plans des scènes individuelles | 24 | 48 |
| Campagne interne du simulateur | Absente | 6 chapitres, 14 interludes, 5 points de vue |
| Lieux / configurations | 16 / 17 | 19 / 20 |
| Plans de décor | 85 | 100 |
| Images de galerie fixe | 29 | 43 |
| Répartition galerie DS1/DC / DS2 | 15 / 14 | 15 / 28 |
| Portraits des Archives | 12 | 16 |
| PNG nouveaux dans ce lot | — | 53 |
| PNG natifs récents actifs | 162 | 215 |
| Chemins d’image uniques utilisés | 292 | 345, aucun manquant |

L’[inventaire du catalogue](catalogue-inventory.json) distingue les chemins d’image uniques, les scènes, les couches et les entrées de galerie. La [vérification des natifs](native-assets-verification.json) contrôle les fichiers sélectionnés, leur conservation et celle des lots antérieurs. Les **53 nouveaux PNG occupent 94 766 168 octets** : 25 possèdent de la transparence et 28 sont opaques. Les 53 originaux et copies sont décodables, comportent une seule image et ont des SHA identiques. Les **162 PNG précédents sont inchangés** et disjoints des nouveaux ; leur union atteint 215. Une même image réemployée n’est pas comptée comme une nouvelle création.

## 2. Images livrées et versions retenues

### Treize bases fixes

Les références, crédits, cadrages et zones inconnues sont consignés dans le [manifeste de recherche](reference-research.json). Les identités DS2 ne remplacent pas les kits DS1/DC existants.

| ID de fichier | Sujet / version | Usage livré |
|---|---|---|
| `lucy-ds2` | Lucy, haut gris | Portrait et Archives |
| `doctor-ds2` | Doctor, lunettes rouges et tenue médicale | Portrait et Archives |
| `heartman-ds2` | Heartman, costume bleu et appareil pectoral | Portrait de version et Archives |
| `the-president-ds2` | The President, veste sombre | Portrait et Archives |
| `tomorrow-white-dress-ds2` | Tomorrow, robe blanche | Variante cadrée sur le haut de la tenue |
| `sam-grey-promo-ds2` | Sam, cheveux gris promotionnels | Portrait aux épaules découvertes |
| `fragile-early-outfit-ds2` | Fragile, première tenue promotionnelle | Portrait avec haut à sangles |
| `dhv-magellan-isolated-ds2` | DHV Magellan | Véhicule fixe isolé |
| `tri-cruiser-ds2` | Tri-Cruiser | Véhicule fixe isolé |
| `truck-ds2` | Camion DS2 | Véhicule ; modèle précis non confirmé |
| `coffin-board-ds2` | Coffin board | Équipement de déplacement isolé |
| `cargo-capsule-ds2` | Capsule de fret déployée | Module lancé, pas toute la catapulte |
| `maser-handgun-ds2` | Maser Handgun | Arme fixe ; aucun nouvel effet de combat |

Ces fichiers sont sous `assets/static-completion-20261125/`. La galerie ajoute les filtres **Tenues et variantes** et **Véhicules**. Chaque nouvelle entrée possède sa version, ses dimensions natives et ses liens documentaires. Un portrait ne certifie pas un costume entier ; un véhicule isolé ne signifie pas qu’il est pilotable. Les parties masquées ou peu définies restent des limites de reconstruction.

### Vingt-quatre plans et seize images de décor

Chaque route reçoit `intro-second`, `intro-insert` et `ending-final` sous `assets/story-completion-20261125/`. Les 24 originaux restent présents : introduction sur trois plans, rivalité sur un plan et conclusion sur deux, soit **48 plans**. Les [briefs actualisés](story-completion-briefs.json) associent texte approuvé, tenue, lieu, action, légende, fichier et SHA ; leur source correspond au `content.js` courant.

Les décors comprennent **quinze couches** — cinq pour Plate Gate, cinq pour la lisière urbaine sous le front de sable, cinq pour les dunes — et **un nouveau panorama des dunes**. Les deux autres panoramas sont réemployés. Les trois arènes utilisent le sol physique existant ; les sources et ancrages sont mesurés dans le [rapport des décors](RUNTIME.md).

### Sorties conservées et reprises

La production a obtenu **55 sorties d’image natives pour 53 assets sélectionnés**. Le premier sol des dunes a été remplacé pour supprimer une couture claire ; la première conclusion de Fragile a été remplacée pour rendre lisible le maintien du parapluie. Ces deux versions écartées ne sont pas des assets actifs supplémentaires. Une tentative de `fragile-intro-second` n’a produit aucune image, puis a réussi lors de sa relance : elle ne compte pas parmi les 55 sorties.

Les PNG retenus conservent leurs pixels natifs. Certains alphas culminent à 254 ; ils ne sont pas réencodés pour imposer 255. Les composites vérifiés des arènes restent opaques. **Aucune nouvelle animation n’a été générée.**

## 3. Narration et campagne

**Les Nœuds rompus** alterne Sam, Fragile, Mama, Heartman et Die-Hardman. Quatre duels en deux manches gagnantes précèdent le convoi MULE — deux vagues, deux colis — puis la baleine. Un prologue, six scènes avant, six après et une conclusion forment **14 interludes**. Leurs images réemploient les panoramas et portraits existants : ce ne sont pas quatorze nouvelles générations. Le [rapport de campagne](CAMPAGNE_NOEUDS_ROMPUS.md) détaille chaque chapitre.

Le récit concerne uniquement le réseau interne de la reconstitution. Il ne modifie ni les événements officiels ni **La Ligne silencieuse**. La difficulté est fixée pour la partie ; chaque chapitre réinitialise les ressources de son moteur. La sauvegarde indépendante reprend au début du chapitre interrompu. Les soins de Boss Rush — 120 PV initiaux, +20 plafonné à 120 — et ceux de Survie — 100 PV, +15 plafonné à 100 — restent propres à leurs modes.

Le carrousel manuel des routes conserve les textes, adversaires, titres et finalités. Image et légende changent sur place ; défilement, annonce accessible et focus restent stables. La pause de campagne occupe une fenêtre défilable sur les petits écrans, place le focus sur Reprendre puis le restitue à Pause.

Les [revues narratives 1](REVUE_SCENES_LOT1.md), [2](REVUE_SCENES_LOT2.md) et [3](REVUE_SCENES_LOT3.md) sont conservées. La troisième clôt le parapluie et associe les **24 SHA actifs** à leur dernière revue applicable. Les réserves secondaires demeurent : insigne BRIDGES lisible malgré la consigne générale, géométrie différente des coffres historiques, case propriétaire du registre MULE non identifiable avec certitude, durée ou état sonore impossibles à déduire d’une image fixe. Aucun point central ne demande encore une reprise ciblée ; cela ne constitue pas une certification 1:1.

## 4. Fonctions et corrections intégrées

Le **Décor statique** capture la composition du fond à l’activation : parallaxe, météo et boucles décoratives sont immobilisées. Simulation, combattants, projectiles, annonces et marqueurs utiles continuent. Le choix est local, persistant et indépendant d’**Effets réduits**. Une reconstruction réseau conserve le cadre figé sans ajouter cette préférence aux checkpoints partagés.

Le point d’entrée **Boss isolé** laisse la campagne gérer sa sauvegarde. Il n’écrit ni celle de Boss Battle ni celle du Rush ; son résultat indique `saved: null`. Une combinaison isolé/Rush est refusée avant de remplacer la session. Le règlement des six rencontres existantes reste conservé.

La [revue indépendante du code](REVUE_INDEPENDANTE_CODE.md) a trouvé puis vérifié un correctif du salon privé : une touche déjà tenue doit être libérée sur `keyup`, même après déplacement du focus vers un sélecteur ou ajout d’un modificateur. Les nouvelles pressions dans un formulaire restent filtrées. Le scénario a échoué avant correction puis réussi après ; le journal d’ambiances couvre aussi les vingt profils.

## 5. Preuves et limites

| Domaine | Preuve reçue et portée |
|---|---|
| Campagne et carrousel | [Recette finale](campaign-qa.json) avec `--require-assets` : six victoires, deux défaites/reprises, 14 interludes, 24 séquences/48 plans, 55 chemins requis présents. Moteurs réels, DOM/Canvas simulés. |
| Parité du décor statique | [1 440 comparaisons duel et 432 Boss](static-scenery-verification.json), avec autant de comparaisons aux moteurs de référence ; pixels de vingt arènes et quatre scènes Boss en Canvas natif. |
| Trois arènes | [24 rendus natifs](stage-renders/validation.json), mesures, cadrages gauche/droite, couverture et composite opaque ; [sélection/lancements](stages-verification.json) dans un DOM simulé. |
| Boss et ambiances | [Rencontres et sauvegardes](boss-verification.json), [vingt profils audio](ambiances-verification.log). Simulation réelle ; DOM et graphe Web Audio simulés, sans écoute matérielle revendiquée. |
| Galerie et Archives | [15 contrôles](static-gallery-verification.json), 43 images, 16 portraits, filtres, dimensions et liens ; [14 nouveaux PNG décodés](gallery-png-decode.json). |
| HTTP | [Journal réel](http-verification.log) : 43 images de galerie, 42 chemins d’arènes et 48 plans narratifs, octets/MIME exacts avec et sans préfixe ; modules, version, documents autorisés et exclusions vérifiés. |

La [non-régression des anciennes suites d’application](non-regression-app.log) reste **bloquée par l’environnement**. `parcours.cjs`, `defis.cjs` et `dojo.cjs` ont été tentés, puis retentés avec le lanceur Chromium local ; aucun navigateur exécutable n’a démarré et **aucune assertion de ces suites Playwright n’a été exécutée**. Elles ne sont pas déclarées réussies. La recette campagne ne couvre pas les huit routes complètes, tout Arcade, les deux Défis ou tout Dojo. Les autres preuves ne constituent ni une session navigateur, ni une validation multijoueur sur Internet.

## 6. Traçabilité et suites concrètes

Le guide conserve ses **55 172 octets**, son SHA-256 `4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7` et les trente associations EDG-G00 à G29. Les œuvres annoncées restent qualifiées comme telles. Les futures extensions demandent notamment des références identifiées pour Watcher/Armed Survivalists, des fiches de comportement avant toute jouabilité DS2, et une recette navigateur des parcours restés non vérifiés. Les transitions entre zones, remappages supplémentaires et localisations demeurent suivis dans le registre, sans être annoncés livrés.

**Référence de publication : [PR #7](https://github.com/darknigthmare/Death-Stranding-2D/pull/7)**, depuis la branche `codex/echos-completion-20261125` et la base `c3fa7ead88f1667b80202a44dca6549784021866`. Les 53 PNG natifs et les 44 captures de contrôle ont des empreintes Git identiques à leurs fichiers vérifiés ; l’arbre publié a été comparé à l’arbre local. La fusion dans `main` est autorisée par l’utilisateur. La PR conserve l’état distant effectif, les commits de livraison et le résultat de fusion ; les rapports de recette restent des preuves datées de leur périmètre.

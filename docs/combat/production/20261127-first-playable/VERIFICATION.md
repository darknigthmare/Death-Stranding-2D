# Vérification du premier contenu original jouable

Date de réception : **27 novembre 2026**. Référence de non-régression : `07c818cd3942c0e1925bb0cc32dfe73da19ff297`.

Cette recette couvre **Balise dans les modes locaux compatibles**, **le Consignateur dans Boss Battle**, leurs sources graphiques, les points d’entrée et les reprises. Le [bilan fonctionnel](BILAN.md) indique ce que cette passe rend jouable et les manquants qui restent ouverts.

## Provenance des preuves

Les rapports et captures livrés proviennent du [run 46011533537](https://github.com/darknigthmare/Death-Stranding-2D/actions/runs/46011533537), exécuté sur le commit **`fc4764abffa94754f5cb26009aa75717c60afd1a`**. Les recettes de mécanique, les mesures natives, le rendu et les parcours navigateur ont réussi. Cette version inclut le correctif de pause mobile et son contrôle d’accès aux commandes.

La réception s’est déroulée sur Ubuntu 24.04 avec Node 22.23.5 et Python 3.12.3. Les fichiers de preuve sont ensuite enregistrés dans un commit documentaire ; le workflow est rejoué sur la révision destinée à la fusion.

Les rapports JSON conservent les empreintes des sources réellement exécutées lorsqu’elles font partie de la recette. Les captures sont issues des moteurs livrés. Les sources PNG restent inchangées ; les captures de contrôle sont encodées en WebP à leurs dimensions complètes. Les planches et captures documentaires ne sont pas comptées dans les actifs raster du jeu.

Les huit fichiers calculés — deux registres d’art, deux données de compendium, deux JSON et deux références Markdown — sont régénérés dans la CI. Un contrôle `git diff --exit-code` exige leur identité avec les fichiers enregistrés dans le commit. Cela évite qu’une recette réussisse uniquement sur des données régénérées mais absentes de la livraison.

## Résultats

| Recette | Résultat | Rapport |
| --- | --- | --- |
| Réception PNG | 48 PNG RGBA, 58 130 961 octets, 0 erreur alpha ; 30 poses Balise, 12 Consignateur, 6 objets | [JSON](assets-reception.json) |
| Conservation et HTTP | 539 rasters et 33 SVG préservés ; 104 GET ; 8 sélections réseau canoniques acceptées et 12 sélections originales refusées | [JSON](delivery-verification.json) |
| Balise | 26 groupes ; 6 400 états canoniques comparés au socle ; simulation avec Canvas explicite de test | [JSON](balise-verification.json) |
| Consignateur | 16 groupes ; 18 victoires publiques ; 24 signatures ; 18 timings ; 822 checkpoints ; 15 corruptions rejetées | [JSON](consignateur-verification.json) |
| Boss historiques | 14 groupes ; 17 280 états canoniques comparés ; 48 démarrages kit/rencontre | [JSON](boss-compendium-verification.json) |
| Relais | 25 groupes et 6 groupes de revue indépendante | [JSON](teams-verification.json) · [revue](teams-independent-verification.json) |
| Présentation | 20 groupes, 3 240 états du socle, 40 changements de sélection | [JSON](presentation-verification.json) |
| Exercices | 14 groupes et 53 parcours | [JSON](lessons-verification.json) |
| Catalogue original | 13 groupes ; 147 dossiers, 70 bases, 1 kit et 1 boss originaux actifs, 0 IA ennemie originale | [JSON](catalogue-verification.json) |
| Liens des arènes | 4 groupes ; 20 départs d’entraînement sur arènes originales | [JSON](entrypoints-verification.json) |
| Entrées originales | 13 groupes et 20 liens d’arènes ; rendu DOM simulé distinct du navigateur | [JSON](first-playable-entrypoints-verification.json) |
| Canvas natif | 30 poses Balise, 12 Boss, deux descentes de saut, 12 captures ; 76 images décodées ; Sam normal gagne au pas 2 710 avec 44 checkpoints | [JSON](native-renders/first-playable-native.json) |
| Catalogue et relais dans Chromium | 28 contrôles ; ordinateur 1280×900 et mobile 390×844 | [JSON](browser-verification.json) |
| Premier kit et boss dans Chromium | 20 contrôles ; vrais boutons et clavier, reprises et accès aux commandes de pause mobile | [JSON](first-playable-browser-verification.json) |

La valeur « groupe » correspond à l’unité du script concerné ; elle ne représente pas un nombre de parties humaines. Les parcours complets, états comparés, fichiers reçus et contrôles d’interface sont distingués dans les rapports.

## Conservation et admission des contenus

La recette de livraison compare **539 fichiers raster** du dossier d’assets et **33 SVG** historiques à la référence, octet pour octet. Les 48 nouveaux PNG portent le dossier d’assets à **587 fichiers raster**. Parmi les nouveaux fichiers, **47 sont raccordés** : 30 poses de Balise, 12 du Consignateur et cinq objets. Le dernier fichier est la boucle orange initiale, conservée comme variante sans clé active.

Les registres complets activent un neuvième combattant dans le Versus local, l’entraînement libre et le Relais. Les routes récit, arcade, tournoi, défis, campagne, exercices guidés, Boss et réseau conservent leurs huit kits compatibles. La recette contrôle également 384 tirages de tournoi et 384 configurations invalides normalisées, sans mutation des configurations d’entrée.

Boss Battle comporte sept rencontres et Boss Rush six. Les vingt arènes originales restent des arènes statiques ; cette livraison n’ajoute pas leurs missions et couches séparées.

Le serveur de relais livré est lancé sur une vraie socket locale. Les **104 requêtes GET** vérifient les modules et les 48 PNG à travers ses deux préfixes publics. Huit sélections réseau canoniques sont acceptées ; douze sélections originales incompatibles sont refusées ; trois chemins privés restent refusés. Ce test HTTP local ne constitue pas un essai multijoueur sur Internet.

## Réception des PNG et composition

[Pillow 11.3.0](assets-reception.json) mesure les fichiers natifs : **48 PNG RGBA**, **58 130 961 octets**, **zéro erreur de réception**. Chaque image possède un canal alpha réel, une découpe exploitable et des marges. L’alpha maximal aux bordures est de **1 sur 255** ; la proportion entièrement transparente la plus basse est de **48,1299 %**. Ces mesures établissent les transparences et cadrages. L’identité du personnage et l’intégration à la scène font l’objet de la revue visuelle séparée.

Les quinze poses de Balise disposent chacune d’une direction gauche et droite native. Le Consignateur possède six états dans les deux directions. Le moteur sélectionne l’image correspondante sans miroir horizontal des silhouettes ; harnais, bobine, bouclier et perche conservent ainsi leurs côtés.

Le rendu natif utilise **`@napi-rs/canvas 0.1.80`**, décode **76 images réelles** et dispose de polices système enregistrées. Il produit douze captures : deux planches de Balise, ses situations d’ancre et de traction, les phases et objectifs du Consignateur, puis sa planche directionnelle. La police de référence est documentée et ses métriques sont vérifiées pour éviter des captures où le texte manque.

Les trente états de pose de Balise sont **préparés explicitement en mémoire** pour contrôler les sources et les appuis. Ils ne sont pas présentés comme trente séquences spontanées. Deux contrôles supplémentaires vérifient que la descente de saut conserve la pose aérienne, tandis que la pose `fall` reste réservée à la chute au sol.

Le parcours natif de Sam contre le Consignateur utilise seulement les commandes publiques. Il atteint la reddition au **pas 2 710**, valide **44 checkpoints**, désactive les deux consoles et restitue le registre. Les captures des phases proviennent d’états observés pendant ce parcours. La planche directionnelle du boss prépare uniquement l’orientation de ces états.

La [revue visuelle](VISUAL_REVIEW.md) explique les corrections du raccord de corde et de l’annonce finale, ainsi que la portée de l’inspection. Les images fixes ne certifient pas les cycles intermédiaires encore absents.

## Parcours dans Chromium

Le navigateur vérifié est **Chromium 145.0.7632.6**, piloté par Playwright 1.58.0, sur deux formats : **1 280 × 900** et **390 × 844**. Les pages, boutons et événements clavier sont ceux de l’application.

La passe catalogue/Relais vérifie les recherches, dossiers, aperçus, départs de combat et états d’équipe. La passe premier contenu jouable vérifie le lien du dossier Balise, ses six coups dans le manuel, le choix de la Digue, les filtres de modes et les sauvegardes. Au clavier, Balise pose réellement une ancre à l’abscisse 528 depuis 462, puis rappelle son corps jusqu’à 528. Le Relais exécute un appui et un changement de membre avant sauvegarde et rechargement.

La rencontre originale expose sept choix de boss, huit combattants et la Digue comme arène propre. Le guide affiche l’action Prise / interaction. La vitesse 0,75× est conservée après une reprise et dans la tentative suivante. Sur mobile, les panneaux de pause Duel et Boss commencent en haut et défilent dans la zone de jeu. La recette vérifie que le titre est entièrement visible, que chaque bouton et réglage tient dans le panneau et reçoit les interactions après défilement, puis qu’une reprise et une réouverture rétablissent le début. La barre de pause du Relais, placée dans le flux normal, est contrôlée séparément.

La passe spécifique Balise/Consignateur termine avec **20 contrôles réussis**, sans exception non interceptée, erreur HTTP de ressource, requête échouée ou erreur de parcours. La passe générale catalogue/Relais termine avec **28 contrôles réussis**, aucune exception de page et aucune requête échouée ; son rapport conserve toutefois un message console HTTP 404. Ce message reste visible dans la preuve et n’est pas effacé du compte rendu.

Les captures du jeu et des panneaux documentent les états indiqués par leur nom. Une interface mise en pause n’est pas une preuve de transition animée. Le format mobile est une émulation de viewport dans Chromium, **pas un téléphone physique**.

## Rejouer les vérifications

Le workflow [`ldm-first-playable.yml`](../../../../.github/workflows/ldm-first-playable.yml) contient les versions de dépendances, l’ordre des commandes et la collecte des rapports. Les recettes de régression nécessitent l’historique Git de la référence. Les preuves peuvent être dirigées vers un autre dossier via `LDM_QA_OUTPUT`.

Commandes principales, depuis la racine du dépôt :

```sh
python outils/recevoir_premier_jouable.py --require-complete
node outils/generer_catalogue_combat.cjs
node outils/generer_catalogue_boss.cjs
node qa/original-kits.cjs
node modes/echos-de-la-greve/qa/original-bosses.cjs
node modes/echos-de-la-greve/qa/first-playable-entrypoints.cjs
node modes/echos-de-la-greve/qa/first-playable-delivery.cjs
node modes/echos-de-la-greve/qa/first-playable-canvas.cjs
node modes/echos-de-la-greve/qa/first-playable-browser.cjs
node modes/echos-de-la-greve/qa/original-browser.cjs
```

Les autres recettes du workflow protègent le Relais, le compendium Boss, les exercices, la présentation et le catalogue original. Les inspecteurs de simulation sont injectés dans le processus de test ; ils ne créent aucune commande de victoire dans l’interface livrée.

## Portée et limites

Les mécaniques sont couvertes par des simulations déterministes, des parcours complets du boss et des actions réelles de l’interface. La présentation est couverte par des images décodées, un Canvas natif, des pages dans Chromium et une revue de captures.

Restent ouverts : **équilibrage avec des joueurs humains**, manettes et téléphones physiques, cycles dessinés intermédiaires, super et conclusion propres à Balise, campagnes originales, neuf autres kits, vingt IA ennemies, dix-neuf boss et les missions de l’extension. Les corrections canoniques non reçues dans les lots précédents gardent leur statut dans le registre principal.

Cette réception valide le périmètre décrit et ne constitue pas une certification globale de fidélité 1:1 de l’ensemble de Death Stranding 2D.

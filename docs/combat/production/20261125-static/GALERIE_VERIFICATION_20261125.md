# Vérification du catalogue statique — 25 novembre 2026

La page **Silhouettes et horizons** présente les **15 PNG approuvés** dans `window.StrandStaticCatalogue`. Le menu du mode et les Archives de Bridges donnent accès à cette page. Lockne rejoint les Archives avec son portrait natif de **1189 × 1323 px**.

## Contenu raccordé

| Catégorie | PNG | Contenu |
|---|---:|---|
| Personnages | 5 | Lockne portrait et corps, Deadman, Amelie, Bridget dans son lit médical |
| Ennemis | 3 | Échoué humain, soldat squelettique au casque à filet, MULE gris de la région Est |
| Projectiles | 4 | Grenade hématique, capsules EX n° 0, 1 et 2 |
| Décors | 3 | Ruines de South Knot, ferme sous la pluie temporelle, approche de Mountain Knot |

Les cinq images de personnages couvrent quatre personnes : Lockne possède deux vues. Bridget et les panoramas emploient des cartes larges. Les décors sont des panoramas ; ce lot n’ajoute pas de configuration de combat à cinq couches. Le catalogue ne modifie ni la sélection des combattants, ni les règles de jeu.

## Contrôles effectués

- Les **15 fichiers** sont présents, lisibles comme PNG et conformes aux dimensions inscrites dans le catalogue. Les capsules EX mesurent chacune **724 × 2172 px** ; leurs proportions sont conservées par l’affichage.
- La syntaxe de `static-assets.js`, `static-assets-data.js`, `assets.js` et `app.js` est valide.
- Les pages `archives.html` et `static-assets.html` ne contiennent aucun identifiant dupliqué ni référence locale manquante dans leurs liens, images, styles et scripts.
- Le véritable code de `static-assets.js` a été exécuté dans un **DOM simulé**. Onze groupes de contrôles ont réussi : catalogue valide, filtres et états accessibles, exclusion d’une image en échec, choix du fond, dimensions et téléchargement, titres traités comme texte, dialogue et fermeture, cartes larges, catalogue absent, filtres du lot réel et unicité des IDs.
- Le catalogue final compte **5 / 3 / 4 / 3 images** dans les quatre catégories. Les compteurs sont calculés depuis les entrées disponibles.

Le [rapport JSON](gallery-dom-validation.json) conserve les résultats, les dimensions des quinze images, les vérifications HTML et les empreintes SHA-256 des fichiers d’interface concernés.

## Portée des preuves

**Aucun rendu natif en navigateur et aucune validation de la mise en page par capture ne sont revendiqués.** Les contrôles de comportement reposent sur un DOM simulé ; ils ne prouvent ni la géométrie CSS dans un navigateur, ni la navigation au clavier dans un moteur natif.

Le navigateur Playwright était absent et son téléchargement n’a pas abouti. L’examen d’un moteur Qt WebEngine ancien n’a pas fourni de rendu exploitable de cette page ; il n’est pas retenu comme preuve. Les images générées et leur fidélité sont évaluées dans le manifeste et le rapport de production du lot, séparément de cette vérification d’interface.

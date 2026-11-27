# Dossiers de liaison — réalisation du 27 novembre 2026

## Résultat

L’[écran Dossiers de liaison](../../../../modes/echos-de-la-greve/progression.html) ajoute **huit souvenirs textuels déblocables** et une présentation explicite des accès existants. Il applique un premier périmètre de l’[Extension 02](../../references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt), associée aux sections 50–67 de la [bible des extensions](../../EXTENSIONS_COMBAT.md).

Le catalogue contient **59 fiches** : huit souvenirs, huit combattants, deux tenues de Mama, vingt-cinq configurations d’arène, neuf modes et sept bases visuelles DS2 sans kit. Les sept bases DS2 sont une sélection de fiches déjà produites, **pas une liste exhaustive du futur roster**. Aucune fiche ne crée un combattant, une arène ou une animation supplémentaire.

Les huit combattants, les deux tenues déjà disponibles, les arènes et les modes gardent leur accès. Ce lot ne modifie ni les dégâts, ni les commandes, ni les collisions, ni les sauvegardes du combat. Les présentations statiques et les réglages de confort restent disponibles sans condition.

## Les huit récompenses réellement écrites

Chaque récompense comporte un nouveau texte complet et une note qui précise son statut de fiction du simulateur. Le texte est conservé dans [progression-data.js](../../../../modes/echos-de-la-greve/progression-data.js). Les portraits existants illustrent ces fiches ; aucun PNG nouveau n’est compté pour ce module.

| ID stable | Combattant | Titre révélé | Motif de cette fiction |
|---|---|---|---|
| `memory-sam` | Sam Porter Bridges | Le bracelet rendu | La case vide et le destinataire de la caisse. |
| `memory-fragile` | Fragile | L’abri laissé ouvert | Le parapluie laissé au quai pour le prochain porteur. |
| `memory-higgs` | Higgs | Le silence du rappel | Le lecteur d’applaudissements et le choix du silence. |
| `memory-cliff` | Clifford Unger | La quatrième note | L’attente de la section et la mélodie inachevée. |
| `memory-mule` | Porteur MULE | La case du propriétaire | L’étiquette retournée et le choix de partir. |
| `memory-diehardman` | Die-Hardman | Une clé à hauteur de main | Le registre corrigé et le guichet ouvert. |
| `memory-mama` | Mama | Une travée pour deux | Le fil ajouté à la maquette sans confondre Mama et Lockne. |
| `memory-heartman` | Heartman | La marque de la seconde tasse | Le relevé conservé sans inventer un nouveau cycle canonique. |

Ces textes prolongent les routes originales déjà présentes dans `content.js`. Ils ne présentent aucun événement inventé comme un chapitre officiel de DS1, Director’s Cut ou DS2.

## Règles de déblocage exactes

Pour chaque combattant `F`, la règle est :

```text
Route complète de F
OU
(distance avec F ET guard-high avec F ET signatures avec F ET combo avec F)
```

La première voie est satisfaite si `echos.v1.chapters[F] === 3` **ou** si `echos.v1.scenes[F + '-ending'] === true`. L’épilogue conservé permet de retrouver une réussite passée lorsque l’histoire a été recommencée. Une chaîne de caractères `"3"`, un chapitre hors limite ou une chaîne `"true"` n’accordent aucun droit.

La seconde voie relit `echos.lessons.v1`. Les quatre exercices sont « Entrer et sortir de portée », « Tenir la garde debout », « Les trois signatures » et « Confirmer puis enchaîner ». Les quatre entrées doivent être valides et contenir **le même combattant** dans leur tableau `fighters`. Les validations obtenues avec quatre personnages différents ne satisfont pas cette voie. Le format du dojo est vérifié avec les IDs, le point de reprise, les compteurs et les listes de combattants admis par le module d’origine.

L’attribution est **automatique**, sans coût ni récupération manuelle. Elle intervient à l’ouverture des dossiers, sur « Actualiser les acquis », lors d’un événement de stockage d’un autre onglet, ou au retour d’une page conservée par le navigateur. Le bouton d’actualisation relit les preuves ; il ne simule aucun résultat de combat. Le compteur de souvenirs n’est pas un pourcentage d’avancement de la production.

La condition reste consultable après acquisition. Le souvenir est attribué et enregistré **avant** sa présentation visuelle. La courte apparition peut être supprimée par la préférence de mouvement réduit sans changer la récompense.

## Quatre dimensions séparées

Le contrôleur [progression.js](../../../../modes/echos-de-la-greve/progression.js) expose `resolve(item, state, context)` pour distinguer :

| Dimension | États implémentés dans la présentation | Exemple |
|---|---|---|
| Découverte | `secret`, `hint`, `identified` | Base DS2 masquée, silhouette de souvenir, souvenir révélé. |
| Droit d’accès | `none`, `earned`, `permanent` | Souvenir à obtenir ou acquisition permanente. Les contenus existants sont inclus. |
| Disponibilité | `planned`, `missing`, `error`, `ready` | Kit DS2 en préparation, installation nécessaire, contenu prêt. |
| Compatibilité | `compatible`, `incompatible` | Mode admissible ou personnage parent requis pour une tenue. |

Les valeurs `installed` et `availableIds` du contexte sont des entrées d’évaluation : le module ne télécharge aucun asset. Le test de fichier absent est un cas de logique, pas un gestionnaire d’installation livré. De même, l’écran décrit les contenus existants mais ne remplace pas le moteur de sélection de tous les modes. Aucun verrou global n’a été ajouté au roster.

Une tenue acquise avant son personnage conserve son droit et peut afficher « Acquis · personnage requis ». Une entrée incluse avec `installed: false` affiche « Acquis · installation nécessaire ». Aucun de ces cas ne se transforme en verrou d’abonnement.

### Les sept bases DS2 consultées

Les IDs suivants existent exactement dans `static-assets-data.js` et tous leurs chemins image ont été vérifiés :

| Source de galerie | Rôle dans les dossiers |
|---|---|
| `sam-ds2-drawbridge-portrait` | Base visuelle Sam DS2. |
| `fragile-ds2-portrait` | Base visuelle Fragile DS2. |
| `higgs-ds2-portrait` | Base visuelle Higgs DS2. |
| `dollman-ds2-body` | Base visuelle Dollman. |
| `tomorrow-ds2-portrait` | Base visuelle Tomorrow. |
| `rainy-ds2-portrait` | Base visuelle Rainy. |
| `tarman-ds2-portrait` | Base visuelle Tarman. |

Ces fiches portent « Kit en préparation ». Aucun accomplissement, abonnement ou action de menu ne prétend les rendre jouables. Avec le masquage initial actif, elles montrent un dossier numéroté et un emblème neutre, sans nom ni portrait. La recherche ne peut pas retrouver leur nom caché. La case de masquage révèle volontairement les identités sur cette page ; les autres galeries gardent leurs propres règles.

## Sauvegarde, migration et provenance

L’autorité des souvenirs est **la sauvegarde solo locale du navigateur**. Aucun compte distant n’est créé, aucune donnée n’est envoyée et aucune progression compétitive n’est validée.

Le nouveau registre utilise uniquement `echos.liaison.v1` :

```json
{
  "version": 1,
  "grants": {
    "memory-sam": {
      "source": "rule:memory-sam:v1",
      "acquiredAt": 1795737600000
    }
  },
  "retainedGrants": {},
  "preferences": { "hideFutureIdentities": true }
}
```

La date ci-dessus est un exemple de forme, pas une attribution réelle. Le code conserve la première date connue et ne réécrit pas une attribution identique. Il fusionne les acquis d’un autre onglet avant de sauver de nouveaux acquis. Les entrées inconnues ou incompatibles restent dans `retainedGrants` sans devenir des droits actifs ; une future règle compatible pourra les examiner explicitement. Les sources du combat, de la galerie et du dojo sont lues sans être réécrites.

Un registre de version future ou illisible reste intact. Les preuves locales lisibles peuvent encore ouvrir des souvenirs pour la session, avec un message explicite. Si l’écriture échoue, la récompense reste disponible dans la session et pourra être recalculée depuis les preuves de jeu à la prochaine ouverture. Le module ne promet pas de récupérer des événements qui n’ont jamais été enregistrés ou des données détruites hors du jeu.

## Présentation et accessibilité

Le vocabulaire « dossier », « liaison » et « archive scellée » est une **métaphore d’interface du simulateur**, inspirée du travail de connexion et de classement. Ce lot ne crée aucun objet canonique magique ou nouveau lieu officiel.

Les souvenirs fermés affichent le portrait existant en silhouette noire sur un fond clair et un sceau portant un cadenas. Chaque carte reste un bouton consultable, avec un nom accessible et un état en texte. Le dialogue propose les deux voies d’obtention et leurs conditions individuelles. Les acquis disposent d’un texte distinct de leur couleur.

Le dialogue natif possède un titre associé, un bouton Fermer et un retour de focus. Si une actualisation remplace les cartes pendant son ouverture, le focus retrouve la nouvelle carte du même dossier ou la liste. Les champs de catégorie et de recherche possèdent des libellés. Les nouvelles attributions et erreurs de sauvegarde sont annoncées dans une zone `aria-live`. Les identités masquées ne sont pas insérées dans les textes accessibles du dossier.

Le CSS prévoit les écrans étroits et `prefers-reduced-motion`. Le réglage existant `echos.v1.reducedEffects` est repris à l’ouverture. L’effet d’apparition n’est joué qu’une fois par nouvelle carte affichée pendant la session. La sémantique et les callbacks sont vérifiés ; la mise en page dans un véritable navigateur, le lecteur d’écran et la manette physique restent à valider.

## Abonnements : frontière du lot

Aucun abonnement ni avantage payant n’est proposé ou opérationnel. L’écran l’explique dans une section dédiée. Il ne demande aucun mot de passe, ne crée aucune liaison de compte et ne lit aucun indicateur local « abonné » pour accorder un droit.

`accessFromSources` est un **évaluateur pur de règles**, testé avec des décisions injectées : acquisition permanente, droit temporaire confirmé, début et fin, limite hors ligne, retrait d’une seule source et coexistence avec une autre acquisition. Il ne vérifie pas lui-même l’identité, un paiement ou une signature. Il ne reçoit aucun droit externe dans le jeu livré. Un futur adaptateur de confiance devra traiter les confirmations, révisions, doublons et événements désordonnés avant de lui fournir un état réconcilié. La présence de cet évaluateur ne constitue pas une intégration Patreon.

La fin d’un droit temporaire ne retire pas une source permanente indépendante. Une annulation de renouvellement ne suffit pas à retirer un accès dont la fin effective n’est pas atteinte. Hors ligne, un justificatif ne reste admissible que tant que sa date de fin **et** sa limite hors ligne ne sont pas dépassées. Ces valeurs sont fournies par le contrat ; aucune durée par défaut ni tolérance arbitraire n’est accordée.

Les parties en cours, invitations, services de compte, paiements, distribution des assets payants et replays liés aux abonnements ne sont pas raccordés dans ce lot.

## Vérification réalisée

Commande exécutée :

```sh
node modes/echos-de-la-greve/qa/progression.cjs
```

**37 groupes réussis**, dont 30 groupes de données/logique et sept groupes du contrôleur exécuté dans un DOM minimal explicite. Le [rapport JSON](progression-verification.json) conserve les libellés et le périmètre. La suite vérifie notamment les IDs et images, les deux voies d’acquisition, les mauvais types, le personnage du dojo, l’idempotence, la rétroactivité, les anciennes sauvegardes intactes, les données corrompues, le format futur, les entrées inconnues, le quota de stockage, les deux onglets, le masquage des noms et portraits, le focus et les conditions dans les dialogues.

Une tentative de recette Playwright a échoué **avant ouverture de page** : `/usr/bin/chromium` est un wrapper dont `/usr/lib/chromium/chromium` manque. Aucune capture de navigateur, validation de rendu mobile, session de lecteur d’écran ou manette physique n’est revendiquée. Le mode `--browser` reste disponible pour une machine équipée ; `ECHOS_CHROMIUM_PATH` peut indiquer son binaire. La recette HTTP de distribution est suivie par le lot global.

## Fichiers livrés

- `modes/echos-de-la-greve/progression.html` : écran des dossiers.
- `modes/echos-de-la-greve/progression.css` : présentation, silhouettes, focus et mouvement réduit.
- `modes/echos-de-la-greve/progression-data.js` : catalogue, huit textes et conditions.
- `modes/echos-de-la-greve/progression.js` : lecture des preuves, registre, résolution des états et contrôleur.
- `modes/echos-de-la-greve/qa/progression.cjs` : recette de logique, DOM explicite et option navigateur.

L’accès depuis l’accueil et l’autorisation de distribution des nouveaux fichiers relèvent de l’intégration du lot global. La publication GitHub et sa révision seront attestées par la PR de ce lot.

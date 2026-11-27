# Bilan du lot — guides, gestes et dossiers de liaison

**27 novembre 2026 · Death Stranding 2D / Échos de la Grève.**

Point de reprise : `main` au commit `1f7a9cd615b6c60301c29cd59c93515988591e2d`. Ce lot poursuit ce contenu et ajoute les deux extensions fournies par l’utilisateur. L’[historique du dépôt](https://github.com/darknigthmare/Death-Stranding-2D/commits/main/) et la pull request associée font foi pour la publication.

[Bible](../../BIBLE_COMBAT.md#extensions-guides-20261127) · [Application complète des extensions](../../EXTENSIONS_COMBAT.md) · [Registre](../../REGISTRE_PRODUCTION.md#extensions-guides-20261127) · [Présentation](PRESENTATION.md) · [Progression](PROGRESSION.md) · [Images](ASSETS.md).

## 1. Guide de la bible vérifié, deux extensions ajoutées

Le fichier général était déjà intégré. Sa copie actuelle est identique aux 55 172 octets du document retrouvé sur Drive, avec la même empreinte SHA-256. Les deux extensions originales sont ajoutées sans réécriture :

| Source | Rubriques | Taille |
| --- | --- | ---: |
| Combat Games — Guide général v1.0 | 00–29 | 55 172 octets |
| Extension 01 — Tag, Taunts, Bonus v1.0 | 30–49 | 60 589 octets |
| Extension 02 — Slots verrouillés, Déblocages, Abonnés v1.0 | 50–67 | 47 334 octets |

Les [sources et leurs empreintes](../../references/combat-guides-provenance.json) restent consultables. Les 38 nouvelles rubriques possèdent chacune une décision et une application au projet, en complément des 30 précédentes : **68 rubriques associées à la bible**.

La conception précise les huit fiches de personnalité, huit dossiers de duos, dix familles de bonus, les entités persistantes, les clashes, les quatre dimensions d’accès et les règles de soutien. Elle reprend les 18 cas d’acceptation de l’extension 01 et les 22 de l’extension 02. Les fonctions encore absentes portent leur état de conception.

## 2. Fonctions ajoutées au jeu

| Fonction | État dans ce lot |
| --- | --- |
| Geste de défi des huit combattants | Jouable dans les duels locaux et le dojo : 54 pas, vulnérabilité, aucun bonus offensif, interruption par impact. |
| Commandes | B pour J1, P pour J2, L3 et bouton tactile ; touches remappables et migration des anciens profils vers des touches libres. |
| Sélection et désélection | Aperçu distinct du choix, entrée, attente et sortie des poses, nettoyage des transitions rapides, tenue indépendante et mouvement réduit. |
| Huit poses PNG | Un fichier natif par combattant ; pose de tenue raccordée au moteur et au panneau de sélection. |
| Dossiers de liaison | Nouvelle page accessible depuis l’accueil ; 59 fiches, recherche, filtres, états d’accès et consultation au clavier. |
| Huit souvenirs écrits | Récompenses locales réellement présentes, débloquées par une histoire terminée OU quatre exercices avec le même combattant. |
| Acquis | Attribution permanente et idempotente, reprise des succès antérieurs, clé de sauvegarde dédiée, traitement des sauvegardes incompatibles. |
| Sept bases DS2 | Mention « Kit en préparation », identités masquées par défaut ; pas de faux déblocage d’un kit absent. |
| Serveur local | Modules, huit PNG, bible, extensions et sources servis par des routes explicites ; ressources nouvelles incluses dans l’empreinte de version. |

Les quatre exercices nécessaires à la seconde voie sont **Entrer et sortir de portée**, **Tenir la garde debout**, **Les trois signatures** et **Confirmer puis enchaîner**. Les huit combattants, les deux tenues disponibles, les vingt-cinq configurations d’arène et les neuf modes conservent leur accès.

Les replays sans nouvelle commande gardent la version 1. La version 2 ajoute les codes du geste sans déplacer les dix commandes historiques. Le salon privé conserve ses dix actions et filtre le geste ; le moteur Boss et le Duel originel n’acquièrent pas cette commande.

### Où essayer les ajouts

Ouvrir [le menu de combat](../../../../modes/echos-de-la-greve/index.html), choisir **Entraînement**, puis un combattant. Avec le profil par défaut, B déclenche son geste lorsque le personnage est au sol et libre de toute attaque ou garde. **Commandes → Mes commandes** donne l’affectation réelle de chaque profil.

Le bouton **Dossiers de liaison** de l’accueil ouvre [la collection](../../../../modes/echos-de-la-greve/progression.html). Un souvenir scellé montre les deux voies d’obtention. Les succès déjà enregistrés sont relus ; recommencer une route ne retire pas un souvenir acquis.

## 3. Images et fidélité

Les huit nouvelles poses portent les sorties natives récentes à **265** et les chemins d’images exposés par les catalogues à **395**. Les 442 PNG/WebP présents au point de reprise conservent tous leurs octets ; les huit ajouts sont séparés. L’[inventaire vérifié](inventory-verification.json) distingue les rasters du dépôt, les sorties natives récentes et les images réellement exposées.

Les versions restent séparées : les gestes sont ceux des huit kits DS1/DC du simulateur. Les costumes DS2 ne sont pas mélangés à ces modèles. La nouvelle pose de Die-Hardman corrige son masque à partir d’une référence officielle. La réserve concernant le masque de certaines anciennes poses reste ouverte.

**La fidélité 1:1 est un objectif de production, pas une certification acquise.** Ces gestes, souvenirs et règles sont des créations du simulateur ; ils n’ajoutent pas d’événements à la chronologie officielle. Les poses intermédiaires dessinées, les variantes de tenue et les asymétries retournées horizontalement restent à traiter. Le [rapport d’images](ASSETS.md) expose les références, les prompts, les fichiers retenus et ces limites.

## 4. Vérifications effectuées

| Domaine | Preuve et portée |
| --- | --- |
| Présentation et gestes | [13 groupes](presentation-verification.json), huit cycles, 548 instantanés de replay v1/v2, quarante changements rapides, impacts, migration et exclusions. |
| Commandes | [16 groupes](commandes-verification.json), 22 paires joueur/action, profils et neuf modes ; manettes simulées. |
| Progression | [37 groupes](progression-verification.json), dont trente de données/logique et sept de contrôleur dans un DOM simulé. |
| Images dans le moteur | [17 rendus Canvas natifs](presentation-native.json), deux orientations pour chaque combattant et conservation de Mama Viaduc ; huit PNG intacts, 121 chemins décodés, polices disponibles. |
| Actions et IA | [10 groupes](moves-domain-verification.json) ; trente attaques conservées, sept utilitaires documentés, données régénérées depuis le vrai moteur. |
| Dojo | [10 groupes et 40 parcours](lessons-verification.json) par entrées réelles, avec remappage adapté à la nouvelle touche B. |
| Campagne, transitions et galeries | [Non-régression](regression-verification.json) des six chapitres, 48 plans, sauvegardes séparées, liaison quai→hangar, replays et galerie. |
| Décors statiques | Comparaison explicite au vrai point de reprise : 1 800 états de duel et 432 états Boss, avec 400 changements de préférence. |
| Distribution HTTP | [Ressources et protocole](relay-verification.json), contenu exact sous les deux préfixes, fichiers sources explicitement autorisés, taunt rejeté sans consommer son numéro de commande. |
| Intégrité | [Inventaire](inventory-verification.json) : trois guides exacts, huit nouveaux PNG raccordés, 442 anciens rasters inchangés, aucun chemin d’image absent. |

Une ancienne recette de décor statique comparait toutes les configurations au commit `c3fa7ea`, antérieur à la liaison quai→hangar. Elle échoue sur l’état `link` déjà présent avant ce lot. Le rapport conserve cet essai et ajoute une comparaison explicite avec `1f7a9cd`, le point de reprise réel ; aucune égalité d’état n’est assouplie.

Le runtime Chromium n’a pas de binaire utilisable ici, et son téléchargement a échoué. **Aucune validation visuelle HTML dans un vrai navigateur, aucune manette physique ni session multijoueur sur Internet n’est déclarée réussie.** Les captures sont produites par le vrai renderer avec Canvas natif ; les parcours d’interface utilisent un DOM de test explicite.

### Reproduire les vérifications principales

Depuis la racine du dépôt :

```sh
node modes/echos-de-la-greve/qa/presentation.cjs
node modes/echos-de-la-greve/qa/progression.cjs
node modes/echos-de-la-greve/qa/presentation-assets.cjs
node modes/echos-de-la-greve/qa/extensions-inventory-20261127.cjs
node modes/echos-de-la-greve/qa/reseau-logique.cjs
node modes/echos-de-la-greve/qa/static-scenery.cjs --baseline=1f7a9cd615b6c60301c29cd59c93515988591e2d --logic-only
```

La recette native requiert `@napi-rs/canvas`. Les comparaisons historiques requièrent les commits cités dans le clone. Les rapports distinguent leurs dépendances et leurs méthodes.

## 5. Systèmes conçus qui restent à réaliser

L’assistance, le tag avec transfert de contrôle, les supers et conclusions d’équipe, les clashes/QTE, les dix bonus et le parcours d’archives explorables sont désormais définis dans la bible, mais **ne sont pas activés dans le jeu par ce lot**.

Les abonnements et droits externes disposent d’un contrat d’évaluation testé sur des décisions injectées. Aucun fournisseur, paiement ou compte de soutien n’est connecté. Les souvenirs livrés s’obtiennent en jouant ; aucune valeur locale « abonné » n’accorde de droit payant.

Les nouveaux kits DS2, les séries d’animation complètes et la réception comparative exhaustive de fidélité restent dans le registre de production. Le projet couvre l’univers complet, tandis que ce lot livre les fonctions et preuves listées ci-dessus.

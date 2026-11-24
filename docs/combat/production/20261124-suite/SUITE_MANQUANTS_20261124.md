# Suite des éléments manquants — 24 novembre 2026

## Publication de ce lot

Ce lot ajoute **44 PNG natifs** à la PR #6 du dépôt `darknigthmare/Death-Stranding-2D`. Il complète les **42 PNG déjà intégrés et validés** dans le premier commit de la PR, soit **86 nouveaux PNG produits au total pendant cette reprise**.

Le premier lot est intégré au jeu. **Les 44 images de ce second lot sont publiées avec leurs manifestes ; leur raccordement final au jeu reste à publier.** L’environnement de travail a été détaché pendant la recette et aucun outil de rattachement n’était disponible. Les images terminées ont été préservées directement depuis les résultats natifs de génération par le connecteur GitHub, sans réencodage.

[Galerie des images de ce lot](index.html). Les références, prompts et empreintes Git se trouvent dans `art/sources/echos-de-la-greve/production-20261124-suite/`.

## Images effectivement disponibles

| Famille | Livré | Détail |
|---|---:|---|
| Mama, tenue Atelier | 10 | Stance, action, marche, impact, portrait, garde, accroupissement, montée, sommet et descente du saut. |
| Die-Hardman | 6 | Stance, action, marche, impact, portrait et saut de repli. Les cinq poses du premier lot sont conservées. |
| Personnages de soutien | 3 | Portraits de Deadman, Amelie et Bridget ; ils ne constituent pas trois nouveaux combattants jouables. |
| Boss et véhicule | 9 | Lion : idle/attaque/impact ; Catcher aquatique : idle/attaque/impact ; baleine, géant et camion MULE : idle. |
| Effets boss | 4 | Orbe de goudron, pointe de goudron, anneau chiral et trait électrique MULE. |
| Port Knot City | 6 | Panorama et cinq couches indépendantes : ciel, lointain, plan moyen, sol et premier plan. |
| Incinérateur de la région Est | 6 | Panorama et cinq couches indépendantes selon la même structure. |
| **Total de ce lot** | **44** | Un élément ou une pose par image ; aucune nouvelle planche de sprites. |

Les sprites et couches détachées ont un canal alpha. Les panoramas et les ciels restent opaques. Les sources natives sont conservées ; les recadrages prévus pour le rendu sont des coordonnées, sans modification des pixels.

## Fidélité et provenance

Mama a été reprise depuis le spotlight PlayStation de 2019 : visage humain, lunettes fines, queue de cheval, haut clair, harnais ocre et Odradek. La continuité du bracelet et du pantalon asymétrique a fait l’objet de corrections de génération. La référence officielle disponible ne montrait pas le bas du corps en entier : cette partie est documentée comme complétée, sans prétention de validation intégrale.

Die-Hardman reprend l’identité peinte du premier lot. Les trois portraits de soutien sont dérivés de références officielles PlayStation et Kojima Productions. Les formes des Catchers et véhicules sont accompagnées de leur propre audit de références dans le manifeste des boss.

Les décors utilisent des captures de jeu documentées : l’architecture et l’atmosphère guident les nouvelles images, tandis que la caméra latérale et les sols de combat sont adaptés au mode 2D. Les quatre effets sont des représentations de mécaniques du fan-game.

**L’objectif est la fidélité 1:1 ; cette correspondance exacte n’est pas certifiée.** Les zones non visibles dans les références, les poses de combat adaptées, le miroir des accessoires asymétriques et les techniques originales demeurent explicitement identifiés.

## Intégration locale réalisée avant l’interruption

Les fichiers de travail locaux comprennent déjà :

- le routage des nouveaux PNG par défaut de Mama et Die-Hardman, avec conservation de la tenue alternative Viaduc ;
- le catalogue des 13 configurations de stages, dont les deux nouveaux lieux ;
- les mesures des images déjà présentes et les ancres de sol à `367/941` pour Port Knot et `273/809` pour l’incinérateur ;
- la page Archives de Bridges et ses trois portraits de soutien ;
- les routes et empreintes de distribution des nouveaux assets ;
- un module Boss Battle autonome et son interface.

**Ces changements de code ne font pas partie de ce commit d’images.** Ils doivent être repris dans le même environnement, complétés, vérifiés puis publiés dans la PR.

### Boss Battle

L’implémentation locale comporte six rencontres : lion, Catcher aquatique, baleine, géant, camion MULE et convoi MULE en deux vagues. Les huit combattants disposent de commandes adaptées. Les véhicules introduisent le ramassage et la livraison des colis, avec suivi de leur intégrité. Le module comprend annonces d’attaques, phases, victoire/défaite, revanche, sauvegarde séparée `echos.boss.v1`, pause et reprise.

Avant le détachement, le contrôle logique a obtenu **six victoires avec de vraies commandes et 13 contrôles réussis**, dont livraison des colis, deuxième vague, pause et reprise déterministe. Il utilisait les replis du rendu. Il ne valide pas encore les 14 sprites boss finaux, les quatre FX ni les menus dans un navigateur.

### Deux nouveaux stages

Les deux stages ont passé **16 cas de rendu avec le moteur réel et Canvas natif** : deux modes, deux directions et effets normaux/réduits. Les cinq plans, leurs proportions, la parallaxe et les raccords opaques au sol ont été contrôlés. Les deux compositions en combat ont aussi été relues visuellement.

Les preuves détaillées de ces nouveaux tests restent dans le répertoire de travail local et doivent être ajoutées avec l’intégration. Les tests du premier lot restent consultables dans `docs/combat/production/20261124/`.

## Prochaines opérations précises

1. Rétablir l’accès à l’environnement de travail existant, sans recréer le projet ni écraser ses modifications locales.
2. Reprendre la dernière Mama apex corrigée dans le résultat natif et synchroniser les trois derniers idles boss avec les fichiers publiés.
3. Produire les **cinq images restantes du lot prévu de 49** : baleine attaque/impact, géant attaque/impact, camion MULE endommagé.
4. Finaliser les mesures, puis vérifier le dessin effectif de chaque nouvelle pose et effet dans les deux orientations. Capturer explicitement le camion endommagé et l’anneau chiral.
5. Achever les tests ciblés de garde/esquive, perte d’intégrité de cargaison, expiration et refus de stockage ; terminer les consignes UI du mode.
6. Relancer la recette sur les sources définitives, ajouter les preuves et publier le code d’intégration dans la même PR.
7. Continuer l’audit des autres manquants : Lockne, costumes et vues gauche asymétriques, tenue Viaduc, poses historiques encore hétérogènes dont la stance de Higgs, planches de Sam/Cliff et illustration rivale de Die-Hardman. Distinguer à chaque fois un fichier absent, un dessin à reprendre et une nouvelle mécanique.

## Repères de reprise technique

- PR : https://github.com/darknigthmare/Death-Stranding-2D/pull/6
- Branche : `codex/echos-assets-fidelity-20261124`
- Premier commit distant validé : `45c09e88fd080198c49b7d5f9bcbd8485f69a1c9`
- Commit local équivalent du premier lot : `45e08624f4f2c2ccf4e68a82dd219d3b90897cd9`
- Arbre commun de ce premier lot : `b30a67e25c0534baf91a2572d8a5d1edcd742aee`

Le Git local et la branche distante ont des historiques de commits différents mais le même arbre pour le premier lot. La publication suivante doit partir du dernier head distant, protéger sa mise à jour par `expected_sha` et conserver les nouveaux manifestes/rapports distants. Aucun merge n’a été demandé.

# Phases du geste, dojo et fidélité — bilan du complément

**27 novembre 2026 · Death Stranding 2D / Échos de la Grève.**

Point de reprise : `main` au commit `7e000d36f2eb0fa4578b545bfb3d8b334acd516a`, après intégration du guide général et de ses deux extensions. Ce complément reçoit **19 PNG natifs**, raccorde les phases visuelles du geste, ajoute le **neuvième exercice du dojo** et documente les corrections qui n’ont pas pu être produites. L’[historique du dépôt](https://github.com/darknigthmare/Death-Stranding-2D/commits/main/) et la pull request associée font foi pour sa publication.

[Bible](../../BIBLE_COMBAT.md#fidelity-20261127) · [Registre](../../REGISTRE_PRODUCTION.md#fidelity-20261127) · [Images et sources](ASSETS.md) · [Présentation](FIDELITY_PRESENTATION.md) · [Revue visuelle](REVUE_VISUELLE.md) · [Manques DS2](MANQUANTS_DS2.md).

## 1. Changements livrés

### Le geste possède une préparation et un retour propres

Sam, Fragile, Higgs DS1, Cliff, le MULE, Mama Atelier et Heartman reçoivent chacun deux poses nouvelles. Le moteur les affiche selon la phase réelle du geste : **10 pas d’entrée, 28 de tenue, 16 de sortie**. La durée, les conditions de lancement, les interruptions et la vulnérabilité restent celles du geste existant. Le lot ne modifie aucun chiffre des attaques ou des profils IA.

Mama Viaduc possède désormais **trois poses dédiées**, utilisées aussi dans la présentation de sélection. La résolution choisit le costume avant la phase. Si une image manque ou n’a pas fini de se charger, le rendu revient à la posture de ce même costume. Si cette posture elle-même n’est pas prête, le repli neutre garde l’identité choisie. Le mouvement réduit conserve un affichage stable, avec le même engagement de combat.

Le hold historique de Heartman déplaçait son dispositif vers l’autre poignet. Une nouvelle pose centrale le ramène au bras équipé de la posture active ; la préparation et le retour suivent cette même continuité. L’ancien fichier reste conservé. La référence officielle de visage consultée ne montre pas les poignets : **c’est une correction de cohérence entre les images du projet**, sans certification d’un côté anatomique canonique.

Ces dix-huit images sont des poses clés. Elles ne constituent pas dix-huit animations ni un cycle dessiné pour chaque image d’affichage. Les poses de Die-Hardman restent celles du lot précédent, avec un repli sur sa posture en entrée et sortie.

### Le neuvième exercice enseigne le risque du geste

**Le geste expose** ajoute deux objectifs mesurés dans le moteur du duel : terminer tout le geste à au moins **250 pixels** du partenaire, puis toucher ce dernier avec un **coup léger pendant son propre geste**. Le partenaire avance et déclenche la même commande qu’un joueur. La validation ne lui retire pas artificiellement de vie et ne force pas une victoire.

Le contrôle distingue un cycle interrompu, une distance insuffisante, un mauvais type d’attaque et un contact trop tardif. Une erreur de frontière a été corrigée pendant la revue : un coup qui arrive sur le pas où le geste se termine naturellement ne compte plus comme une interruption. Le dernier contact encore vulnérable et le contact du pas suivant ont chacun leur trace de test.

Un second cas réel a été corrigé : une mine de Higgs pouvait interrompre le partenaire pendant le démarrage d’un léger et lui attribuer indûment l’objectif. La validation exige maintenant la phase active du léger et l’absence de marqueur ou projectile résiduel au contact. La consigne demande d’attendre la fin des autres techniques ; le test reproduit la mine qui touche pendant le démarrage et vérifie le refus de validation. Le moteur et ses attaques ne sont pas modifiés.

Le libellé du parcours utilise maintenant le nombre réel d’exercices. Les commandes affichées suivent le profil choisi. Les sauvegardes des huit exercices précédents restent lisibles et leurs identifiants ne changent pas. Le nouvel exercice **ne remplace ni n’ajoute aucun objectif** dans les quatre exercices historiques donnant accès à un souvenir.

### Une référence de décharge DS2 rejoint la galerie

La vidéo de discrétion du [guide officiel PlayStation DS2](https://www.playstation.com/en-us/games/death-stranding-2-on-the-beach/death-stranding-2-on-the-beach-guide/) a été inspectée à 8,2 s, 10,0 s et 10,6 s. La vue à **10,0 s** sert de référence aux filaments clairs et au départ lumineux du nouveau PNG de décharge du **Maser Handgun DS2**.

La carte figure dans **Silhouettes et horizons**, avec son œuvre, sa version, son statut d’effet fixe et son lien vers les limites de la référence. Elle ne crée pas une arme jouable. La charge, l’impact et la durée complète de l’effet ne sont pas livrés comme séquence animée. Le Maser Gun de Director’s Cut reste une référence distincte.

## 2. Comptes avant et après

Les comptes d’images ci-dessous concernent le dossier d’actifs du mode ; les captures de recette dans `docs/` ne sont pas des images de gameplay supplémentaires.

| Unité | Base `7e000d3` | Après ce lot |
| --- | ---: | ---: |
| Nouveaux PNG natifs de ce lot | 0 | **19** |
| Dont poses de présentation | 0 | 18 |
| Dont effet fixe de galerie | 0 | 1 |
| PNG/WebP conservés dans les actifs | 450 | **469** |
| Chemins d’images actifs uniques | 395 | **413** |
| PNG natifs récents conservés | 265 | **284** |
| PNG natifs récents actifs | 265 | **283** |
| Cartes de galerie | 65 | **66** |
| Cartes DS2 dans la galerie | 32 | **33** |
| Exercices du dojo | 8 | **9** |
| Dossiers de liaison | 59 | 59 |
| Souvenirs / bases DS2 en préparation | 8 / 7 | 8 / 7 |
| Combattants / modes / Boss | 8 / 9 / 6 | 8 / 9 / 6 |
| Configurations d’arène | 25 | 25 |

Le gain de chemins actifs est de dix-huit : les dix-neuf nouvelles images sont branchées, mais l’ancien hold Heartman est supplanté. Il est toujours présent parmi les fichiers conservés. Les [inventaires natifs et d’intégration](inventory-verification.json) vérifient les fichiers antérieurs et les copies reçues ; aucun refus ou candidat écarté n’est compté comme une livraison.

Les trois fichiers Combat Games restent identiques à leurs originaux vérifiés : guide général de 55 172 octets, extension Tag/Taunts/Bonus de 60 589 octets et extension Slots/Déblocages/Abonnés de 47 334 octets. Les **68 rubriques associées à la bible** restent en place. Ce complément poursuit leur réalisation ; il ne réécrit pas les sources utilisateur.

## 3. Où essayer les changements

Ouvrir [le menu de combat](../../../../modes/echos-de-la-greve/index.html), choisir **Entraînement**, puis **Parcours dirigé · 9 exercices** et **Le geste expose**. Le texte du dojo donne la commande de geste du profil courant. Avec le profil par défaut, les commandes locales sont **B pour J1**, **P pour J2**, **L3** sur une manette standard reconnue ou le bouton tactile correspondant. Les conditions du geste restent celles des duels locaux ; les moteurs Boss, le Duel originel et le salon privé gardent leurs périmètres précédents.

Pour comparer Mama, choisir sa tenue **Maintenance du viaduc** dans la sélection et déclencher le geste en Entraînement. Son casque, sa tenue et sa tablette restent ceux de cette variante. Dans [Silhouettes et horizons](../../../../modes/echos-de-la-greve/static-assets.html), filtrer sur **Death Stranding 2** puis ouvrir la carte de décharge du Maser Handgun.

## 4. Réception et preuves

La [synthèse de vérification](regression-verification.json) relie les résultats et leurs empreintes de source. Les preuves sont produites par les modules réels, avec leurs adaptateurs explicitement nommés.

| Domaine | Vérification | Preuve |
| --- | --- | --- |
| Présentation et simulation | 20 groupes ; 126 frontières de phase, six interruptions, sept replis de tenue, 548 états de replay et 3 240 états complets identiques à la base. | [Présentation logique](presentation-verification.json) |
| Dojo | 14 groupes et 53 parcours consignés ; neuf exercices, huit profils de combattant pour le geste, remappage, échecs réels, frontière du dernier contact et mine pendant le démarrage du léger. | [Exercices](lessons-verification.json) |
| Dossiers | 38 groupes, dont sept parcours du contrôleur en DOM simulé ; nouvelle leçon sans modification des quatre prérequis historiques. | [Progression](progression-verification.json) |
| Galerie | 18 groupes ; 66 cartes, 33 DS2, filtres, ouverture de la carte Maser et lien documentaire autorisé. | [Galerie](static-gallery-verification.json) |
| Commandes | 16 groupes ; profils, remappage et parcours des modes existants, avec entrées manette synthétiques. | [Commandes](commandes-verification.json) |
| Rendu natif | Images réellement décodées dans Canvas, poses en combat dans les deux sens, repli et mouvement réduit ; trois exercices rendus sur cinq captures. | [Présentation native](presentation-native.json), [dojo natif](lessons-native-verification.json) |
| Actifs et service | Copies natives, transparence, géométrie, conservation des actifs, présence des chemins et service HTTP avec contrôle des octets et types. | [Inventaire](inventory-verification.json), [HTTP](fidelity-http-verification.json) |

La comparaison de simulation et la régénération du catalogue vérifient que les valeurs des **30 attaques, des sept actions utilitaires et des profils IA** ne changent pas. Le catalogue porte simplement la nouvelle empreinte du fichier moteur après le changement de rendu. Les PNG sources restent natifs ; les WebP de `presentation-renders/` et `dojo-renders/` sont des captures de recette distinctes.

Les rendus Canvas ne rendent pas toute la mise en page HTML. Les parcours DOM sont simulés et les entrées de manette sont synthétiques. Chromium n’est pas disponible pour une réception graphique dans cet environnement ; aucun essai de navigateur, de manette physique ou de partie Internet n’est attribué à ces résultats.

## 5. Fidélité et manques conservés

L’audit de **Die-Hardman** a été élargi : le masque crânien est un écart, mais le costume de bureau des images actives demande aussi une correction. Le périmètre comprend onze poses actives, une fatalité, trois plans narratifs et trois poses de présentation envisagées. La première génération a été refusée par le contrôle automatique de sortie, sans image et sans motif détaillé. Les dix-huit corrections prévues restent donc non reçues ; leurs chemins ne sont pas inventés dans le runtime. [Audit](AUDIT_SOURCES.md) et [résultat de la tentative](diehardman-generation.json).

Une tentative distincte de **Higgs DS2 en pied**, documentée par des captures officielles et une statue sous licence qualifiée séparément, a également été refusée. Elle n’ajoute ni PNG, ni carte, ni kit. Le [manifeste statique](static-generation.json) sépare ce refus de la décharge Maser effectivement reçue. La mitrailleuse MP DS2 et le Strider, déjà refusés dans les lots antérieurs, n’ont pas été relancés.

Le [registre des manquants DS2](MANQUANTS_DS2.md) distingue les portraits des silhouettes complètes, les variantes de costumes, les équipements encore sans vue identifiée et les kits absents. Les équipes/assistances, duos, clashes et bonus des extensions gardent leurs fiches de conception sans être déclarés jouables. Les dessins intermédiaires, les sons et les asymétries lors du retournement restent également à traiter.

La fidélité 1:1 guide la comparaison avec une référence identifiable. Les nouvelles poses assurent une continuité avec les sources actives inspectées, mais celles-ci peuvent conserver des écarts historiques. Un concept, un produit sous licence, un portrait ou une adaptation du simulateur garde sa qualification. **Ce complément ne certifie pas une fidélité canonique exhaustive de toutes les images ni la réalisation de tous les systèmes de la bible.**

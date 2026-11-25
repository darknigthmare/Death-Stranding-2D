# Compendium des Boss — livraison du 25 novembre 2026

## Périmètre réalisé

Le manque `MOVESET:boss-current` reçoit un catalogue propre à `StrandBoss` : **six rencontres, huit motifs ennemis et 30 actions du joueur**, dont six commandes communes et 24 signatures. Les chiffres du duel ne sont pas importés. Le catalogue décrit les PV par difficulté et par vague, les annonces, les phases d’attaque et de récupération, les volumes de collision, les projectiles, les défenses, les repères et les conditions de succès ou d’échec.

Le [document de référence](../../BOSS_ET_RENCONTRES.md) et le [JSON structuré](../../data/boss-et-rencontres.json) sont produits par le même [extracteur](../../../../outils/generer_catalogue_boss.cjs). Son [helper](../../../../outils/lib/boss-engine.cjs) ajoute un accès aux constantes et fonctions dans une copie du moteur en mémoire. Aucun hook n’est ajouté au jeu.

Le compendium utilise [boss-data.js](../../../../modes/echos-de-la-greve/boss-data.js), [boss-guide.js](../../../../modes/echos-de-la-greve/boss-guide.js) et [boss-guide.css](../../../../modes/echos-de-la-greve/boss-guide.css). `StrandBossGuide.render({ boss, context, p1, difficulty })` renvoie des sections HTML natives `<details>`, sans écouteur ni sauvegarde. Les contextes admis sont `boss`, `bossrush` et `campaign`. Le joueur peut comparer les six rencontres et ouvrir les huit kits sans modifier la sélection du jeu. Les trois surfaces sont raccordées à la sélection Boss, à la série et au briefing de chapitre. La [preuve UI](lessons-verification.json) couvre les vrais handlers de l’application : sélection Camion avec Fragile/Vétéran, série créée puis reprise avec son combattant sauvegardé, et briefings Convoi/Baleine depuis des fixtures explicites de progression.

## Décisions de présentation

Les dégâts sont présentés avec leur base, la puissance du combattant et les deux états de cible : blindage normal ou noyau exposé. Le scan MULE est traité séparément : son exposition s’applique avant sa propre mêlée. Une salve ou une charge ne promet pas que tous ses projectiles toucheront.

Les délais indiquent la première exécution, la suppression de l’action et le premier démarrage suivant. Ils ne sont pas renommés en durée active ou récupération du duel. Les effets retardés et les marqueurs conservent leurs durées propres. Les mêmes noms de techniques ne masquent pas les différences : pas de sceau de Die-Hardman, pas de battement renforçant Heartman, pas d’échange de côté de la parade de Sam, et Appui devient Colis dans les deux rencontres de camions.

Le Camion isolé et le Convoi sont décrits séparément. Le premier libère deux colis après sa destruction. Le second fait venir un autre camion au bout de 180 pas, indépendamment de la première livraison ; ses tirs bas et ses charges peuvent endommager directement le dépôt. La conservation des ressources entre vagues est distincte des recharges naturelles qui continuent pendant ce délai.

La section de contexte distingue Boss Battle, Boss Rush et la campagne. Boss Rush garde les PV exacts et ajoute 20 après chaque victoire, dans la limite de 120 ; énergie et garde repartent à 100 au Boss suivant. Une défaite termine la série. La campagne repart au début du chapitre et utilise une rencontre isolée, sans lire ni écrire les deux sauvegardes Boss.

## Modification du moteur

Deux messages de prise de colis faisaient encore référence à la touche `T`, devenue incorrecte après le remappage des commandes. Ils indiquent maintenant « commande Colis ». La recette compare `boss.js` à la base `8d274a015e0edf314a853630031d5eb507354811` et exige que ces deux substitutions soient les seules différences. **Aucun paramètre, contrôle de collision, ordre de simulation ou schéma de sauvegarde n’est modifié.**

SHA-256 du moteur relu et exécuté : `59eaab71a30a97663c4d9d8cd087e5022ffccc2e2dbe817dd468c341a43ae806`.

## Vérification exécutée

La [recette ciblée](boss-compendium-verification.json), produite par [qa/boss-compendium.cjs](../../../../modes/echos-de-la-greve/qa/boss-compendium.cjs), passe **14 groupes** sous Node 24.22.3 dans le Sandbox de remplacement. Le JSON conserve l’heure d’exécution et les empreintes de chaque source.

| Contrôle compté | Cas passés |
|---|---:|
| Profils de PV, difficulté et vague | 21 |
| Durées d’annonce par difficulté et phase | 36 |
| Motifs ennemis, deux phases | 16 |
| Timings des actions et exécution unique | 30 |
| Variantes de repère ou de caisse | 5 |
| Démarrages publics : huit kits × six rencontres | 48 |
| Chemins d’actions/variantes × six rencontres | 210 |
| Défenses et tolérance de côté | 98 |
| Puissance, blindage et exposition | 288 |
| Coûts, directions inversées et prérequis | 53 |
| Rendus HTML : six rencontres × trois contextes | 18 |

Les autres assertions vérifient les rectangles de collision, le dernier pas des projectiles, la priorité de la dernière action sur le temps, la prise/livraison des colis, les 180 pas entre vagues, l’absence de remise à zéro des ressources, les dégâts propres au dépôt du Convoi, les reprises et l’absence d’accès aux sauvegardes Boss pendant une rencontre isolée. Le soin de série est vérifié avec une vitalité fractionnaire préparée pour distinguer la conservation exacte d’un arrondi d’affichage.

La première exécution avait révélé une erreur dans une fixture : à 75 unités à droite du premier colis, le second colis se trouvait exactement sous le joueur. Le test du seuil exclusif a été placé 75 unités à gauche, hors de portée de l’autre colis. Seule la fixture a changé ; la règle du moteur reste identique.

Les fonctions de simulation sont réelles. Les états de départ des cas unitaires, le Canvas, les images et le stockage de l’hôte sont simulés. Les 48 démarrages passent par `StrandBoss.start`. Les transitions de résultats de série utilisent des résultats préparés : elles ne sont pas présentées comme six victoires jouées. Le HTML du guide est inspecté sans navigateur. La [recette UI séparée](lessons-verification.json) vérifie les handlers réels, avec DOM et Canvas simulés. Ses briefings Boss de campagne utilisent des fixtures de progression et ne sont pas présentés comme des victoires de campagne.

```sh
node outils/generer_catalogue_boss.cjs
node modes/echos-de-la-greve/qa/boss-compendium.cjs docs/combat/production/20261125-extension/boss-compendium-verification.json
```

## Relecture croisée

Une seconde lecture par un agent distinct a confronté les fiches au moteur portant l’empreinte ci-dessus. Elle n’a relevé aucun écart concret dans le périmètre garde/contre, exposition remplaçant le blindage, rupture de 90 pas, deux colis du Camion, un colis par vague du Convoi, conservation des ressources et dégâts directs au dépôt. Elle a aussi confirmé que la portée de la recette reste limitée à des fonctions réelles exécutées avec des états et un hôte préparés. Cette lecture n’ajoute pas de séance de jeu ou de test matériel.

## Limites conservées

Cette livraison n’ajoute aucun nouveau Boss, kit, projectile dessiné, animation ou réglage d’équilibrage. Elle ne certifie pas les meilleures stratégies ni l’équilibre des 48 confrontations. La disponibilité d’une action et un contact préparé ne garantissent pas son contact contre une cible mobile. La revue ne revendique ni rendu de pixels, ni navigateur installé, ni manette physique, ni séance de jeu humaine. Les statistiques décrivent l’adaptation du projet et ne sont pas des données canoniques officielles.

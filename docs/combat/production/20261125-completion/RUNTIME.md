# Décor statique, trois arènes et rencontres isolées

**Échos de la Grève · lot de complétion du 25 novembre 2026**

Ce lot ajoute un profil de décor statique distinct des effets réduits, trois lieux jouables de plus et un point d’entrée Boss isolé pour la campagne du simulateur. Il relie aussi les vingt-quatre illustrations narratives complémentaires aux scènes originales. Les règles physiques du duel, la ligne de sol **y = 588**, les huit combattants et les règles des six rencontres Boss sont conservés.

**Recette visuelle :** les trois lieux ont été rendus et revus dans les cadrages droite et gauche. Le sol des Dunes a fait l’objet d’une reprise ciblée : sa bordure supérieure sombre prolonge désormais le plan intermédiaire, sans la bande claire observée dans la première version. Les rapports et les captures utilisent ce PNG définitif.

## Un réglage de décor indépendant

Le bouton **Décor statique** de l’interface principale et le sélecteur **Décor · Animé / Statique** du salon privé partagent la préférence `echos.v1.staticScenery`. Elle vaut `false` par défaut et ne reprend pas implicitement la valeur d’**Effets réduits**. Le choix est transmis au duel, à Boss Battle, à Boss Rush, à la campagne et aux replays qui utilisent ces moteurs.

| Préférences | Décor | Combat |
|---|---|---|
| Animé, effets complets | Parallaxe normale, météo et boucles décoratives actives | Animations et signaux usuels |
| Animé, effets réduits | Parallaxe à 20 % ; météo et boucles décoratives supprimées | Réduction des secousses selon le réglage existant |
| Statique, effets complets | Composition, parallaxe, météo et boucles de fond figées à l’instant d’activation | Combattants, projectiles, impacts, marqueurs, annonces et chronomètre continuent |
| Statique, effets réduits | Composition immobile selon le profil réduit | Même simulation, avec les effets de combat réduits existants |

Le profil statique concerne l’image du décor. Le volume et les ambiances sonores conservent leurs commandes propres. Il ne constitue pas une pause du match.

### Contrat des moteurs

`StrandFight.start` et `StrandBoss.start` acceptent `staticScenery: true`. Les deux moteurs exposent `setStaticScenery(boolean)` et indiquent la préférence dans leur `snapshot()` de présentation.

L’activation capture la composition courante ; un deuxième appel avec `true` ne déplace pas le cadre figé. Le retour à `false` rend au décor l’horloge et le cadrage courants du combat. Le gel est stocké hors des champs de simulation : il ne fait partie ni du checkpoint de duel, ni de celui du Boss, ni des événements d’un replay.

Le rollback par checkpoint conserve ce choix local. Lorsqu’une commande réseau trop ancienne impose une reconstruction complète du duel, `netplay.js` transmet `preserveStaticScenery: true` au redémarrage silencieux : le cadrage déjà figé est conservé pendant la resimulation. Une nouvelle partie ordinaire reçoit sa propre composition.

Le sélecteur reste utilisable pendant un duel privé. Si une touche de mouvement est déjà tenue lorsque ce contrôle reçoit le focus, son relâchement est transmis au moteur, y compris après un changement de touche modificatrice. Les champs de saisie continuent d’exclure les nouvelles commandes de combat. Ce cas de mouvement bloqué a été reproduit puis corrigé dans la recette réseau simulée.

Sources : [fight.js](../../../../modes/echos-de-la-greve/fight.js), [boss.js](../../../../modes/echos-de-la-greve/boss.js), [netplay.js](../../../../modes/echos-de-la-greve/netplay.js), [app.js](../../../../modes/echos-de-la-greve/app.js).

## Trois lieux supplémentaires

Les douze lieux initiaux, les quatre lieux du lot Univers et les trois ajouts portent le catalogue à **19 lieux, 20 configurations et 100 plans de décor**. Le camp MULE garde sa variante météorologique ; le roster reste composé de huit combattants.

| Identifiant | Intitulé | Panorama |
|---|---|---|
| `plate-gate-ds2` | Plate Gate · colonnes suspendues | Réemploi de `assets/static-universe-20261125/plate-gate-ds2-panorama.png` |
| `sandstorm-ds2` | Lisière urbaine · tempête de sable | Réemploi de `assets/static-universe-20261125/sandstorm-ds2-panorama.png` |
| `dunes-ds2` | Dunes sous le vent | Nouveau `assets/static-completion-20261125/dunes-ds2-panorama.png` |

Chaque lieu possède cinq PNG natifs de **1672 × 941** sous `assets/stages/{identifiant}-{sky,distant,midground,floor,foreground}.png`. Les panoramas existants ne sont pas dupliqués. Le ciel et les quatre plans avec alpha gardent leurs pixels source ; les dimensions de dessin sont calculées avec une échelle uniforme.

| Arène | Ligne source du sol → y588 | Plan intermédiaire → y594 | Plan lointain → y598 |
|---|---|---|---|
| Plate Gate | `471 / 941` | Ancre `1` | Ancre `1` |
| Tempête de sable | `458 / 941` | Ancre `1` | Ancre `1` |
| Dunes | `435 / 941` | Ancre `1` | Ancre `1` |

Les nombres 594 et 598 sont des bases de composition derrière le sol ; ils ne déplacent pas le sol physique. La mesure des supports est détaillée dans le [relevé natif](stage-source-measurements.json). Certaines sources de la tempête et le sol des Dunes ont un alpha maximal de 254. Elles sont conservées ainsi ; les vingt-quatre composites finaux ont un alpha minimal de 255 grâce aux plans situés derrière.

Les trois lieux sont accessibles par les sélections communes, y compris Entraînement, Versus, Boss Battle et le salon privé. Leurs profils sonores réemploient le synthétiseur existant ; le catalogue possède désormais vingt profils distincts. Le sable, les colonnes, les véhicules et la tempête n’ajoutent ni dommage automatique ni collision de décor. Les itinéraires de Boss Rush restent ceux de ses rencontres.

Sources : [content.js](../../../../modes/echos-de-la-greve/content.js), [assets.js](../../../../modes/echos-de-la-greve/assets.js).

## Boss de campagne et sauvegardes séparées

`StrandBoss.start({isolated: true, ...})` lance une rencontre dont la sauvegarde appartient à l’appelant. Ce mode n’effectue aucune lecture ou écriture des clés `echos.boss.v1` et `echos.boss-rush.v1`. Les checkpoints périodiques, la pause, la victoire, la défaite et l’arrêt ne créent pas de record Boss Battle ou de résultat de série Rush.

Le `snapshot()` et le résultat renvoyé par `onEnd` portent `isolated: true` et `saved: null`. Cette valeur ne signale pas un échec de stockage : le moteur n’a pas tenté de sauvegarder la rencontre. L’interface de campagne affiche l’état de sa propre sauvegarde.

`checkpoint()` et `validCheckpoint()` restent disponibles pour un appelant qui souhaite conserver explicitement un état de rencontre. La campagne livrée choisit une reprise **au début du chapitre interrompu**, au moyen de sa propre clé ; elle ne prétend pas reprendre un Boss en plein combat. `isolated: true` et `rush: true` sont incompatibles : la combinaison est rejetée avant d’altérer la session courante.

Une sortie habituelle par `stop()` continue de sauvegarder Boss Battle ou Boss Rush selon leurs règles. Le point d’entrée isolé ne sauvegarde pas une session qu’il remplace directement. Les choix de campagne ne peuvent donc pas écraser un checkpoint extérieur à son parcours.

La recette exécute les deux rencontres réelles de la campagne : **Die-Hardman contre le convoi sur la ferme** et **Sam contre la baleine sur la Grève**. Elle couvre la collecte/livraison des colis, les deux vagues, les victoires par entrées, la défaite par inaction, une reprise explicite de checkpoint et la conservation exacte des octets des autres sauvegardes. Le [rapport Boss](boss-verification.json) conserve également la recette de Boss Battle et de la série Rush.

## Images des routes existantes

`assets.storyFrames[id]` contient les suites ordonnées d’illustrations de chacun des huit combattants : **trois plans d’introduction, un plan de rivalité, deux plans de conclusion**, soit **48 entrées**. Les vingt-quatre originaux restent premiers dans leur suite ; les vingt-quatre nouveaux PNG vivent sous `assets/story-completion-20261125/`.

Les légendes des nouveaux plans proviennent des [briefs narratifs](story-completion-briefs.json). Les titres de route, textes des scènes, rivalités et noms de finalité de match ne sont pas remplacés. L’alias historique du rival de Sam et la scène de rivalité PNG de Die-Hardman gardent leur chemin d’origine. Le carrousel manuel et le parcours de campagne sont vérifiés dans la [recette d’interface](campaign-qa.json).

## Preuves et portée

| Contrôle | Preuve |
|---|---|
| Parité du duel | **1 440 checkpoints statique/animé** et **1 440 comparaisons avec main** : huit combattants, vingt configurations, neuf séquences d’entrées. Le checkpoint complet inclut le générateur de simulation, les ressources, les actions et le cadrage calculé par la simulation. |
| Parité des Boss | **432 checkpoints statique/animé** et **432 comparaisons avec main** : six rencontres, huit combattants, neuf séquences d’entrées. |
| Pixels du décor | Le [rapport statique](static-scenery-verification.json) exécute le vrai rendu de vingt arènes dans `@napi-rs/canvas`. Des points d’accès réservés au test exposent les fonctions existantes sans modifier leur corps. Les empreintes des pixels du fond restent identiques en statique, tandis que les dessins des combattants changent. Quatre scènes Boss vérifient aussi le compte à rebours visuel des annonces. |
| Activation et réseau | Gel sans saut de composition, appels répétés, reprise des animations, rollback et reconstruction complète du salon vérifiés séparément. Les préférences d’interface sont exercées dans des DOM simulés. |
| Géométrie des trois arènes | [24 cas natifs](stage-renders/validation.json) : trois lieux × deux modes × effets complets/réduits × déplacements droite/gauche. Ordre des plans, ratios, ancrage, couverture, raccord, premier plan et panorama de secours. |
| Sélection des arènes | [Catalogue et interface](stages-verification.json) : vingt configurations, neuf lancements réels de moteur via les vrais gestionnaires de menu, dix-huit chemins PNG des trois arènes et 288 checkpoints comparatifs. Le DOM est simulé. |
| Ambiances | [Vingt profils](ambiances-verification.log), commandes de volume, suspension, arrêt, réduction d’effets et reprise réseau. Le graphe Web Audio est simulé ; le journal ne certifie pas une écoute sur un appareil. |
| Distribution | [Journal HTTP](http-verification.log) produit par un serveur local réel ; routes de campagne, galerie, décors et suites narratives comparées aux fichiers locaux avec et sans préfixe. |

La référence de simulation est le commit `c3fa7ead88f1667b80202a44dca6549784021866`. Les moteurs précédents et courants reçoivent les **mêmes données de catalogue actuelles**, afin d’isoler les changements de moteur ; cela ne suppose pas que les trois nouveaux lieux existaient dans l’ancien commit.

Ces preuves distinguent le rendu natif, les hôtes DOM/Web Audio simulés et le serveur HTTP réel. Elles ne constituent pas une session de navigateur, une écoute sur matériel réel ou une validation multijoueur sur Internet. Les captures ne certifient pas une reproduction canonique image par image. Les rapports et images du lot précédent restent inchangés.

## Reproduction

Depuis la racine du dépôt, avec `@napi-rs/canvas` disponible et l’objet Git de référence présent dans le clone :

```sh
node modes/echos-de-la-greve/qa/stage-source-measurements-20261125.cjs --stages=plate-gate-ds2,sandstorm-ds2,dunes-ds2 --output=docs/combat/production/20261125-completion/stage-source-measurements.json
ARENA_SCREENSHOTS=docs/combat/production/20261125-completion/stage-renders node modes/echos-de-la-greve/qa/arenes-canvas.cjs --stages=plate-gate-ds2,sandstorm-ds2,dunes-ds2
STATIC_SCENERY_SCREENSHOTS=docs/combat/production/20261125-completion/static-renders node modes/echos-de-la-greve/qa/static-scenery.cjs --output=docs/combat/production/20261125-completion/static-scenery-verification.json
node modes/echos-de-la-greve/qa/stages-universe-20261125.cjs --completion --output=docs/combat/production/20261125-completion/stages-verification.json
node modes/echos-de-la-greve/qa/boss.cjs docs/combat/production/20261125-completion/boss-verification.json
node modes/echos-de-la-greve/qa/ambiances.cjs
node modes/echos-de-la-greve/qa/reseau-logique.cjs
```

# Boss Rush · Les six grandes rencontres

**Échos de la Grève · 25 novembre 2026**

Le mode Boss Rush enchaîne les six rencontres déjà présentes dans Boss Battle. Il dispose d’une entrée de menu, d’une sélection de combattant et de difficulté, d’une reprise en cours de rencontre ou entre deux rencontres, d’un bilan de série et de records séparés. Il réutilise le moteur et les images de boss existants ; il ne demande aucune nouvelle animation.

Cette livraison répond aux objectifs **EDG-G11** (boss et Boss Rush), **EDG-G12** (modes) et **EDG-G24** (progression et sauvegarde) de la [bible de combat](../../BIBLE_COMBAT.md). Les règles ci-dessous sont celles du module livré, indépendamment des cibles de conception du duel.

## Règles de la série

| Point | Règle implémentée |
|---|---|
| Joueur | Solo local, avec l’un des huit combattants existants. |
| Choix conservés | Combattant, tenue et difficulté restent identiques pendant toute la série. Modifier les choix du menu prépare une nouvelle série ; la reprise conserve les choix sauvegardés. |
| Difficulté | Débutant (`easy`), Porteur (`normal`) ou Vétéran (`hard`), appliquée au moteur de chaque rencontre. |
| Ordre | Fixe : Catcher léonin, Catcher aquatique, baleine de goudron, géant de goudron, camion MULE, convoi MULE. |
| Arènes | Chaque rencontre emploie son lieu conseillé. Le choix libre d’arène reste dans Boss Battle. |
| Vie | 120 PV au début. À chaque victoire : `PV suivants = min(120, PV restants + 20)`. La récupération est appliquée une seule fois, lors du résultat. Le bilan affiche la vitalité après cette récupération. |
| Énergie et garde | Elles reviennent chacune à 100 au début de la rencontre suivante. Une reprise en plein combat conserve leurs valeurs au checkpoint. |
| Autres états | Projectiles, marqueurs, effets temporaires, objets de fret et intégrité du dépôt sont propres à chaque rencontre. Ils repartent de leur état initial à l’étape suivante. Une reprise conserve leur état courant. |
| Chronomètre | Chaque rencontre reçoit sa durée existante. Le temps cumulé additionne ses pas de simulation actifs ; les introductions, pauses et interludes en sont exclus. |
| Victoire | Six rencontres gagnées. Le convoi reste une rencontre comportant deux vagues, avec son objectif de livraison. |
| Échec | Perte de vie, temps écoulé ou cargaison perdue termine la série. « Recommencer la série » repart au premier boss avec 120 PV. |
| Interlude | Le résultat d’une victoire présente la récupération réellement obtenue et le boss suivant. Le joueur choisit quand poursuivre. |
| Score et records | Somme des scores des rencontres. Une série achevée par victoire ou défaite compte une tentative ; seuls les six succès complets incrémentent les victoires et améliorent les records de score/temps. Les records sont séparés par combattant et difficulté. |
| Compatibilité | Le mode ne passe pas par le relais de duel, les replays de duel ou le tournoi. Les affrontements indépendants restent accessibles dans Boss Battle. |

### Ordre et lieux

| Étape | Rencontre | Arène | Durée initiale |
|---:|---|---|---:|
| 1 | Catcher léonin | Bassin de goudron (`tar-basin`) | 150 s |
| 2 | Catcher aquatique | Grève (`shore`) | 160 s |
| 3 | Baleine de goudron | Bassin de goudron (`tar-basin`) | 180 s |
| 4 | Géant de goudron | Grève (`shore`) | 200 s |
| 5 | Camion MULE | Camp MULE sec (`mule-camp-dry`) | 180 s |
| 6 | Convoi MULE, deux vagues | Camp MULE (`mule-camp`) | 240 s |

Les durées, attaques, signaux d’annonce, contre-mesures, immunités et objectifs de livraison proviennent des rencontres existantes. Le module Rush règle leur succession et la conservation de vie.

## Sauvegarde et reprise

Le moteur [boss.js](../../../../modes/echos-de-la-greve/boss.js) expose `StrandBoss.rush` : création d’une série, lancement/reprise, progression, totaux et validation. La clé `echos.boss-rush.v1` conserve le schéma 1, la règle `boss-rush-20261125-v1` et la version de simulation `boss-20261124-v1`. Le checkpoint et les records de Boss Battle gardent leur clé `echos.boss.v1`.

Une série est soit prête pour la prochaine rencontre (`ready`), en cours (`active`), gagnée (`won`) ou perdue (`lost`). L’état actif contient le checkpoint complet de la rencontre. L’état entre deux rencontres contient la vie après récupération et les résultats déjà acquis. Un état terminé ne peut plus lancer une rencontre ; il faut créer une nouvelle série.

L’écriture intervient au lancement, toutes les 180 frames actives, à la pause, à une sortie normale et au résultat. La reprise utilise le dernier état enregistré. Les identifiants, l’ordre, les résultats, les bornes de ressources, le lien entre série et checkpoint ainsi que les versions sont vérifiés avant de reprendre. Une série invalide ou incompatible n’est pas lancée. Un refus de stockage conserve la série en mémoire pour la session et affiche cette limite pendant le combat et au résultat.

Les boutons de [app.js](../../../../modes/echos-de-la-greve/app.js) commandent le moteur Boss existant, avec les mêmes commandes clavier/tactiles et la même gestion de pause. La progression de série est implémentée dans `boss.js` et `app.js` ; les règles du duel restent inchangées.

## Vérifications et portée de la preuve

Le [rapport de vérification](boss-rush-verification.json) est produit par [qa/boss.cjs](../../../../modes/echos-de-la-greve/qa/boss.cjs), à partir des fichiers locaux réellement exécutés. Il enregistre leurs empreintes Git de contenu. Son hôte Node simule le DOM, Canvas et Image : il ne constitue pas une validation visuelle dans un navigateur natif.

Les scénarios ajoutés exécutent une série complète avec **Sam, difficulté Porteur**, pilotée par les entrées du moteur, sans modifier artificiellement les PV ni les checkpoints pour obtenir les victoires. Ils vérifient les objectifs de fret, la récupération plafonnée, sept rechargements dont un en plein combat, l’absence de soin à la reprise, l’indépendance des sauvegardes, le cumul des records, la défaite et le redémarrage, l’application de la difficulté, les données invalides et le refus de stockage. Les clés héritées de JavaScript (`toString`, `constructor`, `__proto__`) sont rejetées comme identifiants sauvegardés, et les nouvelles parties normalisent un identifiant ou une tenue inconnus vers des choix valides.

| Rencontre | PV au départ | PV après victoire | PV après récupération |
|---|---:|---:|---:|
| Catcher léonin | 120 | 92 | 112 |
| Catcher aquatique | 112 | 106 | 120 |
| Baleine de goudron | 120 | 78 | 98 |
| Géant de goudron | 98 | 90 | 110 |
| Camion MULE | 110 | 96 | 116 |
| Convoi MULE | 116 | 88 | 108 |

Un second parcours utilise le module d’interface réel : règles, lancement, clavier, pause/sortie, reprise après changement des choix de nouvelle série, six victoires, interludes, bilan final, nouvelle tentative, défaite et retour à Versus. Les contrôles précédents de Boss Battle restent exécutés, dont les huit combattants et leurs signatures directionnelles. Cela ne démontre pas l’équilibrage de toutes les combinaisons de combattant et difficulté dans une série complète.

### Distribution HTTP des galeries

La même livraison corrige [netplay-server.cjs](../../../../modes/echos-de-la-greve/netplay-server.cjs) : les quatre fichiers `static-assets.*` et les dossiers `assets/static-20261125` / `assets/static-universe-20261125` sont maintenant autorisés. Les PNG de ces dossiers participent à l’empreinte du serveur. Les sources, liens symboliques et traversées restent exclus.

[qa/reseau-logique.cjs](../../../../modes/echos-de-la-greve/qa/reseau-logique.cjs) ouvre un vrai serveur local sur un port éphémère. Il suit le catalogue courant et compare les réponses HTTP aux fichiers locaux, avec et sans préfixe `/modes/echos-de-la-greve/`, tout en contrôlant les types MIME. Le portrait de Lockne est explicitement couvert. Le [journal HTTP](http-verification.log) donne le nombre d’images du catalogue effectivement testé à son exécution ; il ne certifie pas le rendu visuel des PNG.

## Reproduction

Depuis la racine du dépôt :

```sh
node modes/echos-de-la-greve/qa/boss.cjs docs/combat/production/20261125-universe/boss-rush-verification.json
node modes/echos-de-la-greve/qa/reseau-logique.cjs
```

Le contenu de production antérieur demeure documenté par les rapports datés du 24 et du 25 novembre. Ce module ajoute une règle de série et son interface ; les nouvelles images statiques de l’univers ont leur propre manifeste.

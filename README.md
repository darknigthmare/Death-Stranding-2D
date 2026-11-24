# Death Stranding 2D

Téléchargez le dépôt et extrayez-le, puis ouvrez [JOUER.html](JOUER.html) dans un navigateur. L’écran titre propose la campagne **La Ligne silencieuse** et le mode de combat **Échos de la Grève**. Conservez le dossier `campagne/catalogue/` pour que la campagne charge ses cinq lots de données.

## Échos de la Grève

Les huit combattants jouables sont Sam, Fragile, Higgs, Cliff, le porteur MULE, Die-Hardman, Mama et Heartman. Les huit histoires comprennent chacune trois duels et trois scènes illustrées. Arcade, Versus, Boss Battle, Tournoi, Entraînement et Défis sont accessibles depuis le même accueil. Le mode fonctionne aussi directement depuis [le menu de combat](modes/echos-de-la-greve/index.html).

Pour essayer le MULE et sa caisse, ouvrez **Entraînement**, choisissez **MULE**, puis **Camp des MULEs**. **H** balaie la piste avec le capteur. Vers l’adversaire + **H** dépose la caisse. Un coup fort à proximité la pousse. En direction opposée + **H**, le MULE rappelle la caisse le long du sol. Le menu **Commandes** donne les touches de chaque joueur. **Retour à la campagne** ramène à l’écran titre.

Versus et Entraînement proposent douze lieux, dont **Port Knot City** et **l’Incinérateur de la région Est**, et une variante **Camp des MULEs · temps sec**, chacun avec un aperçu et cinq plans de décor indépendants. Les nouveaux tournois utilisent aussi ces décors. Les tableaux sauvegardés dans la première version retrouvent leurs arènes d’origine. [Rendus historiques des arènes](docs/combat/apercus/stage-extension-20261119/) · [Variante sèche, ambiances et Duel originel](docs/combat/production/AMBIANCES_VARIANTE_MULE_20261119.md)

Chaque arène possède un fond sonore et des sons de décor localisés. Le curseur **Ambiance du décor**, dans la sélection, les commandes et la pause, règle leur volume séparément des techniques. Le bouton **Son** coupe tout. Le salon privé reprend ces préférences.

En **Tournoi**, **Revoir le duel** relance un match joué depuis le tableau sauvegardé. Au dojo, sélectionnez **Enregistrer J2**, puis **Lire en boucle** pour travailler une réponse. Dans **Défis**, enchaînez sept adversaires en Survie ou gagnez **Livraison sous pression** en gardant le scellé intact.

### Affronter les boss

**Boss Battle** ouvre six rencontres : Catcher léonin, Catcher aquatique, baleine, géant, camion MULE et convoi MULE. Choisissez l’un des huit combattants, la difficulté et l’arène. Les attaques sont annoncées avant l’impact. Après avoir immobilisé un camion, récupérez sa cargaison avec **T** et livrez-la au dépôt gauche ; le convoi comporte deux vagues. Le menu **Commandes** donne les techniques du combattant. Les résultats et la reprise sont sauvegardés séparément des campagnes.

La reprise du 24 novembre réunit **113 images natives** de personnages, tenues, projectiles, boss, décors et récit. Elle comprend Mama Atelier et Viaduc, les images principales de Heartman et Die-Hardman, ainsi que les onze images de Higgs avec son masque crânien corrigé. Les [Archives de Bridges](modes/echos-de-la-greve/archives.html) présentent Deadman, Amelie et Bridget.

[Galerie des 113 images](docs/combat/production/20261124-suite/index.html) · [État d’intégration, vérifications et fidélité restant à établir](docs/combat/production/20261124-suite/SUITE_MANQUANTS_20261124.md) · [Règles de Boss Battle](docs/combat/production/20261124-suite/BOSS_BATTLE_20261124.md)

### Jouer à deux dans un salon privé

L’hôte lance le relais depuis la racine du projet avec Node.js 18 ou ultérieur.

```sh
node modes/echos-de-la-greve/netplay-server.cjs
```

Sur ce poste, ouvrir `http://127.0.0.1:8080/netplay.html`, créer le salon et copier son invitation. Pour jouer depuis deux machines, la page **Salon privé en réseau** explique comment rendre le relais accessible sur le réseau local et utiliser l’adresse de l’hôte. Chaque joueur choisit son combattant et se déclare prêt. L’hôte choisit l’arène et lance le duel.

Le [Duel originel](modes/echos-de-la-greve/duel-originel/index.html) propose le duel direct Sam/Higgs et l’entraînement dans six décors : la Grève, le centre de distribution, le camp MULE, l’abri Timefall, le champ de bataille et le bassin de goudron. Le choix du décor est mémorisé pour la revanche. Ses deux récits restent sur la Grève, et ses commandes sont affichées sur l’écran de combat.

- [Bible du mode de combat et fonctions jouables](docs/combat/BIBLE_COMBAT.md)
- [Conception du duel entre Sam et Higgs](docs/combat/DUELS_SAM_HIGGS.md)

### Raccorder un autre export v0.58

Depuis la racine du dépôt, cette commande ajoute l’entrée d’Échos de la Grève à une nouvelle copie de votre export. Gardez le fichier HTML généré au même niveau que le dossier `modes/`.

```sh
python3 outils/integrer_duels.py "/chemin/vers/export-v0.58.html" --sortie Mon_export_avec_combat.html
```

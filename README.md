# Death Stranding 2D

Téléchargez le dépôt et extrayez-le, puis ouvrez [JOUER.html](JOUER.html) dans un navigateur. L’écran titre propose la campagne **La Ligne silencieuse** et le mode de combat **Échos de la Grève**. Conservez le dossier `campagne/catalogue/` pour que la campagne charge ses cinq lots de données.

## Échos de la Grève

On peut aussi lancer [le menu de combat](modes/echos-de-la-greve/index.html) directement. Sam, Fragile, Higgs et Cliff sont jouables en Histoire, Arcade, Versus, Tournoi et Entraînement. Le menu **Commandes** présente les touches des deux joueurs et le coût chiral des techniques. En solo, utilisez Q/D ou A/D pour marcher, Z ou W pour sauter et H pour la signature. Le bouton **Retour à la campagne** ramène à l’écran titre.

Le [Duel originel](modes/echos-de-la-greve/duel-originel/index.html) conserve le prototype Sam/Higgs, son duel direct et ses deux récits. Ses commandes sont affichées sur l’écran de combat.

- [Bible du mode de combat et fonctions jouables](docs/combat/BIBLE_COMBAT.md)
- [Conception du duel entre Sam et Higgs](docs/combat/DUELS_SAM_HIGGS.md)

### Raccorder un autre export v0.58

Depuis la racine du dépôt, cette commande ajoute l’entrée d’Échos de la Grève à une nouvelle copie de votre export. Gardez le fichier HTML généré au même niveau que le dossier `modes/`.

```sh
python3 outils/integrer_duels.py "/chemin/vers/export-v0.58.html" --sortie Mon_export_avec_combat.html
```

# Les six lieux du Duel originel — 19 novembre 2026

Ces vues proviennent du vrai `scene.js` et du moteur historique, rendus par Canvas
natif en 1120 × 630, avec une ligne de sol à 528. Les médias et les ancres viennent
du registre commun au mode principal.

| Lieu | Vers la gauche | Vers la droite |
|---|---|---|
| La Grève | [Vue gauche](shore-left.webp) | [Vue droite](shore-right.webp) |
| Centre de distribution | [Vue gauche](terminal-left.webp) | [Vue droite](terminal-right.webp) |
| Camp des MULEs | [Vue gauche](mule-camp-left.webp) | [Vue droite](mule-camp-right.webp) |
| Abri Timefall | [Vue gauche](timefall-shelter-left.webp) | [Vue droite](timefall-shelter-right.webp) |
| Champ de bataille | [Vue gauche](battlefield-left.webp) | [Vue droite](battlefield-right.webp) |
| Bassin de goudron | [Vue gauche](tar-basin-left.webp) | [Vue droite](tar-basin-right.webp) |

La recette contrôle 48 cas de rendu : les deux directions, les positions extrêmes
de l’arène et le mouvement normal ou réduit. Une fixture DOM exécute les vrais
gestionnaires d’interface pour vérifier 12 parcours sélection → duel → revanche,
les deux récits sur la Grève, les commandes d’entraînement, la pause, le reset et
la sauvegarde distincte du prototype.

[Résultats et empreintes des sources](validation.json) ·
[Bilan du lot](../../production/AMBIANCES_VARIANTE_MULE_20261119.md).

Le HUD HTML et le layout des menus ne figurent pas dans ces captures Canvas.
La disposition CSS, le focus natif, la capture tactile du navigateur et le son
audible restent à vérifier dans un navigateur disponible.

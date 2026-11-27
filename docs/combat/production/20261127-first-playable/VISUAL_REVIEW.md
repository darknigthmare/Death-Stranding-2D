# Revue visuelle — premier contenu original jouable

**27 novembre 2026.** Cette revue porte sur des captures de l’application et sur la composition des nouvelles images natives. La réception binaire et les recettes de mécanique restent séparées : voir [VERIFICATION.md](VERIFICATION.md).

## Images de jeu reçues

Les 48 PNG sont conservés dans leur forme native : trente images de Balise, douze du Consignateur et six objets. Les deux directions sont dessinées séparément. La revue compare les tenues et accessoires aux références originales déjà reçues.

Les deux planches de Balise montrent ses quinze poses dans chaque orientation. La bobine reste sur son côté anatomique gauche ; la tenue graphite et orange, le harnais, les mousquetons et les proportions restent cohérents. Les pieds sont alignés par les mesures de source. La pose de saut est employée pendant la montée et la descente ; la pose de chute représente le personnage au sol.

Le Consignateur reste de taille humaine, avec bouclier, perche, cargaison et antenne. Les six états sont cadrés dans les deux directions. Les trois phases, l’agenouillement et la reddition montrent des appuis cohérents avec le sol de la Digue. Aucun halo gris ni liseré rouge parasite n’a été observé sur ces compositions alpha.

## Corrections vérifiées

| Point | Correction | Preuve |
| --- | --- | --- |
| Prolongement du lien | La corde du moteur part de l’extrémité déjà peinte, selon le crop et l’orientation. La matière grise avec marques rouges remplace la diagonale orange qui partait du bassin. | [Traction](native-renders/balise-tether.webp), [planche gauche](native-renders/balise-poses-left.webp), [planche droite](native-renders/balise-poses-right.webp) |
| Pose d’ancre | L’attache correspond à l’anneau tenu ; la main, l’objet et son appui restent cohérents. | [Ancrage](native-renders/balise-anchor.webp) |
| Sortie non létale | L’agenouillement attend l’interaction ; les mains levées marquent la reddition. La bannière finale confirme le registre restitué et le passage rouvert. | [Attente d’interaction](native-renders/consignateur-kneel.webp), [reddition](native-renders/consignateur-surrender.webp) |
| Pause mobile | Le panneau commence en haut sur petite surface, avec défilement interne et retour au début lors d’une nouvelle ouverture. Les captures montrent le titre entier et, après défilement, les boutons de reprise et de sortie. | [Haut du panneau Boss](browser-renders/consignateur-mobile-pause-top.webp), [bas du panneau Boss](browser-renders/consignateur-mobile-pause-bottom.webp), [jeu mobile](browser-renders/balise-mobile-browser.webp) |

Les attaches de corde sont propres à chaque pose et à chaque direction. Les prolongements qui reviendraient derrière la boucle native pendant la rétraction ou au bord de l’arène sont supprimés. Les images sources n’ont pas été retouchées et la correction ne change pas les coûts, collisions ou timings.

## Origine et portée de la revue

La revue indépendante du Consignateur a examiné la planche directionnelle et les captures de phases ; elle a identifié l’annonce finale restée en attente de reddition. La capture corrigée a ensuite été examinée à nouveau.

La revue indépendante de Balise a fourni les points d’attache dans les PNG, puis vérifié les quatre captures corrigées du [run 46009213399](https://github.com/darknigthmare/Death-Stranding-2D/actions/runs/46009213399/job/140541612623). Aucun défaut visuel bloquant n’a été observé sur ce jeu de captures.

Les captures finales de navigateur du [run 46011533537](https://github.com/darknigthmare/Death-Stranding-2D/actions/runs/46011533537) ont été examinées après correction du panneau de pause. Le titre est visible au début ; les contrôles de reprise et de sortie sont lisibles après défilement. Les captures du combat mobile sont prises avant la pause. Les douze empreintes de captures natives de ce run sont identiques à celles de la revue précédente : le correctif d’interface ne modifie ni les poses ni leur composition en jeu.

Une relecture croisée des dossiers BILAN, BALISE, CONSIGNATEUR et de l’état courant de la bible d’extension a confirmé les comptes, les périmètres de modes et la distinction entre livré et restant.

Le Canvas natif conserve le rapport des PNG et du panorama. Dans le navigateur, les règles `aspect-ratio: 16/9` et `object-fit: contain` maintiennent le rapport du bitmap même lorsque la hauteur disponible limite la boîte du canvas.

Cette revue fixe vérifie l’identité, les orientations, les équipements, les appuis, les raccords visibles et les panneaux indiqués. Elle ne valide pas toutes les distances de combat, les transitions en mouvement, les cycles encore absents ni l’équilibrage humain. Les contre-mesures, bords et interruptions relèvent des recettes de simulation complémentaires.

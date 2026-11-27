# Vérification navigateur — lancement bloqué

**27 novembre 2026. Statut : bloqué avant ouverture des pages.** Une seule tentative de lancement de Chromium a été effectuée avec Playwright. Aucun contrôle de mise en page ou d'interaction navigateur n'a pu être exécuté, et aucune capture navigateur n'a été produite.

Le détail machine, les paramètres et les journaux du processus sont conservés dans [browser-verification.json](browser-verification.json).

## Cause observée

Le fichier lanceur `/usr/bin/chromium` existe. Il tente d'exécuter `/usr/lib/chromium/chromium`, dont l'absence a été confirmée par lecture du système de fichiers. Le processus termine avec le code **127**. Le message déterminant est :

```text
/usr/bin/chromium: 153: exec: /usr/lib/chromium/chromium: not found
```

Playwright remonte ensuite `Target page, context or browser has been closed`. Un avertissement du script lanceur concernant un opérateur de comparaison apparaît également dans les journaux, mais le binaire attendu est bien absent.

L'appel de lancement échoue en **68 ms**, avant sa limite de 60 secondes. Le profil et les fichiers temporaires avaient été dirigés vers le volume disponible :

| Paramètre | Valeur de l'essai |
| --- | --- |
| Exécutable demandé | `/usr/bin/chromium` |
| Mode | Headless |
| Délai maximal de lancement | 60 000 ms |
| `TMPDIR` | `/home/agent/ds2d-browser-tmp` |
| Profil Chromium | `/home/agent/ds2d-browser-tmp/original-browser-profile` |
| Arguments explicitement ajoutés | `--no-sandbox`, `--disable-dev-shm-usage` |
| Nombre de tentatives | 1 |
| Relance ou escalade | Aucune |

Déplacer ces fichiers temporaires ne résout pas l'absence de l'exécutable cible. Aucun paquet n'a été installé, aucun autre navigateur n'a été essayé et aucun réglage du jeu n'a été modifié pour contourner ce blocage.

## Portée qui reste à réceptionner dans un navigateur

La recette préparée dans [original-browser.cjs](../../../../modes/echos-de-la-greve/qa/original-browser.cjs) prévoit les contrôles ci-dessous. **Ils n'ont pas été exécutés lors de cette tentative.**

- `extension.html` à 1280 × 900 et à 390 × 844 : dix cartes initiales, 147 fiches, 70 visuels, recherche de la Serre, filtre des stages, ouverture et fermeture du dossier, retour du focus et absence de débordement horizontal.
- `teams.html` aux mêmes largeurs : quatre sélecteurs de membres, deux modes, 44 arènes et lancement du mode 2 contre 2.
- Boutons réels d'appui, de relais, de pause, de reprise, de sauvegarde et de retour à la composition.
- Captures des deux pages, des dossiers et du combat, puis inspection des dispositions bureau et mobile.

La présence de ce scénario dans le script ne constitue donc pas une preuve de réussite. Le rapport indique explicitement `browser: false`, zéro page ouverte, zéro contrôle de layout, zéro contrôle d'interaction et zéro capture.

## Preuves disponibles pour cette livraison

| Preuve existante | Ce qu'elle établit |
| --- | --- |
| [stage-native.json](stage-native.json) et [STAGES_REVIEW.md](STAGES_REVIEW.md) | Rendu du vrai moteur dans Canvas natif : vingt arènes, cent cas, ancrages, couverture et captures à 1280 × 720. |
| [catalogue-verification.json](catalogue-verification.json) | Comptes et comportements du catalogue via un adaptateur DOM ; aucune réception de son CSS par Chromium. |
| [delivery-verification.json](delivery-verification.json) | Intégrité des ressources et réponses HTTP du serveur local. |
| [teams-native.json](../20261127-team-gameplay/teams-native.json) | Rendu du mode équipe dans le moteur avec Canvas natif. |

Ces preuves restent utilisables dans leurs périmètres respectifs. La mise en page des pages réelles et leurs interactions dans Chromium demeurent **non réceptionnées**. Aucun succès navigateur, appareil mobile matériel ou manette physique n'est revendiqué.

# Boss Battle — Échos de la Grève

Date : 24 novembre 2026. Statut : mode implémenté, simulation et intégration du menu vérifiées en JavaScript hébergé. Le présent lot n’a pas reçu de validation dans un navigateur ni de nouvelle recette Canvas native.

## Périmètre livré

Le menu des Échos donne accès à une sélection dédiée de six rencontres. Les huit combattants du catalogue sont sélectionnables : Sam, Fragile, Higgs, Cliff, MULE, Die-Hardman, Mama et Heartman. Le choix de tenue existant et les treize configurations d’arènes du catalogue restent accessibles. Chaque rencontre propose un lieu conseillé ; le joueur peut en choisir un autre.

Le mode possède son moteur, son horloge, ses objectifs et sa sauvegarde. L’application dirige les commandes vers ce moteur pendant Boss Battle, puis vers le moteur de duel quand le joueur revient à Versus. Il n’utilise pas la sauvegarde de la campagne et ne modifie pas ses rencontres. Le lien « Archives de Bridges » ouvre la page de soutien distincte ; les portraits de cette page ne sont pas présentés comme des combattants.

## Rencontres et règles

Valeurs de difficulté **Porteur** :

| Rencontre | Vitalité du boss | Temps | Objectif et attaques |
| --- | ---: | ---: | --- |
| Catcher léonin | 280 | 150 s | Charge, anneau au sol, bond ciblé. Vaincre le Catcher. |
| Catcher aquatique | 300 | 160 s | Colonnes de goudron, salves d’orbes, anneau au sol. Vaincre le Catcher. |
| Baleine de goudron | 340 | 180 s | Orbes, jets et surgissement ; immersion et changement de côté entre les séquences. |
| Géant de goudron | 400 | 200 s | Frappes annoncées, anneaux et orbes ; quitter la zone avant l’impact. |
| Camion MULE | 240 | 180 s | Tirs et charge. Immobiliser le camion puis livrer **deux colis** au dépôt gauche. |
| Convoi MULE | 190, puis 213 | 240 s | Deux camions, un colis chacun. Le second arrive trois secondes après la destruction du premier. Livrer les deux colis et conserver l’intégrité du dépôt. |

Les boss passent à une seconde intensité d’attaque à la moitié de leur vitalité. Les attaques comportent une annonce, une période active et une récupération. Les zones marquées et les consignes décrivent les réponses attendues : sortir de la zone, sauter ou garder. Les tirs bas demandent bas + garde. Les orbes peuvent être gardées ; la consigne du calmar ne promet pas de passage accroupi sous les orbes.

La difficulté Débutant multiplie la vitalité des boss par 0,82 et leurs dégâts par 0,7 ; Vétéran utilise 1,2 et 1,25. Le joueur débute avec 120 points de vitalité et 100 points d’énergie. La garde dispose d’une jauge propre. Les signatures et la charge chirale consomment l’énergie, qui se recharge. Les fenêtres de contre sont distinctes de la garde normale.

Vaincre un camion fait apparaître sa cargaison : ce n’est pas encore une victoire. T saisit le colis proche, le pose ou le dépose quand le porteur se tient dans la zone gauche. Porter un colis ralentit les déplacements. Dans le convoi, les tirs bas et les charges peuvent atteindre le dépôt ; un impact subi en transportant un colis réduit aussi son intégrité. Une intégrité nulle, une vitalité nulle ou un temps épuisé termine la tentative en défaite.

L’écran de bilan affiche la victoire ou la cause de défaite, le temps joué, la vitalité, le score, les dégâts, les impacts gardés ou contrés, et les objectifs de cargaison lorsqu’ils existent. La revanche remet le combat à neuf en conservant le combattant, la difficulté et l’arène choisis.

## Commandes

Boss Battle est un mode solo et utilise les commandes de J1. Les boutons tactiles exécutent les mêmes actions.

| Action | Touche |
| --- | --- |
| Gauche / droite | Q ou A / D |
| Saut / accroupissement | Z ou W / S |
| Coup léger / lourd | F / G |
| Signature | H |
| Garde | R |
| Prendre, poser ou livrer un colis ; frappe d’appui hors cargaison | T |
| Charge chirale, coût 70 | Y |
| Pause | Échap |

H seul, H + direction vers l’adversaire et H + direction opposée déclenchent les trois signatures propres au combattant. Les noms et indications restent accessibles dans le panneau Commandes. Les effets sont adaptés aux grandes cibles : les boss ne subissent pas la projection ou le soulèvement des duels.

| Combattant | Neutre | Avant | Arrière |
| --- | --- | --- | --- |
| Sam | Bola | Préparation au contre | Préparation au contre |
| Fragile | Déplacement offensif | Frappe à l’ombrelle | Balise de retour |
| Higgs | Jet de goudron | Mine de goudron | Faux départ |
| Cliff | Salve | Poste | Rappel du poste |
| MULE | Scan | Caisse | Récupération de caisse |
| Die-Hardman | Ordre de contre | Portique | Relève |
| Mama | Ancre | Tablier | Treuil vers l’ancre |
| Heartman | Impulsion | Mémoire | Syncope |

Les actions qui consomment un repère vérifient sa présence. Un repère sur le point d’expirer reste vivant jusqu’au déclenchement d’une action déjà acceptée. La direction du personnage reste celle capturée au début de l’action jusqu’à sa fin, ce qui maintient la cohérence entre pose, frappe et émission de projectile même en traversant la position d’un boss immergé.

Ouvrir Commandes suspend une rencontre active. Fermer le panneau reprend la rencontre si elle n’était pas déjà en pause. Une perte de focus la suspend. Relâcher, annuler ou perdre la capture d’un bouton tactile libère l’action correspondante.

## Sauvegarde et reprise

La clé locale est `echos.boss.v1`, avec la version de règles `boss-20261124-v1`. Elle contient :

- le checkpoint de la rencontre en cours ;
- les tentatives, victoires, meilleur score et meilleur temps, par combattant, rencontre et difficulté ;
- les douze derniers bilans.

La sauvegarde intervient toutes les 180 mises à jour de simulation, ainsi qu’à la pause et à la sortie. La reprise conserve l’attaque en cours, les positions, les temps, les vagues et la cargaison ; les touches maintenues ne sont pas restaurées. Les checkpoints malformés ou incompatibles sont rejetés.

Si le stockage refuse l’écriture, l’interface le signale et conserve une reprise dans la session courante. Cette solution ne prétend pas survivre à la fermeture de la page. Une victoire ou une défaite efface le checkpoint. Une nouvelle tentative repart de l’état initial.

Deux régressions de reprise découvertes en revue sont couvertes : le contre qui détruit un camion pendant sa charge conserve un timer nul et ses colis ; le Scan MULE à la limite droite produit un effet cosmétique hors écran sans invalider la sauvegarde. Le validateur vérifie également les champs numériques consommés et la présence des repères avant un rappel, un treuil ou une récupération.

## Fichiers et géométrie

Le point d’entrée est `modes/echos-de-la-greve/index.html`. Les modules ajoutés sont `boss.js` et `boss-assets.js`. L’application et les styles intègrent la sélection, les commandes, la pause, le bilan et les cartes de boss.

Le catalogue de boss référence quatorze PNG : trois poses pour le lion, le calmar, la baleine et le géant, puis deux états du camion. Il utilise aussi quatre effets : orbe de goudron, colonne de goudron, anneau chiral et tir MULE. Le convoi réutilise le camion et les colis.

`boss-geometry-20261124.js` fournit les crops et les ancres mesurés. Le rendu utilise `drawImage` sur les pixels sources, avec un facteur identique en largeur et en hauteur. Les poses de boss sont orientées nativement vers la gauche ; les effets vers la droite. La direction de combat applique un miroir horizontal lorsqu’il est nécessaire. Les images sources ne sont pas étirées ni recopiées pour fabriquer les variantes.

Les poses des huit porteurs utilisent le catalogue commun et `asset-geometry-20261124.js`. Les tenues héritées conservent leur géométrie propre. Une image absente ou en cours de chargement utilise le dessin de secours ; sa disponibilité ne change pas la simulation.

La pose et la hauteur du corps sont résolues explicitement. Pendant l’annonce ou l’attaque penchée du géant, sa zone de réception des tirs mesure 266 px de haut, à l’intérieur de sa silhouette affichée d’environ 294 px. Elle reprend la hauteur debout dans les autres poses. Cette règle appartient à la simulation et fonctionne même si aucun PNG n’est disponible. Le test vérifie qu’un tir centré à y = 250, de hauteur 32 px, passe au-dessus ; un tir dans le buste touche.

Les colliders demeurent des formes de jeu lisibles. Ce lot ne constitue pas une certification de concordance pixel par pixel avec une référence officielle, ni une animation image par image de chaque mouvement.

## Vérification fraîche de cette version

Les sources ont été récupérées et reconstruites en mémoire après l’indisponibilité de l’environnement local. Les anciens résultats Canvas natifs ne sont pas utilisés comme preuve pour cette reconstruction.

Le [rapport JSON de la recette](boss-simulation-report.json) contient les SHA Git exacts des sources exécutées, les dépendances et les limites de la méthode. La recette emploie le vrai moteur Boss et le vrai `app.js`, avec une horloge, un stockage, un objet Image, un Canvas et un DOM simulés. Le moteur de duel est remplacé par un double uniquement pour vérifier que les routes du menu et des commandes lui reviennent après Boss Battle.

Résultat sur les dépendances finales du lot :

- **17 sections de vérification réussies** ;
- **6 victoires** obtenues par pressions et relâchements des commandes, sans fixer les points de vie du boss ;
- **1 550 checkpoints atteints** pendant ces parcours ;
- **116 chemins d’images** employés par les appels de dessin du vrai moteur ;
- les **14 poses de boss** et les **4 effets** effectivement demandés au rendu ;
- les huit porteurs, leurs poses de déplacement et leurs 24 signatures ;
- la collecte réelle, les deux vagues, les défaites, les reprises, la pause et la revanche ;
- les cas limites identifiés en revue : contre, Scan, marqueurs, orientation et corps penché du géant.

Les fixtures de fin de temps, d’intégrité minimale, de contre à un point de vie et de tir à une hauteur donnée sont identifiées comme des cas limites. Elles ne sont pas comptées comme des victoires obtenues par le pilote.

Une revue indépendante a rejoué onze contrôles ciblés sur le moteur final `90dc2ef7e1d1884370c845274a1e9e6cf0dc5a81` et confirmé les corrections correspondantes.

Pour relancer la recette depuis la racine du dépôt :

```sh
node modes/echos-de-la-greve/qa/boss.cjs docs/combat/production/20261124-suite/boss-local-report.json
```

Le lanceur utilise le module de 97 dimensions natives `qa/native-image-dimensions-20261124.cjs`. Les sources héritées qui n’y figurent pas emploient des dimensions de substitution explicites dans le simulateur. Le lanceur est compilé, mais n’a pas été exécuté sous Node dans cette session ; le même noyau de recette a été exécuté en JavaScript hébergé.

Cette vérification contrôle la simulation, les chemins de rendu, les bornes des crops, les facteurs d’échelle et les événements du menu. **Elle ne décode pas les pixels, ne produit pas de composition Canvas native et ne valide pas la mise en page d’un navigateur.** Une revue visuelle en scène reste nécessaire pour certifier le placement optique et la lisibilité sur les tailles d’écran réelles.

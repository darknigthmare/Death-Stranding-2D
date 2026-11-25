# Revue indépendante — complément univers et campagne

**Un défaut concret trouvé et corrigé ; aucun autre défaut bloquant relevé
dans le périmètre relu.** La preuve structurée, les empreintes des sources et
les six captures inspectées figurent dans
[independent-code-review.json](independent-code-review.json).

## Correctif : libération des commandes du salon privé

Le filtre clavier de `netplay.js` excluait les champs de formulaire à la fois
sur `keydown` et `keyup`. Pendant un duel, le joueur pouvait maintenir D,
donner le focus au sélecteur **Décor**, puis relâcher D : l’événement de
libération était ignoré et la direction restait tenue. Le même effet était
possible si un modificateur était ajouté avant le relâchement.

Après coordination avec le responsable moteur/réseau, le handler a été
corrigé pour libérer une action déjà tenue sur `keyup`, quel que soit le
champ ayant ensuite reçu le focus. Les champs et combinaisons avec
modificateur restent exclus de `keydown`, afin que leur utilisation ne
démarre pas une commande de combat.

Le scénario a été ajouté à `qa/ambiances.cjs` et exécuté avant correction :
le test observait `[true]` au lieu de `[true, false]` dans les commandes
envoyées. Après correction, il passe, ainsi que le relâchement avec Ctrl et
l’absence de commande quand D est saisi directement dans le sélecteur.

```sh
node modes/echos-de-la-greve/qa/ambiances.cjs --network-only
```

Cette option exécute le contrôle de l’interface réseau sans relancer tous
les contrôles audio. Elle couvre aussi la persistance des préférences,
la reconstruction sans checkpoint, la suspension audio, la reconnexion et
la rediffusion. Le responsable moteur a ensuite confirmé le passage de
la recette complète.

## Autres points relus

| Domaine | Conclusion de la lecture du code |
|---|---|
| Décor statique des duels | Le temps, la caméra et la phase retenus appartiennent à la présentation. Les checkpoints et les horloges de combat continuent. La météo, les détails ambiants, les plans et le premier plan utilisent le même cadrage retenu. Les secousses des acteurs sont appliquées après le décor. |
| Décor statique des grandes rencontres | La caméra du décor est retenue séparément. Les combattants, boss, projectiles, zones annoncées et HUD continuent à se dessiner avec l’état courant. |
| Reconstruction réseau | La préférence locale est retransmise lors d’un redémarrage silencieux. `preserveStaticScenery` retient également la composition, sans ajouter de champ de préférence au checkpoint partagé. |
| Boss isolé | Le chemin de persistance et le résultat évitent les sauvegardes autonomes et rendent `saved: null`. Le remplacement direct d’une session n’écrit pas son état précédent. Le mélange isolé / Rush est rejeté avant remplacement. |
| Carrousel des routes | Image et légende changent sur place ; région d’annonce et défilement restent stables. Les limites, les commandes actives, les flèches, la galerie et la progression sont cohérentes avec la QA de campagne. |
| Galerie fixe | Filtres œuvre / catégorie combinés, variantes qualifiées, liens documentaires limités aux trois fichiers prévus, téléchargement original, nettoyage du dialogue et retour de focus visible. |
| Relais HTTP et version | Les nouveaux modules et dossiers d’images sont autorisés. L’inventaire récursif servi est aussi celui de l’empreinte du salon. La version d’un ancien client est refusée. |

Un contrôle HTTP ciblé a obtenu **17 réponses exactes avec statut 200** et
**deux refus 404 attendus**. Il vérifie les modules de campagne et de galerie,
une nouvelle base DS2 et le sol Dunes avec et sans préfixe du mode, puis les
trois documents autorisés. Les octets renvoyés correspondent aux fichiers
locaux. Un document de production non autorisé et une tentative de traversée
restent inaccessibles. Une demande de salon avec une version obsolète reçoit
le refus 409 prévu.

Les documents sont servis comme Markdown lisible (`text/plain`) par ce
relais ; leurs fragments ne constituent pas une navigation HTML vers les
titres. Après livraison des 24 nouveaux plans narratifs, le contrôle final
`campaign.cjs --require-assets` a réussi : `assetsComplete: true`,
55 chemins d’images contrôlés et aucun fichier absent. La dernière relecture
produit a également confirmé les neuf modes, les galeries séparées et
la sauvegarde du chapitre ; la pause de campagne est désormais défilable
sur toute la fenêtre des petits écrans, avec focus sur Reprendre et retour
sur Pause. Ces derniers changements passent la recette finale de campagne.

## Second regard sur les trois arènes DS2

Les captures du vrai rendu Canvas ont été examinées dans les deux positions
de caméra, sans modifier les PNG ni les captures.

| Arène | Observations |
|---|---|
| Plate Gate | Sol continu, bottes dégagées, silhouettes distinctes et HUD lisible. Les piliers suspendus restent en arrière-plan. |
| Tempête de sable | Piste lisible sans couture colorée nette à la ligne des pieds. Le front de sable et les bâtiments restent derrière les combattants. |
| Dunes, sol v2 | La bande claire dure à la ligne des pieds a disparu. Le sable sombre prolonge le plan intermédiaire ; bottes, silhouettes et HUD restent lisibles. |

Ce second regard ne remplace pas les mesures géométriques du chantier moteur.
Il ne constitue pas non plus une vérification de mise en page en navigateur.
Les six captures examinées sont identifiées par chemin et SHA-256 dans le
JSON associé.

## Modifications de cette revue

- `modes/echos-de-la-greve/netplay.js` : libération d’une touche déjà tenue après changement de focus ou de modificateur.
- `modes/echos-de-la-greve/qa/ambiances.cjs` : reproduction avant/après et option de contrôle réseau ciblé.

Aucun changement supplémentaire des moteurs, des images ou des sauvegardes.
Aucun stage, commit ou push effectué dans cette revue.

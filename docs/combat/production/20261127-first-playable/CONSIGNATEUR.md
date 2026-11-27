# Le Consignateur — première rencontre originale jouable

Date : 27 novembre 2026  
Identifiant de catalogue : `ldm-boss-consignateur`  
Titre de mission : **Le péage des cargaisons**  
Arène : **Digue d’aval**, `ldm-stage-digue-aval`  
Statut fictionnel : création originale de l’extension fan **Les Lignes de Marée**.

## Ce lot rend jouable une rencontre, avec trois phases

Le Consignateur est un humain robuste, équipé pour la rétention et la manutention des cargaisons. Il garde les colis par peur de les perdre, au détriment de leurs destinataires. L’objectif consiste à rouvrir le passage, désamorcer son péage et restituer son registre. Sa barre mesure sa **garde**, de 300 à 0. La rencontre se termine par une reddition au lien.

Ce lot apporte **un boss original jouable sur les vingt conçus dans le catalogue**, sous réserve de réception et de validation de ses images. Ses trois phases et ses six états de pose, chacun dessiné dans les deux orientations, ne constituent pas des boss supplémentaires. Les six rencontres historiques du moteur restent présentes. Le menu Boss Battle peut donc exposer sept rencontres lorsque le registre d’art original complet est chargé ; le Boss Rush reste limité à ses six rencontres historiques.

Les huit personnages canoniques du moteur Boss peuvent affronter cette rencontre. Balise n’est pas ajouté à ce moteur par ce lot : son intégration Duel ne prouve pas que ses trois signatures sont prises en charge ici.

## Contrat de jeu et progression

| Phase | Garde | Attaque | Annonce à 1× | Reprise à 1× | Objectif |
|---|---:|---|---:|---:|---|
| 1 | 300 → 198 | Poussée au bouclier | 60 images | 48 images | Sortir du couloir de poussée, puis punir le côté découvert. |
| 2 | 198 → 99 | Interception à la perche | 72 images | 42 images | Désamorcer les deux consoles de péage pendant ses reprises. |
| 3 | 99 → 0 | Retenue de passage | 90 images | 60 images | Restituer le registre pendant une reprise, faire tomber la garde, puis obtenir la reddition au lien. |

La simulation avance à 60 images par seconde. Les durées actives sont respectivement de 36, 24 et 30 images. Les vitesses de scénario 0,75× et 1,25× adaptent les annonces, les durées actives, les reprises et l’approche du Consignateur. Les commandes et les fenêtres des personnages joueurs conservent leurs règles du moteur Boss. Les valeurs du tableau correspondent à 1×.

Les trois difficultés conservent **300 points de garde** pour respecter la fiche du personnage. La difficulté conserve son effet habituel sur les dégâts reçus par le joueur. Aucun réglage de vitesse de cette rencontre ne change le Boss Rush ou ses classements.

### Les objectifs sont des conditions réelles

Un coup dépassant le premier seuil s’arrête à 198 et fait commencer la phase 2. Il ne traverse pas plusieurs phases. La garde s’arrête ensuite à 99 tant que les deux consoles ne sont pas désamorcées. Si les consoles sont désamorcées avant d’atteindre 99, les attaques restent nécessaires pour atteindre le seuil.

Les consoles se trouvent aux abscisses 360 et 1030. Il faut être au sol, à moins de 85 pixels de la console, pendant la phase de reprise du boss. La commande logique utilisée est `throw`, affichée comme **Prise / interaction**. Une tentative pendant l’annonce ou l’attaque explique pourquoi la console reste verrouillée. Chaque console conserve son état propre.

Au début de la phase 3, le registre est libéré à l’abscisse 685. Il se récupère au sol, à moins de 80 pixels, pendant une reprise. Tant qu’il n’est pas restitué, la garde ne peut pas passer sous 1. Le registre possède une intégrité initiale de 100 %. Une retenue de passage qui touche sa position au sol enlève 25 points ; le cadre de l’attaque rend cette menace visible. Une fois récupéré, il cesse d’être exposé.

À 0 de garde, le Consignateur s’agenouille. Le moteur ne déclare aucune victoire automatique. Le joueur doit approcher à moins de 100 pixels et utiliser **Prise / interaction**. La victoire exige simultanément les deux consoles désamorcées, le registre restitué et la garde à zéro. Le résultat porte le motif `surrender`, `nonLethal: true` et les objectifs effectivement accomplis.

### Attaques et réponses

Les positions de menace sont fixées au début de l’annonce. Un cadre au sol indique la zone utile ; un signal sonore accompagne l’annonce, l’impact et la reprise. Aucun verrouillage invisible sur une position future du joueur n’est ajouté.

La poussée couvre le trajet annoncé du bouclier. La perche frappe une zone basse devant le Consignateur. La retenue de passage frappe le cadre annoncé ; elle peut également menacer le registre encore au sol. Le joueur peut quitter ces zones. Le saut conserve ses conditions de hauteur et de moment d’exécution du moteur existant.

Les attaques pendant une reprise sont plus efficaces. Frapper du côté découvert du boss pendant cette reprise applique un coefficient de 1,45 ; une frappe devant lui applique 0,9. Hors reprise, sa garde réduit les attaques à 0,3, ou 0,8 pendant l’exposition produite par le scanner MULE. Ces coefficients se combinent avec la puissance du personnage existante. La direction des projectiles est prise en compte pour déterminer le côté de l’impact. Les coups ne prolongent pas indéfiniment une fenêtre de reprise.

Les signatures canoniques conservent leurs coûts, leurs annonces, leurs repères et leurs effets. Le Consignateur emploie le sens de garde non létale pour tous les dégâts qui lui sont appliqués.

## Échec, sauvegarde et reprise

Trois causes d’échec sont opérationnelles : vitalité du joueur à zéro, intégrité du registre à zéro, temps de mission écoulé. Le chrono de combat est de 300 secondes. Les intros ne consomment pas ce chrono.

Le début de chaque phase est enregistré avec la vitalité, l’énergie, la garde du joueur, sa position, son repère éventuel, les statistiques, la garde du Consignateur, les objectifs, la graine et le temps restant. Les consoles et la restitution du registre déclenchent également une sauvegarde du progrès courant. Le checkpoint normal conserve les temporisations d’attaque, les projectiles et les états transitoires, pour reprendre exactement une rencontre interrompue.

Après un échec, le checkpoint proposé repart du début de la phase perdue :

- phase 1 : garde 300, consoles actives, registre retenu ;
- phase 2 : garde 198, consoles actives, registre retenu ;
- phase 3 : garde 99, consoles désamorcées, registre au sol à 100 % d’intégrité.

Les ressources du joueur reviennent à leurs valeurs du début de cette phase. Il ne reçoit pas une réserve arbitraire de soins. Les statistiques et le chrono reprennent également leurs valeurs d’entrée de phase. Le compteur de tentatives enregistre l’échec une seule fois. Rejouer une phase ne crée pas à lui seul une tentative supplémentaire.

Le menu peut utiliser le checkpoint conservé après la page de résultat. L’API `StrandBoss.retry()` permet aussi une reprise immédiate tant que la session de résultat reste montée. Les deux indicateurs `result.retryAvailable` et `result.original.retryAvailable` reflètent la création d’un checkpoint réellement valide.

La limite de validation distingue le temps actif, limité à 18 000 images, du compteur total qui inclut les intros et les reprises. Ce dernier accepte jusqu’à 18 225 images pour cette rencontre. Le cas tardif « phase atteinte après l’image 18 000, puis défaite et reprise » a été ajouté aux recettes après une revue indépendante.

Le moteur ne lit ni ne modifie un inventaire principal de campagne. Une rencontre lancée avec `isolated:true` ne modifie pas les sauvegardes autonomes. Les checkpoints historiques restent compatibles ; le sous-état de mission original possède son propre schéma de version 1. Sans le module original actif, un checkpoint de cette rencontre n’est pas accepté comme une rencontre canonique.

## Intégration des modules

Ordre de chargement attendu :

1. `content.js` et `assets.js` ;
2. `extension-data.js`, `extension-assets.js`, `extension-runtime.js` pour la Digue ;
3. les ressources Boss historiques ;
4. `original-bosses-assets.js` ;
5. `original-bosses.js` ;
6. `boss.js`.

`original-bosses.js` publie `StrandOriginalBosses`, avec :

- `ready` : résultat du contrôle de présence des ressources déclarées ;
- `encounters` et `controllers` : registres actifs si l’art est complet ;
- `guide` : texte de rencontre, commandes logiques, trois phases et conditions de victoire/reprise ;
- `phases` : paramètres de référence du contrôleur.

La clé de rencontre est `ldm-boss-consignateur`. La clé de type et d’images est `consignateur`. L’interface peut résoudre la touche courante de `guide.commands[0].action === 'throw'`. Le moteur emploie le libellé de l’action ; il n’impose pas une touche physique dans ses consignes.

Le registre n’active pas cette rencontre tant que `StrandOriginalBossArt.ready` n’est pas strictement vrai et que les douze images directionnelles (six poses × gauche/droite), les trois objets et leurs géométries ne sont pas déclarés avec des cadrages valides.

### Contrat d’art

```js
window.StrandOriginalBossArt = {
  ready: true,
  directionalPoses: {
    consignateur: {
      // Chaque pose possède deux descripteurs mesurés complets :
      guard: {
        left: descriptorMesureGauche,
        right: descriptorMesureDroite
      }
      // Même structure pour shield-push, pole-strike, stagger,
      // kneel et surrender.
    }
  },
  props: {
    'console-active': '...',
    'console-inactive': '...',
    register: '...'
  },
  propGeometry: {
    // Cadrage et ancrage mesurés de chaque objet.
  }
};
```

Chaque descripteur directionnel contient le chemin de son PNG, son rectangle `crop`, son point d’ancrage, sa ligne de base, son orientation native et son facteur de hauteur. Les éventuels registres de compatibilité restent des détails du chargeur ; la sélection du Consignateur utilise les descripteurs directionnels complets.

Chaque pose existe dans deux orientations dessinées nativement. Le changement de direction sélectionne le PNG correspondant, sans inverser le bouclier et le bâton par une symétrie du rendu. La hauteur de référence debout est de 194 pixels dans le monde du jeu. Les poses agenouillées utilisent un facteur de hauteur de 0,65 dans le manifeste, à confirmer avec la scène de recette. Le boss agenouillé reste opaque : il est vivant. Les six états sont utilisés par la simulation et le rendu ; leurs douze images directionnelles ne sont pas présentées comme douze cycles d’animation complets.

Les consoles actives, les consoles désactivées et le registre possèdent des images distinctes. Les objets restent lisibles avec des libellés et des indicateurs de reprise. Le moteur dispose également de formes de repli explicites pendant un chargement d’image ; celles-ci ne suffisent pas à activer le registre de production.

Les PNG sources ne sont pas réécrits. Le rendu emploie leurs cadres alpha mesurés via `drawImage`.

Le manifeste `consignateur-art-generation.json` contient les douze PNG natifs RGBA de 1 254 × 1 254 pixels, leurs SHA de blob, prompts, orientations et facteurs de hauteur. Quatorze appels de génération ont produit ces douze images retenues : la garde a reçu une passe de cadrage et un premier agenouillement droit avec halo a été remplacé par une passe de détourage. Aucun miroir binaire, changement de palette ou réécriture alpha par script n’a servi à produire ces variantes. La réception des images est complète ; les métadonnées et la composition dans le navigateur restent à vérifier par la recette CI.

### Digue d’aval et ligne d’appui

Le moteur conserve son sol physique à `FLOOR = 588`. Le panorama de la Digue porte `legacy.floorY = 0.688`. Comme dans le moteur Duel, le rendu couvre la fenêtre en conservant le rapport largeur/hauteur et aligne cette ligne source sur le sol physique. Il ne dessine plus une bande de sol opaque par-dessus un panorama reçu sans couches séparées.

La recette de géométrie vérifie l’identité `imageY + imageHeight × 0.688 = 588` et le rapport d’aspect inchangé. Elle ne remplace pas une vérification de la scène raster réelle.

## Validation livrée

Commande prévue dans le dépôt :

```sh
node modes/echos-de-la-greve/qa/original-bosses.cjs
```

La recette évalue les vraies sources du moteur et du module. Ses points d’inspection sont injectés uniquement dans l’environnement de test ; aucun endpoint permettant d’imposer une victoire n’est ajouté à l’application.

La validation effectuée dans V8 a réussi sur les seize groupes de contrôles suivants :

| Couverture | Résultat |
|---|---:|
| Parcours complets par commandes publiques : 8 personnages × normal/difficile, puis les deux autres vitesses avec Sam | 18 victoires par reddition |
| Signatures canoniques exécutées avec leurs vraies durées d’amorçage | 24 cas |
| Annonce, attaque et reprise : 3 phases × 3 vitesses × présence/esquive | 18 cas |
| Checkpoints prélevés pendant les parcours publics | 822 états valides |
| Sauvegardes volontairement incohérentes | 15 refus |
| Transition tardive, échecs vitaux, du registre et du chrono, reprise et rechargement | Validés |
| Modules absents ou art incomplet, six rencontres historiques, Boss Rush inchangé | Validés |
| Alignement du sol et choix des six poses | Contrats de rendu validés |

Les parcours publics utilisent uniquement les actions exposées par le moteur pour déplacer, sauter, frapper et interagir. Ils ne modifient pas l’état ni le résultat de combat. Ils reposent surtout sur les attaques communes ; la couverture des vingt-quatre signatures provient des recettes distinctes, dont les situations initiales sont préparées et explicitement nommées.

Le parcours complet dure environ 44 à 51 secondes de simulation à vitesse normale pour le contrôleur de test. Ce résultat établit l’accessibilité mécanique du parcours ; il ne constitue pas une mesure du temps moyen d’un joueur humain ni une validation définitive de l’équilibrage.

La reprise déterministe a été comparée sur les trois phases. Une revue indépendante a également vérifié les conditions de victoire, la distance de reddition, les plafonds de dégâts, la restitution des objectifs à la reprise et la correction du compteur tardif.

### Limites de cette recette

Dans l’environnement V8 initial, les objets `Image` et le contexte Canvas sont des substituts explicites. Le contrat du registre d’art y utilise des géométries de fixture. Les tests vérifient le comportement réel du JavaScript, les choix de poses et les calculs de dessin, pas les pixels issus du navigateur. Le QA Node doit être rejoué avec le registre d’art reçu et le raccord directionnel final, puis complété par les captures du navigateur et les mesures des PNG avant certification visuelle. Les pixels colorés visibles sur certains bords dans l’aperçu de génération doivent être jugés dans une composition alpha réelle ; leur seule valeur RGB ne suffit pas à conclure à un défaut visible.

Le fichier `boss-data.js` historique contient une empreinte du moteur. Il doit être régénéré après toute modification de `boss.js`, puis la recette `qa/boss-compendium.cjs` doit être relancée. Son inspecteur historique ne charge pas les originaux : sa référence reste celle des six rencontres historiques. Le guide de cette rencontre vient de `StrandOriginalBosses.guide`.

L’intégrité du registre est exposée dans `result.original.objectiveFlags.freightIntegrity`. Le champ générique `cargo` reste celui des missions de camion historiques ; cette rencontre n’ajoute pas de colis à livrer dans ce système.

Aucun déblocage de campagne, récompense d’inventaire, ajout automatique au Boss Rush, nouvelle rencontre parmi les dix-neuf autres boss originaux, ou certification de fidélité globale 1:1 n’est revendiqué par ce lot. Le dossier et le résultat de rencontre existent ; les accès de campagne prévus par la bible restent un travail d’intégration distinct.

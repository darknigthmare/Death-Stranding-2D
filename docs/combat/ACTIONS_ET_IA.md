# Actions des huit kits et profils IA — moteur de duel

**25 novembre 2026 · règles actuelles de StrandFight, distinctes de la cible.**

[Catalogue JSON](data/actions-et-ia.json) · [Module consultable](../../modes/echos-de-la-greve/moves-data.js) · [Moteur](../../modes/echos-de-la-greve/fight.js) · [Guide, fiche C](references/Combat_Games_Guide_General_v1.0.txt).

Le catalogue couvre **30 attaques : six communes et 24 techniques**, plus six actions de mouvement, défense ou conclusion. Il décrit les duels et le dojo. Les grandes rencontres utilisent `boss.js` ; les mêmes noms n’y garantissent ni les mêmes timings ni les mêmes dégâts. Les paramètres chiffrés sont ceux du projet.

## Règles et convention de temps

- Duel actuel : 100 PV, équilibre 100, jauge chirale 42 au départ, 75 secondes. Les valeurs cibles de la bible restent séparées.
- Dégâts = arrondi(base × puissance du combattant). Aucune réduction progressive de combo ni bonus de contre-touche dédié dans ce moteur.
- Garde : aucun grattage de PV ; perte d’équilibre = base ×1,25, contre ×0,76 en touche. Blockstun au moins 9. Le côté de l’attaquant n’est pas un critère de blocage.
- Gain chiral en touche : attaquant +4 / défenseur +3 ; en garde +2 / +2. Recharge passive +0,025 par pas, ou +0,34 au dojo ; plafond 100.
- Rupture à équilibre ≤0 : au moins 38 pas de stun, garde et action interrompues, équilibre remis à 36. Recharge d’équilibre +0,28 au repos hors garde/action/stun, après le délai post-hit de 58 pas.
- Saisie mémorisée 9 ticks inclusifs à partir du tick suivant, une entrée par bouton. Direction du spécial et battement capturés à la pression ; Bas des normales lu à l’exécution. Le hitstop consomme la file d’entrée.
- Spéciales et projections refusées en l’air ; Léger/Lourd deviennent la frappe aérienne. Une annulation exige une touche confirmée, jamais une simple garde.
- Hurtbox : largeur 44, hauteur propre au kit ×0,62 accroupi ; rectangle au-dessus des pieds. Les contacts sont collectés avant le hitstun : des frappes simultanées peuvent échanger.
- La portée part du centre du combattant, pas du bord de son sprite. Un projectile avance avant son premier test de contact et peut toucher au dernier pas de sa durée.
- Les grandes rencontres exécutent boss.js, avec d’autres timings, dégâts et règles de défense ; ne pas leur appliquer cette table de duel.

**Convention.** S est le premier indice actif. Une action S/A/R est active de t=S à S+A−1, disparaît à S+A+R+1 et permet une nouvelle action sans annulation au pas suivant. R est nominal : il ne compte pas seul le délai complet de retour au contrôle. Le hitstop suspend les acteurs mais consomme la durée de la file. Une phase active peut seulement émettre un projectile dont la durée est indépendante.

**Avantage.** Les valeurs du JSON pour les mêlées comparent le premier prochain démarrage possible, sans annulation, rupture, interception, déplacement ou effet distant. Positif signifie que le défenseur reste immobilisé plus longtemps. Le premier et dernier contact actif sont séparés. Ce modèle dérivé a été confronté aux fonctions du moteur sur 34 contacts de la [recette ciblée](production/20261125-domains/moves-verification.json) ; un projectile ou une pose n’a pas de chiffre universel. Les valeurs cibles de la bible — 1 000 PV, Lien, réduction de combo, renforcées et ultimes — restent des concepts séparés.

## Six attaques communes

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Coup léger · Léger | 5 / 3 / 10 | 0 | 5 de base | 81 px depuis le centre ; bande verticale 39–112 au-dessus des pieds. | Garde debout ou accroupie. |
| Coup lourd · Lourd | 14 / 4 / 19 | 0 | 12 de base | 111 px ; bande 63–152. Avance de 12 px au pas 11, ou 6 pour Die-Hardman. | Garde debout ou accroupie. |
| Balayage · Bas + Léger | 8 / 4 / 16 | 0 | 7 de base | 110 px ; bande 3–44. | Garde accroupie uniquement. |
| Coup montant · Bas + Lourd | 12 / 4 / 22 | 0 | 10 de base | 78 px ; bande 12–124. | Garde debout ou accroupie. |
| Frappe aérienne · Léger ou Lourd en l’air | 7 / 6 / 15 | 0 | 8 de base | 94 px ; bande 6–105 relative aux pieds en l’air. | Garde debout uniquement. |
| Projection · Projection | 7 / 2 / 24 | 0 | 10 de base | 56 px ; bande 14–115. | Traverse la garde ; cible au sol, hors stun de touche et invulnérabilité. |

**MOVE:common:light.** Après touche confirmée et fin de l’activité → Lourd (ou montant si Bas) / Spécial Une seule touche par action. Après touche confirmée : annulation vers Lourd ou Spécial à la fin de l’activité.

**MOVE:common:heavy.** Après touche confirmée et fin de l’activité → Spécial Une seule touche. À t=14, pousse la caisse MULE immobile située de −12 à 111 px vers l’avant ; déplacement ultérieur de 112 px au plus.

**MOVE:common:sweep.** Après touche confirmée et fin de l’activité → Spécial Bas est lu au déclenchement effectif, pas mémorisé avec le bouton.

**MOVE:common:lift.** Après touche confirmée et fin de l’activité → Spécial Sur touche, vitesse verticale adverse de 7. Aucun plafond de relancement ou réduction de combo dédié dans ce moteur.

**MOVE:common:air.** Aucune annulation offensive dédiée. Léger et Lourd donnent la même frappe aérienne. Une seule touche ; atterrir ne crée pas de récupération distincte.

**MOVE:common:grab.** Aucune annulation offensive dédiée. Pas de déchope dédiée. Le blockstun n’est pas exclu par le test de prise. Inflige une frappe et du recul, sans transport automatique de la cible.

## Fiches des huit combattants

### Sam Porter Bridges · sam

DS1 / Director’s Cut ; hauteur 176, vitesse 4.4 par pas au sol, puissance 1. Attends que la cible s’engage, puis lance le bola pour interrompre son approche.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Bola de liaison · Spécial neutre | 16 / 1 / 23 | 28 | 10 de base | Origine +37, hauteur 87 ; vitesse 12 px/pas, durée 76, boîte 26×18. | Garde debout ou accroupie ; pas d’interception par contre de mêlée. |
| Reprise d’appui · Avant + Spécial | 8 / 6 / 18 | 14 | Aucun dégât direct | Contact de mêlée reçu pendant t=8–13. | Intercepte seulement Coup léger ; pas les projectiles, prises ou autres mêlées. |
| Parade au lien · Arrière + Spécial | 4 / 5 / 25 | 18 | Aucun dégât direct | Contact de mêlée reçu pendant t=4–8. | Intercepte les mêlées sauf Projection ; aucun projectile. |

**MOVE:sam:sam — Projectile de liaison.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Émission à t=16. La phase active nominale ne limite pas le vol ; un projectile déjà émis subsiste après interruption du porteur. Impact : base 10 PV, équilibre 17, stun 26, poussée 3.

**MOVE:sam:brace — Interception ciblée.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Une interception au maximum. Aucun dégât ou stun infligé à l’attaquant ; contact consommé, puis récupération de la défense.

**MOVE:sam:parry — Parade et changement de côté.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Échange les positions, réoriente les combattants et impose au moins 15 pas de stun à l’attaquant ; une interception, aucun dégât direct.

**IA présente.** Branche générique : approche, projectile neutre à distance, choix directionnels proches aux difficultés 1/2. Aucun diagnostic spécialisé de parade.

### Higgs Monaghan · higgs

DS1 / Director’s Cut ; hauteur 184, vitesse 4.05 par pas au sol, puissance 1.06. La marée s’ouvre à l’endroit où ton adversaire se trouvait au début du geste. Provoque un arrêt avant de l’appeler.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Marée noire · Spécial neutre | 25 / 5 / 20 | 28 | 14 de base | X adverse mémorisé à l’entrée, borné 48–1232 ; centre à 49 px du sol, boîte 86×102. | Garde debout ou accroupie ; pas de niveau bas malgré le visuel au sol. |
| Empreinte d’or · Avant + Spécial | 18 / 1 / 16 | 21 | 6 de base | Pose +55, bornée 48–1232 ; X ±22 ; de 23 px au-dessus du sol à 1 px au-dessous. | Garde accroupie uniquement. |
| Faux départ · Arrière + Spécial | 9 / 10 / 20 | 14 | Aucun dégât direct | 5,25 px de recul à chaque pas t=9–18 ; 52,5 px avant bornes et contacts de corps. | Aucun contact offensif ; aucune invulnérabilité dédiée. |

**MOVE:higgs:higgs — Zone à une position mémorisée.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Émission à t=25, durée 6. La zone vise l’ancienne position ; une seule touche au maximum. Impact : base 14 PV, équilibre 21, stun 23, poussée 6, lancement 6.

**MOVE:higgs:mine — Piège bas.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Pose à t=18, durée 150. Armement quand ttl ≤130, après 20 mises à jour. Un seul marqueur, remplacé par une nouvelle pose ; disparaît au contact. Impact : base 6 PV, équilibre 12, stun 15, poussée 5.

**MOVE:higgs:feint — Recul.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Le coût est payé même au bord. Origine conservée pour le dessin, sans retour automatique.

**IA présente.** À distance, peut poser une mine si aucun marqueur, sur un tirage conditionnel de 45 % ; sinon attaque neutre. Aucun placement optimal du piège calculé.

### Fragile · fragile

DS1 / Director’s Cut ; hauteur 166, vitesse 4.95 par pas au sol, puissance 0.94. Utilise ton saut de Grève pour fermer la distance pendant la récupération d’un coup adverse.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Pas de Grève · Spécial neutre | 12 / 4 / 18 | 28 | 13 de base | 85 px ; bande 21–139. À t=8 : avance au plus 158 px, jusqu’à 52 px de la position adverse mesurée. | Garde debout ou accroupie. |
| Éventail de pluie · Avant + Spécial | 11 / 4 / 20 | 18 | 9 de base | 114 px ; bande 118–217. | Garde debout ou accroupie si la zone touche ; aucun niveau overhead dédié. |
| Point de retour · Arrière + Spécial | 15 / 1 / 13 | 16 | Aucun dégât direct | Pose à la position du porteur ; retour au marqueur lors du nouvel usage. | Aucun contact offensif. |

**MOVE:fragile:fragile — Approche et frappe.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Invulnérabilité à t=6–10 inclus ; frappe à t=12–15. Aucun changement de côté garanti. Impact : base 13 PV, équilibre 18, stun 20, poussée 9.

**MOVE:fragile:fan — Frappe haute anti-saut.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Le volume peut passer au-dessus d’une petite cible accroupie. Sur touche : vitesse verticale adverse 5. Impact : base 9 PV, équilibre 14, stun 18, poussée 5, lancement 5.

**MOVE:fragile:beacon — Point de retour.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. À t=15, pose un marqueur pour 180 pas, ou le consomme pour revenir. Coût payé à chaque usage ; pas d’invulnérabilité dédiée dans le duel.

**IA présente.** Branche générique ; aucun planificateur propre de balise. Le déplacement neutre peut être choisi de trop loin pour atteindre immédiatement la cible.

### Clifford Unger · cliff

DS1 / Director’s Cut ; hauteur 179, vitesse 4.2 par pas au sol, puissance 1.03. Les deux échos de la salve passent à des hauteurs différentes. Garde une longueur d’avance.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Écho de section · Spécial neutre | 17 / 9 / 21 | 28 | 5 de base par trait, jusqu’à deux traits | Origine +36 ; hauteurs 97 puis 53 ; vitesse 13, durée 62 par trait, boîte 26×18. | Garde debout ou accroupie pour les deux traits. |
| Poste avancé · Avant + Spécial | 19 / 1 / 15 | 18 | Aucun dégât direct | Pose +165, bornée 48–1232. | Aucun contact offensif. |
| Rappel de section · Arrière + Spécial | 12 / 1 / 22 | 16 | 8 de base | Au poste : centre initial à 15 px du sol, montée de 16 par pas pendant 6 pas, boîte 92×18. | Garde debout ou accroupie. |

**MOVE:cliff:cliff — Deux traits étagés.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Émissions à t=17 et 25. Une interruption avant la seconde l’empêche ; les traits déjà émis subsistent. Jusqu’à deux touches, cinq PV de base chacune. Impact : base 5 PV, équilibre 9, stun 11, poussée 4.

**MOVE:cliff:post — Point d’émission.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. À t=19, poste pour 160 pas ; un seul marqueur. Ne crée aucune IA de soldat autonome.

**MOVE:cliff:recall — Colonne montante au poste.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. À t=12, consomme le poste et émet. Sans poste : coût de 16 quand même payé, action jouée et notice AUCUN POSTE. Sur touche : lancement vertical 7. Impact : base 8 PV, équilibre 15, stun 16, poussée 4, lancement 7.

**IA présente.** À distance, peut poser un poste s’il n’a pas de marqueur ; rappel si la cible est à moins de 72 px du poste.

### Porteur MULE · mule

DS1 / Director’s Cut ; hauteur 177, vitesse 4.25 par pas au sol, puissance 1. Pose une caisse devant toi. Pousse-la avec un coup fort ou rappelle-la quand ton adversaire enjambe le colis.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Balayage de capteur · Spécial neutre | 18 / 12 / 17 | 28 | Aucun dégât direct | Onde symétrique à t=18–29 : rayon=(t−18+1)×38 ; distance de rayon−61 à rayon+22, maximum 478. | Toute garde active bloque le scan, sans perte de garde ajoutée. |
| Consigne mobile · Avant + Spécial | 16 / 1 / 18 | 18 | 6 de base par poussée ; pose seule : 0 | Pose +86, bornée 48–1232 ; collision balayée de 42×21 au sol une fois déplacée. | Caisse poussée : garde accroupie uniquement. |
| Saisie de lot · Arrière + Spécial | 13 / 3 / 24 | 16 | 7 de base | Trajet vers le X courant du porteur, 14 px/pas ; collision balayée 42×21 au sol. | Garde accroupie uniquement. |

**MOVE:mule:mule — Repérage sans dégâts.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Aucun PV, stun ou gain chiral de touche. Mémorise le X touché pendant 120 pas sans suivre ensuite la cible. Le test ne dépend pas de sa hauteur.

**MOVE:mule:crate — Caisse à déplacer.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Pose à t=16, durée 180 ; pose seule sans dégâts. Coup lourd pousse à 10 px/pas sur 112 px maximum. Une touche par trajet ; caisse conservée à l’arrivée. Impact : base 6 PV, équilibre 11, stun 12, poussée 4.

**MOVE:mule:retrieve — Rappel de caisse.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Sans caisse ou rappel déjà actif : refus avant dépense. Durée protégée jusqu’au déclenchement, puis ne décroît pas pendant le rappel. Une touche par trajet ; disparition à l’arrivée. Impact : base 7 PV, équilibre 13, stun 14, poussée 4.

**IA présente.** Caisse immobile au-delà de la cible : rappel ; caisse devant et à portée de Lourd : poussée possible. À distance : pose ou scan.

### Die-Hardman · diehardman

DS1 / Director’s Cut ; hauteur 181, vitesse 4.1 par pas au sol, puissance 1.02. Intercepte une frappe à mi-hauteur. Tant que le sceau brille, ta prochaine relève ou ta ligne d’arrêt profite de cet avantage.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Ordre de maintien · Spécial neutre | 11 / 5 / 21 | 28 | Aucun dégât direct | Contact reçu pendant t=11–15. | Intercepte light, heavy, lift, relief ou fragile en mêlée ; pas sweep, air, fan, prise ou projectile. |
| Ligne d’arrêt · Avant + Spécial | 17 / 6 / 22 | 18 | 8 de base | Centre +108 borné ; hauteur 72, boîte 36×144, immobile. | Garde debout ou accroupie. |
| Relève · Arrière + Spécial | 8 / 4 / 16 | 16 | 7 de base | Recul de 2,5 px à t=1–7 ; portée 77, ou 121 avec sceau ; bande 48–109. | Garde debout ou accroupie. |

**MOVE:diehardman:diehardman — Contre médian et sceau.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Une interception accorde un sceau pour 120 pas, annule l’action adverse et impose au moins 26 pas de stun. Aucun dégât direct.

**MOVE:diehardman:gate — Zone verticale.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Émission à t=17 pour 6 pas, ou 8 si sceau présent à l’émission. Le sceau n’est pas consommé. Impact : base 8 PV, équilibre 16, stun 15, poussée 7.

**MOVE:diehardman:relief — Recul puis reprise.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Sceau consommé dès le démarrage : portée +44, dégâts inchangés. Pas d’invulnérabilité dédiée dans le duel. Impact : base 7 PV, équilibre 14, stun 14, poussée 6.

**IA présente.** Contre prioritaire contre light/heavy/lift en démarrage à moins de 143 px, énergie ≥28 : tirage 35/50/65 % selon niveau. Ligne d’arrêt possible entre 92 inclus et 144 exclus, énergie ≥18, tirage 32 %.

### Mama · mama

DS1 / Director’s Cut ; hauteur 170, vitesse 4.4 par pas au sol, puissance 0.96. Pose ton point sur la piste. Déploie le tablier vers lui, ou utilise le treuil pour te rapprocher.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Point d’ancrage · Spécial neutre | 18 / 1 / 16 | 28 | Aucun dégât direct | Pose +130, bornée 48–1232. | Aucun contact offensif. |
| Tablier · Avant + Spécial | 16 / 10 / 21 | 18 | 9 de base | À l’ancrage si présent, sinon au porteur ; hauteur 76 ; vitesse 7,2 avec ancrage, sinon 3,6 ; durée 10, boîte 26×18. | Garde debout ou accroupie. |
| Treuil · Arrière + Spécial | 12 / 8 / 15 | 16 | Aucun dégât direct | Interpolation vers l’ancrage sur 8 pas actifs à partir de t=12. | Aucun contact offensif ni invulnérabilité dédiée. |

**MOVE:mama:mama — Pose d’ancrage.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. À t=18, ancrage pour 200 pas. Ce marqueur n’est pas une plateforme de collision ni un personnage secondaire.

**MOVE:mama:deck — Projectile depuis ancrage ou porteur.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Émission à t=16. Conserve l’ancrage ; l’absence d’ancrage réduit la vitesse sans interdire la technique. Impact : base 9 PV, équilibre 16, stun 14, poussée 6.

**MOVE:mama:winch — Déplacement vers l’ancrage.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Sans ancrage : refus avant dépense. Durée protégée au démarrage ; marqueur consommé à t=12. Bornes et contacts de corps continuent de s’appliquer.

**IA présente.** Ancrage présent, tirage 65 % : Tablier si la cible est à moins de 82 px du repère, sinon Treuil, selon l’énergie.

### Heartman · heartman

DS1 / Director’s Cut ; hauteur 176, vitesse 4.15 par pas au sol, puissance 0.96. Compte le battement visible. Pose une mémoire de phase puis déclenche son onde au moment où ton adversaire la rejoint.

| Action / commande | S / A / R | Coût | Dégâts de base | Portée et volume | Garde |
|---|---:|---:|---:|---|---|
| Impulsion témoin · Spécial neutre | 15 / 16 / 18 | 28 | 7 de base | Origine au porteur, hauteur 83 ; vitesse 10 sur battement, sinon 7,5 ; durée 16, boîte 26×18. | Garde debout ou accroupie. |
| Mémoire de phase · Avant + Spécial | 14 / 1 / 17 | 18 | 8 de base à la seconde activation ; pose seule : 0 | Première activation : marqueur au porteur. Seconde : centre au marqueur, hauteur 64, boîte 132×90, durée 8. | Garde debout ou accroupie lors de l’impulsion. |
| Syncope du signal · Arrière + Spécial | 10 / 6 / 24 | 16 | Aucun dégât direct | Aucun déplacement ou volume offensif propre. | Invulnérabilité à t=10–15 inclus. |

**MOVE:heartman:heartman — Impulsion rythmée.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Émet à t=15. Battement capturé à la saisie : beat ≤3 ou ≥57 dans un cycle de 60. Augmente la vitesse, pas les dégâts ; rythme propre au simulateur. Impact : base 7 PV, équilibre 12, stun 12, poussée 5.

**MOVE:heartman:memory — Mémoire de position et impulsion.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. À t=14, pose une mémoire pour 120 pas, ou la consomme pour émettre. Coût 18 à chaque usage ; première activation sans dégâts. Impact : base 8 PV, équilibre 15, stun 14, poussée 6.

**MOVE:heartman:syncope — Fenêtre d’invulnérabilité.** Nom et paramètres du projet ; aucune valeur numérique canonique affirmée. Aucune annulation offensive dédiée. Défense payante, sans riposte ni recul dans le duel ; début et récupération vulnérables.

**IA présente.** Impulsion si distance >91 et <149, ou <188 sur le battement ; énergie ≥28, tirage 40 %. Mémoire présente à moins de 77 px de la cible : déclenchement si énergie ≥18.

## Actions communes hors attaque

- **Marche — Gauche / Droite.** Vitesse propre au kit, identique avant/arrière ; facteur 0,78 en l’air. Bloquée par action, garde, accroupissement, stun ou blockstun.
- **Accroupissement — Bas.** Au sol, hors dash/stun ; hurtbox à 62 % de la hauteur.
- **Saut — Haut.** Au sol, sans action : vitesse verticale 14,5 et gravité 0,77 par pas ; aucun double saut dédié.
- **Pas rapide — Deux pressions du même côté en 13 ticks au plus.** Au sol, hors action/stun/blockstun/dash. Compteur 12 ; déplacement drift×(2+compteur×0,74) avant décrément. Invulnérable quand le compteur restant vaut 4 à 8.
- **Garde — Garde ; Bas + Garde pour le bas.** Au sol, sans action/stun/dash ; aucune garde aérienne. Le côté ne conditionne pas le blocage dans le duel.
- **Finalité — Finalité après victoire finale par K.-O..** Issue déjà décidée ; fenêtre finish de 135 pas, puis cinéma de 108 pas si activée. Aucun dégât supplémentaire ; distincte de l’ultime cible.

## Difficultés et décisions IA

| Profil | Intervalle de décision | Garde sous menace | Contre Die-Hardman | Spécial à distance | Dégâts ajoutés par difficulté |
|---|---:|---:|---:|---:|---:|
| Débutant (0) | 5–20 pas | 38 % | 35 % | 12 % | ×1 |
| Porteur (1) | 5–16 pas | 61 % | 50 % | 16 % | ×1 |
| Vétéran (2) | 5–12 pas | 84 % | 65 % | 20 % | ×1 |

Ces probabilités sont conditionnelles ; les branches précédentes, la position et les ressources changent la fréquence observée. Le bot consulte l’état courant à chaque décision, sans délai de perception humain séparé.

- Le CPU pilote J2 hors mode local ; au dojo, seul dummy=cpu décide. Idle/guard/record/loop suivent leurs chemins propres.
- À la décision, aiWait est réinitialisé et les touches effacées ; retour immédiat si stun ou blockstun. Une décision ratée n’est pas automatiquement reportée à la fin du stun.
- Menace : action adverse à distance <156, ou projectile du joueur 1 à <175 ; caisse en déplacement à <95 également considérée.
- Garde sous menace selon difficulté. Bas ajouté pour sweep ou caisse basse détectée ; toutes les autres armes ne disposent pas d’une réponse spécialisée.
- À distance >122 : approche ; spécial possible si 158<distance<600, énergie ≥28, sauf Die-Hardman/Heartman. Sinon dash possible au-delà de 230, tirage 13 %.
- Face à une garde et distance <76 : projection sur tirage 53 %. Sinon tirage générique : recul <12 %, garde de 12 à 22 %, saut de 22 à 28 %, spécial de 28 à 45 % si énergie ≥28, sinon normales.
- Au niveau 1/2, un spécial proche choisit une direction sur tirage 55 % ; au niveau 0, il reste neutre. Le marqueur et le kit modifient le choix.
- Branche normale : Lourd si tirage >72 %, sinon Léger ; Bas sur un autre tirage 16 %. Les branches prioritaires changent les fréquences observées.
- PRNG de simulation indépendant des particules. Aucune anticipation de transition ou politique spécialisée universelle n’est déduite de ces profils.

## Présentation, statut et validation

Les poses existantes sont pilotées par `act.t`. Les notices, `signatureSound` lors de la dépense, les effets et sons de contact restent ceux du moteur. Une fiche ne produit pas une nouvelle animation. Aucun paramètre de simulation n’est changé par ce catalogue. Les conditions d’échec, coûts, marqueurs, projectiles et défenses sont décrits séparément.

La [recette ciblée](production/20261125-domains/moves-verification.json) et le [rapport des fiches et relations](production/20261125-domains/ACTIONS_RELATIONS_IA.md) conservent les mesures et leur portée. Dix contrôles couvrent les tables, les timings, 640 impacts, 300 cas d’annulation, 34 mesures d’avantage, 207 cas conditionnels, 24 seuils IA et la matrice des relations. Ils exécutent les fonctions réelles avec des états unitaires préparés, sans navigateur ni rendu de pixels. Ils ne certifient pas l’équilibre de toutes les confrontations, toutes les réponses IA aux outils ni la compatibilité de chaque action avec chaque boss.

# Boss et grandes rencontres — règles du moteur actuel

**25 novembre 2026 · StrandBoss · six rencontres, huit motifs et 30 actions propres à ce moteur.**

[Catalogue JSON](data/boss-et-rencontres.json) · [Compendium du jeu](../../modes/echos-de-la-greve/boss-guide.js) · [Moteur](../../modes/echos-de-la-greve/boss.js) · [Extracteur](../../outils/generer_catalogue_boss.cjs) · [Recette ciblée](production/20261125-extension/boss-compendium-verification.json).

Les chiffres sont ceux d’Échos de la Grève, une adaptation du simulateur. Les noms de techniques peuvent être communs au duel, mais leurs effets, délais et ressources sont décrits ici à partir de `boss.js`. Ce catalogue ne crée ni kit, ni équilibrage, ni animation.

## Règles communes et convention de temps

- Une nouvelle rencontre Boss Battle ou un début de chapitre de campagne commence à 120 PV, énergie chirale 100 et garde 100. Boss Rush conserve ses PV de série ; une reprise conserve les ressources prévues par son mode. Simulation fixe à 60 pas par seconde ; aucune valeur du duel n’est reprise par ce catalogue.
- L’énergie récupère 0,19 par pas actif. La garde récupère 0,12 si la commande Garde est tenue, sinon 0,55 ; plafonds 100. L’introduction et la pause ne font pas avancer ces recharges.
- Une garde au sol exige aucune action ni étourdissement. L’impact doit arriver de face, avec une tolérance de 24 unités derrière le joueur. Les tirs bas exigent Bas + Garde.
- La garde ordinaire retire 2 PV et 18 de garde par impact, puis donne 14 pas d’invulnérabilité. Le grattage peut tuer. À garde nulle : 45 pas d’étourdissement.
- Un bouclier de contre prêt absorbe aussi les attaques non gardables et les tirs bas s’ils arrivent de face. Il coûte 6 de garde, ne gratte aucun PV, rend 14 pas invulnérable, riposte de base 24 et se consomme au premier impact.
- Un coup non bloqué applique les dégâts arrondis selon la difficulté, interrompt l’action, étourdit 22 pas, rend invulnérable 38 pas et repousse de 34 unités. Porter un colis coûte alors 12 d’intégrité.
- Dégâts sur le Boss = max(1, arrondi(base × puissance du combattant × facteur de cible)). Le facteur est 1,35 pendant une récupération ou une exposition au scan ; sinon 0,72 pour les camions, 0,65 pour la baleine, 1 pour les autres. Le bonus remplace le blindage, il ne se multiplie pas avec lui.
- À 85 de déséquilibre cumulé, le Boss entre en récupération forcée de 90 pas. Les attaques en récupération ne rechargent pas cette fenêtre. Les orbes et tirs déjà émis subsistent ; les autres dangers sont supprimés par cette rupture. La sortie de récupération avance le cycle même si le motif interrompu n’avait pas encore été émis.
- À 50 % des PV maximum ou moins après une touche non mortelle, la phase 2 est activée. Les futures annonces sont plus courtes ; les anneaux vont plus vite et certains motifs gagnent des zones ou projectiles. Le motif en cours n’est pas automatiquement annulé.
- Une action exécute son effet une seule fois au pas indiqué, puis se termine à sa durée totale. Il n’y a pas d’annulation offensive ni de file d’entrée différée : les pressions non acceptées sont perdues. Les projectiles émis ont une durée indépendante.
- Les actions et les spéciales sont autorisées en l’air ; il n’existe pas de frappe aérienne distincte. Le saut peut aussi commencer pendant une action. Une seule commande offensive par pas est essayée : Colis/Appui, Charge chirale, Signature, Lourd, Léger.
- La marche reste possible pendant l’action (×0,75), la garde (×0,38), l’accroupissement (×0,5 si aucune garde) et le portage (×0,76). Les facteurs applicables se multiplient. Saut : vitesse 13,5, gravité 0,65 par pas ; aucun pas rapide du duel.
- Le volume du joueur contre les dangers mesure 34 unités de large, 170 de haut debout et 105 accroupi, indépendamment de la hauteur visuelle du kit.
- Un projectile ami réussi ajoute 16 de déséquilibre. Une mêlée teste le centre du joueur contre le rayon du Boss plus sa portée, avec une tolérance de 25 unités derrière. Un projectile avance avant son contact et peut toucher au dernier pas de sa durée ; les collisions utilisent les volumes du moteur, indépendamment du chargement des images.
- Après l’introduction de 75 pas, le temps diminue pendant le combat, la collecte et l’intervalle entre vagues. Au dernier pas, actions du joueur, Boss puis projectiles sont résolus avant l’échec par le temps : une victoire obtenue avant ce contrôle reste une victoire.

**Lecture des délais.** E est le pas de première exécution et D celui où l’action est supprimée, après l’incrément du compteur. Une nouvelle action sans interruption peut commencer au pas D+1. Les durées de bouclier, d’invulnérabilité et de repère sont nominales au moment de la création ; le repère perd déjà un pas à la fin de cette même mise à jour. Un projectile à délai nul avance et teste sa collision le pas où il est émis. Un délai positif est décrémenté avant toute collision. Les phases actives du Boss et la durée de ses dangers sont distinctes.

## Vue des six rencontres

| Rencontre | PV Débutant / Porteur / Vétéran | Temps | Annonce phase 1 / 2, Porteur | Récupération naturelle | Victoire |
|---|---|---:|---:|---:|---|
| Catcher léonin | 230 / 280 / 336 | 150 s | 65 / 56 pas | 90 pas | Boss à 0 PV. |
| Catcher aquatique | 246 / 300 / 360 | 160 s | 72 / 62 pas | 85 pas | Boss à 0 PV. |
| Baleine de goudron | 279 / 340 / 408 | 180 s | 82 / 71 pas | 105 pas | Boss à 0 PV. |
| Géant de goudron | 328 / 400 / 480 | 200 s | 88 / 76 pas | 115 pas | Boss à 0 PV. |
| Camion MULE | 197 / 240 / 288 | 180 s | 76 / 65 pas | 85 pas | Boss de la dernière vague à 0 PV et les deux colis livrés au dépôt. |
| Convoi MULE | 156 + 174 / 190 + 213 / 228 + 255 | 240 s | 72 / 62 pas | 80 pas | Boss de la dernière vague à 0 PV et les deux colis livrés au dépôt. |

## Catcher léonin · lion

Abattez le Catcher. Sautez au-dessus de sa charge et frappez pendant sa récupération.

Arène par défaut : **Bassin de goudron** (tar-basin). 1 vague ; 0 colis à livrer. Multiplicateur normal de cible : ×1 ; exposition : ×1.35.

| Difficulté | PV par vague | Annonce phase 1 | Annonce phase 2 |
|---|---|---:|---:|
| Débutant | 230 | 78 pas | 67 pas |
| Porteur | 280 | 65 pas | 56 pas |
| Vétéran | 336 | 57 pas | 49 pas |

**Cycle.** CHARGE → ANNEAU AU SOL → BOND → répétition. Première approche : 55 pas après l’introduction. Récupération naturelle : 90 pas ; rupture : 90 pas. Approches suivantes : 42 / 28 pas en phases 1 / 2.

**Succès :** Boss à 0 PV. **Échec :** PV du joueur à 0 ; Temps écoulé.

- Enchaînement fixe : charge, anneau, bond. La charge vise votre position au début de son annonce.

**CHARGE.** Sautez au passage ou utilisez un contre prêt en faisant face. La garde ordinaire ne bloque pas la charge. La cible est mémorisée au début de l’annonce, limitée à x=150…1130. Le Boss atteint cette abscisse en 38 pas ; contact à distance horizontale <125 et hauteur des pieds <120. Un seul impact réussi par charge. Phase d’attaque : 48 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 18 / 25 / 31 PV, avant plafonnement aux PV restants.

**ANNEAU AU SOL.** Sautez lorsque chaque anneau arrive. La garde ordinaire ne le bloque pas. Deux anneaux partent en sens opposés, bas et non gardables. Vitesse 7,2 en phase 1, 9 en phase 2 ; ils peuvent encore circuler pendant la récupération. Phase d’attaque : 90 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 14 / 20 / 25 PV, avant plafonnement aux PV restants.

**BOND.** Sortez de la marque au sol ; un simple saut dans la colonne n’assure pas l’esquive. Le Boss rejoint la cible de l’annonce en 14 pas ; zone de frappe de 215 × 240, délai propre 10 pas, non gardable. Phase d’attaque : 36 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 20 / 28 / 35 PV, avant plafonnement aux PV restants.

**Volume de cible.** Rayon horizontal 162 ; hauteur 230. Séparation physique sous 125 unités de hauteur : rayon ×0,55, soit 89.1. Ce volume peut différer du contour du sprite.

## Catcher aquatique · squid

Évitez les tentacules annoncés au sol. Gardez face aux orbes et sautez l’anneau au sol.

Arène par défaut : **La Grève** (shore). 1 vague ; 0 colis à livrer. Multiplicateur normal de cible : ×1 ; exposition : ×1.35.

| Difficulté | PV par vague | Annonce phase 1 | Annonce phase 2 |
|---|---|---:|---:|
| Débutant | 246 | 86 pas | 74 pas |
| Porteur | 300 | 72 pas | 62 pas |
| Vétéran | 360 | 63 pas | 54 pas |

**Cycle.** JETS DE GOUDRON → SALVE CHIRALE → ANNEAU AU SOL → répétition. Première approche : 55 pas après l’introduction. Récupération naturelle : 85 pas ; rupture : 90 pas. Approches suivantes : 42 / 28 pas en phases 1 / 2.

**Succès :** Boss à 0 PV. **Échec :** PV du joueur à 0 ; Temps écoulé.

- Enchaînement fixe : jets, orbes, anneau. Les jets se resserrent près des bords quand plusieurs repères se confondent.

**JETS DE GOUDRON.** Quittez les colonnes marquées avant leur émission ; la garde ordinaire ne les bloque pas. Trois colonnes en phase 1, jusqu’à cinq en phase 2. Les positions sont limitées à la piste et dédoublonnées près des bords. Les émissions sont décalées de 4 pas. Phase d’attaque : 42 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 16 / 23 / 29 PV, avant plafonnement aux PV restants.

**SALVE CHIRALE.** Gardez face aux orbes ; accroupissez-vous avec la garde pour ceux du bas, ou évitez leur trajectoire. Trois orbes, puis quatre en phase 2. Hauteurs alternées 92 / 36 au-dessus du sol ; intervalle d’émission 18 pas. Ils peuvent persister après l’entrée en récupération. Phase d’attaque : 100 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 13 / 19 / 24 PV, avant plafonnement aux PV restants.

**ANNEAU AU SOL.** Sautez lorsque chaque anneau arrive. La garde ordinaire ne le bloque pas. Deux anneaux partent en sens opposés, bas et non gardables. Vitesse 7,2 en phase 1, 9 en phase 2 ; ils peuvent encore circuler pendant la récupération. Phase d’attaque : 90 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 14 / 20 / 25 PV, avant plafonnement aux PV restants.

**Volume de cible.** Rayon horizontal 150 ; hauteur 300. Séparation physique sous 125 unités de hauteur : rayon ×0,55, soit 82.5. Ce volume peut différer du contour du sprite.

## Baleine de goudron · whale

Repérez sa réapparition. Quittez les jets annoncés, puis attaquez son noyau exposé.

Arène par défaut : **Bassin de goudron** (tar-basin). 1 vague ; 0 colis à livrer. Multiplicateur normal de cible : ×0.65 ; exposition : ×1.35.

| Difficulté | PV par vague | Annonce phase 1 | Annonce phase 2 |
|---|---|---:|---:|
| Débutant | 279 | 98 pas | 85 pas |
| Porteur | 340 | 82 pas | 71 pas |
| Vétéran | 408 | 72 pas | 62 pas |

**Cycle.** SALVE CHIRALE → JETS DE GOUDRON → SURGISSEMENT → répétition. Première approche : 55 pas après l’introduction. Récupération naturelle : 105 pas ; rupture : 90 pas. Après récupération : immersion 55 pas, puis approche 35 pas.

**Succès :** Boss à 0 PV. **Échec :** PV du joueur à 0 ; Temps écoulé.

- Enchaînement fixe : orbes, jets, brèche. Après chaque récupération naturelle, immersion de 55 pas puis réapparition du côté opposé à la position actuelle du joueur (x=980 si joueur à gauche, sinon 300), suivie de 35 pas d’approche.
- Pendant l’immersion, aucune mêlée ni aucun projectile ami ne peut infliger de dégâts. L’exposition du scan continue de s’écouler.

**SALVE CHIRALE.** Gardez face aux orbes ; accroupissez-vous avec la garde pour ceux du bas, ou évitez leur trajectoire. Trois orbes, puis quatre en phase 2. Hauteurs alternées 92 / 36 au-dessus du sol ; intervalle d’émission 18 pas. Ils peuvent persister après l’entrée en récupération. Phase d’attaque : 100 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 13 / 19 / 24 PV, avant plafonnement aux PV restants.

**JETS DE GOUDRON.** Quittez les colonnes marquées avant leur émission ; la garde ordinaire ne les bloque pas. Trois colonnes en phase 1, jusqu’à cinq en phase 2. Les positions sont limitées à la piste et dédoublonnées près des bords. Les émissions sont décalées de 4 pas. Phase d’attaque : 42 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 16 / 23 / 29 PV, avant plafonnement aux PV restants.

**SURGISSEMENT.** Quittez la zone annoncée de la réapparition et profitez ensuite du noyau exposé. Même bond de 14 pas et zone de 215 × 240 que le bond léonin ; délai propre 10 pas, non gardable. Phase d’attaque : 36 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 20 / 28 / 35 PV, avant plafonnement aux PV restants.

**Volume de cible.** Rayon horizontal 220 ; hauteur 260. Séparation physique sous 125 unités de hauteur : rayon ×0,55, soit 121. Ce volume peut différer du contour du sprite.

## Géant de goudron · giant

Sortez des zones de frappe. Sautez l’anneau chiral et exploitez les longues récupérations.

Arène par défaut : **La Grève** (shore). 1 vague ; 0 colis à livrer. Multiplicateur normal de cible : ×1 ; exposition : ×1.35.

| Difficulté | PV par vague | Annonce phase 1 | Annonce phase 2 |
|---|---|---:|---:|
| Débutant | 328 | 106 pas | 91 pas |
| Porteur | 400 | 88 pas | 76 pas |
| Vétéran | 480 | 77 pas | 67 pas |

**Cycle.** FRAPPE DU GÉANT → ANNEAU AU SOL → SALVE CHIRALE → répétition. Première approche : 55 pas après l’introduction. Récupération naturelle : 115 pas ; rupture : 90 pas. Approches suivantes : 42 / 28 pas en phases 1 / 2.

**Succès :** Boss à 0 PV. **Échec :** PV du joueur à 0 ; Temps écoulé.

- Enchaînement fixe : écrasement, anneau, orbes. La hauteur de collision passe de 380 à 266 dans les poses d’annonce/attaque ; le dessin ne détermine pas cette collision.

**FRAPPE DU GÉANT.** Déplacez-vous hors de chaque marque ; la colonne haute couvre un saut ordinaire. Une zone de 200 × 450. En phase 2, une seconde zone de 180 × 450 est placée à 290 unités du premier point, vers le centre et limitée à la piste. Délai propre 10 pas, non gardable. Phase d’attaque : 36 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 20 / 28 / 35 PV, avant plafonnement aux PV restants.

**ANNEAU AU SOL.** Sautez lorsque chaque anneau arrive. La garde ordinaire ne le bloque pas. Deux anneaux partent en sens opposés, bas et non gardables. Vitesse 7,2 en phase 1, 9 en phase 2 ; ils peuvent encore circuler pendant la récupération. Phase d’attaque : 90 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 14 / 20 / 25 PV, avant plafonnement aux PV restants.

**SALVE CHIRALE.** Gardez face aux orbes ; accroupissez-vous avec la garde pour ceux du bas, ou évitez leur trajectoire. Trois orbes, puis quatre en phase 2. Hauteurs alternées 92 / 36 au-dessus du sol ; intervalle d’émission 18 pas. Ils peuvent persister après l’entrée en récupération. Phase d’attaque : 100 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 13 / 19 / 24 PV, avant plafonnement aux PV restants.

**Volume de cible.** Rayon horizontal 126 ; hauteur 380, 266 dans la pose d’annonce/attaque. Séparation physique sous 125 unités de hauteur : rayon ×0,55, soit 69.3. Ce volume peut différer du contour du sprite.

## Camion MULE · truck

Immobilisez le camion, puis rapportez ses deux colis au dépôt à gauche. La commande Colis prend, pose ou livre un colis.

Arène par défaut : **Camp des MULEs · temps sec** (mule-camp-dry). 1 vague ; 2 colis à livrer. Multiplicateur normal de cible : ×0.72 ; exposition : ×1.35.

| Difficulté | PV par vague | Annonce phase 1 | Annonce phase 2 |
|---|---|---:|---:|
| Débutant | 197 | 91 pas | 78 pas |
| Porteur | 240 | 76 pas | 65 pas |
| Vétéran | 288 | 67 pas | 58 pas |

**Cycle.** TIRS MULE → CHARGE → TIRS MULE → répétition. Première approche : 55 pas après l’introduction. Récupération naturelle : 85 pas ; rupture : 90 pas. Approches suivantes : 42 / 28 pas en phases 1 / 2.

**Succès :** Boss de la dernière vague à 0 PV et les deux colis livrés au dépôt. **Échec :** PV du joueur à 0 ; Temps écoulé ; Intégrité de cargaison à 0.

- Un seul camion. Son immobilisation fait apparaître deux colis. Il faut les prendre et les livrer séparément au dépôt à gauche.
- Ce Camion isolé n’endommage pas directement le dépôt avec ses tirs ou sa charge. Recevoir un coup non bloqué en portant un colis retire toutefois 12 d’intégrité.

**TIRS MULE.** Gardez face aux tirs ; Bas + Garde pour les tirs bas. Dans le Convoi, interceptez les tirs bas avant le dépôt. Trois tirs, puis quatre en phase 2 ; hauteurs 92 / 36, intervalle 18 pas. Un tir bas non intercepté entre x=90 et 170 retire 7 d’intégrité au dépôt du Convoi. Phase d’attaque : 100 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 11 / 15 / 19 PV, avant plafonnement aux PV restants.

**CHARGE.** Sautez au passage ou utilisez un contre prêt en faisant face. La garde ordinaire ne bloque pas la charge. La cible est mémorisée au début de l’annonce, limitée à x=150…1130. Le Boss atteint cette abscisse en 38 pas ; contact à distance horizontale <125 et hauteur des pieds <120. Un seul impact réussi par charge. Phase d’attaque : 48 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 18 / 25 / 31 PV, avant plafonnement aux PV restants.

**Volume de cible.** Rayon horizontal 205 ; hauteur 170. Séparation physique sous 125 unités de hauteur : rayon ×0,55, soit 112.75. Ce volume peut différer du contour du sprite.

## Convoi MULE · convoy

Interceptez deux camions en deux vagues. Rapportez un colis par camion et protégez le dépôt des tirs bas.

Arène par défaut : **Camp des MULEs** (mule-camp). 2 vagues ; 2 colis à livrer. Multiplicateur normal de cible : ×0.72 ; exposition : ×1.35.

| Difficulté | PV par vague | Annonce phase 1 | Annonce phase 2 |
|---|---|---:|---:|
| Débutant | 156 puis 174 | 86 pas | 74 pas |
| Porteur | 190 puis 213 | 72 pas | 62 pas |
| Vétéran | 228 puis 255 | 63 pas | 54 pas |

**Cycle.** TIRS MULE → CHARGE → TIRS MULE → répétition. Première approche : 55 pas après l’introduction. Récupération naturelle : 80 pas ; rupture : 90 pas. Approches suivantes : 42 / 28 pas en phases 1 / 2.

**Succès :** Boss de la dernière vague à 0 PV et les deux colis livrés au dépôt. **Échec :** PV du joueur à 0 ; Temps écoulé ; Intégrité de cargaison à 0.

- Deux camions, un colis par camion. Le second arrive 180 pas après la destruction du premier, même si le premier colis n’a pas encore été livré.
- Les PV du second camion sont arrondis après un facteur ×1,12. Le temps, la vitalité, l’énergie, la garde, l’intégrité et les colis ne sont pas réinitialisés entre les vagues.
- Un tir bas non intercepté retire 7 d’intégrité au dépôt. Une charge qui atteint x<220 retire 18, une seule fois par charge. La première cargaison peut être livrée pendant la seconde vague.

**TIRS MULE.** Gardez face aux tirs ; Bas + Garde pour les tirs bas. Dans le Convoi, interceptez les tirs bas avant le dépôt. Trois tirs, puis quatre en phase 2 ; hauteurs 92 / 36, intervalle 18 pas. Un tir bas non intercepté entre x=90 et 170 retire 7 d’intégrité au dépôt du Convoi. Phase d’attaque : 100 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 11 / 15 / 19 PV, avant plafonnement aux PV restants.

**CHARGE.** Sautez au passage ou utilisez un contre prêt en faisant face. La garde ordinaire ne bloque pas la charge. La cible est mémorisée au début de l’annonce, limitée à x=150…1130. Le Boss atteint cette abscisse en 38 pas ; contact à distance horizontale <125 et hauteur des pieds <120. Un seul impact réussi par charge. Phase d’attaque : 48 pas. Dégâts non bloqués Débutant / Porteur / Vétéran : 18 / 25 / 31 PV, avant plafonnement aux PV restants.

**Volume de cible.** Rayon horizontal 205 ; hauteur 170. Séparation physique sous 125 unités de hauteur : rayon ×0,55, soit 112.75. Ce volume peut différer du contour du sprite.

## Camions, colis et dépôt

La commande **Colis / Appui** est prioritaire sur les autres commandes offensives du même pas. Dans Camion et Convoi, elle ne produit pas la frappe d’appui. Elle exige toutefois de ne pas être déjà en action, en garde ou étourdi. Pour prendre : colis au sol à moins de 75 unités et pieds à moins de 20 unités du sol. Pour livrer : porter un colis, x ≤155 et hauteur des pieds <8. Sinon la commande pose le colis à la position du joueur. Un seul colis est porté à la fois ; le portage multiplie la vitesse par 0,76.

L’intégrité commune démarre à 100. Un coup non bloqué pendant le portage lui retire 12 ; le contre et la garde n’infligent pas cette pénalité. Les tirs bas (7) et charges profondes (18) menacent directement le dépôt uniquement dans le Convoi. Une intégrité nulle termine immédiatement la rencontre. Si le même coup détruit la cargaison et vide les PV du porteur, le premier arrêt est l’échec de cargaison.

Le chronomètre ne s’arrête ni pendant la collecte ni entre les vagues. Les deux colis doivent être livrés, le dernier camion détruit et la dernière vague atteinte. La dernière livraison peut donc gagner au dernier pas avant le contrôle du temps.

## Trente actions du moteur Boss

Les dégâts ci-dessous sont des **bases** : appliquer la puissance du kit puis le blindage ou l’exposition. Les projectiles ne sont pas des touches garanties. La portée de mêlée s’ajoute au rayon de la cible. Les déplacements décrivent une exécution loin des bords ; ils sont limités à la piste.

### Actions communes

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Léger · Léger | 0 | 6 / 20 / 21 | mêlée 10, portée 100, déséquilibre 11 |
| Lourd · Lourd | 0 | 14 / 34 / 35 | mêlée 23, portée 135, déséquilibre 24 |
| Balayage · Bas + Léger | 0 | 6 / 20 / 21 | mêlée 10, portée 100, déséquilibre 11 |
| Montant · Bas + Lourd | 0 | 14 / 34 / 35 | mêlée 23, portée 135, déséquilibre 24 |
| Frappe d’appui / Colis · Colis / Appui | 0 | 6 / 20 / 21 | mêlée 14, portée 65, déséquilibre 28 |
| Charge chirale · Charge chirale | 70 | 22 / 52 / 53 | mêlée 65, portée 230, déséquilibre 48 ; projectile 22, 110×110, vitesse 8, durée 90, délai 0 |

**BOSS_MOVE:common:light.** Frappe unique ; aucun enchaînement par annulation ni touche confirmée n’est requis.

**BOSS_MOVE:common:heavy.** Frappe unique. MULE peut aussi lancer sa propre caisse placée à moins de 180 unités ; la caisse est consommée. Variante caisse personnelle de MULE : mêlée 23, portée 135, déséquilibre 24 ; projectile 32, 56×42, vitesse 7, durée 160, délai 0.

**BOSS_MOVE:common:sweep.** Même frappe, portée et dégâts que Léger dans ce moteur. Aucun niveau de garde propre au Boss.

**BOSS_MOVE:common:lift.** Même frappe que Lourd ; aucun lancement vertical du Boss. La poussée de sa propre caisse reste possible pour MULE. Variante caisse personnelle de MULE : mêlée 23, portée 135, déséquilibre 24 ; projectile 32, 56×42, vitesse 7, durée 160, délai 0.

**BOSS_MOVE:common:grab.** Les grandes cibles ne sont pas projetées : frappe d’appui de base 14. Sur Camion et Convoi, la commande sert uniquement aux colis et ne démarre pas cette frappe.

**BOSS_MOVE:common:finish.** Charge offensive pendant la rencontre : 70 points, une mêlée puis un projectile. Les deux contacts ne sont pas garantis. Aucun cinéma de finalité du duel.

### Sam Porter Bridges

Puissance ×1, vitesse de base 4.4 par pas, hauteur visuelle du kit 176.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Bola de liaison · Signature neutre | 28 | 12 / 34 / 35 | projectile 34, 42×32, vitesse 9, durée 160, délai 0 |
| Reprise d’appui · Avant + Signature | 14 | 12 / 34 / 35 | contre 55 pas |
| Parade au lien · Arrière + Signature | 18 | 12 / 34 / 35 | contre 55 pas |

**BOSS_MOVE:sam:bola.** Projectile unique à hauteur de torse ; ne lie pas le déplacement du Boss.

**BOSS_MOVE:sam:brace.** Bouclier de contre, 55 pas à partir de l’exécution. Face au prochain impact, bloque même une attaque non gardable, riposte de base 24 et se consomme.

**BOSS_MOVE:sam:parry.** Même bouclier de contre de 55 pas que Reprise d’appui ici. Aucun échange automatique de côté.

### Fragile

Puissance ×0.94, vitesse de base 4.95 par pas, hauteur visuelle du kit 166.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Pas de Grève · Signature neutre | 28 | 12 / 34 / 35 | mêlée 36, portée 145, déséquilibre 24 ; invulnérabilité 30 pas ; déplacement 210 |
| Éventail de pluie · Avant + Signature | 18 | 12 / 34 / 35 | mêlée 30, portée 175, déséquilibre 22 |
| Point de retour · Arrière + Signature | 16 | 12 / 34 / 35 | repère beacon, durée nominale 240 |

**BOSS_MOVE:fragile:blink.** Avance de 210 unités, limité à la piste ; 30 pas d’invulnérabilité et mêlée à la nouvelle position. Une traversée trop profonde peut placer la cible derrière la frappe.

**BOSS_MOVE:fragile:fan.** Mêlée de base 30, sans restriction de garde haute ni soulèvement de la grande cible.

**BOSS_MOVE:fragile:beacon.** Première activation : repère de 240 pas. Seconde : retour au repère, consommation et 24 pas d’invulnérabilité. Chaque activation coûte 16.

Variante return : invulnérabilité 24 pas ; déplacement 86.

### Higgs Monaghan

Puissance ×1.06, vitesse de base 4.05 par pas, hauteur visuelle du kit 184.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Marée noire · Signature neutre | 28 | 23 / 45 / 46 | projectile 38, 86×100, vitesse 0, durée 12, délai 0 |
| Empreinte d’or · Avant + Signature | 21 | 12 / 34 / 35 | projectile 34, 80×80, vitesse 0, durée 200, délai 18 |
| Faux départ · Arrière + Signature | 14 | 12 / 34 / 35 | invulnérabilité 38 pas ; déplacement -110 |

**BOSS_MOVE:higgs:tar.** La zone vise la position du Boss à l’exécution, après 23 pas, et non sa position au départ du geste.

**BOSS_MOVE:higgs:mine.** Zone immobile à 185 unités devant le joueur, limitée à la piste. Délai du projectile 18 pas ; ne remplace pas le marqueur personnel.

**BOSS_MOVE:higgs:feint.** Recul de 110 unités limité à la piste ; 38 pas d’invulnérabilité. Aucun leurre avec une collision indépendante.

### Clifford Unger

Puissance ×1.03, vitesse de base 4.2 par pas, hauteur visuelle du kit 179.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Écho de section · Signature neutre | 28 | 12 / 34 / 35 | projectile 20, 42×32, vitesse 10, durée 160, délai 0 ; projectile 20, 42×32, vitesse 10, durée 160, délai 9 |
| Poste avancé · Avant + Signature | 18 | 12 / 34 / 35 | repère post, durée nominale 300 |
| Rappel de section · Arrière + Signature | 16 | 12 / 34 / 35 | projectile 45, 65×165, vitesse 0, durée 18, délai 0 |

**BOSS_MOVE:cliff:salvo.** Deux projectiles de base 20, à deux hauteurs ; le second attend 9 pas. Aucune garantie de double touche.

**BOSS_MOVE:cliff:post.** Pose à 230 unités devant, limitée à la piste ; le poste dure 300 pas.

**BOSS_MOVE:cliff:recall.** Exige son poste avant la dépense. Zone verticale sur le poste puis consommation ; aucun coût ni action si le poste manque.

### Porteur MULE

Puissance ×1, vitesse de base 4.25 par pas, hauteur visuelle du kit 177.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Balayage de capteur · Signature neutre | 28 | 12 / 34 / 35 | mêlée 18, portée 480, déséquilibre 15 ; exposition 150 pas |
| Consigne mobile · Avant + Signature | 18 | 12 / 34 / 35 | repère crate, durée nominale 360 |
| Saisie de lot · Arrière + Signature | 16 | 12 / 34 / 35 | projectile 36, 55×42, vitesse -8, durée 120, délai 0 |

**BOSS_MOVE:mule:scan.** Expose le Boss pendant 150 pas, même hors de portée de la mêlée. La frappe de base 18 a une portée de 480 unités plus le rayon de la cible ; le bonus d’exposition s’applique déjà à cette frappe.

**BOSS_MOVE:mule:crate.** Pose sa caisse à 86 unités devant, limitée à la piste, pour 360 pas. Pose seule : aucun dégât. Lourd/Montant ou Saisie de lot la consomment.

**BOSS_MOVE:mule:retrieve.** Exige sa propre caisse avant la dépense. La caisse part vers la position du joueur au moment de l’exécution, vitesse 8 ; si les deux positions coïncident, vitesse 0.

### Die-Hardman

Puissance ×1.02, vitesse de base 4.1 par pas, hauteur visuelle du kit 181.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Ordre de maintien · Signature neutre | 28 | 12 / 34 / 35 | contre 80 pas |
| Ligne d’arrêt · Avant + Signature | 18 | 12 / 34 / 35 | projectile 36, 45×143, vitesse 0, durée 100, délai 0 |
| Relève · Arrière + Signature | 16 | 12 / 34 / 35 | mêlée 30, portée 210, déséquilibre 25 ; invulnérabilité 18 pas ; déplacement -75 |

**BOSS_MOVE:diehardman:order.** Bouclier de contre pendant 80 pas. Même protection et riposte de base 24 que les contres de Sam ; aucun sceau ni renforcement ultérieur de Ligne d’arrêt/Relève.

**BOSS_MOVE:diehardman:gate.** Zone immobile à 170 unités devant, limitée à la piste ; sa durée ne dépend d’aucun sceau.

**BOSS_MOVE:diehardman:relief.** Recul de 75 unités limité à la piste, puis mêlée de portée 210 ; 18 pas d’invulnérabilité. Aucun bonus de sceau.

### Mama

Puissance ×0.96, vitesse de base 4.4 par pas, hauteur visuelle du kit 170.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Point d’ancrage · Signature neutre | 28 | 12 / 34 / 35 | repère anchor, durée nominale 360 |
| Tablier · Avant + Signature | 18 | 12 / 34 / 35 | projectile 38, 100×55, vitesse 7, durée 130, délai 0 |
| Treuil · Arrière + Signature | 16 | 12 / 34 / 35 | invulnérabilité 25 pas ; déplacement 86 |

**BOSS_MOVE:mama:anchor.** Pose un ancrage à 155 unités devant, limité à la piste, pour 360 pas.

**BOSS_MOVE:mama:deck.** Le projectile part de son ancrage, ou des pieds sans ancrage. Même vitesse, volume et dégâts dans les deux cas ; ne consomme pas l’ancrage.

Variante anchor : projectile 38, 100×55, vitesse 7, durée 130, délai 0 ; repère anchor, durée nominale 300.

**BOSS_MOVE:mama:winch.** Exige son ancrage avant la dépense ; rejoint ce repère, le consomme et donne 25 pas d’invulnérabilité. Aucun dégât direct.

### Heartman

Puissance ×0.96, vitesse de base 4.15 par pas, hauteur visuelle du kit 176.

| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |
|---|---:|---:|---|
| Impulsion témoin · Signature neutre | 28 | 12 / 34 / 35 | projectile 38, 45×50, vitesse 8, durée 160, délai 0 |
| Mémoire de phase · Avant + Signature | 18 | 12 / 34 / 35 | repère memory, durée nominale 300 |
| Syncope du signal · Arrière + Signature | 16 | 12 / 34 / 35 | invulnérabilité 38 pas ; déplacement -110 |

**BOSS_MOVE:heartman:pulse.** Projectile unique de base 38 ; aucune fenêtre de battement ni accélération liée au rythme dans boss.js.

**BOSS_MOVE:heartman:memory.** Première activation : mémoire de 300 pas. Seconde : zone de base 48 sur le repère puis consommation. Chaque activation coûte 18.

Variante release : projectile 48, 150×150, vitesse 0, durée 18, délai 0.

**BOSS_MOVE:heartman:syncope.** Recul de 110 unités limité à la piste ; 38 pas d’invulnérabilité, sans condition de battement.

### Compatibilité et limites de contact

Les huit kits peuvent démarrer les six rencontres. Les 24 signatures ont un chemin d’exécution dans chacune ; les techniques de rappel exigent leur repère. Les quatre attaques normales et la charge restent disponibles. Appui devient l’interaction Colis sur les deux rencontres de camions. Les Boss ne possèdent pas de garde ordinaire ni de résistance propre à un combattant : les différences de dégâts proviennent de la puissance, du blindage, de l’exposition et des volumes de collision. La Baleine est invulnérable pendant son immersion.

La recette vérifie les démarrages, effets et contacts préparés, y compris les 48 couples kit/rencontre et les variantes de repère, dans un périmètre explicite. Elle ne certifie ni la touche de chaque projectile en mouvement, ni l’équilibre, ni les meilleures stratégies de chaque confrontation.

## Boss Battle, série et campagne

### Boss Battle

Clé propre : `echos.boss.v1`. Règles : `boss-20261124-v1`.

- Une rencontre et une difficulté choisies ; départ neuf à 120 PV, énergie et garde 100.
- Checkpoint propre avec l’état de simulation ; sauvegarde périodique tous les 180 ticks, aux pauses et aux sorties. Une reprise restaure les ressources sauvegardées et libère les commandes.
- Les records sont séparés par combattant, rencontre et difficulté. Les images et le décor statique n’altèrent pas les valeurs de combat.

### Boss Rush

Clé propre : `echos.boss-rush.v1`. Règles : `boss-rush-20261125-v1`.

- Six rencontres dans l’ordre indiqué, avec leur arène par défaut. Combattant, tenue et difficulté sont fixes pour la série.
- Les PV exacts restants sont conservés ; chaque victoire ajoute 20, avec un plafond de 120. Énergie et garde repartent à 100 à la rencontre suivante.
- La première défaite termine la série. Une série perdue ne reprend pas au Boss suivant ; un nouveau départ recommence au Catcher léonin.
- Checkpoint et records de série indépendants de Boss Battle. Une reprise active conserve la rencontre et ses ressources ; aucune liste de replay Boss n’est produite par ce moteur.

Ordre : Catcher léonin → Catcher aquatique → Baleine de goudron → Géant de goudron → Camion MULE → Convoi MULE.

### Les Nœuds rompus

Clé propre : `echos.campaign.v1`. Règles : `les-noeuds-rompus-20261125-v1`.

- Le chapitre 5 utilise Die-Hardman / Convoi à la ferme ; le chapitre 6 utilise Sam / Baleine sur la Grève. Les règles de rencontre et la difficulté restent celles de boss.js.
- La campagne appelle isolated:true. Aucun record ni checkpoint de Boss Battle ou de Boss Rush n’est lu ou écrit par ces rencontres.
- La sauvegarde propre à la campagne reprend au début du chapitre. Les ressources reviennent à 120 / 100 / 100 à ce nouveau départ ; aucun soin de Boss Rush ni cumul de vitalité entre chapitres.
- Les scènes relèvent de la fiction du simulateur ; elles ne réécrivent ni les événements officiels ni La Ligne silencieuse.

## Provenance, reproduction et portée

Source principale SHA-256 : `9151eaffd51ea3117f806655bf6dbd7677aff612b837505cdfd53a1410eef550`. L’extracteur ne modifie jamais le moteur ; il ajoute un accès de lecture dans une copie en mémoire. Les noms viennent du contenu du projet, les valeurs et effets viennent du moteur Boss. Les notes de condition sont écrites explicitement et confrontées à la recette ciblée.

```sh
node outils/generer_catalogue_boss.cjs
node modes/echos-de-la-greve/qa/boss-compendium.cjs docs/combat/production/20261125-extension/boss-compendium-verification.json
```

[Rapport de livraison et limites](production/20261125-extension/BOSS_COMPENDIUM.md). La validation utilise Node, des états unitaires préparés et, pour les sauvegardes, les véritables entrées du moteur avec un hôte simulé. Elle ne constitue pas une séance de jeu en navigateur, un test matériel, une revue de pixels ou une certification d’équilibre.

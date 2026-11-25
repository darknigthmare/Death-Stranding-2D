# Le parcours dirigé du dojo

**Livré et vérifié le 25 novembre 2026.** Le parcours a été reconstruit après l’indisponibilité du premier environnement, puis exécuté dans le runtime de remplacement : dix groupes de contrôles et quarante parcours consignés passent. Deux exercices supplémentaires ont reçu un rendu Canvas natif. Les preuves distinguent la simulation de l’interface et le rendu des images.

Le parcours se trouve dans **Entraînement → Parcours dirigé · 8 exercices**. Il complète le dojo libre à l’intérieur du mode existant ; le menu conserve neuf modes. Les huit combattants DS1 / Director’s Cut sont sélectionnables. Le parcours utilise leurs actions actuelles et les mêmes images ; aucune animation, règle d’équilibrage, valeur de dégâts ou dépense de technique n’est ajoutée.

Les sources sont [lessons.js](../../../../modes/echos-de-la-greve/lessons.js), [lessons.css](../../../../modes/echos-de-la-greve/lessons.css) et le raccord dans [app.js](../../../../modes/echos-de-la-greve/app.js). Les données de techniques viennent de [moves-data.js](../../../../modes/echos-de-la-greve/moves-data.js), qui distingue déjà les valeurs du duel de celles des grandes rencontres.

## Huit objectifs réellement observés

| ID stable | Exercice | Condition de réussite |
|---|---|---|
| distance | Entrer et sortir de portée | Rester immobile pendant 15 pas à un écart de 65–105 pixels, puis pendant 15 pas à au moins 250 pixels. |
| reach | Faire toucher un coup léger | Terminer un léger dans le vide depuis au moins 150 pixels, puis enlever des PV au mannequin avec un léger. |
| guard-high | Tenir la garde debout | Absorber trois contacts légers : garde active, équilibre diminué et PV inchangés. Une touche reçue demande de recommencer. |
| guard-low | Protéger les jambes | Absorber trois balayages sans perdre de PV, en combinant Bas et Garde. |
| punish | Punir un coup dans le vide | Laisser manquer un lourd sans subir ni bloquer l’impact, puis toucher au léger pendant sa récupération. Le premier pas naturel de repos est exclu. |
| resource | Dépenser puis récupérer | Constater la dépense de la signature neutre puis laisser la jauge revenir à 60 sans nouvelle attaque. |
| signatures | Les trois signatures | Atteindre le début d’activité de la technique neutre, avant et arrière, dans cet ordre, avec les préparations requises. |
| combo | Confirmer puis enchaîner | Confirmer le léger, démarrer le lourd avant son retour au repos, puis obtenir le second impact dans le même enchaînement. |

Ces critères se rapportent au moteur actuel [StrandFight](../../../../modes/echos-de-la-greve/fight.js). Ils ne décrivent pas les valeurs cibles encore proposées ailleurs dans la bible. L’écart est mesuré entre les centres des combattants, et le dojo explique que sa recharge chirale est accélérée par rapport à un duel.

Les variantes des huit combattants sont lues dans les fiches du moteur. Les préparations de Cliff, Mama et du MULE ne sont pas contournées : le poste, l’ancrage ou la caisse doivent exister lorsqu’ils sont nécessaires. Une commande de rappel à vide ne valide pas son objectif.

## Parcours et commandes

Les huit exercices sont accessibles directement. Chaque écran présente les étapes, l’écart ou la jauge utile, le retour sur l’action observée, **Recommencer l’exercice** et **Retour au parcours**. Une réussite suspend la simulation et propose l’exercice suivant ou le retour à la liste. Une erreur de garde ou une touche pendant la préparation d’une punition donne un résultat explicite et permet de recommencer. Si la fenêtre de punition se ferme, le joueur peut se replacer et attendre un autre lourd.

J1 traverse le contrôleur partagé [input.js](../../../../modes/echos-de-la-greve/input.js). Les touches montrées dans les instructions viennent du profil actif ; « avant » et « arrière » suivent le côté du mannequin. Le clavier remappé, les boutons tactiles et la manette standard utilisent les mêmes actions logiques. Le joueur 2 extérieur ne peut pas prendre le contrôle du mannequin dirigé. Le dojo libre conserve son propre accès à l’enregistrement J2.

La pause, l’aide Commandes, la perte de focus et la sortie neutralisent les entrées selon les règles de l’application. L’exercice peut être repris après une pause ; quitter ou fermer la page redémarre cet exercice depuis son début.

## Progression séparée

La seule clé de progression du parcours est **echos.lessons.v1**, avec un schéma versionné. Elle conserve les exercices validés, le nombre de réussites, les combattants utilisés et le point de reprise. Une validation déjà acquise demeure après une nouvelle tentative. Les routes, les scènes, la campagne, le tournoi et les données Boss gardent leurs sauvegardes propres.

Une donnée incompatible donne un parcours vide accompagné d’un message. La simple lecture ne remplace pas le document invalide ; une nouvelle tentative explicitement lancée peut enregistrer le nouveau parcours. Lorsque le stockage est refusé, la progression reste disponible dans la session et l’interface l’indique.

## Raccord au moteur

Le module observe les instantanés du dojo avec les données de coups activées. Le mannequin reçoit uniquement les entrées ordinaires J2, dans le mode d’enregistrement d’entraînement utilisé comme adaptateur de commande interne. Les positions, PV, jauges, dégâts, fenêtres de coups et checkpoints ne sont jamais modifiés par le module de leçons.

Les changements de portée sont mesurés dans les positions réellement simulées. Les blocages sont déduits des contacts avec garde et équilibre. La punition exige un coup lourd observé dans le vide, puis un impact sur sa phase de récupération. L’enchaînement exige à la fois la transition réelle du léger au lourd et le second impact.

L’arène du parcours est le stand de tir si sa configuration est disponible ; sinon le centre de distribution reste utilisable. Cette sélection ne crée pas une nouvelle règle de combat.

## Vérification exécutée

La recette [qa/lessons.cjs](../../../../modes/echos-de-la-greve/qa/lessons.cjs) produit [lessons-verification.json](lessons-verification.json). Elle a réellement été exécutée avec Node dans le runtime de remplacement, après reconstruction et après les derniers ajustements du parcours.

**Dix groupes et quarante parcours consignés passent.** Le rapport conserve les objectifs mesurés, les combattants, le nombre de frames et les empreintes des sources lues. Les parcours utilisent les entrées normales du moteur ; aucun PV, checkpoint, état de combattant ou résultat de leçon n’est injecté pour obtenir les réussites.

- Les huit exercices sont menés jusqu’à leur validation.
- Les trois signatures actives sont vérifiées pour chacun des huit combattants.
- Punition et enchaînement sont exécutés avec les huit profils de déplacement et de puissance.
- L’absence d’action ne valide pas un exercice ; une garde debout contre un balayage échoue.
- Une frappe au premier pas de repos après le lourd ne compte pas comme punition. Une nouvelle attaque pendant la remontée de jauge fait recommencer l’objectif de ressources.
- Sauvegardes invalides, stockage indisponible et conservation des autres progressions sont contrôlés.
- Le parcours complet passe à travers le vrai app.js et le contrôleur partagé avec des touches J1 remappées. Les instructions, résultats, boutons, focus et validations enregistrées sont inspectés.
- Pause, aide Commandes, échec, réessai, fermeture et reprise au début sont exercés. Le retour au dojo libre retrouve son mannequin et son enregistrement J2.
- Un bouton tactile tenu et une manette standard synthétique réussissent chacun un exercice de garde.
- Les trois surfaces du compendium Boss sont vérifiées dans l’application.

L’hôte [qa/input-host.cjs](../../../../modes/echos-de-la-greve/qa/input-host.cjs) fournit un DOM et un Canvas explicitement simulés pour cette recette. **Il ne s’agit pas d’un navigateur, d’un moteur de mise en page HTML ou d’une manette matérielle.** Les fonctions de jeu et les handlers de l’application sont les modules réels.

Commande depuis le dossier du mode :

~~~bash
node qa/lessons.cjs --output=../../docs/combat/production/20261125-extension/lessons-verification.json
~~~

### Rendu natif distinct

La recette [qa/lessons-canvas.cjs](../../../../modes/echos-de-la-greve/qa/lessons-canvas.cjs) a aussi été exécutée avec @napi-rs/canvas disponible dans le runtime. Sa preuve est [lessons-native-verification.json](lessons-native-verification.json).

Deux exercices, garde debout et punition, aboutissent par leurs entrées normales dans l’arène du stand de tir Director’s Cut. Vingt-neuf images sont décodées ; le vrai renderer de StrandFight produit les compositions 1280×720. L’opacité finale vaut 255 sur tous les pixels. La capture ne fait pas avancer le pas de simulation.

| Capture native | Ce qu’elle montre |
|---|---|
| [Garde debout](dojo-renders/guard-high.webp) | Contact du mannequin, porteur en garde, barres de vitalité et d’équilibre après trois blocages. |
| [Punition](dojo-renders/punish.webp) | Impact léger après le lourd manqué, perte de vitalité adverse et positions issues de la simulation. |

La revue des deux compositions n’a révélé ni rupture du sol ni rognage des silhouettes. Les personnages et leur zone de contact restent visibles. Aucun PNG du jeu n’a été modifié pour produire ces captures.

**Limite observée de ce runtime natif : aucune police système n’est disponible.** Les glyphes du HUD ne sont donc pas rendus dans ces deux images. Les preuves natives portent sur les images, les barres et la composition ; les chaînes et commandes de l’interface sont vérifiées séparément dans la recette DOM. Le rapport expose nativeTextRenderingAvailable:false et htmlLayoutRendered:false. Il n’étend pas cette preuve à la mise en page du navigateur.

## Raccord au compendium Boss

L’application insère le compendium autonome dans la sélection **Boss Battle**, la sélection **Boss Rush** et le briefing d’un chapitre Boss de campagne. Le contrat est **StrandBossGuide.render({boss, context, p1, difficulty})**. Le panneau reste un élément details natif, avec son résumé, sans mutation du moteur ou de la progression.

La recette vérifie la sélection du camion avec Fragile en Vétéran, une série Boss Rush réellement créée puis reprise avec son combattant sauvegardé, et les briefings convoi et baleine. Les deux derniers contrôles utilisent des fixtures explicites de progression pour atteindre les écrans concernés ; ils ne sont pas présentés comme de nouvelles victoires de campagne. Le bouton d’entrée dans la rencontre reste disponible à côté du guide.

Les données, définitions et contrôles propres aux six rencontres sont documentés dans [BOSS_COMPENDIUM.md](BOSS_COMPENDIUM.md) et [boss-compendium-verification.json](boss-compendium-verification.json). Les imports de lessons.js, lessons.css, boss-data.js, boss-guide.js et boss-guide.css sont vérifiés par la recette d’intégration ; le contrôle HTTP de ces ressources appartient à la clôture du lot.

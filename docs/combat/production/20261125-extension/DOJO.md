# Le parcours dirigé du dojo

**État du checkpoint : implémentation reconstruite après l’indisponibilité de l’environnement de travail. La recette finale de ces fichiers reste à exécuter dans le runtime de remplacement. Ce document ne marque pas encore LEARN:dojo comme terminé.**

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

## Vérification et état de reprise

La recette prévue est [qa/lessons.cjs](../../../../modes/echos-de-la-greve/qa/lessons.cjs) et sa sortie est [lessons-verification.json](lessons-verification.json).

Avant la disparition de l’environnement local, la version initiale avait effectivement exécuté quatre groupes : les huit exercices par entrées réelles, les trois signatures de chacun des huit combattants, les échecs sans action et les reprises, ainsi que la validation et l’isolation de la sauvegarde. La sortie observée indiquait 16 parcours réussis. Les fichiers locaux et leur rapport ont disparu ; ce constat antérieur ne remplace pas une recette des sources reconstruites.

Le checkpoint inclut maintenant les contrôles à rejouer sur ces sources : punition et enchaînement des huit profils de combattants ; parcours complet à travers l’application avec touches remappées ; pause, aide, erreur, réessai, fermeture et reprise ; sortie vers le dojo libre ; tactile et échantillon de manette standard. Des ajustements de limite de récupération et de navigation ont également été apportés à la reconstruction. Ils doivent être vérifiés avant la clôture.

La compilation syntaxique des sources reconstruites a réussi dans l’isolate JavaScript de la session. **Aucun nouveau résultat Node, rendu natif ou test navigateur n’est revendiqué pour ce checkpoint.** La simulation DOM/Canvas de la recette sera explicitement distinguée d’un éventuel rendu natif, et les échantillons de manette ne seront pas présentés comme une recette de matériel physique.

## Autre raccord d’interface

L’application prévoit l’insertion du compendium Boss autonome dans la sélection Boss Battle, la sélection Boss Rush et le briefing d’un chapitre Boss de campagne. Le contrat est **StrandBossGuide.render({boss, context, p1, difficulty})**. Les modules et la recette de ce compendium appartiennent à son chantier séparé ; l’absence provisoire du module laisse simplement ce panneau indisponible dans le checkpoint de récupération.

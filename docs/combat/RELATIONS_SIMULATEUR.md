# Relations des huit empreintes — matrice du simulateur

**Version : 25 novembre 2026 · DS1 / Director’s Cut · création originale du projet.**

Cette matrice couvre les 28 paires distinctes des huit identités, avec deux échanges selon le premier locuteur. Huit échanges miroir sont séparés. Les étiquettes décrivent une situation de la reconstitution ; elles ne déclarent aucune relation officielle, alliance canonique ou connaissance nouvelle du personnage. Les huit récits et la campagne conservent leurs textes.

[Module consultable](../../modes/echos-de-la-greve/relationships.js) · [Données structurées](data/relationships.json) · [Bible](BIBLE_COMBAT.md) · [Guide, rubrique 07](references/Combat_Games_Guide_General_v1.0.txt).

## Contrat de présentation

Les échanges sont réservés aux entrées de Versus et Arcade. Le premier combattant parle, le second répond. Ils sont brefs, passables et ne changent ni adversaire, ni arène, ni résultat, ni progression. Une revanche peut garder un accès direct au duel. Le tag **Fiction du simulateur** reste visible. Une clé inconnue retourne `null` ; aucun personnage implicite n’est créé. Les voix et animations propres à ces répliques ne sont pas livrées.

## Matrice complète

| ID | Paire | Relation proposée dans le simulateur | Échange dans le sens indiqué | Échange inverse |
|---|---|---|---|---|
| `REL:fragile:sam` | sam / fragile | Coordination mise à l’épreuve | Tu vois un passage ? / Une ouverture. À toi de la garder. | Suis le détour, Sam. / Tant qu’il mène de l’autre côté. |
| `REL:higgs:sam` | sam / higgs | Obstacle et provocation | Tu as encore barré le chemin. / Pour voir si tu en cherches un autre. | Un colis, un obstacle. Tu connais la suite. / Je connais surtout la sortie. |
| `REL:cliff:sam` | sam / cliff | Tension sur une ligne tenue | Je ne vais pas te laisser avancer. / Alors garde ta position. | Reste de ce côté de la ligne. / Il faudra plus qu’un ordre. |
| `REL:mule:sam` | sam / mule | Conflit d’inventaire | Je viens reprendre la caisse. / Commence par retrouver son numéro. | Ce chargement reste ici. / Il a encore du chemin à faire. |
| `REL:diehardman:sam` | sam / diehardman | Ordre et décision | Tu demandes de passer ou d’attendre ? / De reconnaître le moment où la ligne est libre. | La consigne tient toujours. / Alors montre-moi ce qu’elle protège. |
| `REL:mama:sam` | sam / mama | Épreuve d’un point d’appui | Ça tient ? / Assez pour essayer. Regarde les points d’appui. | Ne force pas au milieu. / Je vais d’abord chercher les bords. |
| `REL:heartman:sam` | sam / heartman | Patience et mesure | Combien de temps ? / Assez pour apprendre de ta prochaine erreur. | Tu peux attendre le bon signal. / Je peux aussi le provoquer. |
| `REL:fragile:higgs` | fragile / higgs | Passage disputé | Tu veux encore décider du passage ? / Seulement de celui que tu ne prendras pas. | Tu comptes disparaître au premier obstacle ? / Je compte choisir où je reviens. |
| `REL:cliff:fragile` | fragile / cliff | Mobilité face à une position | Ta ligne ne m’arrêtera pas. / Elle n’est pas faite pour te suivre. | Tu bouges. La position reste. / J’ai besoin d’un instant, pas de la position. |
| `REL:fragile:mule` | fragile / mule | Trajet contre possession | Garde tes étiquettes. / Alors laisse mes caisses. | Tout ce qui passe doit être enregistré. / Il faudrait déjà voir par où je passe. |
| `REL:diehardman:fragile` | fragile / diehardman | Négociation d’un passage | Un ordre ne dessine pas un chemin. / Il peut empêcher qu’on le ferme. | Je dois savoir où mène ton détour. / Commence par me laisser une ouverture. |
| `REL:fragile:mama` | fragile / mama | Départ et ancrage | Je peux franchir cet espace. / Et moi, lui donner deux appuis. | Il me faut un point qui reste. / Je reviendrai à celui-là. |
| `REL:fragile:heartman` | fragile / heartman | Intervalle à saisir | Ton signal arrive toujours après moi. / Alors laisse-moi mesurer ton avance. | Il y a une pause entre deux retours. / C’est là que je passe. |
| `REL:cliff:higgs` | higgs / cliff | Provocation face à la discipline | Tes soldats connaissent déjà la fin ? / Ils savent où tenir. | Ta mise en scène encombre la ligne. / Je préfère dire qu’elle attire l’attention. |
| `REL:higgs:mule` | higgs / mule | Détournement d’inventaire | Tu comptes aussi les ombres ? / Celles qui emportent le stock. | Rends ce qui manque. / Il faudra d’abord nommer ce que tu cherches. |
| `REL:diehardman:higgs` | higgs / diehardman | Deux usages du masque | Un masque pour chaque consigne ? / Le tien n’excuse pas de les ignorer. | Tu ne décideras pas du dernier ordre. / Je peux au moins en changer l’entrée. |
| `REL:higgs:mama` | higgs / mama | Rupture d’une construction | J’aimerais voir ce qui casse en premier. / Tu peux essayer. Je mesure aussi les défaillances. | Ce point d’ancrage ne t’appartient pas. / Alors je vais tester ce qui le retient. |
| `REL:heartman:higgs` | higgs / heartman | Interruption d’un rythme | Je peux interrompre ton petit rythme. / Nous mesurerons cette interruption aussi. | Ta répétition finit par devenir prévisible. / C’est pour cela que je change le silence. |
| `REL:cliff:mule` | cliff / mule | Occupation du terrain | Dégage cette caisse de la ligne. / La ligne passe maintenant par elle. | Ce périmètre appartient au camp. / Un périmètre se tient. Il ne se réclame pas. |
| `REL:cliff:diehardman` | cliff / diehardman | Consignes concurrentes | Deux ordres pour une seule position. / Nous allons vérifier lequel tient. | La ligne doit rester ouverte. / Alors protège ceux qui la tiennent. |
| `REL:cliff:mama` | cliff / mama | Appui à construire | Il me faut un point d’appui. / Choisis ton côté. Je prépare l’autre. | Ne place pas tout le poids au même endroit. / Ma section sait se répartir. |
| `REL:cliff:heartman` | cliff / heartman | Signal et mémoire | Le signal revient. / Écoutons ce qu’il répète avant d’y voir une réponse. | Je peux isoler la répétition. / Laisse-moi entendre ce qui reste. |
| `REL:diehardman:mule` | mule / diehardman | Propriété et consigne | Ton sceau ne prouve pas la propriété. / Non. Il indique une consigne à respecter. | La caisse doit quitter ce camp. / Alors il manque une ligne à ton ordre. |
| `REL:mama:mule` | mule / mama | Pièce retenue | Cette pièce entre dans mon inventaire. / Pas tant que mon ancrage la retient. | Il me faut cette pièce pour fermer la travée. / Il te faudra aussi son numéro de sortie. |
| `REL:heartman:mule` | mule / heartman | Objet et observation | Compte ce que tu veux. Pas ma caisse. / Je voulais seulement mesurer son trajet. | Cette caisse revient toujours au même point. / Parce que c’est le sien. |
| `REL:diehardman:mama` | diehardman / mama | Fermeture et ouverture | Le passage doit rester fermé. / Alors pourquoi garder un appui de l’autre côté ? | Je peux ouvrir une travée. / Je dois savoir qui pourra la traverser. |
| `REL:diehardman:heartman` | diehardman / heartman | Décision sous information incomplète | Nous ne pouvons pas attendre le signal parfait. / Non. Mais nous pouvons reconnaître le mauvais. | Le relevé laisse encore un blanc. / Nous déciderons avec ce qui reste lisible. |
| `REL:heartman:mama` | mama / heartman | Deux formes de mesure | J’ai besoin d’un repère qui dure. / Je peux t’offrir un rythme. Il faudra le suivre. | Le signal trouve un deuxième point. / Alors nous pouvons commencer la liaison. |

## Combats miroir

| Identité | Première empreinte | Réponse de la seconde |
|---|---|---|
| sam | Même charge, même chemin ? | On verra lequel tient jusqu’au bout. |
| fragile | Je ne prends jamais deux fois le même détour. | Alors il nous reste deux passages à trouver. |
| higgs | Enfin un public qui me ressemble. | Ne confonds pas le reflet avec une approbation. |
| cliff | Même position, même ordre. | Pas forcément la même réponse. |
| mule | Ce numéro est déjà dans mon registre. | Le mien aussi. Écarte-toi de la caisse. |
| diehardman | La même consigne ne suffit pas à nous départager. | Son application le fera. |
| mama | Deux modèles, les mêmes points d’appui. | Voyons lequel garde sa portée. |
| heartman | Une répétition aussi précise mérite une mesure. | À condition de ne pas la prendre pour une preuve. |

## Garde-fous narratifs et validation

Les phrases utilisent les objets et comportements déjà associés aux kits : trajet, colis, ligne, ancrage, ordre, signal et mesure. Elles n’attribuent pas aux empreintes DS1 des costumes ou connaissances de DS2. Mama et Lockne ne sont pas confondues. Les miroirs sont des répétitions du simulateur ; ils ne créent pas une rencontre officielle entre époques. Les paroles de Cliff ou Heartman ne révèlent ni voix hors champ ni identité laissée ouverte par une route.

La [recette des données](production/20261125-domains/moves-verification.json) vérifie les 56 orientations, les huit miroirs, la copie des répliques, les identités inconnues et l’absence de changement des routes, scènes et finalités. La [recette d’interface](production/20261125-domains/commandes-verification.json) vérifie leur raccord aux véritables handlers de Versus/Arcade dans un DOM simulé. L’action **Combattre · passer l’échange** mène directement au duel. Ces preuves restent distinctes d’une session de navigateur ou d’une validation de doublage. Le [rapport du domaine](production/20261125-domains/ACTIONS_RELATIONS_IA.md) précise la couverture reçue et ses limites.

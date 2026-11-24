(() => {
  'use strict';
  const fighters = {
    sam: {
      techniques: [
        ["Neutre", "Bola de liaison", 28, "Le lien traverse la piste à hauteur de torse."],
        ["Avant", "Reprise d’appui", 14, "Absorbe un coup léger pendant le planté de botte."],
        ["Arrière", "Parade au lien", 18, "Intercepte un coup de mêlée et change de côté. Une prise traverse la parade."]
      ],
      name: 'Sam Porter Bridges', call: 'Sam', role: 'Porteur de Bridges', special: 'Bola de liaison', finisher: 'Cargaison sécurisée',
      tip: 'Attends que la cible s’engage, puis lance le bola pour interrompre son approche.',
      story: 'Livraison sans adresse', route: [['fragile','terminal'], ['cliff','battlefield'], ['higgs','shore']],
      scenes: {
        intro: ['Le destinataire', 'Le lecteur refuse la caisse. Sam soulève le couvercle. Des bracelets de porteurs s’entrechoquent sous une étiquette effacée par le sel. Il en noue un à la poignée et reprend la route.'],
        rival: ['La dernière borne', 'Higgs bouche la borne avec son masque. « Tu comptes faire signer qui ? » Sam passe la sangle sur son épaule. « Celui qui viendra après moi. »'],
        ending: ['Accusé de réception', 'Sous l’auvent, Sam laisse la caisse de bracelets ouverte et le lecteur allumé. Au matin, un emplacement est vide. Cinq marques de doigts se dessinent sur la vitre embuée.']
      }
    },
    fragile: {
      techniques: [
        ["Neutre", "Pas de Grève", 28, "Disparaît brièvement, réduit la distance et frappe à la réapparition."],
        ["Avant", "Éventail de pluie", 18, "Un arc haut soulève la cible touchée. Un adversaire accroupi passe sous le geste."],
        ["Arrière", "Point de retour", 16, "Pose une balise pour trois secondes. Répète la commande pour revenir au repère."]
      ],
      name: 'Fragile', call: 'Fragile', role: 'Fragile Express', special: 'Pas de Grève', finisher: 'Dernier saut',
      tip: 'Utilise ton saut de Grève pour fermer la distance pendant la récupération d’un coup adverse.',
      story: 'Le dernier quai', route: [['sam','terminal'], ['cliff','battlefield'], ['higgs','shore']],
      scenes: {
        intro: ['Double exemplaire', 'Deux imprimantes, deux quais. Sur les deux bons de livraison, la même tache à gauche. Fragile les pose côte à côte. Les feuilles restent sèches sous la pluie.'],
        rival: ['La marque', 'Higgs attend sous un parapluie ouvert sur un cercle d’or. « Ton arrivée est marquée. » Les deux bons collent au sable. « Je choisis encore où je pose le pied. » Fragile ferme sa toile.'],
        ending: ['À l’abri', 'Le toit du quai fuit juste au-dessus du banc des porteurs. Fragile coince la poignée de son parapluie sous une latte et repart à pied. Un troisième bon, sous la toile, reste sec.']
      }
    },
    higgs: {
      techniques: [
        ["Neutre", "Marée noire", 28, "Le goudron jaillit à la position repérée au départ du geste."],
        ["Avant", "Empreinte d’or", 21, "Marque le sol devant Higgs. L’empreinte s’arme après un court délai et frappe les pieds."],
        ["Arrière", "Faux départ", 14, "Recule en laissant une silhouette à son point de départ."]
      ],
      name: 'Higgs Monaghan', call: 'Higgs', role: 'Homo Demens', special: 'Marée noire', finisher: 'Rideau de goudron',
      tip: 'La marée s’ouvre à l’endroit où ton adversaire se trouvait au début du geste. Provoque un arrêt avant de l’appeler.',
      story: 'Sans public', route: [['fragile','shore'], ['cliff','battlefield'], ['sam','terminal']],
      scenes: {
        intro: ['Une salle comble', 'Un applaudissement grésille lorsque Higgs remet son masque. Il l’ôte. Silence. Il le remet plus lentement et salue une rangée de sièges vides.'],
        rival: ['Le fermoir', 'Higgs écarte les bras. Sam retend la sangle de sa caisse. « Regarde-moi au moins. » Sam lève les yeux. « Elle glisse. » Le fermoir touche le métal.'],
        ending: ['Le rappel', 'Sous le seul siège éclairé, un lecteur rejoue les applaudissements. Higgs reconnaît le frottement de son propre gant. Il coupe le son et emporte l’appareil.']
      }
    },
    cliff: {
      techniques: [
        ["Neutre", "Écho de section", 28, "Deux échos traversent la piste à deux hauteurs."],
        ["Avant", "Poste avancé", 18, "Place une balise en avant de Cliff pour préparer un rappel."],
        ["Arrière", "Rappel de section", 16, "Un écho surgit à la verticale du poste puis le dissipe."]
      ],
      name: 'Clifford Unger', call: 'Cliff', role: 'Commandant de section', special: 'Écho de section', finisher: 'Rappel de section',
      tip: 'Les deux échos de la salve passent à des hauteurs différentes. Garde une longueur d’avance.',
      story: 'La fréquence muette', route: [['higgs','battlefield'], ['fragile','terminal'], ['sam','shore']],
      scenes: {
        intro: ['Trois notes', 'Dans la tranchée vide, un poste joue trois notes de berceuse. Tous les soldats tournent la tête ensemble. Cliff éteint le récepteur. La dernière note dure encore.'],
        rival: ['Le dernier émetteur', 'Sam pose la radio entre eux. « Tu peux l’écouter ici. » Cliff tend la main puis observe l’antenne. Ses hommes prennent position aux deux bouts du rivage.'],
        ending: ['À l’écoute', 'Le signal est enfin clair. Cliff coupe le récepteur. Derrière la cloison, une voix fredonne les trois notes. Il fait signe à sa section de rester, puis s’assied pour entendre la quatrième.']
      }
    }
  };
  fighters.mule = {
    name:'Porteur MULE', call:'MULE', role:'Opérateur du camp',
    special:'Balayage de capteur', finisher:'Hors inventaire',
    tip:'Pose une caisse devant toi. Pousse-la avec un coup fort ou rappelle-la quand ton adversaire enjambe le colis.',
    techniques:[
      ['Neutre','Balayage de capteur',28,'Une impulsion de scanner repère la dernière position touchée.'],
      ['Avant','Consigne mobile',18,'Dépose une caisse sur la piste. Un coup fort à proximité l’envoie vers l’avant.'],
      ['Arrière','Saisie de lot',16,'Rappelle la caisse au ras du sol. Une garde basse ou un saut permet de passer son trajet.']
    ],
    story:'L’inventaire du matin', route:[['mama','mule-camp'],['diehardman','terminal'],['sam','mule-camp']],
    scenes:{
      intro:['Dernière ligne','Une caisse vide vaut plus que tout le stock. L’opérateur soulève la caisse et colle l’oreille au couvercle. Une voix lui demande de lui rendre son nom.'],
      rival:['Le numéro de manche','Sam vient chercher le carton. Par réflexe, l’opérateur passe le lecteur sur sa propre manche. Le numéro correspond à celui du colis. Il pose le lecteur sur le couvercle. Pour une fois, il sait à qui cette caisse appartient.'],
      ending:['Registre des départs','Au matin, chaque caisse est à sa place. La case du propriétaire reste vide. Hors de la clôture, l’opérateur retire l’étiquette de sa manche. Sa main hésite, puis il écrit son nom au bas du registre des départs.']
    }
  };
  fighters.diehardman = {
    name:'Die-Hardman', call:'Die-Hardman', role:'Directeur de Bridges',
    special:'Ordre de maintien', finisher:'Levée de consigne',
    tip:'Intercepte une frappe à mi-hauteur. Tant que le sceau brille, ta prochaine relève ou ta ligne d’arrêt profite de cet avantage.',
    techniques:[
      ['Neutre','Ordre de maintien',28,'Ouvre une courte fenêtre de contre. Une interception médiane accorde un sceau pour deux secondes.'],
      ['Avant','Ligne d’arrêt',18,'Établit une ligne devant toi. Le sceau prolonge sa durée.'],
      ['Arrière','Relève',16,'Prends un bref recul puis frappe. Une relève sous sceau gagne en portée.']
    ],
    story:'Une porte ouverte', route:[['mule','terminal'],['mama','ruined-factory'],['cliff','battlefield']],
    scenes:{
      intro:['Accès consigné','La porte est condamnée depuis des années. Le compteur, lui, avance encore. Die-Hardman tire le registre vers la lumière. Sous l’ordre de fermeture, il reconnaît sa propre signature.'],
      rival:['Le seuil','Cliff arrête ses hommes devant la porte. « Donne-moi l’ordre. » Die-Hardman garde la clé dans sa paume. Il enlève son gant. « Il y en a déjà eu assez. »'],
      ending:['À portée de main','La porte donne sur un couloir vide. Die-Hardman corrige le registre sous son propre nom. Il suspend la clé au guichet, puis la descend d’un cran. La prochaine personne pourra l’atteindre.']
    }
  };
  fighters.mama = {
    name:'Mama', call:'Mama', role:'Ingénieure de Bridges',
    special:'Point d’ancrage', finisher:'Travée de retour',
    tip:'Pose ton point sur la piste. Déploie le tablier vers lui, ou utilise le treuil pour te rapprocher.',
    techniques:[
      ['Neutre','Point d’ancrage',28,'Fixe un point sur la piste devant Mama pour préparer sa prochaine manœuvre.'],
      ['Avant','Tablier',18,'Projette la travée depuis ton ancrage. Sans point, une travée plus courte part de tes pieds.'],
      ['Arrière','Treuil',16,'Ramène Mama vers son point. Une commande à vide ne consomme aucune énergie.']
    ],
    story:'La portée du fil', route:[['heartman','mama-workshop'],['mule','ruined-factory'],['diehardman','terminal']],
    scenes:{
      intro:['Deux attaches','Chaque nuit, la passerelle miniature s’affaisse au milieu. Mama vérifie les deux attaches, puis la charge inscrite sur son carnet. Au crayon, elle ajoute au centre la silhouette de quelqu’un qui attend.'],
      rival:['L’essai de charge','Die-Hardman garde le faisceau d’inspection allumé. « Le prochain porteur ne devrait pas servir d’essai. » Mama y glisse sa maquette. « C’est pour ça que je viens la traverser moi-même. »'],
      ending:['Une longueur de plus','Sur le tablier passent deux ombres, l’une après l’autre. À l’atelier, Mama range sa maquette et reprend la bobine. Elle déroule assez de fil pour une deuxième traversée.']
    }
  };
  fighters.heartman = {
    name:'Heartman', call:'Heartman', role:'Chercheur de Bridges',
    special:'Impulsion témoin', finisher:'Intervalle',
    tip:'Compte le battement visible. Pose une mémoire de phase puis déclenche son onde au moment où ton adversaire la rejoint.',
    techniques:[
      ['Neutre','Impulsion témoin',28,'Envoie une impulsion horizontale. Le battement du moniteur donne le tempo.'],
      ['Avant','Mémoire de phase',18,'Pose un repère. Une deuxième activation libère une onde à cet endroit.'],
      ['Arrière','Syncope du signal',16,'L’image du chercheur s’efface un instant pendant son esquive.']
    ],
    story:'La seconde de trop', route:[['fragile','heartman-lab'],['mama','mama-workshop'],['higgs','shore']],
    scenes:{
      intro:['La chaise','À la fin du relevé, une seconde entière est blanche. Heartman remet ses écouteurs et revient au début de la bande. Dans le silence, il entend le frottement d’une chaise qu’on recule.'],
      rival:['Une place sur la Grève','Higgs est assis face à la mer. « Tu veux du temps ? » Heartman pose son carnet fermé sur le sable. « Je veux savoir qui attendait. » Une vague atteint les pieds de la chaise. Le moniteur bat une fois.'],
      ending:['Les deux cercles','De retour au laboratoire, Heartman laisse le relevé tel quel. Il pose une deuxième tasse sur la table. Quand il les emporte, deux cercles de chaleur restent sur le bois. L’un commence déjà à s’effacer.']
    }
  };
  const arenas = {
    shore:{title:'La Grève', sky:'#668184', light:'#d3d0aa', weather:'rain'},
    terminal:{title:'Centre de distribution', sky:'#4e727e', light:'#a6d2d8', weather:'rain'},
    battlefield:{title:'Champ de bataille', sky:'#816e69', light:'#e2b58a', weather:'embers'},
    'mule-camp':{title:'Camp des MULEs', sky:'#777961', light:'#d8c38b', weather:'rain'},
    'mule-camp-dry':{title:'Camp des MULEs · temps sec', variantOf:'mule-camp', sky:'#929582', light:'#e1d6af', weather:'dust'},
    'heartman-lab':{title:'Laboratoire de Heartman', sky:'#505c66', light:'#a7cad7'},
    'mama-workshop':{title:'Atelier de Mama', sky:'#5c6865', light:'#acc9be'},
    'ruined-factory':{title:'Usine en ruines', sky:'#53595d', light:'#bcafb0', weather:'dust'},
    'timefall-shelter':{title:'Abri sous la pluie temporelle', sky:'#526366', light:'#b5d7d7', weather:'shelter'},
    'tar-basin':{title:'Bassin de goudron', sky:'#555859', light:'#d4bc9d'},
    'mountain-pass':{title:'Col de Mountain Knot', sky:'#758995', light:'#e0edf0', weather:'snow'},
    'port-knot':{title:'Port Knot City', sky:'#788e98', light:'#d5d6b8', weather:'rain'},
    incinerator:{title:'Incinérateur de la région Est', sky:'#838781', light:'#ded8bd', weather:'dust'}
  };
  const stages = Object.fromEntries(Object.entries(arenas).map(([id,arena]) => [id,arena.title]));
  const stageDetails = {
    shore:{place:'Rivage de la Grève',material:'Sable noir',ambience:'Le ressac avance après la manche, puis se retire avant la reprise.'},
    terminal:{place:'Réseau Bridges',material:'Quai de béton humide',ambience:'La porte lointaine et les témoins du quai ponctuent les intervalles.'},
    battlefield:{place:'Mémoire de Cliff',material:'Boue et planches',ambience:'Les ombres s’effacent dans la brume lorsque la manche prend fin.'},
    'mule-camp':{place:'Camp de récupération',material:'Gravier volcanique humide',ambience:'Sous la pluie, une impulsion discrète passe d’une balise à l’autre.'},
    'mule-camp-dry':{place:'Camp de récupération · temps sec',material:'Gravier sec et sol tassé',ambience:'Le vent soulève une poussière légère entre les tentes et les balises.'},
    'heartman-lab':{place:'Refuge de Heartman',material:'Parquet sombre',ambience:'Un moniteur de fond bat au rythme des intervalles du chercheur.'},
    'mama-workshop':{place:'Atelier de Bridges',material:'Béton d’atelier',ambience:'Un câble suspendu et la lumière de travail animent les travées.'},
    'ruined-factory':{place:'Complexe abandonné',material:'Béton ruisselant',ambience:'De fines poussières se détachent des conduites et du plafond.'},
    'timefall-shelter':{place:'Halte des porteurs',material:'Roche détrempée',ambience:'Le ruissellement suit la rive de l’auvent, à la limite du sec.'},
    'tar-basin':{place:'Vestiges industriels',material:'Quai sombre',ambience:'Des bulles éclatent à distance de la piste, dans le goudron.'},
    'mountain-pass':{place:'Col de Mountain Knot',material:'Neige tassée',ambience:'Le vent soulève de la poudrerie le long des reliefs.'},
    'port-knot':{place:'Région Est · quai portuaire',material:'Béton humide',ambience:'La baie et les grues s’effacent dans la brume au pied des falaises.'},
    incinerator:{place:'Région Est · aire de service',material:'Béton usé et mousse',ambience:'Les câbles de la cheminée se découpent sur le ciel couvert.'}
  };
  const modes = {story:'Histoire', arcade:'Arcade', versus:'Versus', tournament:'Tournoi', training:'Entraînement', challenges:'Défis'};
  window.StrandContent = {fighters, stages, arenas, stageDetails, modes};
})();

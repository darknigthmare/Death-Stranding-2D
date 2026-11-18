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
    story:'L’inventaire du matin', route:[['fragile','mule-camp'],['higgs','terminal'],['sam','mule-camp']],
    scenes:{
      intro:['Dernière ligne','Une caisse vide vaut plus que tout le stock. Fragile attend sa livraison devant la tente. L’opérateur soulève la caisse et colle l’oreille au couvercle. Une voix lui demande de lui rendre son nom.'],
      rival:['Le numéro de manche','Sam vient chercher le carton. Par réflexe, l’opérateur passe le lecteur sur sa propre manche. Le numéro correspond à celui du colis. Il pose le lecteur sur le couvercle. Pour une fois, il sait à qui cette caisse appartient.'],
      ending:['Registre des départs','Au matin, chaque caisse est à sa place. La case du propriétaire reste vide. Hors de la clôture, l’opérateur retire l’étiquette de sa manche. Sa main hésite, puis il écrit son nom au bas du registre des départs.']
    }
  };
  const arenas = {
    shore:{title:'La Grève', sky:'#668184', light:'#d3d0aa', weather:'rain'},
    terminal:{title:'Centre de distribution', sky:'#4e727e', light:'#a6d2d8', weather:'rain'},
    battlefield:{title:'Champ de bataille', sky:'#816e69', light:'#e2b58a', weather:'embers'},
    'mule-camp':{title:'Camp des MULEs', sky:'#777961', light:'#d8c38b', weather:'dust'},
    'heartman-lab':{title:'Laboratoire de Heartman', sky:'#505c66', light:'#a7cad7'},
    'mama-workshop':{title:'Atelier de Mama', sky:'#5c6865', light:'#acc9be'},
    'ruined-factory':{title:'Usine en ruines', sky:'#53595d', light:'#bcafb0', weather:'dust'},
    'timefall-shelter':{title:'Abri sous la pluie temporelle', sky:'#526366', light:'#b5d7d7', weather:'shelter'},
    'tar-basin':{title:'Bassin de goudron', sky:'#555859', light:'#d4bc9d'},
    'mountain-pass':{title:'Col de Mountain Knot', sky:'#758995', light:'#e0edf0', weather:'snow'}
  };
  const stages = Object.fromEntries(Object.entries(arenas).map(([id,arena]) => [id,arena.title]));
  const modes = {story:'Histoire', arcade:'Arcade', versus:'Versus', tournament:'Tournoi', training:'Entraînement'};
  window.StrandContent = {fighters, stages, arenas, modes};
})();

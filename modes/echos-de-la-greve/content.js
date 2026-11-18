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
  const stages = {shore:'La Grève', terminal:'Centre de distribution', battlefield:'Champ de bataille'};
  const modes = {story:'Histoire', arcade:'Arcade', versus:'Versus', tournament:'Tournoi', training:'Entraînement'};
  window.StrandContent = {fighters, stages, modes};
})();

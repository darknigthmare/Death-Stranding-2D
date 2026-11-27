/* Read-only duel reference. Regenerate with outils/generer_catalogue_combat.cjs. */
(function(host){'use strict';
const data={
  "schema": 1,
  "date": "2026-11-27",
  "engine": "StrandFight",
  "source": {
    "file": "modes/echos-de-la-greve/fight.js",
    "sha256": "6be07ea82a834d18cc0f72381fb1c5be44643ae104cc47556bc22cd04570cbc6",
    "content_sha256": "fe6e129844908ad3a0fa97d9e59cace35b1fb4c4cc54ba095de401bcac189578",
    "base": "2250b7c1b54b445637e0c9354133e6fecbc325de",
    "method": "Constantes réelles extraites via VM ; hook de lecture en mémoire, aucun fichier moteur modifié."
  },
  "units": "Pas de simulation à 60 Hz ; unités de la scène 1280 × 720.",
  "raw": {
    "roster": {
      "sam": {
        "name": "Sam Porter Bridges",
        "short": "SAM",
        "suit": "#365570",
        "cloth": "#506e85",
        "trim": "#ffad57",
        "metal": "#a8c5cd",
        "skin": "#c0947e",
        "h": 176,
        "speed": 4.4,
        "power": 1,
        "move": "Bola de liaison",
        "end": "Cargaison sécurisée"
      },
      "higgs": {
        "name": "Higgs Monaghan",
        "short": "HIGGS",
        "suit": "#292936",
        "cloth": "#46414b",
        "trim": "#d8a34a",
        "metal": "#ecd08b",
        "skin": "#bd9a56",
        "h": 184,
        "speed": 4.05,
        "power": 1.06,
        "move": "Marée noire",
        "end": "Rideau de goudron"
      },
      "fragile": {
        "name": "Fragile",
        "short": "FRAGILE",
        "suit": "#283946",
        "cloth": "#3f5362",
        "trim": "#a9e6ee",
        "metal": "#b2cbd0",
        "skin": "#d0a28e",
        "h": 166,
        "speed": 4.95,
        "power": 0.94,
        "move": "Pas de Grève",
        "end": "Dernier saut"
      },
      "cliff": {
        "name": "Cliff Unger",
        "short": "CLIFF",
        "suit": "#3c493d",
        "cloth": "#59614c",
        "trim": "#f09c66",
        "metal": "#a5aa89",
        "skin": "#bf9783",
        "h": 179,
        "speed": 4.2,
        "power": 1.03,
        "move": "Écho de section",
        "end": "Rappel de section"
      },
      "mule": {
        "name": "Porteur MULE",
        "short": "MULE",
        "suit": "#9f7134",
        "cloth": "#4f4536",
        "trim": "#f5bd58",
        "metal": "#a19c8a",
        "skin": "#b59170",
        "h": 177,
        "speed": 4.25,
        "power": 1,
        "move": "Balayage de capteur",
        "end": "Hors inventaire"
      },
      "diehardman": {
        "name": "Die-Hardman",
        "short": "DIE-HARDMAN",
        "suit": "#282e32",
        "cloth": "#485456",
        "trim": "#b7c6b4",
        "metal": "#a1a8a4",
        "skin": "#7f5c4d",
        "h": 181,
        "speed": 4.1,
        "power": 1.02,
        "move": "Ordre de maintien",
        "end": "Levée de consigne"
      },
      "mama": {
        "name": "Mama",
        "short": "MAMA",
        "suit": "#495c66",
        "cloth": "#617788",
        "trim": "#80d9d4",
        "metal": "#b6c4cd",
        "skin": "#bc9a81",
        "h": 170,
        "speed": 4.4,
        "power": 0.96,
        "move": "Point d’ancrage",
        "end": "Travée de retour"
      },
      "heartman": {
        "name": "Heartman",
        "short": "HEARTMAN",
        "suit": "#343f48",
        "cloth": "#485869",
        "trim": "#df9687",
        "metal": "#a6b6bd",
        "skin": "#c3a68e",
        "h": 176,
        "speed": 4.15,
        "power": 0.96,
        "move": "Impulsion témoin",
        "end": "Intervalle"
      }
    },
    "moves": {
      "light": {
        "start": 5,
        "active": 3,
        "recover": 10,
        "reach": 81,
        "low": 39,
        "high": 112,
        "damage": 5,
        "balance": 9,
        "stun": 12,
        "push": 5
      },
      "heavy": {
        "start": 14,
        "active": 4,
        "recover": 19,
        "reach": 111,
        "low": 63,
        "high": 152,
        "damage": 12,
        "balance": 20,
        "stun": 21,
        "push": 10
      },
      "sweep": {
        "start": 8,
        "active": 4,
        "recover": 16,
        "reach": 110,
        "low": 3,
        "high": 44,
        "damage": 7,
        "balance": 13,
        "stun": 16,
        "push": 7
      },
      "lift": {
        "start": 12,
        "active": 4,
        "recover": 22,
        "reach": 78,
        "low": 12,
        "high": 124,
        "damage": 10,
        "balance": 17,
        "stun": 22,
        "push": 4,
        "launch": 7
      },
      "air": {
        "start": 7,
        "active": 6,
        "recover": 15,
        "reach": 94,
        "low": 6,
        "high": 105,
        "damage": 8,
        "balance": 12,
        "stun": 15,
        "push": 7
      },
      "grab": {
        "start": 7,
        "active": 2,
        "recover": 24,
        "reach": 56,
        "low": 14,
        "high": 115,
        "damage": 10,
        "balance": 23,
        "stun": 21,
        "push": 13,
        "grab": true
      },
      "sam": {
        "start": 16,
        "active": 1,
        "recover": 23,
        "cost": 28
      },
      "higgs": {
        "start": 25,
        "active": 5,
        "recover": 20,
        "cost": 28
      },
      "fragile": {
        "start": 12,
        "active": 4,
        "recover": 18,
        "reach": 85,
        "low": 21,
        "high": 139,
        "damage": 13,
        "balance": 18,
        "stun": 20,
        "push": 9,
        "cost": 28
      },
      "cliff": {
        "start": 17,
        "active": 9,
        "recover": 21,
        "cost": 28
      },
      "brace": {
        "name": "Reprise d’appui",
        "start": 8,
        "active": 6,
        "recover": 18,
        "cost": 14
      },
      "parry": {
        "name": "Parade au lien",
        "start": 4,
        "active": 5,
        "recover": 25,
        "cost": 18
      },
      "fan": {
        "name": "Éventail de pluie",
        "start": 11,
        "active": 4,
        "recover": 20,
        "cost": 18,
        "reach": 114,
        "low": 118,
        "high": 217,
        "damage": 9,
        "balance": 14,
        "stun": 18,
        "push": 5,
        "launch": 5
      },
      "beacon": {
        "name": "Point de retour",
        "start": 15,
        "active": 1,
        "recover": 13,
        "cost": 16
      },
      "mine": {
        "name": "Empreinte d’or",
        "start": 18,
        "active": 1,
        "recover": 16,
        "cost": 21
      },
      "feint": {
        "name": "Faux départ",
        "start": 9,
        "active": 10,
        "recover": 20,
        "cost": 14
      },
      "post": {
        "name": "Poste avancé",
        "start": 19,
        "active": 1,
        "recover": 15,
        "cost": 18
      },
      "recall": {
        "name": "Rappel de section",
        "start": 12,
        "active": 1,
        "recover": 22,
        "cost": 16
      },
      "mule": {
        "name": "Balayage de capteur",
        "start": 18,
        "active": 12,
        "recover": 17,
        "cost": 28
      },
      "crate": {
        "name": "Consigne mobile",
        "start": 16,
        "active": 1,
        "recover": 18,
        "cost": 18
      },
      "retrieve": {
        "name": "Saisie de lot",
        "start": 13,
        "active": 3,
        "recover": 24,
        "cost": 16
      },
      "diehardman": {
        "name": "Ordre de maintien",
        "start": 11,
        "active": 5,
        "recover": 21,
        "cost": 28
      },
      "gate": {
        "name": "Ligne d’arrêt",
        "start": 17,
        "active": 6,
        "recover": 22,
        "cost": 18
      },
      "relief": {
        "name": "Relève",
        "start": 8,
        "active": 4,
        "recover": 16,
        "cost": 16,
        "reach": 77,
        "low": 48,
        "high": 109,
        "damage": 7,
        "balance": 14,
        "stun": 14,
        "push": 6
      },
      "mama": {
        "name": "Point d’ancrage",
        "start": 18,
        "active": 1,
        "recover": 16,
        "cost": 28
      },
      "deck": {
        "name": "Tablier",
        "start": 16,
        "active": 10,
        "recover": 21,
        "cost": 18
      },
      "winch": {
        "name": "Treuil",
        "start": 12,
        "active": 8,
        "recover": 15,
        "cost": 16
      },
      "heartman": {
        "name": "Impulsion témoin",
        "start": 15,
        "active": 16,
        "recover": 18,
        "cost": 28
      },
      "memory": {
        "name": "Mémoire de phase",
        "start": 14,
        "active": 1,
        "recover": 17,
        "cost": 18
      },
      "syncope": {
        "name": "Syncope du signal",
        "start": 10,
        "active": 6,
        "recover": 24,
        "cost": 16
      }
    },
    "shotHit": {
      "sam": {
        "damage": 10,
        "balance": 17,
        "stun": 26,
        "push": 3
      },
      "higgs": {
        "damage": 14,
        "balance": 21,
        "stun": 23,
        "push": 6,
        "launch": 6
      },
      "cliff": {
        "damage": 5,
        "balance": 9,
        "stun": 11,
        "push": 4
      },
      "mine": {
        "damage": 6,
        "balance": 12,
        "stun": 15,
        "push": 5,
        "level": "low"
      },
      "recall": {
        "damage": 8,
        "balance": 15,
        "stun": 16,
        "push": 4,
        "launch": 7
      },
      "crate": {
        "damage": 6,
        "balance": 11,
        "stun": 12,
        "push": 4,
        "level": "low"
      },
      "retrieve": {
        "damage": 7,
        "balance": 13,
        "stun": 14,
        "push": 4,
        "level": "low"
      },
      "gate": {
        "damage": 8,
        "balance": 16,
        "stun": 15,
        "push": 7
      },
      "deck": {
        "damage": 9,
        "balance": 16,
        "stun": 14,
        "push": 6
      },
      "heartman": {
        "damage": 7,
        "balance": 12,
        "stun": 12,
        "push": 5
      },
      "memory": {
        "damage": 8,
        "balance": 15,
        "stun": 14,
        "push": 6
      }
    },
    "directional": {
      "sam": {
        "forward": "brace",
        "back": "parry"
      },
      "fragile": {
        "forward": "fan",
        "back": "beacon"
      },
      "higgs": {
        "forward": "mine",
        "back": "feint"
      },
      "cliff": {
        "forward": "post",
        "back": "recall"
      },
      "mule": {
        "forward": "crate",
        "back": "retrieve"
      },
      "diehardman": {
        "forward": "gate",
        "back": "relief"
      },
      "mama": {
        "forward": "deck",
        "back": "winch"
      },
      "heartman": {
        "forward": "memory",
        "back": "syncope"
      }
    },
    "commonAttackNames": {
      "light": "Coup léger",
      "heavy": "Coup lourd",
      "sweep": "Balayage",
      "lift": "Coup montant",
      "air": "Frappe aérienne",
      "grab": "Projection"
    },
    "keyActions": [
      "left",
      "right",
      "up",
      "down",
      "light",
      "heavy",
      "special",
      "guard",
      "throw",
      "finish"
    ],
    "tauntRules": {
      "entry": 10,
      "hold": 28,
      "exit": 16,
      "total": 54
    }
  },
  "actions": [
    {
      "id": "MOVE:common:light",
      "engineAction": "light",
      "owner": "common",
      "name": "Coup léger",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Interruption à courte portée",
      "command": "Léger",
      "startup": 5,
      "active": 3,
      "recovery": 10,
      "cost": 0,
      "baseDamage": 5,
      "hits": 1,
      "damage": "5 de base",
      "damageContext": null,
      "range": "81 px depuis le centre ; bande verticale 39–112 au-dessus des pieds.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Après touche confirmée et fin de l’activité → Lourd (ou montant si Bas) / Spécial",
      "notes": [
        "Une seule touche par action. Après touche confirmée : annulation vers Lourd ou Spécial à la fin de l’activité."
      ],
      "nominal": {
        "start": 5,
        "active": 3,
        "recover": 10,
        "reach": 81,
        "low": 39,
        "high": 112,
        "damage": 5,
        "balance": 9,
        "stun": 12,
        "push": 5
      },
      "hitProfile": {
        "start": 5,
        "active": 3,
        "recover": 10,
        "reach": 81,
        "low": 39,
        "high": 112,
        "damage": 5,
        "balance": 9,
        "stun": 12,
        "push": 5
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 5,
        "lastActive": 7,
        "clearAt": 19,
        "nextUncancelledStartAt": 20,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -3,
        "onHitLast": -1,
        "onBlockFirst": -6,
        "onBlockLast": -4
      },
      "cancelRules": {
        "inputActions": [
          "heavy",
          "special"
        ],
        "onHitOnly": true,
        "fromFrame": 8
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:common:heavy",
      "engineAction": "heavy",
      "owner": "common",
      "name": "Coup lourd",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Frappe engagée et poussée de caisse",
      "command": "Lourd",
      "startup": 14,
      "active": 4,
      "recovery": 19,
      "cost": 0,
      "baseDamage": 12,
      "hits": 1,
      "damage": "12 de base",
      "damageContext": null,
      "range": "111 px ; bande 63–152. Avance de 12 px au pas 11, ou 6 pour Die-Hardman.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Après touche confirmée et fin de l’activité → Spécial",
      "notes": [
        "Une seule touche. À t=14, pousse la caisse MULE immobile située de −12 à 111 px vers l’avant ; déplacement ultérieur de 112 px au plus."
      ],
      "nominal": {
        "start": 14,
        "active": 4,
        "recover": 19,
        "reach": 111,
        "low": 63,
        "high": 152,
        "damage": 12,
        "balance": 20,
        "stun": 21,
        "push": 10
      },
      "hitProfile": {
        "start": 14,
        "active": 4,
        "recover": 19,
        "reach": 111,
        "low": 63,
        "high": 152,
        "damage": 12,
        "balance": 20,
        "stun": 21,
        "push": 10
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 14,
        "lastActive": 17,
        "clearAt": 38,
        "nextUncancelledStartAt": 39,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -4,
        "onHitLast": -1,
        "onBlockFirst": -16,
        "onBlockLast": -13
      },
      "cancelRules": {
        "inputActions": [
          "special"
        ],
        "onHitOnly": true,
        "fromFrame": 18
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:common:sweep",
      "engineAction": "sweep",
      "owner": "common",
      "name": "Balayage",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Attaque basse",
      "command": "Bas + Léger",
      "startup": 8,
      "active": 4,
      "recovery": 16,
      "cost": 0,
      "baseDamage": 7,
      "hits": 1,
      "damage": "7 de base",
      "damageContext": null,
      "range": "110 px ; bande 3–44.",
      "guard": "Garde accroupie uniquement.",
      "cancel": "Après touche confirmée et fin de l’activité → Spécial",
      "notes": [
        "Bas est lu au déclenchement effectif, pas mémorisé avec le bouton."
      ],
      "nominal": {
        "start": 8,
        "active": 4,
        "recover": 16,
        "reach": 110,
        "low": 3,
        "high": 44,
        "damage": 7,
        "balance": 13,
        "stun": 16,
        "push": 7
      },
      "hitProfile": {
        "start": 8,
        "active": 4,
        "recover": 16,
        "reach": 110,
        "low": 3,
        "high": 44,
        "damage": 7,
        "balance": 13,
        "stun": 16,
        "push": 7
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 8,
        "lastActive": 11,
        "clearAt": 29,
        "nextUncancelledStartAt": 30,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -6,
        "onHitLast": -3,
        "onBlockFirst": -13,
        "onBlockLast": -10
      },
      "cancelRules": {
        "inputActions": [
          "special"
        ],
        "onHitOnly": true,
        "fromFrame": 12
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:common:lift",
      "engineAction": "lift",
      "owner": "common",
      "name": "Coup montant",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Frappe montante",
      "command": "Bas + Lourd",
      "startup": 12,
      "active": 4,
      "recovery": 22,
      "cost": 0,
      "baseDamage": 10,
      "hits": 1,
      "damage": "10 de base",
      "damageContext": null,
      "range": "78 px ; bande 12–124.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Après touche confirmée et fin de l’activité → Spécial",
      "notes": [
        "Sur touche, vitesse verticale adverse de 7. Aucun plafond de relancement ou réduction de combo dédié dans ce moteur."
      ],
      "nominal": {
        "start": 12,
        "active": 4,
        "recover": 22,
        "reach": 78,
        "low": 12,
        "high": 124,
        "damage": 10,
        "balance": 17,
        "stun": 22,
        "push": 4,
        "launch": 7
      },
      "hitProfile": {
        "start": 12,
        "active": 4,
        "recover": 22,
        "reach": 78,
        "low": 12,
        "high": 124,
        "damage": 10,
        "balance": 17,
        "stun": 22,
        "push": 4,
        "launch": 7
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 12,
        "lastActive": 15,
        "clearAt": 39,
        "nextUncancelledStartAt": 40,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -6,
        "onHitLast": -3,
        "onBlockFirst": -19,
        "onBlockLast": -16
      },
      "cancelRules": {
        "inputActions": [
          "special"
        ],
        "onHitOnly": true,
        "fromFrame": 16
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:common:air",
      "engineAction": "air",
      "owner": "common",
      "name": "Frappe aérienne",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Attaque aérienne haute",
      "command": "Léger ou Lourd en l’air",
      "startup": 7,
      "active": 6,
      "recovery": 15,
      "cost": 0,
      "baseDamage": 8,
      "hits": 1,
      "damage": "8 de base",
      "damageContext": null,
      "range": "94 px ; bande 6–105 relative aux pieds en l’air.",
      "guard": "Garde debout uniquement.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Léger et Lourd donnent la même frappe aérienne. Une seule touche ; atterrir ne crée pas de récupération distincte."
      ],
      "nominal": {
        "start": 7,
        "active": 6,
        "recover": 15,
        "reach": 94,
        "low": 6,
        "high": 105,
        "damage": 8,
        "balance": 12,
        "stun": 15,
        "push": 7
      },
      "hitProfile": {
        "start": 7,
        "active": 6,
        "recover": 15,
        "reach": 94,
        "low": 6,
        "high": 105,
        "damage": 8,
        "balance": 12,
        "stun": 15,
        "push": 7
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 7,
        "lastActive": 12,
        "clearAt": 29,
        "nextUncancelledStartAt": 30,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -8,
        "onHitLast": -3,
        "onBlockFirst": -14,
        "onBlockLast": -9
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 13
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:common:grab",
      "engineAction": "grab",
      "owner": "common",
      "name": "Projection",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Réponse à la garde au sol",
      "command": "Projection",
      "startup": 7,
      "active": 2,
      "recovery": 24,
      "cost": 0,
      "baseDamage": 10,
      "hits": 1,
      "damage": "10 de base",
      "damageContext": null,
      "range": "56 px ; bande 14–115.",
      "guard": "Traverse la garde ; cible au sol, hors stun de touche et invulnérabilité.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Pas de déchope dédiée. Le blockstun n’est pas exclu par le test de prise. Inflige une frappe et du recul, sans transport automatique de la cible."
      ],
      "nominal": {
        "start": 7,
        "active": 2,
        "recover": 24,
        "reach": 56,
        "low": 14,
        "high": 115,
        "damage": 10,
        "balance": 23,
        "stun": 21,
        "push": 13,
        "grab": true
      },
      "hitProfile": {
        "start": 7,
        "active": 2,
        "recover": 24,
        "reach": 56,
        "low": 14,
        "high": 115,
        "damage": 10,
        "balance": 23,
        "stun": 21,
        "push": 13,
        "grab": true
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 7,
        "lastActive": 8,
        "clearAt": 34,
        "nextUncancelledStartAt": 35,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -7,
        "onHitLast": -6,
        "onBlockFirst": null,
        "onBlockLast": null
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 9
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:sam:sam",
      "engineAction": "sam",
      "owner": "sam",
      "name": "Bola de liaison",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Projectile de liaison",
      "command": "Spécial neutre",
      "startup": 16,
      "active": 1,
      "recovery": 23,
      "cost": 28,
      "baseDamage": 10,
      "hits": 1,
      "damage": "10 de base",
      "damageContext": null,
      "range": "Origine +37, hauteur 87 ; vitesse 12 px/pas, durée 76, boîte 26×18.",
      "guard": "Garde debout ou accroupie ; pas d’interception par contre de mêlée.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Émission à t=16. La phase active nominale ne limite pas le vol ; un projectile déjà émis subsiste après interruption du porteur."
      ],
      "nominal": {
        "start": 16,
        "active": 1,
        "recover": 23,
        "cost": 28
      },
      "hitProfile": {
        "damage": 10,
        "balance": 17,
        "stun": 26,
        "push": 3
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 16,
        "lastActive": 16,
        "clearAt": 41,
        "nextUncancelledStartAt": 42,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 17
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:higgs:higgs",
      "engineAction": "higgs",
      "owner": "higgs",
      "name": "Marée noire",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Zone à une position mémorisée",
      "command": "Spécial neutre",
      "startup": 25,
      "active": 5,
      "recovery": 20,
      "cost": 28,
      "baseDamage": 14,
      "hits": 1,
      "damage": "14 de base",
      "damageContext": null,
      "range": "X adverse mémorisé à l’entrée, borné 48–1232 ; centre à 49 px du sol, boîte 86×102.",
      "guard": "Garde debout ou accroupie ; pas de niveau bas malgré le visuel au sol.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Émission à t=25, durée 6. La zone vise l’ancienne position ; une seule touche au maximum."
      ],
      "nominal": {
        "start": 25,
        "active": 5,
        "recover": 20,
        "cost": 28
      },
      "hitProfile": {
        "damage": 14,
        "balance": 21,
        "stun": 23,
        "push": 6,
        "launch": 6
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 25,
        "lastActive": 29,
        "clearAt": 51,
        "nextUncancelledStartAt": 52,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 30
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:fragile:fragile",
      "engineAction": "fragile",
      "owner": "fragile",
      "name": "Pas de Grève",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Approche et frappe",
      "command": "Spécial neutre",
      "startup": 12,
      "active": 4,
      "recovery": 18,
      "cost": 28,
      "baseDamage": 13,
      "hits": 1,
      "damage": "13 de base",
      "damageContext": null,
      "range": "85 px ; bande 21–139. À t=8 : avance au plus 158 px, jusqu’à 52 px de la position adverse mesurée.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Invulnérabilité à t=6–10 inclus ; frappe à t=12–15. Aucun changement de côté garanti."
      ],
      "nominal": {
        "start": 12,
        "active": 4,
        "recover": 18,
        "reach": 85,
        "low": 21,
        "high": 139,
        "damage": 13,
        "balance": 18,
        "stun": 20,
        "push": 9,
        "cost": 28
      },
      "hitProfile": {
        "start": 12,
        "active": 4,
        "recover": 18,
        "reach": 85,
        "low": 21,
        "high": 139,
        "damage": 13,
        "balance": 18,
        "stun": 20,
        "push": 9,
        "cost": 28
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 12,
        "lastActive": 15,
        "clearAt": 35,
        "nextUncancelledStartAt": 36,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -4,
        "onHitLast": -1,
        "onBlockFirst": -15,
        "onBlockLast": -12
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 16
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:cliff:cliff",
      "engineAction": "cliff",
      "owner": "cliff",
      "name": "Écho de section",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Deux traits étagés",
      "command": "Spécial neutre",
      "startup": 17,
      "active": 9,
      "recovery": 21,
      "cost": 28,
      "baseDamage": 5,
      "hits": 2,
      "damage": "5 de base par trait, jusqu’à deux traits",
      "damageContext": null,
      "range": "Origine +36 ; hauteurs 97 puis 53 ; vitesse 13, durée 62 par trait, boîte 26×18.",
      "guard": "Garde debout ou accroupie pour les deux traits.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Émissions à t=17 et 25. Une interruption avant la seconde l’empêche ; les traits déjà émis subsistent. Jusqu’à deux touches, cinq PV de base chacune."
      ],
      "nominal": {
        "start": 17,
        "active": 9,
        "recover": 21,
        "cost": 28
      },
      "hitProfile": {
        "damage": 5,
        "balance": 9,
        "stun": 11,
        "push": 4
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 17,
        "lastActive": 25,
        "clearAt": 48,
        "nextUncancelledStartAt": 49,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 26
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:sam:brace",
      "engineAction": "brace",
      "owner": "sam",
      "name": "Reprise d’appui",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Interception ciblée",
      "command": "Avant + Spécial",
      "startup": 8,
      "active": 6,
      "recovery": 18,
      "cost": 14,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Contact de mêlée reçu pendant t=8–13.",
      "guard": "Intercepte seulement Coup léger ; pas les projectiles, prises ou autres mêlées.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Une interception au maximum. Aucun dégât ou stun infligé à l’attaquant ; contact consommé, puis récupération de la défense."
      ],
      "nominal": {
        "name": "Reprise d’appui",
        "start": 8,
        "active": 6,
        "recover": 18,
        "cost": 14
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 8,
        "lastActive": 13,
        "clearAt": 33,
        "nextUncancelledStartAt": 34,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 14
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:sam:parry",
      "engineAction": "parry",
      "owner": "sam",
      "name": "Parade au lien",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Parade et changement de côté",
      "command": "Arrière + Spécial",
      "startup": 4,
      "active": 5,
      "recovery": 25,
      "cost": 18,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Contact de mêlée reçu pendant t=4–8.",
      "guard": "Intercepte les mêlées sauf Projection ; aucun projectile.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Échange les positions, réoriente les combattants et impose au moins 15 pas de stun à l’attaquant ; une interception, aucun dégât direct."
      ],
      "nominal": {
        "name": "Parade au lien",
        "start": 4,
        "active": 5,
        "recover": 25,
        "cost": 18
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 4,
        "lastActive": 8,
        "clearAt": 35,
        "nextUncancelledStartAt": 36,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 9
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:fragile:fan",
      "engineAction": "fan",
      "owner": "fragile",
      "name": "Éventail de pluie",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Frappe haute anti-saut",
      "command": "Avant + Spécial",
      "startup": 11,
      "active": 4,
      "recovery": 20,
      "cost": 18,
      "baseDamage": 9,
      "hits": 1,
      "damage": "9 de base",
      "damageContext": null,
      "range": "114 px ; bande 118–217.",
      "guard": "Garde debout ou accroupie si la zone touche ; aucun niveau overhead dédié.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Le volume peut passer au-dessus d’une petite cible accroupie. Sur touche : vitesse verticale adverse 5."
      ],
      "nominal": {
        "name": "Éventail de pluie",
        "start": 11,
        "active": 4,
        "recover": 20,
        "cost": 18,
        "reach": 114,
        "low": 118,
        "high": 217,
        "damage": 9,
        "balance": 14,
        "stun": 18,
        "push": 5,
        "launch": 5
      },
      "hitProfile": {
        "name": "Éventail de pluie",
        "start": 11,
        "active": 4,
        "recover": 20,
        "cost": 18,
        "reach": 114,
        "low": 118,
        "high": 217,
        "damage": 9,
        "balance": 14,
        "stun": 18,
        "push": 5,
        "launch": 5
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 11,
        "lastActive": 14,
        "clearAt": 36,
        "nextUncancelledStartAt": 37,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -8,
        "onHitLast": -5,
        "onBlockFirst": -17,
        "onBlockLast": -14
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 15
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:fragile:beacon",
      "engineAction": "beacon",
      "owner": "fragile",
      "name": "Point de retour",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Point de retour",
      "command": "Arrière + Spécial",
      "startup": 15,
      "active": 1,
      "recovery": 13,
      "cost": 16,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Pose à la position du porteur ; retour au marqueur lors du nouvel usage.",
      "guard": "Aucun contact offensif.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "À t=15, pose un marqueur pour 180 pas, ou le consomme pour revenir. Coût payé à chaque usage ; pas d’invulnérabilité dédiée dans le duel."
      ],
      "nominal": {
        "name": "Point de retour",
        "start": 15,
        "active": 1,
        "recover": 13,
        "cost": 16
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 15,
        "lastActive": 15,
        "clearAt": 30,
        "nextUncancelledStartAt": 31,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 16
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:higgs:mine",
      "engineAction": "mine",
      "owner": "higgs",
      "name": "Empreinte d’or",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Piège bas",
      "command": "Avant + Spécial",
      "startup": 18,
      "active": 1,
      "recovery": 16,
      "cost": 21,
      "baseDamage": 6,
      "hits": 1,
      "damage": "6 de base",
      "damageContext": null,
      "range": "Pose +55, bornée 48–1232 ; X ±22 ; de 23 px au-dessus du sol à 1 px au-dessous.",
      "guard": "Garde accroupie uniquement.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Pose à t=18, durée 150. Armement quand ttl ≤130, après 20 mises à jour. Un seul marqueur, remplacé par une nouvelle pose ; disparaît au contact."
      ],
      "nominal": {
        "name": "Empreinte d’or",
        "start": 18,
        "active": 1,
        "recover": 16,
        "cost": 21
      },
      "hitProfile": {
        "damage": 6,
        "balance": 12,
        "stun": 15,
        "push": 5,
        "level": "low"
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 18,
        "lastActive": 18,
        "clearAt": 36,
        "nextUncancelledStartAt": 37,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 19
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:higgs:feint",
      "engineAction": "feint",
      "owner": "higgs",
      "name": "Faux départ",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Recul",
      "command": "Arrière + Spécial",
      "startup": 9,
      "active": 10,
      "recovery": 20,
      "cost": 14,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "5,25 px de recul à chaque pas t=9–18 ; 52,5 px avant bornes et contacts de corps.",
      "guard": "Aucun contact offensif ; aucune invulnérabilité dédiée.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Le coût est payé même au bord. Origine conservée pour le dessin, sans retour automatique."
      ],
      "nominal": {
        "name": "Faux départ",
        "start": 9,
        "active": 10,
        "recover": 20,
        "cost": 14
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 9,
        "lastActive": 18,
        "clearAt": 40,
        "nextUncancelledStartAt": 41,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 19
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:cliff:post",
      "engineAction": "post",
      "owner": "cliff",
      "name": "Poste avancé",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Point d’émission",
      "command": "Avant + Spécial",
      "startup": 19,
      "active": 1,
      "recovery": 15,
      "cost": 18,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Pose +165, bornée 48–1232.",
      "guard": "Aucun contact offensif.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "À t=19, poste pour 160 pas ; un seul marqueur. Ne crée aucune IA de soldat autonome."
      ],
      "nominal": {
        "name": "Poste avancé",
        "start": 19,
        "active": 1,
        "recover": 15,
        "cost": 18
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 19,
        "lastActive": 19,
        "clearAt": 36,
        "nextUncancelledStartAt": 37,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 20
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:cliff:recall",
      "engineAction": "recall",
      "owner": "cliff",
      "name": "Rappel de section",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Colonne montante au poste",
      "command": "Arrière + Spécial",
      "startup": 12,
      "active": 1,
      "recovery": 22,
      "cost": 16,
      "baseDamage": 8,
      "hits": 1,
      "damage": "8 de base",
      "damageContext": null,
      "range": "Au poste : centre initial à 15 px du sol, montée de 16 par pas pendant 6 pas, boîte 92×18.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "À t=12, consomme le poste et émet. Sans poste : coût de 16 quand même payé, action jouée et notice AUCUN POSTE. Sur touche : lancement vertical 7."
      ],
      "nominal": {
        "name": "Rappel de section",
        "start": 12,
        "active": 1,
        "recover": 22,
        "cost": 16
      },
      "hitProfile": {
        "damage": 8,
        "balance": 15,
        "stun": 16,
        "push": 4,
        "launch": 7
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 12,
        "lastActive": 12,
        "clearAt": 36,
        "nextUncancelledStartAt": 37,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 13
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:mule:mule",
      "engineAction": "mule",
      "owner": "mule",
      "name": "Balayage de capteur",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Repérage sans dégâts",
      "command": "Spécial neutre",
      "startup": 18,
      "active": 12,
      "recovery": 17,
      "cost": 28,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Onde symétrique à t=18–29 : rayon=(t−18+1)×38 ; distance de rayon−61 à rayon+22, maximum 478.",
      "guard": "Toute garde active bloque le scan, sans perte de garde ajoutée.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Aucun PV, stun ou gain chiral de touche. Mémorise le X touché pendant 120 pas sans suivre ensuite la cible. Le test ne dépend pas de sa hauteur."
      ],
      "nominal": {
        "name": "Balayage de capteur",
        "start": 18,
        "active": 12,
        "recover": 17,
        "cost": 28
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 18,
        "lastActive": 29,
        "clearAt": 48,
        "nextUncancelledStartAt": 49,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 30
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:mule:crate",
      "engineAction": "crate",
      "owner": "mule",
      "name": "Consigne mobile",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Caisse à déplacer",
      "command": "Avant + Spécial",
      "startup": 16,
      "active": 1,
      "recovery": 18,
      "cost": 18,
      "baseDamage": 6,
      "hits": 1,
      "damage": "6 de base par poussée ; pose seule : 0",
      "damageContext": "par poussée ; pose seule : 0",
      "range": "Pose +86, bornée 48–1232 ; collision balayée de 42×21 au sol une fois déplacée.",
      "guard": "Caisse poussée : garde accroupie uniquement.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Pose à t=16, durée 180 ; pose seule sans dégâts. Coup lourd pousse à 10 px/pas sur 112 px maximum. Une touche par trajet ; caisse conservée à l’arrivée."
      ],
      "nominal": {
        "name": "Consigne mobile",
        "start": 16,
        "active": 1,
        "recover": 18,
        "cost": 18
      },
      "hitProfile": {
        "damage": 6,
        "balance": 11,
        "stun": 12,
        "push": 4,
        "level": "low"
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 16,
        "lastActive": 16,
        "clearAt": 36,
        "nextUncancelledStartAt": 37,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 17
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:mule:retrieve",
      "engineAction": "retrieve",
      "owner": "mule",
      "name": "Saisie de lot",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Rappel de caisse",
      "command": "Arrière + Spécial",
      "startup": 13,
      "active": 3,
      "recovery": 24,
      "cost": 16,
      "baseDamage": 7,
      "hits": 1,
      "damage": "7 de base",
      "damageContext": null,
      "range": "Trajet vers le X courant du porteur, 14 px/pas ; collision balayée 42×21 au sol.",
      "guard": "Garde accroupie uniquement.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Sans caisse ou rappel déjà actif : refus avant dépense. Durée protégée jusqu’au déclenchement, puis ne décroît pas pendant le rappel. Une touche par trajet ; disparition à l’arrivée."
      ],
      "nominal": {
        "name": "Saisie de lot",
        "start": 13,
        "active": 3,
        "recover": 24,
        "cost": 16
      },
      "hitProfile": {
        "damage": 7,
        "balance": 13,
        "stun": 14,
        "push": 4,
        "level": "low"
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 13,
        "lastActive": 15,
        "clearAt": 41,
        "nextUncancelledStartAt": 42,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 16
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:diehardman:diehardman",
      "engineAction": "diehardman",
      "owner": "diehardman",
      "name": "Ordre de maintien",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Contre médian et sceau",
      "command": "Spécial neutre",
      "startup": 11,
      "active": 5,
      "recovery": 21,
      "cost": 28,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Contact reçu pendant t=11–15.",
      "guard": "Intercepte light, heavy, lift, relief ou fragile en mêlée ; pas sweep, air, fan, prise ou projectile.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Une interception accorde un sceau pour 120 pas, annule l’action adverse et impose au moins 26 pas de stun. Aucun dégât direct."
      ],
      "nominal": {
        "name": "Ordre de maintien",
        "start": 11,
        "active": 5,
        "recover": 21,
        "cost": 28
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 11,
        "lastActive": 15,
        "clearAt": 38,
        "nextUncancelledStartAt": 39,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 16
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:diehardman:gate",
      "engineAction": "gate",
      "owner": "diehardman",
      "name": "Ligne d’arrêt",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Zone verticale",
      "command": "Avant + Spécial",
      "startup": 17,
      "active": 6,
      "recovery": 22,
      "cost": 18,
      "baseDamage": 8,
      "hits": 1,
      "damage": "8 de base",
      "damageContext": null,
      "range": "Centre +108 borné ; hauteur 72, boîte 36×144, immobile.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Émission à t=17 pour 6 pas, ou 8 si sceau présent à l’émission. Le sceau n’est pas consommé."
      ],
      "nominal": {
        "name": "Ligne d’arrêt",
        "start": 17,
        "active": 6,
        "recover": 22,
        "cost": 18
      },
      "hitProfile": {
        "damage": 8,
        "balance": 16,
        "stun": 15,
        "push": 7
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 17,
        "lastActive": 22,
        "clearAt": 46,
        "nextUncancelledStartAt": 47,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 23
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:diehardman:relief",
      "engineAction": "relief",
      "owner": "diehardman",
      "name": "Relève",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Recul puis reprise",
      "command": "Arrière + Spécial",
      "startup": 8,
      "active": 4,
      "recovery": 16,
      "cost": 16,
      "baseDamage": 7,
      "hits": 1,
      "damage": "7 de base",
      "damageContext": null,
      "range": "Recul de 2,5 px à t=1–7 ; portée 77, ou 121 avec sceau ; bande 48–109.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Sceau consommé dès le démarrage : portée +44, dégâts inchangés. Pas d’invulnérabilité dédiée dans le duel."
      ],
      "nominal": {
        "name": "Relève",
        "start": 8,
        "active": 4,
        "recover": 16,
        "cost": 16,
        "reach": 77,
        "low": 48,
        "high": 109,
        "damage": 7,
        "balance": 14,
        "stun": 14,
        "push": 6
      },
      "hitProfile": {
        "name": "Relève",
        "start": 8,
        "active": 4,
        "recover": 16,
        "cost": 16,
        "reach": 77,
        "low": 48,
        "high": 109,
        "damage": 7,
        "balance": 14,
        "stun": 14,
        "push": 6
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 8,
        "lastActive": 11,
        "clearAt": 29,
        "nextUncancelledStartAt": 30,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Sans annulation, rupture, interception ou déplacement ; contact imposé au premier/dernier pas actif, hitstop partagé exclu.",
        "onHitFirst": -8,
        "onHitLast": -5,
        "onBlockFirst": -13,
        "onBlockLast": -10
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 12
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit",
        "fight.js:strike"
      ]
    },
    {
      "id": "MOVE:mama:mama",
      "engineAction": "mama",
      "owner": "mama",
      "name": "Point d’ancrage",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Pose d’ancrage",
      "command": "Spécial neutre",
      "startup": 18,
      "active": 1,
      "recovery": 16,
      "cost": 28,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Pose +130, bornée 48–1232.",
      "guard": "Aucun contact offensif.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "À t=18, ancrage pour 200 pas. Ce marqueur n’est pas une plateforme de collision ni un personnage secondaire."
      ],
      "nominal": {
        "name": "Point d’ancrage",
        "start": 18,
        "active": 1,
        "recover": 16,
        "cost": 28
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 18,
        "lastActive": 18,
        "clearAt": 36,
        "nextUncancelledStartAt": 37,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 19
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:mama:deck",
      "engineAction": "deck",
      "owner": "mama",
      "name": "Tablier",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Projectile depuis ancrage ou porteur",
      "command": "Avant + Spécial",
      "startup": 16,
      "active": 10,
      "recovery": 21,
      "cost": 18,
      "baseDamage": 9,
      "hits": 1,
      "damage": "9 de base",
      "damageContext": null,
      "range": "À l’ancrage si présent, sinon au porteur ; hauteur 76 ; vitesse 7,2 avec ancrage, sinon 3,6 ; durée 10, boîte 26×18.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Émission à t=16. Conserve l’ancrage ; l’absence d’ancrage réduit la vitesse sans interdire la technique."
      ],
      "nominal": {
        "name": "Tablier",
        "start": 16,
        "active": 10,
        "recover": 21,
        "cost": 18
      },
      "hitProfile": {
        "damage": 9,
        "balance": 16,
        "stun": 14,
        "push": 6
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 16,
        "lastActive": 25,
        "clearAt": 48,
        "nextUncancelledStartAt": 49,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 26
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:mama:winch",
      "engineAction": "winch",
      "owner": "mama",
      "name": "Treuil",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Déplacement vers l’ancrage",
      "command": "Arrière + Spécial",
      "startup": 12,
      "active": 8,
      "recovery": 15,
      "cost": 16,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Interpolation vers l’ancrage sur 8 pas actifs à partir de t=12.",
      "guard": "Aucun contact offensif ni invulnérabilité dédiée.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Sans ancrage : refus avant dépense. Durée protégée au démarrage ; marqueur consommé à t=12. Bornes et contacts de corps continuent de s’appliquer."
      ],
      "nominal": {
        "name": "Treuil",
        "start": 12,
        "active": 8,
        "recover": 15,
        "cost": 16
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 12,
        "lastActive": 19,
        "clearAt": 36,
        "nextUncancelledStartAt": 37,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 20
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:heartman:heartman",
      "engineAction": "heartman",
      "owner": "heartman",
      "name": "Impulsion témoin",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Impulsion rythmée",
      "command": "Spécial neutre",
      "startup": 15,
      "active": 16,
      "recovery": 18,
      "cost": 28,
      "baseDamage": 7,
      "hits": 1,
      "damage": "7 de base",
      "damageContext": null,
      "range": "Origine au porteur, hauteur 83 ; vitesse 10 sur battement, sinon 7,5 ; durée 16, boîte 26×18.",
      "guard": "Garde debout ou accroupie.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Émet à t=15. Battement capturé à la saisie : beat ≤3 ou ≥57 dans un cycle de 60. Augmente la vitesse, pas les dégâts ; rythme propre au simulateur."
      ],
      "nominal": {
        "name": "Impulsion témoin",
        "start": 15,
        "active": 16,
        "recover": 18,
        "cost": 28
      },
      "hitProfile": {
        "damage": 7,
        "balance": 12,
        "stun": 12,
        "push": 5
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 15,
        "lastActive": 30,
        "clearAt": 50,
        "nextUncancelledStartAt": 51,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 31
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:heartman:memory",
      "engineAction": "memory",
      "owner": "heartman",
      "name": "Mémoire de phase",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Mémoire de position et impulsion",
      "command": "Avant + Spécial",
      "startup": 14,
      "active": 1,
      "recovery": 17,
      "cost": 18,
      "baseDamage": 8,
      "hits": 1,
      "damage": "8 de base à la seconde activation ; pose seule : 0",
      "damageContext": "à la seconde activation ; pose seule : 0",
      "range": "Première activation : marqueur au porteur. Seconde : centre au marqueur, hauteur 64, boîte 132×90, durée 8.",
      "guard": "Garde debout ou accroupie lors de l’impulsion.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "À t=14, pose une mémoire pour 120 pas, ou la consomme pour émettre. Coût 18 à chaque usage ; première activation sans dégâts."
      ],
      "nominal": {
        "name": "Mémoire de phase",
        "start": 14,
        "active": 1,
        "recover": 17,
        "cost": 18
      },
      "hitProfile": {
        "damage": 8,
        "balance": 15,
        "stun": 14,
        "push": 6
      },
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 14,
        "lastActive": 14,
        "clearAt": 33,
        "nextUncancelledStartAt": 34,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 15
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    },
    {
      "id": "MOVE:heartman:syncope",
      "engineAction": "syncope",
      "owner": "heartman",
      "name": "Syncope du signal",
      "version": "DS1 / Director’s Cut — kit du simulateur",
      "fidelity": "Nom et paramètres du projet ; aucune valeur numérique canonique affirmée.",
      "role": "Fenêtre d’invulnérabilité",
      "command": "Arrière + Spécial",
      "startup": 10,
      "active": 6,
      "recovery": 24,
      "cost": 16,
      "baseDamage": 0,
      "hits": 1,
      "damage": "Aucun dégât direct",
      "damageContext": null,
      "range": "Aucun déplacement ou volume offensif propre.",
      "guard": "Invulnérabilité à t=10–15 inclus.",
      "cancel": "Aucune annulation offensive dédiée.",
      "notes": [
        "Défense payante, sans riposte ni recul dans le duel ; début et récupération vulnérables."
      ],
      "nominal": {
        "name": "Syncope du signal",
        "start": 10,
        "active": 6,
        "recover": 24,
        "cost": 16
      },
      "hitProfile": null,
      "timing": {
        "unit": "pas à 60 Hz hors hitstop",
        "firstActive": 10,
        "lastActive": 15,
        "clearAt": 41,
        "nextUncancelledStartAt": 42,
        "convention": "t commence à 0 puis augmente avant les contacts. Suppression pour t > S+A+R ; prochaine action au pas suivant. R est une valeur nominale."
      },
      "advantage": {
        "scope": "Variable selon trajet, déclenchement, interception ou absence de contact ; aucun chiffre universel."
      },
      "cancelRules": {
        "inputActions": [],
        "onHitOnly": true,
        "fromFrame": 16
      },
      "sources": [
        "fight.js:moves",
        "fight.js:beginAttack",
        "fight.js:updateFighter",
        "fight.js:stepDirectional",
        "fight.js:contacts",
        "fight.js:hit"
      ]
    }
  ],
  "fighters": {
    "sam": {
      "id": "sam",
      "name": "Sam Porter Bridges",
      "version": "DS1 / Director’s Cut",
      "summary": "Attends que la cible s’engage, puis lance le bola pour interrompre son approche.",
      "height": 176,
      "speed": 4.4,
      "power": 1,
      "techniqueIds": [
        "sam",
        "brace",
        "parry"
      ],
      "ai": {
        "summary": "Branche générique : approche, projectile neutre à distance, choix directionnels proches aux difficultés 1/2. Aucun diagnostic spécialisé de parade.",
        "notes": []
      }
    },
    "higgs": {
      "id": "higgs",
      "name": "Higgs Monaghan",
      "version": "DS1 / Director’s Cut",
      "summary": "La marée s’ouvre à l’endroit où ton adversaire se trouvait au début du geste. Provoque un arrêt avant de l’appeler.",
      "height": 184,
      "speed": 4.05,
      "power": 1.06,
      "techniqueIds": [
        "higgs",
        "mine",
        "feint"
      ],
      "ai": {
        "summary": "À distance, peut poser une mine si aucun marqueur, sur un tirage conditionnel de 45 % ; sinon attaque neutre. Aucun placement optimal du piège calculé.",
        "notes": []
      }
    },
    "fragile": {
      "id": "fragile",
      "name": "Fragile",
      "version": "DS1 / Director’s Cut",
      "summary": "Utilise ton saut de Grève pour fermer la distance pendant la récupération d’un coup adverse.",
      "height": 166,
      "speed": 4.95,
      "power": 0.94,
      "techniqueIds": [
        "fragile",
        "fan",
        "beacon"
      ],
      "ai": {
        "summary": "Branche générique ; aucun planificateur propre de balise. Le déplacement neutre peut être choisi de trop loin pour atteindre immédiatement la cible.",
        "notes": []
      }
    },
    "cliff": {
      "id": "cliff",
      "name": "Clifford Unger",
      "version": "DS1 / Director’s Cut",
      "summary": "Les deux échos de la salve passent à des hauteurs différentes. Garde une longueur d’avance.",
      "height": 179,
      "speed": 4.2,
      "power": 1.03,
      "techniqueIds": [
        "cliff",
        "post",
        "recall"
      ],
      "ai": {
        "summary": "À distance, peut poser un poste s’il n’a pas de marqueur ; rappel si la cible est à moins de 72 px du poste.",
        "notes": []
      }
    },
    "mule": {
      "id": "mule",
      "name": "Porteur MULE",
      "version": "DS1 / Director’s Cut",
      "summary": "Pose une caisse devant toi. Pousse-la avec un coup fort ou rappelle-la quand ton adversaire enjambe le colis.",
      "height": 177,
      "speed": 4.25,
      "power": 1,
      "techniqueIds": [
        "mule",
        "crate",
        "retrieve"
      ],
      "ai": {
        "summary": "Caisse immobile au-delà de la cible : rappel ; caisse devant et à portée de Lourd : poussée possible. À distance : pose ou scan.",
        "notes": []
      }
    },
    "diehardman": {
      "id": "diehardman",
      "name": "Die-Hardman",
      "version": "DS1 / Director’s Cut",
      "summary": "Intercepte une frappe à mi-hauteur. Tant que le sceau brille, ta prochaine relève ou ta ligne d’arrêt profite de cet avantage.",
      "height": 181,
      "speed": 4.1,
      "power": 1.02,
      "techniqueIds": [
        "diehardman",
        "gate",
        "relief"
      ],
      "ai": {
        "summary": "Contre prioritaire contre light/heavy/lift en démarrage à moins de 143 px, énergie ≥28 : tirage 35/50/65 % selon niveau.",
        "notes": [
          "Ligne d’arrêt possible entre 92 inclus et 144 exclus, énergie ≥18, tirage 32 %."
        ]
      }
    },
    "mama": {
      "id": "mama",
      "name": "Mama",
      "version": "DS1 / Director’s Cut",
      "summary": "Pose ton point sur la piste. Déploie le tablier vers lui, ou utilise le treuil pour te rapprocher.",
      "height": 170,
      "speed": 4.4,
      "power": 0.96,
      "techniqueIds": [
        "mama",
        "deck",
        "winch"
      ],
      "ai": {
        "summary": "Ancrage présent, tirage 65 % : Tablier si la cible est à moins de 82 px du repère, sinon Treuil, selon l’énergie.",
        "notes": []
      }
    },
    "heartman": {
      "id": "heartman",
      "name": "Heartman",
      "version": "DS1 / Director’s Cut",
      "summary": "Compte le battement visible. Pose une mémoire de phase puis déclenche son onde au moment où ton adversaire la rejoint.",
      "height": 176,
      "speed": 4.15,
      "power": 0.96,
      "techniqueIds": [
        "heartman",
        "memory",
        "syncope"
      ],
      "ai": {
        "summary": "Impulsion si distance >91 et <149, ou <188 sur le battement ; énergie ≥28, tirage 40 %.",
        "notes": [
          "Mémoire présente à moins de 77 px de la cible : déclenchement si énergie ≥18."
        ]
      }
    }
  },
  "rules": [
    "Périmètre : duel 1 contre 1 et dojo. Le Relais de liaison applique des règles distinctes de ressources d’équipe, d’assistance, de relais et de réduction de combo.",
    "Duel actuel : 100 PV, équilibre 100, jauge chirale 42 au départ, 75 secondes. Les valeurs cibles de la bible restent séparées.",
    "En duel 1 contre 1 : dégâts = arrondi(base × puissance du combattant). Aucune réduction progressive de combo ni bonus de contre-touche dédié dans ce mode.",
    "Garde : aucun grattage de PV ; perte d’équilibre = base ×1,25, contre ×0,76 en touche. Blockstun au moins 9. Le côté de l’attaquant n’est pas un critère de blocage.",
    "Gain chiral en touche : attaquant +4 / défenseur +3 ; en garde +2 / +2. Recharge passive +0,025 par pas, ou +0,34 au dojo ; plafond 100.",
    "Rupture à équilibre ≤0 : au moins 38 pas de stun, garde et action interrompues, équilibre remis à 36. Recharge d’équilibre +0,28 au repos hors garde/action/stun/geste de défi, après le délai post-hit de 58 pas.",
    "Saisie mémorisée 9 ticks inclusifs à partir du tick suivant, une entrée par bouton. Direction du spécial et battement capturés à la pression ; Bas des normales lu à l’exécution. Le hitstop consomme la file d’entrée.",
    "Spéciales et projections refusées en l’air ; Léger/Lourd deviennent la frappe aérienne. Une annulation exige une touche confirmée, jamais une simple garde.",
    "Hurtbox : largeur 44, hauteur propre au kit ×0,62 accroupi ; rectangle au-dessus des pieds. Les contacts sont collectés avant le hitstun : des frappes simultanées peuvent échanger.",
    "La portée part du centre du combattant, pas du bord de son sprite. Un projectile avance avant son premier test de contact et peut toucher au dernier pas de sa durée.",
    "Les grandes rencontres exécutent boss.js, avec d’autres timings, dégâts et règles de défense ; ne pas leur appliquer cette table de duel."
  ],
  "aiProfiles": [
    {
      "id": "easy",
      "name": "Débutant",
      "engineDifficulty": 0,
      "decisionDelay": {
        "min": 5,
        "max": 20,
        "formula": "5 + floor(random × (16 − difficulté ×4))"
      },
      "guardProbability": 0.38,
      "counterProbability": 0.35,
      "rangedSpecialProbability": 0.12,
      "damageMultiplier": 1,
      "notes": [
        "Probabilités conditionnelles de branches, pas fréquences globales de match.",
        "Pas de délai de perception humain séparé ; l’état courant est lu à la décision.",
        "PV, coûts, volumes et puissance ne changent pas avec la difficulté du duel."
      ]
    },
    {
      "id": "normal",
      "name": "Porteur",
      "engineDifficulty": 1,
      "decisionDelay": {
        "min": 5,
        "max": 16,
        "formula": "5 + floor(random × (16 − difficulté ×4))"
      },
      "guardProbability": 0.61,
      "counterProbability": 0.5,
      "rangedSpecialProbability": 0.16,
      "damageMultiplier": 1,
      "notes": [
        "Probabilités conditionnelles de branches, pas fréquences globales de match.",
        "Pas de délai de perception humain séparé ; l’état courant est lu à la décision.",
        "PV, coûts, volumes et puissance ne changent pas avec la difficulté du duel."
      ]
    },
    {
      "id": "hard",
      "name": "Vétéran",
      "engineDifficulty": 2,
      "decisionDelay": {
        "min": 5,
        "max": 12,
        "formula": "5 + floor(random × (16 − difficulté ×4))"
      },
      "guardProbability": 0.84,
      "counterProbability": 0.65,
      "rangedSpecialProbability": 0.2,
      "damageMultiplier": 1,
      "notes": [
        "Probabilités conditionnelles de branches, pas fréquences globales de match.",
        "Pas de délai de perception humain séparé ; l’état courant est lu à la décision.",
        "PV, coûts, volumes et puissance ne changent pas avec la difficulté du duel."
      ]
    }
  ],
  "aiDecisionRules": [
    "Le CPU pilote J2 hors mode local ; au dojo, seul dummy=cpu décide. Idle/guard/record/loop suivent leurs chemins propres.",
    "À la décision, aiWait est réinitialisé et les touches effacées ; retour immédiat si stun ou blockstun. Une décision ratée n’est pas automatiquement reportée à la fin du stun.",
    "Menace : action adverse à distance <156, ou projectile du joueur 1 à <175 ; caisse en déplacement à <95 également considérée.",
    "Garde sous menace selon difficulté. Bas ajouté pour sweep ou caisse basse détectée ; toutes les autres armes ne disposent pas d’une réponse spécialisée.",
    "À distance >122 : approche ; spécial possible si 158<distance<600, énergie ≥28, sauf Die-Hardman/Heartman. Sinon dash possible au-delà de 230, tirage 13 %.",
    "Face à une garde et distance <76 : projection sur tirage 53 %. Sinon tirage générique : recul <12 %, garde de 12 à 22 %, saut de 22 à 28 %, spécial de 28 à 45 % si énergie ≥28, sinon normales.",
    "Au niveau 1/2, un spécial proche choisit une direction sur tirage 55 % ; au niveau 0, il reste neutre. Le marqueur et le kit modifient le choix.",
    "Branche normale : Lourd si tirage >72 %, sinon Léger ; Bas sur un autre tirage 16 %. Les branches prioritaires changent les fréquences observées.",
    "PRNG de simulation indépendant des particules. Aucune anticipation de transition ou politique spécialisée universelle n’est déduite de ces profils."
  ],
  "commonUtility": [
    {
      "id": "walk",
      "name": "Marche",
      "command": "Gauche / Droite",
      "cost": 0,
      "notes": [
        "Vitesse propre au kit, identique avant/arrière ; facteur 0,78 en l’air. Bloquée par action, garde, accroupissement, stun, blockstun ou geste de défi."
      ]
    },
    {
      "id": "crouch",
      "name": "Accroupissement",
      "command": "Bas",
      "cost": 0,
      "notes": [
        "Au sol, hors dash/stun/geste de défi ; hurtbox à 62 % de la hauteur."
      ]
    },
    {
      "id": "jump",
      "name": "Saut",
      "command": "Haut",
      "cost": 0,
      "notes": [
        "Au sol, sans action ni geste de défi : vitesse verticale 14,5 et gravité 0,77 par pas ; aucun double saut dédié."
      ]
    },
    {
      "id": "dash",
      "name": "Pas rapide",
      "command": "Deux pressions du même côté en 13 ticks au plus",
      "cost": 0,
      "notes": [
        "Au sol, hors action/stun/blockstun/dash/geste de défi. Compteur 12 ; déplacement drift×(2+compteur×0,74) avant décrément. Invulnérable quand le compteur restant vaut 4 à 8."
      ]
    },
    {
      "id": "guard",
      "name": "Garde",
      "command": "Garde ; Bas + Garde pour le bas",
      "cost": 0,
      "notes": [
        "Au sol, sans action/stun/dash/geste de défi ; aucune garde aérienne. Le côté ne conditionne pas le blocage dans le duel."
      ]
    },
    {
      "id": "taunt",
      "name": "Geste de défi",
      "command": "Geste de défi — B / P par défaut, L3 ou tactile ; commande remappable",
      "cost": 0,
      "timing": {
        "entry": 10,
        "hold": 28,
        "exit": 16,
        "total": 54,
        "unit": "pas à 60 Hz"
      },
      "notes": [
        "Duels hors ligne uniquement, au sol et hors action/garde/accroupissement/stun/blockstun/ruée. Exposition totale de 54 pas : entrée 10, tenue 28, sortie 16. Aucun bonus ni invulnérabilité. Un impact interrompt le geste ; pas d’annulation volontaire ni d’attaque mémorisée pendant le geste. La direction maintenue reprend son effet à la fin. Les commandes ne sont pas transmises au salon privé ni au moteur Boss."
      ]
    },
    {
      "id": "finish",
      "name": "Finalité",
      "command": "Finalité après victoire finale par K.-O.",
      "cost": 0,
      "notes": [
        "Issue déjà décidée ; fenêtre finish de 135 pas, puis cinéma de 108 pas si activée. Aucun dégât supplémentaire ; distincte de l’ultime cible."
      ]
    }
  ]
};
const byKey=new Map(data.actions.map(a=>[a.engineAction,a]));
function row(a,f){const n=Math.round(a.baseDamage*f.power);return {...a,damage:n?(n+' PV'+(a.hits>1?' par trait, jusqu’à '+a.hits+' traits':a.damageContext?' '+a.damageContext:'')+' (base '+a.baseDamage+' × '+f.power+', arrondi)'):'Aucun dégât direct'};}
function forFighter(id){const f=data.fighters[id];return f?{...f,common:data.actions.filter(a=>a.owner==='common').map(a=>row(a,f)),techniques:f.techniqueIds.map(k=>row(byKey.get(k),f)),rules:data.rules.slice()}:null;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
host.StrandMovesData=Object.freeze({...freeze(data),commonActions:Object.freeze(data.actions.filter(a=>a.owner==='common')),forFighter});
})(window);

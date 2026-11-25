# Audit des références — Échos de la Grève
Date : 24 novembre 2026.

## Périmètre réel de la production
La bible `docs/combat/BIBLE_COMBAT.md` retient **Death Stranding (2019) et Director’s Cut**, huit combattants (Sam, Fragile, Higgs, Cliff, MULE, Die-Hardman, Mama, Heartman), dix lieux et une variante sèche du camp MULE. Les costumes, personnages, armes et lieux de Death Stranding 2: On the Beach ne sont pas utilisés pour cette livraison.

Le lot prolonge les silhouettes locales existantes. Un sprite par image, personnage entier orienté vers la droite, anatomie et costume conservés, fond alpha réel. Les nouveaux gestes de garde, accroupissement et phases de saut sont des poses du jeu de combat annexe. Ils ne constituent pas une transcription image par image d’une animation officielle.

## Références primaires consultées

| Référence | URL officielle | Ce qu’elle permet de vérifier |
|---|---|---|
| DS1/DC, présentation PlayStation | https://www.playstation.com/fr-fr/games/death-stranding/ | Apparence générale de Sam, capsule BB, équipement, paysages rocailleux et captures des fonctionnalités Director’s Cut. |
| Personnages du premier jeu | https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/ | Identités, rôles et portraits de Sam, Fragile, Higgs, Cliff, Die-Hardman, Mama et Heartman ; comparer le personnage correspondant, sans mélanger des variantes de la suite. |
| Présentation Mama, Gamescom 2019 | https://blog.playstation.com/2019/08/20/death-stranding-new-footage-and-character-spotlight-videos/ | Scène officielle Mama/Sam et relation de Mama avec les Échoués ; matière visuelle pour Mama et son atelier. |
| Présentation officielle Heartman | https://www.youtube.com/watch?v=n2pb8xlC9Zs | Vidéo KOJIMA PRODUCTIONS intitulée « Heartman Character Spotlight Trailer - 4K » ; source pour le visage, lunettes, dispositif thoracique et gestuelle. Vidéo identifiée par la recherche, lecture directe indisponible dans l’outil de consultation. |
| Conseils pour la région orientale | https://www.kojimaproductions.jp/en/DSTips | MULEs, capteurs de cargaison, parade au Strand, conteneur employé comme projectile, grenade hématique, trajet Capital Knot City–Port Knot City. |
| Conseils de l’éditeur PC | https://deathstrandingpc.505games.com/en/porters-advice-for-improving-your-delivery-score/ | Usage non létal du Bola Gun contre les MULEs. Article publié par l’éditeur, contenant des conseils de joueurs ; il ne fournit pas un plan technique de la munition. |
| Guide officiel Director’s Cut | https://www.kojimaproductions.jp/en/death-stranding-directors-cut-beginners-guide | Structures, gestion de cargaison et nouveautés Director’s Cut ; contexte de l’usine ruinée et des déplacements. |
| Galerie officielle Director’s Cut | https://www.kojimaproductions.jp/en/death-stranding-dc | Captures de Cliff, du Maser Gun, de l’usine ruinée et du circuit. |
| Récapitulatif narratif PlayStation | https://blog.de.playstation.com/2025/06/23/death-stranding-was-bisher-geschah/ | Téléportation de Fragile, lien de Higgs avec les BT, rencontres avec Cliff sur les champs de bataille et fonction de chercheur de Heartman. Le texte de synthèse n’est pas utilisé pour déduire une géométrie d’accessoire. |

## Captures officielles directes

- Cliff : https://www.kojimaproductions.jp/sites/default/files/2022-03/DSDC_PC_Cliff.jpg
- Usine ruinée : https://www.kojimaproductions.jp/sites/default/files/2022-03/DSDC_PC_RuinedFactory_0.jpg
- Circuit Director’s Cut : https://www.kojimaproductions.jp/sites/default/files/2022-03/DSDC_PC_RaceTrack_002.jpg
- Maser Gun : https://www.kojimaproductions.jp/sites/default/files/2022-03/DSDC_PC_MaserGun.jpg — chemin confirmé par la galerie ; chargement direct en erreur pendant la consultation.

Aucune capture officielle n’est republiée dans ce lot. Ces adresses servent de provenance et de comparaison.

## Continuité des trois combattants du lot B

Les fichiers `<id>-stance.webp` et `<id>-jump.png` sous `modes/echos-de-la-greve/assets/fighters/` ont été inspectés avant génération et sont transmis comme références de continuité. Ils restent des productions du fan-game ; leur présence ne suffit pas à certifier une correspondance canonique.

| Combattant | Caractéristiques observées dans les références locales, à préserver |
|---|---|
| Cliff | Visage et cheveux grisonnants rabattus ; traces noires sur la tempe et la joue ; tenue camouflage olive, manches retroussées, écusson américain ; gilet à pochettes, sac et tuyau ; gants tactiques et bottes usées. |
| MULE | Combinaison jaune ocre à capuche et bandes réfléchissantes blanches ; masque respiratoire noir, lunettes et filtres circulaires ; protections noires ; caisse argentée sur armature avec deux sangles jaunes ; scanner jaune à écran cyan ; bottes épaisses. Ce porteur représente un membre anonyme du groupe. |
| Heartman | Cheveux bruns courts, lunettes rectangulaires ; veste bleue à manches retroussées, chemise gris clair ; harnais ocre et défibrillateur thoracique ambré à voyant cyan ; brassard métallique, dispositif au poignet, mitaines ; pantalon anthracite et baskets bleues à semelles blanches. |

Les halos sombres des anciennes références doivent être exclus des nouvelles découpes. Conserver les proportions, les teintes et le placement des accessoires ne dispense pas d’une comparaison ultérieure avec plusieurs vues officielles.

## Projectiles : canon et adaptation

| Élément | Partie attestée | Partie propre à Échos de la Grève |
|---|---|---|
| Bola de Sam | Le Bola Gun est un équipement non létal du premier jeu. | Trajectoire latérale, taille affichée, durée de liaison et nom « Bola de liaison ». Une vue officielle rapprochée reste nécessaire pour certifier les embouts exacts. |
| Cargaison lancée | Le guide Kojima décrit explicitement l’emploi d’un conteneur comme projectile. | Dégâts, rebonds, rappel, proportions adaptées à la piste de combat. |
| Grenade hématique | Arme contre les BT alimentée par le sang de Sam, décrite par Kojima. | Minutage, zone d’effet et découpage en sprite pour ce moteur. |
| Goudron de Higgs | Rapport de Higgs aux BT attesté par les sources narratives et visuelles. | Vague latérale, main surgissante, empreinte-piège et noms des techniques. Aucune source consultée ne certifie ces formes comme projectiles officiels autonomes. |
| Écho / ligne de Cliff | Cliff apparaît sur les champs de bataille avec des soldats et des armes. | « Écho de section », « Ligne fantôme », balise et arc montant sont des techniques de la bible. Un trait spectral ne doit pas être légendé munition officielle de Cliff. |
| Scanner du MULE | Capteurs et recherche de cargaisons attestés par le guide Kojima. | Anneau offensif, marquage d’un adversaire et rappel de caisse. |
| Onde Heartman | Recherche des Grèves et équipement médical appartenant au personnage. | Onde offensive, mémoire de phase et esquive : créations mécaniques du fan-game. |
| Relais Die-Hardman / ancrage Mama | Identités et fonctions des personnages. | Portiques offensifs, pont projeté et autres volumes de frappe. |

## Stages : statut et composition
Port Knot City appartient au parcours oriental décrit par Kojima. Cette source confirme le lieu, pas une façade latérale exacte. Une nouvelle arène Port Knot doit donc être enregistrée comme **adaptation en vue latérale du lieu**, avec captures précises de quai, installations et relief avant certification de détails.

Pour un incinérateur, les références consultées ici ne fournissent pas de relevé visuel suffisant de la façade et des cheminées. Éviter d’apposer « reproduction exacte » à une composition déduite. La perspective latérale, la ligne de sol libre et la séparation en plans parallaxe sont des choix du fan-game.

## Critères de contrôle du lot
1. Un seul personnage et une seule pose par PNG ; orientation droite et membre entier dans le cadre.
2. Garde identifiable, accroupissement lisible ; montée, sommet et descente du saut visuellement distincts.
3. Lecture du canal alpha, des dimensions natives, des marges et de la boîte visible ; aucun redimensionnement destructif ni retouche automatique des pixels.
4. Contrôle visuel de la tenue et de la silhouette contre les deux références locales.
5. Manifeste conservant prompt exact, références, empreinte SHA-256, dimensions, chemin de sortie et statut QA.
6. Le statut « continuité locale vérifiée » doit rester distinct de « canon 1:1 vérifié ». Les vues officielles manquantes et les adaptations restent explicitement signalées.


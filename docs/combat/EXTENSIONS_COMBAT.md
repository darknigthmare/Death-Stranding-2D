# Échos de la Grève — extensions du guide de combat

**Intégration documentaire du 27 novembre 2026 · Death Stranding 2D · DS1, Director’s Cut, DS2 et autres œuvres du registre.**

[Bible](BIBLE_COMBAT.md#extensions-guides-20261127) · [Production](REGISTRE_PRODUCTION.md#extensions-guides-20261127) · [Œuvres et versions](UNIVERS_DS.md) · [Provenance des trois fichiers](references/combat-guides-provenance.json).

Ce document applique les deux extensions demandées aux contenus existants. Il complète les trente lignes `EDG-G00` à `EDG-G29` de la bible avec **38 décisions `EDG-G30` à `EDG-G67`**. Une rubrique retenue est une décision de conception ; elle ne devient une fonctionnalité livrée qu’avec son raccordement et une preuve. Les fiches d’équipe, de bonus et d’exploration ci-dessous sont des cibles de réalisation. Les taunts, les présentations de sélection et les Dossiers de liaison possèdent leurs bilans de réalisation séparés : [Présentation](production/20261127-extensions/PRESENTATION.md) et [Progression](production/20261127-extensions/PROGRESSION.md).

Les huit identifiants jouables `sam`, `fragile`, `higgs`, `cliff`, `mule`, `diehardman`, `mama`, `heartman` restent ceux de DS1/DC. Les images DS2, les romans, les adaptations et les projets annoncés restent dans le périmètre sans hériter automatiquement de ces huit kits. Toute nouvelle tenue ou capacité exige la version et le plan de référence correspondants. **Les noms de taunts, duos, bonus, souvenirs et « Ruptures de lien » de ce document sont des créations du simulateur.** Ils ne constituent ni des citations ni des événements officiels de Death Stranding.

## 1. Sources exactes et contrôle du guide déjà intégré

Les trois fichiers ont été retrouvés sur Drive puis copiés sans réécriture. Le guide général correspond aux **55 172 octets et à l’empreinte déjà consignés dans le registre du 25 novembre** : son intégration précédente est conservée. Les deux extensions ne sont pas reconstituées à partir du souvenir d’une conversation.

| Document conservé | Rubriques | Taille | Source utilisateur |
| --- | --- | ---: | --- |
| [Combat_Games_Guide_General_v1.0.txt](references/Combat_Games_Guide_General_v1.0.txt) | 00–29 | 55 172 octets | [Drive — guide général](https://drive.google.com/file/d/14o_RrgXucs8Km-x1LQJtMK7rol6mENKy/view?usp=drivesdk) |
| [Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) | 30–49 | 60 589 octets | [Drive — extension 01](https://drive.google.com/file/d/1rYxKLIbz67L1sstmJWsga76uK7cX2mXF/view?usp=drivesdk) |
| [Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) | 50–67 | 47 334 octets | [Drive — extension 02](https://drive.google.com/file/d/1qr8hgvvjFqdWzcGaf1DPeKromk75bBn0/view?usp=drivesdk) |

| Document | SHA-256 de la copie exacte |
| --- | --- |
| Guide général | `4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7` |
| Extension 01 | `330fb7485a7a52b2a20f855646c940aaac0fcd9510032bc84b2e17c518edd25f` |
| Extension 02 | `08b57ea542e83c487fef3276997a612d4657f2ee9ed4f8e46b0bf65a2778038b` |

Le manifeste conserve identifiants Drive, dates, tailles et empreintes. Les dates internes des extensions sont respectivement les 26 et 27 novembre 2026. Leur présence atteste un cahier de conception fourni par l’utilisateur, pas les fonctionnalités d’un jeu de référence ni une intégration de paiement. Les références générales déjà citées dans ces textes gardent leur date de consultation d’origine ; la copie ne constitue pas une nouvelle vérification de toutes leurs pages.

<a id="matrice-extensions"></a>
## 2. Association complète des rubriques 30 à 67

**P0** : intégrité, états, données et conservation des acquis. **P1** : présentation et progression du lot courant. **P2** : modules retenus pour la suite, avec leurs dépendances. Les six axes du registre — lore, conception, assets, intégration, validation, publication — restent séparés.

| ID / rubrique du guide | Décision | Application à Death Stranding et état de réalisation |
| --- | --- | --- |
| EDG-G30 · portée | Retenue · P0 | Ce document prolonge la bible et le registre ; DS1/DC et DS2 ont des fiches/version séparées. Source originale et état de livraison sont conservés. |
| EDG-G31 · taunts | Retenue · P1 | Huit gestes de personnalité, sans bonus de jauge ni nouveau pouvoir. Cycle vulnérable documenté au [§3](#personnalite) ; preuve du runtime dans Présentation. |
| EDG-G32 · sélection/désélection | Retenue · P1 | Aperçu, confirmation, attente, sortie et remplacement explicites ; adaptation de chaque silhouette, interruption propre et mouvement réduit. Réemploi de poses distingué d’une séquence dessinée complète. |
| EDG-G33 · profils d’équipe | Adaptée · P2 | Profil cible « Relais de liaison » : deux empreintes, actif/réserve, vie séparée, défaite aux deux KO. Assistance et véritable transfert de contrôle restent distincts ; pas de tag livré par ce lot. |
| EDG-G34 · commandes/jauges | Retenue · P0/P2 | Taunt remappable pour le duel local ; assist, relais, duo et rupture collective ont des actions cibles distinctes et une jauge de Cohésion séparée du Chiral (§4). Aucune touche fantôme annoncée dans le jeu. |
| EDG-G35 · assistance | Adaptée · P2 | Une intervention du partenaire, annoncée et punissable ; kit de soutien borné pour les huit combattants. Les soldats de Cliff restent ses entités natives. |
| EDG-G36 · tag | Adaptée · P2 | Relais réel avec transfert du HUD et du contrôle ; coûts, KO, effets persistants et historique de combo définis. Les duels existants restent à un combattant par joueur. |
| EDG-G37 · supers d’équipe | Adaptée · P2 | Huit dossiers de paires prioritaires avec contribution distincte des deux kits, confirmation préalable et retour au jeu ; chorégraphies non produites (§4). |
| EDG-G38 · fins collectives/dramatiques | Adaptée · P2 | Ruptures de lien collectives du simulateur, sans exécution canonique des personnages ; priorité de conclusion, versions, lieu, partenaire vivant et solution de remplacement explicites. |
| EDG-G39 · clashes/QTE | Adaptée · P2 | Groupes limités de contacts physiques ou de manifestations compatibles ; QTE facultatif en histoire/spectacle, résolution commune sans QTE pour compétition. Pas de laser ou de pouvoir attribué par analogie (§5). |
| EDG-G40 · entités/objets placés | Retenue · P0/P2 | Caisse MULE, balise de Fragile, empreinte de Higgs, poste de Cliff, ancrage de Mama et mémoire de Heartman gardent leur propriétaire ; plusieurs sont déjà des objets du duel, leurs règles d’équipe restent à implémenter. |
| EDG-G41 · projectiles persistants | Retenue · P0/P2 | Identité stable, expiration et historique de combo commun ; pas de transfert magique de propriété au tag. Tableau des réactions à KO, réserve, transition et fin de manche (§5). |
| EDG-G42 · bonus | Adaptée · P2 | Dix familles recontextualisées : fret d’entraînement, MULEs simulés, tir DC, parade, parcours, protection, terminal, entité, coordination et livraison de précision. Toutes restent des fiches de projet (§6). |
| EDG-G43 · espace de déblocage | Adaptée · P1/P2 | Dossiers de liaison : collection consultable dans l’interface ; parcours d’archives connecté conçu pour la suite. Aucun nouveau lieu physique officiel, hub 3D ni arbre RPG déclaré livré. |
| EDG-G44 · relations | Retenue · P1/P2 | Huit paires prioritaires prolongent les 28 relations déjà documentées. Campagne, versus hypothétique, versions DS2 et rencontres de mémoires restent distincts (§4). |
| EDG-G45 · production d’assets | Retenue · P0/P1 | Une source autonome par sujet ; pose de taunt, transition de sélection, animation et storyboard collectif sont des unités différentes. Cadrage et asymétries suivis par version (§9). |
| EDG-G46 · UX/accessibilité/réseau | Retenue avec périmètre · P0/P1 | Taunt et présentation dans le duel local, textes de commande et effets réduits ; salon privé, Boss et Duel originel non étendus implicitement. Les équipes exigent une sérialisation future dédiée. |
| EDG-G47 · validation/statistiques | Retenue · P0 | Les 18 cas de l’extension 01 restent dans la matrice de recette (§9), avec résultats du lot distingués des essais futurs. Une pose ou une fiche ne compte pas comme animation livrée. |
| EDG-G48 · dix fiches | Retenue · P0/P1 | A/B : huit fiches personnalité ; C/D/E : équipe et paires ; F/G : clash/entités ; H/I/J : bonus, parcours et règles d’accès. Toutes renvoient aux IDs existants. |
| EDG-G49 · application/références | Retenue · P0 | Sources intégrales et manifeste ; références Death Stranding qualifiées au §10. Les inspirations MK, Tekken, FighterZ ou Naruto ne définissent pas le canon DS. |
| EDG-G50 · portée des verrous | Adaptée · P0/P1 | Nouveaux souvenirs réellement disponibles ; huit combattants, costumes, arènes et modes actuels préservés. Personnages futurs indiqués « Kit en préparation », sans faux défi pour un kit absent. |
| EDG-G51 · dimensions d’accès | Retenue · P0/P1 | Découverte, droit, disponibilité technique et compatibilité sont séparés. Un asset ou un kit manquant reste indisponible même si un droit est présent (§7). |
| EDG-G52 · langage visuel | Adaptée · P1 | Dossier masqué, silhouette autorisée, verrou de terminal, trait chiral et libellé lisible ; métaphore d’interface originale. Les secrets utilisent un emblème neutre (§7). |
| EDG-G53 · personnages/partenaires | Adaptée · P0/P2 | Accès actuel conservé ; les futurs slots s’ouvrent seulement après kit livré et règle définie. Une aide native indispensable n’est pas vendue/verrouillée séparément de son kit. |
| EDG-G54 · costumes | Retenue · P0/P2 | Version DS1/DC/DS2 et dépendance au personnage conservées ; apparence cosmétique sans modification des collisions. Pas de substitution Higgs DS2/guitare dans le kit DS1. |
| EDG-G55 · stages | Retenue · P0/P2 | Lieu, variante et destination liée séparés ; profils vivant/statique accessibles ensemble. Les 25 configurations précédentes ne sont pas retirées ; stages de soutien seulement conçus (§8). |
| EDG-G56 · modes verrouillés | Adaptée · P0/P2 | Aucun des neuf modes existants ne reçoit de nouveau verrou. Une future épreuve avancée peut avoir des prérequis sans bloquer son entraînement ni exiger sa propre victoire pour s’ouvrir. |
| EDG-G57 · règles ET/OU | Retenue · P0/P1 | Huit règles de souvenirs : route terminée OU quatre exercices du combattant. Compteurs existants, attribution permanente et source stable ; pas d’exigence d’abonnement (§7). |
| EDG-G58 · découverte/récompense | Adaptée · P1 | Attribution automatique des souvenirs, ensuite consultables dans les Dossiers ; fermeture de l’écran et réouverture ne donnent pas de doublon. Coffres, clés et parcours d’archives restent une cible distincte. |
| EDG-G59 · avantages de soutien | Retenue en conception · P2 | Habillages d’interface/cosmétiques envisagés ; modèles permanent, temporaire et lot périodique documentés. Aucune offre, vente ou récompense d’abonnement opérationnelle (§8). |
| EDG-G60 · liaison fournisseur | Retenue en conception · P2 | Adaptateur externe de confiance, consentement, contrôle des événements, secrets hors client ; aucun booléen local « abonné » accepté comme preuve. Service non raccordé. |
| EDG-G61 · expiration/hors ligne | Retenue en conception · P0/P2 | Sources d’accès multiples, acquisition permanente conservée, indisponibilité distincte d’expiration, configuration du match figée jusqu’au résultat. Les souvenirs locaux n’expirent pas. |
| EDG-G62 · local/en ligne/replays | Adaptée · P0/P2 | Lire, sélectionner, participer et s’entraîner sont des permissions distinctes ; Dossiers locaux ne changent pas le roster des salons. Politique réseau et replays des futurs contenus à implémenter (§8). |
| EDG-G63 · textes/accessibilité/spoilers | Retenue · P1 | Libellés courts, indication textuelle des états, focus, identité future masquable ; pas de nom ou portrait caché révélé par une description accessible. Portée réelle des tests dans Progression. |
| EDG-G64 · sauvegarde/QA | Retenue · P0/P1 | Sauvegarde dédiée `echos.liaison.v1`, sources stables et idempotence ; 22 cas d’acceptation repris au §9. Droits externes et migrations d’un futur catalogue restent des périmètres distincts. |
| EDG-G65 · six fiches | Retenue · P0/P1 | A/B/D/F : contenus, règles, charte et matrice des Dossiers (§7) ; C/E : avantage futur et stage de soutien (§8). États et preuves renseignés sans statut de livraison fictif. |
| EDG-G66 · intégration au projet | Retenue · P0 | Bible, registre, sources, nouveaux documents et rapports forment une même livraison ; les deux extensions sont reliées aux huit kits et aux futurs DS2. |
| EDG-G67 · références/vocabulaire | Retenue · P0 | Vocabulaire du guide conservé. Les sources Patreon du fichier utilisateur seront revérifiées lors du raccordement du fournisseur ; elles ne prouvent aucune connexion actuelle. |

<a id="personnalite"></a>
## 3. Huit fiches de taunt, sélection et désélection

### 3.1. Contrat commun et différence entre geste conçu et image disponible

Le taunt local est un **geste de présentation vulnérable**, pas une technique offensive. Son contrat est de **54 pas à 60 Hz : 10 d’entrée, 28 de tenue, 16 de sortie**. Il démarre au sol, au neutre, hors garde, accroupissement, déplacement rapide, réception de coups ou attaque. Une touche maintenue ne le relance pas en boucle. Pendant son engagement, les commandes de combat ne permettent pas une annulation gratuite. Un impact, un KO, un changement de manche ou une transition interrompt le geste. Il n’ajoute ni dégâts, ni invulnérabilité, ni ressource ; la régénération ordinaire du duel ne devient pas un bonus de taunt. Le rapport Présentation fait foi pour les commandes et exclusions exactes de la version réalisée.

Chaque fiche ci-dessous remplit les modèles A et B de l’extension 01. La **gestuelle détaillée est la direction d’animation cible** ; sa restitution initiale peut employer une pose existante ou un PNG neuf accompagné d’un mouvement de présentation. Cela ne produit pas les dessins intermédiaires d’une animation complète. Les voix restent des besoins de production séparés ; aucune voix officielle n’est livrée par un libellé de taunt.

Pour les huit fiches, les critères communs sont : un seul sujet dans chaque source autonome, mains et équipement du bon côté, silhouette lisible à taille de combat, pied d’appui stable, absence de collision offensive, interruption immédiate par un événement prioritaire et retour à une garde exploitable. En sélection, l’aperçu répond immédiatement ; la sortie complète peut être abrégée, nettoie les effets de l’ancien choix et ne retarde pas le nouveau. Le mouvement réduit conserve pose, état de sélection et libellé, sans exiger une translation ou un flash.

### 3.2. `sam` — Salut du porteur

**Version et source :** Sam porteur DS1/DC, tenue du kit existant ; portage, contrôle de charge et lien documentés par [Kojima — région Est](https://www.kojimaproductions.jp/en/DSTips). La sangle resserrée est une proposition de geste, pas une scène officielle reproduite.

**Taunt cible :** vérification brève du harnais à l’entrée, pouce levé pendant la pose tenue, puis retour des mains à la garde ; BB reste attaché et hors des points de contact. **Sélection :** aperçu en appui, confirmation par réajustement du harnais, attente stable. **Désélection :** main retirée de la sangle et pas de recul, avec version courte par fondu de l’aperçu. **Soutien cible :** « Appui du porteur », intervention courte au lien sur un écho adverse, puis sortie à pied. **Entité :** son projectile de liaison conserve son propriétaire ; la capsule de BB n’est ni arme ni cible. **Rupture liée :** Cargaison sécurisée reste l’individuelle ; le duo avec Fragile utilise un fret d’exercice porté par Sam, sans attribuer à Fragile le transport de cargaison par saut.

### 3.3. `fragile` — Sous mon parapluie

**Version et source :** Fragile DS1, tenue et parapluie de la référence du kit ; [guide officiel DC](https://www.kojimaproductions.jp/en/death-stranding-directors-cut-beginners-guide), [personnages DS1](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/). La version Drawbridge/DS2 est une fiche séparée.

**Taunt cible :** invitation de la paume libre, poignée du parapluie gardée dans l’autre main, regard assuré puis retour à la garde ; aucune garde gratuite donnée par la toile. **Sélection :** arrivée lisible, vérification de la poignée, confirmation par légère rotation de l’épaule. **Désélection :** fermeture/rangement puis retrait ; une dissipation seulement si une séquence propre est produite, jamais une lecture inversée imposée. **Soutien cible :** « Quai de passage », apparition annoncée et frappe de parapluie, vulnérable à la sortie. **Entité :** Point de retour est une balise de simulation, pas un membre d’équipe. **Rupture liée :** extraction de l’empreinte adversaire seulement après résultat ; pas de promesse de saut collectif canonique.

### 3.4. `higgs` — Le public attend

**Version et source :** Higgs DS1 encapuchonné, masque et manifestations de la version documentée dans les [personnages DS1](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/). L’armure rouge et la guitare DS2 ne sont pas des accessoires de ce kit.

**Taunt cible :** ouvrir les bras à distance du masque comme pour réclamer un public, maintenir un silence théâtral puis refermer le geste. **Sélection :** capuche et masque visibles, confirmation par paume tournée, attente sans manifestation offensive. **Désélection :** main rabattue et silhouette retirée ; nettoyage de toute trace de présentation. **Soutien cible :** « Marque de ressac », une empreinte annoncée, une seule zone, sortie avant le rappel possible. **Entité :** piège et leurre gardent leurs fonctions distinctes ; un double visuel ne devient pas un troisième corps vulnérable. **Rupture liée :** Rideau de goudron reste une dissolution d’empreinte dans le simulateur ; aucune mort ou résurrection d’un personnage de l’histoire n’en découle.

### 3.5. `cliff` — Salut de section

**Version et source :** Cliff DS1, tenue de la variante militaire affichée ; commandement de sa section référencé dans les [personnages DS1](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/). Les uniformes de périodes différentes ne sont pas fusionnés.

**Taunt cible :** signal à deux doigts portés à la tempe, regard porté sur l’adversaire, abaissement de la main ; son arme et son équipement gardent leurs prises et orientations. **Sélection :** posture d’écoute, bref ordre visuel de confirmation, attente. **Désélection :** signal d’arrêt puis recul ; les éventuels silhouettes et sons d’aperçu sont retirés. **Soutien cible :** « Couverture de section », une salve annoncée de son avatar ; l’appel de soldat reste une action de Cliff, pas une réserve supplémentaire. **Entité :** poste avancé et rappel conservent leurs limites. **Rupture liée :** Rappel de section réunit les empreintes ; les duos avec Sam ou Die-Hardman sont des rencontres de simulation explicitement alternatives, jamais une réécriture de la chronologie.

### 3.6. `mule` — Scan prioritaire

**Version et source :** opérateur MULE anonyme DS1/DC ; faction liée au fret et aux capteurs selon [Kojima — région Est](https://www.kojimaproductions.jp/en/DSTips). L’indicatif, l’histoire et le taunt du combattant appartiennent au projet.

**Taunt cible :** inclinaison du capteur vers une caisse, main indiquant sa priorité, retour de la hampe en garde. Le scan de ce geste est décoratif et ne marque pas la cible. **Sélection :** inspection du fret ; confirmation par reprise de prise. **Désélection :** outil baissé, caisse d’aperçu retirée avec le personnage. **Soutien cible :** « Livraison interceptée », courte poussée d’une caisse d’exercice bornée. **Entité :** Consigne mobile garde un seul propriétaire et ne réapparaît pas gratuitement après un relais. **Rupture liée :** Hors inventaire classe une empreinte de simulation ; aucune personne canonique n’est transformée en cargaison réelle.

### 3.7. `diehardman` — Gant ajusté

**Version et source :** figure de commandement de Bridges, masque sombre et tenue du kit DS1 ; [personnages DS1](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/).

**Taunt cible :** ajustement bref d’un gant, paume abaissée et retour au regard frontal. Le taunt ne donne aucun sceau de combat. **Sélection :** posture sobre, confirmation par inclinaison de tête, attente immobile. **Désélection :** fermeture de l’affichage d’aperçu et demi-pas de retrait. **Soutien cible :** « Consigne d’arrêt », un portique de simulation annoncé et punissable. **Entité :** le sceau et les portes de son kit sont des dispositifs fictifs du simulateur, pas ses pouvoirs officiels. **Rupture liée :** Levée de consigne ouvre une issue virtuelle ; coopération avec Cliff présentée comme exercice de mémoire alternatif.

### 3.8. `mama` — Mise au point

**Version et source :** ingénieure DS1, costume Atelier ou version de projet Maintenance du viaduc sélectionnée ; contexte de Mama dans la [présentation officielle Gamescom 2019](https://blog.playstation.com/2019/08/20/death-stranding-new-footage-and-character-spotlight-videos/). Les deux tenues gardent leurs cadrages propres.

**Taunt cible :** ajuster les lunettes d’une main, garder l’autre près de l’outil, retirer la main puis reprendre la garde. Aucun ancrage actif n’est créé. **Sélection :** contrôle de son outil, confirmation par pointage bref, attente. **Désélection :** main abaissée et affichage effacé, sans retour inversé d’un geste d’assemblage. **Soutien cible :** « Travée d’essai », un segment holographique d’exercice avec limites lisibles. **Entité :** ancrage/treuil relèvent de son avatar technique ; l’enfant Échoué n’est ni projectile ni partenaire d’assistance marchandisé. **Rupture liée :** une travée de sortie pour l’empreinte, pas une modification de la destinée de Mama ou de Lockne.

### 3.9. `heartman` — Un instant

**Version et source :** chercheur DS1 et son équipement, distinct de son apparence DS2 ; [personnages DS1](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/). Le rythme du duel reste celui d’un moniteur de simulation.

**Taunt cible :** consultation de l’équipement au poignet, arrêt attentif un instant, retour calme ; aucune mort, réanimation ou guérison déclenchée. **Sélection :** regard sur l’appareil puis sur la piste ; confirmation discrète et attente. **Désélection :** écran d’aperçu éteint puis retrait, sans disparition surnaturelle ajoutée. **Soutien cible :** « Mesure croisée », une impulsion technique du simulateur, pas un soin universel. **Entité :** Mémoire de phase garde son propriétaire et son expiration. **Rupture liée :** Intervalle dissipe l’écho ; aucun changement du cycle narratif officiel n’est déduit des 54 pas du taunt.

### 3.10. Extension des fiches à DS2 et aux autres œuvres

Sam DS2, Fragile DS2 et Higgs DS2 disposent d’identités de version propres ; leur silhouette et leurs équipements ne sont pas plaqués sur les gestes DS1. Dollman, Tomorrow, Rainy et Tarman sont aujourd’hui des bases de galerie : leur présence dans le nouveau dossier est documentaire. Un rôle de compagnon, de soutien ou de combattant se décide après vérification de capacités réellement montrées. Les noms et apparences de DS2 sont référencés dans [UNIVERS_DS](UNIVERS_DS.md) et dans la [présentation officielle des personnages DS2](https://blog.de.playstation.com/2025/06/24/death-stranding-2-on-the-beach-diese-schauspieler-und-synchronsprecher-sind-dabei/). Ce dernier article est une présentation de distribution ; ses anticipations de récit ne servent pas de preuve d’une capacité de combat.

Pour les romans et adaptations, une précision narrative doit porter son œuvre, son édition et son passage. Une image promotionnelle ou un projet annoncé n’autorise pas l’invention de tenues complètes, d’animations ou de nouveaux pouvoirs. Les cibles en attente de référence restent dans le registre de production, hors du compte des kits livrés.

<a id="equipes"></a>
## 4. Assistance, relais, duos et Ruptures de lien — conception retenue

### 4.1. Profil « Relais de liaison »

Le mode cible est un **hybride local à deux membres par joueur**, d’abord séparé des routes individuelles et du salon privé. Chaque équipe possède un actif et une réserve, chacun avec ses propres vie, Chiral, objets, récupérations et effets. La défaite ordinaire intervient quand les deux sont KO. Un survivant entre automatiquement après KO, même avec une jauge collective vide. Le joueur ne peut sélectionner deux occurrences du même kit dans une équipe ; des variantes d’un même personnage exigent une règle de composition explicite. Un match miroir entre équipes reste possible.

Le contrat initial conserve la vie du duel courant et **ne régénère pas la vie en réserve**. Le temps compare la somme des proportions de vie restantes des deux membres, un KO valant zéro. Une égalité exacte ouvre un départage documenté avant match : ressources conservées, survivants repositionnés, premier impact net non simultané décisif. Une série d’impacts simultanés égaux ne privilégie pas le joueur traité en premier. Ces règles n’entrent dans le runtime que lorsque l’équipe complète, son HUD et ses tests sont prêts.

Les valeurs suivantes sont des **hypothèses de réglage**, pas des paramètres déjà chargés :

| Action cible | Ressource / état | Engagement, échec et sortie |
| --- | --- | --- |
| Assistance | 25 Cohésion ; partenaire disponible ; récupération 360 pas après sortie | Débit unique au départ accepté ; refus gratuit ; interruption engagée sans remboursement ; vie de la réserve affectée par les coups reçus. |
| Relais volontaire | 15 Cohésion ; actif au sol/neutre ; réserve disponible ; récupération 240 pas | Départ/arrivée annoncés ; aucun tag gratuit depuis garde ou réception de coups ; contrôle transféré à un pas unique. |
| Relais après KO | Aucun coût | Vie et ressources du survivant conservées ; pas de résurrection, pas de remise à zéro des récupérations. |
| Super duo | 100 Cohésion ; deux membres vivants et disponibles | Première attaque contrôlée par les règles ordinaires ; longue scène seulement après touche valide ; échec/garde : sortie courte et risque annoncé. |
| Rupture collective | Match déjà gagné, invitation valide, partenaire vivant/disponible | Présentation sans effet sur le gagnant ; solution individuelle ou victoire normale si la scène collective est incompatible. |

La jauge de **Cohésion** a une capacité cible de 100, commence à 50 et récupère 6 points par seconde de simulation active. Elle est séparée du Chiral de chaque kit. Pause, hitstop, scène collective et transition suspendent ce gain ; une interface lente ou une cinématique passée ne change pas l’état final. L’ordre d’engagement refuse la deuxième action qui voudrait dépenser les mêmes points ou mobiliser un partenaire déjà présent. Une assistance et une entité native ont des budgets différents.

Les entrées logiques cibles sont `ASSISTANCE`, `RELAIS`, `SUPER_DUO`, `RUPTURE_EQUIPE`. Elles n’ont pas de raccourci présenté comme disponible dans le jeu actuel. Une récupération, un changement de kit et un objet posé gardent leurs horloges dans la simulation, sans rechargement implicite au tag. Les extensions réseau et Boss attendent leurs propres règles ; elles ne sont pas incluses par la seule existence du profil local.

### 4.2. Huit paires de production prioritaires

Toutes les techniques ci-dessous sont des **adaptations originales du simulateur**. La relation générale attestée ne rend pas la coopération, le dialogue ou la chorégraphie canonique. Le mode histoire n’autorise une paire que si sa route prévoit réellement ces deux avatars ; le versus hypothétique est clairement identifié.

| ID de paire / versions | Cadre narratif et limites | Super duo cible | Rupture collective cible |
| --- | --- | --- | --- |
| `DUO:sam-fragile-ds1` | Coopération de livraison dans l’exercice ; Sam porte lui-même le fret. | **Correspondance sécurisée** : lien de Sam ouvre l’espace, Fragile intervient à la sortie annoncée de son déplacement. | **Deux accusés de réception** : les deux avatars ferment la session et l’écho adverse retrouve la sortie. |
| `DUO:sam-mama-ds1` | Essai technique d’avatars ; pas de nouvelle expédition canonique de Mama. | **Travée d’appui** : Mama projette une travée d’exercice, Sam prend appui pour une frappe contrôlée. | **Passage vérifié** : l’empreinte emprunte une issue technique, puis l’ancrage est démonté. |
| `DUO:mama-heartman-ds1` | Collaboration scientifique fictive au sein du simulateur ; pas d’énergie médicale offensive attestée. | **Mesure de portée** : un point d’ancrage donne le repère à une impulsion du moniteur virtuel. | **Échantillon rendu** : les deux relevés se ferment et libèrent l’empreinte. |
| `DUO:sam-diehardman-ds1` | Consigne d’exercice et confirmation de mission ; capacités du terminal explicitement fictives. | **Couloir autorisé** : le portique virtuel annonce un couloir, Sam y place sa liaison. | **Livraison acquittée** : validation du fret d’exercice puis extinction de la piste. |
| `DUO:cliff-diehardman-ds1` | Rencontre de mémoires alternative, exclue des scènes censées reproduire l’histoire officielle. | **Ordres croisés** : un signal de Cliff et une ligne du terminal convergent, sans nouvelle armée indépendante. | **Fin de consigne** : les ordres cessent ensemble ; aucune réconciliation canonique affirmée. |
| `DUO:higgs-mule-ds1` | Alliance opportuniste inventée, versus/spectacle seulement. Le MULE n’est pas déclaré membre des Homo Demens. | **Mauvais quai** : caisse d’exercice puis empreinte au sol, avec fenêtre de réponse commune. | **Inventaire des ombres** : le faux dossier de fret se ferme sur une empreinte déjà vaincue. |
| `DUO:sam-cliff-ds1` | Mémoire du simulateur ; informations biographiques protégées avant leur révélation dans la route. | **Relais de fréquence** : appui de Sam et couverture de l’avatar de Cliff, sans parole révélant leur lien au menu. | **Signal reçu** : arrêt de la section et dissolution de la piste ; scène spéciale soumise à la découverte narrative. |
| `DUO:fragile-heartman-ds1` | Exercice de mesure d’un déplacement, créé pour Échos. | **Intervalle de passage** : marqueur du moniteur puis apparition annoncée de Fragile ; le marqueur n’est pas une téléportation de Heartman. | **Dernière mesure** : retour de Fragile à une position lisible et fermeture du relevé. |

Une chorégraphie de paire a un meneur, une orientation, une entrée et un état de sortie. Le changement de meneur n’est pas compté comme variante animée tant qu’il n’est pas produit. Les autres paires du roster gardent un relais générique compatible à concevoir ; aucune animation exclusive pour toutes les combinaisons n’est annoncée.

### 4.3. Fins dramatiques et compatibilité

La priorité cible est **fin dramatique spécifique > Rupture d’équipe compatible > finalité individuelle > victoire normale**. La sélection d’une présentation n’inverse jamais un résultat. Les montages « Fin de consigne » ou « Signal reçu » ne se déclenchent pas dans une route qui n’a pas révélé les informations nécessaires. Un partenaire KO n’est pas rappelé pour sauver une animation.

Trois premières fiches conditionnelles sont retenues : `DRAMA:sam-fragile-quai` pour la paire DS1 au terminal du simulateur après une victoire par liaison ; `DRAMA:sam-cliff-signal` pour la rencontre alternative avec condition de découverte narrative ; `DRAMA:fragile-higgs-ds1` pour une conclusion de rivalité du simulateur, en version DS1 uniquement. Leurs noms, cadrages et conditions sont originaux. Une arène DS2 ou une tenue d’une autre période doit obtenir sa variante explicitement ; elle ne passe pas le filtre par ressemblance de nom.

Chaque scène doit fournir une sortie courte en cas de cible géante, mécanique ou sans anatomie humaine : neutralisation de l’empreinte au centre de sa zone, retour des participants sur des appuis sûrs, arrêt des projectiles et issue inchangée. Le moteur Boss possède ses propres conditions : aucune scène de duo n’est présumée compatible avec lui.

<a id="entites"></a>
## 5. Clashes, entités et projectiles

### 5.1. Propriété et états

Les règles d’équipe s’ajoutent au relevé des [actions actuelles](ACTIONS_ET_IA.md) ; elles ne remplacent pas les paramètres déjà mesurés du duel.

| Propriétaire / objet | Fonction distinguée | Règle cible en équipe |
| --- | --- | --- |
| Sam / projectile de liaison | Attaque émise du kit | L’émetteur reste Sam après un relais ; impact et ressource attribués une seule fois. BB reste hors du système d’attaque. |
| Fragile / Point de retour | Marqueur de déplacement | Un seul marqueur ; désactivé en réserve, expiration conservée ; l’entrant ne peut pas l’utiliser. |
| Higgs / Empreinte d’or et leurre | Piège actif / effet visuel distincts | Piège borné et propriétaire conservé ; feinte d’aperçu sans collision ; pas de duplication lors d’un rappel d’assistance. |
| Cliff / Poste avancé, manifestation de section | Point d’émission et acteur de kit | Aucun emplacement d’équipe consommé ; rappel au passage en réserve, sans rembourser le coût ; projectiles déjà émis suivent leur vie résiduelle. |
| MULE / Consigne mobile | Objet posé, poussé, rappelé | Une caisse maximum ; conserve propriété et durée, devient inerte en réserve ; réactivation seulement par son propriétaire présent. |
| Die-Hardman / sceau, portique | État personnel et dispositif du simulateur | Le sceau n’est pas partagé ; le portique déjà engagé termine son cycle sans laisser l’entrant le prolonger. |
| Mama / ancrage, travée | Point technique et attaque | Un ancrage maximum ; rappel à la réserve ; pas de treuil du partenaire ni d’enfant Échoué utilisé comme entité de combat. |
| Heartman / mémoire de phase | Position mémorisée et émission | Désactivation en réserve, délai conservé ; pas d’onde gratuite au changement de combattant et pas de guérison implicite. |

Pour chaque objet futur : création, coût, position, armement, durée, nombre d’impacts, destruction, rappel et dernier pas actif sont obligatoires. Le budget initial cible est **un objet persistant propre au kit, trois projectiles simultanés au maximum et un partenaire d’assistance présent par équipe** ; tout kit exigeant une autre limite doit être mesuré avant extension. Les options graphiques réduisent les particules, jamais un projectile dangereux.

Un KO résout d’abord les impacts du pas courant selon le même ordre pour les deux équipes, puis supprime les objets inertes du propriétaire. Une transition retire ou repositionne les objets conformément à sa fiche ; elle ne permet pas une attaque hors de la nouvelle zone. Une fin de manche remet à zéro les objets. Une scène collective gèle leur simulation ou les retire selon un contrat unique, identique en lecture courte. Une correction/relecture restaure l’état sans émettre un deuxième son, un deuxième coût ou une deuxième récompense.

L’historique de combo appartient à l’équipe : réduction de dégâts, rebonds, captures et gains déjà consommés survivent au changement d’attaquant. Une réflexion éventuelle devient une mécanique distincte à définir ; le fait qu’un projectile existe ne prouve ni sa réflexion ni son absorption par tous les personnages.

### 5.2. Clashes et QTE retenus

Deux groupes de conception suffisent au premier prototype futur : **contact de mêlée compatible** et **opposition de manifestations du simulateur**. Le premier part de coups réellement présents ; le second n’autorise que les techniques expressément inscrites à la matrice. Deux projectiles croisés ne déclenchent pas automatiquement une cinématique. La simultanéité se mesure en pas de simulation, avec contact réel des volumes, orientation et disponibilité des acteurs.

Les collisions du pas courant et les KO sont résolus avant tout événement de présentation. Une transition déjà validée empêche le départ d’un clash. Une attaque à impacts multiples n’en crée qu’un ; un délai de récupération de groupe borne la fréquence. Un tiers, un piège ou une assistance sur le même pas doit être résolu sans favoritisme de côté.

Le profil de compétition cible emploie une séparation déterministe sans QTE. En histoire ou versus spectacle annoncé, un QTE court peut utiliser une direction et une fenêtre communes ; double réussite, double échec ou absence d’entrée conduisent à la même séparation neutre, jamais à une victoire arbitraire. Pas de martèlement prolongé requis. Maintien alternatif et mouvements réduits préservent la règle. Le chrono, les partenaires et les projectiles suivent une horloge explicitement gelée pendant la confrontation. Ce module reste **conçu, non raccordé**.

<a id="bonus-archives"></a>
## 6. Dix bonus et parcours d’archives

### 6.1. Fiches H — bonus associés aux routes

Les lieux cités sont des références ou des arènes du catalogue. **Ces épreuves, leurs objectifs et leurs ennemis d’exercice sont des créations du simulateur, non des missions officielles.** Elles n’ajoutent aucun mode jouable tant que leur moteur, leurs assets et leur reprise ne sont pas livrés. Les parcours existants, leurs trois duels et leurs scènes sont conservés.

| ID / famille | Contexte, personnages et version | Objectif, règles et reprise proposés |
| --- | --- | --- |
| `BONUS:freight-test` · destruction contrôlée | Sam ou MULE DS1/DC ; hangar reconstitué du terminal. | Démanteler un module de fret d’exercice vide en touchant des zones annoncées ; états intact/endommagé/neutralisé, aucune capsule ou cargaison vivante visée. Essai de 45 s, reprise à ressources fixes. |
| `BONUS:mule-pressure` · horde | Route Livraison sans adresse ; camp MULE DS1. | Neutraliser des avatars d’exercice peu résistants, quatre présents au plus, apparitions hors du volume du joueur. Le faible seuil de vie est une règle de simulation, pas une redéfinition des ennemis officiels. |
| `BONUS:dc-precision` · précision | Sam DC ; stand de tir déjà au catalogue. | Atteindre des cibles annoncées avec quota de munitions d’exercice ; trajectoires et cadence réglées pour le mode. Version contact pour les kits sans tir, sans leur inventer une arme. |
| `BONUS:strand-response` · défense | Sam DS1/DC ; terminal, avant une rencontre MULE. | Lire garde/parade et riposter sur six fenêtres ; mannequins et dégâts d’exercice bornés. Pas de réponse avec outil absent du kit. |
| `BONUS:clear-route` · mobilité | Fragile DS1 ; quai du simulateur. | Atteindre trois repères sûrs et gérer une sortie annoncée ; aucune obligation de transporter du fret par son saut. Chute virtuelle = reprise, jamais perte de progression principale. |
| `BONUS:sealed-cargo` · protection | Sam/Die-Hardman DS1 ; terminal. | Protéger une caisse d’essai pendant une extraction simulée ; vie de l’objectif distincte, fin claire et absence de cible bébé. |
| `BONUS:terminal-check` · interaction | Mama ou Die-Hardman DS1 ; hangar. | Activer trois dispositifs de simulation dans l’ordre indiqué ; passerelles et ports de contrôle fictifs, sans attribuer un piratage surnaturel aux personnages. |
| `BONUS:remote-anchor` · entité | Mama, Cliff, MULE ou Heartman DS1 ; variante d’exercice par kit. | Poser, activer puis rappeler l’objet natif adéquat ; mêmes coûts et délais que le moteur du kit. Aucune aide du roster consommée. |
| `BONUS:liaison-relay` · équipe | Sam/Fragile DS1 ou paire compatible ; uniquement après livraison du profil équipe. | Une couverture, un transfert de contrôle et une résolution de cible ; pas de récompense pour un simple changement de portrait. |
| `BONUS:drawbridge-handling` · activité de porteur | Module DS2, contexte logistique du Magellan ; futur avatar compatible requis. | Préparer un chargement d’exercice et préserver son orientation ; référence DS2 à contrôler avant asset final. Ni pilotage de Magellan ni kit DS2 déduit de l’épreuve écrite. |

Les durées et plafonds du tableau sont des hypothèses de réglage. Chaque fiche fournit une issue de réussite, d’échec et d’abandon, un état initial reproductible et une sortie vers la route. Un bonus facultatif n’empêche pas de poursuivre l’histoire ; une mission obligatoire doit porter un autre libellé et une solution de reprise. Les records n’attribuent une récompense permanente qu’une fois par règle. Les sauvegardes indiquent la version des objectifs et les ressources transmises au prochain combat.

### 6.2. Fiche I — parcours d’archives du simulateur

Le point d’entrée actuel est **Dossiers de liaison** : fiches et récompenses consultables. La cible d’exploration utilise un **index d’archives du simulateur**, métaphore d’interface originale inspirée du travail de connexion et de classement. Il ne s’agit pas d’un lieu canonique ajouté au monde, d’une autre Grève officielle ou d’un hub RPG livré.

| Zone de conception | Connexions prévues | Accès et contenu |
| --- | --- | --- |
| Index commun | Dossiers DS1/DC, dossiers DS2, souvenirs, sources | Accessible dès l’accueil ; permet toujours de sortir et de consulter les acquis. |
| Dossiers DS1/DC | Index, huit fiches de combattant, fiches d’objets | Personnages actuels disponibles ; souvenirs liés aux routes ou exercices. |
| Dossiers DS2 | Index, fiches documentaires et futures épreuves | Identités futures masquables ; statut de préparation distinct du déblocage. |
| Souvenirs de liaison | Index et fiche d’origine de chaque souvenir | Texte permanent consultable après acquisition, voie d’obtention lisible avant. |
| Sources et versions | Index et toute fiche de contenu | Provenance/version, champ « adaptation » et inconnues ; les détails narratifs sensibles restent protégés. |

Une future représentation spatiale doit reprendre ces connexions dans des pièces et passages logiques, avec retour garanti à l’index. Les clés sont des validations d’exercice ou de route, pas un objet acquis à l’intérieur de la zone qu’il doit ouvrir. Une ouverture est enregistrée avant sa révélation visuelle ; la fermeture pendant l’animation ne peut perdre le contenu. Aucune monnaie, loterie ou coût n’est ajouté aux huit souvenirs du lot courant.

<a id="deblocages"></a>
## 7. Dossiers de liaison : règles, slots et sauvegarde

### 7.1. Fiches A et D — quatre dimensions et charte

| Dimension | Cas à distinguer | Présentation attendue |
| --- | --- | --- |
| Découverte | Secret, indice/silhouette, identifié | Emblème neutre si la silhouette révèle le personnage ; aucun nom caché dans le texte accessible. |
| Droit | Aucun, permanent, temporaire, vérification en attente/expirée pour un futur service | « À débloquer » uniquement s’il existe une vraie condition d’accès ; « Acquis » pour le souvenir attribué. |
| Disponibilité technique | Contenu prêt, fichiers manquants, kit en préparation | « Kit en préparation » pour les futurs combattants DS2 ; un abonnement ne résout pas un kit absent. |
| Compatibilité | Autorisé dans le contexte, dépendance/restriction de mode | Dire quel contexte est requis ; un simple dossier consultable ne devient pas un personnage sélectionnable. |

La charte cible associe fond sombre contrasté, cadre de dossier, trait chiral discret, cadenas de terminal ou marque d’accès et texte. Le verrou est une métaphore d’interface du projet. Un état acquis, une erreur technique et une absence de droit ne reçoivent pas le même message. Le focus clavier reste visible ; les couleurs sont doublées par des formes et libellés. La révélation réduite remplace l’effet animé par une apparition simple. Une répétition de consultation ne rejoue pas obligatoirement une scène de déblocage.

Les identités DS2 affichables dans le lot sont Sam, Fragile, Higgs, Dollman, Tomorrow, Rainy et Tarman. Leur masquage est une préférence des Dossiers. Ces sept bases ne représentent ni tout le roster DS2 ni sept kits implémentés. Neil et les autres entrées du registre demeurent dans leur suivi propre. Les choix de personnage, tenue, arène et mode déjà disponibles restent accessibles.

### 7.2. Fiches B et J — huit règles de souvenirs

Chaque souvenir est un **nouveau texte du simulateur** associé à un kit existant, sans bonus de statistiques ni équipement. Sa règle d’acquisition permanente est la même pour les huit IDs :

```text
ROUTE_TERMINEE(personnage)
OU
(DISTANCE(personnage) ET GARDE_HAUTE(personnage)
 ET SIGNATURES(personnage) ET COMBO(personnage))
```

La route est reconnue par `echos.v1.chapters[id] === 3` **ou** `echos.v1.scenes[id + '-ending'] === true`. La seconde voie utilise les exercices `distance`, `guard-high`, `signatures`, `combo` de `echos.lessons.v1.completed`, chacun devant avoir été validé avec le même combattant dans sa liste `fighters`. Les réussites d’autres combattants ne complètent pas silencieusement cette règle. Les données déjà présentes permettent une attribution rétroactive pour ces événements précis ; aucune victoire non enregistrée n’est supposée.

| Contenu permanent et titre | Route associée | Alternative d’entraînement | Source d’attribution |
| --- | --- | --- | --- |
| `memory-sam` · Le bracelet rendu | Livraison sans adresse | Quatre exercices avec `sam` | `rule:memory-sam:v1` |
| `memory-fragile` · L’abri laissé ouvert | Le dernier quai | Quatre exercices avec `fragile` | `rule:memory-fragile:v1` |
| `memory-higgs` · Le silence du rappel | Sans public | Quatre exercices avec `higgs` | `rule:memory-higgs:v1` |
| `memory-cliff` · La quatrième note | La fréquence muette | Quatre exercices avec `cliff` | `rule:memory-cliff:v1` |
| `memory-mule` · La case du propriétaire | L’inventaire du matin | Quatre exercices avec `mule` | `rule:memory-mule:v1` |
| `memory-diehardman` · Une clé à hauteur de main | Une porte ouverte | Quatre exercices avec `diehardman` | `rule:memory-diehardman:v1` |
| `memory-mama` · Une travée pour deux | La portée du fil | Quatre exercices avec `mama` | `rule:memory-mama:v1` |
| `memory-heartman` · La marque de la seconde tasse | La seconde de trop | Quatre exercices avec `heartman` | `rule:memory-heartman:v1` |

L’attribution est **automatique**. Il n’existe donc pas de faux état « récompense à réclamer » ni de coût à repayer. La même règle réévaluée après navigation, reprise ou autre victoire laisse un seul droit permanent. Les succès et les textes sont des unités distinctes : huit souvenirs rédigés ne représentent pas huit campagnes nouvelles ni huit animations.

### 7.3. Sauvegarde et conservation des acquis

La clé dédiée est `echos.liaison.v1`. Elle contient la version de schéma, les acquisitions actives par ID dans `grants`, les entrées inconnues ou incompatibles dans `retainedGrants` et une préférence `hideFutureIdentities`. Une acquisition mémorise sa `source` stable et `acquiredAt`. Les entrées conservées ne deviennent pas des droits actifs sans règle compatible. Les clés historiques de routes et de leçons sont consultées sans conversion destructive. Le mode ne réécrit pas les tableaux de tournoi, les replays, les sauvegardes Boss, la campagne principale ou les équipes existantes.

Cette progression est **locale au navigateur** ; elle n’est pas présentée comme un compte synchronisé ni comme un justificatif externe. Un stockage indisponible doit laisser une consultation explicable et ne pas annoncer une sauvegarde durable réussie. Les erreurs de lecture ne doivent pas effacer les autres données. Les preuves de parse, attribution et reprise sont dans le rapport Progression.

### 7.4. Costumes, stages et modes futurs

Un costume acquis avant son combattant conserve son droit et affiche sa dépendance. Un costume cosmétique préserve commandes, volumes, timings et ressources ; une apparence DS2 qui réclame un autre kit devient une variante de gameplay documentée. La garde-robe existante de Mama n’est pas soumise rétroactivement à une quête. Les silhouettes, contours, masses, côtés de l’équipement et contrastes se vérifient sous les éclairages des arènes.

Un stage de base conserve son droit séparément d’une variante de période ou d’une destination liée. Les versions statique et animée restent disponibles ensemble pour le confort. Une transition ne mène jamais à une destination impossible à charger pour le match autorisé. Le déblocage d’un futur mode avancé ne peut dépendre uniquement d’une victoire dans ce même mode ; entraînement, commandes et accessibilité restent disponibles.

### 7.5. Fiche F — situations d’accès à contrôler

| Situation | Résultat attendu |
| --- | --- |
| Aucune route ni série d’exercices | Souvenir verrouillé, deux voies lisibles ; aucun combattant actuel retiré. |
| Une route terminée | Souvenir acquis automatiquement, texte consultable ; pas de bonus au duel. |
| Quatre exercices répartis sur des personnages différents | Aucun faux déblocage d’un souvenir de combattant. |
| Les quatre exercices d’un même personnage | Son souvenir acquis même si sa route n’est pas terminée. |
| Réouverture ou validation répétée | Même acquisition, même source et date conservées ; aucun doublon. |
| Futur DS2 sans kit | « Kit en préparation » ; pas de promesse de déblocage par un défi ou paiement. |
| Masquage des identités futures actif | Libellé, image, description et navigation respectent le masque. |
| Préférence future de soutien ou valeur locale modifiée | Aucun droit externe accordé ; service non raccordé. |

<a id="soutien"></a>
## 8. Soutien, droits temporaires et stages spéciaux — conception uniquement

### 8.1. Fiche C — avantage de soutien proposé

Le premier périmètre de conception est un **habillage original des Dossiers de liaison** et, plus tard, une ambiance cosmétique d’une arène existante. Aucun personnage, propriété de coup, donnée de collision, option de confort ou outil indispensable d’un kit n’est lié à ce soutien. Aucun prix, palier, compte ou paiement n’est créé dans ce lot.

| Champ | Décision de conception |
| --- | --- |
| ID d’avantage | `SUPPORT:liaison-cosmetics-v1`, réservé à une future intégration réelle. |
| Modèles permis | Récompense permanente livrée ; catalogue temporaire avec fin vérifiée ; lot daté attribué pendant une période définie. Chaque contenu choisira un modèle, sans mélange implicite. |
| Éligibilité | Fournisseur, campagne et avantage confirmés par un service de confiance. Un compte lié, une adresse identique ou un booléen client ne suffisent pas. |
| Voie gratuite | Les souvenirs `memory-*` restent exclusivement accessibles par les routes ou exercices déjà décrits ; aucun abonnement requis. |
| Expiration | Retirer seulement la source temporaire expirée ; conserver toute acquisition permanente et toute autre source valide. |
| Indisponibilité du fournisseur | Statut de vérification inconnu, jamais faux message d’abonnement terminé ; politique hors ligne à fixer avec le vrai service. |
| Changements de compte | Déliaison, annulation et suppression de compte sont trois actions distinctes ; aucune duplication automatique des lots entre profils. |
| État actuel | **Conçu, non connecté, non commercialisé.** Aucun droit Patreon vérifié, aucune synchronisation de compte ni offre opérationnelle. |

Le futur adaptateur demande une liaison volontaire via le fournisseur, conserve ses secrets hors du client et traite les événements signés, doublons et arrivées désordonnées. Une lecture autoritative réconcilie les événements utiles. Les modalités des essais, cadeaux, remboursements et baisses de niveau seront renseignées à partir du service effectivement choisi, pas déduites d’une mention dans le guide.

Les accès permanents locaux déjà obtenus n’expirent pas lors d’une déconnexion. Une configuration de match autorisée reste figée jusqu’au résultat ; une fin de droit n’interrompt pas un combo et ne remplace pas le décor en cours. La prochaine sélection propose un remplacement valide tout en conservant les préférences. Historique, progression et replays ne sont pas effacés parce qu’un accès temporaire prend fin.

### 8.2. Fiche E — stage spécial proposé

`STAGE-SUPPORT:terminal-liaison-ambience` désigne une **ambiance originale du terminal reconstitué du simulateur**, pas un lieu officiel supplémentaire. Sa géométrie cible est identique à celle de la configuration commune retenue : même sol, mêmes limites, collisions et signaux d’action. Le réglage de confort statique est compris. Aucune teinte ne doit améliorer le camouflage d’un costume ni masquer une attaque.

La politique cible distingue **sélectionner** le stage et **participer** à la partie : un joueur autorisé peut choisir l’habillage ; son adversaire reçoit les fichiers nécessaires pour le match sans acquérir le droit de sélection. Si le moteur ne peut garantir distribution et versions, la partie utilise une configuration commune annoncée avant lancement. Une destination de transition est préparée avec l’arène, sans verrou au milieu du match. L’accès d’entraînement à ses propriétés et l’affichage de replays sont définis indépendamment de l’abonnement courant. Cette fiche ne livre ni assets de soutien ni mode en ligne supplémentaire.

<a id="production-qa"></a>
## 9. Production, validation et éléments restant à réaliser

### 9.1. Inventaire des unités

Le lot documentaire comprend **38 décisions**, **8 fiches de personnalité**, **8 paires prioritaires**, **10 bonus conçus**, un parcours d’archives à cinq zones conceptuelles et les fiches d’accès/soutien. Le lot fonctionnel traite les taunts et la présentation du roster ainsi que **8 souvenirs textuels**. Les Dossiers comptent **59 fiches** : huit souvenirs, huit combattants, deux tenues, vingt-cinq configurations d’arène, neuf modes et sept bases DS2. Le nombre de nouveaux PNG reçus, leurs dimensions et leur raccordement sont consignés dans [Assets](production/20261127-extensions/ASSETS.md) ; il n’est pas déduit de ces comptes documentaires.

Les besoins à produire ensuite restent identifiés : dessins intermédiaires des gestes, variantes de costume, assistances entrée/action/sortie, relais entrant/sortant, HUD d’équipe, duos, finales collectives, clashes, acteurs de bonus, passages d’archives, versions DS2 et audio propre. Les sources autonomes conservent un seul sujet. Un storyboard de duo peut en réunir plusieurs sans devenir un sprite de combattant. Toute nouvelle image conserve une référence de version et un relevé des détails visibles/non visibles.

### 9.2. Matrice des 18 cas de l’extension 01

| Cas | Validation requise | Périmètre |
| --- | --- | --- |
| E1-01 | Navigation rapide, confirmation, désélection ; aucun effet d’ancien aperçu restant | Lot présentation, preuve dédiée. |
| E1-02 | Taunt interrompu, vulnérabilité et retour au contrôle | Lot présentation, preuve dédiée. |
| E1-03 | Assistance et relais simultanés : partenaire engagé une seule fois | Futur mode équipe. |
| E1-04 | Deux dépenses de la dernière portion de Cohésion | Futur mode équipe. |
| E1-05 | Soutien touché/KO pendant l’arrivée | Futur mode équipe. |
| E1-06 | Duo demandé pendant sortie d’assistance | Futur mode équipe. |
| E1-07 | Super initiale touchée, gardée, manquée ou interrompue | Futur mode équipe. |
| E1-08 | Fin dramatique incompatible : remplacement et résultat inchangé | Futures scènes collectives. |
| E1-09 | Clash avec projectile tiers, piège et assistance | Futur clash. |
| E1-10 | Réussite, échec, égalité, absence, déconnexion QTE | Futur clash et éventuel réseau. |
| E1-11 | Objet du propriétaire en réserve ou KO | Future équipe ; objets actuels restent suivis par leurs recettes. |
| E1-12 | Transition avec objet posé et historique de combo | Future équipe/transitions. |
| E1-13 | Réflexion : attribution des dégâts, ressource et fin | Future mécanique de réflexion, si retenue pour un kit. |
| E1-14 | Boucles piège/relais/assistance ; limites de combo partagées | Futur équilibrage d’équipe. |
| E1-15 | Horde au plafond : entrées, performances et issues sûres | Futur bonus horde. |
| E1-16 | Bonus gagné/raté/abandonné : bonne route et bonne récompense | Futurs bonus. |
| E1-17 | Déblocage, enregistrement, rechargement sans doublon | Lot Dossiers, preuve dédiée. |
| E1-18 | Scène abrégée et correction réseau : état final identique | Sélection locale dans Présentation ; scènes collectives/réseau futures. |

### 9.3. Matrice des 22 cas de l’extension 02

| Cas | Validation requise | Périmètre |
| --- | --- | --- |
| E2-01 | Secret protégé par nom, image, voix et texte accessible | Dossiers : identités futures masquées ; voix nouvelles absentes. |
| E2-02 | Slot consultable et condition lisible, confirmation sans blocage | Dossiers, preuve dédiée. |
| E2-03 | Attribution automatique ou récupération conforme | Dossiers : automatique seulement. |
| E2-04 | Conditions ET/OU et alternatives exactes | Dossiers, preuve dédiée. |
| E2-05 | Réévaluation/sauvegarde interrompue sans double attribution | Dossiers, preuve dédiée. |
| E2-06 | Costume acquis avant son personnage | Évaluateur local testé ; catalogue à acquisitions distinctes futur. |
| E2-07 | Acquisition permanente conservée après expiration temporaire | Évaluateur pur testé ; service externe futur, souvenirs actuels permanents. |
| E2-08 | Accès expiré : source seule retirée, préférences/progression gardées | Évaluateur pur testé ; réconciliation externe et sélection globale futures. |
| E2-09 | Annulation avec période encore valide | Fenêtre temporelle évaluée en logique ; événement fournisseur futur. |
| E2-10 | Service indisponible et politique hors ligne | Évaluateur pur testé ; aucun compte ou service connecté. |
| E2-11 | Droit valide mais assets/kit absents | Dossiers : état de préparation séparé du verrou. |
| E2-12 | Retrait d’une source avec seconde source encore valide | Évaluateur pur testé ; réception réelle de sources externes future. |
| E2-13 | Stage spécial face à un non-abonné | Future distribution multijoueur. |
| E2-14 | Destination liée prête avant lancement | Future distribution ; liaison actuelle conservée. |
| E2-15 | Expiration pendant un match sans interruption | Futur service externe. |
| E2-16 | Apparence/partenaire inaccessible : remplacement sans perte de profil | Future sélection à droits distincts. |
| E2-17 | Présentations statique/vivante conservées | Non-régression des accès actuels ; futur stage spécial. |
| E2-18 | Aucun cycle de prérequis de mode | Aucun mode actuel verrouillé ; validation du futur graphe. |
| E2-19 | Invité, double liaison et changement de niveau | Futur système de comptes. |
| E2-20 | Événements externes doublés/désordonnés | Futur adaptateur fournisseur. |
| E2-21 | Clavier, manette, texte accessible, mouvement réduit | Portée précise dans Présentation/Progression ; essais matériels distincts. |
| E2-22 | Migration, resynchronisation et restauration | Schéma local Dossiers dans sa preuve ; synchronisation distante future. |

Une ligne « preuve dédiée » indique où lire le résultat réel ; elle ne déclare pas tous les scénarios exécutés. Le [rapport Progression](production/20261127-extensions/PROGRESSION.md) consigne 37 groupes réussis : 30 de données/logique et sept du contrôleur dans un DOM explicitement simulé. L’évaluateur de droits permanents/temporaires traite des entrées de test ; aucun adaptateur de fournisseur ni gestionnaire d’installation n’est connecté. Les tests de données, la simulation du duel, un DOM simulé, un rendu Canvas et un navigateur matériel ne sont pas interchangeables. Chromium n’a pas pu démarrer sur ce poste ; aucune réception visuelle dans un navigateur ni essai de manette physique n’est annoncé. Les cas futurs restent ouverts et reliés aux modules concernés.

### 9.4. Ordre de poursuite concret

1. Stabiliser les gestes locaux, l’interruption et la présentation, puis la progression des souvenirs sans retirer d’accès existant.
2. Produire et comparer les poses manquantes par personnage/version ; compléter les dessins intermédiaires seulement quand les cycles sont prêts.
3. Réaliser le profil local à deux membres, son HUD, ses coûts et sa propriété d’entités ; éprouver assistance/relais avant toute super.
4. Produire une paire prioritaire, une conclusion compatible et un bonus, puis étendre selon les preuves de fonctionnement.
5. Ouvrir les kits DS2 après références et fiches dédiées ; conserver les œuvres moins documentées dans l’inventaire.
6. Raccorder un fournisseur de soutien seulement avec un backend et une offre concrète vérifiés ; le lot actuel ne dépend pas de cette étape.

<a id="references-fidelite"></a>
## 10. Références de fidélité et portée de l’intégration

Les pages primaires suivantes ont été relues pour cette adaptation le 27 novembre 2026 : [Kojima — région Est](https://www.kojimaproductions.jp/en/DSTips), [Kojima — guide DC](https://www.kojimaproductions.jp/en/death-stranding-directors-cut-beginners-guide), [PlayStation — personnages DS1](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/) et [PlayStation — distribution DS2](https://blog.de.playstation.com/2025/06/24/death-stranding-2-on-the-beach-diese-schauspieler-und-synchronsprecher-sind-dabei/). Elles servent à conserver rôles, versions et limites des équipements. La fiche Mama reprend la référence Gamescom déjà qualifiée dans la bible ; le contrôle d’une animation dessinée exige ensuite l’inspection du plan officiel correspondant.

Les règles chiffrées, le simulateur, les champs d’accès, les souvenirs et toutes les scènes conçues ici restent **P4 : création ou adaptation du projet** dans la hiérarchie d’UNIVERS_DS. L’objectif visuel est la fidélité à une référence identifiable, avec comparaison de chaque détail visible ; une copie de guide, un portrait généré ou une simple concordance de nom ne certifient pas une fidélité 1:1. Les inconnues et parties non montrées restent déclarées dans la production.

Les dates de publication, plateformes et projets annoncés de l’univers restent maintenus dans [UNIVERS_DS.md](UNIVERS_DS.md). Cette intégration ne modifie pas leurs continuités, ne déclare aucun nouveau rôle canonique et ne remplace aucune sauvegarde des modes précédents.

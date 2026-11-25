# Lot univers — Death Stranding 2D / Échos de la Grève

**Réception du 25 novembre 2026.** Ce lot élargit la bible à toute la licence Death Stranding, ajoute **34 PNG natifs retenus**, intègre **quatre arènes jouables**, ouvre les Archives à huit dossiers DS2 et ajoute un **Boss Rush de six rencontres**.

Les chiffres décrivent les fichiers et fonctions livrés. Le [registre de l’univers](../../UNIVERS_DS.md) conserve un périmètre plus large que ce premier lot DS2 ; il distingue les œuvres, éditions, variantes et projets annoncés.

## 1. Périmètre et association à la bible

La [bible de combat](../../BIBLE_COMBAT.md) couvre désormais Death Stranding, Director’s Cut, Death Stranding 2: On the Beach, leurs références officielles et adaptations, ainsi que les projets audiovisuels annoncés. Le registre indique les sources et le statut de chaque entrée. Une annonce n’est pas assimilée à une œuvre disponible, un artbook à une nouvelle chronologie ou un concept inutilisé à un design du jeu final.

L’association au jeu passe par une identité, une œuvre/version, une tenue, un rôle, des références vérifiables et un état de production. Sam, Fragile et Higgs DS2 ont leurs propres images de version. Ces images ne remplacent pas les tenues des combattants DS1 existants. Les huit kits actuels constituent un état de développement, pas une limite documentaire.

Le guide général reste intégralement conservé dans [Combat_Games_Guide_General_v1.0.txt](../../references/Combat_Games_Guide_General_v1.0.txt). Ses trente exigences EDG restent associées aux sections et preuves du projet. Fichier de **55 172 octets**, SHA-256 :

    4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7

Les bilans précédents des §13–15 de la bible restent des instantanés datés. Le §16 décrit cette reprise.

## 2. Images produites et intégrées

| Ensemble | PNG retenus | Contenu et intégration |
|---|---:|---|
| Portraits DS2 | 7 | Sam Drawbridge, Fragile, Higgs, Tomorrow, Rainy, Tarman et Neil ; galerie et Archives. |
| Sujets entiers DS2 | 3 | Dollman, Red Samurai et chat chiral ; galerie. Dollman rejoint aussi les Archives. |
| Objet isolé | 1 | Guitare de Higgs DS2 ; galerie, avec références officielles partielles et complément de statue sous licence. |
| Panoramas DS2 | 3 | Magellan au couchant, Plate Gate et front de sable ; galerie. Le panorama Magellan sert aussi de secours à son arène. |
| Plans d’arène | 20 | Ciel, lointain, plan intermédiaire, sol et premier plan pour quatre nouveaux lieux jouables. |
| **Total** | **34** | **14 bases DS2 + 20 plans indépendants.** |

Les 34 fichiers occupent **53 577 560 octets** : **27 PNG avec transparence** et **7 images opaques**. Chaque fichier contient une seule image ; aucun cycle d’animation n’a été créé dans cette phase.

Les dimensions natives sont consignées par fichier. Les panoramas et plans mesurent **1 672 × 941** ; les sujets isolés conservent leurs formats propres, dont **2 172 × 724** pour la guitare. Les PNG ont été copiés octet pour octet depuis les sorties du générateur, sans agrandissement artificiel ni retouche de leurs pixels. Les dimensions ne sont pas présentées comme une livraison 4K.

Le plan lointain Magellan a fait l’objet d’une reprise : le vaisseau était partiellement caché par le marais et semblait posé sur la berge. La version retenue réduit sa silhouette pour montrer le survol, coque et volumes inférieurs compris. **35 sorties ont donc été produites, pour 34 chemins finaux actifs**. La version remplacée n’est pas comptée deux fois ; son empreinte et le motif de reprise figurent dans le manifeste.

### Provenance et fidélité

Le [manifeste des 34 PNG](../../../../art/sources/echos-de-la-greve/production-20261125-universe/manifest.json) contient les prompts exacts, sources, cadrages, empreintes, dimensions et raccordements. Les sources officielles sont distinguées des produits sous licence et des panoramas déjà créés pour le projet.

Les principales limites restent explicites :

- Les portraits ne certifient pas un costume complet hors cadre. Tomorrow conserve ici son haut sombre ; Sam utilise sa tenue Drawbridge noire.
- Les jambes et pieds du Red Samurai sont reconstitués, car l’affiche disponible les coupe. Son image ne crée pas un nouvel ennemi jouable.
- La guitare combine deux captures de détail et une statue sous licence ; les petites parties masquées sont reconstruites.
- Le chat chiral est isolé depuis le portrait de Tarman ; certaines parties et sa posture sont adaptées.
- Fragile conserve la main près du visage ; la cigarette est omise.
- Les paysages sont recomposés pour le combat latéral. L’approche de Mountain Knot représente la vallée enneigée, sans inventer une ville bâtie.

La [revue visuelle](review/REVUE_VISUELLE.md) documente les comparaisons sur deux fonds, les détails examinés et les captures du moteur. Aucun statut de fidélité globale 1:1 n’est attribué.

## 3. Quatre arènes raccordées au jeu

| Arène | Univers et environnement | Résultat livré |
|---|---|---|
| Ruines de South Knot | DS1/DC ; façades, viaduc, gravats et pluie temporelle. | Panorama existant réutilisé et cinq nouveaux plans. |
| Ferme sous la pluie temporelle | DS1/DC ; cultures, équipements agricoles et piste de terre. | Panorama existant réutilisé et cinq nouveaux plans. |
| Approche de Mountain Knot | DS1/DC ; vallée enneigée, roches sombres et sommets. | Panorama existant réutilisé et cinq nouveaux plans. |
| DHV Magellan — berge au couchant | DS2 ; marais, roseaux, collines et vaisseau en survol. | Nouveau panorama et cinq nouveaux plans. |

Les quatre arènes sont disponibles depuis le catalogue de lieux et la sélection. Les parcours d’intégration vérifient leur lancement en Versus, Entraînement et Boss Battle, ainsi que leur acceptation par le salon privé.

Chaque couche conserve ses proportions avec une échelle uniforme. Les ancrages sont mesurés sur les PNG livrés : le sol visible rejoint la ligne physique **y = 588** du Canvas **1 280 × 720**. Le premier plan reste bas pour préserver les pieds et la zone de duel. Le Magellan n’apparaît qu’une fois, dans le plan lointain.

Le détail des ancrages, raccords, modes d’effets et ambiances se trouve dans [ARENAS.md](ARENAS.md). Les nouveaux profils d’ambiance emploient les mécanismes sonores existants ; aucune bande originale externe n’a été ajoutée.

Plate Gate et le front de sable restent des panoramas de galerie. Ils ne sont pas comptés comme deux arènes supplémentaires.

## 4. Boss Rush, galerie et Archives

### Boss Rush

Le mode enchaîne **lion → Catcher aquatique → baleine → géant → camion MULE → convoi**. Le convoi conserve ses deux vagues et son objectif de livraison.

Le combattant, la tenue et la difficulté restent les mêmes sur la série. Le joueur commence avec **120 PV** ; chaque victoire rend **20 PV**, dans la limite de 120. L’énergie chirale et la garde reviennent à 100 entre les rencontres. Une défaite termine la série ; recommencer repart au premier boss.

La reprise en cours de combat conserve le checkpoint exact, sans soin supplémentaire. Sauvegarde et records de Boss Rush restent distincts de Boss Battle. Les sauvegardes corrompues, identifiants hérités du prototype et tenues inconnues sont rejetés. Un refus du stockage est signalé en conservant la progression de session.

Les règles, commandes et tests sont détaillés dans [BOSS_RUSH.md](BOSS_RUSH.md).

### Galerie et Archives

**Silhouettes et horizons** présente **29 images** : 15 du lot DS1/DC et 14 images DS2. Les filtres d’œuvre et de catégorie se combinent. Les versions restent affichées, les proportions utilisent les dimensions natives et le téléchargement pointe vers le PNG original. La galerie propose un agrandissement, un fond sombre ou neutre et le retour du focus à la fermeture.

Les Archives réunissent **12 dossiers** : Deadman, Amelie, Bridget et Lockne, puis Sam DS2, Fragile DS2, Higgs DS2, Dollman, Tomorrow, Rainy, Tarman et Neil.

Le relais HTTP dessert maintenant les pages de la galerie et les deux répertoires statiques, à la racine du service et sous le préfixe du mode. Les nouveaux fichiers participent aussi à l’empreinte de version du salon.

## 5. État après intégration

| Unité | Total vérifié |
|---|---:|
| Combattants jouables | 8 |
| Modes | 8 |
| Rencontres Boss Battle, également utilisées dans Boss Rush | 6 |
| Lieux distincts | 16 |
| Configurations d’arène, variante sèche comprise | 17 |
| Chemins de plans d’arène | 85 |
| Images de la galerie statique | 29 |
| Dossiers des Archives | 12 |
| Chemins d’image distincts des catalogues et Archives | 292 |
| PNG récents actifs : lot du 24 + premier lot du 25 + lot univers | 113 + 15 + 34 = **162** |

L’[inventaire des catalogues](catalogue-inventory.json) vérifie les 292 chemins sans fichier manquant. L’[inventaire natif actif](active-native-images.json) rapproche les 162 fichiers des manifestes : les 128 images déjà publiées sont conservées et les 34 nouvelles gardent leurs octets d’origine. Pour les 19 fichiers anciens dépourvus de SHA-256 dans leur rapport initial, l’identité est vérifiée par le hash de blob Git historique puis leur SHA-256 courant est enregistré.

## 6. Vérification et portée des preuves

| Contrôle | Portée et preuve |
|---|---|
| Fichiers et provenance | 34 PNG décodés, une image chacun, empreintes source/intégration égales ; [manifeste](../../../../art/sources/echos-de-la-greve/production-20261125-universe/manifest.json). |
| Rendu des arènes | 32 cas Canvas natifs : quatre arènes × local/entraînement × deux directions × effets normaux/réduits ; [rapport et captures](stage-renders/validation.json). |
| Mesures des sources | Lignes de sol, alpha, raccords et premiers plans mesurés sur les 20 plans ; [mesures](stage-source-measurements.json). |
| Régression du duel | 360 checkpoints comparés au moteur antérieur avec les mêmes données ; [rapport](stages-verification.json). |
| Interface des arènes | 12 lancements à travers les vrais gestionnaires d’interface, avec DOM simulé ; même rapport. |
| Boss et Boss Rush | 20 groupes, six victoires par commandes et série complète à travers l’interface, rechargements, défaite, reprise et stockage refusé ; [rapport](boss-rush-verification.json). |
| Galerie | 12 groupes, filtres combinés, téléchargements et 29 fichiers réels ; [rapport](static-gallery-verification.json). |
| Réseau et HTTP | Service réel, chemins et types de contenu, catalogue et 24 chemins des nouvelles arènes dans les deux formes d’URL ; [journal](http-verification.log). |
| Ambiances | 17 profils ; [journal](ambiances-verification.log). |
| Revue indépendante | 34 PNG, fonds contrastés et captures principales du moteur ; [revue](review/REVUE_VISUELLE.md). |
| Réception finale | Syntaxe de 16 scripts, 60 liens de rapports, 34 empreintes natives et conservation des branches sources ; [contrôle de publication](delivery-verification.json). |

**Portée :** les pixels des arènes ont été rendus avec Canvas natif et les requêtes HTTP ont utilisé un vrai serveur. Les scénarios d’interface emploient le code applicatif réel dans un DOM simulé. Une session complète dans un navigateur natif, sa mise en page responsive et son comportement clavier réel ne sont pas revendiqués.

## 7. Rapprochement des branches et suites documentées

La reprise conserve le guide déjà intégré à main et les lots de la branche graphique. Elle réconcilie les travaux des PR **2 à 5** sur les outils facultatifs : CodeGraph, Sand3D, SpriteCast et catalogues de compétences partagés.

Les doublons de chemins de sous-modules sont résolus, les références épinglées, et **40 entrées de compétences** ainsi que **27 chemins amont** contrôlés. Ces outils restent séparés de l’exécution du jeu. La [preuve de réconciliation](tooling-reconciliation.json) décrit cette vérification locale. La fusion finale se vérifie dans l’historique Git et la PR de livraison.

Le registre garde ouverts les autres personnages, ennemis, équipements et lieux de l’univers DS, la documentation des œuvres annoncées, les futurs kits et les animations. Les portraits DS2 ne valent pas huit nouveaux combattants. La comparaison canonique exhaustive et les vues asymétriques dédiées restent des travaux distincts. Ce lot termine son périmètre de production et d’intégration sans déclarer toute la licence déjà reproduite.

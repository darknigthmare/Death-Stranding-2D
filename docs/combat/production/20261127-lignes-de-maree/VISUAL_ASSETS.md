# Les Lignes de Marée — réception des bases visuelles

27 novembre 2026. Créations originales de fans destinées à Death Stranding 2D. Les identités de cette extension ne sont pas des personnages officiels de Death Stranding. La cohérence recherchée porte sur les matériaux, les métiers, les silhouettes de portage et les équipements fonctionnels ; aucune origine canonique n'est revendiquée.

## Personnages : dix bases reçues

Les dix personnages possèdent chacun **un PNG autonome**, en pied, orienté vers la droite dans une posture défensive neutre. Les fichiers se trouvent dans `modes/echos-de-la-greve/assets/lignes-de-maree/characters/`.

| ID | Personnage | Signature visuelle contrôlée |
| --- | --- | --- |
| `ldm-char-balise` | Maëlle « Balise » Rocher | Combinaison graphite, plastron de secours orange, corde et mousquetons. |
| `ldm-char-lest` | Jonas « Lest » Vale | Silhouette large, barbe grise, caisse de portage, renforts mécaniques des jambes et du dos. |
| `ldm-char-suture` | Inès « Suture » Sorel | Combinaison ivoire, trousse rigide, écharpe bordeaux courte. |
| `ldm-char-relais` | Elias « Relais » Reed | Combinaison bleu ardoise, radio dorsale étroite, antenne et outil câble rangé. |
| `ldm-char-isobare` | Naya « Isobare » Quill | Parka froide, instrument météo d'épaule, plaques mates. |
| `ldm-char-contrevoie` | Oren « Contrevoie » Pike | Tenue ocre réparée, portage renforcé, perche industrielle rangée. |
| `ldm-char-vigie` | Alma « Vigie » Voss | Physique âgé et sec, tenue olive, jumelles et manteau court. |
| `ldm-char-ecluse` | Tariq « Écluse » Moss | Tenue pétrole, sangle roulée, genouillères et pince industrielle. |
| `ldm-char-sillage` | Jun « Sillage » Akiyama | Bonnet, tenue gris/bleu, châssis compact et clé dynamométrique. |
| `ldm-char-archive` | Célia « Archive » Ward | Cheveux argent, manteau mastic, deux boîtiers documentaires et terminal. |

**Réception technique :** dix fichiers RGBA de **1024 × 1536 pixels**, total **19 934 701 octets**. Les octets natifs sont conservés sans redimensionnement, recoloration, détourage algorithmique ou recomposition. Le [manifeste des personnages](characters-generation.json) fournit dimensions, SHA-256, étendue alpha, boîte du sujet au seuil alpha 128, prompt exact et chemin source. Les dix copies intégrées sont identiques à leurs sources. La résolution native est indiquée précisément ; ces fichiers ne sont pas déclarés 4K.

**Revue visuelle effectuée :** chaque sortie native affichée a été inspectée pour le nombre de sujets, les proportions humaines, le cadrage tête/mains/bottes, l'orientation, la posture, les couleurs de métier et les principaux équipements. Aucun panneau de sprite ni montage multiforme n'est compté comme un personnage. Les références des personnages officiels ont servi à examiner le niveau de détail du projet, sans être fusionnées aux nouveaux visages.

**Limites conservées :** ce sont dix poses de base, pas dix kits jouables, ni dix séquences animées. L'alpha fourni par le générateur conserve des franges translucides et une légère diffusion autour de certaines silhouettes ; aucun nettoyage inventé n'est annoncé. La latéralité anatomique des petits accessoires et leur continuité devront être verrouillées lors des vues opposées et poses d'action. Une simple mise en miroir ne garantit pas les équipements asymétriques. Les silhouettes sont trois-quarts latérales, avec une légère visibilité du torse. Les images constituent les premières références de ces personnages originaux ; la conformité 1:1 à un personnage canonique n'a pas de sens pour ces créations.

## Méthode

Génération avec **ImageGen intégré**, un appel par personnage. Les prompts exacts sont conservés dans `prompts/<slug>.txt`. Aucun appel CLI/API externe n'a été substitué. Sept sorties ont fourni une copie PNG native locale. Pour Isobare, Contrevoie et Vigie, le service a renvoyé uniquement l'URL de données PNG ; ces octets ont été décodés sans retouche dans un fichier natif, puis copiés dans le projet. Les fichiers base64 intermédiaires ont été supprimés après décodage.

Le raccordement aux menus, à la galerie et aux fiches de l'extension est documenté par le lot d'intégration. Les états de production doivent rester distincts : **base visuelle reçue**, **animation à produire**, **kit à réaliser**.

## Ennemis : vingt bases reçues

Les **vingt IDs du catalogue stabilisé** correspondent exactement aux vingt images de `modes/echos-de-la-greve/assets/lignes-de-maree/enemies/<slug>-base.png`. Le [manifeste des ennemis](enemies-generation.json) conserve chaque prompt, le PNG natif source, le SHA-256, les dimensions, la transparence et la boîte du sujet au seuil alpha 128. Les vingt empreintes sont distinctes ; la parité source/intégration est vérifiée pour chaque fichier.

| Groupe | IDs reçus | Lecture visuelle |
| --- | --- | --- |
| Humains logistiques · 10 | `guetteur-cargo`, `lieur-de-quai`, `porteur-belier`, `courrier-leurre`, `vigile-isolant`, `lanceur-filet`, `poseur-capteur`, `racleur-depot`, `arbitre-convoi`, `mecanicien-fermeur` | Scanner et bâton, lien à fourche, portage lourd, colis leurre, protection isolante, lance-filet, piquets de capteur, traîneau replié, lanceur de contrôle et pince de maintenance. |
| Automates · 4 | `patrouilleur-chenille`, `drone-cordier`, `chariot-verrou`, `borne-traqueuse` | Chenilles, quatre rotors carénés et treuil, chariot à barrière frontale, borne sur trois appuis roulants. |
| Manifestations de goudron · 6 | `echoue-ancre`, `echoue-rampe`, `echoue-derive`, `empreinte-releve`, `echoue-guetteur`, `echoue-enserreur` | Suspension, reptation basse, dérive inclinée, main issue d'une masse de poix, silhouette longue penchée et bras enveloppants. |

Chaque ID du tableau reçoit le préfixe `ldm-enemy-` dans le catalogue. La réception comprend **20 PNG RGBA**, total **38 853 555 octets** : 14 formats portrait de 1024 × 1536 et 6 formats paysage de 1536 × 1024. Les formats paysage servent aux quatre machines, à l'Échoué rampant et à l'Empreinte de relève. Les poses et dispositifs ont été examinés dans chaque sortie affichée ; les entités restent uniques, visibles en entier et sans décor associé.

Ces vingt bases ne représentent pas vingt IA réalisées. Les silhouettes humaines utilisent une famille d'habits logistiques et plusieurs visages restent proches : le rôle se lit principalement par le portage et l'équipement. Les appareils attachés, roues, rotors, outils, liens et projectiles ne sont pas livrés comme pièces séparées par ce lot. Les phases d'apparition/attaque/impact/disparition des BT, les variantes directionnelles, l'animation mécanique, les effets et les silhouettes abîmées restent à produire. La diffusion translucide native est conservée et devra être évaluée sur les fonds clairs comme sombres.

### Cinq candidats exclus du catalogue

Cinq premiers briefs d'ennemis ont été remplacés pendant la stabilisation concurrente des IDs. Leurs sorties sont conservées sous `art/sources/echos-de-la-greve/lignes-de-maree-candidates/` et dans le [manifeste des candidats](enemy-candidates-generation.json) avec l'état `excluded_from_current_catalog` : `rabatteur`, `porte-caisson`, `lance-sangle`, `guetteur`, `perchiste`. Ces images ne sont ni remappées artificiellement vers les nouveaux IDs, ni comptées parmi les vingt ennemis, ni raccordées au runtime. Elles sont disponibles comme pistes de conception seulement.

## Résultat de cette réception

**30 bases actives pour le catalogue : 10 personnages + 20 ennemis**, soit **58 788 256 octets**, toutes natives et distinctes. **5 candidats séparés** restent exclus de ce total. Les stages et les boss sont produits et reçus dans leurs propres manifestes par le lot principal.

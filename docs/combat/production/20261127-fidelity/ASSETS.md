# Images et fidélité — poses de transition et référence Maser

**27 novembre 2026 · Death Stranding 2D / Échos de la Grève.**

[Bilan](BILAN.md) · [Contrat de présentation](FIDELITY_PRESENTATION.md) · [Sources inspectées](reference-research.json) · [Audit Die-Hardman](AUDIT_SOURCES.md) · [Manques DS2](MANQUANTS_DS2.md).

## 1. Périmètre et méthode

La priorité reste la fidélité des versions, des silhouettes, des vêtements et des équipements. Les nouvelles poses prolongent les gestes du simulateur à partir de leurs images de référence existantes. Elles ne sont pas présentées comme des animations officielles extraites des jeux. La tenue « Maintenance du viaduc » de Mama est une reconstitution du projet ; son nom et son rôle restent distincts d’une tenue canonique attestée.

Chaque pose est un PNG natif autonome. Le fichier reçu est copié sans retouche de pixels, redimensionnement, conversion ou découpe. Le moteur utilise séparément les limites alpha et les points d’appui mesurés pour son cadrage. Les prompts, les références locales, les sorties retenues et les sorties écartées sont conservés dans [presentation-generation.json](presentation-generation.json). Les dimensions, empreintes et intégrations effectivement reçues sont contrôlées par [native-inventory.json](native-inventory.json) et [inventory-verification.json](inventory-verification.json).

Le contrat utilise trois clés indépendantes : entrée, tenue et sortie. Une phase absente ou non chargée revient à la posture du même personnage et de la même tenue. La tenue Viaduc ne doit jamais emprunter le geste Atelier. Le mode de mouvement réduit conserve un rendu stable en entrée et sortie ; le compteur de vulnérabilité reste celui du geste normal. Les captures du vrai moteur sont décrites dans [presentation-native.json](presentation-native.json).

## 2. Gestes et versions

| Sujet | Version et continuité à conserver | Phases nouvelles reçues |
| --- | --- | --- |
| Sam | Porteur DS1/DC, harnais, capsule et équipement attachés ; pouce levé au centre du geste. | Préparation du geste et retour des mains. |
| Fragile | Tenue DS1 et parapluie fermé ; aucune substitution de la version Drawbridge DS2. | Préparation de l’invitation et retrait de la main. |
| Higgs | Tenue DS1, capuche et masque d’or ; aucune armure ni guitare DS2. | Ouverture et fermeture du salut théâtral. |
| Cliff | Version DS1 du champ de bataille ; équipement militaire propre au modèle. | Main vers la tempe puis retour. |
| MULE | Opérateur DS1 anonyme ; scanner tenu du même côté pendant le cycle. | Levée et abaissement du scanner. |
| Mama Atelier | Avatar technique du simulateur, lunettes et tenue Atelier. | Main vers les lunettes puis retour. |
| Heartman | Avatar du chercheur DS1 ; continuité du dispositif avec le poignet de la posture active. | Préparation, nouvelle consultation du poignet et retour. |
| Mama Viaduc | Tenue de maintenance créée pour le simulateur, distincte d’Atelier. | Entrée, ajustement des lunettes et sortie propres à la tenue. |

La provenance et la recette recensent les fichiers réellement retenus, sans compter une tentative écartée comme une image livrée. Trois poses jalonnent un geste ; elles ne constituent pas une animation image par image complète. Le retournement horizontal employé par le moteur conserve aussi une réserve sur les asymétries du costume et les inscriptions : deux directions rendues ne prouvent pas deux modèles latéraux canoniques.

Le sous-lot comporte **18 PNG** : quatorze entrées/sorties pour les sept kits de base ci-dessus, trois poses Viaduc et un nouveau hold Heartman. Le hold historique Heartman changeait son dispositif de poignet par rapport à la posture active. Il reste conservé mais n’est plus utilisé. Le nouveau geste lève seulement le bras équipé pour consulter l’écran ; sa direction « Un instant » reste celle du simulateur. Le portrait officiel consulté ne montre pas les poignets : la correction est qualifiée de continuité interne et ne certifie pas un côté anatomique canonique.

Avec le Maser ci-dessous, le lot reçoit **19 nouveaux PNG natifs**. Les 450 PNG/WebP antérieurs sont préservés ; 469 fichiers raster sont conservés, tandis que le runtime utilise 413 chemins uniques. Les PNG récents sont 284 conservés et 283 actifs. La liste nominative, les tailles, l’alpha, les empreintes natives et les mesures de pied figurent dans les inventaires liés au §1.

<a id="maser"></a>
## 3. Décharge du Maser Handgun — DS2

La [vidéo de discrétion du guide officiel PlayStation](https://www.playstation.com/en-us/games/death-stranding-2-on-the-beach/death-stranding-2-on-the-beach-guide/) identifie l’arme dans son interface. La [séquence source](https://gmedia.playstation.com/is/content/SIEPDC/global_pdc/en/games/pdps/d/de/death-stranding-2/_guide/videos/death-stranding2-stealth-video-01-20jun25.mp4) a été inspectée à trois instants : visée/charge à 8,2 s, filaments électriques à 10,0 s, impact lumineux à 10,6 s. La référence de génération est le cadre complet extrait à **10,0 s**, conservé dans le manifeste avec son empreinte.

L’image reçue est [maser-handgun-ds2-discharge.png](../../../../modes/echos-de-la-greve/assets/fidelity-20261127/static/maser-handgun-ds2-discharge.png) : **2 172 × 724**, RGBA, **399 006 octets**, SHA-256 `88e1868944d82c8b482acac128e0cb8edc4b2b5fb9167b74adbb067c447a3e74`. Elle isole des filaments blancs à franges bleu pâle, avec un éclat compact à leur origine. Aucun personnage, arme, décor ou élément d’interface n’est inclus. Environ **88,59 %** des pixels ont un alpha nul. La copie intégrée est identique à la sortie native.

Il s’agit d’une **image fixe de référence pour la galerie**, distincte de l’arme déjà livrée. Le nombre et la courbure des filaments sont une restitution dessinée du cadre observé. Le lot ne livre pas la durée complète de la décharge, son animation, un projectile simulé ni une nouvelle attaque de combat. L’éclat d’impact observé à 10,6 s n’a pas de fichier séparé dans ce lot. Le Maser Handgun DS2, le Maser Gun Director’s Cut et l’arme MP DS2 sont trois sujets différents.

La [provenance de génération](static-generation.json) et la [recherche visuelle](reference-research.json) permettent de distinguer la référence, la sortie effectivement reçue et les usages encore absents.

## 4. Écart Die-Hardman identifié, correction non reçue

L’[article officiel Kojima consacré à Tommie Earl Jenkins](https://www.kojimaproductions.jp/en/interview-with-TommieEarlJenkins) associe un gros plan du jeu à un concept en pied. Il montre un col montant gris, une large cravate et des cordons ; le concept fournit un manteau long, un gilet et des bottes. La [référence officielle du masque](https://blog.de.playstation.com/2021/10/19/death-stranding-das-sind-die-charaktere/) montre une forme crânienne en carbone avec orbites, nez, dents, verrou de joue et marquage blanc. Les vieux sprites portent encore un masque plus robotique et un costume de bureau qui ne concordent pas avec ces éléments.

Une tentative de nouvelle posture complète a été refusée par le contrôle automatique de sortie de l’outil : `moderation_blocked`, catégorie `other`. Aucun motif plus détaillé n’a été fourni. **Aucun PNG de remplacement n’a été reçu.** La tentative n’a pas été relancée ; les dix-huit fichiers envisagés pour ce sous-lot ne sont ni des actifs livrés ni des chemins ajoutés au jeu. [diehardman-generation.json](diehardman-generation.json) conserve le prompt, les références et l’identifiant du refus.

Le geste central existant a déjà un masque plus proche de la référence, mais son costume reste à revoir. L’entrée et la sortie utilisent sa posture actuelle en repli. Les autres poses, le portrait, la finalité et les plans narratifs concernés restent suivis comme écarts ouverts. Un concept officiel en pied ne certifie pas à lui seul tous les détails du modèle final, notamment son revers.

## 5. Higgs DS2 en pied : référence complétée, sortie refusée

Le portrait officiel, une capture de jeu Kojima et une statue entière sous licence ont été comparés. La [page du fabricant Prime 1 Studio](https://statue.prime1studio.co.jp/ds2-higgs-remds2-02dxs.html) documente une silhouette complète ; elle reste une référence dérivée, distincte du modèle de jeu. La tentative de silhouette a reçu le même type de refus automatique, sans image. Elle n’a pas été relancée et aucune carte de personnage n’en résulte. Les détails sont conservés dans [static-generation.json](static-generation.json).

La mitrailleuse MP DS2 et le Strider Half-Life, refusés dans des lots antérieurs, n’ont pas fait l’objet de nouvelles tentatives. Les autres sujets DS2 conservent leurs références et leurs inconnues dans le [suivi des manques](MANQUANTS_DS2.md).

## 6. Portée de la revue

Les contrôles d’image portent sur la réception réelle, les octets natifs, la transparence, le cadrage, les points d’appui et le rendu dans le moteur. Les références sont qualifiées comme capture du jeu, promotion, concept ou produit sous licence. La fidélité 1:1 reste l’objectif de comparaison ; aucune certification globale de tout le roster ou de toutes les illustrations n’est déduite de ces seules vérifications.

Les captures Canvas vérifient les images et le HUD du moteur. Elles ne remplacent pas une inspection de la mise en page HTML dans un navigateur ni un essai de manette physique. Les gestes et l’exercice du dojo restent des créations du simulateur cohérentes avec ses versions de personnages ; ils ne créent aucun événement officiel supplémentaire.

# Revue des images et du rendu — complément du 27 novembre

[Bilan](BILAN.md) · [Sources et limites](ASSETS.md) · [Audit des apparences](AUDIT_SOURCES.md) · [Recette de présentation](FIDELITY_PRESENTATION.md).

## 1. Trois niveaux de contrôle

La réception distingue l’inspection du PNG natif, son emploi par le moteur et sa conformité à une référence officielle. Les dix-huit nouvelles poses et l’effet Maser sont reçus et inspectés. Leurs copies conservent exactement les octets des sorties natives. Les mesures d’alpha et de pied alimentent les métadonnées de rendu ; elles ne réécrivent pas les images.

La recette produit **58 captures de présentation à 1 280 × 720** dans le vrai Canvas de `StrandFight`, après décodage des images du projet. Elle vérifie neuf choix personnage/tenue, trois phases et deux orientations, puis quatre cas de repli ou de mouvement réduit. Les 58 résultats comprennent **51 dessins de phase et sept replis explicitement attendus**. Les 25 poses de geste actuellement sélectionnables et les 138 chemins nécessaires à cette recette sont décodés.

Le dojo reçoit en parallèle **cinq captures pour trois exercices** : garde haute, punition et geste, ce dernier étant observé à distance, pendant le geste adverse puis après l’impact. Les états du moteur et les empreintes de chaque capture sont enregistrés dans [lessons-native-verification.json](lessons-native-verification.json). Les fichiers de capture sont des WebP de recette, séparés des PNG natifs de production.

Ces contrôles montrent le rendu du moteur. Ils ne certifient ni tous les détails canoniques des dessins hérités, ni la mise en page complète de l’application dans un navigateur.

## 2. Résultats de l’inspection

| Sujet ou situation | Observation | Référence consultable |
| --- | --- | --- |
| Sam | Les poses conservent les sangles, la capsule et l’équipement dorsal. La préparation du pouce et le retour vers la sangle sont distincts. Les deux orientations sont cadrées en combat. | [Entrée vers la gauche](presentation-renders/sam-entry-left.webp) |
| Fragile | Le parapluie reste fermé et tenu par le même bras ; la main libre prépare l’invitation puis redescend. Le costume reste celui de la version DS1 du projet. | [Sortie vers la droite](presentation-renders/fragile-exit-right.webp) |
| Higgs DS1 | Le masque doré, la cape et la combinaison restent ceux du kit DS1. La séquence d’ouverture et de fermeture des bras ne reçoit pas la guitare ou l’armure DS2. | [Tenue du geste](presentation-renders/higgs-hold-right.webp) |
| Cliff | Le salut à deux doigts possède une préparation près du torse et une sortie vers l’équipement. La pose centrale existante demeure utilisée. | [Entrée vers la droite](presentation-renders/cliff-entry-right.webp) |
| MULE | Le scanner reste dans la même main entre les phases retenues. La première proposition de sortie qui le changeait de main a été écartée. La cargaison et le scanner restent lisibles à taille de combat. | [Sortie corrigée](presentation-renders/mule-exit-right.webp) |
| Mama Atelier | La main prépare le réglage des lunettes puis revient vers la sangle. La tenue Atelier garde ses propres sources. | [Entrée Atelier](presentation-renders/mama-entry-right.webp) |
| Mama Viaduc | Les trois images gardent le casque, la tablette, la bobine, les bracelets et les protections de cette tenue du simulateur. Les bords transparents se composent sur le décor sans rectangle de fond visible. | [Tenue Viaduc](presentation-renders/mama-viaduc-hold-right.webp) |
| Mama Viaduc, image indisponible | Le geste central volontairement non décodé revient à la posture Viaduc. Le casque et la tablette restent visibles ; aucune pose Atelier n’est empruntée. | [Repli contrôlé](presentation-renders/mama-viaduc-unavailable-hold-right.webp) |
| Heartman | Le nouveau hold consulte l’écran du même bras proche que la posture active. L’entrée et la sortie gardent cet équipement. Le retournement vers la gauche conserve la cohérence interne du cycle. | [Tenue vers la gauche](presentation-renders/heartman-hold-left.webp) |
| Die-Hardman | Les phases d’entrée et de sortie montrent la posture existante, conformément au repli annoncé. Le masque et le costume de ce kit restent des écarts ouverts ; aucun nouveau fichier corrigé n’est simulé. | [Entrée en repli](presentation-renders/diehardman-entry-right.webp) |
| Dojo, partenaire en geste | Le geste de Higgs apparaît avant l’interruption. Le HUD est lisible et les deux silhouettes reposent sur le plan de combat du stand de tir. | [Geste adverse](dojo-renders/taunt-opponent.webp) |
| Dojo, impact | Le coup léger interrompt le geste adverse ; l’état enregistré porte la perte de vie et l’étourdissement. La validation découle de cet état, pas de la capture seule. | [Après l’interruption](dojo-renders/taunt-interrupted.webp) |

Les images natives ont été inspectées individuellement lors de leur réception. Les captures de la table permettent de revoir les points particuliers de la composition, des mains, des costumes et du repli. Les autres captures et leurs états sont indexés dans [presentation-native.json](presentation-native.json).

## 3. Cadrage, transparence et limites de continuité

Les mesures sont conservées dans [geometry-measurements.json](geometry-measurements.json). Le moteur place séparément le point d’appui et la hauteur du dessin. Les membres et les équipements importants restent visibles dans les captures retenues ; la transparence des zones extérieures permet au décor de rester lisible.

Le fichier natif d’entrée de Sam atteint le bord supérieur au sommet de l’Odradek. Cette marge nulle est consignée dans sa provenance ; aucun padding ni pixel n’a été ajouté après génération. Les variations de plis, de lumière et de petits contours entre poses restent une limite des dessins reçus. Trois poses clés ne donnent pas une interpolation anatomique complète. Une vérification de toutes les anciennes animations demeure distincte de ce complément.

Certaines sources contiennent des couleurs sous des pixels d’alpha nul. Elles sont invisibles dans la composition du moteur et ne sont pas nettoyées par retouche. La comparaison porte sur l’alpha effectif et le rendu décodé. Les originaux restent inchangés.

Les orientations gauche et droite utilisent le miroir horizontal du moteur. Les asymétries de sangles, d’équipement et d’inscriptions ne sont donc pas certifiées par deux vues canoniques indépendantes. Une future correction de ces asymétries devra disposer de références latérales et de dessins propres.

## 4. Décharge Maser et séparation des versions

Le PNG fixe de décharge a été comparé au cadre officiel à 10,0 s : filaments clairs à franges bleues et éclat d’origine. Il ne contient ni arme ni personnage. Sa transparence et son empreinte sont consignées dans [ASSETS.md](ASSETS.md#maser). La charge à 8,2 s et l’impact à 10,6 s restent des observations séparées ; aucune animation complète n’est déduite de l’effet fixe.

Le hold Heartman est une correction de continuité avec le modèle actif. Mama Viaduc est une création de tenue du simulateur. Le concept officiel de Die-Hardman et la statue Higgs DS2 sous licence gardent leur nature de référence. Le [registre des versions](../../UNIVERS_DS.md#fidelity-20261127) conserve ces distinctions afin qu’une bonne intégration visuelle ne soit pas confondue avec une certification canonique globale.

## 5. Méthode et limites de la recette

Les captures de présentation utilisent une nouvelle surface et un nouveau contexte Canvas par image. Cette correction de l’adaptateur de recette évite un artefact de glyphes observé lors des redimensionnements successifs d’une même surface ; elle ne modifie pas le moteur. Des polices sont disponibles pour le texte natif. Les captures finales montrent les noms, jauges et annonces sans le défaut constaté dans l’essai intermédiaire.

Le Canvas natif, les parcours DOM simulés, le service HTTP réel et les essais matériels répondent à des questions différentes. Aucun essai de navigateur graphique ou de manette physique n’a été effectué pour ce lot. Les PNG de production restent distincts de la reconstruction des frames de recette ; aucun rendu de test ne remplace un asset manquant ou refusé.

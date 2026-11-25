# Revue visuelle — lot domaines du 25 novembre 2026

Les **14 PNG sélectionnés** ont été décodés et comparés à leurs sorties natives : les copies intégrées sont identiques octet pour octet. Le lot contient 11 PNG avec transparence et 3 opaques, sans nouvelle image d’animation. Les 215 images natives des lots précédents conservent leur SHA-256. Les tailles, l’alpha et les empreintes figurent dans [native-assets-verification.json](native-assets-verification.json).

La [planche de contrôle](static-renders/contact.webp) montre les neuf entrées ajoutées au catalogue sur fond sombre et neutre. Il s’agit de réductions de revue, distinctes des PNG livrés. Les contours, marges et silhouettes sont lisibles sur les deux fonds ; aucun personnage parasite, quadrillage peint ou recadrage du sujet principal n’a été retenu. La luminosité du pont chiral et de la rampe appartient aux objets illustrés. Leur transparence reste réelle.

## Lecture par sujet

| Sujet | Lecture retenue | Limite de fidélité |
| --- | --- | --- |
| Maser Gun · Director’s Cut | Corps cylindrique noir, deux rails, viseur, accents rouges et jaunes ; distinct du Maser Handgun DS2 déjà livré. | Poignée et crosse en partie cachées dans la capture, inscriptions et proportions adaptées. |
| Catapulte de fret · DC | Lanceur incliné, vérin jaune, pied cylindrique et base ronde entière. | Retrait de Sam et reconstruction de parties du socle occultées ou coupées par le cadre. |
| Roadster · DC | Trois quarts arrière, véhicule gris ouvert, carénages, arceau et feux étroits. | Habitacle, roue opposée et petits marquages non certifiés. |
| Buddy Bot · DC | Deux jambes sous le fret jaune et noir ; silhouette stable sans porteur humain. | Petit sujet dans la source ; pieds et articulations partiellement cachés par la neige, détails reconstruits. |
| Rampe de saut · DC | Plateforme basse à lattes et arc jaune, séparée du véhicule et du paysage. | Référence éloignée ; détails mécaniques interprétés. |
| Pont chiral · DC | Passerelle bleue translucide en arc, sans falaise ni personnage. | Extrémités et angle adaptés ; aucune collision de pont ajoutée au moteur. |
| Stand de tir · DC | Béton modulaire, caillebotis, barrières et balises bleues ; aucun HUD ni ennemi. | Composition réorganisée. Ce panorama est au catalogue ; il n’est pas une arène jouable. |
| Wagon Yamato · DS2 | Conteneur blanc, chariot jaune, court rail et vue légèrement en contrebas. | Dessous, raccords et emblème interprétés ; cette livrée ne remplace pas la référence du module jaune. |
| Centre de distribution · hangar | Architecture et palette reprises du quai existant ; piste plane et dégagée. | Reconstitution du simulateur, sans assertion de cartographie canonique. |

Les [références qualifiées](reference-research.json) conservent les URL officielles, les œuvres/versions, les observations et les empreintes des images examinées. Les prompts complets et chaînes de dérivation sont conservés dans le [manifeste natif](../../../../art/sources/echos-de-la-greve/production-20261125-domains/manifest.json). Aucune certification globale de fidélité 1:1 n’est déduite de cette revue.

## Hangar et raccord jouable

Les cinq couches du hangar sont inspectées séparément et dans les captures du vrai moteur. Le [rapport de transition](TRANSITIONS.md) détaille les mesures d’alpha, les 8 cas de rendu du hangar et les 26 vues de liaison vérifiées. Le sol stable à 447/941 est ancré à y = 588. La capture [arrivée dans le hangar](linked-renders/terminal-linked-right-hangar.webp), examinée après les mesures, montre les pieds sur le sol, sans ciel au raccord ni premier plan masquant la piste. Les côtés et les restaurations sont couverts par les rapports dédiés.

Ces rendus emploient Canvas natif et les moteurs réels. Ils ne constituent pas une vérification de mise en page dans un navigateur.

## Essais non livrés et références encore partielles

La première tentative du Maser Gun a été refusée en sortie par le service de génération ; un second essai avec la même demande et les mêmes références a produit le PNG retenu. Les deux essais de mitrailleuse MP DS2 ont été refusés par ce service et n’ont produit aucun fichier : cet objet reste ouvert. Les essais sans image sont consignés dans le manifeste et ne sont pas comptés comme des assets.

Le support skeleton et le flacon de réparation restent insuffisamment visibles dans les captures consultées. Les Watchers, Armed Survivalists, Blood Boomerang, Tar Cannon et grenades holographiques conservent leur besoin d’identification visuelle. La nouvelle source Yamato permet un premier wagon DS2 complet, sans étendre sa validation aux autres livrées.

# Production — Les Lignes de Marée

**Contrat de production du 27 novembre 2026.** Le catalogue de conception et les fichiers d’art réels ont des statuts distincts. Les rapports de génération de la passe précisent les bases reçues et leurs contrôles ; ce document donne la cible, les dépendances et la définition de terminé.

## Réception de la passe

Les 10 postures, 20 panoramas, 20 bases ennemies et 20 bases boss sont reçus : **70 PNG natifs, 145 362 802 octets**. Les vingt panoramas mesurés deviennent des arènes statiques locales. Le [bilan](../../production/20261127-lignes-de-maree/BILAN.md) et l’[inventaire](../../production/20261127-lignes-de-maree/assets-manifest.json) établissent ces comptes. Cette première réception couvre les quatre catégories de bases. Le complément jouable ci-dessous ajoute les poses et objets du premier kit et de la première rencontre.

## Premier contenu original jouable

Balise est raccordée au duel local, au dojo libre et au Relais ; le Consignateur à Boss Battle, avec huit combattants compatibles et trois phases complètes. La réception ajoute **48 PNG natifs** : trente poses Balise, douze poses Consignateur et six props, dont cinq utilisés et une variante conservée. Les deux directions sont dessinées séparément. Ces poses clés ne remplacent pas les cycles complets, scènes, costumes, supers ou conclusions listés ci-dessous.

Le déblocage narratif de Balise reste prévu ; ce premier kit est ouvert directement dans les trois modes compatibles. Son entrée dans les exercices guidés, les routes de récit, le tournoi, les défis, le Boss et le réseau reste filtrée. [Réception et limites](../../production/20261127-first-playable/BILAN.md) · [Vérification](../../production/20261127-first-playable/VERIFICATION.md).

## Unités

| Lot | Cible | Critère |
| --- | --- | --- |
| Bases personnages | 10 | Un PNG natif entier par original, stance lisible et asymétries consignées. |
| Panoramas de stages | 20 | Une composition par lieu ; ne vaut pas cinq plans de parallaxe. |
| Bases ennemis | 20 | Une silhouette par comportement et ses outils attachés dans la pose neutre. |
| Bases boss | 20 | Une silhouette entière par rencontre ; pas toutes les parties mobiles ni phases. |
| Plans de stage | 100 | Cinq fichiers autonomes par lieu, sol et ancres mesurés. |
| Costumes conçus | 30 | Trois fiches par personnage ; chacun attend sa production graphique. |
| Scènes individuelles | 30 | Introduction, rival et épilogue de chaque original. |
| Conclusions individuelles | 10 | Illustration/séquence après résultat ; non létale sur humains. |
| Storyboards de duos | 5 | Contributions distinctes des deux partenaires et retour clair au jeu. |
| Projectiles/éléments mobiles | 12 | Un fichier séparé, owner stable et expiration définie. |
| Props / gadgets / véhicules | 20 / 10 / 4 | Objets autonomes, points de prise et états mécaniques. |
| Bonus | 6 | Règles, compteur, reprise, accessibilité et art de scène. |

## Dépendances avant un contenu jouable

1. Valider la silhouette et ses accessoires à partir de la fiche originale.
2. Produire les poses essentielles et mesurer proportions, contact au sol et collisions.
3. Implémenter les actions, leurs ressources, leurs contres et leurs fins d’état.
4. Raccorder commandes, sélection, sauvegarde et contrôle de disponibilité.
5. Vérifier les deux directions, les interruptions et les combinaisons avec le roster existant.
6. Pour un boss, vérifier les trois phases et les objectifs ; pour un stage, vérifier ses cinq plans et son profil neutre.
7. Documenter le contrôle visuel réel et les limites restantes.

## Statuts

| Champ | Valeur | Signification |
| --- | --- | --- |
| production.design | complete | Fiche de conception structurée, encore sujette à équilibrage. |
| production.art | pending | Aucune réception graphique validée dans cette entrée. |
| production.art | base_received / stance_received / panorama_received | Un visuel fixe reçu ; animations et couches restent séparées. |
| production.runtime | planned | Aucun kit ou rencontre jouable déclaré par le catalogue. |
| production.runtime | static_arena | Panorama reçu, sol mesuré, arène locale ; ni mission ni cinq plans de parallaxe. |
| production.runtime | local_kit / boss_encounter | Kit ou rencontre raccordé, avec un périmètre de modes explicite. |
| production.art | directional_keyposes_received | Poses clés natives dans les deux directions ; pas des cycles dessinés complets. |
| consultation UI | disponible selon passe | Affichage d’un dossier ; ne change pas runtime en playable. |

La présence d’un asset dans la galerie ne suffit pas à débloquer sa sélection en combat. Les statuts de la passe peuvent être enrichis après contrôle des fichiers réels. Le registre final doit conserver les anciennes images et ne pas les remplacer par ces créations originales.

## Contrôle du catalogue

`design-validation.json` vérifie les comptes, identifiants, références de sources, campagnes, stages, boss, projectiles, missions, duos et la connexité du corridor. Il protège contre un nom changé entre bible et génération. Les briefs `generation-briefs.json` conservent les 60 identités visuelles fixées avant génération ; `catalog.json` fournit les textes français et les contrats de jeu.

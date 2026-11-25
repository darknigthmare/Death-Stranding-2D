# Compendium des Boss — point de reprise du 25 novembre 2026

## État de cette sauvegarde

**Préparation sauvegardée ; recette moteur en attente.** Le runtime local est devenu indisponible après saturation du disque. Cette branche de reprise conserve les sources préparées ; elle ne prétend pas avoir exécuté la nouvelle recette. Les fichiers générés `boss-data.js`, `data/boss-et-rencontres.json` et `BOSS_ET_RENCONTRES.md` seront produits puis contrôlés dans un environnement disponible avant livraison.

## Périmètre

Le catalogue est prévu pour six rencontres, huit motifs ennemis et 30 actions propres à StrandBoss : six commandes communes et 24 signatures. Il distingue les PV par difficulté et par vague, les annonces, les fenêtres de récupération, les volumes et projectiles, les ressources, les défenses, les repères, les objectifs des camions et les conditions de succès ou d’échec. Les valeurs du duel ne sont pas importées.

Le générateur `outils/generer_catalogue_boss.cjs` et son helper `outils/lib/boss-engine.cjs` lisent les constantes et fonctions réelles dans une copie du moteur en mémoire. Aucun hook n’est ajouté au jeu. Les descriptions conditionnelles sont rédigées explicitement ; leur correspondance au moteur doit encore être contrôlée par la recette.

## Interface préparée

`StrandBossGuide.render({ boss, context, p1, difficulty })` renvoie un bloc `<details class="bossGuide">` avec sections natives repliables pour les six rencontres et les huit kits. Aucun écouteur, stockage ou démarrage de combat n’appartient à ce module. Contextes : `boss`, `bossrush`, `campaign`. Charger `boss-data.js`, puis `boss-guide.js` et `boss-guide.css`.

Les hooks d’app/index appartiennent à un autre lot. La sélection de Boss, la sélection de série et le briefing d’un chapitre Boss sont les trois surfaces convenues.

## Différences décrites

Le joueur commence une rencontre neuve à 120 PV, énergie 100 et garde 100. La garde ordinaire laisse passer deux PV ; les boucliers de contre ont leurs propres coûts et protections. La commande de finalité du duel devient une charge offensive coûtant 70 points dans ce moteur. Le scan applique son exposition avant sa propre mêlée.

Le Camion libère deux colis après sa destruction. Le Convoi apporte un second camion après 180 pas, indépendamment de la première livraison ; les tirs bas et charges profondes menacent son dépôt. La vitalité et les ressources ne sont pas réinitialisées entre ces vagues.

Boss Rush conserve les PV exacts, ajoute 20 après chaque victoire dans la limite de 120, et remet énergie/garde à 100 au Boss suivant. Une défaite termine la série. La campagne utilise `isolated:true` et reprend au début du chapitre avec ses ressources de départ, sans lire ni écrire les deux sauvegardes Boss.

Deux messages du moteur encore liés à `T` sont destinés à indiquer « commande Colis » pour respecter le remappage. La recette exige que ces deux substitutions soient les seules différences de `boss.js` par rapport à main `8d274a015e0edf314a853630031d5eb507354811`.

## Reprise et validation à exécuter

```sh
node outils/generer_catalogue_boss.cjs
node modes/echos-de-la-greve/qa/boss-compendium.cjs docs/combat/production/20261125-extension/boss-compendium-verification.json
```

La recette préparée contrôle la reproduction des fichiers, les profils de PV et d’annonce, les motifs, l’exécution unique des actions, la disponibilité des 48 couples kit/rencontre, les conditions de défense et de repère, les dégâts de blindage/exposition, les contacts, les colis, l’ordre du dernier pas, les sauvegardes séparées et le rendu HTML sans mutation.

Les états unitaires, Canvas, images et stockage de l’hôte sont simulés. Les transitions de série utilisent des résultats préparés ; elles ne doivent pas être décrites comme six victoires jouées. Aucun rendu de pixels, navigateur, manette physique ni calibrage d’équilibre n’est revendiqué.

## Fichiers préparés dans cette branche

- `outils/generer_catalogue_boss.cjs`
- `outils/lib/boss-engine.cjs`
- `modes/echos-de-la-greve/boss-guide.js`
- `modes/echos-de-la-greve/boss-guide.css`
- `modes/echos-de-la-greve/qa/boss-compendium.cjs`
- `modes/echos-de-la-greve/boss.js` : uniquement les deux textes de commande Colis.
- Ce rapport de reprise.

Les fichiers générés et la preuve ne sont pas présents à ce stade. Ils doivent être créés depuis les sources effectivement livrées et validés avant l’intégration finale.

# Woordentrainer

Entraîneur de vocabulaire néerlandais / français pour deux personnes, installable sur Android.

## Ce qui est dedans

Dix listes de 100 entrées : 80 mots et 20 verbes à l'infinitif, aucun doublon d'une liste à l'autre, et quatre phrases d'exemple par entrée. En début de semaine, chacun compose dans la liste son propre deck — autant de mots qu'il veut, au moins 4 — et ce sont les seuls que l'app posera : tirage et leurres du QCM et des phrases à trous ne sortent jamais du deck. Un score d'apprentissage de 0 à 100 par mot. Une barre de crans, un par mot du deck, qui sert à la fois de progression et de carte du deck. Un partage de progression entre les deux téléphones via Supabase, entièrement facultatif.

Le lot de 100 est commun aux deux ; les decks ne le sont pas. Chacun garde son deck sur son propre téléphone, et rien n'oblige à choisir les mêmes mots.

## Composer son deck

À l'ouverture d'une liste sans deck, l'accueil ne propose plus les quatre modes mais un bouton « Composer mon deck ». On touche les mots à retenir, les verbes sont groupés à part, et le bouton du bas se débloque dès 4 mots choisis (en dessous, le QCM n'a plus trois leurres à proposer). Ensuite, « Modifier mon deck » est accessible depuis la liste des mots — retirer un mot le sort des questions mais garde sa progression.

## Mettre à jour le site

Modifier un fichier sur GitHub, attendre la reconstruction de Pages. Pour tout changement de code, **incrémenter la ligne `VERSION` en haut de `sw.js`** ET le `WT_BUILD` correspondant dans `index.html`, sinon les téléphones gardent l'ancienne version en cache. Les fichiers de `data/` sont rechargés depuis le réseau à chaque ouverture, aucune manipulation nécessaire.

La progression est stockée sur chaque téléphone et n'est jamais écrasée par une mise à jour.

## Activer le partage entre les deux téléphones

1. Créer un compte sur supabase.com, puis un projet (région Frankfurt).
2. Onglet `SQL Editor`, coller le contenu de `outils/supabase.sql`, `Run`.
3. Onglet `Settings` → `API`, copier `Project URL` et la clé `anon public`.
4. Les coller dans `config.js`, à la place des deux chaînes vides, et renvoyer le fichier sur GitHub.
5. Dans l'app, réglages → identité : choisir Ulysse ou Jasmien sur chaque téléphone.

Tant que `config.js` reste vide, l'app fonctionne normalement, simplement sans les deux barres comparées.

Les deux barres comparent les points, pas les mots acquis, sur une échelle commune : le plus gros des deux decks. Pour que l'app connaisse la taille du deck de l'autre, la table `duo` a besoin de la colonne `taille` : relancer `outils/supabase.sql` (ou seulement sa ligne `alter table duo add column if not exists taille ...`). Sans elle, tout fonctionne, l'échelle se rabat sur ton propre deck.

Le projet Supabase gratuit se met en pause après sept jours sans aucune activité. Un clic dans le tableau de bord le relance.

## Ajouter une liste

Ouvrir `outils/xlsx-vers-json.html` sur l'ordinateur, déposer un xlsx ou coller des lignes `het huis = la maison`, télécharger le JSON, le déposer dans `data/` et l'ajouter à `data/index.json` :

```json
{ "semaines": [
  { "id": "semaine-01", "fichier": "data/semaine-01.json", "titre": "Liste 1", "theme": "La maison et le quotidien" },
  { "id": "semaine-11", "fichier": "data/semaine-11.json", "titre": "Liste 11", "theme": "Le vocabulaire du chantier" }
] }
```

Les phrases d'exemple vont dans les colonnes D à K du xlsx, par paires néerlandais puis français : D-E, F-G, H-I, J-K. Le mot de la liste est mis entre accolades dans chaque phrase, sous la forme qu'il prend dans la phrase : `Hij {zei} niets.` / `Il n'a rien {dit}.` Dans le JSON, cela donne `"ph": [{"nl": "...", "fr": "..."}]`. Une entrée sans phrases fonctionne, elle est simplement servie en QCM à la place.

Un verbe se marque avec un `v` en troisième colonne du xlsx (ou `ww`, `verbe`, `werkwoord`), ou par un `| v` en fin de ligne collée : `lopen = marcher | v`. Dans le JSON, cela donne `"v": 1`. Sans cette marque, l'écran de composition range tout sous « mots ». Viser 80 mots et 20 verbes par liste.

L'identifiant doit rester stable : c'est la clé sous laquelle la progression et le deck sont enregistrés.

## Le score d'apprentissage

Chaque mot va de 0 à 100 et devient acquis à 100.

| Exercice | Réussite | Erreur |
|---|---|---|
| Carte | +14 | −14 |
| QCM | +21 | −21 |
| Phrase à trous | +21 | −21 |

Le score ne descend jamais sous 0. L'objectif du jour vaut le tiers des points du deck, pour le boucler en trois séances par semaine. Ce n'est pas un plafond : une fois atteint, il est fêté et les points continuent de compter.

## Les phrases

Trois exercices : cartes, QCM de vocabulaire, phrases à trous (le vrai ou faux a été retiré le 05/10/2026). Le mode « Phrases à trous » affiche une phrase, dans la langue de la réponse, où il manque un mot. On touche le trou, quatre propositions apparaissent, toutes sous une forme qui peut tenir dans une phrase (« zei », « de tafels »). Les leurres sont pris de même nature (verbe pour un verbe) quand le deck le permet. Une fois la réponse donnée, juste ou fausse, le trou se remplit, la traduction de la phrase entière s'affiche, et on passe à la suite avec « Question suivante ». Le dos des cartes montre aussi une phrase d'exemple, dans les deux langues.

En mode « Au hasard », l'app choisit l'exercice selon le score du mot — la carte domine tant qu'il est neuf, le QCM et la phrase à trous à mesure qu'il monte — mais les trois styles gardent une part à tous les niveaux, et jamais plus de trois questions d'affilée ne partagent le même style. Elle sert toujours en priorité les mots au score le plus bas, et à score égal ceux vus il y a le plus longtemps.

## La série

Aucun chronomètre, à aucun palier : il a été retiré le 05/10/2026.

La série de bonnes réponses est gardée avec l'état de l'app : fermer l'app, changer de liste ou de semaine ne la casse pas. Seule une mauvaise réponse la remet à zéro. Le feu ne s'affiche qu'en cours d'entraînement, mais il repart au palier où il s'était arrêté.

## Taille du deck

Libre, au choix de chacun. Seul le plancher tient dans la constante `DECK_MIN` en haut du script de `index.html`. La barre de crans, l'objectif du jour et les barres comparées suivent la taille réelle du deck.

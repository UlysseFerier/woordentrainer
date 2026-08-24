# Woordentrainer

Entraîneur de vocabulaire néerlandais / français pour deux personnes, installable sur Android.

## Ce qui est dedans

Dix listes de 40 mots, aucun doublon d'une liste à l'autre. Un score d'apprentissage de 0 à 10 par mot. Une barre de 40 crans qui sert à la fois de progression et de carte de la liste. Un partage de progression entre les deux téléphones via Supabase, entièrement facultatif.

## Mettre à jour le site

Modifier un fichier sur GitHub, attendre la reconstruction de Pages. Pour tout changement de code, **incrémenter la ligne `VERSION` en haut de `sw.js`**, sinon les téléphones gardent l'ancienne version en cache. Les fichiers de `data/` sont rechargés depuis le réseau à chaque ouverture, aucune manipulation nécessaire.

La progression est stockée sur chaque téléphone et n'est jamais écrasée par une mise à jour.

## Activer le partage entre les deux téléphones

1. Créer un compte sur supabase.com, puis un projet (région Frankfurt).
2. Onglet `SQL Editor`, coller le contenu de `outils/supabase.sql`, `Run`.
3. Onglet `Settings` → `API`, copier `Project URL` et la clé `anon public`.
4. Les coller dans `config.js`, à la place des deux chaînes vides, et renvoyer le fichier sur GitHub.
5. Dans l'app, réglages → identité : choisir Ulysse ou Jasmien sur chaque téléphone.

Tant que `config.js` reste vide, l'app fonctionne normalement, simplement sans les deux barres comparées.

Le projet Supabase gratuit se met en pause après sept jours sans aucune activité. Un clic dans le tableau de bord le relance.

## Ajouter une liste

Ouvrir `outils/xlsx-vers-json.html` sur l'ordinateur, déposer un xlsx ou coller des lignes `het huis = la maison`, télécharger le JSON, le déposer dans `data/` et l'ajouter à `data/index.json` :

```json
{ "semaines": [
  { "id": "semaine-01", "fichier": "data/semaine-01.json", "titre": "Liste 1", "theme": "La maison et le quotidien" },
  { "id": "semaine-11", "fichier": "data/semaine-11.json", "titre": "Liste 11", "theme": "Le vocabulaire du chantier" }
] }
```

L'identifiant doit rester stable : c'est la clé sous laquelle la progression est enregistrée.

## Le score d'apprentissage

Chaque mot va de 0 à 10 et devient acquis à 10.

| Exercice | Réussite | Erreur |
|---|---|---|
| Vrai ou faux | +1 | −1 |
| Carte | +2 | −2 |
| QCM | +3 | −3 |

Le score ne descend jamais sous 0. Un mot ne peut gagner que 5 points par jour, réglable dans l'app : une liste demande donc au minimum deux jours. En pratique, à 85 % de bonnes réponses, il faut environ 270 questions pour terminer une liste de 40 mots, soit deux séries de 25 par jour pendant une semaine.

En mode mélange, l'app choisit l'exercice selon le score du mot : carte tant qu'il est neuf, QCM à mesure qu'il monte. Elle sert toujours en priorité les mots au score le plus bas.

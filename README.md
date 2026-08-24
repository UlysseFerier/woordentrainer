# Woordentrainer

Entraîneur de vocabulaire néerlandais / français, installable sur Android comme une app.

## Mise en ligne (une seule fois)

1. Sur GitHub, `Create repository`. Nom : `woordentrainer`. Visibilité **public** (obligatoire pour que Pages soit gratuit). Ne coche rien d'autre.
2. Sur la page du dépôt vide : `uploading an existing file`. Glisse **tout le contenu de ce dossier** (`index.html`, `manifest.webmanifest`, `sw.js`, les dossiers `icons/`, `data/`, `outils/`). Attention : glisse les fichiers et dossiers eux-mêmes, pas le dossier `woordentrainer` qui les contient, sinon l'app se retrouvera un cran trop bas dans l'arborescence.
3. `Commit changes`.
4. `Settings` → `Pages` → Source : `Deploy from a branch`, branche `main`, dossier `/ (root)` → `Save`.
5. Attends une minute, recharge la page `Pages` : l'URL apparaît, du type `https://TONPSEUDO.github.io/woordentrainer/`.

## Installation sur le téléphone

Ouvrir l'URL dans **Chrome** (pas dans le navigateur intégré de Messenger). Un bandeau « Installer » apparaît dans l'app ; sinon, menu ⋮ → `Installer l'application` ou `Ajouter à l'écran d'accueil`. L'icône arrive dans le tiroir d'apps. Ensuite, tout fonctionne hors ligne.

## Mettre à jour

Modifier un fichier sur GitHub (ou en réuploader un), attendre la reconstruction de Pages, et au lancement suivant l'app affiche « Une nouvelle version est prête ».

Pour le code (`index.html`, `sw.js`, CSS), il faut **aussi changer la ligne `VERSION` en haut de `sw.js`** — sinon les téléphones gardent l'ancienne version en cache. Pour les listes de vocabulaire dans `data/`, rien à faire : elles sont rechargées depuis le réseau à chaque ouverture.

La progression est stockée sur chaque téléphone et n'est jamais écrasée par une mise à jour.

## Ajouter une liste

1. Ouvre `outils/xlsx-vers-json.html` sur l'ordinateur, dépose un xlsx ou colle des lignes `het huis = la maison`, télécharge le JSON.
2. Dépose ce fichier dans `data/` sur GitHub.
3. Ajoute-le à `data/index.json` :

```json
{ "semaines": [
  { "id": "semaine-01", "fichier": "data/semaine-01.json" },
  { "id": "semaine-02", "fichier": "data/semaine-02.json" }
] }
```

L'identifiant doit rester stable : c'est la clé sous laquelle la progression est enregistrée.

## Le score d'apprentissage

Chaque mot a un score de 0 à 10, et devient « acquis » à 10.

| Exercice | Réussite | Erreur |
|---|---|---|
| Vrai ou faux | +1 | −1 |
| Carte | +2 | −2 |
| QCM | +3 | −3 |

Le score ne descend jamais sous 0. Un mot ne peut gagner que 5 points par jour (réglable dans l'app) : une liste de 40 mots demande donc au minimum deux jours, et en pratique quatre ou cinq sessions courtes.

En mode `Mélange`, l'app choisit l'exercice selon le score du mot : carte tant qu'il est neuf, puis QCM à mesure qu'il monte. Elle sert en priorité les mots au score le plus bas.

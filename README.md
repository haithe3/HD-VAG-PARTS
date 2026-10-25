# HD VAG PARTS

Site mobile-first bilingue (français / العربية RTL) pour HD VAG PARTS, spécialiste des pièces VAG en Algérie. Les commandes sont préparées sur WhatsApp ; il n'y a pas de paiement en ligne.

## Démarrage local

Prérequis : Node.js 20+ et pnpm 10.

```bash
pnpm install --frozen-lockfile
pnpm dev:static
```

Ouvrez ensuite `http://localhost:3000`.

Commandes utiles :

```bash
pnpm check          # vérification TypeScript
pnpm build:static   # build Vite dans dist/public
pnpm test           # tests Vitest disponibles
```

Le site est un frontend statique. Pour une publication Netlify ou Vercel, utilisez `pnpm build:static` comme commande de build et `dist/public` comme dossier de sortie.

## Mettre à jour les produits

Les cartes de démonstration se trouvent dans `client/src/data/products.json`. Remplacez les valeurs `PLACEHOLDER` par vos données réelles, sans modifier la structure JSON :

- `name` : nom de la pièce ;
- `reference` : référence constructeur ou fournisseur ;
- `category` : `filters`, `brakes`, `engine`, `suspension`, `electrical`, `fluids` ou `body` ;
- `quality` : uniquement `Original`, `OEM` ou `Aftermarket` ;
- `compatible` : modèles compatibles à afficher ;
- `price` : prix ou `Prix sur demande` ;
- `description` : note interne/description courte.

Après modification, lancez `pnpm check` puis `pnpm build:static`.

## Mettre à jour la compatibilité VIN / référence

L'outil « Vérifier la compatibilité » lit `client/src/data/compatibility.json`. Il contient dix lignes `PLACEHOLDER-001` à `PLACEHOLDER-010` volontairement vides de données réelles. Remplacez-les par vos références vérifiées.

Chaque ligne possède ces colonnes :

```json
{
  "reference": "1K0698151",
  "partName": "Nom de la pièce",
  "brand": "Volkswagen",
  "compatibleModels": "Golf 6",
  "years": "2009-2013",
  "engineCodes": "CAYC",
  "price": "Prix sur demande",
  "quality": "OEM",
  "inStock": false,
  "placeholder": false
}
```

La recherche ignore les espaces et les tirets dans la référence. Les lignes avec `placeholder: true` sont ignorées pour éviter d'afficher une compatibilité inventée. Le VIN est normalisé en majuscules, les espaces sont ignorés et les lettres `I`, `O` et `Q` sont refusées. Le WMI affiche seulement une marque indicative ; le site ne prétend pas décoder le modèle ou le moteur à partir du VIN seul.

## WhatsApp

Le numéro configuré dans `client/src/App.tsx` est `0540 39 93 26` au format WhatsApp `213540399326`. Modifiez les deux constantes `WHATSAPP_NUMBER` et `DISPLAY_PHONE` si nécessaire.

## Identité visuelle

Le logo fourni par le client est utilisé dans `client/public/brand/hd-vag-parts-user-logo-transparent-cropped.png`. Les autres fichiers éditables sont dans `brand/` et `client/public/brand/`.

## Sécurité et secrets

Aucune clé API, aucun token et aucun fichier `.env` ne sont nécessaires pour le frontend statique. Les fichiers `.env*`, logs, caches, dépendances et builds sont exclus par `.gitignore`. Ne commitez jamais de secret : utilisez les variables d'environnement de la plateforme de déploiement si un futur backend en a besoin.

## Licence

Projet privé HD VAG PARTS. Le dépôt GitHub associé est privé.

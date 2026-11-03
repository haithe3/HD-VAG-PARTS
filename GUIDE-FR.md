# Guide rapide — HD VAG PARTS

## Démarrer la plateforme full-stack

La version actuelle utilise Express, tRPC, Drizzle/MySQL, Manus OAuth et Manus Managed Storage.

```bash
pnpm install --frozen-lockfile
pnpm db:push
pnpm tsx scripts/seed-database.ts
pnpm dev
```

Utilisez `pnpm check` pour TypeScript et `pnpm build` pour construire le frontend et le serveur. `pnpm build:static` reste disponible pour une publication frontend statique sans les fonctions d'administration.

## Connexion et administration

La connexion se fait avec Manus OAuth : aucun mot de passe n'est stocké dans le code. Le lien **Connexion** ouvre `/login`. Un client est redirigé vers `/compte`, tandis que le propriétaire reconnu par `OWNER_OPEN_ID` est redirigé vers `/admin`. Les procédures serveur vérifient le rôle `admin` avant chaque écriture.

Depuis `/admin`, l'administrateur peut créer, modifier ou supprimer une pièce, rechercher dans le catalogue, modifier les informations de prix et de compatibilité et uploader des images JPG, PNG ou WEBP de 8 Mo maximum. Les images sont conservées dans Manus Managed Storage et la dernière image importée devient l'image principale.

Le script `scripts/seed-database.ts` importe une seule fois les produits, la compatibilité, les 58 wilayas et les packs dans les tables Drizzle. Les fichiers JSON restent une sauvegarde et un fallback si la base n'est pas disponible. Utilisez le tableau de bord pour les opérations quotidiennes plutôt que de modifier le code.

## Modifier les produits, les prix et les photos

Les produits sont dans `client/src/data/products.json`. Copiez un bloc pour ajouter une pièce et renseignez `name`, `reference`, `category`, `quality`, `compatible`, `price` et `image`.

Valeurs de `category` : `filters`, `brakes`, `engine`, `suspension`, `electrical`, `fluids` ou `body`. Valeurs de `quality` : `Original`, `OEM` ou `Aftermarket`. Le site n'utilise pas la formule « 100% original ».

Pour ajouter une photo :

1. Téléversez le fichier dans `client/public/products/`.
2. Mettez son chemin public dans le JSON, par exemple `"image": "/products/filtre-huile.webp"`.
3. Lancez `pnpm check`, puis `pnpm build:static`.

Une valeur `image` qui ne commence pas par `/` garde le visuel placeholder. Les produits placeholder restent clairement signalés afin que vous puissiez les remplacer progressivement.

## Modifier la compatibilité VIN / référence

Le fichier est `client/src/data/compatibility.json`. Remplacez les dix lignes `PLACEHOLDER-001` à `PLACEHOLDER-010` avec vos données vérifiées. Gardez les champs `reference`, `partName`, `brand`, `compatibleModels`, `years`, `engineCodes`, `price`, `quality`, `inStock` et `placeholder`.

Le WMI est indicatif. Le site ne décode pas le modèle ou le moteur à partir du VIN seul. Si la marque du VIN ne correspond pas à la marque renseignée sur la référence trouvée, l'utilisateur voit une alerte et conserve le bouton WhatsApp pour une vérification manuelle.

## Remplir la livraison par wilaya

Le fichier `client/src/data/delivery.json` contient les 58 wilayas avec les champs `wilaya`, `price` et `delay`. Les valeurs initiales sont `À confirmer / نؤكد معك`. Remplacez chaque ligne seulement lorsque le prix et le délai ont été validés. La page **Livraison & retours** propose une recherche par wilaya.

## Modifier les Packs entretien

Les trois packs sont dans `client/src/data/packs.json`. Remplacez les noms, véhicules, listes `contents`, prix et qualités. Les lignes actuelles sont des placeholders visibles par les clients et ne contiennent aucun prix inventé. Les boutons préparent un message WhatsApp avec le nom du pack.

## Modifier le numéro WhatsApp et les réseaux

Tous les réglages sont dans `client/src/config.ts` :

- `WHATSAPP_NUMBER` : chiffres au format international sans `+` pour `wa.me` ;
- `DISPLAY_PHONE` : format lisible affiché sur le site ;
- `INSTAGRAM_URL`, `FACEBOOK_URL`, `TIKTOK_URL` : laissez vides pour masquer les icônes du footer ;
- `SITE_URL` : domaine public sans slash final ;
- `META_PIXEL_ID` et `GA_MEASUREMENT_ID` : vides par défaut.

Les scripts analytics ne sont chargés que lorsque leur identifiant est rempli. Les clics WhatsApp sont alors envoyés comme `Contact` / `whatsapp_click`.

## SEO et domaine

Après avoir configuré `SITE_URL`, lancez :

```bash
pnpm seo:urls
pnpm check
pnpm build:static
```

Le script régénère `client/public/sitemap.xml`, `client/public/robots.txt`, le canonical et les URLs d'image Open Graph/Twitter. Si `SITE_URL` est vide, les URLs restent relatives.

## Déployer sur Netlify ou Vercel

- Commande d'installation : `pnpm install --frozen-lockfile` ;
- Commande de build : `pnpm build:static` ;
- Dossier de sortie : `dist/public`.

Netlify utilise `client/public/_redirects` pour renvoyer les routes vers `index.html`. Vercel utilise `vercel.json` avec la même règle de rewrite. Pour un domaine personnalisé, ajoutez le domaine dans **Domain management** sur Netlify ou **Project → Settings → Domains** sur Vercel, puis renseignez le domaine final dans `SITE_URL` et relancez `pnpm seo:urls`.

## Fichiers de marque

Le logo fourni par le client est `client/public/brand/hd-vag-parts-user-logo-transparent-cropped.png`. Les fichiers éditables sont dans `brand/` et leurs copies servies dans `client/public/brand/`.

## Sécurité

Ne jamais committer de secrets, tokens ou clés API. Les fichiers `.env*`, logs, caches, dépendances et builds sont exclus par `.gitignore`.

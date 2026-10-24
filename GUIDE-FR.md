# Guide rapide — HD VAG PARTS

## Modifier les produits et les prix

Les produits de démonstration sont dans `client/src/data/products.json`. Ouvrez ce fichier et copiez un bloc existant pour ajouter une nouvelle pièce. Les champs importants sont `name`, `reference`, `category`, `quality`, `compatible`, `price` et `image`.

Pour `category`, utilisez une de ces valeurs : `filters`, `brakes`, `engine`, `suspension`, `electrical`, `fluids` ou `body`. Pour `quality`, utilisez uniquement `Original`, `OEM` ou `Aftermarket`. Le site n’utilise pas la formule « 100% original ».

Les images actuelles affichent volontairement un placeholder. Pour utiliser une vraie image, ajoutez-la dans `client/public/products/`, puis remplacez la valeur du champ `image` et adaptez le composant `ProductVisual` dans `client/src/App.tsx` pour afficher votre fichier. Vous pouvez aussi conserver le placeholder pendant la préparation du catalogue.

Après une modification, lancez `pnpm dev:static` pour vérifier le rendu local, puis `pnpm build:static` pour générer le site statique. Le catalogue n’a pas besoin de base de données ni de paiement en ligne.

## Modifier le numéro WhatsApp

Le numéro utilisé par tous les boutons est en haut de `client/src/App.tsx`, dans `WHATSAPP_NUMBER`. Gardez uniquement les chiffres au format international sans le `+` pour `wa.me`. Le numéro affiché est dans `DISPLAY_PHONE`.

## Modifier le texte Livraison & retours

Le contenu éditable se trouve dans la fonction `Policies` de `client/src/App.tsx`. Il existe une version française et une version arabe afin de garder le toggle cohérent.

## Publier gratuitement

Le projet est configuré pour être publié en site statique via Manus Webdev. La commande de build est `pnpm build:static` et le dossier publié est `dist/public`. Une alternative simple est Netlify ou Vercel : connectez le dépôt Git, utilisez `pnpm install --frozen-lockfile` comme installation, `pnpm build:static` comme commande de build et `dist/public` comme dossier de sortie.

## Connecter votre propre domaine plus tard

Dans Netlify : **Site settings → Domain management → Add custom domain**, puis copiez les enregistrements DNS demandés chez votre registrar. Dans Vercel : **Project → Settings → Domains**, ajoutez le domaine et suivez les enregistrements DNS. Attendez ensuite la validation SSL automatique. Le site ne contient pas d’URL métier codée en dur : vous pourrez remplacer les balises `canonical`, `og:url` et le sitemap par votre domaine final.

## Fichiers de marque

Le logo fourni par le client est la source principale utilisée dans le site : `client/public/brand/hd-vag-parts-user-logo.jpg`. Pour le remplacer plus tard, gardez ce même chemin ou modifiez la source dans le composant `Logo` de `client/src/App.tsx`.

Les fichiers éditables sont dans `brand/` et leurs versions servies par le site dans `client/public/brand/` : logo SVG clair/foncé, logo PNG clair/foncé, avatar carré, couverture Facebook, post carré et story 9:16. Les textes des modèles sont en SVG pour rester modifiables dans Figma, Illustrator ou Inkscape.

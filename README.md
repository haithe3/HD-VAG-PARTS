# HD VAG PARTS

Plateforme mobile-first bilingue (français / العربية RTL) pour HD VAG PARTS, spécialiste des pièces VAG en Algérie. Les commandes sont préparées sur WhatsApp ; il n'y a pas de paiement en ligne.

## Démarrage local

Prérequis : Node.js 20+ et pnpm 10.

```bash
pnpm install --frozen-lockfile
pnpm db:push
pnpm tsx scripts/seed-database.ts
pnpm dev
```

Ouvrez ensuite `http://localhost:3000`. Le serveur Express sert le frontend, l'API tRPC et les routes OAuth.

Commandes utiles :

```bash
pnpm check          # vérification TypeScript
pnpm build          # build frontend + serveur
pnpm build:static   # build frontend statique uniquement
pnpm db:push        # génère et applique les migrations Drizzle
pnpm db:migrate     # applique les migrations déjà générées
pnpm tsx scripts/seed-database.ts  # importe les JSON de départ une seule fois
```

## Connexion et rôles

La connexion utilise Manus OAuth : aucun mot de passe n'est stocké dans le projet. Le lien **Connexion** ouvre `/login`. Après connexion, un client arrive sur `/compte`; l'administrateur arrive sur `/admin`.

Le compte propriétaire de la plateforme est promu `admin` automatiquement par `OWNER_OPEN_ID`. Tous les autres comptes sont créés avec le rôle `user`. Les procédures d'administration tRPC vérifient le rôle côté serveur : masquer le lien `/admin` ne suffit donc pas pour accéder aux opérations.

## Tableau de bord administrateur

Depuis `/admin`, l'administrateur peut :

- créer une pièce avec son nom, référence, catégorie, marque, qualité `Original` / `OEM` / `Aftermarket`, compatibilité, prix et disponibilité ;
- modifier ou supprimer une pièce existante ;
- rechercher parmi le catalogue importé ;
- uploader des images JPG, PNG ou WEBP de 8 Mo maximum ; elles sont envoyées vers Manus Managed Storage et leur URL stable est enregistrée dans la base ;
- consulter les packs d'entretien importés.

Les images ne sont pas ajoutées au dépôt Git. Le tableau de bord utilise `product_images` pour conserver l'historique des photos et définit la dernière image uploadée comme image principale.

## Données et migration

Le schéma Drizzle est dans `drizzle/schema.ts` : `users`, `products`, `product_images`, `maintenance_packs`, `compatibility_rows` et `delivery_zones`. Le script `scripts/seed-database.ts` importe les fichiers de départ sans modifier les JSON sources. Il ignore une table déjà remplie pour éviter les doublons.

Les fichiers JSON restent présents comme source de secours pour le mode frontend et comme sauvegarde éditable :

- `client/src/data/products.json` : catalogue initial de 1 447 pièces ;
- `client/src/data/compatibility.json` : références de compatibilité, avec dix placeholders ;
- `client/src/data/delivery.json` : 58 wilayas avec prix et délais à confirmer ;
- `client/src/data/packs.json` : trois packs d'entretien placeholders.

Après la migration, le catalogue public lit d'abord la base de données et revient aux JSON uniquement si la base n'est pas disponible.

## WhatsApp, SEO et domaine

Le numéro WhatsApp est défini dans `client/src/config.ts` et utilisé pour les boutons, le panier et les formulaires. Il n'y a aucun paiement en ligne.

Modifiez `SITE_URL` dans `client/src/config.ts`, puis lancez `pnpm seo:urls`, `pnpm check` et `pnpm build:static` pour régénérer les URLs SEO. Pour Vercel ou Netlify : commande `pnpm build:static`, dossier `dist/public`. Pour la version full-stack, utilisez `pnpm build` et le serveur Docker fourni.

Pour connecter un domaine : ajoutez-le dans **Project → Settings → Domains** sur Vercel ou dans **Domain management** sur Netlify, puis renseignez le domaine final dans `SITE_URL`.

## Identité visuelle et sécurité

Le logo fourni par le client est utilisé dans `client/public/brand/hd-vag-parts-user-logo-transparent-cropped.png`. Les fichiers éditables sont dans `brand/` et leurs copies servies dans `client/public/brand/`.

Ne jamais committer de secrets, tokens ou clés API. Les fichiers `.env*`, logs, caches, dépendances et builds sont exclus par `.gitignore`. Les identifiants analytics restent vides par défaut.

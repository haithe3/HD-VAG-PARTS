# TODO — HD VAG PARTS

## Site public bilingue et navigation
- [x] Le site est mobile-first et propose les pages Accueil, Catalogue, Trouver ma pièce, Comment ça marche, Livraison & retours, À propos et Contact.
- [x] Le site est bilingue français / arabe avec un toggle visible ; l’arabe utilise `dir="rtl"` et une mise en page lisible de droite à gauche.
- [x] Un bouton WhatsApp flottant est présent sur toutes les pages et pointe vers 0540399326.

## Accueil et conversion
- [x] L’accueil affiche le hero « Pièces VAG fiables, livrées partout en Algérie », un CTA « Envoyer mon VIN », les catégories, les raisons de choisir HD VAG PARTS et les informations de livraison.
- [x] Les messages sont simples, adaptés au contexte algérien et n’affirment jamais « 100% original ».
- [x] La section Vérifier la compatibilité est visible sur l’accueil et son lien est présent dans le menu.

## Catalogue et Packs éditables
- [x] Le catalogue filtre les catégories filtres, freinage, moteur, suspension, électricité, huiles & fluides et carrosserie ; les liens `/catalogue?cat=...` activent le bon filtre.
- [x] Chaque fiche affiche une image placeholder clairement identifiée ou une photo depuis `client/public/products/`, un nom, une référence, des modèles compatibles, un label Original / OEM / Aftermarket et un bouton WhatsApp avec nom + référence préremplis.
- [x] Les produits et prix indicatifs sont modifiables sans toucher aux composants via `client/src/data/products.json`.
- [x] Trois packs entretien de départ sont éditables dans `client/src/data/packs.json` et affichent un statut placeholder tant que les données ne sont pas remplacées.

## Compatibilité VIN / référence
- [x] L’outil accepte un VIN de 17 caractères, ignore les espaces, convertit en majuscules et refuse I, O et Q.
- [x] Le WMI affiche Volkswagen pour WVW/WVG, Audi pour WAU/WUA, Škoda pour TMB, SEAT pour VSS, avec fallback générique ; il ne prétend pas décoder le modèle ou le moteur à partir du VIN seul.
- [x] La référence est normalisée sans espaces ni tirets puis recherchée dans `client/src/data/compatibility.json`.
- [x] Une référence trouvée affiche le nom, modèles, années, confirmation indicative et bouton WhatsApp ; une référence inconnue affiche le message de vérification et le bouton WhatsApp correspondant.
- [x] Une alerte signale une éventuelle différence entre la marque du VIN et la marque de la ligne trouvée, sans afficher « incompatible » ni « 100% compatible ».
- [ ] Les 10 lignes `PLACEHOLDER` de compatibilité doivent être remplacées avec les références réelles avant la mise en production commerciale.

## Formulaire VIN et WhatsApp
- [x] Le formulaire contient marque, modèle, année, moteur, VIN, pièce recherchée, photo, wilaya et téléphone.
- [x] La soumission compose un message WhatsApp complet ; l’interface explique que la photo est jointe ensuite dans WhatsApp.

## Livraison et politiques
- [x] Les 58 wilayas sont listées dans `client/src/data/delivery.json` avec les champs `wilaya`, `price` et `delay`, et la page propose une recherche.
- [x] La politique couvre livraison, paiement à la livraison ou dépôt, vérification avant commande et retours éditables.
- [ ] Les prix et délais `À confirmer / نؤكد معك` doivent être remplacés par les valeurs commerciales réelles.

## Identité de marque et fichiers
- [x] Le logo HD VAG PARTS fourni par le client est utilisé avec un fond transparent, lisible en petit et sans imitation des logos VAG.
- [x] Les variantes SVG/PNG clair/foncé, avatar carré, couverture Facebook, post carré et story 9:16 sont livrées dans `brand/` et `client/public/brand/`.

## SEO, analytics et remise
- [x] Les métadonnées title, description, Open Graph, Twitter card et favicon sont présentes ; `useSeo` met à jour title/description/canonical par page.
- [x] `manus-routes.json`, robots et sitemap déclarent les routes publiques, y compris `/a-propos` et `/verifier-compatibilite`.
- [x] `pnpm seo:urls` construit les URLs absolues depuis `SITE_URL` lorsque ce champ est rempli, sinon garde les URLs relatives.
- [x] Les IDs Meta Pixel et GA sont désactivés par défaut ; les clics WhatsApp sont suivis seulement si un ID est configuré.
- [x] Le guide français explique modification des produits/prix, images placeholder, compatibilité, packs, livraison, numéro WhatsApp, SEO et connexion d’un domaine.
- [x] Le projet passe `pnpm check` et `pnpm build:static` et les pages principales ont été vérifiées à 390px.

## Authentification, base de données et administration
- [x] La connexion utilise Manus OAuth avec une session cookie `SameSite=None; Secure` adaptée à Preview.
- [x] Le client est redirigé vers `/compte`, tandis que le propriétaire reconnu par `OWNER_OPEN_ID` reçoit le rôle `admin` et est redirigé vers `/admin`.
- [x] Le schéma Drizzle comprend `users`, `products`, `product_images`, `maintenance_packs`, `compatibility_rows` et `delivery_zones`.
- [x] Le script `scripts/seed-database.ts` a importé 1 447 produits, 10 lignes de compatibilité, 58 wilayas et 3 packs sans modifier les JSON sources.
- [x] La page `/admin` permet de créer, modifier, supprimer et rechercher des produits, ainsi que d’uploader des images JPG, PNG et WEBP vers Manus Managed Storage.
- [x] Les procédures serveur vérifient le rôle `admin` avant chaque opération d’écriture ; cacher le lien admin ne constitue pas une protection.

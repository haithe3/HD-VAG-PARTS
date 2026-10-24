# Plan — HD VAG PARTS

## Direction retenue

Trois pistes ont été considérées :
- **Atelier performance** (0,07) : identité sombre, technique, contrastée, pensée pour les pièces et le diagnostic.
- **Service de proximité** (0,06) : plus clair, chaleureux, axé sur la relation et la livraison locale.
- **OEM editorial** (0,04) : catalogue très blanc, calme, centré sur les références.

La direction choisie est **Atelier performance**.

- **Mouvement** : information design automobile / atelier de performance.
- **Principes** : hiérarchie nette, lecture mobile immédiate, confiance avant la vente, détails techniques visibles.
- **Philosophie couleur** : graphite profond pour l’expertise, blanc chaud pour la lisibilité, bleu électrique pour les actions et la disponibilité.
- **Paradigme de mise en page** : bandes éditoriales asymétriques, rail de navigation compact, cartes en grille seulement pour les produits et catégories.
- **Signatures** : étiquette bleue « VAG / ALGERIE », lignes de repère façon schéma technique, bouton WhatsApp flottant toujours accessible.
- **Interaction** : peu d’étapes, CTA WhatsApp explicites, filtres instantanés, changement de langue sans perte de contexte.
- **Animation** : transitions courtes 180–260 ms, reveal discret des blocs, aucun mouvement qui ralentit la prise de contact.
- **Typographie** : Space Grotesk pour titres et chiffres, Plus Jakarta Sans pour le texte courant ; arabe rendu en Noto Sans Arabic / system sans-serif.
- **Essence** : les bonnes pièces VAG, confirmées sur VIN, livrées partout en Algérie. Personnalité : fiable, directe, technique.
- **Voix** : simple, concrète, sans promesse absolue. Exemples : « Envoyez votre VIN. On vérifie la bonne référence. » / « القطعة الصحيحة تبدأ برقم الشاسيه. »
- **Logo** : monogramme HD dans un hexagone ouvert, rappelant un repère de plan et une pièce mécanique, avec wordmark condensé « HD VAG PARTS ». Aucun élément des logos constructeur.
- **Couleur signature** : bleu électrique #2D8CFF.

## Architecture

- React + Vite + TypeScript, projet statique sans serveur ni paiement en ligne.
- Routes client : `/`, `/catalogue`, `/trouver-ma-piece`, `/comment-ca-marche`, `/livraison-retours`, `/contact`.
- `client/src/data/products.json` est la source simple à modifier pour les produits, références, prix indicatifs, compatibilités et labels.
- WhatsApp est le canal transactionnel : les boutons composent une URL `wa.me` avec un message encodé, sans collecte serveur.
- Le formulaire VIN prépare un message complet avec les champs remplis, et propose la pièce jointe photo via l’interface WhatsApp après l’envoi.
- Les assets de marque sont conservés dans `brand/` en SVG éditables et PNG d’usage.
- Le hero utilise l’asset généré livré dans Managed Storage ; les produits de démonstration sont des placeholders clairement marqués.
- SEO de base dans `client/index.html`, `public/manus-routes.json`, `public/robots.txt` et `public/sitemap.xml`.

## Structure

- `client/src/App.tsx` : shell, routes, navigation, changement de langue, sections et interactions.
- `client/src/index.css` : tokens, responsive, composants visuels et RTL.
- `client/src/data/products.json` : catalogue éditable.
- `client/public/` : manifest de routes, robots, sitemap, favicon et exports simples.
- `brand/` : logo et modèles sociaux.
- `GUIDE-FR.md` : guide court pour modifier les produits, prix, WhatsApp et déployer.

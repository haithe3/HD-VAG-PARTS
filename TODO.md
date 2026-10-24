# TODO — HD VAG PARTS

## Site public bilingue et navigation
- [ ] Le site est mobile-first et propose les pages Accueil, Catalogue, Trouver ma pièce, Comment ça marche, Livraison & retours et Contact.
- [ ] Le site est bilingue français / arabe avec un toggle visible ; l’arabe utilise `dir="rtl"` et une mise en page lisible de droite à gauche.
- [ ] Un bouton WhatsApp flottant est présent sur toutes les pages et pointe vers 0540399326.

## Accueil et conversion
- [ ] L’accueil affiche le hero « Pièces VAG fiables, livrées partout en Algérie », un CTA « Envoyer mon VIN », les catégories, les raisons de choisir HD VAG PARTS et les informations de livraison.
- [ ] Les messages sont simples, adaptés au contexte algérien et n’affirment jamais « 100% original ».

## Catalogue éditable
- [ ] Le catalogue filtre les catégories filtres, freinage, moteur, suspension, électricité, huiles & fluides et carrosserie.
- [ ] Chaque fiche affiche une image placeholder clairement identifiée, nom, référence, modèles compatibles, label Original / OEM / Aftermarket et bouton WhatsApp avec nom + référence préremplis.
- [ ] Les produits et prix indicatifs sont modifiables sans toucher aux composants via `client/src/data/products.json`.

## Formulaire VIN et WhatsApp
- [ ] Le formulaire contient marque, modèle, année, moteur, VIN, pièce recherchée, photo, wilaya et téléphone.
- [ ] La soumission valide les champs utiles et compose un message WhatsApp complet ; l’interface explique que la photo est jointe ensuite dans WhatsApp.

## Identité de marque et fichiers
- [ ] Le logo HD VAG PARTS est original, lisible en petit, non inspiré visuellement des logos Volkswagen, Audi, Skoda ou Seat.
- [ ] Les variantes SVG/PNG clair/foncé, avatar carré, couverture Facebook, post carré et story 9:16 sont livrées.

## SEO, livraison et remise
- [ ] Les métadonnées title, description, Open Graph, Twitter card et favicon sont présentes.
- [ ] `manus-routes.json`, robots et sitemap déclarent les routes publiques.
- [ ] Le guide français explique modification des produits/prix, remplacement des images placeholder, numéro WhatsApp et connexion d’un domaine.
- [ ] Le projet est buildable en statique et publié via le flux Webdev.

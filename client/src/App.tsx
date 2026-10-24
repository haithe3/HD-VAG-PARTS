import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CarFront,
  ChevronDown,
  CircleCheck,
  Clock3,
  FileText,
  Fuel,
  Gauge,
  Hammer,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Upload,
  X,
  Zap,
} from "lucide-react";
import productsData from "./data/products.json";

type Lang = "fr" | "ar";
type Product = (typeof productsData)[number];
type CategoryKey = Product["category"] | "all";

const WHATSAPP_NUMBER = "213540399326";
const DISPLAY_PHONE = "0540 39 93 26";
const HERO_IMAGE = "/manus-storage/async-images/VBl7plW3sxrVnHfet4JVdk/image-1.webp";

const categoryList: Array<{ key: CategoryKey; fr: string; ar: string; icon: typeof Fuel; short: string }> = [
  { key: "all", fr: "Tout le catalogue", ar: "كل الكتالوج", icon: Sparkles, short: "Tout" },
  { key: "filters", fr: "Filtres", ar: "الفلاتر", icon: Fuel, short: "Filtres" },
  { key: "brakes", fr: "Freinage", ar: "الفرامل", icon: Gauge, short: "Freinage" },
  { key: "engine", fr: "Moteur", ar: "المحرك", icon: Zap, short: "Moteur" },
  { key: "suspension", fr: "Suspension", ar: "التعليق", icon: CarFront, short: "Suspension" },
  { key: "electrical", fr: "Électricité", ar: "الكهرباء", icon: Sparkles, short: "Électricité" },
  { key: "fluids", fr: "Huiles & fluides", ar: "الزيوت والسوائل", icon: Fuel, short: "Fluides" },
  { key: "body", fr: "Carrosserie", ar: "هيكل السيارة", icon: Hammer, short: "Carrosserie" },
];

const copy = {
  fr: {
    nav: { home: "Accueil", catalog: "Catalogue", find: "Trouver ma pièce", how: "Comment ça marche", policy: "Livraison & retours", contact: "Contact" },
    kicker: "PIÈCES VAG · ALGÉRIE",
    heroTitle: "Pièces VAG fiables, livrées partout en Algérie.",
    heroText: "Envoyez votre VIN. Nous vérifions la bonne référence, confirmons le prix et organisons la livraison dans votre wilaya.",
    heroPrimary: "Envoyer mon VIN",
    heroSecondary: "Voir le catalogue",
    trust: "Volkswagen · Audi · Škoda · SEAT · autres marques sur demande",
    sectionEyebrow: "LA BONNE RÉFÉRENCE, SANS DÉTOUR",
    categoriesTitle: "Trouvez votre famille de pièce.",
    categoriesText: "Des pièces sélectionnées selon votre modèle, votre moteur et votre numéro de châssis.",
    whyTitle: "Un service pensé pour éviter les erreurs.",
    whyText: "Chez HD VAG PARTS, on commence par les bonnes informations — pas par une promesse vague.",
    whyCards: [
      ["01", "Vérification sur VIN", "Votre numéro de châssis aide à confirmer la compatibilité avant de commander."],
      ["02", "Référence claire", "Original, OEM ou Aftermarket : le niveau de qualité est indiqué à chaque fois."],
      ["03", "Sourcing à la demande", "Nous cherchons la pièce auprès de notre boutique partenaire selon votre besoin."],
      ["04", "Livraison nationale", "On livre partout en Algérie, avec suivi du dépôt jusqu’à la réception."],
    ],
    deliveryTitle: "Un doute sur la pièce ? On regarde avec vous.",
    deliveryText: "Envoyez le VIN, une photo si vous l’avez et votre wilaya. Nous revenons vers vous sur WhatsApp avec la référence et le prix.",
    deliveryCta: "Décrire ma demande",
    catalogTitle: "Catalogue de démonstration",
    catalogText: "Les photos et références ci-dessous sont des placeholders à remplacer par vos vrais produits.",
    order: "Commander sur WhatsApp",
    reference: "Réf.",
    compatible: "Compatible avec",
    quality: "Qualité",
    price: "Prix indicatif",
    placeholder: "PHOTO À REMPLACER",
    all: "Tout",
    findTitle: "Trouvez la bonne pièce avec votre VIN.",
    findText: "Remplissez ce formulaire. Les détails seront préparés dans un message WhatsApp pour accélérer la vérification.",
    sendRequest: "Envoyer la demande sur WhatsApp",
    photoHint: "Optionnel — ajoutez ensuite la photo directement dans WhatsApp.",
    requiredHint: "Les champs marqués * nous aident à vérifier la compatibilité.",
    howTitle: "Simple, en quatre étapes.",
    howText: "Pas de paiement en ligne. La commande se confirme avec vous sur WhatsApp.",
    howSteps: [
      ["01", "Envoyez le VIN", "Le numéro de châssis, le modèle et la pièce recherchée."],
      ["02", "On confirme", "Nous vérifions la référence, la qualité disponible et le prix."],
      ["03", "Dépôt ou COD", "Un dépôt peut être demandé selon la pièce. Sinon, paiement à la livraison."],
      ["04", "Livraison", "Votre commande part vers votre wilaya, avec les informations de réception."],
    ],
    policyTitle: "Livraison & retours",
    policyText: "Une base claire, à ajuster selon votre fonctionnement.",
    contactTitle: "Parlons de votre véhicule.",
    contactText: "Un message WhatsApp suffit pour commencer. Réponse simple, sans jargon inutile.",
    openWhatsApp: "Ouvrir WhatsApp",
    callUs: "Appeler",
    footerLine: "Pièces VAG fiables · Livraison dans toutes les wilayas · Commande par WhatsApp",
  },
  ar: {
    nav: { home: "الرئيسية", catalog: "الكتالوج", find: "أبحث عن قطعة", how: "كيف نعمل", policy: "التوصيل والإرجاع", contact: "اتصل بنا" },
    kicker: "قطع VAG · الجزائر",
    heroTitle: "قطع VAG موثوقة، والتوصيل إلى كل ولايات الجزائر.",
    heroText: "أرسل رقم الشاسيه. نتحقق من المرجع الصحيح، نؤكد السعر، ونرتب التوصيل إلى ولايتك.",
    heroPrimary: "أرسل رقم الشاسيه",
    heroSecondary: "شاهد الكتالوج",
    trust: "Volkswagen · Audi · Škoda · SEAT · علامات أخرى عند الطلب",
    sectionEyebrow: "المرجع الصحيح، بدون تعقيد",
    categoriesTitle: "اختر نوع القطعة.",
    categoriesText: "قطع حسب الموديل، المحرك ورقم الشاسيه.",
    whyTitle: "خدمة تساعدك تتجنب الغلط.",
    whyText: "في HD VAG PARTS نبدأ بالمعلومات الصحيحة، وليس بالوعود الكبيرة.",
    whyCards: [
      ["01", "تأكيد عبر VIN", "رقم الشاسيه يساعدنا نتأكد من التوافق قبل الطلب."],
      ["02", "مرجع واضح", "Original أو OEM أو Aftermarket: الجودة مكتوبة بوضوح."],
      ["03", "توفير حسب الطلب", "نبحث عن القطعة عند شريكنا حسب حاجتك."],
      ["04", "توصيل وطني", "نوصل لكل ولايات الجزائر ونتابع الطلب حتى الاستلام."],
    ],
    deliveryTitle: "ماكش متأكد من القطعة؟ نشوفوها معاك.",
    deliveryText: "أرسل رقم الشاسيه، صورة إذا كانت عندك والولاية. نرجعولك على واتساب بالمرجع والسعر.",
    deliveryCta: "اشرح طلبي",
    catalogTitle: "كتالوج تجريبي",
    catalogText: "الصور والمراجع هنا مؤقتة. بدّلها بمنتجاتك الحقيقية.",
    order: "اطلب عبر واتساب",
    reference: "المرجع",
    compatible: "متوافق مع",
    quality: "الجودة",
    price: "السعر التقريبي",
    placeholder: "صورة مؤقتة",
    all: "الكل",
    findTitle: "نلقاو القطعة الصحيحة برقم الشاسيه.",
    findText: "عمر الاستمارة. التفاصيل تتحضر في رسالة واتساب باش نسرعو التحقق.",
    sendRequest: "أرسل الطلب عبر واتساب",
    photoHint: "اختياري — أضف الصورة مباشرة في واتساب بعد الإرسال.",
    requiredHint: "الخانات التي فيها * تساعدنا نتأكد من التوافق.",
    howTitle: "أربع خطوات بسيطة.",
    howText: "ماكانش دفع إلكتروني. الطلب يتأكد معاك عبر واتساب.",
    howSteps: [
      ["01", "أرسل VIN", "رقم الشاسيه، الموديل والقطعة التي تحتاجها."],
      ["02", "نأكدولك", "نتحقق من المرجع، الجودة المتوفرة والسعر."],
      ["03", "عربون أو عند الاستلام", "يمكن طلب عربون حسب القطعة، أو الدفع عند التوصيل."],
      ["04", "التوصيل", "الطلب يروح لولايتك مع معلومات الاستلام."],
    ],
    policyTitle: "التوصيل والإرجاع",
    policyText: "نص أساسي تقدر تعدلو حسب طريقة خدمتك.",
    contactTitle: "احكيلنا على سيارتك.",
    contactText: "رسالة واتساب تكفي باش نبدأو. جواب واضح وبدون تعقيد.",
    openWhatsApp: "افتح واتساب",
    callUs: "اتصل بنا",
    footerLine: "قطع VAG موثوقة · توصيل إلى كل الولايات · الطلب عبر واتساب",
  },
} as const;

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function useSeo(lang: Lang, title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — HD VAG PARTS`;
    document.documentElement.lang = lang === "ar" ? "ar-DZ" : "fr-DZ";
    const descriptionNode = document.querySelector('meta[name="description"]');
    if (descriptionNode) descriptionNode.setAttribute("content", description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", `${title} — HD VAG PARTS`);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", description);
  }, [lang, title, description]);
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-lockup" aria-label="HD VAG PARTS — Accueil">
      <img className={`brand-logo ${compact ? "compact" : ""}`} src="/brand/hd-vag-parts-user-logo.jpg" alt="HD VAG PARTS" />
    </Link>
  );
}

function Header({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const t = copy[lang];
  const links = [
    ["/", t.nav.home],
    ["/catalogue", t.nav.catalog],
    ["/trouver-ma-piece", t.nav.find],
    ["/comment-ca-marche", t.nav.how],
    ["/livraison-retours", t.nav.policy],
    ["/contact", t.nav.contact],
  ];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={`desktop-nav ${open ? "is-open" : ""}`} aria-label="Navigation principale">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={location === href ? "active" : ""}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="lang-toggle" onClick={() => setLang(lang === "fr" ? "ar" : "fr")} aria-label="Changer de langue">
            <span className={lang === "fr" ? "selected" : ""}>FR</span><span>/</span><span className={lang === "ar" ? "selected" : ""}>ع</span>
          </button>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {open && <div className="mobile-nav-wrap"><nav className="container mobile-nav">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={location === href ? "active" : ""}>{label}<ArrowRight size={16} /></Link>)}</nav></div>}
    </header>
  );
}

function WhatsAppFloat({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return <a className="whatsapp-float" href={whatsappUrl(lang === "fr" ? "Bonjour HD VAG PARTS, je cherche une pièce pour mon véhicule." : "السلام عليكم HD VAG PARTS، نبحث عن قطعة لسيارتي.")} target="_blank" rel="noreferrer" aria-label={t.openWhatsApp}><MessageCircle size={23} /><span>{t.openWhatsApp}</span></a>;
}

function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p className="footer-description">{t.footerLine}.</p></div><div className="footer-links"><span>{t.nav.catalog}</span><Link href="/catalogue">{t.catalogTitle}</Link><Link href="/trouver-ma-piece">{t.nav.find}</Link></div><div className="footer-links"><span>{t.nav.contact}</span><a href={whatsappUrl("Bonjour HD VAG PARTS")}>WhatsApp</a><a href="tel:+213540399326">{DISPLAY_PHONE}</a><span>Algerie · Toutes les wilayas</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} HD VAG PARTS</span><span>VAG · ALGÉRIE</span></div></footer>;
}

function Shell({ lang, setLang, children }: { lang: Lang; setLang: (lang: Lang) => void; children: React.ReactNode }) {
  return <div dir={lang === "ar" ? "rtl" : "ltr"} className={`app-shell ${lang === "ar" ? "rtl" : ""}`}><Header lang={lang} setLang={setLang} /><main>{children}</main><Footer lang={lang} /><WhatsAppFloat lang={lang} /></div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="eyebrow"><span className="eyebrow-line" />{children}</div>; }

function ProductVisual({ product }: { product: Product }) {
  const iconMap: Record<string, typeof Fuel> = { filters: Fuel, brakes: Gauge, engine: Zap, suspension: CarFront, electrical: Sparkles, fluids: Fuel, body: Hammer };
  const Icon = iconMap[product.category] || Sparkles;
  return <div className={`product-visual ${product.category}`}><div className="visual-grid" /><Icon size={40} strokeWidth={1.3} /><span>PLACEHOLDER</span><small>PHOTO</small></div>;
}

function Home({ lang }: { lang: Lang }) {
  const t = copy[lang];
  useSeo(lang, lang === "fr" ? "Pièces VAG fiables, livrées partout en Algérie" : "قطع VAG موثوقة والتوصيل إلى كل الجزائر", t.heroText);
  return <>
    <section className="hero-section"><div className="hero-image" style={{ backgroundImage: `url(${HERO_IMAGE})` }} /><div className="hero-overlay" /><div className="container hero-content"><div className="hero-copy"><Eyebrow>{t.kicker}</Eyebrow><h1>{t.heroTitle}</h1><p>{t.heroText}</p><div className="hero-actions"><Link href="/trouver-ma-piece" className="button button-primary">{t.heroPrimary}<ArrowRight size={17} /></Link><Link href="/catalogue" className="button button-ghost">{t.heroSecondary}<ArrowDownRight size={17} /></Link></div><div className="hero-trust"><ShieldCheck size={17} /><span>{t.trust}</span></div></div><div className="hero-stamp"><span>HD</span><small>VAG<br />PARTS</small></div></div></section>
    <section className="ticker"><div className="container ticker-inner"><span>VIN FIRST</span><span>•</span><span>VÉRIFICATION</span><span>•</span><span>PRIX CONFIRMÉ</span><span>•</span><span>LIVRAISON ALGÉRIE</span></div></section>
    <section className="section categories-section"><div className="container"><div className="section-head"><div><Eyebrow>{t.sectionEyebrow}</Eyebrow><h2>{t.categoriesTitle}</h2></div><p>{t.categoriesText}</p></div><div className="category-grid">{categoryList.filter((category) => category.key !== "all").map((category, index) => { const Icon = category.icon; return <Link href={`/catalogue?cat=${category.key}`} className="category-card" key={category.key}><span className="category-number">0{index + 1}</span><Icon size={28} /><strong>{lang === "fr" ? category.fr : category.ar}</strong><span className="category-arrow"><ArrowUpRightIcon /></span></Link>; })}</div></div></section>
    <section className="section dark-section why-section"><div className="container"><div className="section-head light"><div><Eyebrow>{lang === "fr" ? "POURQUOI HD VAG PARTS" : "لماذا HD VAG PARTS"}</Eyebrow><h2>{t.whyTitle}</h2></div><p>{t.whyText}</p></div><div className="why-grid">{t.whyCards.map(([number, title, text]) => <div className="why-card" key={number}><span className="why-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <section className="section delivery-section"><div className="container delivery-panel"><div className="delivery-icon"><Truck size={32} /></div><div><Eyebrow>{lang === "fr" ? "LIVRAISON NATIONALE" : "التوصيل الوطني"}</Eyebrow><h2>{t.deliveryTitle}</h2><p>{t.deliveryText}</p></div><Link href="/trouver-ma-piece" className="button button-dark">{t.deliveryCta}<ArrowRight size={17} /></Link></div></section>
  </>;
}

function ArrowUpRightIcon() { return <ArrowRight size={18} />; }

function CategoryPills({ lang, active, setActive }: { lang: Lang; active: CategoryKey; setActive: (key: CategoryKey) => void }) {
  return <div className="category-pills" role="tablist">{categoryList.map((category) => <button key={category.key} className={active === category.key ? "active" : ""} onClick={() => setActive(category.key)}>{lang === "fr" ? category.short : category.ar}</button>)}</div>;
}

function ProductCard({ lang, product }: { lang: Lang; product: Product }) {
  const t = copy[lang];
  const message = lang === "fr" ? `Bonjour HD VAG PARTS, je souhaite commander : ${product.name}, référence ${product.reference}. Mon véhicule : ` : `السلام عليكم، أريد طلب القطعة: ${product.name}، المرجع ${product.reference}. السيارة: `;
  return <article className="product-card"><ProductVisual product={product} /><div className="product-body"><div className="product-topline"><span className={`quality quality-${product.quality.toLowerCase()}`}>{product.quality}</span><span className="product-ref">{t.reference} {product.reference}</span></div><h3>{product.name}</h3><p className="product-compatible"><span>{t.compatible}</span> {product.compatible}</p><div className="product-footer"><strong>{product.price}</strong><a className="product-order" href={whatsappUrl(message)} target="_blank" rel="noreferrer"><MessageCircle size={16} />{t.order}</a></div></div></article>;
}

function Catalog({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialCategory = (query?.get("cat") as CategoryKey) || "all";
  const [active, setActive] = useState<CategoryKey>(categoryList.some((item) => item.key === initialCategory) ? initialCategory : "all");
  const [search, setSearch] = useState("");
  useSeo(lang, t.catalogTitle, t.catalogText);
  const filtered = useMemo(() => productsData.filter((product) => (active === "all" || product.category === active) && `${product.name} ${product.reference} ${product.compatible}`.toLowerCase().includes(search.toLowerCase())), [active, search]);
  return <section className="page-section"><div className="container"><div className="page-intro"><Eyebrow>{t.kicker}</Eyebrow><h1>{t.catalogTitle}</h1><p>{t.catalogText}</p></div><div className="catalog-toolbar"><CategoryPills lang={lang} active={active} setActive={setActive} /><label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={lang === "fr" ? "Rechercher une pièce ou une référence" : "ابحث عن قطعة أو مرجع"} /></label></div><div className="placeholder-note"><Sparkles size={17} /><span>{lang === "fr" ? "Produits de démonstration — remplacez les photos, noms, références et prix dans products.json." : "منتجات تجريبية — بدّل الصور والأسماء والمراجع والأسعار في ملف products.json."}</span></div><div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} lang={lang} product={product} />)}</div>{filtered.length === 0 && <div className="empty-state"><Search size={30} /><h3>{lang === "fr" ? "Aucun résultat" : "لا توجد نتائج"}</h3><p>{lang === "fr" ? "Essayez une autre référence ou contactez-nous sur WhatsApp." : "جرب مرجع آخر أو تواصل معنا عبر واتساب."}</p></div>}</div></section>;
}

function Field({ label, name, required = false, children, type = "text", placeholder }: { label: string; name: string; required?: boolean; children?: React.ReactNode; type?: string; placeholder?: string }) {
  return <label className="form-field"><span>{label}{required && <b> *</b>}</span>{children ? <>{type === "file" && <input name={name} type={type} required={required} />}{children}</> : <input name={name} type={type} placeholder={placeholder} required={required} />}</label>;
}

function FindPart({ lang }: { lang: Lang }) {
  const t = copy[lang];
  useSeo(lang, t.findTitle, t.findText);
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) || "—");
    const message = lang === "fr"
      ? `Bonjour HD VAG PARTS, voici ma demande de pièce :\n\nMarque : ${value("brand")}\nModèle : ${value("model")}\nAnnée : ${value("year")}\nMoteur : ${value("engine")}\nVIN / châssis : ${value("vin")}\nPièce recherchée : ${value("part")}\nWilaya : ${value("wilaya")}\nTéléphone : ${value("phone")}\n\nJe peux envoyer une photo directement ici si besoin.`
      : `السلام عليكم HD VAG PARTS، هذه معلومات طلب القطعة:\n\nالعلامة: ${value("brand")}\nالموديل: ${value("model")}\nالسنة: ${value("year")}\nالمحرك: ${value("engine")}\nرقم الشاسيه VIN: ${value("vin")}\nالقطعة المطلوبة: ${value("part")}\nالولاية: ${value("wilaya")}\nالهاتف: ${value("phone")}\n\nنقدر نرسل صورة مباشرة هنا إذا لزم.`;
    setSent(true);
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }
  return <section className="page-section find-page"><div className="container find-layout"><div className="page-intro find-intro"><Eyebrow>{t.kicker}</Eyebrow><h1>{t.findTitle}</h1><p>{t.findText}</p><div className="form-side-note"><BadgeCheck size={20} /><span>{lang === "fr" ? "Plus le VIN est complet, plus la vérification est rapide." : "كلما كان رقم الشاسيه كامل، يكون التحقق أسرع."}</span></div></div><form className="vin-form" onSubmit={submit}><div className="form-heading"><span>01 / 02</span><strong>{lang === "fr" ? "Informations véhicule" : "معلومات السيارة"}</strong></div><div className="form-grid"><Field label={lang === "fr" ? "Marque" : "العلامة"} name="brand" required placeholder="Volkswagen / Audi / Škoda / SEAT" /><Field label={lang === "fr" ? "Modèle" : "الموديل"} name="model" required placeholder="Golf 7, A3, Octavia..." /><Field label={lang === "fr" ? "Année" : "السنة"} name="year" type="number" placeholder="2018" /><Field label={lang === "fr" ? "Moteur" : "المحرك"} name="engine" placeholder="1.6 TDI / 1.4 TSI..." /><Field label={lang === "fr" ? "VIN / numéro de châssis" : "VIN / رقم الشاسيه"} name="vin" required placeholder="17 caractères si possible" /><Field label={lang === "fr" ? "Pièce recherchée" : "القطعة المطلوبة"} name="part" required placeholder={lang === "fr" ? "Ex. plaquettes avant" : "مثال: فحمات أمامية"} /><Field label={lang === "fr" ? "Wilaya" : "الولاية"} name="wilaya" required placeholder="Alger, Oran, Béjaïa..." /><Field label={lang === "fr" ? "Téléphone" : "الهاتف"} name="phone" required type="tel" placeholder="05 / 06 / 07..." /></div><Field label={lang === "fr" ? "Photo de la pièce / carte grise" : "صورة القطعة / البطاقة الرمادية"} name="photo" type="file"><div className="upload-field"><Upload size={18} /><span>{lang === "fr" ? "Choisir une photo" : "اختر صورة"}</span><small>JPG / PNG</small></div></Field><p className="form-hint"><CircleCheck size={16} />{t.requiredHint}<br /><span>{t.photoHint}</span></p><button className="button button-primary form-submit" type="submit">{sent ? (lang === "fr" ? "Message préparé ✓" : "تم تحضير الرسالة ✓") : t.sendRequest}<MessageCircle size={17} /></button></form></div></section>;
}

function HowItWorks({ lang }: { lang: Lang }) {
  const t = copy[lang];
  useSeo(lang, t.howTitle, t.howText);
  return <section className="page-section"><div className="container"><div className="page-intro"><Eyebrow>{lang === "fr" ? "LE PARCOURS HD VAG PARTS" : "طريقة HD VAG PARTS"}</Eyebrow><h1>{t.howTitle}</h1><p>{t.howText}</p></div><div className="steps-grid">{t.howSteps.map(([number, title, text], index) => <div className="step-card" key={number}><span className="step-number">{number}</span><div className="step-icon">{index === 0 ? <FileText /> : index === 1 ? <ShieldCheck /> : index === 2 ? <PackageCheck /> : <Truck />}</div><h2>{title}</h2><p>{text}</p>{index < 3 && <ArrowRight className="step-arrow" size={20} />}</div>)}</div><div className="how-bottom"><div><Clock3 size={18} /><strong>{lang === "fr" ? "Réponse sur WhatsApp" : "الرد عبر واتساب"}</strong></div><span>{lang === "fr" ? "Les délais dépendent de la disponibilité de la pièce chez notre partenaire." : "المدة تتعلق بتوفر القطعة عند شريكنا."}</span></div></div></section>;
}

function Policies({ lang }: { lang: Lang }) {
  const t = copy[lang];
  useSeo(lang, t.policyTitle, t.policyText);
  const sections = lang === "fr" ? [
    ["Livraison", "Nous livrons dans toutes les wilayas d’Algérie. Le délai et le coût sont confirmés avec vous sur WhatsApp selon la pièce, la disponibilité et la destination."],
    ["Paiement", "Le paiement se fait à la livraison ou avec un dépôt lorsque la pièce est sourcée spécialement pour votre commande. Aucun paiement en ligne n’est demandé sur ce site."],
    ["Vérification avant commande", "Avant de confirmer, nous vous envoyons la référence, le niveau de qualité disponible (Original / OEM / Aftermarket) et le prix convenu."],
    ["Retours", "Les retours sont étudiés au cas par cas. Une pièce commandée spécialement, montée, modifiée ou endommagée peut ne pas être reprise. Contactez-nous rapidement avec des photos et la référence de commande."],
  ] : [
    ["التوصيل", "نوصل لكل ولايات الجزائر. المدة والسعر يتأكدو معاك عبر واتساب حسب القطعة، التوفر والوجهة."],
    ["الدفع", "الدفع يكون عند الاستلام أو بعربون إذا كانت القطعة جايبة خاصة لطلبك. ماكانش دفع إلكتروني في هذا الموقع."],
    ["التأكد قبل الطلب", "قبل ما نأكدو، نبعثولك المرجع، نوع الجودة المتوفر (Original / OEM / Aftermarket) والسعر المتفق عليه."],
    ["الإرجاع", "الإرجاع يدرس حالة بحالة. القطعة الخاصة، المركبة أو المتضررة ممكن ما تتبدلش. تواصل معنا بسرعة مع الصور ومرجع الطلب."],
  ];
  return <section className="page-section policy-page"><div className="container narrow-container"><div className="page-intro"><Eyebrow>{t.kicker}</Eyebrow><h1>{t.policyTitle}</h1><p>{t.policyText}</p></div><div className="policy-list">{sections.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}</div><div className="editable-note"><Sparkles size={18} /><div><strong>{lang === "fr" ? "Texte éditable" : "نص قابل للتعديل"}</strong><p>{lang === "fr" ? "Retrouvez ce contenu dans `client/src/App.tsx`, section Policies, pour adapter les conditions de votre entreprise." : "تقدر تبدل هذا النص في ملف App.tsx، قسم Policies، حسب طريقة خدمتك."}</p></div></div></div></section>;
}

function Contact({ lang }: { lang: Lang }) {
  const t = copy[lang];
  useSeo(lang, t.contactTitle, t.contactText);
  return <section className="page-section contact-page"><div className="container contact-layout"><div className="page-intro"><Eyebrow>{t.kicker}</Eyebrow><h1>{t.contactTitle}</h1><p>{t.contactText}</p><div className="contact-actions"><a className="button button-primary" href={whatsappUrl(lang === "fr" ? "Bonjour HD VAG PARTS, je souhaite un conseil pour une pièce." : "السلام عليكم HD VAG PARTS، أريد نصيحة حول قطعة.")} target="_blank" rel="noreferrer"><MessageCircle size={18} />{t.openWhatsApp}</a><a className="button button-outline" href={`tel:+${WHATSAPP_NUMBER}`}><Phone size={18} />{t.callUs}</a></div></div><div className="contact-card"><div className="contact-card-top"><span className="status-dot" />{lang === "fr" ? "Canal principal" : "القناة الرئيسية"}</div><div className="contact-icon"><MessageCircle size={40} /></div><h2>WhatsApp</h2><a href={`tel:+${WHATSAPP_NUMBER}`} className="contact-number">{DISPLAY_PHONE}</a><p>{lang === "fr" ? "Envoyez votre VIN, votre modèle et votre wilaya. Nous vous répondons dès que possible." : "أرسل رقم الشاسيه، الموديل والولاية. نجاوبوك في أقرب وقت."}</p><div className="contact-meta"><span><MapPin size={15} />Algérie</span><span><Truck size={15} />Toutes les wilayas</span></div></div></div></section>;
}

function NotFoundPage({ lang }: { lang: Lang }) { const t = copy[lang]; return <section className="page-section"><div className="container page-intro"><Eyebrow>404</Eyebrow><h1>{lang === "fr" ? "Cette page n’existe pas." : "هذه الصفحة غير موجودة."}</h1><p>{lang === "fr" ? "Retournez à l’accueil ou envoyez-nous un message." : "ارجع للرئيسية أو أرسل لنا رسالة."}</p><Link href="/" className="button button-primary">{t.nav.home}<ArrowLeft size={17} /></Link></div></section>; }

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("hdvag-lang") as Lang) || "fr");
  useEffect(() => localStorage.setItem("hdvag-lang", lang), [lang]);
  return <Shell lang={lang} setLang={setLang}><Switch><Route path="/" component={() => <Home lang={lang} />} /><Route path="/catalogue" component={() => <Catalog lang={lang} />} /><Route path="/trouver-ma-piece" component={() => <FindPart lang={lang} />} /><Route path="/comment-ca-marche" component={() => <HowItWorks lang={lang} />} /><Route path="/livraison-retours" component={() => <Policies lang={lang} />} /><Route path="/contact" component={() => <Contact lang={lang} />} /><Route component={() => <NotFoundPage lang={lang} />} /></Switch></Shell>;
}

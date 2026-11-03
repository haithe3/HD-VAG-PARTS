import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, ImagePlus, LogIn, LogOut, Package, Pencil, Plus, Save, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type Lang = "fr" | "ar";
type ProductRecord = { id: string; name: string; reference: string; category: string; brand: string | null; quality: string | null; compatible: string | null; price: string | null; priceValue: number | null; inStock: boolean; image: string | null; keywords: string | null };

const text = {
  fr: {
    loginTitle: "Votre espace HD VAG PARTS",
    loginText: "Connectez-vous avec votre compte Manus pour suivre vos demandes et accéder aux outils autorisés.",
    login: "Se connecter",
    account: "Mon compte",
    admin: "Administration",
    customer: "Espace client",
    signedInAs: "Connecté avec",
    roleLabel: "Rôle",
    logout: "Se déconnecter",
    backShop: "Retour à la boutique",
    adminTitle: "Atelier de gestion",
    adminText: "Ajoutez vos pièces, ajustez les prix et envoyez les photos sans toucher au code.",
    products: "Produits",
    packs: "Packs entretien",
    productCount: "pièces en base",
    newProduct: "Nouvelle pièce",
    editProduct: "Modifier la pièce",
    save: "Enregistrer",
    cancel: "Annuler",
    create: "Créer la pièce",
    name: "Nom de la pièce",
    reference: "Référence",
    category: "Catégorie",
    brand: "Marque",
    quality: "Qualité",
    compatible: "Compatibilité / modèles",
    price: "Prix affiché",
    priceValue: "Prix numérique (DA)",
    image: "Image",
    search: "Rechercher une pièce",
    stock: "En stock",
    noImage: "Aucune image uploadée",
    manageImages: "Gérer les images",
    upload: "Uploader une image",
    replace: "L’image principale sera remplacée par la nouvelle.",
    delete: "Supprimer",
    updated: "Enregistré",
    forbidden: "Cette zone est réservée à l’administrateur.",
    notSigned: "Vous devez vous connecter pour continuer.",
    databaseNote: "Les changements sont enregistrés dans la base et restent disponibles après publication.",
  },
  ar: {
    loginTitle: "مساحتك مع HD VAG PARTS",
    loginText: "ادخل بحساب Manus باش تتابع طلباتك وتوصل للأدوات المسموحة ليك.",
    login: "تسجيل الدخول",
    account: "حسابي",
    admin: "لوحة الإدارة",
    customer: "مساحة الزبون",
    signedInAs: "داخل بالحساب",
    roleLabel: "الدور",
    logout: "تسجيل الخروج",
    backShop: "الرجوع للمحل",
    adminTitle: "ورشة التسيير",
    adminText: "زيد القطع، بدّل الأسعار وارفع الصور بلا ما تمس الكود.",
    products: "القطع",
    packs: "حزم الصيانة",
    productCount: "قطعة في القاعدة",
    newProduct: "قطعة جديدة",
    editProduct: "تعديل القطعة",
    save: "حفظ",
    cancel: "إلغاء",
    create: "إنشاء القطعة",
    name: "اسم القطعة",
    reference: "المرجع",
    category: "الفئة",
    brand: "الماركة",
    quality: "الجودة",
    compatible: "التوافق / الموديلات",
    price: "السعر المعروض",
    priceValue: "السعر الرقمي (دج)",
    image: "الصورة",
    search: "ابحث عن قطعة",
    stock: "متوفرة",
    noImage: "ما كاين حتى صورة مرفوعة",
    manageImages: "تسيير الصور",
    upload: "رفع صورة",
    replace: "الصورة الرئيسية تتبدل بالصورة الجديدة.",
    delete: "حذف",
    updated: "تسجلت",
    forbidden: "هذي المنطقة غير مخصصة إلا للأدمن.",
    notSigned: "لازم تدخل باش تكمل.",
    databaseNote: "التغييرات تتسجل في القاعدة وتبقى موجودة بعد النشر.",
  },
} as const;

const categories = ["engine", "suspension", "cooling", "electrical", "brakes", "filters", "transmission", "body", "fluids"];

function AuthCard({ lang, mode = "login" }: { lang: Lang; mode?: "login" | "account" }) {
  const t = text[lang];
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!loading && user && mode === "login") navigate(user.role === "admin" ? "/admin" : "/compte");
  }, [loading, mode, navigate, user]);
  if (loading) return <section className="account-page"><div className="container account-card"><div className="admin-loading">...</div></div></section>;
  if (!user) return <section className="account-page"><div className="container account-card"><div className="account-icon"><LogIn size={24} /></div><h1>{t.loginTitle}</h1><p>{t.loginText}</p><button className="button button-primary" onClick={() => startLogin()}><LogIn size={17} />{t.login}</button><Link href="/" className="account-back">{t.backShop}</Link></div></section>;
  return <section className="account-page"><div className="container account-card"><div className="account-icon"><ShieldCheck size={24} /></div><span className="account-kicker">{user.role === "admin" ? t.admin : t.customer}</span><h1>{t.account}</h1><p>{t.signedInAs} <strong>{user.name || user.email || user.openId}</strong>.</p><p className="account-role">{t.roleLabel} : <strong>{user.role}</strong></p><div className="account-actions">{user.role === "admin" && <Link href="/admin" className="button button-primary"><Package size={17} />{t.admin}</Link>}<button className="button button-outline" onClick={async () => { await logout(); navigate("/"); }}><LogOut size={17} />{t.logout}</button></div><Link href="/" className="account-back">{t.backShop}</Link></div></section>;
}

function ProductEditor({ lang, product, onClose }: { lang: Lang; product?: ProductRecord; onClose: () => void }) {
  const t = text[lang];
  const isEdit = Boolean(product);
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    id: product?.id ?? `p-admin-${Date.now()}`,
    name: product?.name ?? "",
    reference: product?.reference ?? "",
    category: product?.category ?? "engine",
    brand: product?.brand ?? "",
    quality: product?.quality ?? "Aftermarket",
    compatible: product?.compatible ?? "",
    price: product?.price ?? "Prix à confirmer",
    priceValue: product?.priceValue?.toString() ?? "",
    image: product?.image ?? "",
    keywords: product?.keywords ?? "",
    inStock: product?.inStock ?? true,
  });
  const update = trpc.admin.products.update.useMutation({ onSuccess: () => { utils.catalog.list.invalidate(); utils.admin.products.list.invalidate(); onClose(); } });
  const create = trpc.admin.products.create.useMutation({ onSuccess: () => { utils.catalog.list.invalidate(); utils.admin.products.list.invalidate(); onClose(); } });
  const setField = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const patch = { ...form, priceValue: form.priceValue ? Number(form.priceValue) : null, brand: form.brand || null, quality: form.quality || null, compatible: form.compatible || null, image: form.image || null, keywords: form.keywords || null, price: form.price || null };
    if (isEdit) update.mutate({ id: form.id, patch });
    else create.mutate({ ...patch, id: form.id, name: form.name, reference: form.reference, category: form.category });
  };
  return <div className="admin-modal-backdrop"><form className="admin-modal" onSubmit={submit}><div className="admin-modal-head"><div><span className="admin-kicker">{isEdit ? t.editProduct : t.newProduct}</span><h2>{isEdit ? product?.name : t.newProduct}</h2></div><button type="button" className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="admin-form-grid"><label><span>ID</span><input value={form.id} disabled={isEdit} onChange={(e) => setField("id", e.target.value)} /></label><label><span>{t.name}</span><input required value={form.name} onChange={(e) => setField("name", e.target.value)} /></label><label><span>{t.reference}</span><input required value={form.reference} onChange={(e) => setField("reference", e.target.value)} /></label><label><span>{t.category}</span><select value={form.category} onChange={(e) => setField("category", e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>{t.brand}</span><input value={form.brand} onChange={(e) => setField("brand", e.target.value)} /></label><label><span>{t.quality}</span><select value={form.quality} onChange={(e) => setField("quality", e.target.value)}><option>Original</option><option>OEM</option><option>Aftermarket</option></select></label><label className="wide"><span>{t.compatible}</span><input value={form.compatible} onChange={(e) => setField("compatible", e.target.value)} /></label><label><span>{t.price}</span><input value={form.price} onChange={(e) => setField("price", e.target.value)} /></label><label><span>{t.priceValue}</span><input type="number" min="0" value={form.priceValue} onChange={(e) => setField("priceValue", e.target.value)} /></label><label className="wide"><span>{t.image} URL (اختياري)</span><input value={form.image} onChange={(e) => setField("image", e.target.value)} placeholder="/manus-storage/..." /></label><label className="wide"><span>Keywords</span><textarea value={form.keywords} onChange={(e) => setField("keywords", e.target.value)} /></label><label className="admin-check"><input type="checkbox" checked={form.inStock} onChange={(e) => setField("inStock", e.target.checked)} />{t.stock}</label></div><div className="admin-modal-actions"><button type="button" className="button button-ghost-dark" onClick={onClose}>{t.cancel}</button><button className="button button-primary" disabled={update.isPending || create.isPending}><Save size={16} />{isEdit ? t.save : t.create}</button></div></form></div>;
}

function ImageManager({ lang, product, onClose }: { lang: Lang; product: ProductRecord; onClose: () => void }) {
  const t = text[lang];
  const utils = trpc.useUtils();
  const images = trpc.admin.images.list.useQuery({ productId: product.id });
  const upload = trpc.admin.images.upload.useMutation({ onSuccess: () => { images.refetch(); utils.catalog.list.invalidate(); utils.admin.products.list.invalidate(); } });
  const remove = trpc.admin.images.remove.useMutation({ onSuccess: () => { images.refetch(); utils.catalog.list.invalidate(); utils.admin.products.list.invalidate(); } });
  const handleFile = (file?: File) => {
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => upload.mutate({ productId: product.id, fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", dataBase64: String(reader.result) });
    reader.readAsDataURL(file);
  };
  return <div className="admin-modal-backdrop"><div className="admin-modal image-modal"><div className="admin-modal-head"><div><span className="admin-kicker">{t.manageImages}</span><h2>{product.name}</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><p className="admin-help">{t.replace}</p><label className="upload-drop"><Upload size={22} /><strong>{upload.isPending ? "..." : t.upload}</strong><small>JPG, PNG, WEBP · max 8 MB</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFile(e.target.files?.[0])} /></label><div className="admin-image-grid">{images.data?.map((item) => <div className="admin-image-item" key={item.id}><img src={item.url} alt={item.altText || product.name} /><button className="image-delete" onClick={() => remove.mutate({ id: item.id, productId: product.id })}><Trash2 size={15} /></button></div>)}{!images.data?.length && <p className="admin-empty">{t.noImage}</p>}</div></div></div>;
}

export function LoginPage({ lang }: { lang: Lang }) { return <AuthCard lang={lang} />; }
export function AccountPage({ lang }: { lang: Lang }) { return <AuthCard lang={lang} mode="account" />; }

export function AdminPage({ lang }: { lang: Lang }) {
  const t = text[lang];
  const auth = useAuth();
  const [selectedTab, setSelectedTab] = useState<"products" | "packs">("products");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<ProductRecord | "new" | null>(null);
  const [imagesFor, setImagesFor] = useState<ProductRecord | null>(null);
  const products = trpc.admin.products.list.useQuery(undefined, { enabled: auth.user?.role === "admin" });
  const packs = trpc.admin.packs.list.useQuery(undefined, { enabled: auth.user?.role === "admin" });
  const remove = trpc.admin.products.remove.useMutation({ onSuccess: () => products.refetch() });
  const filtered = useMemo(() => (products.data ?? []).filter((item) => `${item.name} ${item.reference} ${item.brand ?? ""}`.toLowerCase().includes(search.toLowerCase())).slice(0, 120), [products.data, search]);
  if (auth.loading) return <section className="admin-page"><div className="container admin-loading">...</div></section>;
  if (!auth.user) return <section className="admin-page"><div className="container admin-empty-state"><LogIn size={28} /><h1>{t.notSigned}</h1><Link href="/login" className="button button-primary">{t.login}</Link></div></section>;
  if (auth.user.role !== "admin") return <section className="admin-page"><div className="container admin-empty-state"><ShieldCheck size={28} /><h1>{t.forbidden}</h1><Link href="/compte" className="button button-primary">{t.account}</Link></div></section>;
  return <section className="admin-page"><div className="container"><div className="admin-topbar"><div><span className="admin-kicker">HD VAG PARTS · ADMIN</span><h1>{t.adminTitle}</h1><p>{t.adminText}</p></div><div className="admin-top-actions"><Link href="/compte" className="button button-outline"><ShieldCheck size={16} />{t.account}</Link><button className="button button-primary" onClick={() => setEditor("new")}><Plus size={16} />{t.newProduct}</button></div></div><div className="admin-note"><Check size={16} />{t.databaseNote}</div><div className="admin-tabs"><button className={selectedTab === "products" ? "active" : ""} onClick={() => setSelectedTab("products")}><Package size={17} />{t.products}<span>{products.data?.length ?? 0}</span></button><button className={selectedTab === "packs" ? "active" : ""} onClick={() => setSelectedTab("packs")}><Package size={17} />{t.packs}<span>{packs.data?.length ?? 0}</span></button></div>{selectedTab === "products" ? <div className="admin-panel"><div className="admin-panel-head"><div><h2>{t.products}</h2><p>{products.data?.length ?? 0} {t.productCount}</p></div><input className="admin-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} /></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t.image}</th><th>{t.name}</th><th>{t.reference}</th><th>{t.category}</th><th>{t.price}</th><th></th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td>{item.image ? <img className="admin-thumb" src={item.image} alt="" /> : <span className="admin-no-thumb"><ImagePlus size={16} /></span>}</td><td><strong>{item.name}</strong><small>{item.brand || "—"}</small></td><td>{item.reference}</td><td><span className="admin-category">{item.category}</span></td><td>{item.price || "—"}</td><td><div className="admin-row-actions"><button title={t.editProduct} onClick={() => setEditor(item)}><Pencil size={15} /></button><button title={t.manageImages} onClick={() => setImagesFor(item)}><ImagePlus size={15} /></button><button title={t.delete} onClick={() => { if (window.confirm(`${t.delete} ?`)) remove.mutate({ id: item.id }); }}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div></div> : <div className="admin-panel"><div className="admin-panel-head"><div><h2>{t.packs}</h2><p>{packs.data?.length ?? 0} éléments</p></div></div><div className="admin-pack-grid">{packs.data?.map((pack) => <article className="admin-pack-card" key={pack.id}><span>{pack.id}</span><h3>{pack.name}</h3><p>{pack.vehicle}</p><small>{pack.price}</small></article>)}</div></div>}</div>{editor && <ProductEditor lang={lang} product={editor === "new" ? undefined : editor} onClose={() => setEditor(null)} />}{imagesFor && <ImageManager lang={lang} product={imagesFor} onClose={() => setImagesFor(null)} />}</section>;
}

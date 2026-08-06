import { WHATSAPP_NUMERO } from "./firebase-config.js";

const CLE_PANIER = "hadiza_panier";

export function lirePanier() {
  return JSON.parse(localStorage.getItem(CLE_PANIER) || "[]");
}

export function sauverPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
  majCompteurPanier();
}

export function ajouterAuPanier(produit) {
  const panier = lirePanier();
  const existant = panier.find(
    (l) => l.productId === produit.productId && l.varianteId === produit.varianteId
  );
  if (existant) {
    existant.quantite += produit.quantite;
  } else {
    panier.push(produit);
  }
  sauverPanier(panier);
}

export function retirerDuPanier(index) {
  const panier = lirePanier();
  panier.splice(index, 1);
  sauverPanier(panier);
}

export function viderPanier() {
  sauverPanier([]);
}

export function totalPanier() {
  return lirePanier().reduce((s, l) => s + l.prixUnitaire * l.quantite, 0);
}

export function majCompteurPanier() {
  const el = document.getElementById("cart-count");
  if (el) {
    const n = lirePanier().reduce((s, l) => s + l.quantite, 0);
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  }
}

export function formaterFCFA(montant) {
  return montant.toLocaleString("fr-FR") + " FCFA";
}

// Construit le lien wa.me avec le récapitulatif de commande pré-rempli
export function lienWhatsApp({ adresse = "", telephone = "" } = {}) {
  const panier = lirePanier();
  if (panier.length === 0) return `https://wa.me/${WHATSAPP_NUMERO}`;

  let msg = "Bonjour HADIZA HUB, je souhaite commander :\n\n";
  panier.forEach((l) => {
    msg += `• ${l.nom}${l.variante ? " (" + l.variante + ")" : ""} x${l.quantite} — ${formaterFCFA(
      l.prixUnitaire * l.quantite
    )}\n`;
  });
  msg += `\nTotal : ${formaterFCFA(totalPanier())}`;
  if (adresse) msg += `\nAdresse : ${adresse}`;
  if (telephone) msg += `\nTéléphone : ${telephone}`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
}

majCompteurPanier();

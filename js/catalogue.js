import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { formaterFCFA } from "./panier.js";
import { listerCategories, CATEGORIES_EXCLUES } from "./categories.js";

const grille = document.getElementById("grille-produits");
const filtreCategorie = document.getElementById("filtre-categorie");
const filtreGenre = document.getElementById("filtre-genre");
const champRecherche = document.getElementById("recherche");

let tousLesProduits = []; // cache local pour filtrer la recherche sans re-requêter Firestore

async function chargerFiltreCategories() {
  if (!filtreCategorie) return;
  const categories = await listerCategories();
  const valeurCourante = filtreCategorie.value;
  filtreCategorie.innerHTML =
    `<option value="">Toutes les catégories</option>` +
    categories.map((c) => `<option value="${c.slug}">${c.nom}</option>`).join("");
  if (valeurCourante) filtreCategorie.value = valeurCourante;
}

function normaliser(texte) {
  return (texte || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function construireCarte(id, p, index) {
  const rupture = p.statut === "rupture";
  const enPromo = p.prixBarre && p.prixBarre > p.prix;
  const reduction = enPromo ? Math.round(100 - (p.prix / p.prixBarre) * 100) : 0;

  const carte = document.createElement("a");
  carte.href = `produit.html?id=${id}`;
  carte.className = "carte-produit";
  carte.style.animationDelay = `${Math.min(index, 12) * 45}ms`;

  carte.innerHTML = `
    <div class="img">
      <div class="badges-produit">
        ${rupture ? '<span class="badge badge-rupture">Rupture</span>' : ""}
        ${!rupture && enPromo ? `<span class="badge badge-promo">-${reduction}%</span>` : ""}
      </div>
      <img src="${p.images?.[0] || ""}" alt="${p.nom}" loading="lazy">
      ${p.images?.[1] ? `<img class="img-hover" src="${p.images[1]}" alt="" loading="lazy">` : ""}
    </div>
    <div class="meta">
      <p class="nom-produit">${p.nom}</p>
      <div class="ligne-prix">
        <span class="prix">${formaterFCFA(p.prix)}</span>
        ${enPromo ? `<span class="prix-barre">${formaterFCFA(p.prixBarre)}</span>` : ""}
      </div>
    </div>`;
  return carte;
}

function afficherProduits(docs) {
  if (docs.length === 0) {
    grille.innerHTML = `<div class="etat-vide"><p>😕 Aucun produit ne correspond à votre recherche.</p></div>`;
    return;
  }
  grille.innerHTML = "";
  docs.forEach(({ id, data }, index) => {
    grille.appendChild(construireCarte(id, data, index));
  });
}

function appliquerRecherche() {
  const termeRecherche = normaliser(champRecherche?.value || "");
  const filtres = !termeRecherche
    ? tousLesProduits
    : tousLesProduits.filter(({ data }) => normaliser(data.nom).includes(termeRecherche));
  afficherProduits(filtres);
}

async function chargerProduits() {
  grille.innerHTML = `<div class="etat-vide"><p>Chargement…</p></div>`;

  let contraintes = [where("statut", "!=", "archivé")];
  if (filtreCategorie.value) contraintes.push(where("categorie", "==", filtreCategorie.value));
  if (filtreGenre.value) contraintes.push(where("genre", "==", filtreGenre.value));

  try {
    const q = query(collection(db, "products"), ...contraintes);
    const snap = await getDocs(q);

    // Sécurité : les produits des catégories retirées (montres/chaînes/bagues)
    // ne doivent jamais apparaître publiquement.
    tousLesProduits = snap.docs
      .filter((d) => !CATEGORIES_EXCLUES.includes(d.data().categorie))
      .map((d) => ({ id: d.id, data: d.data() }));

    appliquerRecherche();
  } catch (e) {
    grille.innerHTML = `<div class="etat-vide"><p>Impossible de charger le catalogue pour le moment.</p></div>`;
    console.error(e);
  }
}

filtreCategorie?.addEventListener("change", chargerProduits);
filtreGenre?.addEventListener("change", chargerProduits);

let debounce;
champRecherche?.addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(appliquerRecherche, 200);
});

chargerFiltreCategories().then(chargerProduits);

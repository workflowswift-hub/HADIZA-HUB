import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { formaterFCFA } from "./panier.js";

const grille = document.getElementById("grille-produits");
const filtreCategorie = document.getElementById("filtre-categorie");
const filtreGenre = document.getElementById("filtre-genre");

async function chargerProduits() {
  grille.innerHTML = `<p style="grid-column:1/-1;color:#7A776E;">Chargement...</p>`;

  let contraintes = [where("statut", "!=", "archivé")];
  if (filtreCategorie.value) contraintes.push(where("categorie", "==", filtreCategorie.value));
  if (filtreGenre.value) contraintes.push(where("genre", "==", filtreGenre.value));

  try {
    const q = query(collection(db, "products"), ...contraintes);
    const snap = await getDocs(q);

    if (snap.empty) {
      grille.innerHTML = `<p style="grid-column:1/-1;color:#7A776E;">Aucun produit pour l'instant.</p>`;
      return;
    }

    grille.innerHTML = "";
    snap.forEach((doc) => {
      const p = doc.data();
      const rupture = p.statut === "rupture";
      const carte = document.createElement("a");
      carte.href = `produit.html?id=${doc.id}`;
      carte.className = "carte-produit";
      carte.innerHTML = `
        <div class="img">
          ${rupture ? '<span class="badge-rupture">Rupture</span>' : ""}
          <img src="${p.images?.[0] || ""}" alt="${p.nom}">
        </div>
        <div class="meta">
          ${p.nom}
          <div class="p">${formaterFCFA(p.prix)}${p.prixBarre ? ` <span style="color:#7A776E;text-decoration:line-through;font-size:0.78em;">${formaterFCFA(p.prixBarre)}</span>` : ""}</div>
        </div>`;
      grille.appendChild(carte);
    });
  } catch (e) {
    grille.innerHTML = `<p style="grid-column:1/-1;color:#7A776E;">Impossible de charger le catalogue pour le moment.</p>`;
    console.error(e);
  }
}

filtreCategorie?.addEventListener("change", chargerProduits);
filtreGenre?.addEventListener("change", chargerProduits);
document.addEventListener("DOMContentLoaded", chargerProduits);

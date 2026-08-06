import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { formaterFCFA } from "./panier.js";

const grille = document.getElementById("grille-nouveautes");

async function chargerNouveautes() {
  if (!grille) return;
  grille.innerHTML = `<p style="grid-column:1/-1;color:#7A776E;">Chargement...</p>`;

  try {
    const q = query(collection(db, "products"), where("statut", "==", "actif"), limit(8));
    const snap = await getDocs(q);

    if (snap.empty) {
      grille.innerHTML = `<p style="grid-column:1/-1;color:#7A776E;">Les premiers produits arrivent bientôt.</p>`;
      return;
    }

    grille.innerHTML = "";
    snap.forEach((doc) => {
      const p = doc.data();
      const carte = document.createElement("a");
      carte.href = `produit.html?id=${doc.id}`;
      carte.className = "carte-produit";
      carte.innerHTML = `
        <div class="img"><img src="${p.images?.[0] || ""}" alt="${p.nom}"></div>
        <div class="meta">
          ${p.nom}
          <div class="p">${formaterFCFA(p.prix)}${p.prixBarre ? ` <span style="color:#7A776E;text-decoration:line-through;font-size:0.78em;">${formaterFCFA(p.prixBarre)}</span>` : ""}</div>
        </div>`;
      grille.appendChild(carte);
    });
  } catch (e) {
    grille.innerHTML = `<p style="grid-column:1/-1;color:#7A776E;">Impossible de charger les nouveautés pour le moment.</p>`;
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", chargerNouveautes);

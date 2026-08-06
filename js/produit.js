import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ajouterAuPanier, formaterFCFA, lienWhatsApp } from "./panier.js";

const params = new URLSearchParams(location.search);
const productId = params.get("id");

const zone = document.getElementById("zone-produit");

let varianteChoisie = null;
let produitCourant = null;

async function chargerProduit() {
  if (!productId) {
    zone.innerHTML = "<p>Produit introuvable.</p>";
    return;
  }
  try {
    const snap = await getDoc(doc(db, "products", productId));
    if (!snap.exists()) {
      zone.innerHTML = "<p>Ce produit n'existe plus.</p>";
      return;
    }
    produitCourant = { id: snap.id, ...snap.data() };
    varianteChoisie = produitCourant.variantes?.[0] || null;
    afficherProduit();
  } catch (e) {
    zone.innerHTML = "<p>Erreur de chargement du produit.</p>";
    console.error(e);
  }
}

function afficherProduit() {
  const p = produitCourant;
  document.title = `HADIZA HUB — ${p.nom}`;

  zone.innerHTML = `
    <div class="miniatures" id="miniatures">
      ${p.images.map((img, i) => `<div class="mini ${i === 0 ? "active" : ""}" data-src="${img}"><img src="${img}"></div>`).join("")}
    </div>
    <div class="img-principale">
      <img id="img-principale" src="${p.images[0]}" alt="${p.nom}">
    </div>
    <div class="infos">
      <div class="eyebrow">${p.categorie} · ${p.genre}</div>
      <h1 class="serif">${p.nom}</h1>
      <div class="prix">${formaterFCFA(p.prix)}${p.prixBarre ? ` <span style="color:#7A776E;text-decoration:line-through;font-size:0.7em;margin-left:0.4rem;">${formaterFCFA(p.prixBarre)}</span>` : ""}</div>
      <p class="desc">${p.description || ""}</p>

      ${p.variantes?.length ? `
      <div class="bloc-select">
        <div class="label"><span>Variante</span></div>
        <div class="tailles" id="variantes">
          ${p.variantes.map((v, i) => `<div class="taille ${i === 0 ? "active" : ""}" data-index="${i}">${v.label}</div>`).join("")}
        </div>
      </div>` : ""}

      <div class="cta-row">
        <button class="btn" id="btn-ajouter">Ajouter au panier</button>
      </div>
      <a class="btn btn-outline" style="margin-top:0.7rem;width:100%;" id="btn-whatsapp" href="#">💬 Commander directement via WhatsApp</a>

      <div class="reassurance-row">
        <span>🚚 Livraison offerte Abidjan</span>
        <span>💵 Paiement à la livraison</span>
      </div>
    </div>
  `;

  document.querySelectorAll(".mini").forEach((m) => {
    m.addEventListener("click", () => {
      document.querySelectorAll(".mini").forEach((x) => x.classList.remove("active"));
      m.classList.add("active");
      document.getElementById("img-principale").src = m.dataset.src;
    });
  });

  document.querySelectorAll("#variantes .taille").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll("#variantes .taille").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      varianteChoisie = p.variantes[t.dataset.index];
    });
  });

  document.getElementById("btn-ajouter").addEventListener("click", () => {
    ajouterAuPanier({
      productId: p.id,
      varianteId: varianteChoisie?.sku || null,
      variante: varianteChoisie?.label || null,
      nom: p.nom,
      prixUnitaire: p.prix,
      quantite: 1,
      image: p.images[0]
    });
    alert("Ajouté au panier !");
  });

  document.getElementById("btn-whatsapp").addEventListener("click", (e) => {
    e.preventDefault();
    ajouterAuPanier({
      productId: p.id,
      varianteId: varianteChoisie?.sku || null,
      variante: varianteChoisie?.label || null,
      nom: p.nom,
      prixUnitaire: p.prix,
      quantite: 1,
      image: p.images[0]
    });
    window.open(lienWhatsApp(), "_blank");
  });
}

chargerProduit();

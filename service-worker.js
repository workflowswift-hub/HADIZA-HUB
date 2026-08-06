const CACHE_NAME = "hadiza-hub-v1";

const FICHIERS_A_METTRE_EN_CACHE = [
  "/index.html",
  "/catalogue.html",
  "/produit.html",
  "/panier.html",
  "/css/style.css",
  "/assets/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FICHIERS_A_METTRE_EN_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(noms.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Stratégie : réseau d'abord, cache en secours (pour rester à jour tout en fonctionnant hors-ligne)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((reponse) => {
        const clone = reponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return reponse;
      })
      .catch(() => caches.match(event.request))
  );
});

# HADIZA HUB — Site + PWA

## 1. Configurer Firebase
1. Va sur console.firebase.google.com → crée un projet
2. Active **Firestore Database** (mode production)
3. Active **Authentication** → méthode "Email/Mot de passe" → crée ton compte admin (ton email + un mot de passe)
4. Dans "Paramètres du projet" → "Vos applications" → ajoute une app Web → copie la config
5. Colle cette config dans `js/firebase-config.js` (remplace les `REMPLACE_MOI`)
6. Dans `js/firebase-config.js`, remplace aussi `WHATSAPP_NUMERO` par ton numéro (format : `225XXXXXXXXX`, sans + ni espace)
7. Dans Firestore → onglet "Règles" → colle le contenu de `firestore.rules` fourni ici, puis publie

## 2. Ajouter tes premiers produits
Une fois connecté sur `/admin`, va dans l'onglet "Produits" et ajoute tes montres/chaînes/bagues avec leurs photos (URL Cloudinary).

## 3. Icônes PWA
Les icônes (`icons/icon-192.png` et `icons/icon-512.png`) ont été générées à partir de ton logo. Tu peux les remplacer si tu veux un rendu différent (fond uni recommandé pour un bon rendu sur écran d'accueil).

## 4. Déploiement (Netlify + GitHub — comme ton autre site)
1. Crée un dépôt GitHub, pousse tout ce dossier dedans
2. Sur Netlify : "New site from Git" → sélectionne le dépôt → déploie (pas de build command nécessaire, c'est un site statique)
3. Une fois en ligne, teste le bouton "Ajouter à l'écran d'accueil" sur mobile pour vérifier que la PWA s'installe bien

## Structure du projet
```
hadiza-hub/
├── index.html          → page d'accueil
├── catalogue.html       → liste des produits (filtrable)
├── produit.html          → fiche produit dynamique (?id=xxx)
├── panier.html            → panier + récap avant WhatsApp
├── manifest.json         → config PWA
├── service-worker.js     → cache hors-ligne
├── firestore.rules       → règles de sécurité à publier sur Firebase
├── css/style.css         → styles communs
├── js/
│   ├── firebase-config.js → clés Firebase + numéro WhatsApp
│   ├── panier.js           → gestion panier + génération lien WhatsApp
│   ├── catalogue.js        → chargement produits Firestore
│   └── produit.js          → chargement d'un produit + variantes
├── admin/
│   ├── index.html    → connexion admin
│   └── dashboard.html → gestion produits/commandes
├── assets/logo.png
└── icons/icon-192.png, icon-512.png
```

## Points à ne pas oublier
- Le stock n'est pas décrémenté automatiquement (commande finalisée sur WhatsApp) — pense à mettre un produit en "Rupture" depuis l'admin quand il n'y a plus de stock
- Pense à valider chaque commande WhatsApp reçue, puis à la reporter côté admin (l'onglet "Commandes" du dashboard est prêt à recevoir cette logique — tu peux me redemander de la brancher si besoin)

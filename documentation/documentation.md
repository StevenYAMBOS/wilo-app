# Documentation

- Créé le : **12/03/2025**
- Mise à jour le : **12/03/2025**
- Par : **Steven YAMBOS**

## Description

Dépôt Front-End de l'application Wilo.

## Technologies utilisées

- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)

## Base de données (Firebase Firestore)

Base de données **Firebase Firestore** :

- Projet Firebase : `wilo-app`
- Mode d'accès : `Cloud Firestore`
- Sécurité : Règles Firestore configurées pour restreindre l'accès selon les rôles.

### Bonnes pratiques

- Les collections sont au **pluriel et en minuscule** (exemple : `user`, `company`).

### Collections

Collections principales et leur structure.

---

### Collection `user`

La collection `user` contient des informations sur les comptes des utilisateurs, leurs rôles et leurs préférences.

```json
{
  "id": "string",
  "Company": "reference", 
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "profilePicture": "string",
  "role": "string",
  "status": "string",
  "invitationToken": "string",
  "lastLogin": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Explication des champs :

- `id` : Identifiant unique de l’utilisateur généré par Firebase Auth.
- `Company` : Référence à la société de l’utilisateur (collection `company`).
- `email` : Adresse email de l’utilisateur.
- `firstName` Prénom de l’utilisateur.
- `lastName` : Nom de l’utilisateur.
- `profilePicture` : URL de l’image de profil.
- `role`  : Rôle de l’utilisateur (`superadmin`, `admin`, `user`).
- `status` : Statut du compte (`active`, `inactive`, `pending`, `suspended`).
- `lastLogin`  : Date et heure de la dernière connexion.
- `createdAt`  : Date de création du compte.
- `updatedAt`  : Dernière mise à jour du compte.

### Collection `company`

Cette collection stocke les informations sur les entreprises utilisant la plateforme.

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "siret": "string",
  "Users": ["reference"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Explication des champs :

- `id` : Identifiant unique du document généré par Firestore.
- `name` : Nom de l’entreprise.  
- `email` : Adresse email de contact de l’entreprise.
- `phone` : Numéro de téléphone de l’entreprise.
- `siret` : Numéro de siret de l’entreprise.
- `Users` : Tableau des références (`reference`) des utilisateurs associés à l’entreprise.
- `createdAt` : Date de création du document.  
- `updatedAt` : Date de dernière mise à jour du document.

## Structure de projet

```shell
.
├── documentation
│   └── documentation.md
├── package.json
├── package-lock.json
├── PROMPT.md
├── README.md
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── hook.ts
│   ├── lib
│   │   ├── components
│   │   │   ├── Calendar.svelte
│   │   │   └── ChatBot.svelte
│   │   ├── firebase.ts
│   │   └── stores.ts
│   └── routes
│       ├── complete-profile
│       │   └── +page.svelte
│       ├── dashboard
│       │   └── +page.svelte
│       ├── layout.svelte
│       ├── login
│       │   └── +page.svelte
│       └── +page.svelte
├── static
│   └── favicon.png
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

❌ SI J'AI LE TEMPS :

- Violet : `#901FE5`
- Border : `#D9DDE1`
- icônes
- variables d'environnement
- Matrices de décisions

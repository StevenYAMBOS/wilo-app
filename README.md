# Wilo App

Dépôt de l'application Wilo.

## Technologies utilisées

- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
- ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

## Organisation du dépôt ⚠️

L'organisation des branches du dépôt est structurée pour faciliter le développement, les tests, et le déploiement en production. Voici les principales branches utilisées :

- **`main`** (vous vous trouvez ici) :
  Point d'entrée du projet, contient tous les documents nécessaires à la compréhension du projet. 
- **`dev`** :  
  La branche principale de développement continu. Elle sert d'environnement bac à sable pour les développeurs où toutes les nouvelles fonctionnalités et corrections de bugs sont intégrées après validation initiale.

- **`pre-prod`** :  
  Cette branche est destinée à présenter les fonctionnalités au client. Une fois que les développements de la branche `dev` sont stabilisés et validés, ils sont fusionnés dans cette branche pour des démonstrations.

- **`prod`** :  
  La branche finale de production qui contient la version stable et prête à être déployée de l'application. Elle est mise à jour uniquement lorsque les changements dans `pre-prod` sont entièrement validés.

- **`<developerName>-dev`** :  
  Chaque développeur dispose de sa propre branche. Ces branches sont fusionnées dans la branche `dev` une fois les développements terminés et validés.

**Bonnes pratiques :**

- Tester les fonctionnalités dans la branche `dev` avant de les intégrer dans `pre-prod`.
- Ne jamais effectuer de développement direct sur les branches `pre-prod` et `prod`.
- Maintenir la branche `prod` uniquement avec du code stable et prêt pour les utilisateurs finaux.

## Lancer le projet

### Installation

```shell
git clone https://github.com/StevenYAMBOS/wilo-app
cd wilo-app
# Une fois dans le projet, basculez sur la branche `dev` pour toute modification :
git checkout dev
```

### Variables d'environnements

Créer un fichier `.env` à la racine du projet (au même niveau que le fichier `package.json`) et ajouter les informations suivantes :

```shell
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
OPENAI_API_KEY=
```

### Lancement

```bash
npm install
npm run dev
```

## Liens utiles

- [Documentation du projet](./documentation/documentation.md)
- [Site internet](https://wilo-app.vercel.app/)

## Auteur

### Steven YAMBOS

<a href="https://github.com/StevenYAMBOS"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" width="30px" alt="" /><a/>
<a href="https://x.com/StevenYambos">
<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" width="30px" alt="X Steven YAMBOS"/>
</a>

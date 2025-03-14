<script lang="ts">
  import { db, getCurrentUser, refreshGoogleToken, userStore, type UserData } from "../../lib/firebase";
  import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import { onMount } from "svelte";

  let user: UserData | null = get(userStore);
  // let user: UserData | null = $userStore;

  $: if (!user) {
    goto("/login");
  }

  let companyName = "";
  let companyEmail = "";
  let companyPhone = "";
  let companySiret = "";

  async function completeProfile() {
    if (!user) return;

    const companyRef = doc(collection(db, "company"));
    await setDoc(companyRef, {
      id: companyRef.id,
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      siret: companySiret,
      Users: [user.id],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userRef = doc(db, "user", user.id);
    await updateDoc(userRef, {
      Company: companyRef.id,
      status: "active",
    });

  //   onMount(async () => {
  //   const user = await getCurrentUser();
  //   userStore.set(user);
  //   await refreshGoogleToken();
  // });



    goto("/dashboard");
  }
</script>

<main class="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-gray-100">
  <!-- Carte du formulaire -->
  <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
    <!-- Logo -->
    <img src="/logo.png" alt="Wilo Logo" class="w-28 mx-auto mb-4" />

    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800">Compléter votre profil</h1>
    <p class="text-gray-600 mt-2">Remplissez les informations de votre entreprise.</p>

    <!-- Formulaire -->
    <form on:submit|preventDefault={completeProfile} class="space-y-4 mt-6 text-left">
      <!-- Nom de l'entreprise -->
      <div>
        <label class="text-gray-700 font-medium">Nom de l'entreprise</label>
        <input
          type="text"
          bind:value={companyName}
          class="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-[#901FE5] focus:border-[#901FE5] outline-none"
          required
        />
      </div>

      <!-- Email de l'entreprise -->
      <div>
        <label class="text-gray-700 font-medium">Email de l'entreprise</label>
        <input
          type="email"
          bind:value={companyEmail}
          class="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-[#901FE5] focus:border-[#901FE5] outline-none"
          required
        />
      </div>

      <!-- Téléphone -->
      <div>
        <label class="text-gray-700 font-medium">Téléphone</label>
        <input
          type="tel"
          bind:value={companyPhone}
          class="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-[#901FE5] focus:border-[#901FE5] outline-none"
          required
        />
      </div>

      <!-- Numéro SIRET -->
      <div>
        <label class="text-gray-700 font-medium">Numéro SIRET</label>
        <input
          type="text"
          bind:value={companySiret}
          class="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-[#901FE5] focus:border-[#901FE5] outline-none"
          required
        />
      </div>

      <!-- Bouton de validation -->
      <button type="submit" class="bg-[#901FE5] text-white px-5 py-3 mt-4 rounded-lg shadow-md w-full hover:bg-[#A4ADFF] transition">
        Valider
      </button>
    </form>

    <!-- Mention -->
    <p class="text-sm text-gray-500 mt-4">
      En continuant, vous acceptez nos <a href="https://www.decathlonpro.fr/conditions-generales-de-vente" class="text-[#901FE5] hover:underline">Conditions</a>.
    </p>
  </div>
</main>
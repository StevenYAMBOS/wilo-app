<script lang="ts">
  import { signInWithGoogle, userStore, type UserData } from "../../lib/firebase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  // let user: UserData | null = $userStore;
  let user: UserData | null = get(userStore);

  // Surveiller le store utilisateur
  $: if (user) {
    if (user.status === "pending") {
      goto("/complete-profile");
    } else {
      goto("/dashboard");
    }
  }

  async function handleGoogleSignIn() {
    const googleUser = await signInWithGoogle();

    if (googleUser) {
      // Forcer la mise à jour du store
      userStore.subscribe((value) => {
        user = value;
        if (user && user.status) {
          if (user.status === "pending") {
            goto("/complete-profile");
          } else {
            goto("/dashboard");
          }
        }
      });
    }
  }
</script>



<main class="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100">
  <!-- Carte de connexion -->
  <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
    <!-- Logo -->
    <img src="/logo.png" alt="Wilo Logo" class="w-28 mx-auto mb-4" />

    <!-- Texte de bienvenue -->
    <h1 class="text-2xl font-bold text-gray-800">Bienvenue sur Wilo</h1>
    <p class="text-gray-600 mt-2">Connectez-vous pour accéder à votre espace.</p>

    <!-- Illustration -->
    <img src="/wilobot.png" alt="Illustration" class="w-24 mx-auto mt-6" />

    <!-- Bouton Google (Image entière cliquable) -->
    <div class="mt-6">
      <img 
        src="/googleButton.svg" 
        alt="Connexion avec Google" 
        class="w-full max-w-[300px] mx-auto cursor-pointer transition hover:opacity-80 active:scale-95" 
        on:click={handleGoogleSignIn}
      />
    </div>

    <!-- Mention -->
    <p class="text-sm text-gray-500 mt-4">
      En continuant, vous acceptez nos <a href="https://www.decathlonpro.fr/conditions-generales-de-vente" class="text-[#901FE5] hover:underline">Conditions</a>.
    </p>
  </div>
</main>

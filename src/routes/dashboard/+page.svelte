<!-- src/routes/dashboard/+page.svelte -->

<script lang="ts">
  import { userStore, logout, type UserData } from "../../lib/firebase";
  import { goto } from "$app/navigation";
  import Calendar from "$lib/components/Calendar.svelte";
  // import { onMount } from "svelte";
  import ChatBot from "$lib/components/ChatBot.svelte";
  import Menu from "$lib/components/Menu.svelte";

  let user: UserData | null = $userStore;

  $: if (!user) {
    goto("/login");
  }

  async function handleLogout() {
    await logout();
    goto("/login");
  }

  // let activityProposal = "Chargement...";

  // async function fetchProposal() {
  //   try {
  //     const response = await fetch("http://localhot:5173/api/fetchEvents");
  //     const data = await response.json();

  //     if (data.proposal) {
  //       activityProposal = data.proposal;
  //     } else {
  //       activityProposal = "Aucune suggestion disponible.";
  //     }
  //   } catch (error) {
  //     activityProposal = "Erreur lors de la récupération des suggestions.";
  //     console.error(error);
  //   }
  // }

  // onMount(fetchProposal);
</script>

<main class="flex flex-col lg:flex-row min-h-screen">
  <!-- Sidebar fixe en desktop, cachée en mobile -->
  <Menu />

  <!-- Contenu principal -->
  <section class="flex flex-col flex-1 lg:ml-64 px-4 lg:px-10 py-6">
    <!-- Header -->
    <header class="bg-white px-4 py-4 border-b-2 border-[#D9DDE1] text-center lg:text-left">
      <h1 class="text-[32px] lg:text-[40px] font-bold text-gray-800">Planning</h1>
    </header>

    <!-- Légende des couleurs -->
    <div class="flex flex-wrap justify-center lg:justify-start items-center space-x-[32px] px-4 py-[16px] border-b-2 border-[#D9DDE1]">
      <div class="flex items-center space-x-2">
        <span class="w-[30px] h-[20px] bg-[#E7E7E7]"></span>
        <span class="text-gray-700 text-sm">Occupé</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="w-[30px] h-[20px] bg-[#09D02A]"></span>
        <span class="text-gray-700 text-sm">Activités planifiées</span>
      </div>
    </div>

    <!-- Planning -->
    <div class="flex-1 m-4 lg:m-10">
      <Calendar />
    </div>
  </section>

  <!-- ChatBot responsive -->
  <ChatBot />
</main>


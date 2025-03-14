<!-- src/lib/components/Menu.svelte -->

<script lang="ts">
  import { userStore, logout, type UserData } from "$lib/firebase";
  import { goto } from "$app/navigation";

  let user: UserData | null = $userStore;
  let showMenu = false;


  async function handleLogout() {
    await logout();
    goto("/login");
  }
</script>

<!-- Menu Burger en mobile -->
<button class="lg:hidden fixed top-4 left-4 z-50 bg-[#901FE5] text-white p-3 rounded-md" on:click={() => (showMenu = !showMenu)}>
  ☰
</button>

<!-- <aside
  class="w-64 bg-[#FFF] text-white flex flex-col items-center py-6 h-screen fixed left-0 top-0 border-r-2 border-[#D9DDE1]"
  
> -->
<aside
 class="{showMenu ? 'translate-x-0' : '-translate-x-full'} fixed lg:translate-x-0 left-0 top-0 w-64
 flex flex-col items-center py-6 h-screen bg-white border-r-2 border-[#D9DDE1] shadow-md transition-transform duration-300 ease-in-out z-50"
  
>
<div class="flex justify-between items-center p-4">
  <img src="/logo.png" height="42" width="200" alt="Wilo Logo" />
  <button class="lg:hidden text-gray-500" on:click={() => (showMenu = false)}>✖</button>
</div>

  <!-- Logo -->
  <!-- <img src="/logo.png" height="42" width="200" alt="Wilo Logo" /> -->

  <!-- Navigation -->
  <nav class="flex flex-col w-full px-4 bg-[#a969ea]">
    <a
      href="/dashboard"
      class="flex items-center py-3 px-4 text-[#FFF] rounded-md bg-[#a969ea]"
    >
      <span class="opaity-100"> 📅 Planning </span>
    </a>
  </nav>

  <!-- Cases à cocher pour les agendas -->
  <div class="w-full px-4 mt-4">
    <label class="flex items-center space-x-2 text-[#0C0511] text-[14px]">
      <input
        type="checkbox"
        checked
        class="form-checkbox text-[#901FE5] h-5 w-5"
      />
      <span>Google - perso</span>
    </label>

    <label class="flex items-center space-x-2 text-[#0C0511] text-[14px] mt-2 mb-[16px]">
      <input
        type="checkbox"
        checked
        class="form-checkbox text-[#901FE5] h-5 w-5"
      />
      <span>Teams - Orange</span>
    </label>
  </div>

  <!-- Titre gris avec icône -->
  <div
    class="w-full px-4 mt-6 flex items-center space-x-2"
  >
    <span class="text-[16px] text-[#4E5D6B]">🚶</span>
    <span class="text-[16px] text-[#4E5D6B]">Activités aux alentours</span>
  </div>

  <!-- Profil utilisateur -->
<div class="w-full px-4 mt-auto flex flex-col pb-6">
  <!-- Informations utilisateur -->
  <div class="flex items-center justify-between w-full pb-4">
    <div  class="flex items-center space-x-3">
      <a on:click={handleLogout}>
      <img
        src="{user?.profilePicture}"
        alt="Profil"
        class="w-10 h-10 rounded-full border border-gray-300"
      />
    </a>
      <span class="text-[#0C0511] text-[16px]">{user?.firstName} {user?.lastName}</span>
    </div>
    <div class="relative">
      <svg class="w-5 h-5 text-[#4E5D6B] cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-9.372-4.872M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2M13 9h.01" />
      </svg>
      <!-- Badge de notification -->
      <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
    </div>
  </div>

  <!-- Bouton Aide -->
  <div class="flex items-center pt-[16px] space-x-2 text-gray-600 cursor-pointer hover:text-gray-900 pb-2">
    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.1-.45 2.1-1.17 2.83-.48.48-.83 1.17-.83 2.17V14M12 19h.01" />
    </svg>
    <span class="text-sm">Aide</span>
  </div>

  <!-- Conditions et confidentialité -->
  <div class="text-[#4E5D6B] pt-[16px] text-sm cursor-pointer hover:text-gray-900">
    Conditions et confidentialité
  </div>
</div>

</aside>

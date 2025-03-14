<!-- src/lib/components/ChatBot.svelte -->

<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { get, writable } from "svelte/store";
  import { userStore, signInWithGoogle } from "$lib/firebase";
  import { eventsStore, type EventData } from "$lib/stores";

  // 🔹 Correction : Typage explicite
  interface Message {
    sender: "bot" | "user";
    text: string;
    action?: "authorize";
  }

  let messages = writable<Message[]>([]); // 🔹 Utilisation de `writable` pour la réactivité
  let showChat: boolean = false;
  let user: any = null;
  // let accessToken: string | null = null;
  let accessToken: string | null = localStorage.getItem("google_access_token");

  let unsubscribe: any;

  onMount(() => {
    unsubscribe = userStore.subscribe((value) => {
      user = value;

      if (user) {
        messages.update((msgs) => [
          ...msgs,
          { sender: "bot", text: `Bonjour ${user.firstName} ! 😊` },
          {
            sender: "bot",
            text: "Souhaitez-vous que j'analyse votre calendrier pour vous proposer des créneaux d'activités ?",
            action: "authorize",
          },
        ]);
      }
    });
  });

  async function authorizeCalendar() {
    let storedEvents = get(eventsStore); // 🔹 Vérifie si on a déjà des événements stockés
    if (storedEvents.length > 0) {
      console.log("✅ Utilisation des événements stockés !");
      await fetchEventsAndSuggest(storedEvents);
      return;
    }

    if (!accessToken) {
      console.log("⚠️ Aucun token stocké, récupération depuis Firebase...");
      return messages.update((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Vous devez d'abord connecter votre calendrier Google. ✅",
        },
      ]);
    }

    messages.update((msgs) => [
      ...msgs,
      { sender: "bot", text: "Merci ! Je récupère vos événements... ⏳" },
    ]);

    try {
      const response = await fetch("/api/fetchEvents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.events) {
        eventsStore.set(data.events); // 🔹 Stocke les événements
        await fetchEventsAndSuggest(data.events);
      }
    } catch (error) {
      console.error("Erreur API fetchEvents :", error);
      messages.update((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Erreur lors de la récupération du calendrier. 😕",
        },
      ]);
    }
  }

  /*
  async function authorizeCalendar() {
    if (!accessToken) {
      console.log("⚠️ Aucun token stocké, récupération depuis Firebase...");
      const googleUser = await signInWithGoogle();
      if (googleUser?.accessToken) {
        accessToken = googleUser.accessToken;
      } else {
        messages.update((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: "Je n'ai pas pu accéder à votre calendrier. 😕",
          },
        ]);
        return;
      }
    }

    messages.update((msgs) => [
      ...msgs,
      { sender: "bot", text: "Merci ! Je récupère vos événements... ⏳" },
    ]);

    await fetchEventsAndSuggest();
  }
  */

  async function fetchEventsAndSuggest(storedEvents: EventData[]) {
    try {
      console.log("Envoi de la requête API avec le token :", accessToken);

      const response = await fetch("/api/fetchEvents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // 🔹 Ajoute ce log pour voir la réponse brute
      const rawText = await response.text();
      console.log("✅ Réponse brute de l'API :", rawText);

      if (!response.ok) {
        throw new Error(`Erreur API ${response.status}: ${rawText}`);
      }

      const data = JSON.parse(rawText); // 🔹 Convertir en JSON
      console.log("✅ Réponse JSON de l'API :", data);

      if (data.proposal && Array.isArray(data.proposal)) {
        for (const activity of data.proposal) {
          messages.update((msgs) => [
            ...msgs,
            { sender: "bot", text: activity },
          ]);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 🔹 Pause d'1 seconde entre chaque message
        }
      } else {
        messages.update((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: "Je n'ai pas trouvé de créneau disponible pour vous. 😕",
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
      messages.update((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Une erreur est survenue lors de l'analyse du calendrier.",
        },
      ]);
    }
  }

  /*
  async function fetchEventsAndSuggest(storedEvents: EventData[]) {
    try {
      console.log("Envoi de la requête API avec le token :", accessToken);

      const response = await fetch("/api/fetchEvents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Erreur API ${response.status}: ${await response.text()}`
        );
      }

      const data = await response.json();
      console.log("✅ Réponse de l'API :", data);

      if (data.proposal && Array.isArray(data.proposal)) {
        for (const activity of data.proposal) {
          messages.update((msgs) => [
            ...msgs,
            { sender: "bot", text: activity },
          ]);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 🔹 Pause d'1 seconde entre chaque message
        }
      } else {
        messages.update((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: "Je n'ai pas trouvé de créneau disponible pour vous. 😕",
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
      messages.update((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Une erreur est survenue lors de l'analyse du calendrier.",
        },
      ]);
    }
  }
  */

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });
</script>

<!-- 🔹 Bouton d'ouverture du chatbot -->
<div
  class="fixed bottom-10 right-10 lg:right-6 cursor-pointer z-50"
  on:click={() => (showChat = !showChat)}
>
  <img
    src="/wilobot.png"
    alt="WiloBot"
    class="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
  />
</div>

<!-- 🔹 Fenêtre du chatbot -->
{#if showChat}
  <div
    class="fixed bottom-20 right-4 lg:right-10 w-[90%] lg:w-96 bg-white shadow-lg rounded-lg overflow-hidden z-50 max-h-[70vh] flex flex-col"
  >
    <!-- 🔹 Header du chatbot -->
    <div
      class="flex justify-between items-center px-4 py-3 shadow-md border-b border-[#D9DDE1]"
    >
      <span class="font-semibold text-lg text-gray-800">Wilo</span>
      <button
        on:click={() => (showChat = false)}
        class="text-gray-500 hover:text-gray-700">✖</button
      >
    </div>

    <!-- 🔹 Messages du chatbot -->
    <div class="p-4 overflow-y-auto flex-1">
      {#each $messages as message}
        <div
          class="p-2 my-2 rounded-lg {message.sender === 'bot'
            ? 'bg-[#A4ADFF] text-[#0C0511] text-[14px]'
            : 'bg-[#901FE5] text-white'}"
        >
          {message.text}
          {#if message.action === "authorize"}
            <button
              class="mt-2 bg-[#901FE5] text-white px-3 py-1 rounded-full hover:opacity-80"
              on:click={authorizeCalendar}
            >
              Autoriser
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

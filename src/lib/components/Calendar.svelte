<!-- src/lib/components/Calendar.svelte -->

<script lang="ts">
  import type { CalendarOptions } from "svelte-fullcalendar";
  import FullCalendar from "svelte-fullcalendar";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import { onMount } from "svelte";
  import { fetchUserEvents } from "../../routes/api/calendar";
  import { eventsStore } from "$lib/stores";
  import { get } from "svelte/store";

  let accessToken = null;
  let events = get(eventsStore) || [];

  let options: CalendarOptions = {
    initialView: "timeGridWeek", // Vue semaine par défaut
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events,
    headerToolbar: {
      left: "prev,today,next",
      center: "title",
      end: "",
    },
    height: "auto",
    slotMinTime: "08:00:00", // Début journée de travail
    slotMaxTime: "18:00:00", // Fin journée de travail
    eventClick: (info) => {
      alert(`Événement: ${info.event.title}\nDate: ${info.event.start}`);
    },
    dayHeaderFormat: { weekday: "short", day: "numeric" }, // "Lun 8"
    locale: "fr", // Français
    allDaySlot: false, // Supprime la ligne "Toute la journée"
    selectable: true, // Permet de sélectionner une plage horaire
    selectMirror: true, // Effet visuel au clic
    nowIndicator: true, // Ligne rouge indiquant l'heure actuelle
    eventBackgroundColor: "#cdf7d4", // Couleur des événements
    eventBorderColor: "transparent", // Bordure des événements
    eventTextColor: "#0C0511", // Texte en blanc
    eventTimeFormat: { hour: "numeric", minute: "2-digit", hour12: false }, // Format 24h
  };

  async function loadEvents() {
    if (events.length > 0) {
      console.log("Utilisation des événements stockés !");
      return; // 🔹 Empêche un nouvel appel si déjà stocké
    }

    try {
      const token = localStorage.getItem("google_access_token");
      if (!token) throw new Error("Pas de token Google trouvé");

      accessToken = token;
      events = await fetchUserEvents(accessToken);
      eventsStore.set(events); // 🔹 Stocke les événements récupérés
      options = { ...options, events };
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
    }
  }

  onMount(loadEvents);
</script>

<!-- Calendrier avec styles adaptés -->
<div class="p-1 lg:p-6 bg-white rounded-md">
  <!-- Ajouter les boutons ici -->
  <div class="flex justify-end items-center mb-4 space-x-4">
    <button class="w-auto h-[48px] flex items-center text-[#901FE5] px-4 py-2 font-semibold hover:text-white hover:bg-[#901FE5]">
      <span class="text-xl mr-2">+</span> Ajouter un agenda
    </button>

    <button class="w-[202px] h-70px] lg:h-[48px] bg-[#901FE5] text-white px-4 py-2 font-semibold hover:bg-white hover:text-[#901FE5]">
      Planifier une activité
    </button>
  </div>

  <FullCalendar {options} />
</div>

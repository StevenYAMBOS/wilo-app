// src/routes/api/fetchEvents.ts

/*
import { fetchUserEvents } from "./calendar";
import type { RequestHandler } from "@sveltejs/kit";
import { generateActivityProposal } from "$lib/openai";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("⚠️ Aucun token reçu !");
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    }

    console.log("✅ Token reçu :", token);

    const events = await fetchUserEvents(token);
    console.log("✅ Événements récupérés :", events);

    const proposal = await generateActivityProposal(events);
    console.log("✅ Proposition générée :", proposal);

    return new Response(JSON.stringify({ events, proposal }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur API fetchEvents :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
*/

/*
export const GET: RequestHandler = async ({ cookies }) => {
  try {
    // Récupérer le token de session depuis les cookies
    const token = cookies.get("session");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non connecté" }),
        { status: 401 }
      );
    }

    // Récupérer les événements de l'utilisateur avec le token d'accès
    const events = await fetchUserEvents(token);

    // Générer une proposition d'activité basée sur les disponibilités
    const proposal = await generateActivityProposal(events);

    return new Response(JSON.stringify({ events, proposal }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur API user-events :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  }
};
*/

// src/hooks.server.ts

// import type { Handle } from "@sveltejs/kit";

import type { Handle } from "@sveltejs/kit";
import { fetchUserEvents } from "./routes/api/calendar"; // Vérifie que ce fichier est bien là
import { generateActivityProposal } from "$lib/openai";

export const handle: Handle = async ({ event, resolve }) => {
  console.log("🌐 Requête reçue :", event.url.pathname);

  // Vérifie si la requête est pour récupérer les événements
  if (event.url.pathname === "/api/fetchEvents") {
    try {
      const token = event.request.headers.get("Authorization")?.replace("Bearer ", "");

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
  }

  return resolve(event);
};



/*
import type { Handle } from "@sveltejs/kit";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, applicationDefault } from "firebase-admin/app";

// Initialiser Firebase Admin si ce n'est pas déjà fait
if (!globalThis._firebaseAdmin) {
  globalThis._firebaseAdmin = initializeApp({
    credential: applicationDefault(),
  });
}

const auth = getAuth();

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("session");

  if (token) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      event.locals.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        accessToken: token,
      };
    } catch (error) {
      console.error("Erreur de vérification du token Firebase :", error);
    }
  }

  return resolve(event);
};
*/
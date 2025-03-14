// src/lib/openai.ts

import { OpenAI } from "openai";
// import { OPENAI_API_KEY } from "$env/static/private";

const openai = new OpenAI({
  apiKey: "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",
});

export async function generateActivityProposal(events: any[], location?: string) {
  const userAvailability = analyzeAvailability(events);

  // 🔹 Vérifier si des créneaux sont disponibles
  if (userAvailability.length === 0) {
    return [
      "Pas de créneau dispo aujourd'hui ! Mais pas de panique, on trouvera un moment bientôt ! 🚀",
    ];
  }

  // 🔹 Limiter les créneaux envoyés à OpenAI (max 3 créneaux)
  const limitedAvailability = userAvailability.slice(0, 3);

  // 🔹 Construire le prompt optimisé
  const prompt = `
  Tu es un assistant bien-être pour les employés en entreprise. Ton ton est amical, détendu et professionnel.
  Voici les créneaux disponibles de l'utilisateur aujourd'hui :
  ${limitedAvailability.map((slot) => `- ${slot.start} à ${slot.end}`).join("\n")}

  Si possible, propose **2 activités physiques courtes (10-15 min max)** adaptées à ces créneaux.
  Si la localisation est connue (${location ? `"${location}"` : "aucune"}), propose des activités proches du lieu.

  Si aucun créneau n'est dispo, rassure l'utilisateur en lui disant qu'on trouvera un moment bientôt. 🚀

  Réponds sous forme de liste numérotée, sans introduction ni conclusion.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 50, // 🔹 Limite le coût
      temperature: 0.7, // 🔹 Réduit la variabilité des réponses
    });

    const aiResponse = response.choices[0]?.message?.content || "";

    // 🔹 Séparer la réponse en plusieurs messages et limiter à 2 suggestions
    const activityMessages = aiResponse
      .split("\n")
      .filter((line) => line.trim() !== "")
      .slice(0, 2); // 🔹 Max 2 activités

    return activityMessages.length > 0 ? activityMessages : ["Je n'ai pas pu générer de suggestion."];
  } catch (error) {
    console.error("Erreur OpenAI :", error);
    return ["Erreur lors de la génération des suggestions."];
  }
}

// 🔹 Fonction pour analyser les disponibilités
function analyzeAvailability(events: any[]) {
  // Trier les événements par date
  events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  let availability: { start: string; end: string }[] = [];
  let lastEnd = "08:00"; // Début de la journée de travail

  events.forEach((event) => {
    const eventStart = event.start.slice(11, 16);
    const eventEnd = event.end.slice(11, 16);

    if (eventStart > lastEnd) {
      availability.push({ start: lastEnd, end: eventStart });
    }

    lastEnd = eventEnd;
  });

  if (lastEnd < "18:00") {
    availability.push({ start: lastEnd, end: "18:00" });
  }

  return availability;
}

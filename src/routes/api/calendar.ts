// src/routes/api/calendar.ts

export async function fetchUserEvents(accessToken: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!data.items) return [];

    return data.items.map((event: any) => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location || "",
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    return [];
  }
}

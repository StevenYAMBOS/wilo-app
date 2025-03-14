import { writable } from "svelte/store";

export interface EventData {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
}

export const eventsStore = writable<EventData[]>([]);

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// declare global {
// 	namespace App {
// 		// interface Error {}
// 		// interface Locals {}
// 		// interface PageData {}
// 		// interface PageState {}
// 		// interface Platform {}
// 	}
// }

// src/app.d.ts

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      profilePicture: string;
    };
  }
}

export {};

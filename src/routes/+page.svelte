<!-- src/routes/+page.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Rediriger immédiatement dès le chargement de la page
  onMount(() => {
    goto("/login");
  });
</script>


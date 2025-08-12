<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  onMount(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1YHMVNG24L';
    document.head.appendChild(script);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'G-1YHMVNG24L');

    // Make gtag available globally
    window.gtag = gtag;
  });

  // Track page views on route changes
  $: if ($page.url.pathname) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: $page.url.pathname
      });
    }
  }
</script>

<svelte:head>
  <script>
    window.dataLayer = window.dataLayer || [];
  </script>
</svelte:head>

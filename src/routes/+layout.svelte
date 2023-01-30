<script lang="ts">
	import './app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<QueryClientProvider client={data.queryClient}>
	<div class="container mx-auto flex justify-center flex-col items-center py-4">
		<slot />
	</div>
</QueryClientProvider>

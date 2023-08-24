<script lang="ts">
	import './app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import Footer from '../components/Footer.svelte';

	export let data: PageData;
</script>

<QueryClientProvider client={data.queryClient}>
	<div class="grid page">
		<main class="container mx-auto flex justify-center flex-col items-center h-full">
			<slot />
		</main>
		<Footer />
	</div>
</QueryClientProvider>

<style>
	.page {
		--footer-height: 52px;
		--main-height: 100vh;
		--main-height: 100dvh;
		@apply h-screen h-[100dvh];
		grid-template-rows: calc(var(--main-height) - var(--footer-height)) var(--footer-height);
		grid-template-rows: calc(var(--main-height) - var(--footer-height)) var(--footer-height);
	}
</style>

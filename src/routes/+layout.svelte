<script lang="ts">
	import './app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	import type { PageData } from './$types';
	import Footer from '../components/Footer.svelte';
	import ViewTransition from './ViewTransition.svelte';

	const { data, children } = $props<{ data: PageData }>();
</script>

<QueryClientProvider client={data.queryClient}>
	<ViewTransition />
	<div class="page grid">
		<main
			class="container mx-auto flex h-full flex-col items-center justify-center"
		>
			{@render children()}
		</main>
		<Footer />
	</div>
</QueryClientProvider>

<style>
	.page {
		--footer-height: calc(env(safe-area-inset-bottom, 20px) + 52px);
		--main-height: 100vh;
		--main-height: 100dvh;
		height: 100vh;
		height: 100dvh;
		grid-template-rows: calc(var(--main-height) - var(--footer-height)) var(
				--footer-height
			);
		grid-template-rows: calc(var(--main-height) - var(--footer-height)) var(
				--footer-height
			);
	}
</style>

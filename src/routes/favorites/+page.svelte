<script lang="ts">
	import { favorites } from '$lib/favoritesStore';

	import Stop from '../[companyId]/route/[route]/stop.svelte';

	let filterString = '';

	$: stops = $favorites.stops.filter((stop) =>
		stop.routeId.toLowerCase().startsWith(filterString.toLocaleUpperCase())
	);
</script>

<svelte:head>
	<title>Favorites | Bus ETA</title>
</svelte:head>

<div class="py-4 grid grid-flow-cols routes-filter-grid gap-4 h-full w-full px-4 max-w-md">
	<input
		type="text"
		placeholder="輸入路線"
		bind:value={filterString}
		class="border-b p-4 bg-vesuvius-700 text-white placeholder:text-white text-center rounded-xl min-w-[200px]"
	/>

	<div class="w-full min-h-0">
		<ul class="overflow-auto h-full no-scroll-bar">
			{#each stops as stop}
				<li class="mb-4">
					<Stop
						stopId={stop.stopId}
						companyId={stop.companyId}
						route={stop.routeId}
						showRouteNumber
					/>
				</li>
			{/each}
		</ul>
	</div>
</div>

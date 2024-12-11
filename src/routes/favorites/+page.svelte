<script lang="ts">
	import { favorites } from '$lib/favoritesStore';

	import Stop from '../[companyId]/route/[route]/stop.svelte';

	let filterString = $state('');

	const stops = $derived(
		$favorites.stops.filter((stop) =>
			stop.routeId.toLowerCase().startsWith(filterString.toLocaleUpperCase())
		)
	);
</script>

<svelte:head>
	<title>Favorites | Bus ETA</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<input
		type="text"
		placeholder="輸入路線"
		bind:value={filterString}
		class="min-w-[200px] rounded-xl border-b bg-vesuvius-700 p-4 text-center text-white placeholder:text-white"
	/>

	<div class="min-h-0 w-full">
		<ul class="no-scroll-bar h-full overflow-auto">
			{#each stops as stop}
				<li class="mb-4">
					<Stop
						stopId={stop.stopId}
						companyId={stop.companyId}
						route={stop.routeId}
						direction={stop.direction}
						showRouteNumber
					/>
				</li>
			{/each}
		</ul>
	</div>
</div>

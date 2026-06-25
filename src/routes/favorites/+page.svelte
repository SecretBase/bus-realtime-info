<script lang="ts">
	import FavoriteCard from '$lib/components/FavoriteCard.svelte';
	import { favorites } from '$lib/stores/favorites';
	import type { Direction } from '$lib/api/ctb/types';

	let filterString = $state('');

	const stops = $derived(
		$favorites.stops.filter((stop) =>
			stop.routeId.toLowerCase().startsWith(filterString.toLowerCase())
		)
	);

	function removeFavorite(stop: (typeof $favorites.stops)[number]) {
		favorites.update((current) => ({
			...current,
			stops: current.stops.filter(
				(favorite) =>
					!(
						favorite.companyId === stop.companyId &&
						favorite.routeId === stop.routeId &&
						favorite.stopId === stop.stopId
					)
			)
		}));
	}
</script>

<svelte:head>
	<title>收藏 | Bus ETA</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<input
		type="text"
		placeholder="輸入路線"
		bind:value={filterString}
		class="bg-vesuvius-700 min-w-[200px] rounded-xl border-b p-4 text-center text-white placeholder:text-white"
	/>

	<div class="no-scroll-bar min-h-0 w-full overflow-y-auto">
		{#if $favorites.stops.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">尚未加入收藏</p>
				<a
					href="/"
					class="text-vesuvius-700 mt-4 inline-block text-sm underline"
				>
					瀏覽路線
				</a>
			</div>
		{:else if stops.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">沒有符合的路線</p>
			</div>
		{:else}
			<ul class="flex flex-col gap-3">
				{#each stops as stop (stop.companyId + stop.routeId + stop.stopId)}
					<li>
						<FavoriteCard
							stopId={stop.stopId}
							companyId={stop.companyId}
							route={stop.routeId}
							direction={stop.direction as Direction}
							onRemove={() => removeFavorite(stop)}
						/>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

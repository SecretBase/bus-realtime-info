<script lang="ts">
	import FavoriteCard from '$lib/components/FavoriteCard.svelte';
	import MtrFavoriteCard from '$lib/components/MtrFavoriteCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import {
		favorites,
		favoriteSortMode,
		resolveFavoriteSortMode,
		type FavoriteSortMode
	} from '$lib/stores/favorites';
	import type { Direction } from '$lib/api/ctb/types';
	import { getMtrLineName, getMtrStationName } from '$lib/api/mtr/data';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { sortFavorites } from '$lib/utils/route-sort';

	let filterString = $state('');

	const sortMode = $derived(resolveFavoriteSortMode($favoriteSortMode));

	const stops = $derived.by(() => {
		const query = filterString.trim().toLowerCase();
		const filtered = $favorites.stops.filter((stop) => {
			if (!query) return true;
			if (stop.routeId.toLowerCase().startsWith(query)) return true;
			if (stop.companyId !== 'MTR') return false;
			return (
				getMtrStationName(stop.stopId).toLowerCase().includes(query) ||
				getMtrLineName(stop.routeId).toLowerCase().includes(query)
			);
		});
		return sortFavorites(filtered, sortMode);
	});

	function setSortMode(mode: FavoriteSortMode) {
		favoriteSortMode.set(mode);
	}

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
	<title>{m.page_title_favorites()}</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<div class="grid w-full gap-2">
		<input
			type="text"
			placeholder={m.route_filter_placeholder()}
			bind:value={filterString}
			class="bg-vesuvius-700 min-w-[200px] rounded-xl border-b p-4 text-center text-white placeholder:text-white"
		/>
		{#if $favorites.stops.length > 0}
			<div
				class="grid w-full auto-cols-fr grid-flow-col gap-2"
				role="group"
				aria-label={m.sort_favorites_label()}
			>
				<Button
					type="button"
					class="px-4 py-3"
					variant={sortMode === 'recent' ? 'primary' : 'secondary'}
					aria-pressed={sortMode === 'recent'}
					onclick={() => setSortMode('recent')}>{m.sort_recent()}</Button
				>
				<Button
					type="button"
					class="px-4 py-3"
					variant={sortMode === 'route' ? 'primary' : 'secondary'}
					aria-pressed={sortMode === 'route'}
					onclick={() => setSortMode('route')}>{m.sort_route()}</Button
				>
			</div>
		{/if}
	</div>

	<div class="no-scroll-bar min-h-0 w-full overflow-y-auto">
		{#if $favorites.stops.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">{m.favorites_empty()}</p>
				<a
					href={localizeHref('/')}
					class="text-vesuvius-700 mt-4 inline-block text-sm underline"
				>
					{m.browse_routes()}
				</a>
			</div>
		{:else if stops.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">{m.no_matching_routes()}</p>
			</div>
		{:else}
			<ul class="flex flex-col gap-3">
				{#each stops as stop (stop.companyId + stop.routeId + stop.stopId)}
					<li>
						{#if stop.companyId === 'MTR'}
							<MtrFavoriteCard
								line={stop.routeId}
								station={stop.stopId}
								onRemove={() => removeFavorite(stop)}
							/>
						{:else}
							<FavoriteCard
								stopId={stop.stopId}
								companyId={stop.companyId}
								route={stop.routeId}
								direction={stop.direction as Direction}
								onRemove={() => removeFavorite(stop)}
							/>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

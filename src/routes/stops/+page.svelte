<script lang="ts">
	import { getStops } from '$lib/api/kmb';
	import Button from '$lib/components/Button.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const NEARBY_DISTANCE_OPTIONS = [100, 200, 400] as const;

	let activeTab = $state<'search' | 'nearby'>('search');
	let searchFilter = $state('');
	let nearbyMaxDistance = $state<(typeof NEARBY_DISTANCE_OPTIONS)[number]>(200);
	let nearbyStops = $state<
		{ stop: string; name_tc: string; distanceMeters: number }[]
	>([]);
	let nearbyState = $state<
		'idle' | 'loading' | 'denied' | 'unavailable' | 'ready'
	>('idle');

	const stopsQuery = createQuery({
		staleTime: Infinity,
		queryKey: ['kmb-stops'],
		queryFn: () => getStops()
	});

	const allStops = $derived($stopsQuery.data?.data ?? []);

	const searchResults = $derived(
		allStops
			.filter((stop) => {
				const query = searchFilter.trim().toLowerCase();
				if (!query) return false;
				return (
					stop.name_tc.includes(searchFilter.trim()) ||
					stop.stop.toLowerCase().includes(query)
				);
			})
			.slice(0, 50)
	);

	const filteredNearbyStops = $derived(
		nearbyStops
			.filter((stop) => stop.distanceMeters <= nearbyMaxDistance)
			.slice(0, 20)
	);

	function findNearbyStops() {
		if (!navigator?.geolocation || !allStops.length) {
			nearbyState = 'unavailable';
			return;
		}

		nearbyState = 'loading';

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				nearbyStops = allStops
					.map((stop) => ({
						stop: stop.stop,
						name_tc: stop.name_tc,
						distanceMeters: Math.hypot(
							(stop.lat - latitude) * 111_320,
							(stop.long - longitude) * 85_000
						)
					}))
					.sort((a, b) => a.distanceMeters - b.distanceMeters);
				nearbyState = 'ready';
			},
			(error) => {
				nearbyState =
					error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable';
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}
</script>

<svelte:head>
	<title>搜尋站點 | Bus ETA</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<div class="grid w-full gap-2">
		<div class="grid w-full auto-cols-fr grid-flow-col gap-2">
			<Button
				type="button"
				class="px-4 py-3"
				variant={activeTab === 'search' ? 'primary' : 'secondary'}
				onclick={() => {
					activeTab = 'search';
				}}>搜尋</Button
			>
			<Button
				type="button"
				class="px-4 py-3"
				variant={activeTab === 'nearby' ? 'primary' : 'secondary'}
				onclick={() => {
					activeTab = 'nearby';
					if (nearbyState === 'idle') findNearbyStops();
				}}>附近</Button
			>
		</div>

		{#if activeTab === 'search'}
			<input
				type="text"
				placeholder="輸入站名"
				bind:value={searchFilter}
				class="bg-vesuvius-700 w-full rounded-xl border-b p-4 text-center text-white placeholder:text-white"
			/>
		{:else}
			<div class="grid w-full auto-cols-fr grid-flow-col gap-2">
				{#each NEARBY_DISTANCE_OPTIONS as distance}
					<Button
						type="button"
						class="px-2 py-2 text-sm"
						variant={nearbyMaxDistance === distance ? 'primary' : 'secondary'}
						onclick={() => {
							nearbyMaxDistance = distance;
						}}>{distance}米</Button
					>
				{/each}
			</div>
		{/if}
	</div>

	<div class="no-scroll-bar h-full min-h-0 overflow-y-auto">
		{#if $stopsQuery.isLoading}
			<LoadingSkeleton />
		{:else if $stopsQuery.isError}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">無法載入站點，請稍後再試</p>
				<Button
					type="button"
					variant="primary"
					class="mt-4 px-6 py-3"
					onclick={() => $stopsQuery.refetch()}>重試</Button
				>
			</div>
		{:else if activeTab === 'search'}
			{#if !searchFilter.trim()}
				<div class="rounded-xl bg-white p-6 text-center shadow-md">
					<p class="text-vesuvius-900">輸入站名開始搜尋</p>
				</div>
			{:else if searchResults.length === 0}
				<div class="rounded-xl bg-white p-6 text-center shadow-md">
					<p class="text-vesuvius-900">沒有符合的站點</p>
				</div>
			{:else}
				<ul class="grid gap-3">
					{#each searchResults as stop}
						<li>
							<a
								href="/stops/{stop.stop}"
								class="block rounded-xl bg-white p-4 shadow-md hover:shadow-lg"
							>
								<span class="text-vesuvius-900 font-medium">{stop.name_tc}</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{:else if !navigator?.geolocation}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">此裝置不支援定位</p>
			</div>
		{:else if nearbyState === 'loading'}
			<LoadingSkeleton />
		{:else if nearbyState === 'denied'}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">無法取得位置，請檢查瀏覽器權限</p>
				<Button
					type="button"
					variant="primary"
					class="mt-4 px-6 py-3"
					onclick={findNearbyStops}>重試</Button
				>
			</div>
		{:else if nearbyState === 'unavailable'}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">無法取得位置，請稍後再試</p>
				<Button
					type="button"
					variant="primary"
					class="mt-4 px-6 py-3"
					onclick={findNearbyStops}>重試</Button
				>
			</div>
		{:else if nearbyStops.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">附近沒有站點</p>
			</div>
		{:else if filteredNearbyStops.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">{nearbyMaxDistance}米內沒有站點</p>
			</div>
		{:else}
			<ul class="grid gap-3">
				{#each filteredNearbyStops as stop}
					<li>
						<a
							href="/stops/{stop.stop}"
							class="flex items-center justify-between rounded-xl bg-white p-4 shadow-md hover:shadow-lg"
						>
							<span class="text-vesuvius-900 font-medium">{stop.name_tc}</span>
							<span class="text-vesuvius-700 text-sm"
								>{Math.round(stop.distanceMeters)} 米</span
							>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

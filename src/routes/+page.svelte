<script lang="ts">
	import { getRoutes, getRoutesQueryKey } from '$lib/api/ctb';
	import { getRoutes as getKMBRoutes } from '$lib/api/kmb';
	import CompanyBadge from '$lib/components/CompanyBadge.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { createVirtualizer } from '@tanstack/svelte-virtual';

	const ctbQuery = createQuery({
		staleTime: Infinity,
		queryKey: getRoutesQueryKey({ companyId: 'CTB' }),
		queryFn: () =>
			getRoutes({
				companyId: 'CTB'
			})
	});

	const kmbQuery = createQuery({
		staleTime: Infinity,
		queryKey: ['kmb-routes'],
		queryFn: () => getKMBRoutes()
	});

	let routeFilter = $state('');

	const ctbRoutes = $derived($ctbQuery.data?.data ?? []);
	const kmbRoutes = $derived(
		$kmbQuery.data?.data
			.filter((i) => i.bound === 'I')
			.map((i) => ({ ...i, co: 'KMB' })) ?? []
	);

	const routes = $derived(
		[...kmbRoutes, ...ctbRoutes].filter((route) =>
			route.route.toLowerCase().includes(routeFilter.toLowerCase())
		)
	);

	let scrollElement = $state<HTMLDivElement | null>(null);
	let virtualizer = $derived.by(() => {
		if (!scrollElement) return null;
		return createVirtualizer<HTMLDivElement, Element>({
			getScrollElement: () => scrollElement,
			count: routes.length,
			estimateSize: () => 56,
			gap: 16,
			overscan: 5
		});
	});

	const isLoading = $derived($ctbQuery.isLoading || $kmbQuery.isLoading);
	const hasData = $derived(
		($ctbQuery.data?.data && $ctbQuery.data.data.length > 0) ||
		($kmbQuery.data?.data && $kmbQuery.data.data.length > 0)
	);

</script>

<svelte:head>
	<title>Bus ETA</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<input
		type="text"
		placeholder="輸入路線"
		bind:value={routeFilter}
		class="min-w-[200px] rounded-xl border-b bg-vesuvius-700 p-4 text-center text-white placeholder:text-white"
	/>
	<div
		class="min-h-0 h-full overflow-y-auto no-scroll-bar"
		bind:this={scrollElement}
	>
		{#if isLoading && !hasData}
			<LoadingSkeleton />
		{:else if routes.length > 0 && $virtualizer}
			<div
				style="height: {$virtualizer.getTotalSize()}px; width: 100%; position: relative;"
			>
				{#each $virtualizer.getVirtualItems() as virtualItem (virtualItem.key)}
				{@const item = routes[virtualItem.index]}
				<div
					style="position: absolute; top: {virtualItem.start}px; left: 0; width: 100%; height: {virtualItem.size}px;"
				>
					<div
						class="border-px mb-4 min-w-[200px] rounded-xl bg-white shadow-md hover:shadow-lg"
						style:--tag={`header-${item.co}-${item.route}`}
					>
						<a
							class="flex items-center gap-2 p-4"
							href={`/${item.co}/route/${item.route}`}
							data-sveltekit-preload-data="hover"
						>
							<CompanyBadge companyId={item.co as 'CTB' | 'KMB' | 'NWFB'} route={item.route} />
							<span
								class="flex-1 text-center"
								style:--tag={`route-${item.route}`}>{item.route}</span
							>
						</a>
					</div>
				</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

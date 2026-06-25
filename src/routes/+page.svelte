<script lang="ts">
	import { getRoutes, getRoutesQueryKey } from '$lib/api/ctb';
	import { getRoutes as getKMBRoutes } from '$lib/api/kmb';
	import type { OperatorId, Route as CTBRoute } from '$lib/api/ctb/types';
	import type { Route as KMBRoute } from '$lib/api/kmb/types';
	import CompanyBadge from '$lib/components/CompanyBadge.svelte';
	import Button from '$lib/components/Button.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { createVirtualizer } from '@tanstack/svelte-virtual';

	type RouteListItem = {
		co: OperatorId;
		route: string;
		inboundDest: string;
		outboundDest: string;
	};

	function toRouteListItem(
		route: (CTBRoute | KMBRoute) & { co: OperatorId }
	): RouteListItem {
		if (route.co === 'KMB') {
			return {
				co: 'KMB',
				route: route.route,
				inboundDest: route.dest_tc,
				outboundDest: route.orig_tc
			};
		}

		return {
			co: route.co,
			route: route.route,
			inboundDest: route.orig_tc,
			outboundDest: route.dest_tc
		};
	}

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
			.map((i) => ({ ...i, co: 'KMB' as const })) ?? []
	);

	const routes = $derived(
		[...kmbRoutes, ...ctbRoutes]
			.map(toRouteListItem)
			.filter((route) => {
				const query = routeFilter.toLowerCase();
				return (
					route.route.toLowerCase().includes(query) ||
					route.inboundDest.toLowerCase().includes(query) ||
					route.outboundDest.toLowerCase().includes(query)
				);
			})
	);

	let scrollElement = $state<HTMLDivElement | null>(null);
	let virtualizer = $derived.by(() => {
		if (!scrollElement) return null;
		return createVirtualizer<HTMLDivElement, Element>({
			getScrollElement: () => scrollElement,
			count: routes.length,
			estimateSize: () => 72,
			gap: 16,
			overscan: 5
		});
	});

	const isLoading = $derived($ctbQuery.isLoading || $kmbQuery.isLoading);
	const hasError = $derived($ctbQuery.isError || $kmbQuery.isError);
	const hasData = $derived(
		($ctbQuery.data?.data && $ctbQuery.data.data.length > 0) ||
			($kmbQuery.data?.data && $kmbQuery.data.data.length > 0)
	);

	function retry() {
		if ($ctbQuery.isError) $ctbQuery.refetch();
		if ($kmbQuery.isError) $kmbQuery.refetch();
	}

</script>

<svelte:head>
	<title>Bus ETA</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<input
		type="text"
		placeholder="輸入路線或目的地"
		bind:value={routeFilter}
		class="bg-vesuvius-700 min-w-[200px] rounded-xl border-b p-4 text-center text-white placeholder:text-white"
	/>
	<div
		class="no-scroll-bar h-full min-h-0 overflow-y-auto"
		bind:this={scrollElement}
	>
		{#if isLoading && !hasData}
			<LoadingSkeleton />
		{:else if hasError}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">無法載入路線，請稍後再試</p>
				<Button
					type="button"
					variant="primary"
					class="mt-4 px-6 py-3"
					onclick={retry}>重試</Button
				>
			</div>
		{:else if routes.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">沒有符合的路線</p>
			</div>
		{:else if $virtualizer}
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
								class="flex items-center gap-3 p-4"
								href={`/${item.co}/route/${item.route}`}
								data-sveltekit-preload-data="hover"
							>
								<CompanyBadge companyId={item.co as OperatorId} />
								<div class="min-w-0 flex-1">
									<div
										class="text-vesuvius-900 font-bold"
										style:--tag={`route-${item.route}`}
									>
										{item.route}
									</div>
									<div class="text-vesuvius-700 truncate text-sm">
										往 {item.inboundDest} ↔ {item.outboundDest}
									</div>
								</div>
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import { getRoutes, getRoutesQueryKey } from '$lib/api/ctb';
	import { getRoutes as getKMBRoutes } from '$lib/api/kmb';
	// @ts-ignore
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { createQuery } from '@tanstack/svelte-query';
	import CompanyBadge from '../components/companyBadge.svelte';
	import LoadingSkeleton from '../components/LoadingSkeleton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { type Route } from '$lib/api/ctb/types';

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

	let routeListContainer: HTMLDivElement;
	let containerHeight = $state(0);
	let resizeObserver: ResizeObserver;
	onMount(() => {
		if (!browser) return;

		containerHeight = routeListContainer.clientHeight;

		resizeObserver = new ResizeObserver((entries) => {
			containerHeight = routeListContainer.clientHeight;
		});

		resizeObserver.observe(routeListContainer);
	});

	onDestroy(() => {
		if (!browser) return;
		resizeObserver?.disconnect();
	});
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
	<div class="min-h-0" bind:this={routeListContainer}>
		{#if $ctbQuery.isLoading}
			<LoadingSkeleton />
		{:else}
			<VirtualList
				items={routes}
				itemHeight={56}
				height={`${containerHeight}px`}
			>
				{#snippet children({ item }: { item: Route })}
					<div
						class="border-px mb-4 min-w-[200px] rounded-xl bg-white shadow-md hover:shadow-lg"
						style:--tag={`header-${item.co}-${item.route}`}
					>
						<a
							class="flex items-center gap-2 p-4"
							href={`/${item.co}/route/${item.route}`}
							data-sveltekit-preload-data="hover"
						>
							<CompanyBadge companyId={item.co} route={item.route} />
							<span
								class="flex-1 text-center"
								style:--tag={`route-${item.route}`}>{item.route}</span
							>
						</a>
					</div>
				{/snippet}
			</VirtualList>
		{/if}
	</div>
</div>

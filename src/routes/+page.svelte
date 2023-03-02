<script lang="ts">
	import { getRoutes, getRoutesQueryKey } from '$lib/api/routes';
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { createQuery } from '@tanstack/svelte-query';
	import CompanyBadge from '../components/companyBadge.svelte';
	import LoadingSkeleton from '../components/LoadingSkeleton.svelte';

	const ctbQuery = createQuery({
		staleTime: Infinity,
		queryKey: getRoutesQueryKey({ companyId: 'CTB' }),
		queryFn: () =>
			getRoutes({
				companyId: 'CTB'
			})
	});

	const nwfbQuery = createQuery({
		staleTime: Infinity,
		queryKey: getRoutesQueryKey({ companyId: 'NWFB' }),
		queryFn: () =>
			getRoutes({
				companyId: 'NWFB'
			})
	});

	let routeFilter = '';

	$: ctbRoutes = $ctbQuery.data?.data ?? [];
	$: nwfbRoutes = $nwfbQuery.data?.data ?? [];
	$: routes = [...ctbRoutes, ...nwfbRoutes].filter((route) => route.route.startsWith(routeFilter));
</script>

<svelte:head>
	<title>Bus ETA</title>
</svelte:head>

<div
	class="py-4 grid grid-flow-cols routes-filter-grid gap-4 h-screen h-[100dvh] w-full px-4 max-w-xs"
>
	<input
		type="text"
		placeholder="輸入路線"
		bind:value={routeFilter}
		class="border-b p-4 bg-vesuvius-700 text-white placeholder:text-white text-center rounded-xl min-w-[200px]"
	/>
	<div class="min-h-0">
		{#if $ctbQuery.isLoading || $nwfbQuery.isLoading}
			<LoadingSkeleton />
		{:else}
			<VirtualList items={routes} let:item itemHeight={56}>
				<div class="bg-white border-px shadow-md rounded-xl hover:shadow-lg min-w-[200px] mb-4">
					<a
						class="flex items-center p-4 gap-2"
						href={`/${item.co}/route/${item.route}`}
						data-sveltekit-preload-data="hover"
					>
						<CompanyBadge companyId={item.co} />
						<span class="flex-1 text-center">{item.route}</span>
					</a>
				</div>
			</VirtualList>
		{/if}
	</div>
</div>

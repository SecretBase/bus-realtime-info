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

	let routeFilter = '';

	$: ctbRoutes = $ctbQuery.data?.data ?? [];

	$: routes = ctbRoutes.filter((route) => route.route.startsWith(routeFilter));
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
	<div class="min-h-0">
		{#if $ctbQuery.isLoading}
			<LoadingSkeleton />
		{:else}
			<VirtualList items={routes} let:item itemHeight={56}>
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
						<span class="flex-1 text-center" style:--tag={`route-${item.route}`}
							>{item.route}</span
						>
					</a>
				</div>
			</VirtualList>
		{/if}
	</div>
</div>

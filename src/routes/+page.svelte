<script lang="ts">
	import { getRoutes, getRoutesQueryKey } from '$lib/api/routes';
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

<div class="py-4 grid grid-flow-cols routes-filter-grid gap-4 h-screen">
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
			<ul class="grid gap-4 h-full overflow-auto no-scroll-bar snap-y routes-list-grid">
				{#each routes as route}
					<li
						class="snap-start bg-white border-px shadow-md rounded-xl hover:shadow-lg min-w-[200px]"
					>
						<a
							class="flex items-center p-4 gap-2"
							href={`/${route.co}/${route.route}`}
							data-sveltekit-preload-data="hover"
						>
							<CompanyBadge companyId={route.co} />
							<span class="flex-1 text-center">{route.route}</span>
						</a>
					</li>
				{:else}
					沒有路線
				{/each}
			</ul>
		{/if}
	</div>
</div>

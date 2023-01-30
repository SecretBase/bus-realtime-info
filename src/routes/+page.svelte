<script lang="ts">
	import { getRoutes, getRoutesQueryKey } from '$lib/api/routes';
	import { createQuery } from '@tanstack/svelte-query';
	import CompanyBadge from '../components/companyBadge.svelte';

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

<input
	type="text"
	placeholder="Enter route number"
	bind:value={routeFilter}
	class="border-b p-4 mb-4 bg-vesuvius-700 text-white placeholder:text-white text-center rounded-xl min-w-[200px]"
/>
<ul>
	{#each routes as route}
		<li class="mb-3 bg-white border-px shadow-md rounded-xl hover:shadow-lg min-w-[200px]">
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
		No routes
	{/each}
</ul>

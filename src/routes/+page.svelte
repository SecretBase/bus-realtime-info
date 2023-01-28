<script lang="ts">
	import { getRoutes, getRoutesQueryKey } from '$lib/api/routes';
	import type { CompanyId } from '$lib/api/types';
	import { createQuery } from '@tanstack/svelte-query';

	let companyId: CompanyId | undefined = undefined;

	$: ctbRouteQuery = createQuery({
		staleTime: Infinity,
		enabled: Boolean(companyId),
		queryKey: getRoutesQueryKey({ companyId }),
		queryFn: () =>
			getRoutes({
				companyId
			})
	});

	let routeFilter = '';
	$: routes =
		$ctbRouteQuery.data?.data.filter((route) =>
			route.route.toLowerCase().startsWith(routeFilter.toLowerCase())
		) ?? [];
</script>

<button
	type="button"
	on:click={() => {
		companyId = 'CTB';
	}}>城巴</button
>
<button
	type="button"
	on:click={() => {
		companyId = 'NWFB';
	}}>新巴</button
>

<input type="text" placeholder="Enter route number" bind:value={routeFilter} />

{#if !companyId}
	<div>Please select company</div>
{:else if $ctbRouteQuery.isLoading}
	<h1>Loading</h1>
{:else if $ctbRouteQuery.isError}
	<h1>Error</h1>
{:else if $ctbRouteQuery.isSuccess}
	<ul>
		{#each routes as route}
			<li>
				{companyId === 'CTB' ? '城巴' : companyId === 'NWFB' ? '新巴' : ''}
				<a href={`/${route.co}/${route.route}`} data-sveltekit-preload-data="hover">{route.route}</a
				>
			</li>
		{/each}
	</ul>
{/if}

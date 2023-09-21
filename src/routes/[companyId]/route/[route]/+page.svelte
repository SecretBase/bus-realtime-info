<script lang="ts">
	import { page } from '$app/stores';
	import { getRoute, getRoutesQueryKey } from '$lib/api/routes';
	import { getRouteStop, getRouteStopQueryKey } from '$lib/api/routeStop';
	import type { CompanyId, Direction } from '$lib/api/types';
	import { createQuery } from '@tanstack/svelte-query';
	import LoadingSpinner from '../../../../components/LoadingSpinner.svelte';
	import Button from '../../../../components/Button.svelte';
	import Stop from './stop.svelte';
	import LoadingSkeleton from '../../../../components/LoadingSkeleton.svelte';
	import RouteHeader from '../../../../components/RouteHeader.svelte';

	let direction: Direction = 'inbound';

	$: companyId = $page.params.companyId as CompanyId;
	$: route = $page.params.route;

	$: routeQuery = createQuery({
		queryKey: getRoutesQueryKey({
			companyId,
			route
		}),
		queryFn: () =>
			getRoute({
				companyId,
				route
			})
	});

	$: routeStopQuery = createQuery({
		queryKey: getRouteStopQueryKey({
			companyId,
			route,
			direction
		}),
		queryFn: () =>
			getRouteStop({
				companyId,
				route,
				direction
			})
	});
</script>

<svelte:head>
	<title>
		{companyId === 'CTB' ? '城巴' : companyId === 'NWFB' ? '新巴' : ''}
		{$routeQuery?.data?.data.route} | Bus ETA
	</title>
</svelte:head>

<div
	class="routes-filter-grid grid h-full w-full max-w-md justify-center gap-4 px-4 py-4"
>
	{#if $routeQuery.isLoading}
		<LoadingSpinner />
	{:else if $routeQuery.isError}
		<p>錯誤發生</p>
	{:else if $routeQuery.isSuccess}
		<div class="w-full">
			<RouteHeader
				companyId={$routeQuery.data.data.co}
				route={$routeQuery.data.data.route}
			/>

			<div class="grid w-full auto-cols-fr grid-flow-col gap-2">
				<Button
					type="button"
					class="px-6 py-4"
					variant={direction === 'inbound' ? 'primary' : 'secondary'}
					on:click={() => {
						direction = 'inbound';
					}}>往{$routeQuery.data.data.orig_tc}</Button
				>
				<Button
					type="button"
					class="px-6 py-4"
					variant={direction === 'outbound' ? 'primary' : 'secondary'}
					on:click={() => {
						direction = 'outbound';
					}}>往{$routeQuery.data.data.dest_tc}</Button
				>
			</div>
		</div>
	{/if}
	<div class="min-h-0 w-full">
		{#if $routeStopQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $routeStopQuery.isError}
			<p>錯誤發生</p>
		{:else if $routeStopQuery.isSuccess}
			<ul class="no-scroll-bar h-full overflow-auto">
				{#each $routeStopQuery.data.data as routeStop}
					<li class="mb-4">
						<Stop stopId={routeStop.stop} {companyId} {route} />
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

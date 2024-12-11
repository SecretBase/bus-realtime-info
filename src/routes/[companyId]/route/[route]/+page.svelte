<script lang="ts">
	import { page } from '$app/stores';
	import {
		getRoute,
		getRoutesQueryKey,
		getRouteStop,
		getRouteStopQueryKey
	} from '$lib/api/ctb';

	import {
		getRoute as getKMBRoute,
		getRouteStop as getKMBRouteStop
	} from '$lib/api/kmb';
	import type { CompanyId, Direction } from '$lib/api/ctb/types';
	import { createQuery } from '@tanstack/svelte-query';
	import LoadingSpinner from '../../../../components/LoadingSpinner.svelte';
	import Button from '../../../../components/Button.svelte';
	import Stop from './stop.svelte';
	import LoadingSkeleton from '../../../../components/LoadingSkeleton.svelte';
	import RouteHeader from '../../../../components/RouteHeader.svelte';

	let direction: Direction = $state('inbound');

	const companyId = $state($page.params.companyId as CompanyId);
	const route = $state($page.params.route);

	const routeQuery = createQuery({
		queryKey: getRoutesQueryKey({
			companyId,
			route
		}),
		queryFn: () => {
			return companyId === 'CTB'
				? getRoute({
						companyId,
						route
					})
				: getKMBRoute({ direction, route, serviceType: '1' });
		}
	});

	const routeStopQuery = $derived(
		createQuery({
			queryKey: getRouteStopQueryKey({
				companyId,
				route,
				direction
			}),
			queryFn: () => {
				return companyId === 'CTB'
					? getRouteStop({
							companyId,
							route,
							direction
						})
					: getKMBRouteStop({
							direction,
							serviceType: '1',
							route
						});
			}
		})
	);
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
			<RouteHeader {companyId} route={$routeQuery.data.data.route} />

			<div class="grid w-full auto-cols-fr grid-flow-col gap-2">
				<Button
					type="button"
					class="px-6 py-4"
					variant={direction === 'inbound' ? 'primary' : 'secondary'}
					onclick={() => {
						direction = 'inbound';
					}}>往{$routeQuery.data.data.orig_tc}</Button
				>
				<Button
					type="button"
					class="px-6 py-4"
					variant={direction === 'outbound' ? 'primary' : 'secondary'}
					onclick={() => {
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
						<Stop stopId={routeStop.stop} {companyId} {route} {direction} />
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

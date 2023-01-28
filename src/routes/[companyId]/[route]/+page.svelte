<script lang="ts">
	import { page } from '$app/stores';
	import { getRoute, getRoutesQueryKey } from '$lib/api/routes';
	import { getRouteStop, getRouteStopQueryKey } from '$lib/api/routeStop';
	import type { CompanyId, Direction } from '$lib/api/types';
	import { createQuery } from '@tanstack/svelte-query';
	import Stop from './stop.svelte';

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

{#if $routeQuery.isLoading}
	<h1>Loading</h1>
{:else if $routeQuery.isError}
	<h1>Error</h1>
{:else if $routeQuery.isSuccess}
	<h1>Route {$routeQuery.data.data.route}</h1>
	<dl>
		<dl>Origin</dl>
		<dt>
			<button
				type="button"
				on:click={() => {
					direction = 'inbound';
				}}>{$routeQuery.data.data.orig_tc}</button
			>
		</dt>
		<dl>Destination</dl>
		<dt>
			<button
				type="button"
				on:click={() => {
					direction = 'outbound';
				}}>{$routeQuery.data.data.dest_tc}</button
			>
		</dt>
	</dl>
{/if}

{#if $routeStopQuery.isLoading}
	<h1>Loading</h1>
{:else if $routeStopQuery.isError}
	<h1>Error</h1>
{:else if $routeStopQuery.isSuccess}
	<ul>
		{#each $routeStopQuery.data.data as routeStop}
			<li><Stop stopId={routeStop.stop} {companyId} {route} /></li>
		{/each}
	</ul>
{/if}

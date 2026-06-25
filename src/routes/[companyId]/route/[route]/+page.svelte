<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getRoute,
		getRoutesQueryKey,
		getRouteStop,
		getRouteStopQueryKey
	} from '$lib/api/ctb';

	import type { APIResponse } from '$lib/api/common/types';
	import type { Direction, OperatorId, Route } from '$lib/api/ctb/types';
	import {
		getRoute as getKMBRoute,
		getRouteStop as getKMBRouteStop
	} from '$lib/api/kmb';
	import Button from '$lib/components/Button.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import RouteHeader from '$lib/components/RouteHeader.svelte';
	import Stop from '$lib/components/StopListItem.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getCompanyName } from '$lib/utils/company';
	import { getDestination, getOrigin } from '$lib/utils/localized';
	import { createQuery } from '@tanstack/svelte-query';

	const direction = $derived(
		($page.url.searchParams.get('direction') as Direction) || 'inbound'
	);

	const companyId = $page.params.companyId as OperatorId;
	const route = $derived($page.params.route ?? '');

	function setDirection(newDirection: Direction) {
		const url = new URL($page.url);
		url.searchParams.set('direction', newDirection);
		goto(`${url.pathname}?${url.searchParams.toString()}`, {
			replaceState: true,
			keepFocus: true
		});
	}

	const routeQuery = $derived(
		createQuery<APIResponse<Route, 'RouteList' | 'Route'>>({
			queryKey: getRoutesQueryKey({
				companyId: 'CTB',
				route,
				direction
			}),
			queryFn: () =>
				companyId === 'CTB'
					? getRoute({ companyId: 'CTB', route })
					: (getKMBRoute({
							direction,
							route,
							serviceType: '1'
						}) as unknown as Promise<APIResponse<Route, 'RouteList' | 'Route'>>)
		})
	);

	const routeStopQuery = $derived(
		createQuery<APIResponse<any, any>>({
			queryKey: getRouteStopQueryKey({
				companyId: 'CTB',
				route,
				direction
			}),
			queryFn: async () => {
				if (companyId === 'CTB') {
					return getRouteStop({
						companyId: 'CTB',
						route,
						direction
					});
				}

				const response = await getKMBRouteStop({
					direction,
					serviceType: '1',
					route
				});

				return {
					...response,
					data: response.data
				} as APIResponse<any, any>;
			}
		})
	);
</script>

<svelte:head>
	<title>
		{m.page_title_route({
			company: getCompanyName(companyId),
			route: $routeQuery?.data?.data.route ?? ''
		})}
	</title>
</svelte:head>

<div
	class="routes-filter-grid grid h-full w-full max-w-md justify-center gap-4 px-4 py-4"
>
	{#if $routeQuery.isLoading}
		<LoadingSpinner />
	{:else if $routeQuery.isError}
		<p>{m.error_occurred()}</p>
	{:else if $routeQuery.isSuccess}
		<div class="w-full">
			<RouteHeader
				{companyId}
				route={$routeQuery.data.data.route}
				{direction}
			/>

			<div class="grid w-full auto-cols-fr grid-flow-col gap-2">
				<Button
					type="button"
					class="px-6 py-4"
					variant={direction === 'inbound' ? 'primary' : 'secondary'}
					onclick={() => setDirection('inbound')}
					>{m.direction_to({
						destination:
							companyId === 'CTB'
								? getOrigin($routeQuery.data.data)
								: getDestination($routeQuery.data.data)
					})}</Button
				>
				<Button
					type="button"
					class="px-6 py-4"
					variant={direction === 'outbound' ? 'primary' : 'secondary'}
					onclick={() => setDirection('outbound')}
					>{m.direction_to({
						destination:
							companyId === 'CTB'
								? getDestination($routeQuery.data.data)
								: getOrigin($routeQuery.data.data)
					})}</Button
				>
			</div>
		</div>
	{/if}
	<div class="min-h-0 w-full">
		{#if $routeStopQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $routeStopQuery.isError}
			<p>{m.error_occurred()}</p>
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

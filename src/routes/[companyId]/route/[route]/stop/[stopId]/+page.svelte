<script lang="ts">
	import type { OperatorId } from '$lib/api/ctb/types';
	import { format } from 'date-fns';
	import { page } from '$app/stores';
	import RouteHeader from '$lib/components/RouteHeader.svelte';
	import { getStop as getKMBStop, getETA as getKmbETA } from '$lib/api/kmb';
	import { createQuery } from '@tanstack/svelte-query';
	import { getStop, getStopQueryKey } from '$lib/api/ctb';
	import { getETA, getETAQueryKey } from '$lib/api/ctb';
	import { getRoute, getRoutesQueryKey } from '$lib/api/ctb';
	import type { Route } from '$lib/api/ctb/types';
	import type { APIResponse } from '$lib/api/common/types';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import BusStopMap from '$lib/components/BusStopMap.svelte';
	import {
		getRoute as getKMBRoute,
		getRouteStop as getKMBRouteStop
	} from '$lib/api/kmb';

	import {
		formatEtaMinutes,
		isArrivalMoreThanOneMinuteAway,
		sortEta
	} from '$lib/utils/eta';
	import {
		getDateFnsLocale,
		getDestination,
		getRemark,
		getStopName
	} from '$lib/utils/localized';
	import { REFETCH_EVERY_TEN_SECONDS } from '$lib/constants';
	import * as m from '$lib/paraglide/messages.js';
	import { getCompanyName } from '$lib/utils/company';

	import { favorites, type FavoriteStop as Stop } from '$lib/stores/favorites';

	const companyId = $state(($page.params.companyId ?? '') as OperatorId);
	const route = $state($page.params.route ?? '');
	const stopId = $state($page.params.stopId ?? '');
	const direction = $derived(
		($page.url.searchParams.get('direction') as 'inbound' | 'outbound') ??
			'inbound'
	);

	const routeQuery = $derived(
		createQuery<APIResponse<Route, 'Route' | 'RouteList'>>({
			queryKey: getRoutesQueryKey({
				companyId: 'CTB',
				route
			}),
			queryFn: () => {
				const currentDirection =
					($page.url.searchParams.get('direction') as 'inbound' | 'outbound') ??
					'inbound';
				return companyId === 'CTB'
					? getRoute({
							companyId: 'CTB',
							route
						})
					: (getKMBRoute({
							direction: currentDirection,
							route,
							serviceType: '1'
						}) as unknown as Promise<
							APIResponse<Route, 'Route' | 'RouteList'>
						>);
			}
		})
	);

	const stopQuery = createQuery({
		queryKey: getStopQueryKey({ stopId }),
		queryFn: () =>
			companyId === 'CTB' ? getStop({ stopId }) : getKMBStop({ stop: stopId })
	});

	const etaQuery = $derived(
		createQuery({
			queryKey: [
				...getETAQueryKey({
					companyId,
					stopId,
					route
				}),
				direction
			],
			refetchInterval: REFETCH_EVERY_TEN_SECONDS,
			queryFn: async () => {
				const dir = direction === 'inbound' ? 'I' : 'O';
				if (companyId === 'CTB') {
					const response = await getETA({
						companyId,
						stopId,
						route
					});
					return {
						...response,
						data: response.data?.filter((eta) => eta.dir === dir) ?? []
					};
				}

				const response = await getKmbETA({ stop: stopId });
				return {
					...response,
					data: response.data.filter(
						(eta: { route: string; dir: string }) =>
							eta.route === route && eta.dir === dir
					)
				};
			}
		})
	);

	const stopEtas = $derived(sortEta($etaQuery.data?.data));

	const matchFavoritesStop = (stop: Stop) =>
		stop.companyId === companyId &&
		stop.stopId === stopId &&
		stop.routeId === route;

	const hasFavorites = $derived($favorites.stops.some(matchFavoritesStop));
</script>

<svelte:head>
	<title>
		{m.page_title_stop({
			stop: $stopQuery?.data?.data
				? getStopName($stopQuery.data.data)
				: '',
			company: getCompanyName(companyId),
			route: $routeQuery?.data?.data.route ?? ''
		})}
	</title>
</svelte:head>

<div
	class="routes-filter-grid grid h-full w-full max-w-md justify-center gap-4 px-4 py-4"
>
	<div class="w-full min-w-xs">
		<RouteHeader {companyId} {route} />
		{#if $stopQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $stopQuery.isError}
			<p>{m.error_occurred()}</p>
		{:else if $stopQuery.isSuccess}
			<div class="flex gap-2">
				<div
					class="bg-vesuvius-400 text-vesuvius-900 flex-1 rounded-sm p-4 text-center shadow-md"
					style:--tag={`stop-item-${stopId}`}
				>
					<span style:--tag={`stop-title-${stopId}`}
						>{getStopName($stopQuery.data.data)}</span
					>
				</div>
				<button
					type="button"
					class="bg-vesuvius-400 w-14 rounded-sm"
					onclick={(event) => {
						event.preventDefault();

						if (hasFavorites) {
							favorites.update((favorites) => {
								return {
									...favorites,
									stops: favorites.stops.filter(
										(stop) => !matchFavoritesStop(stop)
									)
								};
							});
						} else {
							favorites.update((favorites) => {
								return {
									...favorites,
									stops: favorites.stops.concat({
										stopId,
										companyId,
										routeId: route,
										direction: direction
									})
								};
							});
						}
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 512 512"
						class={`${
							hasFavorites ? 'fill-red-600' : 'fill-white'
						} mx-auto h-6 w-6`}
					>
						<path
							d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
						/>
					</svg>
					<span class="sr-only"
						>{hasFavorites ? m.remove_from_favorites() : m.add_to_favorites()}
					</span>
				</button>
			</div>
			{#if Number($stopQuery.data.data.lat) !== 0 && Number($stopQuery.data.data.long) !== 0}
				<h2 class="text-vesuvius-900 mt-4 mb-2 text-sm font-medium">
					{m.stop_location()}
				</h2>
				<BusStopMap
					lat={$stopQuery.data.data.lat}
					lng={$stopQuery.data.data.long}
					label={getStopName($stopQuery.data.data)}
				/>
			{/if}
		{/if}
	</div>
	<div class="min-h-0 w-full">
		{#if $etaQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $etaQuery.isError}
			<p>{m.error_occurred()}</p>
		{:else if $etaQuery.isSuccess}
			<ul class="grid gap-4">
				{#each stopEtas ?? [] as eta}
					<li
						class="flex items-center justify-between gap-4 rounded-lg bg-white p-2 shadow-md"
					>
						<span>
							{#if isArrivalMoreThanOneMinuteAway(eta.etaDate)}
								<span
									class="bg-vesuvius-300 inline-block min-w-[76px] rounded-full px-3 py-2 text-center"
								>
									{formatEtaMinutes(new Date(eta.eta).getTime())}
								</span>
							{:else if eta.eta !== null}
								<span
									class="bg-vesuvius-300 inline-block min-w-[76px] rounded-full px-3 py-2 text-center"
								>
									<span class="animate-pulse font-bold text-red-600"
										>{m.arriving_soon()}</span
									>
								</span>
							{/if}
						</span>
						<span class="flex-1 text-center">
							<div class="flex flex-col gap-1">
								<span class="font-medium">{getDestination(eta)}</span>
								{#if getRemark(eta)}
									<span class="text-sm text-gray-600">{getRemark(eta)}</span>
								{/if}
							</div>
						</span>
						<span class="text-end">
							{eta.eta
								? format(new Date(eta.eta), 'HH:mm:ss', {
										locale: getDateFnsLocale()
									})
								: ''}
						</span>
					</li>
				{:else}
					<li class="p-4 bg-white shadow-md rounded-sm">
						<span
							class="bg-vesuvius-300 rounded-full py-2 px-3 inline-block min-w-[76px] text-center text-gray-600"
							>{m.no_service()}</span
						>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

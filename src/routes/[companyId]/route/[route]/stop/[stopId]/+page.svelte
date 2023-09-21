<script lang="ts">
	import type { CompanyId } from '$lib/api/types';
	import { format } from 'date-fns';
	import { zhHK } from 'date-fns/locale';
	import { page } from '$app/stores';
	import RouteHeader from '../../../../../../components/RouteHeader.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { getStop, getStopQueryKey } from '$lib/api/stop';
	import { getETA, getETAQueryKey } from '$lib/api/eta';
	import { getRoute, getRoutesQueryKey } from '$lib/api/routes';
	import LoadingSkeleton from '../../../../../../components/LoadingSkeleton.svelte';

	import {
		getDifferentInMinutesByTimeStamp,
		isArrivalTimeLessThenOneMinutes,
		sortEta
	} from '$lib/stopEta';

	import { favorites, type Stop } from '$lib/favoritesStore';

	$: companyId = $page.params.companyId as CompanyId;
	$: route = $page.params.route;
	$: stopId = $page.params.stopId;

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

	$: stopQuery = createQuery({
		queryKey: getStopQueryKey({ stopId }),
		queryFn: () => getStop({ stopId })
	});

	const REFETCH_EVERY_TEN_SECONDS = 10000;
	$: etaQuery = createQuery({
		queryKey: getETAQueryKey({
			companyId,
			stopId,
			route
		}),
		refetchInterval: REFETCH_EVERY_TEN_SECONDS,
		queryFn: () =>
			getETA({
				companyId,
				stopId,
				route
			})
	});

	$: stopEtas = sortEta($etaQuery?.data?.data);

	$: matchFavoritesStop = (stop: Stop) =>
		stop.companyId === companyId &&
		stop.stopId === stopId &&
		stop.routeId === route;

	$: hasFavorites = $favorites.stops.some(matchFavoritesStop);
</script>

<svelte:head>
	<title>
		{$stopQuery?.data?.data.name_tc ?? ''} | {companyId === 'CTB'
			? '城巴'
			: companyId === 'NWFB'
			? '新巴'
			: ''}
		{$routeQuery?.data?.data.route ?? ''} | Bus ETA
	</title>
</svelte:head>

<div
	class="routes-filter-grid grid h-full w-full max-w-md justify-center gap-4 px-4 py-4"
>
	<div class="min-w-xs w-full">
		<RouteHeader {companyId} {route} />
		{#if $stopQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $stopQuery.isError}
			<p>錯誤發生</p>
		{:else if $stopQuery.isSuccess}
			<div class="flex gap-2">
				<div
					class="flex-1 rounded bg-vesuvius-400 p-4 text-center text-vesuvius-900 shadow-md"
					style:--tag={`stop-item-${stopId}`}
				>
					<span style:--tag={`stop-title-${stopId}`}
						>{$stopQuery?.data?.data.name_tc}</span
					>
				</div>
				<button
					type="button"
					class="w-14 rounded bg-vesuvius-400"
					on:click={(event) => {
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
										routeId: route
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
						>{hasFavorites ? '從我的最愛中刪除' : '添加到我的最愛'}
					</span>
				</button>
			</div>
		{/if}
	</div>
	<div class="min-h-0 w-full">
		{#if $etaQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $etaQuery.isError}
			<p>錯誤發生</p>
		{:else if $etaQuery.isSuccess}
			<ul class="grid gap-4">
				{#each stopEtas ?? [] as eta}
					<li
						class="flex items-center justify-between gap-4 rounded-lg bg-white p-2 shadow-md"
					>
						<span>
							{#if isArrivalTimeLessThenOneMinutes(eta.etaDate)}
								<span
									class="inline-block min-w-[76px] rounded-full bg-vesuvius-300 px-3 py-2 text-center"
								>
									{getDifferentInMinutesByTimeStamp(
										new Date(eta.eta).getTime()
									)}分鐘
								</span>
							{:else}
								<span
									class="inline-block min-w-[76px] rounded-full bg-vesuvius-300 px-3 py-2 text-center"
								>
									<span class="animate-pulse font-bold text-red-600"
										>即將到達</span
									>
								</span>
							{/if}
						</span>
						<span class="flex-1 text-end">
							{format(new Date(eta.etaDate), 'HH:mm:ss', { locale: zhHK })}
						</span>
					</li>
				{:else}
					<li class="p-4 bg-white shadow-md rounded">
						<span
							class="bg-vesuvius-300 rounded-full py-2 px-3 inline-block min-w-[76px] text-center text-gray-600"
							>沒有班次</span
						>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

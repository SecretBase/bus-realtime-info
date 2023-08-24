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

<div class="grid py-4 gap-4 h-full routes-filter-grid w-full px-4 justify-center max-w-md">
	<div class="w-full min-w-xs">
		<RouteHeader {companyId} {route} />
		{#if $stopQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $stopQuery.isError}
			<p>錯誤發生</p>
		{:else if $stopQuery.isSuccess}
			<div class="bg-vesuvius-400 shadow-md p-4 rounded text-center text-vesuvius-900">
				{$stopQuery?.data?.data.name_tc}
			</div>
		{/if}
	</div>
	<div class="w-full min-h-0">
		{#if $etaQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $etaQuery.isError}
			<p>錯誤發生</p>
		{:else if $etaQuery.isSuccess}
			<ul class="grid gap-4">
				{#each stopEtas ?? [] as eta}
					<li class="p-2 bg-white shadow-md rounded-lg flex justify-between items-center gap-4">
						<span>
							{#if isArrivalTimeLessThenOneMinutes(eta.etaDate)}
								<span
									class="bg-vesuvius-300 rounded-full py-2 px-3 inline-block min-w-[76px] text-center"
								>
									{getDifferentInMinutesByTimeStamp(new Date(eta.eta).getTime())}分鐘
								</span>
							{:else}
								<span
									class="bg-vesuvius-300 rounded-full py-2 px-3 inline-block min-w-[76px] text-center"
								>
									<span class="text-red-600 font-bold animate-pulse">即將到達</span>
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

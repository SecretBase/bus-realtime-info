<script lang="ts">
	import { getETA, getETAQueryKey } from '$lib/api/eta';
	import { getStop, getStopQueryKey } from '$lib/api/stop';
	import type { CompanyId } from '$lib/api/types';
	import { createQuery } from '@tanstack/svelte-query';
	import LoadingSkeleton from '../../../../components/LoadingSkeleton.svelte';
	import {
		getDifferentInMinutesByTimeStamp,
		isArrivalTimeLessThenOneMinutes,
		sortEta
	} from '$lib/stopEta';
	export let stopId: string;
	export let companyId: CompanyId;
	export let route: string;
	export let showRouteNumber: boolean = false;

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

	$: stopEtas = sortEta($etaQuery?.data?.data)?.slice(0, 1);
</script>

{#if $etaQuery.isLoading || $stopQuery.isLoading}
	<LoadingSkeleton numberOfSkeletonBar={1} />
{:else if $etaQuery.isError || $stopQuery.isError}
	<p>錯誤發生</p>
{:else if $etaQuery.isSuccess && $stopQuery.isSuccess}
	<a
		href={`/${companyId}/route/${route}/stop/${stopId}`}
		style:--tag={`stop-item-${stopId}`}
		class={`flex rounded-lg bg-white p-2 shadow-md hover:shadow-lg ${
			showRouteNumber ? 'justify-between' : 'justify-start gap-4'
		} stop-list-grid box-border h-min items-center`}
	>
		<div class="col-span-3">
			<ul>
				{#each stopEtas ?? [] as eta}
					<li>
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
					</li>
				{:else}
					<li>
						<span
							class="bg-vesuvius-300 rounded-full py-2 px-3 inline-block min-w-[76px] text-center text-gray-600"
							>沒有班次</span
						>
					</li>
				{/each}
			</ul>
		</div>
		<div
			class={`${
				showRouteNumber ? 'col-span-6 text-center' : 'col-span-3'
			} h-min`}
			style:--tag={`stop-title-${stopId}`}
		>
			{$stopQuery.data.data.name_tc}
		</div>
		{#if showRouteNumber}
			<div class="col-span-3 text-end">
				<span
					class="inline-block min-w-[76px] rounded-full bg-vesuvius-300 px-3 py-2 text-center"
				>
					{route}
				</span>
			</div>
		{/if}
	</a>
{/if}

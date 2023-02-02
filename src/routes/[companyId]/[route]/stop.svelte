<script lang="ts">
	import { getETA } from '$lib/api/eta';
	import { getStop } from '$lib/api/stop';
	import type { CompanyId } from '$lib/api/types';
	import { differenceInMinutes } from 'date-fns';
	import { createQuery } from '@tanstack/svelte-query';
	import LoadingSkeleton from '../../../components/LoadingSkeleton.svelte';
	export let stopId: string;
	export let companyId: CompanyId;
	export let route: string;

	$: stopQuery = createQuery({
		queryKey: ['stop', stopId],
		queryFn: () => getStop({ stopId })
	});

	const REFETCH_EVERY_TEN_SECONDS = 10000;
	$: etaQuery = createQuery({
		queryKey: [
			'eta',
			{
				companyId,
				stopId,
				route
			}
		],
		refetchInterval: REFETCH_EVERY_TEN_SECONDS,
		queryFn: () =>
			getETA({
				companyId,
				stopId,
				route
			})
	});

	function getDifferentInMinutesByTimeStamp(time: number) {
		return Math.max(0, differenceInMinutes(time, new Date()));
	}

	$: stopEtas = $etaQuery?.data?.data
		.map((eta) => {
			return {
				...eta,
				etaDate: new Date(eta.eta)
			};
		})
		.sort((etaA, etaB) => {
			if (etaA.etaDate > etaB.etaDate) return 1;
			if (etaA.etaDate < etaB.etaDate) return -1;
			return 0;
		})
		.slice(0, 1);

	function isArrivalTimeLessThenOneMinutes(etaDate: Date) {
		const ONE_MINUTE = 1;
		return getDifferentInMinutesByTimeStamp(etaDate.getTime()) > ONE_MINUTE;
	}
</script>

{#if $etaQuery.isLoading || $stopQuery.isLoading}
	<LoadingSkeleton numberOfSkeletonBar={1} />
{:else if $etaQuery.isError || $stopQuery.isError}
	<p>錯誤發生</p>
{:else if $etaQuery.isSuccess && $stopQuery.isSuccess}
	<div class="bg-white shadow-md rounded-lg p-4 grid grid-cols-5 items-center gap-4 stop-list-grid">
		<div class="text-center col-span-2">
			<ul>
				{#each stopEtas ?? [] as eta}
					<li>
						{#if isArrivalTimeLessThenOneMinutes(eta.etaDate)}
							<span class="bg-vesuvius-300 rounded-full py-2 px-3">
								{getDifferentInMinutesByTimeStamp(new Date(eta.eta).getTime())}分鐘
							</span>
						{:else}
							<span class="bg-vesuvius-300 rounded-full py-2 px-3">
								<span class="text-red-600 font-bold animate-pulse">即將到達</span>
							</span>
						{/if}
					</li>
				{:else}
					<span class="bg-vesuvius-300 rounded-full py-2 px-3 text-gray-400">沒有班次</span>
				{/each}
			</ul>
		</div>
		<div class="col-span-3">
			{$stopQuery.data.data.name_tc}
		</div>
	</div>
{/if}

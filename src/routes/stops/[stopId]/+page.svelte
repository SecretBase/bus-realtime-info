<script lang="ts">
	import { getETA, getStop } from '$lib/api/kmb';
	import type { ETA } from '$lib/api/ctb/types';
	import CompanyBadge from '$lib/components/CompanyBadge.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import {
		getDifferentInMinutesByTimeStamp,
		isArrivalMoreThanOneMinuteAway,
		sortEta
	} from '$lib/utils/eta';
	import { REFETCH_EVERY_TEN_SECONDS } from '$lib/constants';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/stores';

	const stopId = $derived($page.params.stopId ?? '');

	const stopQuery = $derived(
		createQuery({
			queryKey: ['kmb-stop', stopId],
			queryFn: () => getStop({ stop: stopId })
		})
	);

	const etaQuery = $derived(
		createQuery({
			queryKey: ['kmb-stop-eta', stopId],
			refetchInterval: REFETCH_EVERY_TEN_SECONDS,
			queryFn: () => getETA({ stop: stopId })
		})
	);

	const routeGroups = $derived.by(() => {
		const sorted = sortEta(($etaQuery.data?.data ?? []) as ETA[]) ?? [];
		const grouped = new Map<string, (ETA & { etaDate: Date })[]>();

		for (const eta of sorted) {
			const key = `${eta.route}-${eta.dir}`;
			const existing = grouped.get(key);
			if (existing) existing.push(eta);
			else grouped.set(key, [eta]);
		}

		return [...grouped.values()]
			.map((etas) => ({
				route: etas[0].route,
				direction: etas[0].dir as 'I' | 'O',
				dest_tc: etas[0].dest_tc,
				etas
			}))
			.sort((a, b) => a.route.localeCompare(b.route, 'zh-HK'));
	});
</script>

<svelte:head>
	<title>{$stopQuery.data?.data?.name_tc ?? '站點'} | 站點路線</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<div class="w-full">
		<a
			href="/stops"
			class="text-vesuvius-700 mb-4 inline-block text-sm underline"
			>← 返回搜尋</a
		>

		{#if $stopQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $stopQuery.isError}
			<p class="rounded-xl bg-white p-4 text-center shadow-md">無法載入站點</p>
		{:else if $stopQuery.isSuccess}
			<h1
				class="rounded-xl bg-white px-6 py-4 text-xl font-bold shadow-md"
			>
				{$stopQuery.data.data.name_tc}
			</h1>
		{/if}
	</div>

	<div class="min-h-0 w-full">
		{#if $etaQuery.isLoading}
			<LoadingSkeleton />
		{:else if $etaQuery.isError}
			<p class="rounded-xl bg-white p-4 text-center shadow-md">
				無法載入到站時間
			</p>
		{:else if routeGroups.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">此站暫無班次</p>
			</div>
		{:else}
			<ul class="no-scroll-bar grid h-full items-start gap-3 overflow-auto auto-rows-min">
				{#each routeGroups as group}
					{@const nextEta = group.etas[0]}
					<li>
						<a
							href="/KMB/route/{group.route}/stop/{stopId}?direction={group.direction ===
							'I'
								? 'inbound'
								: 'outbound'}"
							class="flex items-start gap-3 rounded-xl bg-white p-4 shadow-md hover:shadow-lg"
						>
							<CompanyBadge companyId="KMB" />
							<div class="min-w-0 flex-1">
								<div class="text-vesuvius-900 font-medium">
									{group.route} 往 {group.dest_tc}
								</div>
								{#if nextEta}
									<div class="mt-1 text-sm text-gray-600">
										{#if nextEta.eta === null}
											沒有班次
										{:else if isArrivalMoreThanOneMinuteAway(nextEta.etaDate)}
											{getDifferentInMinutesByTimeStamp(
												new Date(nextEta.eta).getTime()
											)} 分鐘
										{:else}
											<span class="font-medium text-red-600">即將到達</span>
										{/if}
									</div>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

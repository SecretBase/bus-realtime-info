<script lang="ts">
	import { getETA, getStop } from '$lib/api/kmb';
	import type { ETA } from '$lib/api/ctb/types';
	import CompanyBadge from '$lib/components/CompanyBadge.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import {
		formatEtaMinutes,
		isArrivalMoreThanOneMinuteAway,
		sortEta
	} from '$lib/utils/eta';
	import { getDestination, getStopName } from '$lib/utils/localized';
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
				destination: getDestination(etas[0]),
				etas
			}))
			.sort((a, b) =>
				a.route.localeCompare(b.route, getLocale() === 'en' ? 'en' : 'zh-HK')
			);
	});
</script>

<svelte:head>
	<title>
		{m.page_title_stop_routes({
			stop: $stopQuery.data?.data
				? getStopName($stopQuery.data.data)
				: m.default_stop_name()
		})}
	</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<div class="w-full">
		<a
			href={localizeHref('/stops')}
			class="text-vesuvius-700 mb-4 inline-block text-sm underline"
			>{m.back_to_search()}</a
		>

		{#if $stopQuery.isLoading}
			<LoadingSkeleton skeletonHeightClass="h-14" />
		{:else if $stopQuery.isError}
			<p class="rounded-xl bg-white p-4 text-center shadow-md">
				{m.stop_load_error()}
			</p>
		{:else if $stopQuery.isSuccess}
			<h1 class="rounded-xl bg-white px-6 py-4 text-xl font-bold shadow-md">
				{getStopName($stopQuery.data.data)}
			</h1>
		{/if}
	</div>

	<div class="min-h-0 w-full">
		{#if $etaQuery.isLoading}
			<LoadingSkeleton />
		{:else if $etaQuery.isError}
			<p class="rounded-xl bg-white p-4 text-center shadow-md">
				{m.eta_load_error()}
			</p>
		{:else if routeGroups.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">{m.no_routes_at_stop()}</p>
			</div>
		{:else}
			<ul
				class="no-scroll-bar grid h-full auto-rows-min items-start gap-3 overflow-auto"
			>
				{#each routeGroups as group}
					{@const nextEta = group.etas[0]}
					<li>
						<a
							href={localizeHref(
								`/KMB/route/${group.route}/stop/${stopId}?direction=${
									group.direction === 'I' ? 'inbound' : 'outbound'
								}`
							)}
							class="flex items-start gap-3 rounded-xl bg-white p-4 shadow-md hover:shadow-lg"
						>
							<CompanyBadge companyId="KMB" />
							<div class="min-w-0 flex-1">
								<div class="text-vesuvius-900 font-medium">
									{m.route_to_dest({
										route: group.route,
										destination: group.destination
									})}
								</div>
								{#if nextEta}
									<div class="mt-1 text-sm text-gray-600">
										{#if nextEta.eta === null}
											{m.no_service()}
										{:else if isArrivalMoreThanOneMinuteAway(nextEta.etaDate)}
											{formatEtaMinutes(new Date(nextEta.eta).getTime())}
										{:else}
											<span class="font-medium text-red-600"
												>{m.arriving_soon()}</span
											>
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

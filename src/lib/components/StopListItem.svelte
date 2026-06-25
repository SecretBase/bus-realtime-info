<script lang="ts">
	import {
		getETA,
		getETAQueryKey,
		getStop,
		getStopQueryKey
	} from '$lib/api/ctb';

	import { getStop as getKMBStop, getETA as getKmbETA } from '$lib/api/kmb';

	import type { Direction, OperatorId } from '$lib/api/ctb/types';
	import { createQuery } from '@tanstack/svelte-query';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import {
		formatEtaMinutes,
		isArrivalMoreThanOneMinuteAway,
		sortEta
	} from '$lib/utils/eta';
	import { getStopName } from '$lib/utils/localized';
	import { REFETCH_EVERY_TEN_SECONDS } from '$lib/constants';

	const {
		stopId,
		companyId,
		route,
		showRouteNumber = false,
		direction,
		maxEtas = 1
	} = $props<{
		stopId: string;
		companyId: OperatorId;
		route: string;
		showRouteNumber?: boolean;
		direction?: Direction;
		maxEtas?: number;
	}>();

	const stopQuery = $derived(
		createQuery({
			queryKey: [...getStopQueryKey({ stopId }), companyId],
			queryFn: () =>
				companyId === 'CTB' ? getStop({ stopId }) : getKMBStop({ stop: stopId })
		})
	);

	const etaQuery = $derived(
		createQuery({
			queryKey: [
				...getETAQueryKey({
					companyId,
					stopId,
					route
				}),
				direction ?? 'all'
			],
			refetchInterval: REFETCH_EVERY_TEN_SECONDS,
			queryFn: async () => {
				if (companyId === 'CTB') {
					const response = await getETA({
						companyId,
						stopId,
						route
					});
					if (!direction) return response;
					const dir = direction === 'inbound' ? 'I' : 'O';
					return {
						...response,
						data: (response.data ?? []).filter((eta) => eta.dir === dir)
					};
				}

				const response = await getKmbETA({ stop: stopId });
				let data = response.data.filter(
					(eta: { route: string }) => eta.route === route
				);
				if (direction) {
					const dir = direction === 'inbound' ? 'I' : 'O';
					data = data.filter((eta: { dir: string }) => eta.dir === dir);
				}
				return { ...response, data };
			}
		})
	);

	const stopEtas = $derived(sortEta($etaQuery?.data?.data)?.slice(0, maxEtas));
</script>

{#if $etaQuery.isLoading || $stopQuery.isLoading}
	<LoadingSkeleton numberOfSkeletonBar={1} />
{:else if $etaQuery.isError || $stopQuery.isError}
	<p>{m.error_occurred()}</p>
{:else if $etaQuery.isSuccess && $stopQuery.isSuccess}
	<a
		href={localizeHref(
			`/${companyId}/route/${route}/stop/${stopId}${direction ? `?direction=${direction}` : ''}`
		)}
		style:--tag={`stop-item-${stopId}`}
		class={`flex rounded-lg bg-white p-2 shadow-md hover:shadow-lg ${
			showRouteNumber ? 'justify-between' : 'justify-start gap-4'
		} stop-list-grid box-border h-min items-center`}
	>
		<div class="col-span-3">
			<ul class={`flex ${maxEtas > 1 ? 'flex-wrap gap-1' : ''}`}>
				{#each stopEtas ?? [] as eta}
					<li>
						{#if isArrivalMoreThanOneMinuteAway(eta.etaDate) && eta.eta !== null}
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
						{:else}
							<span
								class="bg-vesuvius-300 inline-block min-w-[76px] rounded-full px-3 py-2 text-center text-gray-600"
								>{m.no_service()}</span
							>
						{/if}
					</li>
				{:else}
					<li>
						<span
							class="bg-vesuvius-300 rounded-full py-2 px-3 inline-block min-w-[76px] text-center text-gray-600"
							>{m.no_service()}</span
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
			{getStopName($stopQuery.data.data)}
		</div>
		{#if showRouteNumber}
			<div class="col-span-3 text-end">
				<span
					class="bg-vesuvius-300 inline-block min-w-[76px] rounded-full px-3 py-2 text-center"
				>
					{route}
				</span>
			</div>
		{/if}
	</a>
{/if}

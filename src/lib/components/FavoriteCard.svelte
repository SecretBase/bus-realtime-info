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
	import CompanyBadge from '$lib/components/CompanyBadge.svelte';
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
		direction,
		maxEtas = 3,
		onRemove
	} = $props<{
		stopId: string;
		companyId: OperatorId;
		route: string;
		direction?: Direction;
		maxEtas?: number;
		onRemove: () => void;
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
	const stopHref = $derived(
		localizeHref(
			`/${companyId}/route/${route}/stop/${stopId}${direction ? `?direction=${direction}` : ''}`
		)
	);
</script>

{#if $etaQuery.isLoading || $stopQuery.isLoading}
	<LoadingSkeleton numberOfSkeletonBar={2} />
{:else if $etaQuery.isError || $stopQuery.isError}
	<div class="rounded-xl bg-white p-4 shadow-md">
		<p class="text-vesuvius-900 text-sm">{m.load_data_error()}</p>
	</div>
{:else if $etaQuery.isSuccess && $stopQuery.isSuccess}
	<article
		class="rounded-xl bg-white shadow-md"
		style:--tag={`favorite-${companyId}-${route}-${stopId}`}
	>
		<div class="flex items-start gap-2 p-4 pb-3">
			<a
				href={stopHref}
				class="min-w-0 flex-1 active:opacity-80"
				data-sveltekit-preload-data="hover"
			>
				<div class="mb-1 flex items-center gap-2">
					<CompanyBadge {companyId} />
					<span
						class="text-vesuvius-900 text-xl font-bold tabular-nums"
						style:--tag={`route-${route}`}
					>
						{route}
					</span>

					<p
					class="text-vesuvius-700 truncate text-sm"
					style:--tag={`stop-title-${stopId}`}
				>
					{getStopName($stopQuery.data.data)}
				</p>
				</div>
				
			</a>
			<button
				type="button"
				class="text-vesuvius-500 hover:bg-vesuvius-100 hover:text-vesuvius-700 -mt-1 -mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors"
				aria-label={m.remove_favorite_aria()}
				onclick={onRemove}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					class="h-5 w-5"
					aria-hidden="true"
				>
					<path d="M18 6 6 18M6 6l12 12" />
				</svg>
			</button>
		</div>
		<a
			href={stopHref}
			class="flex flex-wrap gap-2 px-4 pb-4 active:opacity-80"
			data-sveltekit-preload-data="hover"
		>
			{#each stopEtas ?? [] as eta}
				{#if isArrivalMoreThanOneMinuteAway(eta.etaDate) && eta.eta !== null}
					<span
						class="bg-vesuvius-100 text-vesuvius-900 inline-block min-w-[4.5rem] rounded-full px-3 py-1.5 text-center text-sm font-medium tabular-nums"
					>
						{formatEtaMinutes(new Date(eta.eta).getTime())}
					</span>
				{:else if eta.eta !== null}
					<span
						class="bg-vesuvius-100 inline-block min-w-[4.5rem] rounded-full px-3 py-1.5 text-center text-sm font-medium"
					>
						<span class="animate-pulse font-bold text-red-600"
							>{m.arriving_soon()}</span
						>
					</span>
				{:else}
					<span
						class="bg-vesuvius-50 text-vesuvius-600 inline-block min-w-[4.5rem] rounded-full px-3 py-1.5 text-center text-sm"
					>
						{m.no_service()}
					</span>
				{/if}
			{:else}
				<span
					class="bg-vesuvius-50 text-vesuvius-600 inline-block min-w-[4.5rem] rounded-full px-3 py-1.5 text-center text-sm"
				>
					{m.no_service()}
				</span>
			{/each}
		</a>
	</article>
{/if}

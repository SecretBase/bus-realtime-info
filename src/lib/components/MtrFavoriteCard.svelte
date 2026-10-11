<script lang="ts">
	import {
		flattenMtrTrains,
		getMtrSchedule,
		getMtrScheduleQueryKey
	} from '$lib/api/mtr';
	import {
		getMtrStationName,
		isMtrLine,
		isMtrStationOnLine,
		type MtrLineId,
		type MtrStationId
	} from '$lib/api/mtr/data';
	import LineBadge from '$lib/components/LineBadge.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import { REFETCH_EVERY_TEN_SECONDS } from '$lib/constants';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import {
		formatEtaMinutes,
		isArrivalMoreThanOneMinuteAway
	} from '$lib/utils/eta';
	import { createQuery } from '@tanstack/svelte-query';

	const {
		line,
		station,
		maxEtas = 3,
		onRemove
	} = $props<{
		line: string;
		station: string;
		maxEtas?: number;
		onRemove: () => void;
	}>();

	const validLine = $derived(isMtrLine(line) ? line : null);
	const validStation = $derived(
		validLine && isMtrStationOnLine(validLine, station) ? station : null
	);
	const lang = $derived(getLocale() === 'en' ? 'EN' : 'TC');

	const etaQuery = $derived(
		createQuery({
			queryKey: getMtrScheduleQueryKey({
				line: (validLine ?? 'TKL') as MtrLineId,
				station: (validStation ?? 'TKO') as MtrStationId,
				lang
			}),
			enabled: Boolean(validLine && validStation),
			refetchInterval: REFETCH_EVERY_TEN_SECONDS,
			queryFn: () =>
				getMtrSchedule({
					line: validLine as MtrLineId,
					station: validStation as MtrStationId,
					lang
				})
		})
	);

	const stopEtas = $derived(
		flattenMtrTrains($etaQuery.data, line, station).slice(0, maxEtas)
	);
	const stopHref = $derived(localizeHref(`/mtr/${line}/${station}`));
</script>

{#if !validLine || !validStation}
	<div class="rounded-xl bg-white p-4 shadow-md">
		<p class="text-vesuvius-900 text-sm">{m.load_data_error()}</p>
	</div>
{:else if $etaQuery.isLoading}
	<LoadingSkeleton numberOfSkeletonBar={2} />
{:else if $etaQuery.isError}
	<div class="rounded-xl bg-white p-4 shadow-md">
		<p class="text-vesuvius-900 text-sm">{m.load_data_error()}</p>
	</div>
{:else}
	<article class="rounded-xl bg-white shadow-md">
		<div class="flex items-start gap-2 p-4 pb-3">
			<a
				href={stopHref}
				class="min-w-0 flex-1 active:opacity-80"
				data-sveltekit-preload-data="hover"
			>
				<div class="mb-1 flex items-center gap-2">
					<LineBadge lineId={validLine} />
					<p class="text-vesuvius-700 truncate text-sm">
						{getMtrStationName(validStation)}
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
			{#each stopEtas as train}
				{#if isArrivalMoreThanOneMinuteAway(train.etaDate)}
					<span
						class="bg-vesuvius-100 text-vesuvius-900 inline-block min-w-[4.5rem] rounded-full px-3 py-1.5 text-center text-sm font-medium tabular-nums"
					>
						{formatEtaMinutes(train.etaDate.getTime())}
					</span>
				{:else}
					<span
						class="bg-vesuvius-100 inline-block min-w-[4.5rem] rounded-full px-3 py-1.5 text-center text-sm font-medium"
					>
						<span class="animate-pulse font-bold text-red-600"
							>{m.arriving_soon()}</span
						>
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

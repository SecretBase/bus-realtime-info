<script lang="ts">
	import { page } from '$app/stores';
	import {
		getMtrSchedule,
		getMtrScheduleQueryKey,
		getMtrStopTrains,
		isMtrScheduleOk,
		parseMtrTime,
		type MtrTrain
	} from '$lib/api/mtr';
	import {
		getMtrLineName,
		getMtrStationName,
		isMtrLine,
		isMtrStationOnLine
	} from '$lib/api/mtr/data';
	import Button from '$lib/components/Button.svelte';
	import LineBadge from '$lib/components/LineBadge.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import { REFETCH_EVERY_TEN_SECONDS } from '$lib/constants';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { favorites } from '$lib/stores/favorites';
	import {
		formatEtaMinutes,
		isArrivalMoreThanOneMinuteAway
	} from '$lib/utils/eta';
	import { getDateFnsLocale } from '$lib/utils/localized';
	import { createQuery } from '@tanstack/svelte-query';
	import { format } from 'date-fns';

	const lineId = $derived($page.params.line ?? '');
	const stationId = $derived($page.params.station ?? '');
	const validLine = $derived(isMtrLine(lineId) ? lineId : null);
	const validStation = $derived(
		validLine && isMtrStationOnLine(validLine, stationId) ? stationId : null
	);

	const lang = $derived(getLocale() === 'en' ? 'EN' : 'TC');

	const etaQuery = $derived(
		createQuery({
			queryKey: getMtrScheduleQueryKey({
				line: validLine ?? 'TKL',
				station: validStation ?? 'TKO',
				lang
			}),
			enabled: Boolean(validLine && validStation),
			refetchInterval: REFETCH_EVERY_TEN_SECONDS,
			queryFn: () =>
				getMtrSchedule({
					line: validLine!,
					station: validStation!,
					lang
				})
		})
	);

	const trains = $derived(
		validLine && validStation
			? getMtrStopTrains($etaQuery.data, validLine, validStation)
			: { up: [], down: [] }
	);

	const matchFavorite = (stop: (typeof $favorites.stops)[number]) =>
		stop.companyId === 'MTR' &&
		stop.routeId === lineId &&
		stop.stopId === stationId;

	const hasFavorite = $derived($favorites.stops.some(matchFavorite));

	function directionLabel(directionTrains: MtrTrain[]) {
		const dests = [
			...new Set(directionTrains.map((train) => getMtrStationName(train.dest)))
		];
		return dests
			.map((destination) => m.direction_to({ destination }))
			.join(' / ');
	}

	function toggleFavorite() {
		if (hasFavorite) {
			favorites.update((current) => ({
				...current,
				stops: current.stops.filter((stop) => !matchFavorite(stop))
			}));
			return;
		}

		favorites.update((current) => ({
			...current,
			stops: current.stops.concat({
				companyId: 'MTR',
				routeId: lineId,
				stopId: stationId
			})
		}));
	}
</script>

<svelte:head>
	<title>
		{m.page_title_mtr_station({
			station: validStation ? getMtrStationName(validStation) : stationId,
			line: validLine ? getMtrLineName(validLine) : lineId
		})}
	</title>
</svelte:head>

<div
	class="routes-filter-grid grid h-full min-h-0 w-full max-w-md gap-4 px-4 py-4"
>
	<div class="w-full min-w-xs">
		{#if validLine}
			<a href={localizeHref(`/mtr/${validLine}`)}>
				<h1
					class="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-2xl shadow-md"
				>
					<LineBadge lineId={validLine} />
				</h1>
			</a>
		{/if}
	</div>

	<div class="no-scroll-bar min-h-0 w-full overflow-y-auto">
		{#if !validLine || !validStation}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">{m.error_occurred()}</p>
				<a
					href={localizeHref('/mtr')}
					class="text-vesuvius-700 mt-4 inline-block text-sm underline"
				>
					{m.browse_mtr()}
				</a>
			</div>
		{:else}
			<div class="flex gap-2">
				<div
					class="bg-vesuvius-400 text-vesuvius-900 flex-1 rounded-sm p-4 text-center shadow-md"
				>
					{getMtrStationName(validStation)}
				</div>
				<button
					type="button"
					class="bg-vesuvius-400 w-14 rounded-sm"
					onclick={toggleFavorite}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 512 512"
						class={`${
							hasFavorite ? 'fill-red-600' : 'fill-white'
						} mx-auto h-6 w-6`}
					>
						<path
							d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
						/>
					</svg>
					<span class="sr-only"
						>{hasFavorite
							? m.remove_from_favorites()
							: m.add_to_favorites()}</span
					>
				</button>
			</div>

			{#if $etaQuery.isLoading}
				<div class="mt-4">
					<LoadingSkeleton skeletonHeightClass="h-14" />
				</div>
			{:else if $etaQuery.isError}
				<div class="mt-4 rounded-xl bg-white p-6 text-center shadow-md">
					<p class="text-vesuvius-900">{m.eta_load_error()}</p>
					<Button
						type="button"
						variant="primary"
						class="mt-4 px-6 py-3"
						onclick={() => $etaQuery.refetch()}>{m.retry()}</Button
					>
				</div>
			{:else if $etaQuery.isSuccess}
				{#if $etaQuery.data.isdelay === 'Y'}
					<p
						class="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-800"
					>
						{m.mtr_delayed()}
					</p>
				{/if}

				{#if !isMtrScheduleOk($etaQuery.data)}
					<p class="mt-4 rounded-xl bg-white p-4 text-center shadow-md">
						{$etaQuery.data.message || m.eta_load_error()}
					</p>
				{/if}

				{#if trains.up.length === 0 && trains.down.length === 0}
					<div class="mt-4 rounded-xl bg-white p-6 text-center shadow-md">
						<p class="text-vesuvius-900">{m.no_service()}</p>
					</div>
				{:else}
					{#each [{ key: 'up', list: trains.up }, { key: 'down', list: trains.down }] as group (group.key)}
						{#if group.list.length > 0}
							<section class="mt-4">
								<h2 class="text-vesuvius-900 mb-2 text-sm font-medium">
									{directionLabel(group.list)}
								</h2>
								<ul class="grid auto-rows-min gap-4">
									{#each group.list as train (`${group.key}-${train.seq}-${train.time}`)}
										{@const etaDate = parseMtrTime(train.time)}
										<li
											class="flex items-center justify-between gap-4 rounded-lg bg-white p-2 shadow-md"
										>
											<span>
												{#if isArrivalMoreThanOneMinuteAway(etaDate)}
													<span
														class="bg-vesuvius-300 inline-block min-w-[76px] rounded-full px-3 py-2 text-center tabular-nums"
													>
														{formatEtaMinutes(etaDate.getTime())}
													</span>
												{:else}
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
													<span class="font-medium"
														>{getMtrStationName(train.dest)}</span
													>
													<span class="text-sm text-gray-600"
														>{m.mtr_platform({
															platform: train.plat
														})}</span
													>
												</div>
											</span>
											<span class="text-end tabular-nums">
												{format(etaDate, 'HH:mm:ss', {
													locale: getDateFnsLocale()
												})}
											</span>
										</li>
									{/each}
								</ul>
							</section>
						{/if}
					{/each}
				{/if}
			{/if}
		{/if}
	</div>
</div>

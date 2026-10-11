<script lang="ts">
	import {
		getMtrLineName,
		getMtrLineStationPairs,
		getMtrStationName,
		mtrLineIds,
		mtrLines,
		type MtrLineId
	} from '$lib/api/mtr/data';
	import LineBadge from '$lib/components/LineBadge.svelte';
	import TransportModeSwitch from '$lib/components/TransportModeSwitch.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let filter = $state('');

	const query = $derived(filter.trim().toLowerCase());

	const matchedLines = $derived(
		mtrLineIds.filter((line) => {
			if (!query) return true;
			const meta = mtrLines[line];
			return (
				line.toLowerCase().includes(query) ||
				meta.tcName.includes(filter.trim()) ||
				meta.name.toLowerCase().includes(query)
			);
		})
	);

	const matchedStations = $derived(
		query
			? getMtrLineStationPairs().filter(({ line, station }) => {
					const stationName = getMtrStationName(station);
					const lineName = getMtrLineName(line);
					return (
						station.toLowerCase().includes(query) ||
						stationName.toLowerCase().includes(query) ||
						lineName.toLowerCase().includes(query)
					);
				})
			: []
	);
</script>

<svelte:head>
	<title>{m.page_title_mtr()}</title>
</svelte:head>

<div
	class="grid-flow-cols routes-filter-grid grid h-full w-full max-w-md gap-4 px-4 py-4"
>
	<div class="grid w-full gap-2">
		<TransportModeSwitch />
		<input
			type="text"
			placeholder={m.mtr_filter_placeholder()}
			bind:value={filter}
			class="bg-vesuvius-700 min-w-[200px] rounded-xl border-b p-4 text-center text-white placeholder:text-white"
		/>
	</div>

	<div class="no-scroll-bar h-full min-h-0 overflow-y-auto">
		{#if query && matchedLines.length === 0 && matchedStations.length === 0}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">{m.no_matching_mtr()}</p>
			</div>
		{:else}
			<ul class="grid gap-3">
				{#each matchedLines as line (line)}
					<li>
						<a
							href={localizeHref(`/mtr/${line}`)}
							class="flex items-center gap-3 rounded-xl bg-white p-4 shadow-md hover:shadow-lg"
							data-sveltekit-preload-data="hover"
						>
							<span
								class="h-8 w-1.5 shrink-0 rounded-full"
								style:background-color={mtrLines[line].color}
								aria-hidden="true"
							></span>
							<div class="min-w-0 flex-1">
								<div class="text-vesuvius-900 font-bold">
									{getMtrLineName(line)}
								</div>
								<div class="text-vesuvius-700 truncate text-sm">
									{line}
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>

			{#if matchedStations.length > 0}
				<ul class="mt-4 grid gap-3">
					{#each matchedStations as item (`${item.line}-${item.station}`)}
						<li>
							<a
								href={localizeHref(`/mtr/${item.line}/${item.station}`)}
								class="flex items-center gap-3 rounded-xl bg-white p-4 shadow-md hover:shadow-lg"
								data-sveltekit-preload-data="hover"
							>
								<LineBadge lineId={item.line as MtrLineId} />
								<span class="text-vesuvius-900 min-w-0 flex-1 font-medium">
									{getMtrStationName(item.station)}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</div>
</div>

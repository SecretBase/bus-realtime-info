<script lang="ts">
	import { page } from '$app/stores';
	import {
		getMtrLineName,
		getMtrStationName,
		isMtrLine,
		mtrLineStations,
		mtrLines
	} from '$lib/api/mtr/data';
	import Button from '$lib/components/Button.svelte';
	import LineBadge from '$lib/components/LineBadge.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let reversed = $state(false);

	const lineId = $derived($page.params.line ?? '');
	const validLine = $derived(isMtrLine(lineId) ? lineId : null);
	const stations = $derived(
		validLine
			? reversed
				? [...mtrLineStations[validLine]].reverse()
				: [...mtrLineStations[validLine]]
			: []
	);
</script>

<svelte:head>
	<title>
		{m.page_title_mtr_line({
			line: validLine ? getMtrLineName(validLine) : lineId
		})}
	</title>
</svelte:head>

<div
	class="routes-filter-grid grid h-full w-full max-w-md justify-center gap-4 px-4 py-4"
>
	<div class="w-full">
		{#if validLine}
			<a href={localizeHref('/mtr')}>
				<h1
					class="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-2xl shadow-md"
				>
					<LineBadge lineId={validLine} />
				</h1>
			</a>
			<Button
				type="button"
				class="w-full px-6 py-4"
				variant="secondary"
				onclick={() => {
					reversed = !reversed;
				}}>{m.reverse_stations()}</Button
			>
		{:else}
			<div class="rounded-xl bg-white p-6 text-center shadow-md">
				<p class="text-vesuvius-900">{m.error_occurred()}</p>
				<a
					href={localizeHref('/mtr')}
					class="text-vesuvius-700 mt-4 inline-block text-sm underline"
				>
					{m.browse_mtr()}
				</a>
			</div>
		{/if}
	</div>

	<div class="min-h-0 w-full">
		{#if validLine}
			<ul class="no-scroll-bar h-full overflow-auto">
				{#each stations as station (station)}
					<li class="mb-4">
						<a
							href={localizeHref(`/mtr/${validLine}/${station}`)}
							class="flex items-center gap-3 rounded-lg bg-white p-4 shadow-md hover:shadow-lg"
							data-sveltekit-preload-data="hover"
						>
							<span
								class="h-3 w-3 shrink-0 rounded-full"
								style:background-color={mtrLines[validLine].color}
								aria-hidden="true"
							></span>
							<span class="text-vesuvius-900 font-medium">
								{getMtrStationName(station)}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

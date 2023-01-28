<script lang="ts">
	import { getETA } from '$lib/api/eta';
	import { getStop } from '$lib/api/stop';
	import type { CompanyId } from '$lib/api/types';
	import { differenceInMinutes, parse } from 'date-fns';
	import { createQuery } from '@tanstack/svelte-query';
	export let stopId: string;
	export let companyId: CompanyId;
	export let route: string;

	$: stopQuery = createQuery({
		queryKey: ['stop', stopId],
		queryFn: () => getStop({ stopId })
	});

	$: etaQuery = createQuery({
		queryKey: [
			'eta',
			{
				companyId,
				stopId,
				route
			}
		],
		refetchInterval: 10000,
		queryFn: () =>
			getETA({
				companyId,
				stopId,
				route
			})
	});

	function getDifferentInMinutes(time: number) {
		return Math.max(0, differenceInMinutes(time, new Date()));
	}
</script>

{#if $stopQuery.isLoading}
	<h1>Loading</h1>
{:else if $stopQuery.isError}
	<h1>Error</h1>
{:else if $stopQuery.isSuccess}
	{$stopQuery.data.data.name_tc}
{/if}

{#if $etaQuery.isLoading}
	<h1>Loading</h1>
{:else if $etaQuery.isError}
	<h1>Error</h1>
{:else if $etaQuery.isSuccess}
	<ul>
		{#each $etaQuery.data.data ?? [] as eta}
			<li>
				{#if getDifferentInMinutes(new Date(eta.eta).getTime()) > 0}
					{getDifferentInMinutes(new Date(eta.eta).getTime())} 分鐘
				{:else}
					即將到達
				{/if}
			</li>
		{:else}
			沒有班次
		{/each}
	</ul>
{/if}

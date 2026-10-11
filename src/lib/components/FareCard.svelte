<script lang="ts">
	import { formatHkd } from '$lib/fare';
	import * as m from '$lib/paraglide/messages.js';
	import Button from './Button.svelte';
	import LoadingSkeleton from './LoadingSkeleton.svelte';

	type Concession = {
		key: string;
		label: string;
		amount: number;
	};

	const {
		loading = false,
		error = false,
		onretry,
		adult,
		subtitle,
		concessions = [],
		empty,
		children
	}: {
		loading?: boolean;
		error?: boolean;
		onretry?: () => void;
		adult?: number;
		subtitle?: string;
		concessions?: Concession[];
		empty?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<section class="rounded-xl bg-white p-4 shadow-md">
	<h2 class="text-vesuvius-900 mb-2 text-sm font-medium">{m.fare()}</h2>
	{#if children}
		{@render children()}
	{/if}
	{#if loading}
		<LoadingSkeleton skeletonHeightClass="h-14" numberOfSkeletonBar={1} />
	{:else if error}
		<p class="text-vesuvius-900">{m.fare_load_error()}</p>
		{#if onretry}
			<Button
				type="button"
				variant="primary"
				class="mt-3 px-6 py-3"
				onclick={onretry}>{m.retry()}</Button
			>
		{/if}
	{:else if adult == null}
		<p class="text-gray-600">{empty ?? m.fare_unavailable()}</p>
	{:else}
		<p class="text-vesuvius-900 text-2xl font-semibold tabular-nums">
			{formatHkd(adult)}
		</p>
		<p class="text-sm text-gray-600">
			{m.fare_adult()}{subtitle ? ` · ${subtitle}` : ''}
		</p>
		{#if concessions.length > 0}
			<dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
				{#each concessions as concession (concession.key)}
					<div class="flex justify-between gap-2">
						<dt class="text-gray-600">{concession.label}</dt>
						<dd class="tabular-nums text-vesuvius-900">
							{formatHkd(concession.amount)}
						</dd>
					</div>
				{/each}
			</dl>
		{/if}
	{/if}
</section>

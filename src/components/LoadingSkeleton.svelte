<script lang="ts">
	export let skeletonHeightClass = 'h-16';
	export let numberOfSkeletonBar = 6;

	$: loadingBlocks = Array.from({ length: numberOfSkeletonBar }).map(
		(_, index) => index
	);
</script>

<div role="status" class="grid animate-pulse gap-4">
	{#each loadingBlocks as blockNumber (blockNumber)}
		<div
			class={`w-full rounded-xl bg-gray-200 ${skeletonHeightClass} ${
				$$props.class ?? ''
			}`}
		/>
	{/each}
	<span class="sr-only">加載中...</span>
</div>

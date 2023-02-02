<script lang="ts">
	export let skeletonHeightClass: string = 'h-16';
	export let numberOfSkeletonBar: number = 6;
</script>

<div role="status" class="gap-4 grid animate-pulse">
	{#each Array(numberOfSkeletonBar) as _}
		<div class={`w-full rounded-xl bg-gray-200 ${skeletonHeightClass} ${$$props.class ?? ''}`} />
	{/each}
	<span class="sr-only">加載中...</span>
</div>

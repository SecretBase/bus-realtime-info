<script lang="ts">
  const {
    skeletonHeightClass = 'h-16',
    numberOfSkeletonBar = 6,
    class: className = ''
  } = $props();

  const loadingBlocks = $derived(
    Array.from({ length: numberOfSkeletonBar }).map((_, index) => index)
  );
</script>

<div role="status" class="grid animate-pulse gap-4">
  {#each loadingBlocks as blockNumber (blockNumber)}
    <div
      class={`w-full rounded-xl bg-gray-200 ${skeletonHeightClass} ${className}`}
    ></div>
  {/each}
  <span class="sr-only">加載中...</span>
  </div>



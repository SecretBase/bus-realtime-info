<script lang="ts">
	import { getMtrLineName, mtrLines, type MtrLineId } from '$lib/api/mtr/data';

	const { lineId }: { lineId: MtrLineId } = $props();
	const line = $derived(mtrLines[lineId]);
</script>

<span
	class="text-vesuvius-900 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-medium"
>
	<span
		class="h-2.5 w-2.5 shrink-0 rounded-full"
		style:background-color={line.color}
		aria-hidden="true"
	></span>
	{getMtrLineName(lineId)}
</span>

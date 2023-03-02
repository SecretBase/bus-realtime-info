<script lang="ts">
	import type { CompanyId } from '$lib/api/types';
	import CompanyBadge from './companyBadge.svelte';

	export let companyId: CompanyId;
	export let route: string;
</script>

<h1
	class="w-full py-4 px-6 mb-4 text-2xl flex gap-2 items-center justify-center bg-white shadow-md rounded-xl"
>
	<CompanyBadge {companyId} />
	<span class="text-vesuvius-900 font-bold">{route}</span>
</h1>

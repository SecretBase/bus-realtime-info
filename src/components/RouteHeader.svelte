<script lang="ts">
	import type { CompanyId } from '$lib/api/ctb/types';
	import CompanyBadge from './companyBadge.svelte';

	const { companyId, route } = $props<{
		companyId: CompanyId;
		route: string;
	}>();
</script>

<a href={`/${companyId}/route/${route}`}>
	<h1
		class="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-2xl shadow-md"
		style:--tag={`header-${companyId}-${route}`}
	>
		<CompanyBadge {companyId} {route} />
		<span class="font-bold text-vesuvius-900">
			{route}
		</span>
	</h1>
</a>

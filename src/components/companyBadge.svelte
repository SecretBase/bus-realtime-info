<script lang="ts">
	import type { CompanyId } from '$lib/api/types';

	const { companyId, route } = $props<{
		companyId: CompanyId;
		route: string;
	}>();
</script>

<span
	class="rounded-full bg-vesuvius-300 px-2 py-1 text-vesuvius-800"
	style:--tag={`company-badge-${companyId}-${route}`}
>
	{companyId === 'CTB' ? '城巴' : companyId === 'NWFB' ? '新巴' : ''}
</span>

<script lang="ts">
	import type { CompanyId } from '$lib/api/types';

	export let companyId: CompanyId;
	export let route: string;
</script>

<span
	class="rounded-full py-1 px-2 bg-vesuvius-300 text-vesuvius-800"
	style:--tag={`company-badge-${companyId}-${route}`}
>
	{companyId === 'CTB' ? '城巴' : companyId === 'NWFB' ? '新巴' : ''}
</span>

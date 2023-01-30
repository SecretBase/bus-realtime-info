<script lang="ts">
	import type { CompanyId } from '$lib/api/types';

	export let companyId: CompanyId;
</script>

<span class="rounded-full py-1 px-2 text-white bg-vesuvius-300 text-vesuvius-800">
	{companyId === 'CTB' ? '城巴' : companyId === 'NWFB' ? '新巴' : ''}
</span>

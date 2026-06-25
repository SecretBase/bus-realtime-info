<script lang="ts">
	import type { Direction, OperatorId } from '$lib/api/ctb/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import CompanyBadge from './CompanyBadge.svelte';

	const { companyId, route, direction } = $props<{
		companyId: OperatorId;
		route: string;
		direction?: Direction;
	}>();
</script>

<a
	href={localizeHref(
		`/${companyId}/route/${route}${direction ? `?direction=${direction}` : ''}`
	)}
>
	<h1
		class="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-2xl shadow-md"
		style:--tag={`header-${companyId}-${route}`}
	>
		<CompanyBadge {companyId} />
		<span class="text-vesuvius-900 font-bold">
			{route}
		</span>
	</h1>
</a>

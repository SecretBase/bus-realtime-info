<script lang="ts">
  import type { Direction, OperatorId } from '$lib/api/ctb/types';
  import CompanyBadge from './CompanyBadge.svelte';

  const {
    companyId,
    route,
    direction
  } = $props<{
    companyId: OperatorId;
    route: string;
    direction?: Direction;
  }>();
</script>

<a
  href={`/${companyId}/route/${route}${direction ? `?direction=${direction}` : ''}`}
>
  <h1
    class="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-2xl shadow-md"
    style:--tag={`header-${companyId}-${route}`}
  >
    <CompanyBadge {companyId} />
    <span class="font-bold text-vesuvius-900">
      {route}
    </span>
  </h1>
</a>

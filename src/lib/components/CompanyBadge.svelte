<script lang="ts">
  const {
    companyId,
    class: className = '',
    ...rest
  } = $props<{
    companyId: 'CTB' | 'KMB' | 'NWFB';
    class?: string;
  } & Record<string, any>>();

  const companyNameMap = {
    CTB: '城巴',
    KMB: '九巴',
    NWFB: '新巴'
  } as const;

  const displayName = $derived(companyNameMap[companyId] ?? companyId);

  const colorClass = $derived(
    companyId === 'KMB'
      ? 'bg-red-100 text-red-800 border-red-200'
      : companyId === 'CTB' || companyId === 'NWFB'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-gray-100 text-gray-800 border-gray-200'
  );
</script>

<span
  class={`inline-flex items-center rounded-md border px-2 py-1 text-sm font-medium ${colorClass} ${className}`}
  {...rest}
>
  {displayName}
</span>



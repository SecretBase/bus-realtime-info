<script lang="ts">
	const {
		companyId,
		class: className = '',
		...rest
	} = $props<
		{
			companyId: 'CTB' | 'KMB';
			class?: string;
		} & Record<string, any>
	>();

	const displayName = $derived(companyId === 'KMB' ? '九巴' : '城巴');

	const colorClass = $derived(
		companyId === 'KMB'
			? 'bg-red-100 text-red-800 border-red-200'
			: 'bg-blue-100 text-blue-800 border-blue-200'
	);
</script>

<span
	class={`inline-flex items-center rounded-md border px-2 py-1 text-sm font-medium ${colorClass} ${className}`}
	{...rest}
>
	{displayName}
</span>

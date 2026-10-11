<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from './Button.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const isMtr = $derived($page.url.pathname.startsWith('/mtr'));
</script>

<div
	class="grid w-full auto-cols-fr grid-flow-col gap-2"
	role="navigation"
	aria-label={m.mode_switch_label()}
>
	<Button
		type="button"
		class="px-4 py-3"
		variant={isMtr ? 'secondary' : 'primary'}
		aria-current={!isMtr ? 'page' : undefined}
		onclick={() => goto(localizeHref('/'))}>{m.mode_bus()}</Button
	>
	<Button
		type="button"
		class="px-4 py-3"
		variant={isMtr ? 'primary' : 'secondary'}
		aria-current={isMtr ? 'page' : undefined}
		onclick={() => goto(localizeHref('/mtr'))}>{m.mode_mtr()}</Button
	>
</div>

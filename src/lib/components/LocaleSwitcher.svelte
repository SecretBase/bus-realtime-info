<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import {
		getLocale,
		locales,
		setLocale,
		type Locale
	} from '$lib/paraglide/runtime';

	function label(locale: Locale) {
		return locale === 'tc' ? m.locale_tc() : m.locale_en();
	}
</script>

<div
	class="flex gap-1 rounded-lg bg-white/10 p-1"
	role="group"
	aria-label="Language"
>
	{#each locales as locale}
		<button
			type="button"
			class={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
				getLocale() === locale
					? 'text-vesuvius-800 bg-white'
					: 'text-white/80 hover:text-white'
			}`}
			aria-current={getLocale() === locale ? 'true' : undefined}
			onclick={() => setLocale(locale)}
		>
			{label(locale)}
		</button>
	{/each}
</div>

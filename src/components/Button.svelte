<script lang="ts">
	type ButtonVariant = 'primary' | 'secondary';
	export let variant: ButtonVariant = 'primary';

	$: classnames = getButtonStyle(variant);

	function getButtonStyle(variant: ButtonVariant) {
		const baseClass = 'rounded p-2';
		let buttonClassnames = '';

		switch (variant) {
			case 'primary':
				buttonClassnames =
					'bg-vesuvius-400 hover:bg-vesuvius-400 active:bg-vesuvius-600 text-vesuvius-900';
				break;
			case 'secondary':
				buttonClassnames =
					'bg-vesuvius-100 hover:bg-vesuvius-200 active:bg-vesuvius-300 text-vesuvius-900';
				break;
			default:
				break;
		}

		return `${[baseClass, buttonClassnames, $$props.class]
			.filter(Boolean)
			.join(' ')}`;
	}
</script>

<button {...$$props} on:click class={classnames}> <slot /></button>

<script lang="ts">
  type ButtonVariant = 'primary' | 'secondary';

  const {
    variant = 'primary',
    class: className = '',
    type = 'button',
    children,
    onclick,
    ...rest
  } = $props<{
    variant: ButtonVariant;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children?: any;
  } & Record<string, any>>();

  const classnames = $derived(getButtonStyle(variant));

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

    return `${[baseClass, buttonClassnames, className]
      .filter(Boolean)
      .join(' ')}`;
  }
</script>

<button type={type} onclick={onclick} {...rest} class={classnames}>{@render children()}</button>



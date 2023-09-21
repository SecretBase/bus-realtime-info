<script lang="ts">
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		// @ts-expect-error do not have this type for now
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-expect-error do not have this type for now
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

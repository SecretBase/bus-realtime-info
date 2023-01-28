import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5000,
				enabled: browser
			}
		}
	});

	return { queryClient };
};

export const ssr = false;

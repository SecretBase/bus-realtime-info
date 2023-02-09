import { getRoutes, getRoutesQueryKey } from '$lib/api/routes';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { queryClient } = await parent();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: getRoutesQueryKey({ companyId: 'NWFB' }),
			queryFn: () =>
				getRoutes({
					companyId: 'NWFB'
				})
		}),
		queryClient.prefetchQuery({
			queryKey: getRoutesQueryKey({ companyId: 'CTB' }),
			queryFn: () =>
				getRoutes({
					companyId: 'CTB'
				})
		})
	]);
};

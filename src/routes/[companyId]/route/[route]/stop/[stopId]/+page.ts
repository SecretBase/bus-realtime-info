import { getRoute, getRoutesQueryKey } from '$lib/api/routes';
import { getStop, getStopQueryKey } from '$lib/api/stop';
import type { CompanyId } from '$lib/api/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { queryClient } = await parent();

	const { companyId, route, stopId } = params;

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: getRoutesQueryKey({
				companyId: companyId as CompanyId,
				route
			}),
			queryFn: () =>
				getRoute({
					companyId: companyId as CompanyId,
					route
				})
		}),
		queryClient.prefetchQuery({
			queryKey: getStopQueryKey({ stopId }),
			queryFn: () => getStop({ stopId })
		})
	]);
};

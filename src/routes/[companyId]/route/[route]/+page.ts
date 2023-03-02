import { getRoute, getRoutesQueryKey } from '$lib/api/routes';
import { getRouteStop, getRouteStopQueryKey } from '$lib/api/routeStop';
import type { CompanyId } from '$lib/api/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { queryClient } = await parent();

	const { companyId, route } = params;

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
			queryKey: getRouteStopQueryKey({
				companyId: companyId as CompanyId,
				route,
				direction: 'inbound'
			}),
			queryFn: () =>
				getRouteStop({
					companyId: companyId as CompanyId,
					route,
					direction: 'inbound'
				})
		})
	]);
};

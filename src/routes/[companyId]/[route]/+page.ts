import { getETA } from '$lib/api/eta';
import { getRoute, getRoutesQueryKey } from '$lib/api/routes';
import { getRouteStop, getRouteStopQueryKey } from '$lib/api/routeStop';
import { getStop } from '$lib/api/stop';
import type { APIResponse, CompanyId, RouteStop } from '$lib/api/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { queryClient } = await parent();

	const { companyId, route } = params;

	await queryClient.prefetchQuery({
		queryKey: getRoutesQueryKey({
			companyId: companyId as CompanyId,
			route
		}),
		queryFn: () =>
			getRoute({
				companyId: companyId as CompanyId,
				route
			})
	});

	await queryClient.prefetchQuery({
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
	});

	const data = queryClient.getQueryData<APIResponse<RouteStop[], 'Route'>>(
		getRouteStopQueryKey({
			companyId: companyId as CompanyId,
			route,
			direction: 'inbound'
		})
	);

	if (data) {
		await Promise.all([
			...data.data.map(({ stop }) =>
				queryClient.prefetchQuery({
					queryKey: ['stop', stop],
					queryFn: () => getStop({ stopId: stop })
				})
			),
			...data.data.map(({ stop }) =>
				queryClient.prefetchQuery({
					queryKey: [
						'eta',
						{
							companyId,
							stopId: stop,
							route
						}
					],

					queryFn: () =>
						getETA({
							companyId,
							stopId: stop,
							route
						})
				})
			)
		]);
	}

	// console.log(data);
};

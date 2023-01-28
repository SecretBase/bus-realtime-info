import type { APIResponse, CompanyId, Direction, RouteStop } from './types';

type Params = {
	companyId: CompanyId;
	route: string;
	direction: Direction;
};

export const getRouteStopQueryKey = (params: Params) => ['routeStop', params];

export const getRouteStop = async ({
	companyId,
	route,
	direction
}: Params): Promise<APIResponse<RouteStop[], 'Route'>> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${companyId}/${route}/${direction}`
	);
	return response.json();
};

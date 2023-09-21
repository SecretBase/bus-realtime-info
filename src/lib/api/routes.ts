import type { QueryKey } from '@tanstack/svelte-query';
import type { APIResponse, CompanyId, Route } from './types';

type Params = { companyId?: CompanyId; route?: string };

export const getRoutesQueryKey = (params: Params): QueryKey => [
	'routes',
	params
];

type GetRoutesParams = {
	companyId: CompanyId;
	route: string;
};

const route = async <T>({
	companyId,
	route
}: Partial<GetRoutesParams>): Promise<T> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route/${companyId}${
			route ? `/${route}` : ''
		}`
	);

	return response.json();
};

export const getRoute = (params: GetRoutesParams) =>
	route<APIResponse<Route, 'RouteList' | 'Route'>>(params);

export const getRoutes = (
	params: Partial<Pick<GetRoutesParams, 'companyId'>>
) => route<APIResponse<Route[], 'RouteList' | 'Route'>>(params);

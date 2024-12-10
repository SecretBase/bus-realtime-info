import type {
	APIResponse,
	Company,
	CompanyId,
	ETA,
	Route,
	Direction,
	RouteStop,
	Stop
} from './types';
import type { QueryKey } from '@tanstack/svelte-query';

export const getCompanyQueryKey = (companyId: CompanyId) => [
	'company',
	companyId
];

export const getCompany = async (
	companyId: CompanyId
): Promise<APIResponse<Company, 'Company'>> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/company/${companyId}`
	);

	return response.json();
};

type GetETAParams = {
	stopId: string;
	companyId: string;
	route: string;
};

export const getETAQueryKey = (params: GetETAParams) => ['eta', params];

export const getETA = async ({
	stopId,
	companyId,
	route
}: GetETAParams): Promise<APIResponse<ETA[], 'ETA'>> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${companyId}/${stopId}/${route}`
	);
	return response.json();
};

type GetRoutesParams = {
	companyId: CompanyId;
	route: string;
};

export const getRoutesQueryKey = (params: GetRoutesParams): QueryKey => [
	'routes',
	params
];

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

type GetRouteStopParams = {
	companyId: CompanyId;
	route: string;
	direction: Direction;
};

export const getRouteStopQueryKey = (params: GetRouteStopParams) => [
	'routeStop',
	params
];

export const getRouteStop = async ({
	companyId,
	route,
	direction
}: GetRouteStopParams): Promise<APIResponse<RouteStop[], 'Route'>> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${companyId}/${route}/${direction}`
	);
	return response.json();
};

type GetStopParams = {
	stopId: string;
};

export const getStopQueryKey = (params: GetStopParams) => ['stop', params];

export const getStop = async ({
	stopId
}: GetStopParams): Promise<APIResponse<Stop, 'Stop'>> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/stop/${stopId}`
	);
	return response.json();
};

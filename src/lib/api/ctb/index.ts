import type {
	Company,
	CompanyId,
	ETA,
	Route,
	Direction,
	RouteStop,
	Stop
} from './types';

import type { APIResponse } from '../common/types';
import type { QueryKey } from '@tanstack/svelte-query';

import { api } from '$lib/api/api';

const ctb = api.create({
	baseURL: 'https://rt.data.gov.hk/v2/transport/citybus'
});

export const getCompanyQueryKey = (companyId: CompanyId) => [
	'company',
	companyId
];

export const getCompany = async (companyId: CompanyId) => {
	const response = await ctb.get<APIResponse<Company, 'Company'>>(
		`https://rt.data.gov.hk/v2/transport/citybus/company/${companyId}`
	);
	return response.data;
};

type GetETAParams = {
	stopId: string;
	companyId: string;
	route: string;
};

export const getETAQueryKey = (params: GetETAParams) => ['eta', params];

export const getETA = async ({ stopId, companyId, route }: GetETAParams) => {
	const response = await ctb.get<APIResponse<ETA[], 'ETA'>>(
		`/eta/${companyId}/${stopId}/${route}`
	);
	return response.data;
};

type GetRoutesParams = {
	companyId: CompanyId;
	route?: string;
};

export const getRoutesQueryKey = (params: GetRoutesParams): QueryKey => [
	'routes',
	params
];

const route = async <T>({ companyId, route }: Partial<GetRoutesParams>) => {
	const response = await ctb.get<T>(
		`/route/${companyId}${route ? `/${route}` : ''}`
	);
	return response.data;
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
}: GetRouteStopParams) => {
	const response = await ctb.get<APIResponse<RouteStop[], 'Route'>>(
		`/route-stop/${companyId}/${route}/${direction}`
	);
	return response.data;
};

type GetStopParams = {
	stopId: string;
};

export const getStopQueryKey = (params: GetStopParams) => ['stop', params];

export const getStop = async ({ stopId }: GetStopParams) => {
	const response = await ctb.get<APIResponse<Stop, 'Stop'>>(`/stop/${stopId}`);
	return response.data;
};

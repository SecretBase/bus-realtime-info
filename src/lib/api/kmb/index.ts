import { api } from '../api';
import type { APIResponse } from '../common/types';
import type { Direction, Route, Stop } from './types';

const kmb = api.create({
	baseURL: 'https://data.etabus.gov.hk'
});

export const getRoutes = async () => {
	const response = await kmb.get<APIResponse<Route[], 'RouteList'>>(
		'/v1/transport/kmb/route'
	);
	return response.data;
};

type GetRouteParams = {
	route: string;
	direction: Direction;
	serviceType: string;
};

export const getRoute = async (params: GetRouteParams) => {
	const response = await kmb.get<APIResponse<Route, 'Route'>>(
		`/v1/transport/kmb/route/${params.route}/${params.direction}/${params.serviceType}`
	);

	return response.data;
};

export const getStops = async () => {
	const response = await kmb.get<APIResponse<Stop[], 'Stop'>>(
		'/v1/transport/kmb/stop'
	);
	return response.data;
};

type GetStopParams = {
	stop: string;
};
export const getStop = async (params: GetStopParams) => {
	const response = await kmb.get(`/v1/transport/kmb/stop/${params.stop}`);
	return response.data;
};

type GetRouteStopParams = {
	route: string;
	direction: Direction;
	serviceType: '1';
};

export const getRouteStop = async (params: GetRouteStopParams) => {
	const response = await kmb.get(
		`/v1/transport/kmb/route-stop/${params.route}/${params.direction}/${params.serviceType}`
	);
	return response.data;
};

type GetETAParams = { stop: string };
export const getETA = async (params: GetETAParams) => {
	const response = await kmb.get(`/v1/transport/kmb/stop-eta/${params.stop}`);
	return response.data;
};

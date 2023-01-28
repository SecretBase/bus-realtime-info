import type { APIResponse, Stop } from './types';

type Params = {
	stopId: string;
};

export const getStopQueryKey = (params: Params) => ['stop', params];

export const getStop = async ({ stopId }: Params): Promise<APIResponse<Stop, 'Stop'>> => {
	const response = await fetch(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/stop/${stopId}`);
	return response.json();
};

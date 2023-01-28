import type { APIResponse, ETA } from './types';

type Params = {
	stopId: string;
	companyId: string;
	route: string;
};

export const getETAQueryKey = (params: Params) => ['eta', params];

export const getETA = async ({
	stopId,
	companyId,
	route
}: Params): Promise<APIResponse<ETA[], 'ETA'>> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${companyId}/${stopId}/${route}`
	);
	return response.json();
};

export type CompanyId = 'KMB';

export type Direction = 'inbound' | 'outbound';
export type DirectionShort = 'O' | 'I';

export type Route = {
	bound: DirectionShort;
	dest_en: string;
	dest_sc: string;
	dest_tc: string;
	orig_en: string;
	orig_sc: string;
	orig_tc: string;
	route: string;
	service_type: '1';
};

export type Stop = {
	lat: number;
	long: number;
	name_en: string;
	name_sc: string;
	name_tc: string;
	stop: string;
};

export type RouteStop = {
	bound: DirectionShort;
	co: CompanyId;
	route: string;
	seq: number;
	service_type: '1';
	stop: string;
};

export type ETA = {
	co: CompanyId;
	dest_en: string;
	dest_sc: string;
	dest_tc: string;
	dir: DirectionShort;
	eta_seq: number;
	eta: string;
	rmk_en: string;
	rmk_sc: string;
	rmk_tc: string;
	route: string;
	seq: number;
	service_type: 1;
	stop: string;
};

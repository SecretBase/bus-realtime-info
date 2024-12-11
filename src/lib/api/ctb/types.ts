export type ETA = {
	co: string;
	data_timestamp: string;
	dest_en: string;
	dest_sc: string;
	dest_tc: string;
	dir: string;
	eta_seq: number;
	eta: string;
	rmk_en: string;
	rmk_sc: string;
	rmk_tc: string;
	route: string;
	seq: number;
	stop: string;
};

export type Route = {
	co: CompanyId;
	data_timestamp: string;
	dest_en: string;
	dest_sc: string;
	dest_tc: string;
	orig_en: string;
	orig_sc: string;
	orig_tc: string;
	route: string;
};

export type RouteStop = {
	co: CompanyId;
	data_timestamp: string;
	dir: string;
	route: string;
	seq: number;
	stop: string;
};

export type Stop = {
	data_timestamp: string;
	lat: number;
	long: number;
	name_en: string;
	name_sc: string;
	name_tc: string;
	stop: string;
};

export type CompanyId = 'CTB';

export type Company = {
	co: CompanyId;
	name_tc: string;
	name_en: string;
	url: string;
	name_sc: string;
	data_timestamp: string;
};

export type Direction = 'inbound' | 'outbound';

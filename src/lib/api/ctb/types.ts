export type APIResponse<Data, ApiType extends string> = {
	type: ApiType;
	version: '1.1';
	generated_timestamp: string;
	data: Data;
};

export type ETA = {
	co: string;
	route: string;
	dir: string;
	seq: number;
	stop: string;
	dest_tc: string;
	dest_sc: string;
	dest_en: string;
	eta_seq: number;
	eta: string;
	rmk_tc: string;
	rmk_sc: string;
	rmk_en: string;
	data_timestamp: string;
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
	stop: string;
	name_tc: string;
	name_en: string;
	name_sc: string;
	lat: number;
	long: number;
	data_timestamp: string;
};

export type CompanyId = 'NWFB' | 'CTB';

export type Company = {
	co: CompanyId;
	name_tc: string;
	name_en: string;
	url: string;
	name_sc: string;
	data_timestamp: string;
};

export type Direction = 'inbound' | 'outbound';

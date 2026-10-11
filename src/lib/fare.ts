import type { Direction, OperatorId } from '$lib/api/ctb/types';
import {
	mtrLineStations,
	mtrStations,
	type MtrLineId,
	type MtrStationId
} from '$lib/api/mtr/data';
import {
	parseBusFareTable,
	parseMtrFareTable,
	type MtrFareKind
} from './fare-parse';

export type { BusFare, MtrFare, MtrFareKind } from './fare-parse';
export {
	formatHkd,
	lookupBusFare,
	lookupMtrFare,
	mtrFareConcessions,
	parseBusFareTable,
	parseCsv,
	parseMtrFareTable
} from './fare-parse';

export const BUS_FARE_XML_URL =
	'https://static.data.gov.hk/td/routes-fares-xml/ROUTE_BUS.xml';

export const FARE_STALE_MS = 24 * 60 * 60 * 1000;

const AEL_FARE_NAME: Partial<Record<MtrStationId, string>> = {
	HOK: 'HongKong',
	KOW: 'Kowloon',
	TSY: 'Tsing Yi',
	AIR: 'Airport',
	AWE: 'AsiaWorld-Expo'
};

export const getMtrFareTableQueryKey = (kind: MtrFareKind) => [
	'fare-table',
	'mtr',
	kind
];

export const getBusFareTableQueryKey = () => ['fare-table', 'bus'];

export function mtrFareKind(line: string): MtrFareKind {
	return line === 'AEL' ? 'ael' : 'mtr';
}

export function mtrFareName(station: MtrStationId, line?: string) {
	if (line === 'AEL' && AEL_FARE_NAME[station]) {
		return AEL_FARE_NAME[station];
	}
	return mtrStations[station].name;
}

export function mtrFareDestinations(line: MtrLineId, from: MtrStationId) {
	const ids =
		line === 'AEL'
			? mtrLineStations.AEL
			: (Object.keys(mtrStations) as MtrStationId[]).filter(
					(id) => id !== 'AIR' && id !== 'AWE'
				);
	return ids.filter((id) => id !== from);
}

export function fareDirectionEnds(
	companyId: OperatorId,
	direction: Direction,
	route: {
		orig_tc: string;
		orig_en: string;
		dest_tc: string;
		dest_en: string;
	}
) {
	const towardsOrigin =
		companyId === 'CTB' ? direction === 'inbound' : direction === 'outbound';
	return towardsOrigin
		? { destTc: route.orig_tc, destEn: route.orig_en }
		: { destTc: route.dest_tc, destEn: route.dest_en };
}

export async function getMtrFareTable(kind: MtrFareKind) {
	const file =
		kind === 'ael' ? 'airport_express_fares.csv' : 'mtr_lines_fares.csv';
	const response = await fetch(`/api/fare/mtr?file=${file}`);
	if (!response.ok) {
		throw new Error('Unable to load MTR fares');
	}
	return parseMtrFareTable(await response.text(), kind);
}

export async function getBusFareTable() {
	const response = await fetch(BUS_FARE_XML_URL);
	if (!response.ok) {
		throw new Error('Unable to load bus fares');
	}
	return parseBusFareTable(await response.text());
}

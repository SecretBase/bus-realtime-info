import { uniqueEtas } from './unique-eta';

// Frozen 213E stop-eta shape: KMB lists the same arrivals under service_type 1 and 2.
const kmb213eStopEta = [
	{
		route: '213E',
		dir: 'O',
		service_type: 1,
		dest_tc: '九龍站',
		eta: '2026-10-31T17:45:00+08:00',
		rmk_tc: '原定班次'
	},
	{
		route: '213E',
		dir: 'O',
		service_type: 1,
		dest_tc: '九龍站',
		eta: '2026-10-31T18:05:00+08:00',
		rmk_tc: '原定班次'
	},
	{
		route: '213E',
		dir: 'O',
		service_type: 1,
		dest_tc: '九龍站',
		eta: '2026-10-31T18:25:00+08:00',
		rmk_tc: '原定班次'
	},
	{
		route: '213E',
		dir: 'O',
		service_type: 2,
		dest_tc: '九龍站',
		eta: '2026-10-31T17:45:00+08:00',
		rmk_tc: '原定班次'
	},
	{
		route: '213E',
		dir: 'O',
		service_type: 2,
		dest_tc: '九龍站',
		eta: '2026-10-31T18:05:00+08:00',
		rmk_tc: '原定班次'
	},
	{
		route: '213E',
		dir: 'O',
		service_type: 2,
		dest_tc: '九龍站',
		eta: '2026-10-31T18:25:00+08:00',
		rmk_tc: '原定班次'
	}
];

const collapsed = uniqueEtas(kmb213eStopEta);
if (collapsed.length !== 3) {
	throw new Error(`213E duplicates should collapse to 3, got ${collapsed.length}`);
}
if (collapsed.some((eta) => eta.service_type !== 1)) {
	throw new Error('First copy of each arrival should be kept');
}

const withSpecial = uniqueEtas([
	...kmb213eStopEta,
	{
		route: '213E',
		dir: 'O',
		service_type: 2,
		dest_tc: '九龍站',
		eta: '2026-10-31T18:40:00+08:00',
		rmk_tc: '特別班次'
	}
]);
if (withSpecial.length !== 4) {
	throw new Error(
		`Distinct special-service time should be kept, got ${withSpecial.length}`
	);
}

const differentDest = uniqueEtas([
	{
		route: '213E',
		dir: 'O',
		dest_tc: '九龍站',
		eta: '2026-10-31T17:45:00+08:00'
	},
	{
		route: '213E',
		dir: 'O',
		dest_tc: '安達臣',
		eta: '2026-10-31T17:45:00+08:00'
	}
]);
if (differentDest.length !== 2) {
	throw new Error('Same time to different destinations should both stay');
}

const differentDir = uniqueEtas([
	{
		route: '213E',
		dir: 'O',
		dest_tc: '九龍站',
		eta: '2026-10-31T17:45:00+08:00'
	},
	{
		route: '213E',
		dir: 'I',
		dest_tc: '九龍站',
		eta: '2026-10-31T17:45:00+08:00'
	}
]);
if (differentDir.length !== 2) {
	throw new Error('Same time on opposite bounds should both stay');
}

console.log('eta.check ok');

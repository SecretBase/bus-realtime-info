import { compareRouteIds, parseRouteId, sortFavorites } from './route-sort';

function assertEqual(actual: unknown, expected: unknown, label: string) {
	if (JSON.stringify(actual) !== JSON.stringify(expected)) {
		throw new Error(
			`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
		);
	}
}

assertEqual(
	['N619', '1A', '11', 'E22', '2', 'A22', '101', '1'].sort(compareRouteIds),
	['1', '1A', '2', '11', '101', 'A22', 'E22', 'N619'],
	'HK bus route natural order'
);

assertEqual(
	parseRouteId('E22A'),
	{ prefix: 'E', number: 22, suffix: 'A' },
	'E22A parse'
);
assertEqual(
	parseRouteId('88R'),
	{ prefix: '', number: 88, suffix: 'R' },
	'88R parse'
);
assertEqual(parseRouteId('TWL'), null, 'MTR line has no route number');

const byRoute = sortFavorites(
	[
		{ companyId: 'MTR', routeId: 'TWL', stopId: 'TST' },
		{ companyId: 'KMB', routeId: '11', stopId: 'B' },
		{ companyId: 'CTB', routeId: '2', stopId: 'A' },
		{ companyId: 'MTR', routeId: 'ISL', stopId: 'ADM' },
		{ companyId: 'CTB', routeId: '1A', stopId: 'C' },
		{ companyId: 'KMB', routeId: '1', stopId: 'D' }
	],
	'route'
).map((stop) => `${stop.companyId}:${stop.routeId}`);

assertEqual(
	byRoute,
	['KMB:1', 'CTB:1A', 'CTB:2', 'KMB:11', 'MTR:ISL', 'MTR:TWL'],
	'bus routes before MTR, MTR by line'
);

const missingLast = sortFavorites(
	[
		{ companyId: 'CTB', routeId: '2', stopId: 'old' },
		{ companyId: 'CTB', routeId: '1', stopId: 'new', lastViewedAt: 50 },
		{ companyId: 'KMB', routeId: '3', stopId: 'newer', lastViewedAt: 100 }
	],
	'recent'
).map((stop) => stop.stopId);

assertEqual(
	missingLast,
	['newer', 'new', 'old'],
	'recency descending; missing timestamps last'
);

const sameRouteStops = sortFavorites(
	[
		{ companyId: 'CTB', routeId: '1', stopId: 'Z' },
		{ companyId: 'CTB', routeId: '1', stopId: 'A' }
	],
	'route'
).map((stop) => stop.stopId);

assertEqual(sameRouteStops, ['A', 'Z'], 'same route sorts by stopId');

console.log('route-sort.check ok');

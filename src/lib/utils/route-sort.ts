export type FavoriteSortMode = 'recent' | 'route';

export type SortableFavorite = {
	companyId: string;
	routeId: string;
	stopId: string;
	lastViewedAt?: number;
};

const ROUTE_ID = /^([A-Za-z]*)(\d+)([A-Za-z]*)$/;

type ParsedRoute = {
	prefix: string;
	number: number;
	suffix: string;
};

export function parseRouteId(routeId: string): ParsedRoute | null {
	const match = ROUTE_ID.exec(routeId.trim());
	if (!match) return null;
	return {
		prefix: match[1].toUpperCase(),
		number: Number(match[2]),
		suffix: match[3].toUpperCase()
	};
}

export function compareRouteIds(a: string, b: string): number {
	const parsedA = parseRouteId(a);
	const parsedB = parseRouteId(b);
	if (parsedA && parsedB) {
		if (parsedA.prefix !== parsedB.prefix) {
			return parsedA.prefix < parsedB.prefix ? -1 : 1;
		}
		if (parsedA.number !== parsedB.number)
			return parsedA.number - parsedB.number;
		if (parsedA.suffix !== parsedB.suffix) {
			return parsedA.suffix < parsedB.suffix ? -1 : 1;
		}
		return 0;
	}
	if (parsedA) return -1;
	if (parsedB) return 1;
	return a.localeCompare(b, 'en', { sensitivity: 'base' });
}

function routeGroup(stop: SortableFavorite): number {
	if (stop.companyId === 'MTR') return 2;
	return parseRouteId(stop.routeId) ? 0 : 1;
}

export function compareFavoritesByRoute(
	a: SortableFavorite,
	b: SortableFavorite
): number {
	const groupDiff = routeGroup(a) - routeGroup(b);
	if (groupDiff !== 0) return groupDiff;
	const routeDiff = compareRouteIds(a.routeId, b.routeId);
	if (routeDiff !== 0) return routeDiff;
	if (a.companyId !== b.companyId)
		return a.companyId.localeCompare(b.companyId);
	return a.stopId.localeCompare(b.stopId);
}

export function compareFavoritesByRecent(
	a: SortableFavorite,
	b: SortableFavorite
): number {
	return (b.lastViewedAt ?? 0) - (a.lastViewedAt ?? 0);
}

export function sortFavorites<T extends SortableFavorite>(
	stops: T[],
	mode: FavoriteSortMode
): T[] {
	const copy = [...stops];
	copy.sort(
		mode === 'route' ? compareFavoritesByRoute : compareFavoritesByRecent
	);
	return copy;
}

export function isFavoriteSortMode(value: unknown): value is FavoriteSortMode {
	return value === 'recent' || value === 'route';
}

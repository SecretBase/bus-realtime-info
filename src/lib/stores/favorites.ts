import { persisted } from 'svelte-local-storage-store';
import type { OperatorId } from '../api/ctb/types';
import { isFavoriteSortMode, type FavoriteSortMode } from '../utils/route-sort';

export type { FavoriteSortMode };

export type FavoriteStop = {
	companyId: OperatorId | 'MTR';
	routeId: string;
	stopId: string;
	direction?: string;
	lastViewedAt?: number;
};

export const favorites = persisted<{ stops: FavoriteStop[] }>('favorites', {
	stops: []
});

export const favoriteSortMode = persisted<FavoriteSortMode>(
	'favorite-sort-mode',
	'recent'
);

export function resolveFavoriteSortMode(value: unknown): FavoriteSortMode {
	return isFavoriteSortMode(value) ? value : 'recent';
}

export function touchFavorite(
	match: Pick<FavoriteStop, 'companyId' | 'routeId' | 'stopId'>
) {
	const now = Date.now();
	favorites.update((current) => {
		let changed = false;
		const stops = current.stops.map((stop) => {
			if (
				stop.companyId !== match.companyId ||
				stop.routeId !== match.routeId ||
				stop.stopId !== match.stopId
			) {
				return stop;
			}
			changed = true;
			return { ...stop, lastViewedAt: now };
		});
		return changed ? { ...current, stops } : current;
	});
}

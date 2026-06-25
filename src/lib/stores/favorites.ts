import { persisted } from 'svelte-local-storage-store';
import type { OperatorId } from '../api/ctb/types';

export type FavoriteStop = {
	companyId: OperatorId;
	routeId: string;
	stopId: string;
	direction?: string;
};

export const favorites = persisted<{ stops: FavoriteStop[] }>('favorites', {
	stops: []
});

import { persisted } from 'svelte-local-storage-store';
import type { CompanyId } from './api/ctb/types';

export type Stop = {
	companyId: CompanyId;
	routeId: string;
	stopId: string;
};

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const favorites = persisted<{ stops: Stop[] }>('favorites', {
	stops: []
});

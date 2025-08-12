import { persisted } from 'svelte-local-storage-store';
import type { CompanyId } from '../api/ctb/types';

export type FavoriteStop = {
  companyId: CompanyId;
  routeId: string;
  stopId: string;
  direction?: string;
};

export const favorites = persisted<{ stops: FavoriteStop[] }>('favorites', {
  stops: []
});



import { differenceInMinutes } from 'date-fns';
import * as m from '$lib/paraglide/messages.js';
import type { ETA } from '../api/ctb/types';

export function getDifferentInMinutesByTimeStamp(time: number) {
	return Math.max(0, differenceInMinutes(time, new Date()));
}

export function formatEtaMinutes(time: number) {
	return m.eta_minutes({ minutes: getDifferentInMinutesByTimeStamp(time) });
}

export function isArrivalMoreThanOneMinuteAway(etaDate: Date) {
	const ONE_MINUTE = 1;
	return getDifferentInMinutesByTimeStamp(etaDate.getTime()) > ONE_MINUTE;
}

export function sortEta(etas?: ETA[]) {
	return etas
		?.map((eta) => {
			return {
				...eta,
				etaDate: new Date(eta.eta)
			} as ETA & { etaDate: Date };
		})
		.sort((etaA, etaB) => {
			if (etaA.etaDate > etaB.etaDate) return 1;
			if (etaA.etaDate < etaB.etaDate) return -1;
			return 0;
		});
}

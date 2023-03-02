import { differenceInMinutes } from 'date-fns';
import type { ETA } from './api/types';

export function getDifferentInMinutesByTimeStamp(time: number) {
	return Math.max(0, differenceInMinutes(time, new Date()));
}

export function isArrivalTimeLessThenOneMinutes(etaDate: Date) {
	const ONE_MINUTE = 1;
	return getDifferentInMinutesByTimeStamp(etaDate.getTime()) > ONE_MINUTE;
}

export function sortEta(etas?: ETA[]) {
	return etas
		?.map((eta) => {
			return {
				...eta,
				etaDate: new Date(eta.eta)
			};
		})
		.sort((etaA, etaB) => {
			if (etaA.etaDate > etaB.etaDate) return 1;
			if (etaA.etaDate < etaB.etaDate) return -1;
			return 0;
		});
}

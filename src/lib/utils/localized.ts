import { getLocale } from '$lib/paraglide/runtime';
import type { Locale } from 'date-fns';
import { enUS, zhHK } from 'date-fns/locale';

export function pickLocalizedText(tc: string, en: string) {
	return getLocale() === 'en' ? en : tc;
}

export function getStopName(stop: { name_tc: string; name_en: string }) {
	return pickLocalizedText(stop.name_tc, stop.name_en);
}

export function getDestination(item: { dest_tc: string; dest_en: string }) {
	return pickLocalizedText(item.dest_tc, item.dest_en);
}

export function getOrigin(item: { orig_tc: string; orig_en: string }) {
	return pickLocalizedText(item.orig_tc, item.orig_en);
}

export function getRemark(item: { rmk_tc: string; rmk_en: string }) {
	return pickLocalizedText(item.rmk_tc, item.rmk_en);
}

export function getDateFnsLocale(): Locale {
	return getLocale() === 'en' ? enUS : zhHK;
}

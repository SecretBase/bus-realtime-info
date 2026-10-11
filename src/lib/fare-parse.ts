export type MtrFare = {
	fromName: string;
	toName: string;
	adult: number;
	student?: number;
	child?: number;
	elderly?: number;
	pwd?: number;
	joyyou?: number;
};

export type BusFare = {
	company: string;
	route: string;
	fromTc: string;
	fromEn: string;
	toTc: string;
	toEn: string;
	adult: number;
	mode: string;
	special: string;
};

export type MtrFareKind = 'mtr' | 'ael';

export function formatHkd(amount: number) {
	return `$${amount}`;
}

export function parseCsv(text: string): Record<string, string>[] {
	const lines = text
		.replace(/^\uFEFF/, '')
		.trim()
		.split(/\r?\n/);
	const headers = splitCsvLine(lines[0] ?? '').map((header) => header.trim());
	return lines.slice(1).flatMap((line) => {
		if (!line.trim()) return [];
		const cols = splitCsvLine(line);
		const row: Record<string, string> = {};
		headers.forEach((header, index) => {
			row[header] = (cols[index] ?? '').trim();
		});
		return [row];
	});
}

function splitCsvLine(line: string) {
	const cols: string[] = [];
	let current = '';
	let quoted = false;
	for (const char of line) {
		if (char === '"') {
			quoted = !quoted;
			continue;
		}
		if (char === ',' && !quoted) {
			cols.push(current);
			current = '';
			continue;
		}
		current += char;
	}
	cols.push(current);
	return cols;
}

function optionalAmount(value: string | undefined) {
	const amount = Number(value);
	return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

export function parseMtrFareTable(csv: string, kind: MtrFareKind): MtrFare[] {
	return parseCsv(csv).flatMap((row) => {
		const fromName = kind === 'ael' ? row.ST_FROM : row.SRC_STATION_NAME;
		const toName = kind === 'ael' ? row.ST_TO : row.DEST_STATION_NAME;
		const adult = Number(row.OCT_ADT_FARE);
		if (
			!fromName ||
			!toName ||
			fromName === toName ||
			!Number.isFinite(adult)
		) {
			return [];
		}
		return [
			{
				fromName,
				toName,
				adult,
				student: optionalAmount(row.OCT_STD_FARE),
				child: optionalAmount(
					kind === 'ael' ? row.OCT_CHD_FARE : row.OCT_CON_CHILD_FARE
				),
				elderly: optionalAmount(row.OCT_CON_ELDERLY_FARE),
				pwd: optionalAmount(row.OCT_CON_PWD_FARE),
				joyyou: optionalAmount(row.OCT_JOYYOU_SIXTY_FARE)
			}
		];
	});
}

export function lookupMtrFare(
	table: MtrFare[] | undefined,
	fromName: string,
	toName: string
) {
	return table?.find(
		(row) => row.fromName === fromName && row.toName === toName
	);
}

const CONCESSION_KEYS = [
	'student',
	'child',
	'elderly',
	'pwd',
	'joyyou'
] as const;

export function mtrFareConcessions(
	fare: MtrFare | undefined,
	labels: Record<(typeof CONCESSION_KEYS)[number], string>
) {
	if (!fare) return [];
	return CONCESSION_KEYS.flatMap((key) => {
		const amount = fare[key];
		return amount ? [{ key, label: labels[key], amount }] : [];
	});
}

function xmlField(block: string, tag: string) {
	return (
		block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? ''
	);
}

export function parseBusFareTable(xml: string): BusFare[] {
	const rows: BusFare[] = [];
	for (const match of xml.matchAll(/<ROUTE>([\s\S]*?)<\/ROUTE>/g)) {
		const block = match[1] ?? '';
		const company = xmlField(block, 'COMPANY_CODE');
		if (!/(?:^|\+)(?:KMB|CTB|LWB)(?:\+|$)/.test(company)) continue;
		const adult = Number(xmlField(block, 'FULL_FARE'));
		if (!Number.isFinite(adult)) continue;
		rows.push({
			company,
			route: xmlField(block, 'ROUTE_NAMEE'),
			fromTc: xmlField(block, 'LOC_START_NAMEC'),
			fromEn: xmlField(block, 'LOC_START_NAMEE'),
			toTc: xmlField(block, 'LOC_END_NAMEC'),
			toEn: xmlField(block, 'LOC_END_NAMEE'),
			adult,
			mode: xmlField(block, 'SERVICE_MODE'),
			special: xmlField(block, 'SPECIAL_TYPE')
		});
	}
	return rows;
}

function normalizeName(value: string) {
	return value.toUpperCase().replace(/[\s()（）[\]]/g, '');
}

function companyMatches(code: string, company: string) {
	return code.split('+').includes(company);
}

export function lookupBusFare(
	table: BusFare[] | undefined,
	company: string,
	route: string,
	destTc?: string,
	destEn?: string
) {
	if (!table) return;
	const routeKey = route.toUpperCase();
	const dests = [destTc, destEn]
		.filter(Boolean)
		.map((name) => normalizeName(name as string));
	const matches = table.filter(
		(row) =>
			companyMatches(row.company, company) &&
			row.route.toUpperCase() === routeKey
	);
	if (matches.length === 0) return;

	let best = matches[0];
	let bestScore = -1;
	for (const row of matches) {
		let score = 0;
		if (
			dests.includes(normalizeName(row.toTc)) ||
			dests.includes(normalizeName(row.toEn))
		) {
			score += 10;
		}
		if (row.mode === 'R') score += 2;
		if (row.special === '0') score += 1;
		if (score > bestScore) {
			best = row;
			bestScore = score;
		}
	}
	return best;
}

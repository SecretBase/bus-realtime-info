import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// ponytail: opendata.mtr.com.hk has no CORS; allowlist proxy only
const FILES = new Set(['mtr_lines_fares.csv', 'airport_express_fares.csv']);

export const GET: RequestHandler = async ({ url }) => {
	const file = url.searchParams.get('file') ?? '';
	if (!FILES.has(file)) {
		error(400, 'Invalid fare file');
	}

	const response = await fetch(`https://opendata.mtr.com.hk/data/${file}`);
	if (!response.ok) {
		error(502, 'Fare source unavailable');
	}

	return new Response(response.body, {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'cache-control': 'public, max-age=86400, stale-while-revalidate=86400'
		}
	});
};

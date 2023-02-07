/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version, prerendered } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const precache_list = [
	'/', // Attention: might not be ideal for your use case - read more below.
	...build,
	...files,
	...prerendered
].map((s) => ({
	url: s,
	revision: CACHE
}));

precacheAndRoute(precache_list);
cleanupOutdatedCaches();

registerRoute(
	({ url }) =>
		url.origin === 'https://rt.data.gov.hk' &&
		url.pathname.startsWith('/v1.1/transport/citybus-nwfb/route/'),
	new StaleWhileRevalidate({
		cacheName: 'api-cache',
		plugins: [new CacheableResponsePlugin({ statuses: [200] })]
	})
);

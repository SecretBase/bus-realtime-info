<script lang="ts">
	import type { Map, Marker } from 'leaflet';
	import Button from '$lib/components/Button.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const {
		lat,
		lng,
		label = ''
	} = $props<{
		lat: number | string;
		lng: number | string;
		label?: string;
	}>();

	type LocationState = 'idle' | 'tracking' | 'denied' | 'unavailable';

	const coordLat = $derived(Number(lat));
	const coordLng = $derived(Number(lng));

	const hasValidCoords = $derived(
		Number.isFinite(coordLat) &&
			Number.isFinite(coordLng) &&
			coordLat !== 0 &&
			coordLng !== 0
	);

	let locationState = $state<LocationState>('idle');

	const geoSupported = $derived(
		typeof navigator !== 'undefined' && 'geolocation' in navigator
	);

	const mapAriaLabel = $derived(
		locationState === 'tracking'
			? m.map_stop_with_user()
			: label
				? m.map_stop_label({ label })
				: m.map_stop()
	);

	const locationErrorMessage = $derived(
		locationState === 'denied'
			? m.location_denied()
			: locationState === 'unavailable'
				? m.location_unavailable()
				: ''
	);

	const osmUrl = $derived(
		`https://www.openstreetmap.org/?mlat=${coordLat}&mlon=${coordLng}#map=18/${coordLat}/${coordLng}`
	);

	let mapContainer = $state<HTMLDivElement | undefined>();

	let mapInstance: Map | undefined;
	let userMarker: Marker | undefined;
	let leafletModule: typeof import('leaflet') | undefined;
	let watchId: number | null = null;
	let currentHeading = 0;
	let orientationHandler: ((event: DeviceOrientationEvent) => void) | null =
		null;

	function createUserIcon(L: typeof import('leaflet'), heading: number) {
		return L.divIcon({
			className: '',
			html: `<div style="width:24px;height:24px;transform:rotate(${heading}deg);transform-origin:center center;">
				<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 2 L20 20 L12 15 L4 20 Z" fill="#3b82f6" stroke="#2563eb" stroke-width="1.5" stroke-linejoin="round" />
				</svg>
			</div>`,
			iconSize: [24, 24],
			iconAnchor: [12, 12]
		});
	}

	function resolveHeading(coords: GeolocationCoordinates) {
		if (Number.isFinite(coords.heading) && coords.heading !== null) {
			return coords.heading;
		}
		return currentHeading;
	}

	function updateMarkerHeading(heading: number) {
		if (!userMarker || !leafletModule) return;
		currentHeading = heading;
		userMarker.setIcon(createUserIcon(leafletModule, heading));
	}

	function stopOrientationListener() {
		if (orientationHandler) {
			window.removeEventListener('deviceorientation', orientationHandler);
			orientationHandler = null;
		}
	}

	async function enableCompass() {
		if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window))
			return;

		const orientationEvent =
			DeviceOrientationEvent as typeof DeviceOrientationEvent & {
				requestPermission?: () => Promise<'granted' | 'denied'>;
			};

		if (typeof orientationEvent.requestPermission === 'function') {
			try {
				const state = await orientationEvent.requestPermission();
				if (state !== 'granted') return;
			} catch {
				return;
			}
		}

		stopOrientationListener();
		orientationHandler = (event: DeviceOrientationEvent) => {
			const iosHeading = (
				event as DeviceOrientationEvent & { webkitCompassHeading?: number }
			).webkitCompassHeading;

			if (typeof iosHeading === 'number') {
				updateMarkerHeading(iosHeading);
			} else if (event.absolute && event.alpha !== null) {
				updateMarkerHeading(360 - event.alpha);
			}
		};
		window.addEventListener('deviceorientation', orientationHandler);
	}

	function clearWatch() {
		if (watchId !== null) {
			navigator.geolocation.clearWatch(watchId);
			watchId = null;
		}
	}

	function removeUserMarker() {
		userMarker?.remove();
		userMarker = undefined;
	}

	function updateUserPosition(
		latitude: number,
		longitude: number,
		heading: number
	) {
		if (!mapInstance || !leafletModule) return;

		const L = leafletModule;
		currentHeading = heading;
		const icon = createUserIcon(L, heading);

		if (!userMarker) {
			userMarker = L.marker([latitude, longitude], {
				icon,
				zIndexOffset: 1000
			}).addTo(mapInstance);
		} else {
			userMarker.setLatLng([latitude, longitude]);
			userMarker.setIcon(icon);
		}

		mapInstance.setView([latitude, longitude], mapInstance.getZoom());
		locationState = 'tracking';
	}

	function onPositionError(error: GeolocationPositionError) {
		clearWatch();
		stopOrientationListener();
		removeUserMarker();
		mapInstance?.setView([coordLat, coordLng], 17);

		if (error.code === error.PERMISSION_DENIED) {
			locationState = 'denied';
		} else {
			locationState = 'unavailable';
		}
	}

	function startTracking() {
		if (!geoSupported) return;

		clearWatch();
		void enableCompass();
		watchId = navigator.geolocation.watchPosition(
			(position) => {
				updateUserPosition(
					position.coords.latitude,
					position.coords.longitude,
					resolveHeading(position.coords)
				);
			},
			onPositionError,
			{ enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
		);
	}

	function stopTracking() {
		clearWatch();
		stopOrientationListener();
		currentHeading = 0;
		removeUserMarker();
		locationState = 'idle';
		mapInstance?.setView([coordLat, coordLng], 17);
	}

	$effect(() => {
		const container = mapContainer;
		if (!hasValidCoords || !container) return;

		let cancelled = false;

		(async () => {
			const L = await import('leaflet');
			leafletModule = L;

			if (cancelled) return;

			const iconUrl = (await import('leaflet/dist/images/marker-icon.png'))
				.default;
			const shadowUrl = (await import('leaflet/dist/images/marker-shadow.png'))
				.default;

			const defaultIcon = L.icon({
				iconUrl,
				shadowUrl,
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34]
			});
			L.Marker.prototype.options.icon = defaultIcon;

			if (cancelled) return;

			const map = L.map(container, {
				scrollWheelZoom: false
			}).setView([coordLat, coordLng], 17);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors (Bus ETA)',
				maxZoom: 19
			}).addTo(map);

			const marker = L.marker([coordLat, coordLng]).addTo(map);
			if (label) {
				marker.bindPopup(label);
			}

			mapInstance = map;
			requestAnimationFrame(() => map.invalidateSize());
		})();

		return () => {
			cancelled = true;
			clearWatch();
			stopOrientationListener();
			removeUserMarker();
			mapInstance?.remove();
			mapInstance = undefined;
			leafletModule = undefined;
		};
	});

	$effect(() => {
		return () => {
			clearWatch();
			stopOrientationListener();
		};
	});
</script>

{#if hasValidCoords}
	<div class="grid gap-2">
		<div
			bind:this={mapContainer}
			class="h-48 min-h-48 w-full overflow-hidden rounded-lg bg-gray-100 shadow-md"
			role="img"
			aria-label={mapAriaLabel}
		></div>

		{#if geoSupported}
			{#if locationState === 'tracking'}
				<Button
					variant="secondary"
					class="w-full text-sm"
					aria-label={m.stop_tracking()}
					onclick={stopTracking}
				>
					{m.stop_tracking()}
				</Button>
			{:else if locationState === 'denied' || locationState === 'unavailable'}
				<p class="text-center text-xs text-red-600" role="alert">
					{locationErrorMessage}
				</p>
				<Button
					variant="secondary"
					class="w-full text-sm"
					aria-label={m.retry_location()}
					onclick={startTracking}
				>
					{m.retry_location()}
				</Button>
			{:else}
				<Button
					variant="secondary"
					class="w-full text-sm"
					aria-label={m.show_my_location_aria()}
					onclick={startTracking}
				>
					{m.show_my_location()}
				</Button>
			{/if}
		{/if}

		<p class="text-center text-xs text-gray-600">{m.location_disclaimer()}</p>
		<a
			href={osmUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="text-vesuvius-900 text-center text-sm underline"
		>
			{m.open_in_osm()}
		</a>
	</div>
{/if}

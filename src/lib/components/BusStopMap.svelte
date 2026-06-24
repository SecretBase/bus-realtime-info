<script lang="ts">
	import type { Map } from 'leaflet';

	const { lat, lng, label = '' } = $props<{
		lat: number | string;
		lng: number | string;
		label?: string;
	}>();

	const coordLat = $derived(Number(lat));
	const coordLng = $derived(Number(lng));

	const hasValidCoords = $derived(
		Number.isFinite(coordLat) &&
			Number.isFinite(coordLng) &&
			coordLat !== 0 &&
			coordLng !== 0
	);

	const osmUrl = $derived(
		`https://www.openstreetmap.org/?mlat=${coordLat}&mlon=${coordLng}#map=18/${coordLat}/${coordLng}`
	);

	let mapContainer = $state<HTMLDivElement | undefined>();

	$effect(() => {
		const container = mapContainer;
		if (!hasValidCoords || !container) return;

		let cancelled = false;
		let map: Map | undefined;

		(async () => {
			const L = await import('leaflet');

			if (cancelled) return;

			const iconUrl = (await import('leaflet/dist/images/marker-icon.png')).default;
			const shadowUrl = (await import('leaflet/dist/images/marker-shadow.png')).default;

			const defaultIcon = L.icon({
				iconUrl,
				shadowUrl,
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34]
			});
			L.Marker.prototype.options.icon = defaultIcon;

			if (cancelled) return;

			map = L.map(container, {
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

			requestAnimationFrame(() => map?.invalidateSize());
		})();

		return () => {
			cancelled = true;
			map?.remove();
		};
	});
</script>
{#if hasValidCoords}
	<div class="grid gap-2">
		<div
			bind:this={mapContainer}
			class="h-48 min-h-48 w-full overflow-hidden rounded-lg bg-gray-100 shadow-md"
			role="img"
			aria-label={label ? `${label} 地圖` : '巴士站地圖'}
		></div>
		<p class="text-center text-xs text-gray-600">位置僅供參考</p>
		<a
			href={osmUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="text-center text-sm text-vesuvius-900 underline"
		>
			在 OpenStreetMap 開啟
		</a>
	</div>
{/if}

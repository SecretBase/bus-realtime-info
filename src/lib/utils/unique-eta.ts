type EtaIdentity = {
	route: string;
	dir: string;
	dest_tc: string;
	eta: string | null;
};

// ponytail: same arrival string = one bus. Split if KMB starts sending two vehicles with identical eta.
export function uniqueEtas<T extends EtaIdentity>(etas: T[]): T[] {
	const seen = new Set<string>();
	return etas.filter((eta) => {
		const key = `${eta.route}\0${eta.dir}\0${eta.dest_tc}\0${eta.eta}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

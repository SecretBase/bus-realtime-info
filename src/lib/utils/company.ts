import type { OperatorId } from '$lib/api/ctb/types';
import * as m from '$lib/paraglide/messages.js';

export function getCompanyName(companyId: OperatorId | 'NWFB') {
	if (companyId === 'KMB') return m.company_kmb();
	if (companyId === 'NWFB') return m.company_nwfb();
	return m.company_ctb();
}

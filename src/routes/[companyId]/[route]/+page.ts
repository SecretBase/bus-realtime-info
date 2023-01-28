import { getRoute, getRoutesQueryKey } from '$lib/api/routes';
import type { CompanyId } from '$lib/api/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery({
		queryKey: getRoutesQueryKey({
			companyId: params.companyId as CompanyId,
			route: params.route
		}),
		queryFn: () =>
			getRoute({
				companyId: params.companyId as CompanyId,
				route: params.route
			})
	});
};

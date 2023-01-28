import type { APIResponse, Company, CompanyId } from './types';

export const getCompanyQueryKey = (companyId: CompanyId) => ['company', companyId];

export const getCompany = async (
	companyId: CompanyId
): Promise<APIResponse<Company, 'Company'>> => {
	const response = await fetch(
		`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/company/${companyId}`
	);

	return response.json();
};

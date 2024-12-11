export type APIResponse<Data, ApiType extends string> = {
	type: ApiType;
	version: string;
	generated_timestamp: string;
	data: Data;
};

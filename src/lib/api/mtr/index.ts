import { api } from '$lib/api/api';
import type { MtrLineId, MtrStationId } from './data';

const mtr = api.create({
	baseURL: 'https://rt.data.gov.hk/v1/transport/mtr'
});

export type MtrTrain = {
	seq: string;
	dest: string;
	plat: string;
	time: string;
	ttnt?: string;
	valid?: string;
	route?: string;
};

export type MtrSchedule = {
	status: number | string;
	message: string;
	curr_time?: string;
	sys_time?: string;
	isdelay?: 'Y' | 'N';
	url?: string;
	data?: Record<
		string,
		{
			curr_time: string;
			sys_time: string;
			UP?: MtrTrain[];
			DOWN?: MtrTrain[];
		}
	>;
};

type GetMtrScheduleParams = {
	line: MtrLineId;
	station: MtrStationId;
	lang?: 'EN' | 'TC';
};

export const getMtrScheduleQueryKey = (params: GetMtrScheduleParams) => [
	'mtr-schedule',
	params
];

export const getMtrSchedule = async ({
	line,
	station,
	lang = 'TC'
}: GetMtrScheduleParams) => {
	const response = await mtr.get<MtrSchedule>('/getSchedule.php', {
		params: { line, sta: station, lang }
	});
	return response.data;
};

export function parseMtrTime(time: string) {
	return new Date(time.replace(' ', 'T') + '+08:00');
}

export function getMtrStopTrains(
	schedule: MtrSchedule | undefined,
	line: string,
	station: string
) {
	const stop = schedule?.data?.[`${line}-${station}`];
	return {
		up: stop?.UP ?? [],
		down: stop?.DOWN ?? []
	};
}

export function flattenMtrTrains(
	schedule: MtrSchedule | undefined,
	line: string,
	station: string
) {
	const { up, down } = getMtrStopTrains(schedule, line, station);
	return [...up, ...down]
		.map((train) => ({
			...train,
			etaDate: parseMtrTime(train.time)
		}))
		.sort((a, b) => a.etaDate.getTime() - b.etaDate.getTime());
}

export function isMtrScheduleOk(schedule: MtrSchedule | undefined) {
	return schedule != null && String(schedule.status) === '1';
}

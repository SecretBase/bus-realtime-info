import { pickLocalizedText } from '$lib/utils/localized';

export const mtrLines = {
	AEL: { name: 'Airport Express', tcName: '機場快線', color: '#00888A' },
	TCL: { name: 'Tung Chung Line', tcName: '東涌線', color: '#F7943E' },
	TML: { name: 'Tuen Ma Line', tcName: '屯馬線', color: '#923011' },
	TKL: { name: 'Tseung Kwan O Line', tcName: '將軍澳線', color: '#7D499D' },
	EAL: { name: 'East Rail Line', tcName: '東鐵線', color: '#53B7E8' },
	SIL: { name: 'South Island Line', tcName: '南港島線', color: '#BAC429' },
	TWL: { name: 'Tsuen Wan Line', tcName: '荃灣線', color: '#ED1D24' },
	ISL: { name: 'Island Line', tcName: '港島線', color: '#007DC5' },
	KTL: { name: 'Kwun Tong Line', tcName: '觀塘線', color: '#00AB4E' },
	DRL: { name: 'Disneyland Resort Line', tcName: '迪士尼線', color: '#F173AC' }
} as const;

export type MtrLineId = keyof typeof mtrLines;

export const mtrStations = {
	ADM: { name: 'Admiralty', tcName: '金鐘' },
	AIR: { name: 'Airport', tcName: '香港國際機場' },
	AUS: { name: 'Austin', tcName: '柯士甸' },
	AWE: { name: 'AsiaWorld-Expo', tcName: '亞洲國際博覽館' },
	CAB: { name: 'Causeway Bay', tcName: '銅鑼灣' },
	CEN: { name: 'Central', tcName: '中環' },
	CHH: { name: 'Choi Hung', tcName: '彩虹' },
	CHW: { name: 'Chai Wan', tcName: '柴灣' },
	CIO: { name: 'City One', tcName: '第一城' },
	CKT: { name: 'Che Kung Temple', tcName: '車公廟' },
	CSW: { name: 'Cheung Sha Wan', tcName: '長沙灣' },
	DIH: { name: 'Diamond Hill', tcName: '鑽石山' },
	DIS: { name: 'Disneyland Resort', tcName: '迪士尼' },
	ETS: { name: 'East Tsim Sha Tsui', tcName: '尖東' },
	EXC: { name: 'Exhibition Centre', tcName: '會展' },
	FAN: { name: 'Fanling', tcName: '粉嶺' },
	FOH: { name: 'Fortress Hill', tcName: '炮台山' },
	FOT: { name: 'Fo Tan', tcName: '火炭' },
	HAH: { name: 'Hang Hau', tcName: '坑口' },
	HEO: { name: 'Heng On', tcName: '恒安' },
	HFC: { name: 'Heng Fa Chuen', tcName: '杏花邨' },
	HIK: { name: 'Hin Keng', tcName: '顯徑' },
	HKU: { name: 'HKU', tcName: '香港大學' },
	HOK: { name: 'Hong Kong', tcName: '香港' },
	HOM: { name: 'Ho Man Tin', tcName: '何文田' },
	HUH: { name: 'Hung Hom', tcName: '紅磡' },
	JOR: { name: 'Jordan', tcName: '佐敦' },
	KAT: { name: 'Kai Tak', tcName: '啟德' },
	KET: { name: 'Kennedy Town', tcName: '堅尼地城' },
	KOB: { name: 'Kowloon Bay', tcName: '九龍灣' },
	KOT: { name: 'Kowloon Tong', tcName: '九龍塘' },
	KOW: { name: 'Kowloon', tcName: '九龍' },
	KSR: { name: 'Kam Sheung Road', tcName: '錦上路' },
	KWF: { name: 'Kwai Fong', tcName: '葵芳' },
	KWH: { name: 'Kwai Hing', tcName: '葵興' },
	KWT: { name: 'Kwun Tong', tcName: '觀塘' },
	LAK: { name: 'Lai King', tcName: '荔景' },
	LAT: { name: 'Lam Tin', tcName: '藍田' },
	LCK: { name: 'Lai Chi Kok', tcName: '荔枝角' },
	LET: { name: 'Lei Tung', tcName: '利東' },
	LHP: { name: 'LOHAS Park', tcName: '康城' },
	LMC: { name: 'Lok Ma Chau', tcName: '落馬洲' },
	LOF: { name: 'Lok Fu', tcName: '樂富' },
	LOP: { name: 'Long Ping', tcName: '朗屏' },
	LOW: { name: 'Lo Wu', tcName: '羅湖' },
	MEF: { name: 'Mei Foo', tcName: '美孚' },
	MKK: { name: 'Mong Kok East', tcName: '旺角東' },
	MOK: { name: 'Mong Kok', tcName: '旺角' },
	MOS: { name: 'Ma On Shan', tcName: '馬鞍山' },
	NAC: { name: 'Nam Cheong', tcName: '南昌' },
	NOP: { name: 'North Point', tcName: '北角' },
	NTK: { name: 'Ngau Tau Kok', tcName: '牛頭角' },
	OCP: { name: 'Ocean Park', tcName: '海洋公園' },
	OLY: { name: 'Olympic', tcName: '奧運' },
	POA: { name: 'Po Lam', tcName: '寶琳' },
	PRE: { name: 'Prince Edward', tcName: '太子' },
	QUB: { name: 'Quarry Bay', tcName: '鰂魚涌' },
	RAC: { name: 'Racecourse', tcName: '馬場' },
	SHM: { name: 'Shek Mun', tcName: '石門' },
	SHS: { name: 'Sheung Shui', tcName: '上水' },
	SHT: { name: 'Sha Tin', tcName: '沙田' },
	SHW: { name: 'Sheung Wan', tcName: '上環' },
	SIH: { name: 'Siu Hong', tcName: '兆康' },
	SKM: { name: 'Shek Kip Mei', tcName: '石硤尾' },
	SKW: { name: 'Shau Kei Wan', tcName: '筲箕灣' },
	SOH: { name: 'South Horizons', tcName: '海怡半島' },
	SSP: { name: 'Sham Shui Po', tcName: '深水埗' },
	STW: { name: 'Sha Tin Wai', tcName: '沙田圍' },
	SUN: { name: 'Sunny Bay', tcName: '欣澳' },
	SUW: { name: 'Sung Wong Toi', tcName: '宋皇臺' },
	SWH: { name: 'Sai Wan Ho', tcName: '西灣河' },
	SYP: { name: 'Sai Ying Pun', tcName: '西營盤' },
	TAK: { name: 'Tai Koo', tcName: '太古' },
	TAP: { name: 'Tai Po Market', tcName: '大埔墟' },
	TAW: { name: 'Tai Wai', tcName: '大圍' },
	TIH: { name: 'Tin Hau', tcName: '天后' },
	TIK: { name: 'Tiu Keng Leng', tcName: '調景嶺' },
	TIS: { name: 'Tin Shui Wai', tcName: '天水圍' },
	TKO: { name: 'Tseung Kwan O', tcName: '將軍澳' },
	TKW: { name: 'To Kwa Wan', tcName: '土瓜灣' },
	TSH: { name: 'Tai Shui Hang', tcName: '大水坑' },
	TST: { name: 'Tsim Sha Tsui', tcName: '尖沙咀' },
	TSW: { name: 'Tsuen Wan', tcName: '荃灣' },
	TSY: { name: 'Tsing Yi', tcName: '青衣' },
	TUC: { name: 'Tung Chung', tcName: '東涌' },
	TUM: { name: 'Tuen Mun', tcName: '屯門' },
	TWH: { name: 'Tai Wo Hau', tcName: '大窩口' },
	TWO: { name: 'Tai Wo', tcName: '太和' },
	TWW: { name: 'Tsuen Wan West', tcName: '荃灣西' },
	UNI: { name: 'University', tcName: '大學' },
	WAC: { name: 'Wan Chai', tcName: '灣仔' },
	WCH: { name: 'Wong Chuk Hang', tcName: '黃竹坑' },
	WHA: { name: 'Whampoa', tcName: '黃埔' },
	WKS: { name: 'Wu Kai Sha', tcName: '烏溪沙' },
	WTS: { name: 'Wong Tai Sin', tcName: '黃大仙' },
	YAT: { name: 'Yau Tong', tcName: '油塘' },
	YMT: { name: 'Yau Ma Tei', tcName: '油麻地' },
	YUL: { name: 'Yuen Long', tcName: '元朗' }
} as const;

export type MtrStationId = keyof typeof mtrStations;

export const mtrLineStations: Record<MtrLineId, readonly MtrStationId[]> = {
	AEL: ['HOK', 'KOW', 'TSY', 'AIR', 'AWE'],
	TCL: ['HOK', 'KOW', 'OLY', 'NAC', 'LAK', 'TSY', 'SUN', 'TUC'],
	TML: [
		'TUM',
		'SIH',
		'TIS',
		'LOP',
		'YUL',
		'KSR',
		'TWW',
		'MEF',
		'NAC',
		'AUS',
		'ETS',
		'HUH',
		'HOM',
		'TKW',
		'SUW',
		'KAT',
		'DIH',
		'HIK',
		'TAW',
		'CKT',
		'STW',
		'CIO',
		'SHM',
		'TSH',
		'HEO',
		'MOS',
		'WKS'
	],
	TKL: ['NOP', 'QUB', 'YAT', 'TIK', 'TKO', 'LHP', 'HAH', 'POA'],
	EAL: [
		'ADM',
		'EXC',
		'HUH',
		'MKK',
		'KOT',
		'TAW',
		'SHT',
		'FOT',
		'RAC',
		'UNI',
		'TAP',
		'TWO',
		'FAN',
		'SHS',
		'LOW',
		'LMC'
	],
	SIL: ['ADM', 'OCP', 'WCH', 'LET', 'SOH'],
	TWL: [
		'CEN',
		'ADM',
		'TST',
		'JOR',
		'YMT',
		'MOK',
		'PRE',
		'SSP',
		'CSW',
		'LCK',
		'MEF',
		'LAK',
		'KWF',
		'KWH',
		'TWH',
		'TSW'
	],
	ISL: [
		'KET',
		'HKU',
		'SYP',
		'SHW',
		'CEN',
		'ADM',
		'WAC',
		'CAB',
		'TIH',
		'FOH',
		'NOP',
		'QUB',
		'TAK',
		'SWH',
		'SKW',
		'HFC',
		'CHW'
	],
	KTL: [
		'WHA',
		'HOM',
		'YMT',
		'MOK',
		'PRE',
		'SKM',
		'KOT',
		'LOF',
		'WTS',
		'DIH',
		'CHH',
		'KOB',
		'NTK',
		'KWT',
		'LAT',
		'YAT',
		'TIK'
	],
	DRL: ['SUN', 'DIS']
};

export const mtrLineIds = Object.keys(mtrLines) as MtrLineId[];

export function isMtrLine(id: string): id is MtrLineId {
	return Object.hasOwn(mtrLines, id);
}

export function isMtrStationOnLine(
	line: MtrLineId,
	station: string
): station is MtrStationId {
	return mtrLineStations[line].includes(station as MtrStationId);
}

export function getMtrLineName(id: string) {
	const line = isMtrLine(id) ? mtrLines[id] : null;
	return line ? pickLocalizedText(line.tcName, line.name) : id;
}

export function getMtrStationName(id: string) {
	const station = Object.hasOwn(mtrStations, id)
		? mtrStations[id as MtrStationId]
		: null;
	return station ? pickLocalizedText(station.tcName, station.name) : id;
}

export function getMtrLineStationPairs() {
	return mtrLineIds.flatMap((line) =>
		mtrLineStations[line].map((station) => ({ line, station }))
	);
}

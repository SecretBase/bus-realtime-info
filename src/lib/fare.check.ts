import {
	lookupBusFare,
	lookupMtrFare,
	mtrFareConcessions,
	parseBusFareTable,
	parseMtrFareTable
} from './fare-parse';

const mtrCsv = `SRC_STATION_NAME,SRC_STATION_ID,DEST_STATION_NAME,DEST_STATION_ID,OCT_ADT_FARE,OCT_STD_FARE,OCT_JOYYOU_SIXTY_FARE,SINGLE_ADT_FARE,OCT_CON_CHILD_FARE,OCT_CON_ELDERLY_FARE,OCT_CON_PWD_FARE,SINGLE_CON_CHILD_FARE,SINGLE_CON_ELDERLY_FARE
Central,1,Central,1,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00
Central,1,Admiralty,2,4.90,3.20,2.00,5.00,3.20,2.00,2.00,3.50,3.50
Tseung Kwan O,50,Admiralty,2,15.80,7.40,3.20,16.00,7.40,3.20,3.20,7.50,7.50
`;

const aelCsv = `ST_FROM,ST_FROM_ID,ST_TO,ST_TO_ID,OCT_ADT_FARE,OCT_CHD_FARE,SINGLE_ADT_FARE,SINGLE_CHD_FARE
HongKong,44,Airport,47,120,60,130,65
Airport,47,AsiaWorld-Expo,56,6.5,3.2,7,3.5
`;

const busXml = `<?xml version="1.0" encoding="UTF-8"?>
<dataroot>
<ROUTE>
<COMPANY_CODE>KMB</COMPANY_CODE>
<ROUTE_NAMEE>1</ROUTE_NAMEE>
<SERVICE_MODE>R</SERVICE_MODE>
<SPECIAL_TYPE>0</SPECIAL_TYPE>
<LOC_START_NAMEC>竹園邨</LOC_START_NAMEC>
<LOC_START_NAMEE>CHUK YUEN ESTATE</LOC_START_NAMEE>
<LOC_END_NAMEC>尖沙咀碼頭</LOC_END_NAMEC>
<LOC_END_NAMEE>STAR FERRY</LOC_END_NAMEE>
<FULL_FARE>6.7</FULL_FARE>
</ROUTE>
<ROUTE>
<COMPANY_CODE>CTB</COMPANY_CODE>
<ROUTE_NAMEE>1</ROUTE_NAMEE>
<SERVICE_MODE>R</SERVICE_MODE>
<SPECIAL_TYPE>0</SPECIAL_TYPE>
<LOC_START_NAMEC>中環 (港澳碼頭)</LOC_START_NAMEC>
<LOC_START_NAMEE>CENTRAL (MACAU FERRY)</LOC_START_NAMEE>
<LOC_END_NAMEC>跑馬地(上)</LOC_END_NAMEC>
<LOC_END_NAMEE>HAPPY VALLEY (UPPER)</LOC_END_NAMEE>
<FULL_FARE>4.8</FULL_FARE>
</ROUTE>
<ROUTE>
<COMPANY_CODE>KMB+CTB</COMPANY_CODE>
<ROUTE_NAMEE>104</ROUTE_NAMEE>
<SERVICE_MODE>R</SERVICE_MODE>
<SPECIAL_TYPE>0</SPECIAL_TYPE>
<LOC_START_NAMEC>堅尼地城</LOC_START_NAMEC>
<LOC_START_NAMEE>KENNEDY TOWN</LOC_START_NAMEE>
<LOC_END_NAMEC>深水埗(白田邨)</LOC_END_NAMEC>
<LOC_END_NAMEE>SHAM SHUI PO (PAK TIN ESTATE)</LOC_END_NAMEE>
<FULL_FARE>12.9</FULL_FARE>
</ROUTE>
</dataroot>
`;

const mtr = parseMtrFareTable(mtrCsv, 'mtr');
const ael = parseMtrFareTable(aelCsv, 'ael');
const bus = parseBusFareTable(busXml);

const tkoAdm = lookupMtrFare(mtr, 'Tseung Kwan O', 'Admiralty');
const hokAir = lookupMtrFare(ael, 'HongKong', 'Airport');
const kmb1 = lookupBusFare(bus, 'KMB', '1', '尖沙咀碼頭', 'STAR FERRY');
const ctb1 = lookupBusFare(bus, 'CTB', '1', '跑馬地(上)');
const joint = lookupBusFare(bus, 'CTB', '104', '深水埗(白田邨)');
const sameStation = lookupMtrFare(mtr, 'Central', 'Central');

if (
	tkoAdm?.adult !== 15.8 ||
	tkoAdm.student !== 7.4 ||
	tkoAdm.elderly !== 3.2
) {
	throw new Error(`MTR TKO-ADM fare mismatch: ${JSON.stringify(tkoAdm)}`);
}
if (hokAir?.adult !== 120 || hokAir.child !== 60) {
	throw new Error(`AEL HOK-AIR fare mismatch: ${JSON.stringify(hokAir)}`);
}
if (kmb1?.adult !== 6.7 || ctb1?.adult !== 4.8) {
	throw new Error(
		`Bus route 1 company split failed: ${kmb1?.adult} ${ctb1?.adult}`
	);
}
if (joint?.adult !== 12.9) {
	throw new Error(`Joint 104 fare mismatch: ${JSON.stringify(joint)}`);
}
if (sameStation) {
	throw new Error('Same-station MTR rows should be skipped');
}
const concessions = mtrFareConcessions(tkoAdm, {
	student: 's',
	child: 'c',
	elderly: 'e',
	pwd: 'p',
	joyyou: 'j'
});
if (concessions.length !== 5 || concessions[0]?.amount !== 7.4) {
	throw new Error(`Concession list mismatch: ${JSON.stringify(concessions)}`);
}

console.log('fare.check ok');

import { NextResponse } from "next/server";
import sql from 'mssql';
const config = {
    user: 'metaflex_HMTechniek',
    password: 'MetaFlex159635741!',
    server: 'sql.bsite.net\\MSSQL2016',
    database: 'metaflex_HMTechniek',
    options: {
        trustedconnection: true,
        trustServerCertificate: true
    },
}

export async function POST(request) {
    const { dataobj } = await request.json();
    const dt1 = dataobj.date1;
    const dt2 = dataobj.date2;
    const chargetitle = dataobj.selectcharge;
    if (chargetitle != "all") {
        try {
            await sql.connect(config);
            const result = await sql.query`select line_charge.*,charge.title from line_charge inner join charge on charge.id_charge = line_charge.id_charge where charge.title = ${chargetitle} and convert(date, line_charge.dt) between ${dt1} and ${dt2}`;
            if (result.recordset.length > 0) {
                console.log("all good");
                return NextResponse.json({
                    success: true,
                    result: result.recordset
                });
            } else {
                console.error("Cannot Load Line Charge or there is not any available");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot Load Line Charge or there is not any available'
                });
            }
        } catch (error) {
            console.error(error);
            return NextResponse.json({
                success: false,
                error: 'Internal server error'
            });
        }
    } else {
        try {
            await sql.connect(config);
            const result = await sql.query`select line_charge.*,charge.title from line_charge inner join charge on charge.id_charge = line_charge.id_charge where convert(date, line_charge.dt) between ${dt1} and ${dt2}`;
            if (result.recordset.length > 0) {
                console.log("all good");
                return NextResponse.json({
                    success: true,
                    result: result.recordset
                });
            } else {
                console.error("Cannot Load Line Charge");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot Load Line Charge'
                });
            }
        } catch (error) {
            console.error(error);
            return NextResponse.json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}
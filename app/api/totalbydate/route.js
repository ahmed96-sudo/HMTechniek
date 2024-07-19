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
    const { date } = await request.json();
    const dt = date.date;
    try {
        await sql.connect(config);
        const result = await sql.query`select (select (isnull(sum(total_ttc),0)/1.21)*0.21 from facture inner join client on client.id_client = facture.id_client where client.isClient = 1 and Facture.tva = 1 and  cast(Facture.date_facture as date) >= cast(${dt} as date))-(select (isnull(sum(total_ttc),0)/1.21)*0.21 from facture inner join client on client.id_client = facture.id_client where client.isClient = 0 and   cast(Facture.date_facture as date) >= cast(${dt} as date))`;
        if (result.recordset.length > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: result.recordset[0][""]
            });
        } else {
            console.error("Cannot Load Total TVA");
            return NextResponse.json({
                success: false,
                error: 'Cannot Load Total TVA'
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
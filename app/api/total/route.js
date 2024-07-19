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
export async function GET(request){
    try {
        await sql.connect(config);
        const result1 = await sql.query`select isnull(sum(total_ttc),0) from facture inner join client on client.id_client = facture.id_client where client.isClient = 1`;
        const result2 = await sql.query`select isnull(sum(total_ttc),0) from facture inner join client on client.id_client = facture.id_client where client.isClient = 0`;
        const result3 = await sql.query`select isnull(sum(total_ttc),0) from devis`;
        const result4 = await sql.query`SELECT COUNT(*) FROM client WHERE isClient = 1`;
        if (result1.recordset.length > 0 && result2.recordset.length > 0 && result3.recordset.length > 0 && result4.recordset.length > 0) {
            const justresult1 = result1.recordset[0][""];
            const justresult2 = result2.recordset[0][""];
            const justresult3 = result3.recordset[0][""];
            const justresult4 = result4.recordset[0][""];
            const allresult = {
                totalfacture: justresult1,
                totalfactfrs: justresult2,
                totaldevis: justresult3,
                totalclient: justresult4
            };
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: allresult
            });
        } else {
            console.error("Cannot Load Dashboard");
            return NextResponse.json({
                success: false,
                error: 'Cannot Load Dashboard'
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
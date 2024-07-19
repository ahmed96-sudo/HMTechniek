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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("devisid");
    try {
        await sql.connect(config);
        const result = await sql.query`select devis.*,client.raison_social,client.id_client from devis inner join client on client.id_client = devis.id_client where devis.idDevis = ${parseInt(id)};select * from lineDevis where idDevis = ${parseInt(id)}`;
        if (result.recordsets.length > 0 && result.recordset.length > 0) {
            console.log("all good");
            const devis = result.recordsets[0][0];
            const linedevises = result.recordsets[1];
            const allobj = {
                devisobj: devis,
                lines: linedevises
            };
            return NextResponse.json({
                success: true,
                result: allobj
            });
        } else {
            console.error("Cannot get Devis or there is not any available");
            return NextResponse.json({
                success: false,
                error: 'Cannot get Devis or there is not any available'
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
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
    const id = searchParams.get("factureid");
    if (id == null) {
        console.error("Cannot get Facture or there is not any available");
        return NextResponse.json({
            success: false,
            error: 'Cannot get Facture or there is not any available'
        });
    } else {
        try {
            await sql.connect(config);
            const result = await sql.query`select Facture.idFacture,Facture.numeroFacture,Facture.total_ttc,Facture.date_facture,Facture.id_reglement,client.raison_social,client.id_client,Facture.pathFact,Facture.tva,Facture.info from Facture inner join client on client.id_client = Facture.id_client where facture.idFacture = ${parseInt(id)};select * from lineFact where idFacture = ${parseInt(id)}`;
            if (result.recordsets.length > 0 && result.recordset.length > 0) {
                console.log("all good");
                const fact = result.recordsets[0][0];
                const linefacts = result.recordsets[1];
                const allobj = {
                    factobj: fact,
                    lines: linefacts
                };
                return NextResponse.json({
                    success: true,
                    result: allobj
                });
            } else {
                console.error("Cannot get Facture or there is not any available");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot get Facture or there is not any available'
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
import { NextResponse } from "next/server";
import sql from 'mssql';
const config = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    server: process.env.DATABASE_SERVER,
    database: process.env.DATABASE_DB,
    options: {
        trustedconnection: true,
        trustServerCertificate: true
    },
}
export async function GET(request){
    try {
        await sql.connect(config);
        const result = await sql.query`select Facture.idFacture,Facture.numeroFacture,Facture.total_ttc,Facture.date_facture,Facture.id_reglement,client.raison_social,Facture.pathFact,Facture.tva,Facture.info from Facture inner join client on client.id_client = Facture.id_client where client.isClient = 0`;
        if (result.recordset.length > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: result.recordset
            });
        } else {
            console.error("Cannot get Facture Frs or there is not any available");
            return NextResponse.json({
                success: false,
                error: 'Cannot get Facture Frs or there is not any available'
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
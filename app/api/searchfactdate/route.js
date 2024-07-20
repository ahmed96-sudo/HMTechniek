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

export async function POST(request) {
    const { dates } = await request.json();
    const dt1 = dates.date1;
    const dt2 = dates.date2;
    try {
        await sql.connect(config);
        const result = await sql.query`select Facture.idFacture,Facture.numeroFacture,Facture.total_ttc,Facture.date_facture,Facture.id_reglement,client.raison_social,Facture.pathFact,Facture.tva,Facture.info from Facture inner join client on client.id_client = Facture.id_client where client.isClient = 1 and cast(Facture.date_facture as date) between cast( ${dt1} as date) and cast(${dt2} as date) order by facture.numeroFacture`;
        if (result.recordset.length > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: result.recordset
            });
        } else {
            console.error("Cannot get Facture");
            return NextResponse.json({
                success: false,
                error: 'Cannot get Facture'
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
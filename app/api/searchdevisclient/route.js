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
    const { dataobj } = await request.json();
    const client = dataobj.input;
    try {
        await sql.connect(config);
        const result = await sql.query`select Devis.idDevis,Devis.numeroDevis,Devis.total_ttc,Devis.date_devis,client.id_client,client.raison_social from Devis inner join client on client.id_client = Devis.id_client where client.raison_social like ${client}`;
        if (result.recordset.length > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: result.recordset
            });
        } else {
            console.error("Cannot Load Devis or there is not any available");
            return NextResponse.json({
                success: false,
                error: 'Cannot Load Devis or there is not any available'
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
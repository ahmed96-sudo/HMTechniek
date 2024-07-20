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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("sourceid");
    try {
        await sql.connect(config);
        const result = await sql.query`select * from client where id_client = ${parseInt(id)}`;
        if (result.recordset.length > 0) {
            console.log("all good");
            const justresult = result.recordset[0];
            var is = {sourcetype:""}
            if (justresult.isClient == 1) {
                is.sourcetype = "Client";
            } else {
                is.sourcetype = "Fournisseur";
            }
            const allresult = {...justresult,...is};
            return NextResponse.json({
                success: true,
                result: allresult
            });
        } else {
            console.error("Cannot get Client or there is not any available");
            return NextResponse.json({
                success: false,
                error: 'Cannot get Client or there is not any available'
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
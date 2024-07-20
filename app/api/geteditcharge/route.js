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
    const id = searchParams.get("chargeid");
    try {
        await sql.connect(config);
        const result = await sql.query`select line_charge.*,charge.title from line_charge inner join charge on charge.id_charge = line_charge.id_charge where line_charge.id_line_charge = ${parseInt(id)}`;
        if (result.recordset.length > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: result.recordset[0]
            });
        } else {
            console.error("Cannot get Line Charges or there is not any available");
            return NextResponse.json({
                success: false,
                error: 'Cannot get Line Charges or there is not any available'
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
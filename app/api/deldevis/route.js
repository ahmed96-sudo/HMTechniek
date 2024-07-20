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
    const id = searchParams.get("id");
    try {
        await sql.connect(config);
        const result = await sql.query`Delete [dbo].[devis] where idDevis = ${parseInt(id)}`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true
            });
        } else {
            console.error("Cannot Delete Facture");
            return NextResponse.json({
                success: false,
                error: 'Cannot Delete Facture'
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
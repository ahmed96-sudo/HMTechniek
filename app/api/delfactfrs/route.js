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
    const id = searchParams.get("id");
    try {
        await sql.connect(config);
        const result = await sql.query`delete facture where idFacture = ${parseInt(id)}`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true
            });
        } else {
            console.error("Cannot Delete Facture Frs");
            return NextResponse.json({
                success: false,
                error: 'Cannot Delete Facture Frs'
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
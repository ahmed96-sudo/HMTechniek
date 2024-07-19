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
    const type = searchParams.get("type");
    var is;
    if (type == "client") {
        is = 1;
    } else if (type == "frs") {
        is = 0;
    } else {
        return;
    }
    try {
        await sql.connect(config);
        const result = await sql.query`select * from client where isClient = ${is}`;
        if (result.recordset.length > 0) {
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: result.recordset
            });
        } else {
            console.error(`Cannot get ${String(type)} or there is not any available`);
            return NextResponse.json({
                success: false,
                error: `Cannot get ${String(type)} or there is not any available`
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
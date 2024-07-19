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

export async function POST(request) {
    const { charge } = await request.json();
    try {
        await sql.connect(config);
        const result = await sql.query`insert into charge values (${charge.title})`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({ success: true });
        } else {
            console.error("Cannot Insert Charge");
            return NextResponse.json({
                success: false,
                error: 'Cannot Insert Charge'
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
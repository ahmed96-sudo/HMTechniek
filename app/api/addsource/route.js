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
    const { source } = await request.json();
    var is;
    if (source.sourcetype == "Client") {
        is = 1;
    } else {
        is = 0;
    }
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO [dbo].[client] VALUES (${source.socialaddsource},${source.iceaddsource},${source.idenaddsource},${source.responaddsource},${source.tlfaddsource},${source.tlf2addsource},${source.cnssaddsource},${source.emailaddsource},${source.addresaddsource},${source.showimage},${is})`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({ success: true });
        } else {
            console.error("Cannot Insert Client");
            return NextResponse.json({
                success: false,
                error: 'Cannot Insert Client'
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
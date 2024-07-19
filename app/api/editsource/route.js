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
    const { source } = await request.json();
    const type = source.sourcetype;
    var is;
    if (type == "Client") {
        is = 1;
    } else {
        is = 0;
    }
    try {
        await sql.connect(config);
        const result = await sql.query`update [dbo].[client] set raison_social=${source.socialaddsource},ice=${source.iceaddsource},id_fiscal=${source.idenaddsource},responsable=${source.responaddsource},tlf=${source.tlfaddsource},tlf2=${source.tlf2addsource},cnss=${source.cnssaddsource},mail=${source.emailaddsource},adresse=${source.addresaddsource},pathpic=${source.showimage},isClient=${is} where id_client=${parseInt(source.sourceid)}`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({ success: true });
        } else {
            console.error(`Cannot Update ${String(type)}`);
            return NextResponse.json({
                success: false,
                error: `Cannot Update ${String(type)}`
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
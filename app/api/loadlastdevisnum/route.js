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
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT hexD,nD from ndoc`;
        if (result.recordset.length > 0) {
            console.log("all good for ndoc");
            const hexdnd = result.recordset[0];
            const result2 = await sql.query`SELECT TOP 1 numeroDevis from Devis order by Devis.idDevis desc`;
            if (result2.recordset.length > 0) {
                console.log("all good for devis");
                const numeroDevis = (result2.recordset[0]).numeroDevis;
                if (numeroDevis == "" || !numeroDevis.includes("-")) {
                    return NextResponse.json({
                        success: true,
                        result: String(hexdnd.hexD) + String(hexdnd.nD)
                    });
                } else {
                    let oldNDoc = numeroDevis;
                    let newNDoc = oldNDoc.replace(oldNDoc.split('-')[1], (parseInt(oldNDoc.split('-')[1]) + 1).toString());
                    return NextResponse.json({
                        success: true,
                        result: String(newNDoc)
                    });
                }
            } else {
                console.error("Cannot get Last Devis Number or there is not any available");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot get Last Devis Number or there is not any available'
                });
            }
        } else {
            console.error("Cannot get nDoc");
            return NextResponse.json({
                success: false,
                error: 'Cannot get nDoc'
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
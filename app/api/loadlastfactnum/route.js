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
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT hexF,nF from ndoc`;
        if (result.recordset.length > 0) {
            console.log("all good for ndoc");
            const hexfnf = result.recordset[0];
            const result2 = await sql.query`SELECT TOP 1 numeroFacture from facture order by idFacture desc`;
            if (result2.recordset.length > 0) {
                console.log("all good for facture");
                const numeroFacture = (result2.recordset[0]).numeroFacture;
                if (numeroFacture == "" || !numeroFacture.includes("-")) {
                    return NextResponse.json({
                        success: true,
                        result: hexfnf.hexF + hexfnf.nF
                    });
                } else {
                    let oldNDoc = numeroFacture;
                    let newNDoc = oldNDoc.replace(oldNDoc.split('-')[1], (parseInt(oldNDoc.split('-')[1]) + 1).toString());
                    return NextResponse.json({
                        success: true,
                        result: newNDoc
                    });
                }
            } else {
                console.error("Cannot get Last Facture Number or there is not any available");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot get Last Facture Number or there is not any available'
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
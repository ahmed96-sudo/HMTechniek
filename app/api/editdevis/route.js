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
    const { devis } = await request.json();
    const getdate = devis.dateeditdevisformall;
    const date = new Date(String(JSON.parse(getdate))).toISOString();
    try {
        await sql.connect(config);
        const result = await sql.query`delete dbo.lineDevis where idDevis = ${parseInt(devis.devisid)}`;
        if (result.rowsAffected[0] > 0) {
            const result2 = await sql.query`update devis set numeroDevis = ${devis.numeditdevisformall},total_ttc = ${parseFloat(devis.ttc)},date_devis = ${date},id_client = ${parseInt(devis.selecteditdevisformall)} where idDevis = ${parseInt(devis.devisid)}`;
            if (result2.rowsAffected[0] > 0) {
                var restofstat = `INSERT INTO [dbo].[lineDevis] ([idDevis] ,[designation],[qte] ,[prix]) VALUES `;
                for (let i = 0; i < devis.linesdevis.length; i++) {
                    const linedevis = devis.linesdevis[i];
                    var reststat;
                    if (i == 0) {
                        var reststat = `(${parseInt(devis.devisid)} ,${linedevis.describelinedevisform} ,${parseFloat(linedevis.qtnlinedevisform)} ,${parseFloat(linedevis.ttclinedevisform)})`;
                    } else {
                        var reststat = `, (${parseInt(devis.devisid)} ,${linedevis.describelinedevisform} ,${parseFloat(linedevis.qtnlinedevisform)} ,${parseFloat(linedevis.ttclinedevisform)})`;
                    }
                    restofstat = restofstat + reststat;
                }
                const result3 = await sql.query`${restofstat}`;
                if (result3.rowsAffected[0] > 0) {
                    console.log("all good");
                    return NextResponse.json({
                        success: true
                    });
                } else {
                    console.error("Cannot Update Line Devis");
                    return NextResponse.json({
                        success: false,
                        error: 'Cannot Update Line Devis'
                    });
                }
            } else {
                console.error("Cannot Update Devis");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot Update Devis'
                });
            }
        } else {
            console.error("Cannot Delete Old Line Devis");
            return NextResponse.json({
                success: false,
                error: 'Cannot Delete Old Line Devis'
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
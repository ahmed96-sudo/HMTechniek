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
    const { devis } = await request.json();
    const getdate = devis.dateadddevisformall;
    const date = new Date(String(JSON.parse(getdate))).toISOString();
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO [dbo].[devis] ([numeroDevis] ,[total_ttc] ,[date_devis] ,[id_client]) OUTPUT INSERTED.idDevis VALUES (${devis.numadddevisformall} ,${parseFloat(devis.ttc)} ,${date},${parseInt(devis.selectadddevisformall)})`;
        if (result.recordset.length > 0) {
            const id2 = result.recordset[0].idDevis;
            var restofstat = `INSERT INTO [dbo].[lineDevis] ([idDevis] ,[designation],[qte] ,[prix]) VALUES `;
            for (let i = 0; i < devis.linesdevis.length; i++) {
                const linedevis = devis.linesdevis[i];
                var reststat;
                if (i == 0) {
                    var reststat = `(${parseInt(id2)} ,${linedevis.describelinedevisform} ,${parseFloat(linedevis.qtnlinedevisform)} ,${parseFloat(linedevis.ttclinedevisform)})`;
                } else {
                    var reststat = `, (${parseInt(id2)} ,${linedevis.describelinedevisform} ,${parseFloat(linedevis.qtnlinedevisform)} ,${parseFloat(linedevis.ttclinedevisform)})`;
                }
                restofstat = restofstat + reststat;
            }
            const result2 = await sql.query`${restofstat}`;
            if (result2.rowsAffected[0] > 0) {
                console.log("all good");
                return NextResponse.json({
                    success: true
                });
            } else {
                console.error("Cannot Insert Line Devis");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot Insert Line Devis'
                });
            }
        } else {
            console.error("Cannot Insert Devis");
            return NextResponse.json({
                success: false,
                error: 'Cannot Insert Devis'
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
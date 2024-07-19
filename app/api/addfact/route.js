import { NextResponse } from "next/server";
import sql from 'mssql';
import jsftp from 'jsftp';

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

const ftpConfig = {
    host: 'ftp://ftp.hashmap.ma',
    port: 21,
    user: 'ftpptf@hashmap.ma',
    pass: 'youssef159635741'
};

export async function POST(request) {
    const formData = await request.formData();
    const numaddfactformall = formData.get("numaddfactformall");
    const getdatefact = formData.get("dateaddfactformall");
    const datefact = new Date(String(JSON.parse(getdatefact))).toISOString();
    var file = formData.get("addfactpickingattachment");
    const buffer = Buffer.from(await file.arrayBuffer());
    const selectaddfactformall = formData.get("selectaddfactformall");
    const infoaddfactformall = formData.get("infoaddfactformall");
    const tvacheckaddfactformall = formData.get("tvacheckaddfactformall");
    const ttc = formData.get("ttc");
    const tva = formData.get("tva");
    const ht = formData.get("ht");
    const getlinesfact = formData.get("linesfact");
    const linesfact = JSON.parse(getlinesfact);
    const regtype = formData.get("regtype");
    const getdatereg = formData.get("date");
    const datereg = new Date(String(JSON.parse(getdatereg))).toISOString();
    const ttcaddreg = formData.get("ttcaddreg");
    const refaddreg = formData.get("refaddreg");
    var resultoffile = false;
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO [dbo].[regelement] OUTPUT INSERTED.id_reglement VALUES (${parseFloat(ttcaddreg)}, ${regtype}, ${datereg}, ${refaddreg})`;
        if (result.recordset.length > 0) {
            const id = result.recordset[0].id_reglement;
            if (file != "") {
                const ftp = new jsftp(ftpConfig);
                ftp.put(buffer, `/SOFT/SIMPLEFACT/files/${file.name}`, (err) => {
                    if (err) {
                        console.error(err);
                        resultoffile = false;
                    } else {
                        console.log(`File uploaded to FTP server: ${file.name}`);
                        resultoffile = true;
                    }
                });
            } else {resultoffile = false;}
            const result2 = await sql.query`INSERT INTO [dbo].[facture] OUTPUT INSERTED.idFacture VALUES ( ${numaddfactformall}, ${parseFloat(ttc)}, ${datefact}, ${parseInt(selectaddfactformall)}, ${parseInt(id)},${resultoffile==true ? ("https://hashmap.ma/SOFT/SIMPLEFACT/files/" + String(file.name)) : ""},${tvacheckaddfactformall == "true" ? 1 : 0},${infoaddfactformall})`;
            if (result2.recordset.length > 0) {
                const id2 = result.recordset[0].idFacture;
                var restofstat = `INSERT INTO [dbo].[lineFact] ([idFacture],[designation],[qte],[prix]) VALUES `;
                for (let i = 0; i < linesfact.length; i++) {
                    const linefact = linesfact[i];
                    var reststat;
                    if (i == 0) {
                        var reststat = `(${parseInt(id2)} ,${linefact.describelinefactform} ,${parseFloat(linefact.qtnlinefactform)} ,${parseFloat(linefact.ttclinefactform)})`;
                    } else {
                        var reststat = `, (${parseInt(id2)} ,${linefact.describelinefactform} ,${parseFloat(linefact.qtnlinefactform)} ,${parseFloat(linefact.ttclinefactform)})`;
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
                    console.error("Cannot Insert Line Facture");
                    return NextResponse.json({
                        success: false,
                        error: 'Cannot Insert Line Facture'
                    });
                }
            } else {
                console.error("Cannot Insert Facture");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot Insert Facture'
                });
            }
        } else {
            console.error("Cannot Insert Regelement");
            return NextResponse.json({
                success: false,
                error: 'Cannot Insert Regelement'
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
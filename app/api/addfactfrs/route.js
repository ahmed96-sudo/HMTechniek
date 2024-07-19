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
    const selectfactfrs = formData.get("selectfactfrs");
    const getdatefact = formData.get("datefactfrs");
    const datefact = new Date(String(JSON.parse(getdatefact))).toISOString();
    const montantfactfrs = formData.get("montantfactfrs");
    var file = formData.get("addfactfrspickingattachment");
    const buffer = Buffer.from(await file.arrayBuffer());
    const regtype = formData.get("regtype");
    const getdatereg = formData.get("date");
    const datereg = new Date(String(JSON.parse(getdatereg))).toISOString();
    const ttcaddregfrs = formData.get("ttcaddregfrs");
    const refaddregfrs = formData.get("refaddregfrs");
    var resultoffile = false;
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO [dbo].[regelement] OUTPUT INSERTED.id_reglement VALUES (${parseFloat(ttcaddregfrs)}, ${regtype}, ${datereg}, ${refaddregfrs})`;
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
            const result2 = await sql.query`INSERT INTO [dbo].[facture] VALUES ("0", ${parseFloat(montantfactfrs)}, ${datefact}, ${parseInt(selectfactfrs)}, ${parseInt(id)},${resultoffile==true ? ("https://hashmap.ma/SOFT/SIMPLEFACT/files/" + String(file.name)) : ""},1,'')`;
            if (result2.rowsAffected[0] > 0) {
                console.log("all good");
                return NextResponse.json({
                    success: true
                });
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
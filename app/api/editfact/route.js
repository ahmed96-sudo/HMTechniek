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

const ftpConfig = {
    host: 'ftp://ftp.hashmap.ma',
    port: 21,
    user: 'ftpptf@hashmap.ma',
    pass: 'youssef159635741'
};

export async function POST(request) {
    const formData = await request.formData();
    const numeditfactformall = formData.get("numeditfactformall");
    const getdatefact = formData.get("dateeditfactformall");
    const datefact = new Date(String(JSON.parse(getdatefact))).toISOString();
    var file = formData.get("editfactpickingattachment");
    const buffer = Buffer.from(await file.arrayBuffer());
    const selecteditfactformall = formData.get("selecteditfactformall");
    const infoeditfactformall = formData.get("infoeditfactformall");
    const tvacheckeditfactformall = formData.get("tvacheckeditfactformall");
    const ttc = formData.get("ttc");
    const tva = formData.get("tva");
    const ht = formData.get("ht");
    const getlinesfact = formData.get("linesfact");
    const linesfact = JSON.parse(getlinesfact);
    const regtype = formData.get("regtype");
    const getdatereg = formData.get("date");
    const datereg = new Date(String(JSON.parse(getdatereg))).toISOString();
    const ttceditreg = formData.get("ttceditreg");
    const refeditreg = formData.get("refeditreg");
    const factureid = formData.get("factureid");
    var resultoffile = false;
    try {
        await sql.connect(config);
        const result = await sql.query`delete [dbo].[regelement] where id_reglement =(select id_reglement from facture where idFacture = ${parseInt(factureid)});delete dbo.lineFact where idFacture = ${parseInt(factureid)}`;
        if (result.rowsAffected[0] > 0 && result.rowsAffected[1] > 0) {
            const result2 = await sql.query`INSERT INTO [dbo].[regelement] OUTPUT INSERTED.id_reglement VALUES (${parseFloat(ttceditreg)}, ${regtype}, ${datereg}, ${refeditreg})`;
            if (result2.recordset.length > 0) {
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
                const result3 = await sql.query`update facture set numeroFacture = ${numeditfactformall},total_ttc = ${parseFloat(ttc)},date_facture = ${datefact},id_client = ${parseInt(selecteditfactformall)},id_reglement = ${parseInt(id)},pathFact=${resultoffile==true ? ("https://hashmap.ma/SOFT/SIMPLEFACT/files/" + String(file.name)) : ""},info=${infoeditfactformall}  where idFacture = ${parseInt(factureid)}`;
                if (result3.rowsAffected[0] > 0) {
                    var restofstat = `INSERT INTO [dbo].[lineFact] ([idFacture],[designation],[qte],[prix]) VALUES `;
                    for (let i = 0; i < linesfact.length; i++) {
                        const linefact = linesfact[i];
                        var reststat;
                        if (i == 0) {
                            var reststat = `(${parseInt(factureid)} ,${linefact.designation} ,${parseFloat(linefact.qte)} ,${parseFloat(linefact.prix)})`;
                        } else {
                            var reststat = `, (${parseInt(factureid)} ,${linefact.designation} ,${parseFloat(linefact.qte)} ,${parseFloat(linefact.prix)})`;
                        }
                        restofstat = restofstat + reststat;
                    }
                    const result4 = await sql.query`${restofstat}`;
                    if (result4.rowsAffected[0] > 0) {
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
                    console.error("Cannot Update Facture");
                    return NextResponse.json({
                        success: false,
                        error: 'Cannot Update Facture'
                    });
                }
            } else {
                console.error("Cannot Insert Regelement");
                return NextResponse.json({
                    success: false,
                    error: 'Cannot Insert Regelement'
                });
            }
        } else {
            console.error("Cannot Delete Old Regelement");
            return NextResponse.json({
                success: false,
                error: 'Cannot Delete Old Regelement'
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
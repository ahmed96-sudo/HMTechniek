import { NextResponse } from "next/server";
import sql from 'mssql';
import jsftp from 'jsftp';

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

const ftpConfig = {
    host: 'ftp://ftp.hashmap.ma',
    port: 21,
    user: 'ftpptf@hashmap.ma',
    pass: 'youssef159635741'
};

export async function POST(request) {
    const formData = await request.formData();
    const title = formData.get("selectcharge");
    const getdate = formData.get("datecharge");
    const date = new Date(String(JSON.parse(getdate))).toISOString();
    const designationcharge = formData.get("designationcharge");
    const montantcharge = formData.get("montantcharge");
    var file = formData.get("attachmentcharge");
    const buffer = Buffer.from(await file.arrayBuffer());
    const chargeid = formData.get("chargeid");
    var resultoffile = false;
    try {
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
        await sql.connect(config);
        const result = await sql.query`update line_charge set designation=${designationcharge},dt=${date},montant=${parseFloat(montantcharge)},attachement=${resultoffile==true ? ("https://hashmap.ma/SOFT/SIMPLEFACT/files/" + String(file.name)) : ""} where id_line_charge=${parseInt(chargeid)}`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({ success: true });
        } else {
            console.error("Cannot Update Line Charge");
            return NextResponse.json({
                success: false,
                error: 'Cannot Update Line Charge'
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
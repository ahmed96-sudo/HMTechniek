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
    var file = formData.get("addchargepickingattachment");
    const buffer = Buffer.from(await file.arrayBuffer());
    var resultoffile = false;
    try {
        await sql.connect(config);
        const result = await sql.query`select id_charge from charge where title = ${title}`;
        if (result.recordset.length > 0) {
            const id = result.recordset[0].id_charge;
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
                const result = await sql.query`insert into line_charge values (${designationcharge},${date},${parseFloat(montantcharge)},${resultoffile==true ? ("https://hashmap.ma/SOFT/SIMPLEFACT/files/" + String(file.name)) : ""},${parseInt(id)})`;
                if (result.rowsAffected[0] > 0) {
                    console.log("all good");
                    return NextResponse.json({
                        success: true,
                    });
                } else {
                    console.error("Cannot Insert Charge");
                    return NextResponse.json({
                        success: false,
                        error: 'Cannot Insert Charge'
                    });
                }
            } catch (error) {
                console.error(error);
                return NextResponse.json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        } else {
            console.error("Cannot Load Charge ID");
            return NextResponse.json({
                success: false,
                error: 'Cannot Load Charge ID'
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
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
        const result = await sql.query`SELECT * FROM company`;
        const result2 = await sql.query`SELECT * FROM ndoc`;
        if (result.recordset.length > 0 && result2.recordset.length > 0) {
            const justresult = result.recordset[0];
            const justresult2 = result2.recordset[0];
            const allresult = {...justresult,...justresult2};
            console.log("all good");
            return NextResponse.json({
                success: true,
                result: allresult
            });
        } else {
            console.error("Cannot get parameters");
            return NextResponse.json({
                success: false,
                error: 'Cannot get parameters'
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
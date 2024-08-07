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
    const { para } = await request.json();
    try {
        await sql.connect(config);
        const result = await sql.query`UPDATE [dbo].[company] SET[RaisonSocial] = ${para.RaisonSocial},[idf] = ${para.idf},[RC] = ${para.RC} ,[cnss] = ${para.cnss} ,[ice] = ${para.ice} ,[adresse] = ${para.adresse},[pathLogo] = ${para.pathLogo}`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({ success: true });
        } else {
            console.error("Cannot Update Parameters");
            return NextResponse.json({
                success: false,
                error: 'Cannot Update Parameters'
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
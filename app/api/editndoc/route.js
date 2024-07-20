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
    const { num } = await request.json();
    try {
        await sql.connect(config);
        const result = await sql.query`UPDATE [dbo].[ndoc] SET [hexF] = ${num.hexF},[nF] = ${parseInt(num.nF)},[hexD] = ${num.hexD},[nD] = ${parseInt(num.nD)},[hexA] = ${num.hexA} ,[nA] = ${parseInt(num.nA)}`;
        if (result.rowsAffected[0] > 0) {
            console.log("all good");
            return NextResponse.json({ success: true });
        } else {
            console.error("Cannot Update Numerotation");
            return NextResponse.json({
                success: false,
                error: 'Cannot Update Numerotation'
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
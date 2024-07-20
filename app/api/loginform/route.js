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
    const { username, password } = await request.json();
    if (!username || !password) {
        console.error("Username and password are required");
        return NextResponse.json({
            success: false,
            error: 'Username and password are required'
        });
    }
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM company where RaisonSocial = ${username} and pass = ${password}`;
        if (result.recordset.length > 0) {
            console.log("all good");
            return NextResponse.json({ success: true });
        } else {
            console.error("Invalid username or password");
            return NextResponse.json({
                success: false,
                error: 'Invalid username or password'
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
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { passphrase } = await req.json();
    
    const expectedPassword = process.env.ADMIN_PASSWORD;
    
    if (!expectedPassword) {
      return NextResponse.json({ error: "Server misconfiguration: ADMIN_PASSWORD is not set." }, { status: 500 });
    }

    if (passphrase === expectedPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

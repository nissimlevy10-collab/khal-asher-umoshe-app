import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPasscode, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { passcode } = (await req.json().catch(() => ({}))) as {
    passcode?: string;
  };

  if (!passcode || typeof passcode !== "string") {
    return NextResponse.json(
      { error: "נא להזין קוד גישה" },
      { status: 400 },
    );
  }

  const settings = await prisma.settings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    return NextResponse.json(
      { error: "ההגדרות לא אותחלו. הרץ db:seed." },
      { status: 500 },
    );
  }

  const ok = await verifyPasscode(passcode, settings.adminPasscode);
  if (!ok) {
    return NextResponse.json({ error: "קוד גישה שגוי" }, { status: 401 });
  }

  const token = signToken({ admin: true });
  await setAuthCookie(token);

  return NextResponse.json({ ok: true });
}

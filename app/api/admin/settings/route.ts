import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPasscode } from "@/lib/auth";

type Body = {
  synagogueName?: string;
  address?: string | null;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  donationUrl?: string | null;
  donationNote?: string | null;
  bankName?: string | null;
  bankBranch?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
  youtubeUrl?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactName?: string | null;
  aboutText?: string | null;
  newPasscode?: string | null;
};

export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) {
    return NextResponse.json({ error: "גוף בקשה לא תקין" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (body.synagogueName !== undefined)
    data.synagogueName = body.synagogueName;
  if (body.address !== undefined) data.address = body.address;
  if (body.latitude !== undefined) data.latitude = body.latitude;
  if (body.longitude !== undefined) data.longitude = body.longitude;
  if (body.timezone !== undefined) data.timezone = body.timezone;
  if (body.donationUrl !== undefined) data.donationUrl = body.donationUrl;
  if (body.donationNote !== undefined) data.donationNote = body.donationNote;
  if (body.bankName !== undefined) data.bankName = body.bankName;
  if (body.bankBranch !== undefined) data.bankBranch = body.bankBranch;
  if (body.bankAccount !== undefined) data.bankAccount = body.bankAccount;
  if (body.bankAccountName !== undefined)
    data.bankAccountName = body.bankAccountName;
  if (body.youtubeUrl !== undefined) data.youtubeUrl = body.youtubeUrl;
  if (body.contactPhone !== undefined) data.contactPhone = body.contactPhone;
  if (body.contactEmail !== undefined) data.contactEmail = body.contactEmail;
  if (body.contactName !== undefined) data.contactName = body.contactName;
  if (body.aboutText !== undefined) data.aboutText = body.aboutText;

  if (body.newPasscode) {
    if (body.newPasscode.length < 4) {
      return NextResponse.json(
        { error: "קוד גישה חייב להיות לפחות 4 תווים" },
        { status: 400 },
      );
    }
    data.adminPasscode = await hashPasscode(body.newPasscode);
  }

  const updated = await prisma.settings.update({
    where: { id: "singleton" },
    data,
  });

  // Never return the hashed passcode
  const { adminPasscode: _removed, ...safe } = updated;
  void _removed;
  return NextResponse.json(safe);
}

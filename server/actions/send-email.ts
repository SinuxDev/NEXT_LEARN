"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "GETSHINLOVE <shin@resend.dev>",
      to: [`${email}`],
      subject: "Verify your email",
      react: EmailTemplate({ domainLink: confirmLink }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

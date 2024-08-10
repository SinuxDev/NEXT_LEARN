"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (
  email: string,
  token: string,
  isPasswordReset?: boolean
) => {
  const confirmLink = isPasswordReset
    ? `${domain}/auth/reset-password?token=${token}`
    : `${domain}/auth/new-verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "GETSHINLOVE <shin@resend.dev>",
      to: [`${email}`],
      subject: "Check it's you",
      react: EmailTemplate({
        domainLink: confirmLink,
        forgetPass: isPasswordReset,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

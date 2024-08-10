import * as React from "react";

interface EmailTemplateProps {
  domainLink: string;
  forgetPass?: boolean;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  domainLink,
  forgetPass,
}) => (
  <div>
    {forgetPass && (
      <p>
        You have requested to reset your password. Please click the link below
        to reset your password. {domainLink}
      </p>
    )}
    {!forgetPass && (
      <p>
        Please click the link below to verify your email address. {domainLink}
      </p>
    )}
  </div>
);

import * as React from "react";

interface EmailTemplateProps {
  domainLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  domainLink,
}) => (
  <div>
    <h1>Welcome, {domainLink}!</h1>
  </div>
);

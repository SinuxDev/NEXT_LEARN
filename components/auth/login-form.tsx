"use client";

import { AuthCard } from "./auth-card-";

export const LoginForm = () => {
  return (
    <AuthCard
      cardTitle="Welcome Back!"
      backButtonHref="api/auth/register"
      backButtonLabel="Create new account"
      showSocials
    >
      <div></div>
    </AuthCard>
  );
};

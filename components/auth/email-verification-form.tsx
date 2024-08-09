"use client";

import { newEmailVerification } from "@/server/actions/tokens";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card-";
import { FormSuccessMsg } from "./form-success";
import { FormErrorMsg } from "./form-error";

export default function EmailVerificationForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleVerification = useCallback(async () => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError("No token found");
      return;
    }

    newEmailVerification(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }

      if (data.success) {
        setSuccess(data.success);
        return router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      backButtonLabel="Back To Login"
      backButtonHref="/auth/login"
      cardTitle="Verify Your Email Address"
    >
      <div className="flex items-center flex-col w-full justify-between">
        <p>{!success && !error && "Verifying your email..."}</p>
        <FormSuccessMsg message={success} />
        <FormErrorMsg message={error} />
      </div>
    </AuthCard>
  );
}

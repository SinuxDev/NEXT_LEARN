"use client";

import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonProps = {
  backButtonHref: string;
  backButtonLabel: string;
};

export const BackButton = ({
  backButtonHref,
  backButtonLabel,
}: BackButtonProps) => {
  return (
    <>
      <Button
        className="font-medium w-full text-base py-6"
        variant={"link"}
        asChild
      >
        <Link aria-label={backButtonLabel} href={backButtonHref}>
          {backButtonLabel}
        </Link>
      </Button>
    </>
  );
};

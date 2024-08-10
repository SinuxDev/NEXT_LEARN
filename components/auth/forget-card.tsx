import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BackButton } from "./back-button";

type ForgetCardProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
};

export const ForgetCard: React.FC<ForgetCardProps> = ({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mx-auto font-bold text-3xl">
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent> {children} </CardContent>
      <CardFooter>
        <BackButton
          backButtonHref={backButtonHref}
          backButtonLabel={backButtonLabel}
        />
      </CardFooter>
    </Card>
  );
};

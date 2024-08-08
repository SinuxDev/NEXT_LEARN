import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BackButton } from "./back-button";
import Socials from "./social";

type AuthCardProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
};

export const AuthCard = ({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: AuthCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mx-auto font-bold text-3xl">
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials ? (
        <CardFooter>
          <Socials isLogin={true} />
        </CardFooter>
      ) : (
        <CardFooter>
          <Socials isLogin={false} />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          backButtonHref={backButtonHref}
          backButtonLabel={backButtonLabel}
        />
      </CardFooter>
    </Card>
  );
};

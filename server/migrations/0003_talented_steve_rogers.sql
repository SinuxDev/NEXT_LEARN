CREATE TABLE IF NOT EXISTS "email_verificationToken" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email_verificationToken_id_token_pk" PRIMARY KEY("id","token")
);

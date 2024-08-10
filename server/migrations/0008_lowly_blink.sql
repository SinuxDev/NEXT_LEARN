CREATE TABLE IF NOT EXISTS "new_password_reset_token" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "new_password_reset_token_id_token_pk" PRIMARY KEY("id","token"),
	CONSTRAINT "new_password_reset_token_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "two_factor_tokens_id_token_pk" PRIMARY KEY("id","token"),
	CONSTRAINT "two_factor_tokens_email_unique" UNIQUE("email")
);

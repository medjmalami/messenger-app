CREATE TABLE "blocked_users" (
	"id" integer PRIMARY KEY NOT NULL,
	"blocker_id" integer NOT NULL,
	"blocked_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blocker_blocked_idx" UNIQUE("blocker_id","blocked_id")
);
--> statement-breakpoint
CREATE TABLE "conversation_members" (
	"id" integer PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"is_admin" boolean DEFAULT false,
	"joined_at" timestamp DEFAULT now(),
	CONSTRAINT "conversation_user_idx" UNIQUE("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"type" varchar(10) NOT NULL,
	"photo" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "friend_requests" (
	"id" integer PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sender_receiver_idx" UNIQUE("sender_id","receiver_id")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" integer PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content_type" varchar(10) NOT NULL,
	"content" text,
	"file_path" varchar(255),
	"file_name" varchar(255),
	"file_size" integer,
	"duration" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blocker_id_users_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blocked_id_users_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
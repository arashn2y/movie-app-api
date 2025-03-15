import { pgTable, uuid, text, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").unique().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	password: text("password").notNull(),
});

export const movies = pgTable("movies", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	director: text("director").notNull(),
	year: integer("year").notNull(),
	genre: text("genre").notNull(),
	description: text("description"),
	duration: integer("duration").notNull(),
	rating: integer("rating").notNull().default(0),
	actors: jsonb("actors").notNull().default([]),
	photoUrl: text("photo_url").notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

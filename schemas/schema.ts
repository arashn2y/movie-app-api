import z from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string()
});

export type User = z.infer<typeof userSchema>;

export const newUserSchema = userSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true
});

export type NewUser = z.infer<typeof newUserSchema>;

export const updateUserSchema = userSchema.partial().omit({ id: true, email: true });

export type UpdateUser = z.infer<typeof updateUserSchema>;

// Movie schema
export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  director: z.string(),
  year: z.number(),
  genre: z.string(),
  description: z.string().optional(),
  duration: z.number(),
  rating: z.number(),
  actors: z.array(z.string()).default([]),
  photoUrl: z.string()
});

export type Movie = z.infer<typeof movieSchema>;

const newMovie = movieSchema.pick({
  title: true,
  director: true,
  year: true,
  genre: true,
  description: true,
  duration: true,
  actors: true,
  photoUrl: true
});

export type NewMovie = z.infer<typeof newMovie>;

export const movieUpdateSchema = movieSchema.partial().omit({ id: true });

export type UpdateMovie = z.infer<typeof movieUpdateSchema>;

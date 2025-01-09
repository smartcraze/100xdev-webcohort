import z from "zod";
export const userSchema = z.object({
  name: z.string().max(50),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  username: z.string().min(3).max(10),
});

export const logedinuser = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(6).max(50),
});

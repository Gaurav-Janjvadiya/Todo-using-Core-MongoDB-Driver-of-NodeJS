import { z } from "zod";

export const todo = z.object({
  todo: z.string(),
});

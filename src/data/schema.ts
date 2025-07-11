import { z } from "zod"

export const schema = z.object({
  id: z.number(),
  username: z.string(),
  date: z.string(),
  warehouse_name: z.string(),
  amount: z.number(),
  status: z.enum(["Done", "In Process", "Not Started"]),
})
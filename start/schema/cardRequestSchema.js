import { z } from 'zod';


export const cardUpdateSchema = z.object({
  updates: z.array(
    z.object({
      card_id: z.number().int().positive(),
      is_correct: z.boolean(),
      interval: z.number().int().positive(),
      ease_factor: z.number().int().positive()
    })
  )
});

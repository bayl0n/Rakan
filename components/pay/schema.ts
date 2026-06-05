import * as z from "zod";

import { Pers } from "@/lib/finance/periods";
import { SuperModes, TaxYears } from "@/lib/finance/pay";

function requiredNumber(schema: z.ZodNumber) {
  return z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema,
  );
}

export const payFormSchema = z.object({
  grossIncome: requiredNumber(
    z.coerce
      .number({
        invalid_type_error: "Gross income must be greater than 0.",
        required_error: "Gross income must be greater than 0.",
      })
      .positive({
        message: "Gross income must be greater than 0.",
      }),
  ),
  per: z.enum(Pers),
  superMode: z.enum(SuperModes),
  superRate: requiredNumber(
    z.coerce
      .number({
        invalid_type_error: "Super rate must be between 0 and 100.",
        required_error: "Super rate must be between 0 and 100.",
      })
      .min(0, {
        message: "Super rate must be between 0 and 100.",
      })
      .max(100, {
        message: "Super rate must be between 0 and 100.",
      }),
  ),
  hasHelpDebt: z.boolean(),
  taxYear: z.enum(TaxYears),
});

export type PayFormValues = z.infer<typeof payFormSchema>;

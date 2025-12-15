import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().min(1),
  SERVER_URL: z.string().min(1),
  NODE_ENV: z.string().min(1)
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    error.errors.forEach((err) => {
      console.error(`  ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export default env;

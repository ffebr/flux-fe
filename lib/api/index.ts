import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const apiClient = createClient<paths>({
  baseUrl: typeof window !== 'undefined' ? '/api' : (process.env.API_URL || "http://localhost:8080"),
});

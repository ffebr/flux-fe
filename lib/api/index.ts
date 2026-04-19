import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { getApiUrl } from "../config";

export const apiClient = createClient<paths>({
  baseUrl: getApiUrl(),
});

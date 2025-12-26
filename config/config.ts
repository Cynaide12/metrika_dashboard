export interface Config {
  BASE_API_URL: string,
}

export const config: Config = {
  BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8080/api/v1",
};
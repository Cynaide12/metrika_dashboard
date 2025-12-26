import { GuestSession } from "./models";

export declare interface Response {
  status: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  response: Response;
  token: string;
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_second: string
}

export interface RegisterResponse {
  response: Response
  token:string
}

export interface GuestsVisitsResponse {
  sessions: GuestSession[]
  response: Response
}
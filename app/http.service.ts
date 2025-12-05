import axios from "axios";
import { IApiResponse } from "./interfaces/api.response";

class HttpClient {
  private _axiosInstance;

  constructor() {
    this._axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<T>(url: string): Promise<T | null> {
    const response = await this._axiosInstance.get<IApiResponse<T>>(url);
    return response.data.data;
  }
  async post<T, I = unknown>(url: string, data: I): Promise<T | null> {
    const response = await this._axiosInstance.post<IApiResponse<T>>(url, data);
    return response.data.data;
  }
}

export const httpClient = new HttpClient();

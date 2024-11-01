import axios, { AxiosInstance } from "axios";

export type ApiResponse<T> = {
  status: number;
  data: T;
};

class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error("Base URL is required");
    }
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<T>(url);
    return {
      status: response.status,
      data: response.data,
    };
  }

  async post<T, K>(url: string, body: K): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, body);
    return {
      status: response.status,
      data: response.data,
    };
  }

  async put<T, K>(url: string, body: K): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, body);
    return {
      status: response.status,
      data: response.data,
    };
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url);
    return {
      status: response.status,
      data: response.data,
    };
  }
}

export const httpClient = new HttpClient(
  process.env.NEXT_PUBLIC_BASE_URL as string ?? "http://localhost:3000/api",
);

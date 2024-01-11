import { isGraphQLReponse } from "@/graphql/utils";
import axios from "axios";

const graphQLBaseAxiosClient = axios.create({
  baseURL: "http://127.0.0.1:1337/graphql",
  headers: {
    "Content-Type": "application/json",
  },
});

graphQLBaseAxiosClient.interceptors.response.use((response) => {
  if (isGraphQLReponse(response.data) && response.data.error && response.data.error.errors.length) {
    return Promise.reject(response.data.error.errors[0].message);
  }

  return response;
});

export const graphQLClient = <T = any>(query: string) => graphQLBaseAxiosClient.post<T>("", { query });

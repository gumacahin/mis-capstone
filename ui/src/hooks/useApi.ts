import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { AnyJSON } from "../types/common";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Api<T = any> {
  api: (
    url: string,
    method?: "POST" | "UPDATE" | "PUT" | "GET" | "DELETE" | "PATCH",
    body?: AnyJSON | FormData,
    returnType?: "json" | "file"
  ) => Promise<T>;
}

export default function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const api = useCallback(
    async (
      url: string,
      method: "POST" | "UPDATE" | "PUT" | "GET" | "DELETE" | "PATCH" = "GET",
      body?: AnyJSON | FormData,
      returnType: "json" | "file" = "json"
    ) => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          // TODO: get from AUTH0 constants
          audience: "http://todoappdev/api",
        },
      });

      let options = {};
      if (
        (Boolean(body) && body instanceof FormData) ||
        returnType === "file"
      ) {
        options = {
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      } else if (body) {
        options = {
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      } else {
        options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      }

      const result = await fetch(url, {
        method,
        ...options,
      });

      if (result.headers.get("content-length") === "0") {
        return null;
      }

      if (returnType === "json") {
        return await result.json();
      }

      return result;
    },
    [getAccessTokenSilently]
  );

  return { api };
}

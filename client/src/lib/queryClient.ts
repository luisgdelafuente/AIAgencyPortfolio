import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Adjust URL for Netlify deployment if needed
  const adjustedUrl = process.env.NODE_ENV === 'production' && url.startsWith('/api/') 
    ? `/.netlify/functions/api${url.substring(4)}` 
    : url;
  
  const res = await fetch(adjustedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Adjust URL for Netlify deployment if needed
    const url = queryKey[0] as string;
    const adjustedUrl = process.env.NODE_ENV === 'production' && url.startsWith('/api/') 
      ? `/.netlify/functions/api${url.substring(4)}` 
      : url;
      
    const res = await fetch(adjustedUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true,  // Enable refetch on window focus
      staleTime: 5 * 60 * 1000,    // 5 minutes instead of Infinity
      retry: 1,                    // Allow 1 retry on failure
    },
    mutations: {
      retry: 1,                    // Allow 1 retry on failure
    },
  },
});

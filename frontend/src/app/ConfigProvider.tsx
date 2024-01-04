"use client";

import { ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { apolloClient } from "./config";

export const queryClient = new QueryClient();

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApolloProvider>
  );
};

export default ConfigProvider;

const STRAPI_BASE_URL = "http://127.0.0.1:1337/graphql";

export const strapiClient = async (query: string) => {
  const response = await fetch(STRAPI_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const parsedResponse = await response.json();

  return parsedResponse;
};

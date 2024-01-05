type FetchParams = Parameters<typeof fetch>;

const strapiClient = async (...args: FetchParams) => {
  const response = await fetch(...args);
  const parsedResponse = await response.json();
};

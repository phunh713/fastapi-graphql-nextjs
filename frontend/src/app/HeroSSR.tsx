import { queryBuilder } from "@/graphql/utils";
import { Hero, RootQuery } from "./interface";
import HeroDisplay from "./HeroDisplay";
import RandomButton from "./RandomButton";
import { GraphQLResponse, QueryBuilder } from "@/graphql/interface";
import { graphQLClient } from "./config";

async function HeroSSR({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const id = searchParams["id"];
  const queryArgs: QueryBuilder<RootQuery> = {};
  if (id) {
    queryArgs.hero = {
      variables: { id: +id },
      fields: {
        id: true,
        name: true,
        attackType: {
          directive: {
            type: "@include",
            if: true,
          },
        },
        attribute: true,
        skills: {
          fields: {
            id: true,
            name: true,
          },
        },
      },
    };
  }

  let response;
  if (Object.keys(queryArgs).length) {
    const builtQuery = queryBuilder<any>({ query: queryArgs });
    response = await graphQLClient<GraphQLResponse<{ hero: Hero }>>(builtQuery);
  }
  return (
    <div>
      <h3>Server Side Rendering</h3>
      <RandomButton />
      {response?.data.data && <HeroDisplay hero={response.data.data} />}
    </div>
  );
}

export default HeroSSR;

import { graphQLClient } from "@/graphql/client";
import { QueryBuilder, queryBuilder } from "@/graphql/utils";
import { Hero, RootQuery } from "./interface";
import HeroDisplay from "./HeroDisplay";
import RandomButton from "./RandomButton";

async function HeroSSR({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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
            type: "@skip",
            if: true,
          },
        },
        attribute: true,
        skills: {
          fields: {
            id: true,
            name: true,
            description: true,
            type: true,
          },
        },
      },
    };
  }
  let response: { hero: Hero } = {} as { hero: Hero };
  if (!!Object.keys(queryArgs).length) {
    const builtQuery = queryBuilder<any>({ query: queryArgs });
    response = await graphQLClient<{ hero: Hero }>(builtQuery);
  }
  return (
    <div>
      <h3>Server Side Rendering</h3>
      <RandomButton />
      {response.hero && <HeroDisplay hero={response.hero} />}
    </div>
  );
}

export default HeroSSR;

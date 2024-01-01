import { graphQLClient } from "@/graphql/client";
import { Query, queryBuilder } from "@/graphql/utils";
import { Hero, RootQuery } from "./interface";
import HeroDisplay from "./HeroDisplay";
import Link from "next/link";

async function HeroSSR({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = searchParams["id"];
  const queryArgs: Query<RootQuery> = {};
  if (id) {
    queryArgs.hero = () => ({
      fnArgs: { id: +id },
      id: true,
      name: true,
      attackType: true,
      attribute: true,
      skills: {
        id: true,
        name: true,
        description: true,
        type: true,
      },
    });
  }
  let response: { hero: Hero } = {} as { hero: Hero };
  if (!!Object.keys(queryArgs).length) {
    const builtQuery = queryBuilder<any>({ query: queryArgs });
    response = await graphQLClient<{ hero: Hero }>(builtQuery);
  }
  return (
    <div>
      <h3>Server Side Rendering</h3>
      <Link
        href={`http://localhost:3000/?id=${Math.floor(Math.random() * 7) + 1}`}>
        <button>Random</button>
      </Link>
      {response.hero && <HeroDisplay hero={response.hero} />}
    </div>
  );
}

export default HeroSSR;

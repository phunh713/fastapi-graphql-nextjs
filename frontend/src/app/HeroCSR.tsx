"use client";

import { queryBuilder } from "@/graphql/utils";
import React, { useMemo } from "react";
import { Hero, RootQuery } from "./interface";
import { graphQLClient } from "@/graphql/client";
import HeroDisplay from "./HeroDisplay";
import RandomButton from "./RandomButton";

const HeroCSR = () => {
  const [id, setId] = React.useState<number | undefined>(undefined);
  const [hero, setHero] = React.useState<Hero | undefined>(undefined);

  const query = useMemo(() => {
    if (!id) return undefined;
    return queryBuilder<RootQuery>({
      query: {
        hero: () => ({
          fnArgs: { id },
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
        }),
      },
    });
  }, [id]);

  React.useEffect(() => {
    if (query) {
      (async () => {
        const res = await graphQLClient<{ hero: Hero }>(query);
        setHero(res.hero);
      })();
    }
  }, [query]);

  return (
    <div>
      <h3>Client Side Rendering</h3>
      <RandomButton onClick={() => setId(Math.floor(Math.random() * 7) + 1)} />
      {hero && <HeroDisplay hero={hero} />}
    </div>
  );
};

export default HeroCSR;

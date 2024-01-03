"use client";

import { queryBuilder } from "@/graphql/utils";
import React, { useMemo } from "react";
import { Hero } from "./interface";
import { graphQLClient } from "@/graphql/client";
import HeroDisplay from "./HeroDisplay";
import RandomButton from "./RandomButton";
import { RootQuery } from "@/graphql/generatedTypes";

const HeroCSR = () => {
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [hero, setHero] = React.useState<Hero | undefined>(undefined);

  const query = useMemo(() => {
    if (!id) return undefined;
    return queryBuilder<RootQuery>({
      query: {
        hero: {
          variables: { id },
          fields: {
            __typename: true,
            id: true,
            name: true,
            attackType: true,
            attribute: true,
            skills: {
              fields: {
                __typename: true,
                id: true,
                name: true,
                description: {
                  directive: {
                    type: "@include",
                    if: true,
                  },
                },
                type: true,
              },
            },
          },
        },
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
      <RandomButton
        onClick={() => setId(`${Math.floor(Math.random() * 7) + 1}`)}
      />
      {hero && <HeroDisplay hero={hero} />}
    </div>
  );
};

export default HeroCSR;

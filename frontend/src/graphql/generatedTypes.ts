import { useQuery, UseQueryOptions } from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };

export function fetcher<TData, TVariables>(
  endpoint: string,
  query: string,
  requestInit?: RequestInit,
  variables?: TVariables
) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: "POST",
      ...requestInit,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export enum AttactType {
  Range = "range",
  Melee = "melee",
}

export enum Attribute {
  Strength = "strength",
  Magic = "magic",
  Agility = "agility",
}

export type HeroCreateInputType = {
  name: Scalars["String"]["input"];
  avatar?: InputMaybe<Scalars["String"]["input"]>;
  attackType: AttactType;
  attribute: Attribute;
  baseMovement: Scalars["Int"]["input"];
  baseDamage: Scalars["Int"]["input"];
  baseHealth: Scalars["Int"]["input"];
};

export enum HeroSkillType {
  Active = "active",
  Passive = "passive",
}

export type HeroType = {
  __typename?: "HeroType";
  skills: Array<SkillType>;
  id?: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  avatar?: Maybe<Scalars["String"]["output"]>;
  attackType: AttactType;
  attribute: Attribute;
  baseMovement: Scalars["Int"]["output"];
  baseDamage: Scalars["Int"]["output"];
  baseHealth: Scalars["Int"]["output"];
};

export type RootMutation = {
  __typename?: "RootMutation";
  addHero: HeroType;
  addHeroes: Array<HeroType>;
  addSkill: SkillType;
  addSkills: Array<SkillType>;
};

export type RootMutationAddHeroArgs = {
  input: HeroCreateInputType;
};

export type RootMutationAddHeroesArgs = {
  input: Array<HeroCreateInputType>;
};

export type RootMutationAddSkillArgs = {
  input: SkillCreateInputType;
};

export type RootMutationAddSkillsArgs = {
  input: Array<SkillCreateInputType>;
};

export type RootQueryHeroArgs = {
  id: Scalars["ID"]["input"];
};

export type RootQuerySkillArgs = {
  id: Scalars["ID"]["input"];
};

export type SkillCreateInputType = {
  name: Scalars["String"]["input"];
  type: HeroSkillType;
  description?: InputMaybe<Scalars["String"]["input"]>;
  manaCost: Scalars["Int"]["input"];
  cooldown: Scalars["Int"]["input"];
  heroId?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SkillType = {
  __typename?: "SkillType";
  hero: HeroType;
  id?: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  type: HeroSkillType;
  description?: Maybe<Scalars["String"]["output"]>;
  manaCost: Scalars["Int"]["output"];
  cooldown: Scalars["Int"]["output"];
  heroId?: Maybe<Scalars["Int"]["output"]>;
};

export type FindHeroesQueryVariables = Exact<{ [key: string]: never }>;

export type FindHeroesQuery = {
  __typename?: "RootQuery";
  heroes: Array<{ __typename?: "HeroType"; id?: number | null; name: string }>;
};

export const FindHeroesDocument = `
    query findHeroes {
  heroes {
    id
    name
  }
}
    `;

export type RootQuery = {
  __typename?: "RootQuery";
  heroes: HeroType[];
  hero: (id: Scalars["ID"]["input"], age: number) => Maybe<HeroType>;
  skills: Array<SkillType>;
  skill?: (id: Scalars["ID"]["input"]) => Maybe<SkillType>;
};

export const useFindHeroesQuery = <TData = FindHeroesQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: FindHeroesQueryVariables,
  options?: UseQueryOptions<FindHeroesQuery, TError, TData>
) =>
  useQuery<FindHeroesQuery, TError, TData>({
    queryKey:
      variables === undefined ? ["findHeroes"] : ["findHeroes", variables],
    queryFn: fetcher<FindHeroesQuery, FindHeroesQueryVariables>(
      dataSource.endpoint,
      FindHeroesDocument,
      dataSource.fetchParams || {},
      variables
    ),
    ...options,
  });

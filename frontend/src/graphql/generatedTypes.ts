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
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  avatar?: Maybe<Scalars["String"]["output"]>;
  attackType: AttactType;
  attribute: Attribute;
  baseMovement: Scalars["Int"]["output"];
  baseDamage: Scalars["Int"]["output"];
  baseHealth: Scalars["Int"]["output"];
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
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  type: HeroSkillType;
  description?: Maybe<Scalars["String"]["output"]>;
  manaCost: Scalars["Int"]["output"];
  cooldown: Scalars["Int"]["output"];
  heroId?: Maybe<Scalars["Int"]["output"]>;
};

export type RootMutation = {
  __typename?: "RootMutation";
  addHero: (input: RootMutationAddHeroArgs) => HeroType;
  addHeroes: (input: RootMutationAddHeroesArgs) => Array<HeroType>;
  addSkill: (input: RootMutationAddSkillArgs) => SkillType;
  addSkills: (input: RootMutationAddSkillsArgs) => Array<SkillType>;
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

export type RootQuery = {
  __typename?: "RootQuery";
  heroes: Maybe<Array<HeroType>>;
  hero?: (input: RootQueryHeroArgs) => Maybe<HeroType>;
  skills: Array<SkillType>;
  skill?: (input: RootQuerySkillArgs) => Maybe<SkillType>;
  all: Array<SkillTypeHeroType>;
};

export type RootQueryHeroArgs = {
  id: Scalars["ID"]["input"];
};

export type RootQuerySkillArgs = {
  id: Scalars["ID"]["input"];
};

export type SkillTypeHeroType = SkillType | HeroType;

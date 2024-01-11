export type Skill = {
  id: number;
  name: string;
  description: string;
  type: string;
};

export type Hero = {
  id: number;
  name: string;
  attackType: string;
  attribute: string;
  skills: Skill[];
};

export type RootQuery = {
  heroes: Hero[];
  hero: (args: { id: number }) => Hero;
};

export type NextPageProps = {
  params: { [key: string]: any };
  searchParams: { [key: string]: string | string[] | undefined };
};

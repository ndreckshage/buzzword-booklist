import Database from "./database";

export type ResolverContext = {
  db: InstanceType<typeof Database>;
};

export default function createContext() {
  return {
    db: new Database(),
  };
}

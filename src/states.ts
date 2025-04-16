import { atom, selector } from "recoil";

export const asyncDataState = selector<string>({
  key: "asyncDataState",
  get: async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return "Fetched Data";
  },
});

export const normalState = atom<string>({
  key: "normalState",
  default: "Default Value",
});

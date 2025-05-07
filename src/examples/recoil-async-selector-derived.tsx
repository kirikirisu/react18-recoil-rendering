import { Suspense } from "react";
import { selector, atom, useRecoilValue } from "recoil";
import { waitFor } from "./utils";

const userState = selector({
  key: "user",
  async get() {
    await waitFor();

    return {
      name: "bob",
      email: "bob@bob.com",
    };
  },
});

const initilaDefaultValue = selector({
  key: "initial-default-value",
  async get({ get }) {
    return { user: get(userState), version: "3.0.0" };
  },
});

const initialAsyncValue = selector({
  key: "initial-async-value",
  async get({ get }) {
    const user = get(initilaDefaultValue);

    await waitFor();

    return {
      ...user,
      title: "dummy title",
      content: "<p>dummy text</p>",
      images: ["image-src1", "image-src2", "image-src3"],
      tag: ["editor", "tiptap", "react", "typescript"],
    };
  },
});

export const titleValue = atom({
  key: "title-value",
  default: selector({
    key: "titile-default-value",
    get: ({ get }) => get(initialAsyncValue).title,
  }),
});

function Title() {
  const title = useRecoilValue(titleValue);

  return <h2>{title}</h2>;
}

export function DemoComponent() {
  return (
    <>
      <h1>Recoil async selector derived demo.</h1>
      <Suspense fallback={<h2>Now Loading...</h2>}>
        <Title />
      </Suspense>
    </>
  );
}

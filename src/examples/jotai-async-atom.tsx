import { Suspense } from "react";
import { atom, useAtom } from "jotai";
import { waitFor } from "./utils";

const initialAsyncValueAtom = atom(async () => {
  await waitFor();

  return {
    title: "dummy title",
    content: "<p>dummy text</p>",
    images: ["image-src1", "image-src2", "image-src3"],
    tag: ["editor", "tiptap", "react", "typescript"],
  };
});

const titleAtom = atom(async (get) => {
  const initialValue = await get(initialAsyncValueAtom);

  return initialValue.title;
});

function Title() {
  const title = useAtom(titleAtom);

  return <h2>{title}</h2>;
}

export function DemoComponent() {
  return (
    <>
      <h1>Jotai async atom derived demo.</h1>
      <Suspense fallback={<h2>Now Loading...</h2>}>
        <Title />
      </Suspense>
    </>
  );
}

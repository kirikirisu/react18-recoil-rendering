import { atom, useAtom } from "jotai";
import { waitFor } from "./utils";

// --- Jotai の状態定義 ---

// 保存ステータス
export const saveStatusAtom = atom<"IDLE" | "SAVING" | "SAVED" | "ERROR">(
  "IDLE"
);

// エディタの「保存中」画面表示フラグ
export const editorSavingScreenVisibleAtom = atom<boolean>(false);

// API 呼び出しデータを非同期で取得する atom（Recoil の selector 相当）
export const pressReleaseUpdateRequestPayloadAtom = atom(async () => {
  await waitFor();
  return {
    releaseId: "123",
    updatePressReleaseRequestBody: {
      csrfToken: "fakeCsrfToken",
      pressRelease: { text: "Initial Text" },
    },
  };
});

// 更新処理を行うための書き込み専用 atom
// 第二引数の async (get, set) => { … } が Recoil の useRecoilCallback 相当
export const updatePressReleaseAtom = atom(null, async (get, set) => {
  const currentStatus = get(saveStatusAtom);
  const isSavingScreenVisible = get(editorSavingScreenVisibleAtom);
  const isSaving = currentStatus === "SAVING" || isSavingScreenVisible;

  if (isSaving) {
    console.log("Already saving, skipping...");
    return;
  }

  try {
    set(saveStatusAtom, "SAVING");
    set(editorSavingScreenVisibleAtom, true);

    // 非同期 atom は await get(...) で待機できる
    const {
      releaseId,
      updatePressReleaseRequestBody: { csrfToken, pressRelease },
    } = await get(pressReleaseUpdateRequestPayloadAtom);

    console.log("Updating press release...", {
      releaseId,
      csrfToken,
      text: pressRelease.text,
    });

    set(saveStatusAtom, "SAVED");
    console.log("Press release updated successfully!");
  } catch (error) {
    set(saveStatusAtom, "ERROR");
    console.error("Failed to update press release:", error);
  } finally {
    set(editorSavingScreenVisibleAtom, false);
  }
});

// --- フック ---

export const useUpdatePressRelease = () => {
  const [, updatePressRelease] = useAtom(updatePressReleaseAtom);
  return { updatePressRelease };
};

// --- デモコンポーネント ---

export const DemoComponent = () => {
  const [saveStatus] = useAtom(saveStatusAtom);
  const [isSavingScreenVisible] = useAtom(editorSavingScreenVisibleAtom);
  const { updatePressRelease } = useUpdatePressRelease();

  return (
    <div>
      <h1>Jotai async useCallback</h1>
      <button onClick={updatePressRelease} disabled={saveStatus === "SAVING"}>
        Update Press Release
      </button>
      <p>Status: {saveStatus}</p>
      {isSavingScreenVisible && <p>Saving...</p>}
    </div>
  );
};

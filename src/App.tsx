import React from "react";
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilState,
  useRecoilCallback,
} from "recoil";

// Recoilの状態
const saveStatusState = atom<string>({
  key: "saveStatusState",
  default: "IDLE", // 初期状態
});

const pressReleaseUpdateRequestPayload = selector({
  key: "pressReleaseUpdateRequestPayload",
  get: async () => {
    // APIからデータを取得するシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      releaseId: "123",
      updatePressReleaseRequestBody: {
        csrfToken: "fakeCsrfToken",
        pressRelease: { text: "Initial Text" },
      },
    };
  },
});

const editorSavingScreenVisibleState = atom<boolean>({
  key: "editorSavingScreenVisibleState",
  default: false,
});

// フックの実装
const useUpdatePressRelease = () => {
  // const saveStatus = useRecoilValue(saveStatusState);
  // const isSavingScreenVisible = useRecoilValue(editorSavingScreenVisibleState);

  const updatePressRelease = useRecoilCallback(
    ({ snapshot: { getPromise }, set }) =>
      async () => {
        // const isSaving = saveStatus || isSavingScreenVisible;

        const isSaving =
          (await getPromise(saveStatusState)) === "SAVING" ||
          (await getPromise(editorSavingScreenVisibleState));

        if (isSaving) {
          console.log("Already saving, skipping...");
          return;
        }

        try {
          set(saveStatusState, "SAVING");
          set(editorSavingScreenVisibleState, true);

          // API呼び出しデータの取得
          const {
            releaseId,
            updatePressReleaseRequestBody: { csrfToken, pressRelease },
          } = await getPromise(pressReleaseUpdateRequestPayload);

          // 実際の更新処理のシミュレーション
          console.log("Updating press release...", {
            releaseId,
            csrfToken,
            text: pressRelease.text,
          });

          // 成功時の処理
          set(saveStatusState, "SAVED");
          console.log("Press release updated successfully!");
        } catch (error) {
          // エラーハンドリング
          set(saveStatusState, "ERROR");
          console.error("Failed to update press release:", error);
        } finally {
          set(editorSavingScreenVisibleState, false);
        }
      }
  );

  return { updatePressRelease };
};

// デモコンポーネント
const DemoComponent = () => {
  const { updatePressRelease } = useUpdatePressRelease();
  const saveStatus = useRecoilValue(saveStatusState);
  const isSavingScreenVisible = useRecoilValue(editorSavingScreenVisibleState);

  return (
    <div>
      <button onClick={updatePressRelease} disabled={saveStatus === "SAVING"}>
        Update Press Release
      </button>
      <p>Status: {saveStatus}</p>
      {isSavingScreenVisible && <p>Saving...</p>}
    </div>
  );
};

export default DemoComponent;

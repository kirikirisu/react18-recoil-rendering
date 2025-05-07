export async function waitFor(time: number = 2000) {
  return await new Promise((resolve) => setTimeout(resolve, time));
}

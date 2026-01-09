export async function getPromiseError(failPromise: Promise<any>) {
  let error: Error | null = null
  try {
    await failPromise
  } catch (e) {
    error = e as Error
  }
  return error
}

import sleep from "./Sleep";

type PromiseFunction = () => Promise<any>;
type NOOP = (err: Error, attempt: number) => {};

export default async function exponentialBackoff(
  promiseFunction: PromiseFunction,
  failureFunction?: NOOP,
  err?: Error,
  totalAllowedBackoffTries: number = 5,
  backoffAttempt: number = 1
): Promise<any> {
  const backoffSecondsToWait = 2 + Math.pow(backoffAttempt, 2);

  if (backoffAttempt > totalAllowedBackoffTries) throw err;

  try {
    const result = await promiseFunction();
    return result;
  } catch (err) {
    if (failureFunction) failureFunction(err, backoffAttempt);
    await sleep(backoffSecondsToWait * 1000);
    return await exponentialBackoff(
      promiseFunction,
      failureFunction,
      err,
      totalAllowedBackoffTries,
      backoffAttempt + 1
    );
  }
}

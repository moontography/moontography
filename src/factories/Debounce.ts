// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export default function Debounce(
  func: any,
  waitMs: number = 500,
  immediate: boolean = false
) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...params: any) {
    const context = this;
    const args = params;
    const later = function () {
      // timeout = null
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, waitMs);
    if (callNow) func.apply(context, args);
  };
}

// ----------------------------------------------------------------------

export function localStorageAvailable() {
  if (typeof window === "undefined") return false; // Ensure this runs only in the browser
  try {
    const key = "__some_random_key_you_are_not_going_to_use__";
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("storage_error", error);
    return false;
  }
}

export function localStorageGetItem(key: string, defaultValue = "") {
  if (!localStorageAvailable()) return defaultValue; // Use default if storage is not available
  return window.localStorage.getItem(key) || defaultValue;
}

export const localStorageSetItem = (key: string, value: string) => {
  if (localStorageAvailable()) {
    window.localStorage.setItem(key, value);
  }
};

export const localStorageRemoveItem = (key: string) => {
  if (localStorageAvailable()) {
    window.localStorage.removeItem(key);
  }
};

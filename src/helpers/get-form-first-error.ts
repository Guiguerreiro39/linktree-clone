import type { FieldErrors } from "react-hook-form";

export const getFormFirstError = (errors: FieldErrors) => {
  if (!errors) return undefined;

  const findFirstError = (obj: Record<string, unknown>): string | undefined => {
    // If the object has a message property, return it
    if (obj?.message && typeof obj.message === "string") return obj.message;

    // If it's an array, check each element
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const message = findFirstError(item as Record<string, unknown>);
        if (message) return message;
      }
    }

    // If it's an object, check each property
    if (typeof obj === "object") {
      for (const key in obj) {
        const message = findFirstError(obj[key] as Record<string, unknown>);
        if (message) return message;
      }
    }

    return undefined;
  };

  return findFirstError(errors);
};

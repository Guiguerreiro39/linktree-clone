export const enforceFirstLetter = (
  enforcedCharacter: string,
  value: string,
) => {
  if (value.length === 0) return value;

  const firstCharacter = value[0];

  if (value.length === 1 && firstCharacter === enforcedCharacter) return "";
  if (firstCharacter === enforcedCharacter) return value;

  return enforcedCharacter + value;
};

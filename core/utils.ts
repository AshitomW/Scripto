export function isAlphabet(str: string) {
  return str.toUpperCase() != str.toLowerCase();
}
export function isNumeric(str: string) {
  const char = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];

  return char >= bounds[0] && char <= bounds[1];
}

export function isOptional(str: string) {
  return str == " " || str == "\n" || str == "\t";
}

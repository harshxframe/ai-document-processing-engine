export function cleanPageText(text) {
  return (
    text
      // Windows line endings
      .replace(/\r\n/g, "\n")

      // Tabs -> Space
      .replace(/\t/g, " ")

      // Multiple spaces
      .replace(/[ ]{2,}/g, " ")

      // Remove page markers
      .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")

      // Remove empty lines
      .replace(/\n{3,}/g, "\n\n")

      // Remove spaces before new line
      .replace(/[ \t]+\n/g, "\n")

      // Remove leading/trailing whitespace
      .trim()
  );
}
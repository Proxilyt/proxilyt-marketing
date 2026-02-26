export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    return 0;
  }
  const wordCount = trimmedContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

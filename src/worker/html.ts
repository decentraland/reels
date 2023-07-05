export function escape(value: string) {
  return value.replace(/["|'|&|<|>]/gi, (match) => {
    switch (match) {
      case `"`:
        return "&quot;"
      case `'`:
        return "&apos;"
      case `&`:
        return "&amp;"
      case `<`:
        return "&lt;"
      case `>`:
        return "&gt;"
      default:
        return match
    }
  })
}

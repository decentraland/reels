import { escape } from "./html"

export type OpenGraphWriterOptions = {
  title?: string | null
  description?: string | null
  image?: string | null
}

export class OpenGraphWriter {
  constructor(public options: OpenGraphWriterOptions = {}) {}

  element(element: Element): void | Promise<void> {
    if (this.options.title) {
      const title = escape(this.options.title)
      element.setInnerContent(title)
      element.after(`<meta property="og:title" content="${title}" />`, {
        html: true,
      })
      element.after(`<meta name="twitter:site" content="@decentraland" />`, {
        html: true,
      })
    }

    if (this.options.description) {
      const description = escape(this.options.description)
      element.after(
        `<meta property="og:description" content="${description}" />`,
        { html: true }
      )
    }

    if (this.options.image) {
      const image = this.options.image
      element.after(`<meta property="og:image" content="${image}" />`, {
        html: true,
      })
      element.after(
        `<meta name="twitter:card" content="summary_large_image" />`,
        {
          html: true,
        }
      )
    }
  }
}

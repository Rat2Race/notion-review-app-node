class NotionBlockParser {
  static typeMap = {
    paragraph: { prefix: "", get: (b) => b.paragraph?.rich_text },
    quote: { prefix: "> ", get: (b) => b.quote?.rich_text },
    heading_1: { prefix: "# ", get: (b) => b.heading_1?.rich_text },
    heading_2: { prefix: "## ", get: (b) => b.heading_2?.rich_text },
    heading_3: { prefix: "### ", get: (b) => b.heading_3?.rich_text },
    bulleted_list_item: {
      prefix: "- ",
      get: (b) => b.bulleted_list_item?.rich_text,
    },
    numbered_list_item: {
      prefix: "1. ",
      get: (b) => b.numbered_list_item?.rich_text,
    },
    to_do: { prefix: "[ ] ", get: (b) => b.to_do?.rich_text },
    toggle: { prefix: "▸ ", get: (b) => b.toggle?.rich_text },
  };

  static blockToText(block) {
    for (const [type, { prefix, get }] of Object.entries(
      NotionBlockParser.typeMap
    )) {
      if (block[type] && get(block)) {
        return (
          prefix +
          get(block)
            .map((t) => t.plain_text)
            .join("")
        );
      }
    }
    return "";
  }

  static blocksToPlainText(blocks) {
    return (blocks || [])
      .map(NotionBlockParser.blockToText)
      .filter(Boolean)
      .join("\n");
  }
}

export default NotionBlockParser;

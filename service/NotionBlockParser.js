class NotionBlockParser {
  static blockToText(block) {
    if (block.paragraph && block.paragraph.rich_text) {
      return block.paragraph.rich_text.map((t) => t.plain_text).join("");
    }

    if (block.quote && block.quote.rich_text) {
      return "> " + block.quote.rich_text.map((t) => t.plain_text).join("");
    }

    if (block.heading_1 && block.heading_1.rich_text) {
      return "# " + block.heading_1.rich_text.map((t) => t.plain_text).join("");
    }

    if (block.heading_2 && block.heading_2.rich_text) {
      return (
        "## " + block.heading_2.rich_text.map((t) => t.plain_text).join("")
      );
    }

    if (block.heading_3 && block.heading_3.rich_text) {
      return (
        "### " + block.heading_3.rich_text.map((t) => t.plain_text).join("")
      );
    }

    if (block.bulleted_list_item && block.bulleted_list_item.rich_text) {
      return (
        "- " +
        block.bulleted_list_item.rich_text.map((t) => t.plain_text).join("")
      );
    }

    if (block.numbered_list_item && block.numbered_list_item.rich_text) {
      return (
        "1. " +
        block.numbered_list_item.rich_text.map((t) => t.plain_text).join("")
      );
    }

    if (block.to_do && block.to_do.rich_text) {
      return "[ ] " + block.to_do.rich_text.map((t) => t.plain_text).join("");
    }

    if (block.toggle && block.toggle.rich_text) {
      return "▸ " + block.toggle.rich_text.map((t) => t.plain_text).join("");
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

import { XMLParser } from "fast-xml-parser";
import z from "zod";

const RSSItemSchema = z.object({
  title: z.string(),
  link: z.string(),
  description: z.string(),
  pubDate: z.string(),
});

const ChannelSchema = z.object({
  title: z.string(),
  link: z.string(),
  description: z.string(),
  item: z.union([z.array(RSSItemSchema), RSSItemSchema]).optional(),
});

const RSSFeedSchema = z.object({
  rss: z.object({
    channel: ChannelSchema,
  }),
});

export async function fetchFeed(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "gator" },
  });
  if (!res.ok) throw new Error(`Failed to fetch RSS: ${res.status}`);

  const rawXMLText = await res.text();
  const parser = new XMLParser({ trimValues: true });
  const xmlObj = parser.parse(rawXMLText);

  const parsed = RSSFeedSchema.safeParse(xmlObj);
  if (!parsed.success) {
    console.error("RSS Feed validation error:", parsed.error);
    process.exit(1);
  }

  const { channel } = parsed.data.rss;

  let items: z.infer<typeof RSSItemSchema>[] = [];
  if (channel.item) {
    const rawItems = Array.isArray(channel.item)
      ? channel.item
      : [channel.item];

    items = rawItems
      .map((it) => RSSItemSchema.safeParse(it))
      .filter((r): r is z.ZodSafeParseSuccess<any> => r.success)
      .map((r) => r.data);
  }

  const result = {
    title: channel.title,
    link: channel.link,
    description: channel.description,
    items,
  };

  return result;
}

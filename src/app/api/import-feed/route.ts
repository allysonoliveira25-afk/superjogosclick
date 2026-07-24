import { NextRequest, NextResponse } from "next/server";

// Proxies GameMonetize / GamePix feeds server-side so no CORS issues and no
// keys leak to the browser. Both feeds are public and require no API key.
// Usage: /api/import-feed?source=gamemonetize&page=0
//        /api/import-feed?source=gamepix&page=1
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const source = searchParams.get("source") ?? "gamemonetize";
  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const PAGE_SIZE = 50;

  let feedUrl = "";
  if (source === "gamemonetize") {
    const params = new URLSearchParams({
      format: "json",
      amount: String(PAGE_SIZE),
      type: "html5",
    });
    feedUrl = `https://rss.gamemonetize.com/rssfeed.php?${params}`;
  } else if (source === "gamepix") {
    // Pagination must be one of 12/24/48/96; pages are 1-based.
    const params = new URLSearchParams({
      pagination: "48",
      page: String(page + 1),
    });
    feedUrl = `https://feeds.gamepix.com/v2/json?${params}`;
  } else {
    return NextResponse.json(
      { error: "Fonte inválida. Use gamemonetize ou gamepix." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(feedUrl, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `O provedor respondeu ${res.status}: ${res.statusText}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Falha ao buscar o feed: " + (e as Error).message },
      { status: 500 }
    );
  }
}

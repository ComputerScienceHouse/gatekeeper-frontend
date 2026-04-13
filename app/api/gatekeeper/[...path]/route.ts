import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_BASE = process.env.GATEKEEPER_API_URL ?? "";

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  const url = `${API_BASE}/${path.join("/")}${req.nextUrl.search}`;
  const res = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    duplex: "half",
  } as RequestInit);

  const body = res.status === 204 ? null : await res.arrayBuffer();
  return new NextResponse(body, {
    status: res.status,
    headers: res.headers,
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

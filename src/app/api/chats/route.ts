import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const data = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    username: "Victor Tesla",
    lastMsg: "Last message",
  }));

  return NextResponse.json(data);
}

import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${backendUrl}/boards/${resolvedParams.id}/events`;

    const response = await fetch(url, {
        headers: {
            Accept: "text/event-stream",
        },
    });

    if (!response.ok || !response.body) {
        return new Response(response.statusText, { status: response.status });
    }

    return new Response(response.body, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no", // Disables buffering in reverse proxies like Nginx
        },
    });
}

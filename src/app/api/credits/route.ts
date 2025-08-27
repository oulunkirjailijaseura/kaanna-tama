import { NextResponse } from "next/server";

interface CostsResponse {
  object: string;
  has_more: boolean;
  next_page: string | null;
  data: {
    object: string;
    start_time: number;
    end_time: number;
    results: {
      object: string;
      amount: {
        value: number;
        currency: string;
      };
      line_item: string | null;
      project_id: string | null;
    }[];
  }[];
}

interface FetchCostsOptions {
  openaiApiKey: string;
  startTime: number;
  nextPage?: string | null;
  projectIds?: string[]; // Add projectIds to the interface
  totalCosts?: number;
}

async function fetchAllCosts({
  openaiApiKey,
  startTime,
  nextPage = null,
  projectIds,
  totalCosts = 0,
}: FetchCostsOptions): Promise<number> {
  console.log("fetchAllCosts", {
    startTime,
    nextPage,
    projectIds,
    totalCosts,
  });
  const url = new URL("https://api.openai.com/v1/organization/costs");
  url.searchParams.append("start_time", startTime.toString());
  url.searchParams.append("limit", "180");
  url.searchParams.append("group_by[]", "project_id");

  if (nextPage) {
    url.searchParams.append("page", nextPage);
  }

  if (projectIds && projectIds.length > 0) {
    projectIds.forEach((id) => {
      url.searchParams.append("project_ids[]", id);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || "Failed to fetch OpenAI usage data"
    );
  }

  const costResponse: CostsResponse = await response.json();

  if (costResponse.data && costResponse.data.length > 0) {
    totalCosts += costResponse.data.reduce((projectCosts, bucket) => {
      return (
        projectCosts +
        bucket.results.reduce((bucketCosts, result) => {
          return bucketCosts + (result?.amount?.value || 0);
        }, 0)
      );
    }, 0);
  }

  return costResponse.has_more && costResponse.next_page
    ? await fetchAllCosts({
        openaiApiKey,
        startTime,
        nextPage: costResponse.next_page,
        projectIds,
        totalCosts,
      })
    : totalCosts;
}

export async function GET() {
  const openaiApiKey = process.env.OPENAI_ADMIN_API_KEY;
  const projectId = process.env.OPENAI_PROJECT_ID;

  if (!openaiApiKey || !projectId) {
    return NextResponse.json(
      { error: "OpenAI ADMIN API key or project ID not configured." },
      { status: 500 }
    );
  }

  const startTime = new Date("2025-08-01").getTime() / 1000;
  const projectIds = [projectId];

  try {
    const totalCosts = await fetchAllCosts({
      openaiApiKey,
      startTime,
      projectIds,
    });
    return NextResponse.json({ costs: totalCosts });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: `Unknown error: ${error}` },
      { status: 500 }
    );
  }
}

import { getStore } from "@netlify/blobs";
import { isAdminRequest } from "../_lib/admin";

const statuses = [
  "Untouched",
  "Reviewed",
  "Contacted",
  "Proposal Sent",
  "In Production",
  "Editing",
  "Contacting Agencies",
  "Completed",
  "Urgent",
  "Failed",
  "Declined",
] as const;

type RequestStatus = (typeof statuses)[number];

type LeafRequest = {
  id: string;
  business: string;
  contact: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  zipCode: string;
  budget: string;
  deadline: string;
  contactSummary?: string;
  estimatedCost?: string;
  estimatedFinishDate?: string;
  progressStatuses?: string[];
  description: string;
  files: { name: string; url?: string }[];
  internalNotes: string;
  failureExplanation?: string;
  proposal?: string;
  status: RequestStatus;
  createdAt: string;
  howHeard?: string;
};

function store() {
  const isProduction = process.env.CONTEXT === "production" && process.env.BRANCH !== "Preview";
  return getStore(`leaf-requests-${isProduction ? "production" : "preview"}`, { consistency: "strong" });
}

async function readRequests(): Promise<LeafRequest[]> {
  return (await store().get("requests", { type: "json" })) || [];
}

function nextRequestId(requests: LeafRequest[]) {
  const highest = requests.reduce((max, item) => {
    const number = Number(item.id.replace("LEAF-", ""));
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 0);
  return `LEAF-${String(highest + 1).padStart(4, "0")}`;
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  return Response.json({ ok: true, requests: await readRequests() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const companyName = String(body.companyName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const zipCode = String(body.zipCode || "").trim();
    const promoting = Array.isArray(body.promoting) ? body.promoting.map(String) : [];
    const authenticAdServices = Array.isArray(body.authenticAdServices) ? body.authenticAdServices.map(String) : [];

    if (!companyName || !email || !phone || !zipCode || promoting.length === 0) {
      return Response.json({ ok: false, message: "Missing required request information." }, { status: 400 });
    }

    const requests = await readRequests();
    const item: LeafRequest = {
      id: nextRequestId(requests),
      business: companyName,
      contact: String(body.contact || "").trim(),
      email,
      phone,
      service: [...promoting, ...authenticAdServices].join(" • "),
      location: zipCode,
      zipCode,
      budget: String(body.budget || "").trim(),
      deadline: String(body.deadline || "").trim(),
      description: String(body.details || "").trim(),
      files: [],
      internalNotes: "",
      failureExplanation: "",
      proposal: "",
      status: "Untouched",
      createdAt: new Date().toISOString(),
      howHeard: String(body.howHeard || "").trim(),
      contactSummary: String(body.contactSummary || body.contact || "").trim(),
      estimatedCost: Math.min(Number(String(body.estimatedCost || body.budget || "").replace(/[^0-9]/g, "") || 0), 1000000000).toString(),
      estimatedFinishDate: String(body.estimatedFinishDate || body.deadline || "").trim(),
      progressStatuses: Array.isArray(body.progressStatuses) ? body.progressStatuses.map(String) : ["Untouched"],
    };

    await store().setJSON("requests", [...requests, item]);
    return Response.json({ ok: true, request: item }, { status: 201 });
  } catch {
    return Response.json({ ok: false, message: "Unable to submit request." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "");
    const status = String(body.status || "");
    const requests = await readRequests();
    const index = requests.findIndex((item) => item.id === id);

    if (index === -1) return Response.json({ ok: false, message: "Request not found." }, { status: 404 });
    if (!statuses.includes(status as RequestStatus)) {
      return Response.json({ ok: false, message: "Invalid status." }, { status: 400 });
    }

    const updated = {
      ...requests[index],
      status: status as RequestStatus,
      internalNotes: String(body.internalNotes ?? requests[index].internalNotes),
      progressStatuses: Array.isArray(body.progressStatuses) ? body.progressStatuses.map(String) : (requests[index].progressStatuses || ["Untouched"]),
      contactSummary: String(body.contactSummary ?? requests[index].contactSummary ?? requests[index].contact ?? ""),
      estimatedCost: Math.min(Number(String(body.estimatedCost ?? requests[index].estimatedCost ?? requests[index].budget ?? "").replace(/[^0-9]/g, "") || 0), 1000000000).toString(),
      estimatedFinishDate: String(body.estimatedFinishDate ?? requests[index].estimatedFinishDate ?? requests[index].deadline ?? "").trim(),
      failureExplanation: String(body.failureExplanation ?? requests[index].failureExplanation ?? ""),
      proposal: String(body.proposal ?? requests[index].proposal ?? ""),
    };

    requests[index] = updated;
    await store().setJSON("requests", requests);
    return Response.json({ ok: true, request: updated });
  } catch {
    return Response.json({ ok: false, message: "Unable to update request." }, { status: 500 });
  }
}

import { createHash, randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { parsePhoneNumberFromString } from "libphonenumber-js";
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
type SpamReason = "invalid_email_format" | "invalid_phone_number" | "suspicious_links";

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
  spamReview?: boolean;
  spamReasons?: SpamReason[];
};

function store() {
  const isProduction = process.env.CONTEXT === "production" && process.env.BRANCH !== "Preview";
  return getStore(`leaf-requests-${isProduction ? "production" : "preview"}`, { consistency: "strong" });
}

function rateLimitStore() {
  const isProduction = process.env.CONTEXT === "production" && process.env.BRANCH !== "Preview";
  return getStore(`leaf-request-rate-limits-${isProduction ? "production" : "preview"}`, { consistency: "strong" });
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

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getClientIp(request: Request) {
  return request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";
}

async function checkRateLimit(prefix: string, limit: number, now: number) {
  const limits = rateLimitStore();
  const windowMs = 60 * 60 * 1000;
  const { blobs } = await limits.list({ prefix });
  let activeCount = 0;

  // Store one uniquely keyed event per accepted submission, not a mutable
  // counter. Remove expired events during normal traffic because Blobs has no TTL.
  for (const blob of blobs) {
    const timestamp = Number(blob.key.slice(prefix.length).split("-")[0]);
    if (!Number.isFinite(timestamp) || now - timestamp >= windowMs) {
      await limits.delete(blob.key);
    } else {
      activeCount += 1;
    }
  }

  if (activeCount >= limit) return false;
  await limits.setJSON(`${prefix}${now}-${randomUUID()}`, { createdAt: now }, { onlyIfNew: true });
  return true;
}

function emailLooksValid(email: string) {
  // This checks basic structure only; it does not prove that the inbox exists.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function phoneLooksValid(phone: string) {
  const parsed = parsePhoneNumberFromString(phone, "US");
  if (!parsed || !parsed.isValid()) return false;

  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 7 && new Set(digits).size === 1) return false;

  // NANP 555-0100 through 555-0199 are reserved fictional numbers.
  const national = parsed.nationalNumber;
  if (parsed.countryCallingCode === "1" && /^\d{3}55501\d{2}$/.test(national)) return false;

  return true;
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ ok: false, message: "Unauthorized." }, {
      status: 401,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  return Response.json({ ok: true, requests: await readRequests() }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 20_000) {
      return Response.json({ ok: false, message: "Your request is too large. Please shorten it and try again." }, { status: 413 });
    }

    const body = await request.json();
    if (JSON.stringify(body).length > 20_000) {
      return Response.json({ ok: false, message: "Your request is too large. Please shorten it and try again." }, { status: 413 });
    }

    // Quietly discard bot submissions that fill the hidden honeypot field.
    if (String(body.website || "").trim()) {
      return Response.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }

    const companyName = String(body.companyName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const zipCode = String(body.zipCode || "").trim();
    const promoting = Array.isArray(body.promoting) ? body.promoting.map(String) : [];
    const authenticAdServices = Array.isArray(body.authenticAdServices) ? body.authenticAdServices.map(String) : [];
    const details = String(body.details || "").trim();
    const contact = String(body.contact || "").trim();
    const howHeard = String(body.howHeard || "").trim();

    if (!companyName || !email || !phone || !zipCode || promoting.length === 0) {
      return Response.json({ ok: false, message: "Missing required request information." }, { status: 400 });
    }

    if (companyName.length > 120 || email.length > 254 || phone.length > 40 || zipCode.length > 30 ||
        contact.length > 160 || details.length > 5000 || howHeard.length > 100 ||
        promoting.length > 20 || authenticAdServices.length > 20) {
      return Response.json({ ok: false, message: "Some information is too long. Please shorten it and try again." }, { status: 400 });
    }

    const now = Date.now();
    const ip = getClientIp(request);
    const emailKey = `email/${hash(email.toLowerCase())}/`;
    const ipKey = ip ? `ip/${hash(ip)}/` : "";

    // Limit repeat submissions without using a single shared limit for visitors
    // whose network does not provide a client IP header.
    const emailAllowed = await checkRateLimit(emailKey, 3, now);
    const ipAllowed = ipKey ? await checkRateLimit(ipKey, 10, now) : true;
    if (!emailAllowed || !ipAllowed) {
      return Response.json({
        ok: false,
        message: "Too many submissions in a short time. Please wait an hour before trying again.",
      }, { status: 429, headers: { "Retry-After": "3600", "Cache-Control": "no-store" } });
    }

    const spamReasons: SpamReason[] = [];
    if (!emailLooksValid(email)) spamReasons.push("invalid_email_format");
    if (!phoneLooksValid(phone)) spamReasons.push("invalid_phone_number");
    const urlMatches = details.match(/https?:\/\//gi) || [];
    if (urlMatches.length > 3) spamReasons.push("suspicious_links");

    const requests = await readRequests();
    const item: LeafRequest = {
      id: nextRequestId(requests),
      business: companyName,
      contact,
      email,
      phone,
      service: [...promoting, ...authenticAdServices].join(" • "),
      location: zipCode,
      zipCode,
      budget: String(body.budget || "").trim().slice(0, 100),
      deadline: String(body.deadline || "").trim().slice(0, 100),
      description: details,
      files: [],
      internalNotes: "",
      failureExplanation: "",
      proposal: "",
      status: "Untouched",
      createdAt: new Date().toISOString(),
      howHeard,
      contactSummary: String(body.contactSummary || contact).trim().slice(0, 2000),
      estimatedCost: Math.min(Number(String(body.estimatedCost || body.budget || "").replace(/[^0-9]/g, "") || 0), 1000000000).toString(),
      estimatedFinishDate: String(body.estimatedFinishDate || body.deadline || "").trim().slice(0, 100),
      progressStatuses: Array.isArray(body.progressStatuses) ? body.progressStatuses.map(String).slice(0, 20) : [],
      spamReview: true,
      spamReasons,
    };

    await store().setJSON("requests", [...requests, item]);
    return Response.json({ ok: true, request: item }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false, message: "Unable to submit request." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "");
    const requests = await readRequests();
    const index = requests.findIndex((item) => item.id === id);

    if (index === -1) return Response.json({ ok: false, message: "Request not found." }, { status: 404 });

    if (body.markLegitimate === true) {
      requests[index] = { ...requests[index], spamReview: false, spamReasons: [] };
      await store().setJSON("requests", requests);
      return Response.json({ ok: true, request: requests[index] }, { headers: { "Cache-Control": "private, no-store" } });
    }

    const status = String(body.status || "");
    if (!statuses.includes(status as RequestStatus)) {
      return Response.json({ ok: false, message: "Invalid status." }, { status: 400 });
    }

    const updated: LeafRequest = {
      ...requests[index],
      status: status as RequestStatus,
      internalNotes: String(body.internalNotes ?? requests[index].internalNotes).slice(0, 10000),
      progressStatuses: Array.isArray(body.progressStatuses) ? body.progressStatuses.map(String).slice(0, 20) : (requests[index].progressStatuses || ["Untouched"]),
      contactSummary: String(body.contactSummary ?? requests[index].contactSummary ?? requests[index].contact ?? "").slice(0, 2000),
      estimatedCost: Math.min(Number(String(body.estimatedCost ?? requests[index].estimatedCost ?? requests[index].budget ?? "").replace(/[^0-9]/g, "") || 0), 1000000000).toString(),
      estimatedFinishDate: String(body.estimatedFinishDate ?? requests[index].estimatedFinishDate ?? requests[index].deadline ?? "").trim().slice(0, 100),
      failureExplanation: String(body.failureExplanation ?? requests[index].failureExplanation ?? "").slice(0, 5000),
      proposal: String(body.proposal ?? requests[index].proposal ?? "").slice(0, 10000),
    };

    requests[index] = updated;
    await store().setJSON("requests", requests);
    return Response.json({ ok: true, request: updated }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ ok: false, message: "Unable to update request." }, { status: 500, headers: { "Cache-Control": "private, no-store" } });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "");
    if (!id || id.length > 40) return Response.json({ ok: false, message: "Invalid request ID." }, { status: 400 });

    const requests = await readRequests();
    const remaining = requests.filter((item) => item.id !== id);
    if (remaining.length === requests.length) return Response.json({ ok: false, message: "Request not found." }, { status: 404 });

    await store().setJSON("requests", remaining);
    return Response.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ ok: false, message: "Unable to delete request." }, { status: 500, headers: { "Cache-Control": "private, no-store" } });
  }
}

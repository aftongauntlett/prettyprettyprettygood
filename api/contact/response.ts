import { suspiciousRedirectPath } from "./constants";

const redirectTo = (requestUrl: string, path: string): Response => {
  const url = new URL(path, requestUrl);
  return Response.redirect(url, 303);
};

export const wantsJsonResponse = (request: Request): boolean => {
  if (request.headers.get("x-contact-ajax") === "1") {
    return true;
  }

  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  return accept.includes("application/json");
};

export const jsonResponse = (body: { ok: boolean }, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const jsonResponseWithHeaders = (
  body: { ok: boolean },
  status: number,
  headers: Record<string, string>,
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });

export const rejectSubmission = (
  request: Request,
  status = 400,
  retryAfterSeconds: number | null = null,
): Response => {
  if (wantsJsonResponse(request)) {
    if (status === 429 && retryAfterSeconds) {
      return jsonResponseWithHeaders({ ok: false }, status, {
        "Retry-After": String(retryAfterSeconds),
      });
    }

    return jsonResponse({ ok: false }, status);
  }

  return redirectTo(request.url, suspiciousRedirectPath);
};

export const redirectToSuccess = (request: Request): Response =>
  redirectTo(request.url, "/?contact=sent#contact");

export const redirectToError = (request: Request): Response =>
  redirectTo(request.url, suspiciousRedirectPath);

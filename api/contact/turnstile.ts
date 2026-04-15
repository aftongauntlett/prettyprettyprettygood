import { turnstileTimeoutMs, turnstileVerifyUrl } from "./constants";

type TurnstileVerifyResult = {
  success?: boolean;
  hostname?: string;
};

export const verifyTurnstileToken = async (
  token: string,
  secret: string,
  clientIp: string | null,
  expectedHostname: string,
): Promise<boolean> => {
  if (!token) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (clientIp) {
    body.set("remoteip", clientIp);
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort("turnstile-timeout");
  }, turnstileTimeoutMs);

  try {
    const response = await fetch(turnstileVerifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as TurnstileVerifyResult;
    if (!result.success) {
      return false;
    }

    if (result.hostname && result.hostname !== expectedHostname) {
      return false;
    }

    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};

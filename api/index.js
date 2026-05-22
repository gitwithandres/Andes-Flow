import server from "../dist/server/server.js";

async function getWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        for (const val of value) {
          headers.append(key, val);
        }
      } else {
        headers.set(key, value);
      }
    }
  }

  let body = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (req.body !== undefined) {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    } else {
      body = new ReadableStream({
        start(controller) {
          req.on("data", (chunk) => controller.enqueue(chunk));
          req.on("end", () => controller.close());
          req.on("error", (err) => controller.error(err));
        },
      });
    }
  }

  return new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });
}

async function sendWebResponse(res, webResponse) {
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;

  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      res.setHeader(
        key,
        typeof webResponse.headers.getSetCookie === "function"
          ? webResponse.headers.getSetCookie()
          : [value],
      );
    } else {
      res.setHeader(key, value);
    }
  });

  if (webResponse.body) {
    const reader = webResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}

export default async function handler(req, res) {
  try {
    const webRequest = await getWebRequest(req);
    const webResponse = await server.fetch(webRequest);
    await sendWebResponse(res, webResponse);
  } catch (error) {
    console.error("Vercel Serverless Handler Error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

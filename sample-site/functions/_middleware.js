const REALM = "Sample Portal";
const PUBLIC_SLUGS = ["basketball-association"];

function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`
    }
  });
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice(6));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch {
    return null;
  }
}

function isIndexPath(pathname) {
  return pathname === "/" || pathname === "/index.html";
}

function isAllowedPublicPath(pathname) {
  return PUBLIC_SLUGS.some(
    (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  );
}

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  const expectedUser = context.env.BASIC_AUTH_USER;
  const expectedPass = context.env.BASIC_AUTH_PASS;

  if (!expectedUser || !expectedPass) {
    return new Response("BASIC auth secrets are not configured.", {
      status: 500
    });
  }

  if (isAllowedPublicPath(pathname)) {
    return context.next();
  }

  if (!isIndexPath(pathname)) {
    return new Response("Not Found", {
      status: 404
    });
  }

  const credentials = parseBasicAuth(
    context.request.headers.get("Authorization")
  );

  if (
    !credentials ||
    credentials.username !== expectedUser ||
    credentials.password !== expectedPass
  ) {
    return unauthorized();
  }

  return context.next();
}

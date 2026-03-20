const REALM = "Sample Portal";

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

export async function onRequest(context) {
  const expectedUser = context.env.BASIC_AUTH_USER;
  const expectedPass = context.env.BASIC_AUTH_PASS;

  if (!expectedUser || !expectedPass) {
    return new Response("BASIC auth secrets are not configured.", {
      status: 500
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

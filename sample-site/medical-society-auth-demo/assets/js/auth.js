(function () {
  const STORAGE_KEY = "medicalSocietyAuthDemoSession";
  const SAFE_REDIRECT_PATTERN = /^(\.\/|\.\.\/|\/)?[a-zA-Z0-9/_-]*$/;

  function readSession() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);

      if (!parsed || !parsed.identifier || !parsed.loggedInAt) {
        throw new Error("Invalid session payload");
      }

      return parsed;
    } catch (error) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function saveSession(session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function formatDisplayName(identifier) {
    const trimmed = identifier.trim();

    if (trimmed.includes("@")) {
      return trimmed;
    }

    return "会員番号 " + trimmed;
  }

  function login(identifier, password) {
    const normalizedIdentifier = String(identifier || "").trim();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedIdentifier) {
      return {
        ok: false,
        error: "メールアドレスまたは会員番号を入力してください。"
      };
    }

    if (!normalizedPassword) {
      return {
        ok: false,
        error: "パスワードを入力してください。"
      };
    }

    if (normalizedPassword.length < 4) {
      return {
        ok: false,
        error: "パスワードは4文字以上で入力してください。"
      };
    }

    const session = {
      identifier: normalizedIdentifier,
      displayName: formatDisplayName(normalizedIdentifier),
      authMode: "外部認証APIを想定したデモセッション",
      loggedInAt: new Date().toISOString()
    };

    saveSession(session);

    return {
      ok: true,
      session
    };
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function isAuthenticated() {
    return Boolean(readSession());
  }

  function formatDateTime(value) {
    if (!value) {
      return "--";
    }

    return new Intl.DateTimeFormat("ja-JP", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  }

  function getSafeRedirect(fallbackPath) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (!redirect) {
      return fallbackPath;
    }

    const normalized = redirect.trim();

    if (
      SAFE_REDIRECT_PATTERN.test(normalized) &&
      !normalized.startsWith("//") &&
      !normalized.toLowerCase().startsWith("javascript:")
    ) {
      return normalized;
    }

    return fallbackPath;
  }

  function redirectTo(path, replace) {
    if (replace) {
      window.location.replace(path);
      return;
    }

    window.location.href = path;
  }

  function guardProtectedPage() {
    const session = readSession();

    if (session) {
      return session;
    }

    redirectTo("../login.html?redirect=./member/", true);
    return null;
  }

  function fillSessionFields(root) {
    const currentRoot = root || document;
    const session = readSession();
    const displayName = session ? session.displayName : "ゲスト";
    const loggedInAt = session ? formatDateTime(session.loggedInAt) : "--";
    const authMode = session ? session.authMode : "未ログイン";

    currentRoot.querySelectorAll("[data-user-label]").forEach(function (element) {
      element.textContent = displayName;
    });

    currentRoot.querySelectorAll("[data-login-time]").forEach(function (element) {
      element.textContent = loggedInAt;
    });

    currentRoot.querySelectorAll("[data-auth-mode]").forEach(function (element) {
      element.textContent = authMode;
    });

    return session;
  }

  window.AuthDemo = {
    storageKey: STORAGE_KEY,
    login: login,
    logout: logout,
    isAuthenticated: isAuthenticated,
    getSession: readSession,
    formatDateTime: formatDateTime,
    getSafeRedirect: getSafeRedirect,
    redirectTo: redirectTo,
    guardProtectedPage: guardProtectedPage,
    fillSessionFields: fillSessionFields
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  const auth = window.AuthDemo;

  if (!auth) {
    return;
  }

  if (document.body.dataset.requiresAuth === "true") {
    const session = auth.guardProtectedPage();

    if (!session) {
      return;
    }
  }

  auth.fillSessionFields(document);
  updateAuthCtas(auth);
  bindLoginForm(auth);
  bindLogoutButtons(auth);

  document.body.classList.remove("auth-pending");
});

function updateAuthCtas(auth) {
  const loggedIn = auth.isAuthenticated();

  document.querySelectorAll("[data-auth-cta]").forEach(function (element) {
    element.setAttribute("href", loggedIn ? "./member/" : "./login.html");
    element.textContent = loggedIn ? "会員ページを開く" : "会員ページへ";
  });

  document.querySelectorAll("[data-auth-status]").forEach(function (element) {
    element.textContent = loggedIn ? "デモログイン中" : "一般公開ページ";
    element.classList.toggle("badge-success", loggedIn);
  });

  const loginBanner = document.querySelector("[data-login-banner]");

  if (loginBanner) {
    loginBanner.hidden = !loggedIn;
  }
}

function bindLoginForm(auth) {
  const form = document.querySelector("[data-login-form]");

  if (!form) {
    return;
  }

  const errorElement = form.querySelector("[data-form-error]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const identifier = formData.get("identifier");
    const password = formData.get("password");
    const result = auth.login(identifier, password);

    if (!result.ok) {
      if (errorElement) {
        errorElement.textContent = result.error;
      }
      return;
    }

    if (errorElement) {
      errorElement.textContent = "";
    }

    auth.fillSessionFields(document);
    const redirectPath = auth.getSafeRedirect("./member/");
    auth.redirectTo(redirectPath, false);
  });
}

function bindLogoutButtons(auth) {
  document.querySelectorAll("[data-logout]").forEach(function (button) {
    button.addEventListener("click", function () {
      auth.logout();

      const redirectTarget = button.getAttribute("data-logout-target") || "./login.html";
      auth.redirectTo(redirectTarget, false);
    });
  });
}

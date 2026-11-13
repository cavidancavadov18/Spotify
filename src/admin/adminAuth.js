const SESSION_KEY = "spotify:adminSession";
const SUPERUSER = {
  username: "admin",
  password: "admin"
};
function loginAdmin(username, password) {
  const u = username.trim().toLowerCase();
  const p = password;
  if (u !== SUPERUSER.username || p !== SUPERUSER.password) return null;
  const session = {
    username: SUPERUSER.username,
    role: "superadmin",
    loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}
function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function isAdminAuthenticated() {
  return Boolean(getAdminSession());
}
export {
  getAdminSession,
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin
};

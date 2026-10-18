const TOKEN_KEY = "staffToken";
const STAFF_KEY = "staffInfo";

export function saveAuth(token, staff) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStaff() {
  try {
    return JSON.parse(localStorage.getItem(STAFF_KEY));
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STAFF_KEY);
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

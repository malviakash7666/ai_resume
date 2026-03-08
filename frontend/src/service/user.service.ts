import api from "../utils/authInterceptor";

/* ================= REGISTER ================= */
export const registerUser = async (data) => {
  return await api.post("auth/register", data);
};

/* ================= LOGIN ================= */
export const loginUser = async (data) => {
  return await api.post("auth/login", data);
};

/* ================= GET CURRENT USER ================= */
export const getCurrentUser = async () => {
  return await api.get("auth/me");
};

/* ================= REFRESH TOKEN ================= */
export const refreshUserToken = async () => {
  return await api.post("auth/refresh-token");
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  return await api.post("auth/logout");
};
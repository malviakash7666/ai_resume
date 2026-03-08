import api from "../utils/authInterceptor";

/* ================= UPLOAD RESUME ================= */

export const uploadResume = async (file: File) => {

  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;

};

/* ================= GET USER RESUMES ================= */
export const fetchUserResumes = async () => {
  const response = await api.get("/resume");
  return response.data; // backend ka response: { data: [...] }
};
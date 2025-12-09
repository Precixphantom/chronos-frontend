const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest("/api/user/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiRequest("/api/user/login", { method: "POST", body: JSON.stringify(data) }),

  // Courses
  getCourses: () => apiRequest("/api/courses"),

  getCourse: (id: string) => apiRequest(`/api/courses/${id}`),

  createCourse: (data: { title: string; description: string }) =>
    apiRequest("/api/courses", {
      method: "POST",
      body: JSON.stringify({
        courseTitle: data.title, // ⚡ map title -> courseTitle
        description: data.description,
      }),
    }),

  updateCourse: (id: string, data: { title: string; description: string }) =>
    apiRequest(`/api/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        courseTitle: data.title, // ⚡ map title -> courseTitle
        description: data.description,
      }),
    }),

  deleteCourse: (id: string) => apiRequest(`/api/courses/${id}`, { method: "DELETE" }),

  // Tasks
  getTasks: () => apiRequest("/api/tasks"),

  getTasksByCourse: (courseId: string) => apiRequest(`/api/tasks/course/${courseId}`),

  createTask: (data: { goal: string; deadline: string; course: string; completed?: boolean }) =>
    apiRequest("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (id: string, data: Partial<{ goal: string; deadline: string; completed: boolean }>) =>
    apiRequest(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string) => apiRequest(`/api/tasks/${id}`, { method: "DELETE" }),
};

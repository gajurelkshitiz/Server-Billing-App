export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getUserRole = (): string | null => {
  return localStorage.getItem('role');
};

export const getUsername = (): string | null => {
  return localStorage.getItem('username');
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
};


export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Role": role || "",
  };
};

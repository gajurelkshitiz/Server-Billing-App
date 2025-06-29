import { Company } from "./../Company/types";

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "X-Role": localStorage.getItem("role") || "",
});

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/company/`, {
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (result) {
      return result.companies;
    }
    throw new Error('Failed to fetch companies');
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};
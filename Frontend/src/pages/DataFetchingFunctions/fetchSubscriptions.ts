import { Subscription } from "../Subscription/types"

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "X-Role": localStorage.getItem("role") || "",
});

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/subscription/`, {
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    console.log(result.subscriptions)
    if (result) {
      console.log('result is success.')
      return result.subscriptions;
    }
    throw new Error('Failed to fetch subscriptions');
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
};
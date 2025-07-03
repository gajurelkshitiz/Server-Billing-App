// import { Customer } from "../Customer/types";

// const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//     "Content-Type": "application/json",
//     "X-Role": localStorage.getItem("role") || "",
// });

// export const fetchCustomers = async (): Promise<Customer[]> => {
//   try {
//     const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/customer/`, {
//         headers: getAuthHeaders(),
//     });
//     const result = await response.json();
//     if (result) {
//       return result.customers;
//     }
//     throw new Error('Failed to fetch suppliers');
//   } catch (error) {
//     console.error('Error fetching suppliers:', error);
//     return [];
//   }
// };
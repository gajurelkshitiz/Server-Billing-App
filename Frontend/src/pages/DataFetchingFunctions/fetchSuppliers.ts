// import { Supplier } from "../Supplier/types";

// const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//     "Content-Type": "application/json",
//     "X-Role": localStorage.getItem("role") || "",
// });

// export const fetchSuppliers = async (): Promise<Supplier[]> => {
//   try {
//     const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/supplier/`, {
//         headers: getAuthHeaders(),
//     });
//     const result = await response.json();
//     console.log(result.suppliers)
//     if (result) {
//       console.log('result is success.')
//       return result.suppliers;
//     }
//     throw new Error('Failed to fetch suppliers');
//   } catch (error) {
//     console.error('Error fetching suppliers:', error);
//     return [];
//   }
// };
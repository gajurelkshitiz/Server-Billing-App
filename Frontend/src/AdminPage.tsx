
// import React, { useState, useEffect } from 'react';
// import DataTable from '@/components/common/DataTable';
// import FormModal from '@/components/common/FormModal';
// import { useToast } from '@/hooks/use-toast';

// const AdminPage = () => {
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingAdmin, setEditingAdmin] = useState(null);
//   const [formData, setFormData] = useState({});
//   const { toast } = useToast();

//   // Form fields for admin creation/editing
//   // You can edit these fields as needed for your requirements
//   const formFields = [
//     { name: 'name', label: 'Full Name', type: 'text' as const, required: true },
//     { name: 'email', label: 'Email', type: 'email' as const, required: true },
//     { name: 'password', label: 'Password', type: 'password' as const, required: true },
//     { name: 'phoneNo', label: 'Phone Number', type: 'text' as const, required: true },
//     // { 
//     //   name: 'SubsID', 
//     //   label: 'Subscription', 
//     //   type: 'select' as const, 
//     //   required: true,
//     //   options: [
//     //     { label: 'Basic Plan', value: 'basic' },
//     //     { label: 'Premium Plan', value: 'premium' },
//     //     { label: 'Enterprise Plan', value: 'enterprise' }
//     //   ]
//     // }
//   ];

//   const columns = [
//     { key: 'fullname', label: 'Full Name', sortable: true },
//     { key: 'email', label: 'Email', sortable: true },
//     { key: 'phoneNo', label: 'Phone', sortable: true },
//     { key: 'SubsID', label: 'Subscription', sortable: true },
//   ];

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const getAuthHeaders = () => ({
//     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//     'Content-Type': 'application/json',
//     'X-Role': localStorage.getItem('role') || '',
//   });

//   const fetchAdmins = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('${import.meta.env.REACT_APP_API_URL}/admin/', {
//         headers: getAuthHeaders(),
//       });
      
//       if (response.ok) {
//         console.log('Fetching admins from server...', response);
//         const data = await response.json();
//         console.log('Fetched admins:', data);
//         setAdmins(data.admins || []);
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to fetch admins",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to connect to server",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleAdd = () => {
//   //   setEditingAdmin(null);
//   //   setFormData({});
//   //   setIsModalOpen(true);
//   // };

//   // const handleEdit = (admin: any) => {
//   //   setEditingAdmin(admin);
//   //   setFormData(admin);
//   //   setIsModalOpen(true);
//   // };

//   const handleDelete = async (admin: any) => {
//     if (window.confirm('Are you sure you want to delete this admin?')) {
//       try {
//         const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/admin/${admin.id}`, {
//           method: 'DELETE',
//           headers: getAuthHeaders(),
//         });
        
//         if (response.ok) {
//           toast({
//             title: "Success",
//             description: "Admin deleted successfully",
//           });
//           fetchAdmins();
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to delete admin",
//             variant: "destructive",
//           });
//         }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to connect to server",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const handleInputChange = (name: string, value: string) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const url = editingAdmin 
//         ? `${import.meta.env.REACT_APP_API_URL}/admin/${editingAdmin.id}`
//         : '${import.meta.env.REACT_APP_API_URL}/admin/';
      
//       const method = editingAdmin ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method,
//         headers: getAuthHeaders(),
//         body: JSON.stringify(formData),
//       });
      
//       if (response.ok) {
//         toast({
//           title: "Success",
//           description: `Admin ${editingAdmin ? 'updated' : 'created'} successfully`,
//         });
//         setIsModalOpen(false);
//         fetchAdmins();
//       } else {
//         toast({
//           title: "Error",
//           description: `Failed to ${editingAdmin ? 'update' : 'create'} admin`,
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to connect to server",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//       <div className="space-y-6">
//         {/* <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
        
//         <DataTable
//           title="Admins"
//           data={admins}
//           columns={columns}
//           onAdd={handleAdd}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           loading={loading}
//         />

//         <FormModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           title={editingAdmin ? 'Edit Admin' : 'Add New Admin'}
//           fields={formFields}
//           formData={formData}
//           onInputChange={handleInputChange}
//           onSubmit={handleSubmit}
//           submitLabel={editingAdmin ? 'Update' : 'Create'}
//         /> */}
//       </div>
//   );
// };

// export default AdminPage;

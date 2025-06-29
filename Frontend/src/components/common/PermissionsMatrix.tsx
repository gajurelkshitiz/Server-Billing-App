// PermissionsMatrix.tsx
import React, { useState } from 'react';
import Checkbox from './checkbox'; // Import the new Checkbox component

// Define the indices for each permission type
enum PermissionIndex {
  Create = 0,
  Read = 1,
  Update = 2,
  Delete = 3,
}

// Type for a single entity's permissions (array of 4 booleans)
type EntityPermissions = [boolean, boolean, boolean, boolean];

// Type for the overall state
interface AllPermissions {
  company: EntityPermissions;
  user: EntityPermissions;
  products: EntityPermissions;
  orders: EntityPermissions;
  reports: EntityPermissions;
}

const PermissionsMatrix: React.FC = () => {
  const [permissions, setPermissions] = useState<AllPermissions>({
    company: [false, false, false, false],
    user: [false, false, false, false],
    products: [false, false, false, false],
    orders: [false, false, false, false],
    reports: [false, false, false, false],
  });

  const permissionLabels = ['Create', 'Read', 'Update', 'Delete'];

  const handlePermissionChange = (
    entity: keyof AllPermissions,
    index: PermissionIndex,
    isChecked: boolean,
  ) => {
    setPermissions((prevPermissions) => {
      // Create a copy of the specific entity's permission array
      const newEntityPermissions = [...prevPermissions[entity]];
      // Update the value at the specific index
      newEntityPermissions[index] = isChecked;

      return {
        ...prevPermissions,
        [entity]: newEntityPermissions as EntityPermissions, // Cast back to type
      };
    });
  };

  // Function to simulate sending data to backend
  const sendPermissionsToBackend = async () => {
    console.log('Sending permissions to backend:', permissions);
    // In a real application, you would make an API call here, e.g.:
    /*
    try {
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissions),
      });
      if (!response.ok) {
        throw new Error('Failed to save permissions');
      }
      const data = await response.json();
      console.log('Permissions saved successfully:', data);
      alert('Permissions saved!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions. Check console for details.');
    }
    */
    alert('Permissions sent to console (simulated backend call)');
  };


  // Basic styling for the component (same as before, but kept for context)
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#f0f2f5', // Light background color
      minHeight: '100vh',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '400px', // Fixed width for cards
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    cardHeader: {
      fontSize: '1.2em',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px',
    },
    permissionRow: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    saveButton: {
        marginTop: '30px',
        padding: '10px 20px',
        fontSize: '1em',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        alignSelf: 'center', // Center the button if in a flex column
    },
  };

  const renderPermissionCard = (entityName: keyof AllPermissions) => (
    <div style={styles.card}>
      <h3 style={styles.cardHeader}>{entityName.charAt(0).toUpperCase() + entityName.slice(1)}</h3>
      <div style={styles.permissionRow}>
        {permissionLabels.map((label, index) => (
          <Checkbox
            key={label} // Unique key for each checkbox
            label={label}
            checked={permissions[entityName][index as PermissionIndex]}
            onChange={(isChecked) =>
              handlePermissionChange(entityName, index as PermissionIndex, isChecked)
            }
          />
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {renderPermissionCard('company')}
      {renderPermissionCard('user')}
      {renderPermissionCard('products')}
      {renderPermissionCard('orders')}
      {renderPermissionCard('reports')}

      <button style={styles.saveButton} onClick={sendPermissionsToBackend}>
        Save Permissions
      </button>
    </div>
  );
};

export default PermissionsMatrix;
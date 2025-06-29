import React, { useState, useEffect } from 'react';

function CompanyDropdown() {
  // State to hold the list of companies fetched from the API
  const [companies, setCompanies] = useState([]);
  // State to hold the selected company's _id.
  // Initialize with an empty string, which will correspond to "All Companies"
  const [selectedValue, setSelectedValue] = useState('');
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);

  // useEffect to fetch companies AND load the saved value from localStorage
  useEffect(() => {
    const fetchAndSetCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/company/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            "X-Role": localStorage.getItem("role") || "",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedCompanies = data.companies || [];
        setCompanies(fetchedCompanies);

        // --- Logic for default and retained value ---
        const savedCompanyId = localStorage.getItem('selectedCompanyName');

        if (savedCompanyId) {
          // If a saved ID exists, check if it's still valid in the fetched list
          const foundCompany = fetchedCompanies.find(
            (company) => company._id === savedCompanyId
          );
          if (foundCompany) {
            setSelectedValue(savedCompanyId);
          } else {
            // If saved ID is not found in the current list (e.g., company deleted),
            // revert to "All Companies" and clear stale localStorage entry.
            localStorage.removeItem('selectedCompanyName');
            setSelectedValue(''); // Default to "All Companies"
          }
        } else {
          // No saved ID found, so default to "All Companies"
          setSelectedValue('');
        }
        // --- End of logic for default and retained value ---

      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setError(err.message || "Failed to load companies.");
        // If there's an error fetching, still default to "All Companies"
        setSelectedValue('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetCompanies();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Event handler for when the dropdown value changes
  const handleChange = (event) => {
    const newValue = event.target.value; // This will be the company._id or an empty string for "All Companies"
    setSelectedValue(newValue);
    // Save the new value (company._id or empty string) to localStorage
    if (newValue) {
      localStorage.setItem('selectedCompanyName', newValue);
    } else {
      localStorage.removeItem('selectedCompanyName'); // Clear if "All Companies" is chosen
    }
  };

  // Find the selected company's full details for display, only if a specific company is selected
  const currentSelectedCompany = selectedValue
    ? companies.find((company) => company._id === selectedValue)
    : null; // If selectedValue is '', currentSelectedCompany will be null

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Select a Company:</h2>
      <select value={selectedValue} onChange={handleChange}>
        {/* "All Companies" option - its value is an empty string */}
        <option value="">All Companies</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>

      {/* Conditionally display details only if a specific company is selected */}
      {currentSelectedCompany && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h3>Selected Company Details:</h3>
          <p><strong>Name:</strong> {currentSelectedCompany.name}</p>
          <p><strong>ID:</strong> {currentSelectedCompany._id}</p>
          {currentSelectedCompany.logo && (
            <div>
              <strong>Logo:</strong><br/>
              <img
                src={currentSelectedCompany.logo}
                alt={`${currentSelectedCompany.name} Logo`}
                style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '5px' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyDropdown;
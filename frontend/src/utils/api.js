import { jwtDecode } from "jwt-decode";


const API_BASE_URL = "http://localhost:4000/api/v1";
  
// Add new vendor
export const handleAddVendor = async (vendorDetails, toggleModal) => {

  if (!vendorDetails.name || !vendorDetails.phone || !vendorDetails.email) {
    alert("Please fill in all fields!");
    return;
  }

  try { 
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/clients/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: vendorDetails.name,
        phoneNumber: vendorDetails.phone,
        email: vendorDetails.email,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("New Vendor added successfully!");
      toggleModal();
      return data;
    } else {
      alert(data.message || "Error adding vendor.");
      return null;
    }
  } catch (error) {
    console.error("Error adding vendor:", error);
    alert("Failed to add vendor. Try again.");
    return null;
  }
};

export const handleAddCustomer = async (customerDetails, toggleModal) => {

  if (!customerDetails.name || !customerDetails.phone || !customerDetails.email) {
    alert("Please fill in all fields!");
    return;
  }

  try { 
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/clients/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: customerDetails.name,
        phoneNumber: customerDetails.phone,
        email: customerDetails.email,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("New Vendor added successfully!");
      toggleModal();
      return data;
    } else {
      alert(data.message || "Error adding vendor.");
      return null;
    }
  } catch (error) {
    console.error("Error adding vendor:", error);
    alert("Failed to add vendor. Try again.");
    return null;
  }
};

// Fetch user data using token
export const fetchUserData = async (setUserDetails, setLoading) => {
  try {
    setLoading(true);  // Set loading to true when fetching data

    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("User not authenticated");
    }

    const decoded = jwtDecode(token);
    
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    setUserDetails(userData);  
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    setUserDetails(null);
  } finally {
    setLoading(false);  
  }
};

export const fetchClientById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if you're using auth
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch client");
    }

    return await response.json();
  } catch (error) {
    console.error("fetchClientById error:", error);
    return null;
  }
};

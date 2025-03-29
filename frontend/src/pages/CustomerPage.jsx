import React, { useState } from "react";
import {
  Container, Row, Col, Button, Input, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerPage = () => {
  const [view, setView] = useState("vendors");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debtPaid, setDebtPaid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [vendorDetails, setVendorDetails] = useState({ name: "", phone: "", email: "" });

  const handleViewChange = (newView) => {
    setView(newView);
    setSelectedVendor(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorDetails({ ...vendorDetails, [name]: value });
  };

  const handleAddVendor = async () => {
    if (!vendorDetails.name || !vendorDetails.phone || !vendorDetails.email) {
      alert("Please fill in all fields!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Retrieve authentication token
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }
  
      const response = await fetch("http://localhost:4000/api/v1/clients/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach the token
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
        setVendorDetails({ name: "", phone: "", email: "" });
        toggleModal();
      } else {
        alert(data.message || "Error adding vendor.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add vendor. Try again.");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear authentication token
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="card p-4 shadow-lg" style={{ width: "90%", borderRadius: "20px" }}>
        <Container fluid>
          <Row>
            {/* Left Section */}
            <Col md="3" className="sidebar p-3 text-center bg-dark text-white" style={{ borderRadius: "15px" }}>
              <h2 className="fw-bold">DUE-MEMO</h2>
              <div className="user-profile mt-4">
                <p><strong>CUSTOMER PROFILE</strong></p>
                <p>Name: Jane Doe</p>
                <p>Phone: 987-654-3210</p>
              </div>
              <Button color="light" className="my-2 w-100" onClick={() => handleViewChange("vendors")}>
                Vendors
              </Button>
              <Button color="light" className="my-2 w-100" onClick={() => handleViewChange("transactions")}>
                Transactions
              </Button>
              <Button color="danger" className="w-100 mt-4 mb-3" onClick={handleLogout}>
                Logout
              </Button>
              <div className="mt-5">customer123@gmail.com</div>
            </Col>

            {/* Middle Section */}
            <Col md="5" className="middle-section p-3">
              <Card className="mb-3" style={{ borderRadius: "10px" }}>
                <CardBody>
                  <h4 className="fw-bold">Total Debt: $3000</h4>
                </CardBody>
              </Card>

              <Input
                type="text"
                placeholder={view === "vendors" ? "Search for vendor name/ID" : "Search for transaction ID"}
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-3"
              />

              <Card className="mb-3" style={{ borderRadius: "10px" }}>
                <CardBody>
                  <h5 className="fw-bold">{view === "vendors" ? "Vendor List" : "Transaction List"}</h5>
                  <p className="text-muted">Select a {view.slice(0, -1)} or search above.</p>
                </CardBody>
              </Card>

              <Button color="success" className="w-100" onClick={toggleModal}>Add Vendor +</Button>
            </Col>

            {/* Right Section */}
            <Col md="4" className="right-section p-3">
              {selectedVendor ? (
                <Card className="shadow-sm" style={{ borderRadius: "10px" }}>
                  <CardBody>
                    <h5 className="fw-bold">Selected Vendor</h5>
                    <p>Name: {selectedVendor.name}</p>
                    <p>Phone: {selectedVendor.phone}</p>
                    <label className="d-flex align-items-center mt-3">
                      <Input
                        type="checkbox"
                        checked={debtPaid}
                        onChange={() => setDebtPaid(!debtPaid)}
                        className="me-2"
                      />
                      Debt Paid
                    </label>
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-sm d-flex align-items-center justify-content-center" style={{ borderRadius: "10px", height: "100%" }}>
                  <CardBody>
                    <h5 className="fw-bold text-center">No Vendor Selected</h5>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </Container>

        {/* Add Vendor Modal */}
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Add New Vendor</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={vendorDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter vendor's name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={vendorDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter vendor's phone"
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={vendorDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter vendor's email"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={handleAddVendor}>
              Add Vendor
            </Button>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerPage;
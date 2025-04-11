import React, { useState, useEffect } from "react";
import { fetchUserData, handleAddCustomer } from "../utils/api";
import {
  Container, Row, Col, Button, Input, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const VendorPage = () => {
  const [view, setView] = useState("customers");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debtPaid, setDebtPaid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name: "", phone: "", email: "" });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleViewChange = (newView) => {
    setView(newView);
    setSelectedCustomer(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/login"; 
  };

const handleClickAdd = async () => {
    const result = await handleAddCustomer(customerDetails, toggleModal);
    if (result) {
      console.log("Customer added successfully:", result);
    }

    //fetch the user data again so that we get the latest user details
    await fetchUserData(setUserDetails, setLoading);

    setCustomerDetails({ name: "", phone: "", email: "" });
    toggleModal();
  };

useEffect(() => {
    const getUserData = async () => {
      await fetchUserData(setUserDetails, setLoading);
    };
    getUserData();
  }, []);
  
  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="card p-4 shadow-lg" style={{ width: "90%", borderRadius: "20px" }}>
        <Container fluid>
          <Row>
            {/* Left Section */}
            <Col md="3" className="sidebar p-3 text-center bg-dark text-white" style={{ borderRadius: "15px" }}>
              <h2 className="fw-bold">DUE-MEMO</h2>
              <div className="user-profile mt-4">
                <p><strong>USER PROFILE</strong></p>
                {/*  loading  */}
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <p>Name: {userDetails.username}</p>
                    <p>Phone: {userDetails.phoneNumber}</p>
                    <p>Email: {userDetails.email}</p>
                  </>
                )}
              </div>
              <Button color="light" className="my-2 w-100" onClick={() => handleViewChange("customers")}>
                Customers
              </Button>
              <Button color="light" className="my-2 w-100" onClick={() => handleViewChange("transactions")}>
                Transactions
              </Button>
              <Button color="danger" className="w-100 mt-4 mb-3" onClick={handleLogout}>
                Logout
              </Button>
              <div className="mt-5">abc123@gmail.com</div>
            </Col>

            {/* Middle Section */}
            <Col md="5" className="middle-section p-3">
              <Card className="mb-3" style={{ borderRadius: "10px" }}>
                <CardBody>
                  <h4 className="fw-bold">Total Due: $5000</h4>
                </CardBody>
              </Card>

              <Input
                type="text"
                placeholder={view === "customers" ? "Search for customer name/ID" : "Search for transaction ID"}
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-3"
              />

              <Card className="mb-3" style={{ borderRadius: "10px" }}>
                <CardBody>
                  <h5 className="fw-bold">{view === "customers" ? "Customer List" : "Transaction List"}</h5>
                  <p className="text-muted">Select a {view.slice(0, -1)} or search above.</p>
                </CardBody>
              </Card>

              <Button color="success" className="w-100" onClick={toggleModal}>Add Customer +</Button>
            </Col>

            {/* Right Section */}
            <Col md="4" className="right-section p-3">
              {selectedCustomer ? (
                <Card className="shadow-sm" style={{ borderRadius: "10px" }}>
                  <CardBody>
                    <h5 className="fw-bold">Selected Customer</h5>
                    <p>Name: {selectedCustomer.name}</p>
                    <p>Phone: {selectedCustomer.phone}</p>
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-sm d-flex align-items-center justify-content-center" style={{ borderRadius: "10px", height: "100%" }}>
                  <CardBody>
                    <h5 className="fw-bold text-center">No Customer Selected</h5>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </Container>

        {/* Add Customer Modal */}
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Add New Customer</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={customerDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer's name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter customer's phone"
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter customer's email"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={handleClickAdd}>
              Add Customer
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

export default VendorPage;
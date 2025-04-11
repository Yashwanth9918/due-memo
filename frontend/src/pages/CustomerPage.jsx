import React, { useState, useEffect } from "react";
import { fetchUserData, handleAddVendor, fetchClientById } from "../utils/api";
import {
  Container, Row, Col, Button, Input, Card, CardBody, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerPage = () => {
  const [view, setView] = useState("vendors");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debtPaid, setDebtPaid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [vendorDetails, setVendorDetails] = useState({ name: "", phone: "", email: "" });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState([]);

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

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/login";
  };

  const handleClickAdd = async () => {
    const result = await handleAddVendor(vendorDetails, toggleModal);
    if (result) {
      console.log("Vendor added successfully:", result);
    }

    //fetch the user data again so that we get the latest user details
    await fetchUserData(setUserDetails, setLoading);

    setVendorDetails({ name: "", phone: "", email: "" });
    toggleModal();
  };

  useEffect(() => {
    const getUserData = async () => {
      await fetchUserData(setUserDetails, setLoading);
    };
    getUserData();
  }, []);

  useEffect(() => {
    // console.log(" userDetails updated:", userDetails);
    const getAllClientDetails = async () => {
      if (userDetails?.clients?.length) {
        const clientPromises = userDetails.clients.map(id => fetchClientById(id));
        const results = await Promise.all(clientPromises);
  
        const validClients = results.filter(client => client !== null);
        setClientDetails(validClients);
      }
    };
  
    getAllClientDetails();
  }, [userDetails]);

  const filteredClients = clientDetails.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = userDetails?.transactions?.filter(transaction =>
    transaction.amount.toString().includes(searchTerm) ||
    new Date(transaction.date).toLocaleDateString().includes(searchTerm)
  ) || [];

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

              <Card className="mb-3" style={{ borderRadius: "10px", maxHeight: "300px", overflowY: "auto" }}>
                <CardBody>
                  <h5 className="fw-bold">{view === "vendors" ? "Vendor List" : "Transaction List"}</h5>
                  <ListGroup flush>
                    {view === "vendors" ? (
                      filteredClients.map(client => {
                        console.log("Rendering vendor:", client); 
                        return (
                          <ListGroupItem key={client._id}
                            className="d-flex flex-column"
                            onClick={() => setSelectedVendor(client)}
                            style={{ cursor: "pointer" }}>
                              <strong>{client.name}</strong>
                              <small className="text-muted">{client.email}</small>
                          </ListGroupItem>
                      )})
                    ) : (
                      filteredTransactions.map(transaction => (
                        <ListGroupItem key={transaction._id} className="d-flex flex-column">
                          <strong>${transaction.amount}</strong>
                          <small className="text-muted">{new Date(transaction.date).toLocaleDateString()}</small>
                        </ListGroupItem>
                      ))
                    )}
                  </ListGroup>
                </CardBody>
              </Card>

              <Button color="success" className="w-100" onClick={toggleModal}>Add Vendor +</Button>
            </Col>

            {/* Right Section */}
            <Col md="4" className="p-3 text-center bg-dark text-white" style={{ borderRadius: "15px" }}>
              {selectedVendor ? (
                <>
                  <h4 className="fw-bold mb-4">Selected Vendor</h4>
                  <div className="mb-3">
                    <p><strong>Name:</strong> {selectedVendor.name}</p>
                    <p><strong>Phone:</strong> {selectedVendor.phoneNumber}</p>
                    <p><strong>Email:</strong> {selectedVendor.email}</p>
                  </div>
                  <div className="form-check d-flex justify-content-center align-items-center gap-2">
                    <Input
                      type="checkbox"
                      checked={debtPaid}
                      onChange={() => setDebtPaid(!debtPaid)}
                      className="form-check-input"
                      id="debtPaidCheckbox"
                    />
                    <Label className="form-check-label" htmlFor="debtPaidCheckbox">
                      Debt Paid
                    </Label>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
                  <h5 className="fw-bold text-white">No Vendor Selected</h5>
                </div>
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
            <Button color="success" onClick={handleClickAdd}>
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
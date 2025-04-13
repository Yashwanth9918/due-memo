import React, { useState, useEffect } from "react";
import { fetchUserData, handleAddVendor, fetchClientById, fetchTransactionById } from "../utils/api";
import {
  Container, Row, Col, Button, Input, Card, CardBody, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,Badge
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerPage = () => {
  const [view, setView] = useState("vendors");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [vendorDetails, setVendorDetails] = useState({ name: "", phone: "", email: "" });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState([]);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [NewtransactionDetails, setNewTransactionDetails] = useState({amount: "",type: "debit",});
  const [transactionDetails, setTransactionDetails] = useState([]);

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

  const filteredClients = clientDetails.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactionDetails?.filter(transaction => {
    if (!transaction || !transaction.amount || !transaction.date) {
      return false; // Skip undefined transactions or ones without amount or date
    }
    return (
      transaction.amount.toString().includes(searchTerm) ||
      new Date(transaction.date).toLocaleDateString().includes(searchTerm)
    );
  }) || [];


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
    const getAllTransactionDetails = async () => {
      if (userDetails?.transactions?.length) {
        const transactionPromises = userDetails.transactions.map(id => fetchTransactionById(id));
        const results = await Promise.all(transactionPromises);
  
        const validTransactions = results.filter(transaction => transaction !== null);
        setTransactionDetails(validTransactions);
      }
    };

    getAllTransactionDetails();  
    getAllClientDetails();
  }, [userDetails]);

  const toggleTransactionModal = () => setTransactionModalOpen(!transactionModalOpen);

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransactionDetails({ ...NewtransactionDetails, [name]: value });
  };

  const handleTransactionSubmit = async () => {
    console.log("Transaction Submitted:", NewtransactionDetails);
    if (!NewtransactionDetails.amount || isNaN(NewtransactionDetails.amount)) {
      alert("Please enter a valid amount.");
      return;
    }
  
    // Send data to backend
    const transactionData = {
      amount: parseFloat(NewtransactionDetails.amount),
      type: NewtransactionDetails.type,
      clientId: selectedVendor._id,  
      userId: selectedVendor.userId,      
    };
  
    try {
      const response = await fetch('http://localhost:4000/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
  
      if (response.ok) {
        alert('Transaction added successfully!');
        
        await fetchUserData(setUserDetails, setLoading);

      } else {
        alert('Failed to add transaction.');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('An error occurred.');
    }
    setNewTransactionDetails({ amount: "", type: "debit" });
    toggleTransactionModal();
  };

  const handleAddTransaction = () => {
    toggleTransactionModal();
  };
  
  useEffect(() => {
    if (!selectedVendor) return;
  
    const updatedVendor = filteredClients.find(
      client => client._id === selectedVendor._id
    );
  
    if (updatedVendor) {
      setSelectedVendor({ ...updatedVendor });
    }
  }, [filteredClients]);
  useEffect(() => {
    console.log(filteredTransactions)
  }, [filteredTransactions]);

  

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
                placeholder={view === "vendors" ? "Search for vendor name/ID" : "Search for transaction amount"}
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-3"
              />

              <Card className="mb-3" style={{ borderRadius: "10px", maxHeight: "300px", overflowY: "auto" }}>
                <CardBody>
                  <h5 className="fw-bold">{view === "vendors" ? "Vendor List" : "Transaction List"}</h5>
                  <ListGroup flush>
                    {view === "vendors" ? (
                      filteredClients.map(client => (
                        <ListGroupItem
                          key={client._id}
                          className="d-flex flex-column"
                          onClick={() => { setSelectedVendor(client) }}
                          style={{ cursor: "pointer" }}
                        >
                          <strong>{client.name}</strong>
                          <small className="text-muted">{client.email}</small>
                        </ListGroupItem>
                      ))
                    ) : view === "transactions" ? (
                      filteredTransactions.map(transaction => (
                        <ListGroupItem
                          key={transaction._id}
                          className="d-flex flex-column"
                          style={{
                            backgroundColor: transaction.type === "debit" ? "#f8d7da" : "#d4edda", // Debit: Red, Credit: Green
                            borderRadius: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <div>
                            <strong>{transaction.type === "debit" ? "-" : "+"} ₹{transaction.amount}</strong>
                            <br />
                            <small>{new Date(transaction.date).toLocaleDateString()}</small>
                          </div>
                          
                          <div>
                            <Badge
                              color={transaction.type === "debit" ? "danger" : "success"}
                              className="text-uppercase"
                            >
                              {transaction.type}
                            </Badge>
                          </div>
                        </ListGroupItem>
                      ))
                    ) : null}
                  </ListGroup>
                </CardBody>
              </Card>

              <Button color="success" className="w-100" onClick={toggleModal}>Add Vendor +</Button>
            </Col>

            {/* Right Section */}
            <Col md="4" className="p-3 text-center bg-dark text-white" style={{ borderRadius: "15px" }}>
              {selectedVendor ? (
                <>
                  <h4 className="fw-bold">{selectedVendor.name}</h4>

                  <div className="mt-3">
                    <p className="mb-1"><strong>Phone:</strong> {selectedVendor.phoneNumber}</p>
                    <p className="mb-3"><strong>Email:</strong> {selectedVendor.email}</p>
                    <h6 className="fw-semibold">Total Due: ₹{selectedVendor.totalDue}</h6>
                  </div>

                  <div className="d-flex flex-column gap-2 mt-4">
                    <Button color="success" className="w-100" onClick={handleAddTransaction}>Add Transaction +</Button>
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

        {/* Add Transaction Modal */}
        <Modal isOpen={transactionModalOpen} toggle={toggleTransactionModal}>
          <ModalHeader toggle={toggleTransactionModal}>Add Transaction</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="amount">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={NewtransactionDetails.amount}
                  onChange={handleTransactionInputChange}
                  placeholder="Enter amount"
                />
              </FormGroup>

              <FormGroup tag="fieldset" className="mt-3">
                <Label>Transaction Type</Label>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="type"
                      value="debit"
                      checked={NewtransactionDetails.type === "debit"}
                      onChange={handleTransactionInputChange}
                    />{" "}
                    Debit
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="type"
                      value="credit"
                      checked={NewtransactionDetails.type === "credit"}
                      onChange={handleTransactionInputChange}
                    />{" "}
                    Credit
                  </Label>
                </FormGroup>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={handleTransactionSubmit}>
              Submit Transaction
            </Button>
            <Button color="secondary" onClick={toggleTransactionModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>


      </div>
    </div>
  );
};

export default CustomerPage;
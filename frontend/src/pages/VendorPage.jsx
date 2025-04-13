import React, { useState, useEffect } from "react";
import { fetchUserData, handleAddCustomer,fetchClientById, fetchTransactionById, handleNewTransaction } from "../utils/api";
import {
  Container, Row, Col, Button, Input, Card, CardBody, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const VendorPage = () => {
  const [view, setView] = useState("customers");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name: "", phone: "", email: "" });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState([]);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [NewtransactionDetails, setNewTransactionDetails] = useState({amount: "",type: "debit",});
  const [transactionDetails, setTransactionDetails] = useState([]);

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

  const filteredClients = clientDetails.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactionDetails?.filter(transaction => {
    if (!transaction || !transaction.amount || !transaction.date) {
      return false;
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
        const clientPromises = [...userDetails.clients].reverse().map(id => fetchClientById(id));
        const results = await Promise.all(clientPromises);
  
        const validClients = results.filter(client => client !== null);
        setClientDetails(validClients);
      }
    };
    const getAllTransactionDetails = async () => {
      if (userDetails?.transactions?.length) {
        const transactionPromises = [...userDetails.transactions].reverse().map(id => fetchTransactionById(id));
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
      await handleNewTransaction(
        NewtransactionDetails,
        selectedCustomer,
        toggleTransactionModal,
        setNewTransactionDetails,
        setUserDetails,
        setLoading
      );
    };

  const handleAddTransaction = () => {
    toggleTransactionModal();
  };

  useEffect(() => {
      if (!selectedCustomer) return;
    
      const updatedCustomer = filteredClients.find(
        client => client._id === selectedCustomer._id
      );
    
      if (
        updatedCustomer &&
        JSON.stringify(updatedCustomer) !== JSON.stringify(selectedCustomer)
      ) {
        setSelectedCustomer({ ...updatedCustomer });
      }
    }, [filteredClients]);

    const totalBalance = clientDetails.reduce((sum, customer) => sum + customer.totalDue, 0);

  
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
                <h4 className="fw-bold">
                  {totalBalance >= 0 ? `Total Debt: ₹${totalBalance}` : `Total Credit: ₹${Math.abs(totalBalance)}`}
                </h4>
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
                  <ListGroup flush>
                    {view === "customers" ? (
                      filteredClients.map(client => (
                        <ListGroupItem
                          key={client._id}
                          className="d-flex flex-column"
                          onClick={() => { setSelectedCustomer(client) }}
                          style={{ cursor: "pointer",backgroundColor: selectedCustomer?._id === client._id ? "#e9ecef" : "inherit" }}
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

              <Button color="success" className="w-100" onClick={toggleModal}>Add Customer +</Button>
            </Col>

            {/* Right Section */}
            <Col md="4" className="p-3 text-center bg-dark text-white" style={{ borderRadius: "15px" }}>
              {selectedCustomer ? (
                <>
                  <h4 className="fw-bold">{selectedCustomer.name}</h4>

                  <div className="mt-3">
                    <p className="mb-1"><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
                    <p className="mb-3"><strong>Email:</strong> {selectedCustomer.email}</p>
                    <h6 className="fw-semibold">Total Due: ₹{selectedCustomer.totalDue}</h6>
                  </div>

                  <div className="d-flex flex-column gap-2 mt-4">
                    <Button color="success" className="w-100" onClick={handleAddTransaction}>Add Transaction +</Button>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
                  <h5 className="fw-bold text-white">No Customer Selected</h5>
                </div>
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
                    <Button color="success" disabled={!NewtransactionDetails.amount || isNaN(NewtransactionDetails.amount)} onClick={handleTransactionSubmit}>
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

export default VendorPage;
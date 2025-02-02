import React, { useState } from "react";
import { Container, Row, Col, Button, Input, Card, CardBody } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerPage = () => {
  const [view, setView] = useState("vendors");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debtPaid, setDebtPaid] = useState(false);

  const handleViewChange = (newView) => {
    setView(newView);
    setSelectedVendor(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
              <div className="mt-5 text-muted">customer123@gmail.com</div>
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

              <Button color="success" className="w-100">Add Vendor +</Button>
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
      </div>
    </div>
  );
};

export default CustomerPage;
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import './Enrollment.css';

const Enrollment = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    nic: "",
    address: "",
    studentName: "",
    dob: "",
    gender: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/enrollment/form",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setFormData({
        parentName: "",
        email: "",
        phone: "",
        nic: "",
        address: "",
        studentName: "",
        dob: "",
        gender: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container className="enrollment-container">
      <Card className="enrollment-card">
        <Card.Body>
          <div className="enrollment-title">
            <h2>Enrollment Form</h2>
            <p>Please complete the form below to enroll your child</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Left Column */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Parent/Guardian Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                    placeholder="Enter parent/guardian name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>NIC</Form.Label>
                  <Form.Control
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    required
                    placeholder="Enter NIC number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Child's Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    placeholder="Enter child's name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter residential address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4 mt-2">
              <Form.Check
                type="checkbox"
                label="I confirm that all the provided information is correct"
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
            >
              <span>Submit Enrollment</span>
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Enrollment;
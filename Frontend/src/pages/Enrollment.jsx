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
    gender: "",
    additionalNotes: ""
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
        "http://localhost:4000/api/v1/enrollment/create",
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
        gender: "",
        additionalNotes: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container className="enrollment-container py-5">
      <Card className="enrollment-card">
        <Card.Body>
          <div className="enrollment-header text-center">
            <h2>Student Enrollment Application</h2>
            <p className="text-muted">Please complete all required fields to enroll your child</p>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Student Information Section */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">👶</span> Student Information
              </h3>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student's Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      required
                      placeholder="Enter student's full name"
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="form-input"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Parent/Guardian Information Section */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">👥</span> Parent/Guardian Information
              </h3>
              <Row>
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
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>NIC Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleChange}
                      required
                      placeholder="Enter NIC number"
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Residential Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter complete residential address"
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Additional Information Section */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">📝</span> Additional Information
              </h3>
              <Form.Group className="mb-3">
                <Form.Label>Special Requirements or Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Please provide any additional information, special requirements, or specific concerns about your child"
                  className="form-input"
                />
              </Form.Group>
            </div>

            <div className="form-section consent-section">
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="terms-checkbox"
                  label="I confirm that all the information provided is accurate and complete"
                  required
                  className="consent-checkbox"
                />
              </Form.Group>
            </div>

            <Button 
              variant="primary" 
              type="submit" 
              className="submit-button"
            >
              Submit Enrollment Application
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Enrollment;
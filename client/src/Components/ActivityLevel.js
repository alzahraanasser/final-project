import React from "react";
import { Container, Button, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ActivityLevel = () => {
  const navigate = useNavigate();

  // Function to handle navigation to the Easy Level page
  const goToEasyLevel = () => {
    navigate("/easy-level"); // Redirect to EasyLevel.js page
  };

  // Function to handle navigation to other levels (medium and hard)
  const goToMediumLevel = () => {
    navigate("/medium-level"); // Change the path if you create medium level
  };

  const goToHardLevel = () => {
    navigate("/hard-level"); // Change the path if you create hard level
  };

  return (
    <Container className="mt-5">
      {/* Back Arrow Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', marginBottom: '12px' }}>
        <Button
          type="button"
          color="link"
          style={{ color: "black", padding: 0 }}
          onClick={() => navigate(-1)}
          title="Go back"
          aria-label="Go back"
        >
          <FaArrowLeft size={24} color="black" />
        </Button>
      </div>
      <Card className="p-4 shadow" style={{ backgroundColor: "#cce7f0" }}>
        <CardBody className="text-center">
          <h3>اختر مستوى النشاط</h3>
          <div className="mt-4 d-flex justify-content-center gap-3">
            {/* Button for Hard Level */}
            <Button color="danger" onClick={goToHardLevel} size="lg">
              المستوى الصعب
            </Button>

            {/* Button for Medium Level */}
            <Button color="warning" onClick={goToMediumLevel} size="lg">
              المستوى المتوسط
            </Button>

            {/* Button for Easy Level */}
            <Button color="primary" onClick={goToEasyLevel} size="lg">
              المستوى السهل
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ActivityLevel;

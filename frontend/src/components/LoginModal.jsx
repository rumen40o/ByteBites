import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPopUp.css";
import "../css/Buttons.css";
import "../css/Inputs.css";
import "../css/RegistrationPopUp.css";
import image from "../images/sushi-1.png";
import { loginUser, getCurrentUser } from "../api/api";

const LoginModal = ({ close, openRegister, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "Моля, въведете имейл или потребителско име!";
    }
    if (!password.trim()) {
      newErrors.password = "Моля, въведете парола!";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    function resizePopup() {
      const wrapper = document.querySelector(".responsive-wrapper");
      if (!wrapper) return;

      const availableWidth = window.innerWidth * 0.9;
      const availableHeight = window.innerHeight * 0.9;

      const scaleX = availableWidth / 1467;
      const scaleY = availableHeight / 910;
      const scale = Math.min(scaleX, scaleY, 1);

      wrapper.style.transform = `scale(${scale})`;
    }

    resizePopup();
    window.addEventListener("resize", resizePopup);
    return () => window.removeEventListener("resize", resizePopup);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      await loginUser({ identifier, password });

      const response = await getCurrentUser();

      onLoginSuccess(response.data);

      if (response.data.role === "DELIVER") {
        navigate("/deliver");
      } else {
        navigate("/");
      }

      close();
    } catch (err) {
      console.error("Axios Error:", err);
      if (err.response) {
        if (typeof err.response.data === "string") {
          setServerError(err.response.data);
        } else if (err.response.data?.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Грешка при вход!");
        }
      } else if (err.request) {
        setServerError("Сървърът не отговаря!");
      } else {
        setServerError("Непозната грешка: " + err.message);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pop-up">
          <div className="responsive-wrapper">
            <div className="square">
              <div className="white-square">
                <div className="container">
                  <div className="title-login">
                    <h className="title-text">Log in</h>
                  </div>

                  <div className="input-layout">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="form-input"
                    />
                    <div className="label">USERNAME or EMAIL</div>
                  </div>

                  <div className="input-layout">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                    />
                    <div className="label">PASSWORD</div>
                  </div>

                  {serverError && <div className="error">{serverError}</div>}

                  <div className="login-entry">
                    <div className="entry-btn">
                      <button className="blue-btn" onClick={handleLogin}>
                        LOG IN
                      </button>
                    </div>
                  </div>

                  <div className="switch-btn">
                    <p className="switch-text">Don't have an account?</p>
                    <button className="white-btn" onClick={openRegister}>
                      Create one
                    </button>
                  </div>
                </div>
              </div>

              <img className="sushi-image" src={image} alt="Sushi" />

              <button className="close-btn" onClick={close} aria-label="Close">
                <svg
                  className="close-icon"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

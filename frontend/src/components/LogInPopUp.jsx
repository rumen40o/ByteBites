import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/LogInPopUp.css";
import "../css/Buttons.css"
import "../css/RegistrationPopUp.css"
import image from "../images/sushi-1.png";

const LogInPopUp = ({ close, openRegister, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

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

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", {
        identifier,
        password,
      }, { withCredentials: true });

      onLoginSuccess(res.data);
      navigate("/");
    } catch (err) {
      setServerError("Invalid credentials or server error.");
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
                  <div className="title-login"><h className="title-text">Log in</h></div>

                  <div className="input-layout">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <div className="label">EMAIL</div>
                  </div>

                  <div className="input-layout">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

              <button className="close-btn" aria-label="Close" onClick={close}>
                <svg viewBox="0 0 24 24" className="close-icon" xmlns="http://www.w3.org/2000/svg">
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

export default LogInPopUp;

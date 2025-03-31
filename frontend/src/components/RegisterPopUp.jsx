import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/RegisterPopUp.css";
import "../css/Buttons.css"
import "../css/RegistrationPopUp.css"
import image from "../images/burger-1.png";

const RegisterPopUp = ({ close, openLogin, onRegisterSuccess2, role}) => {
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

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pop-up">
          <div className="responsive-wrapper">
            <div className="square">
              <div className="white-square">
                <div className="container">
                  <div className="title-register">
                    <h className="title-text">
                    {role === "DELIVER" ? "Become a Rider"
                                : role === "OWNER"
                                ? "Owner register"
                                : "Register"}
                    </h>
                    </div>
                  <div className="input-layout">
                    <input
                      type="text"
                      required
                    />
                    <div className="label">NAME</div>
                  </div>

                  <div className="input-layout">
                    <input
                      type="text"
                      required
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

                  <div className="input-layout">
                    <input
                      type="text"
                      required
                    />
                    <div className="label">PHONE NUMBER</div>
                  </div>
                  <div className="register-entry">
                    <div className="entry-btn">
                      <button className="blue-btn">
                        CREATE ACCOUNT
                      </button>
                    </div>
                  </div>
                  
                  <div className="switch-btn">
                    <p className="switch-text">Already have an account?</p>
                    <button className="white-btn" onClick={openLogin}>
                      Log in
                    </button>
                  </div>
                </div>
              </div>

              <img className="image" src={image} alt="Burger" />

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

export default RegisterPopUp;
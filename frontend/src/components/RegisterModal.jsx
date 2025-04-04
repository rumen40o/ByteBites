import { useState, useEffect } from "react";
import "../css/RegisterPopUp.css";
import "../css/Buttons.css"
import "../css/RegistrationPopUp.css"
import image from "../images/burger-1.png";
import {
  registerUser
} from '../api/api';

const RegisterModal = ({ close, openLogin, role }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(null);

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^(\+359|0)[8-9][0-9]{8}$/;
        return phoneRegex.test(number);
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



    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validatePhoneNumber(phoneNumber)) {
            setError("Невалиден телефонен номер! Използвайте формат: +359XXXXXXXXX или 0XXXXXXXXX");
            return;
        }

        try {
            const response = await registerUser({
              username,
              email,
              password,
              phone_number: phoneNumber,
              role
          });

            console.log("Registration successful:", response.data);
            console.log(role)
            close();
        } catch (err) {
            setError(err.response?.data || "Грешка при регистрация!");
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-input"
                      required
                    />
                    <div className="label">NAME</div>
                  </div>

                  <div className="input-layout">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      required
                    />
                    <div className="label">EMAIL</div>
                  </div>

                  <div className="input-layout">
                    <input
                      type="password"
                      required
                      value={password}
                      className="form-input"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="label">PASSWORD</div>
                  </div>

                  <div className="input-layout">
                    <input
                      type="text"
                      value={phoneNumber}
                      className="form-input"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    <div className="label">PHONE NUMBER</div>
                  </div>
                  <div className="register-entry">
                    <div className="entry-btn">
                      <button className="blue-btn" onClick={handleRegister}>
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

export default RegisterModal;

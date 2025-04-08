import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import logo from "../images/ByteBitesLogoHorizontal.png";
import "../css/Navbar.css";
import "../css/home.css";
import "../css/Inputs.css";
import { getCurrentUser, logoutUser } from "../api/api";
import AddRestaurantModal from "./AddRestaurantModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropDownMenu, setDropDownMenu] = useState(false);
  const menu = document.querySelector(".dropdown-menu");
  const button = document.querySelector(".circle-btn");
  const dropdownRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 1000;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setDropDownMenu(false);
        setIsClosing(false);
      }
    };
  
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target)
      ) {
        setIsClosing(true);
        setTimeout(() => {
          setDropDownMenu(false);
          setIsClosing(false);
        }, 300);
      }
    };
  
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setDropDownMenu(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLogoClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <img
            src={logo}
            alt="ByteBites Logo"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />

          <div className="input-layout">
            <svg
              className="input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input type="text" required onChange={() => {}} className="form-input" />
            <div className="label">Search</div>
          </div>

          <div className="dropdown-menu-container">
          {(showDropDownMenu || isClosing) && (
            <div className={`dropdown-menu ${isClosing ? "closing" : ""}`} ref={dropdownRef}>
              {user ? (
                <>
                  <button onClick={() => { setDropDownMenu(false); navigate("/profile"); }}>
                    View Profile
                  </button>
                  <button onClick={() => { setDropDownMenu(false); navigate("/order-tracking"); }}>
                    Order Status
                  </button>
                  {user.role === "OWNER" && (
                    <button onClick={() => { setDropDownMenu(false); setShowAddModal(true); }}>
                      Add Restaurant
                    </button>
                  )}
                  {isMobileView && (
                    <button onClick={handleLogout}>Log out</button>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => { setShowLogin(true); setDropDownMenu(false); }}>
                    Log in
                  </button>
                  <button onClick={() => { setShowRegister(true); setDropDownMenu(false); }}>
                    Create Account
                  </button>
                </>
              )}
            </div>
          )}

          <button
            className="circle-btn mobile-only"
            onClick={() => {
              if (showDropDownMenu) {
                setIsClosing(true);
                setTimeout(() => {
                  setDropDownMenu(false);
                  setIsClosing(false);
                }, 300);
              } else {
                setDropDownMenu(true);
              }
            }}
          >
              {user ? (
                <FaUserCircle className="circle-icon account-icon" size={18} />
              ) : (
                <svg className="circle-icon" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="20" y="25" width="60" height="10" rx="5"></rect>
                  <rect x="20" y="45" width="60" height="10" rx="5"></rect>
                  <rect x="20" y="65" width="60" height="10" rx="5"></rect>
                </svg>
              )}
            </button>

            <div className="header-btn-content desktop-only">
              {user ? (
                
                <div className="user-controls relative">
                  {user && !isMobileView && (
                    <button className="white-btn" onClick={handleLogout}>
                      Log out
                    </button>
                  )}

                  <button
                    className="circle-btn"
                    onClick={() => {
                      if (showDropDownMenu) {
                        setIsClosing(true);
                        setTimeout(() => {
                          setDropDownMenu(false);
                          setIsClosing(false);
                        }, 300);
                      } else {
                        setDropDownMenu(true);
                      }
                    }}
                    ref={toggleBtnRef}
                  >
                    <FaUserCircle className="circle-icon account-icon" size={12} />
                  </button>
                </div>          
              ) : (
                <div className="header-btn">
                  <button className="white-btn" onClick={() => setShowLogin(true)}>
                    Log in
                  </button>
                  <button className="white-btn" onClick={() => setShowRegister(true)}>
                    Create Account
                  </button>
                </div>
              )}
            </div>

            <button className="circle-btn">
              <svg className="circle-icon" viewBox="0 1 20 20" xmlns="http://www.w3.org/2000/svg">
                <g
                  fill="none"
                  fillRule="evenodd"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(2 3)"
                >
                  <path d="m8 16c4.4380025 0 8-3.5262833 8-7.96428571 0-4.43800246-3.5619975-8.03571429-8-8.03571429-4.43800245 0-8 3.59771183-8 8.03571429 0 4.43800241 3.56199755 7.96428571 8 7.96428571z" />
                  <path d="m1 5h14" />
                  <path d="m1 11h14" />
                  <path d="m8 16c2.2190012 0 4-3.5262833 4-7.96428571 0-4.43800246-1.7809988-8.03571429-4-8.03571429-2.21900123 0-4 3.59771183-4 8.03571429 0 4.43800241 1.78099877 7.96428571 4 7.96428571z" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {showLogin && (
        <LoginModal
          close={() => setShowLogin(false)}
          openRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={() => window.location.reload()}
        />
      )}

      {showRegister && (
        <RegisterModal
          close={() => setShowRegister(false)}
          openLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          role="USER"
        />
      )}

      <AddRestaurantModal
        isOpen={showAddModal}
        close={() => setShowAddModal(false)}
        onAddSuccess={() => window.location.reload()}
      />
    </>
  );
};

export default Navbar;

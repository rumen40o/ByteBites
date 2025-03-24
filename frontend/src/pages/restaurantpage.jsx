import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddItemModal from "../components/AddItemModal";
import "../css/RestaurantPage.css";



const RestaurantPage = () => {
    const { id } = useParams();
    const [customerId, setCustomerId] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/auth/logged/user", {
                withCredentials: true,
            });
            setCustomerId(response.data.id);
            setUserRole(response.data.role);
            loadMenuItems();
        } catch (error) {
            console.error("Грешка при вземане на текущия потребител:", error);
            setError("Неуспешно зареждане на потребител!");
        }
    };

    const loadMenuItems = () => {
        if (!id) return;

        axios
            .get(`http://localhost:8080/menu/restaurant/${id}`, {
                withCredentials: true,
            })
            .then((res) => setMenuItems(res.data))
            .catch((err) => {
                console.error("Грешка при зареждане на менюто:", err);
                setError("Неуспешно зареждане на менюто.");
            });
    };

    const addToOrder = (item) => {
        const existing = orderItems.find((o) => o.menuItem.id === item.id);
        if (existing) {
            setOrderItems(
                orderItems.map((o) =>
                    o.menuItem.id === item.id
                        ? { ...o, quantity: o.quantity + 1 }
                        : o
                )
            );
        } else {
            setOrderItems([...orderItems, { menuItem: item, quantity: 1 }]);
        }
    };

    const decreaseFromOrder = (itemId) => {
        const existing = orderItems.find((o) => o.menuItem.id === itemId);
        if (!existing) return;

        if (existing.quantity === 1) {
            setOrderItems(orderItems.filter((o) => o.menuItem.id !== itemId));
        } else {
            setOrderItems(
                orderItems.map((o) =>
                    o.menuItem.id === itemId
                        ? { ...o, quantity: o.quantity - 1 }
                        : o
                )
            );
        }
    };

    const createOrder = () => {
        if (!customerId || !id || orderItems.length === 0) return;

        axios
            .post(
                `http://localhost:8080/orders/create/customer/${customerId}/restaurant/${id}`,
                orderItems,
                { withCredentials: true }
            )
            .then(() => {
                alert("Поръчката е създадена успешно!");
                setOrderItems([]);
            })
            .catch((err) => {
                console.error("Грешка при поръчване:", err);
                setError("Грешка при създаване на поръчката.");
            });
    };

    return (
        <div className="restaurant-container">

<h2>Меню на ресторанта</h2>

{error && <p className="error-message">{error}</p>}

{userRole === "OWNER" && (
  <>
    <button onClick={() => setIsModalOpen(true)} className="add-item-button">
      ➕ Edit menu
    </button>

    <AddItemModal
      isOpen={isModalOpen}
      close={() => setIsModalOpen(false)}
      restaurantId={id}
      reloadMenu={loadMenuItems}
    />
  </>
)}

<div className="menu-grid">
  {menuItems.map((item) => (
    <div key={item.id} className="menu-item">
      <h3>{item.name}</h3>
      <p>Категория: {item.category}</p>
      <p>Цена: {item.price.toFixed(2)} лв</p>
      <button onClick={() => addToOrder(item)}>Добави</button>
    </div>
  ))}
</div>

{orderItems.length > 0 && (
  <div className="order-section">
    <h3>Твоята поръчка</h3>
    <ul>
      {orderItems.map((o) => (
        <li key={o.menuItem.id} className="order-item">
          <span>{o.menuItem.name} – {o.quantity} бр.</span>
          <div className="order-buttons">
            <button onClick={() => decreaseFromOrder(o.menuItem.id)}>−</button>
            <button onClick={() => addToOrder(o.menuItem)}>+</button>
          </div>
        </li>
      ))}
    </ul>
    <button onClick={createOrder} className="confirm-button">
      Потвърди поръчката
    </button>
  </div>
)}
            
        </div>
    );
};

export default RestaurantPage;

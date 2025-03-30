import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/profile.css";
import EditRestaurantModal from "../components/EditRestaurantModal";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:8080/auth/logged/user", { withCredentials: true });
                setUser(res.data);

                if (res.data.role === "OWNER") {
                    fetchRestaurants(res.data.id);
                }
            } catch (error) {
                setError("Не сте логнати или сесията е изтекла.");
            } finally {
                setLoading(false);
            }
        };

        const fetchRestaurants = async (ownerId) => {
            try {
                const res = await axios.get(`http://localhost:8080/restaurants/owner/${ownerId}`, {
                    withCredentials: true
                });
                setRestaurants(res.data);
            } catch (err) {
                console.error("Грешка при зареждане на ресторанти:", err);
            }
        };

        fetchUser();
    }, []);

    const handleDelete = async (restaurantId) => {
        if (!window.confirm("Сигурни ли сте, че искате да изтриете този ресторант?")) return;
    
        try {
            await axios.delete(`http://localhost:8080/restaurants/delete/${restaurantId}`, {
                withCredentials: true
            });
            setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
            alert("Ресторантът беше успешно изтрит!");
        } catch (err) {
            console.error("Грешка при изтриване:", err);
            alert("Възникна грешка при изтриването на ресторанта.");
        }
    };

    const handleEdit = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setEditModalOpen(true);
      };
      
      const handleUpdate = async (id, updatedData) => {
        try {
          const res = await axios.put(`http://localhost:8080/restaurants/update/${id}`, updatedData, {
            withCredentials: true
          });
          setRestaurants((prev) =>
            prev.map((r) => (r.id === id ? res.data : r))
          );
        } catch (err) {
          console.error("Грешка при редакция:", err);
        }
      };

    if (loading) return <div className="text-center mt-10">Зареждане...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">Профил</h1>
                <div className="space-y-2 mb-6">
                    <p><strong>Потребителско име:</strong> {user.username}</p>
                    <p><strong>Имейл:</strong> {user.email}</p>
                    <p><strong>Телефон:</strong> {user.phoneNumber}</p>
                </div>

                {user.role === "OWNER" && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Вашите ресторанти</h2>
                        {restaurants.length === 0 ? (
                            <p>Нямате добавени ресторанти.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {restaurants.map((restaurant) => (
                                    <div
                                    key={restaurant.id}
                                    className="restaurant-card hover:shadow-xl transition cursor-pointer"
                                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                                    >
                                    <img
                                        src={restaurant.imageUrl}
                                        alt={restaurant.name}
                                        className="restaurant-image"
                                    />
                                    <h3 className="restaurant-name">{restaurant.name}</h3>
                                    <p className="restaurant-description">{restaurant.description}</p>
                                    <p className="restaurant-address">📍 {restaurant.address}</p>

                                    <div className="restaurant-buttons">
                                        <button
                                        className="edit-button"
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleEdit(restaurant);
                                        }}
                                        >
                                        ✏️ Редактирай
                                        </button>
                                        <button
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(restaurant.id);
                                        }}
                                        >
                                        🗑️ Изтрий
                                        </button>
                                    </div>
                                    </div>
                                ))}
                                </div>
                        )}
                    </>
                )}
            </div>
            <EditRestaurantModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                restaurant={selectedRestaurant}
                onUpdate={handleUpdate}
                />
        </div>
    );
};

export default ProfilePage;

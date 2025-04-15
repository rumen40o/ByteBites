import { useEffect, useState } from "react";
import {
    getCurrentUser,
    getRestaurantsByOwner,
    deleteRestaurant,
    updateRestaurant
} from '../api/api'
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
                const res = await getCurrentUser();
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
                const res = await getRestaurantsByOwner(ownerId)
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
            await deleteRestaurant(restaurantId)
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
          const res = await updateRestaurant(id,updatedData)
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

                </div>
         </div>    
    );
};

export default ProfilePage;

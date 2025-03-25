import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "../css/AllRestaurants.css";

const AllRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            const response = await axios.get("http://localhost:8080/restaurants", {
                withCredentials: true,
            });
            setRestaurants(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error loading restaurants:", err);
            setError("Failed to load restaurants");
            setLoading(false);
        }
    };

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading restaurants...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <p>{error}</p>
            <button onClick={loadRestaurants} className="retry-button">
                Try Again
            </button>
        </div>
    );

    return (
        <div className="all-restaurants-container">
            <div className="search-section">
                <h1>All Restaurants</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by restaurant name or cuisine..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="restaurants-grid">
                {filteredRestaurants.map((restaurant) => (
                    <Link 
                        to={`/restaurant/${restaurant.id}`} 
                        key={restaurant.id} 
                        className="restaurant-card"
                    >
                        <div className="restaurant-info">
                            <h2>{restaurant.name}</h2>
                            <div className="restaurant-details">
                                <span className="restaurant-cuisine">{restaurant.cuisine}</span>
                                <span className="restaurant-rating">
                                    <FaStar className="star-icon" />
                                    {restaurant.rating}
                                </span>
                            </div>
                            <p className="restaurant-description">{restaurant.description}</p>
                            <p className="restaurant-address">
                                <FaMapMarkerAlt className="location-icon" />
                                {restaurant.address}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredRestaurants.length === 0 && (
                <div className="no-results">
                    <p>No restaurants found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default AllRestaurants; 
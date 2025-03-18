import Home from './pages/home';
import { Route, Routes } from "react-router-dom";
import './App.css';
import ProfilePage from './pages/profile';

function App() {
  return (
    <div className='routers'>
        <Routes>
          <Route
              path="/"
              element={
                <>
                  <Home />
                </>
              }
            />

          <Route
              path="/profile"
              element={
                <>
                  <ProfilePage />
                </>
              }
            />
        </Routes>
    </div>
  );
}

export default App;

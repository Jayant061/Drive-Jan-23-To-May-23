import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { getUser } from "./credentials";
import "./App.css";

import Home from "./components/home/Home";
import Products from "./components/products/Products";
import Navbar from "./components/navbar/Navbar";
import ProductDescription from "./components/products/ProductDescription";
import Register from "./components/loginNRegister/Register";
import Login from "./components/loginNRegister/Login";
import User from "./components/user/User";
import { UserContext } from "./context/UserContext";
import Cart from "./components/addToCart/Cart";
// import Footer from "./components/footer/Footer";

function App() {
  const {userDispatch} = useContext(UserContext);
  const accessToken = localStorage.getItem("accessToken");

  const ProtectedRoute = ({children})=>{
    const location = useLocation();
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
      try {
        const data = jwt_decode(accessToken);
        if(data){
          return( children );
        }
      } catch (error) {
        return(<Navigate to={"/login"} state={{from: location}} replace/>);
      }
    }
  return(<Navigate to={"/login"} state={{from: location}} replace/>)
  }
  useEffect(() => {
    const getData = async () => {
      if(accessToken){
        try {
          const data = jwt_decode(accessToken);
          if(data){
            userDispatch({
              type:getUser,
              payload:data?.resData
            });
          }  
        } catch (error) {
          console.log(error);
        }
      }
    };
    return () => {
      getData();
    };
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path= "/product/:params" element={<ProductDescription />} />
          <Route exact path="/register" element = {<Register/>}/>
          <Route exact path="/login" element = {<Login/>}/>
          <Route exact path="/auth/user" element = {<ProtectedRoute><User/></ProtectedRoute>}/>
          <Route exact path="/addToCart" element = {<Cart/>}/>
        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
    </div>
  );
}

export default App;

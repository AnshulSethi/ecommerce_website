import React from 'react'
import Navbar from './components/Navbar'
import 'remixicon/fonts/remixicon.css'
import AddProducts from "./Pages/AddProducts"
import { Routes , Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import ProductDetail from './Pages/ProductDetail'
import UserHome from './Pages/usersPage/UserHome'
import UserProductDetail from './Pages/usersPage/UserProductDetail'
import Login from './Pages/Login'
import Cart from './Pages/Cart'

const App = () => {
  return (
    <div>
      <Routes>
        {/* Default route redirects to login */}
        <Route path='/' element={<Navigate to="/login" replace />} />
        
        {/* Login Route */}
        <Route path='/login' element={<Login/>}/>
        
        {/* User Routes */}
        <Route path='/user' element={<UserHome/>}/>
        <Route path='/products/detail/:productId' element={<UserProductDetail/>}/>
        <Route path='/cart' element={<Cart/>}/>
 
        {/* Admin Routes */}
        <Route  path='/admin/' element={<Home/>}/>
        <Route  path='/admin/products/add' element={<AddProducts/>}/>
        <Route  path='/admin/products/detail/:productId'  element={<ProductDetail/>}/>
      </Routes> 
    </div>
  )
}

export default App

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishList } from "../../contexts/WishListContext";

function NavBar() {
  const { user, logoutUser, role, loading } = useAuth();
  const { count } = useCart();
  const cartCount = count;
  const { countWishlist } = useWishList();
  const WishListCount = countWishlist;

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-20 flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-2xl border-b border-amber-900/30">

      {/* DESKTOP */}
      <div className="hidden md:flex items-center justify-between px-8 py-5">
        <div className="w-1/3"></div>

        <div className="flex-1 flex justify-center">
          <h2 className="text-[32px] font-light text-amber-50 tracking-[0.3em] uppercase">
            VELSCENT
          </h2>
        </div>

        <div className="w-1/3 flex items-center justify-end gap-8">
          <Link to="/" className="text-amber-100 hover:text-amber-300">HOME</Link>
          <Link to="/products" className="text-amber-100 hover:text-amber-300">Products</Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-amber-100">
            <i className="fa-regular fa-heart text-xl"></i>
            {WishListCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-amber-600 px-1 rounded-full">
                {WishListCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-amber-100">
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-amber-600 px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* USER */}
          <div className="relative" ref={menuRef}>
            {user ? (
              <button onClick={() => setOpenMenu(!openMenu)} className="text-amber-100">
                <i className="fa-regular fa-circle-user text-xl"></i>
              </button>
            ) : (
              <Link to="/login" className="text-amber-100">
                <i className="fa-regular fa-circle-user text-xl"></i>
              </Link>
            )}

            {openMenu && user && (
              <div className="absolute right-0 mt-4 w-60 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-4">
                <div className="pb-3 border-b border-amber-900/30 flex items-center gap-3">
                  <div className="min-w-[30px] min-h-[30px] rounded-full bg-gradient-to-r from-amber-700 to-amber-900 flex items-center justify-center">
                    <i className="fa-solid fa-user text-amber-100 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm text-amber-100 truncate">{user.email}</p>
                    <p className="text-xs text-amber-300/70">
                      {role === "admin" ? "Administrator" : "Customer"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 space-y-1">
                  <Link to="/my-orders" onClick={() => setOpenMenu(false)} className="block px-3 py-2 text-sm text-amber-300 hover:bg-amber-900/20 rounded">
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logoutUser();
                      setOpenMenu(false);
                      navigate("/");
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-3 py-2">

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-amber-100">
          <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
        </button>

        <h2 className="text-lg text-amber-50 tracking-[0.15em]">VELSCENT</h2>

        {/* FIXED RIGHT SIDE ICONS */}
        <div className="flex items-center gap-4">

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-amber-100">
            <i className="fa-regular fa-heart text-lg"></i>
            {WishListCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-amber-600 px-1 rounded-full">
                {WishListCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-amber-100">
            <i className="fa-solid fa-cart-shopping text-lg"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-amber-600 px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-3 space-y-2 text-sm">

          {user && (
            <div className="border-b border-amber-900/30 pb-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 flex items-center justify-center">
                <i className="fa-solid fa-user text-amber-100"></i>
              </div>
              <div>
                <p className="text-sm text-amber-100 truncate">{user.email}</p>
                <p className="text-xs text-amber-300/70">
                  {role === "admin" ? "Administrator" : "Customer"}
                </p>
              </div>
            </div>
          )}

          <Link to="/" className="block py-2 text-amber-100">Home</Link>
          <Link to="/products" className="block py-2 text-amber-100">Products</Link>
          

          {user ? (
            <>
              <Link to="/my-orders" className="block py-2 text-amber-100">My Orders</Link>
              <button onClick={() => { logoutUser(); navigate("/"); }} className="block py-2 text-red-400">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block py-2 text-amber-100">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
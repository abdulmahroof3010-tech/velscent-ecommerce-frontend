import React from "react";
import { useWishList } from "../contexts/WishListContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

function Wishlist() {
  const { wishList, toggleWishList } = useWishList();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const continueShopping = () => navigate("/products");

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product);
      await toggleWishList(product);
    } catch (e) {
      toast.error("Failed to move to cart");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <AiFillHeart className="text-6xl text-red-500 mb-4" />
        <h2 className="text-2xl font-light text-gray-600">
          Please login to view your wishlist
        </h2>
        <Link
          to="/login"
          className="mt-6 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
        >
          Login
        </Link>
      </div>
    );
  }

  if (wishList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <AiFillHeart className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-light text-gray-600">
          Your wishlist is empty
        </h2>
        <button
          onClick={continueShopping}
          className="mt-6 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* ✅ FIXED GRID (2 column mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishList.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-all"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image_url[0].url}
                  alt={item.name}
                  className="w-full h-40 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-all duration-300"
                />

                <button
                  onClick={() => toggleWishList(item)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </button>
              </div>

              {/* Details */}
              <div className="p-3 sm:p-5">
                <h3 className="text-sm sm:text-lg font-light mb-1 sm:mb-2 line-clamp-2">
                  {item.name}
                </h3>

                {/* ✅ FIXED PRICE SECTION */}
                <div className="mt-1">

                  {/* Sale Price */}
                  <p className="text-base sm:text-lg font-semibold text-black">
                    ₹{item.salePrice || item.original_price}
                  </p>

                  {/* Original Price (cut) */}
                  {item.salePrice && (
                    <p className="text-xs text-gray-500 line-through">
                      ₹{item.original_price}
                    </p>
                  )}

                  {/* Discount */}
                  {item.discount && (
                    <p className="text-xs text-green-600 font-medium">
                      {item.discount}% off
                    </p>
                  )}

                  {/* ML */}
                  {item.ml && (
                    <p className="text-xs text-gray-600 mt-1">
                      {item.ml}ml
                    </p>
                  )}

                </div>

                {/* Buttons */}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 bg-black text-white rounded-lg hover:bg-gray-900 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    Cart
                  </button>

                  <button
                    onClick={() => navigate(`/details/${item._id}`)}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
                  >
                    Details
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <button
            onClick={continueShopping}
            className="px-8 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

export default Wishlist;
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct } from '../../features/products/productSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import { addToCart } from '../../features/cart/cartSlice';
import Button from '../../common/Button';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.products);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    dispatch(addToCart({
      item: {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        imageUrl: selectedProduct.imageUrl,
        quantity: 1,
      },
      userId: user.id
    }));
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          <p className="text-xl text-gray-600 mt-10">Product not found</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 max-w-6xl">
        <Link to="/" className="text-blue-600 hover:underline mb-6 inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="bg-gray-50 rounded-xl flex items-center justify-center p-4 min-h-[400px]">
              {selectedProduct.imageUrl ? (
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex-1">
                <nav className="text-sm text-gray-500 mb-2">{selectedProduct.category}</nav>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-extrabold text-blue-600">₹{selectedProduct.price.toLocaleString()}</span>
                  {selectedProduct.stock > 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">In Stock</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                  )}
                </div>

                <div className="prose prose-sm text-gray-600 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
                  <div>
                    <span className="block font-medium text-gray-400">Seller</span>
                    <span className="font-semibold text-gray-900">{selectedProduct.vendorName}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-400">Stock Remaining</span>
                    <span className="font-semibold text-gray-900">{selectedProduct.stock} units</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full py-4 text-lg"
                  disabled={selectedProduct.stock <= 0}
                  variant={selectedProduct.stock > 0 ? 'primary' : 'secondary'}
                >
                  {selectedProduct.stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
                </Button>
                <Button variant="outline" className="w-full py-4 text-lg">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
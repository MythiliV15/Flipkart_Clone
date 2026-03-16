import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-xl font-semibold text-gray-500">No products found</p>
        <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="h-56 bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <div className="text-gray-300 flex flex-col items-center">
                <svg className="w-12 h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs uppercase font-bold tracking-widest">No Image</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          
          <div className="p-5">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 block">
              {product.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-2xl font-extrabold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              <Link to={`/products/${product.id}`}>
                <Button variant="outline" size="sm" className="px-4">
                  Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
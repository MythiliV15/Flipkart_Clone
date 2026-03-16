import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../../features/products/productSlice';
import Button from '../../common/Button';
import Input from '../../common/Input';

const VendorProductForm = ({ product = null, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || '',
    status: product?.status || 'ACTIVE',
    imageUrl: product?.imageUrl || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (price < 1) {
      alert('Price must be at least 1');
      setLoading(false);
      return;
    }

    if (formData.price.toString().split('.')[0].length > 8) {
      alert('Price cannot exceed 8 digits');
      setLoading(false);
      return;
    }

    if (stock < 0) {
      alert('Stock cannot be less than 0');
      setLoading(false);
      return;
    }

    // Ensure numeric values are sent as numbers
    const finalData = {
      ...formData,
      price: price,
      stock: stock,
    };

    try {
      if (product) {
        await dispatch(updateProduct({ id: product.id, productData: finalData })).unwrap();
      } else {
        await dispatch(addProduct(finalData)).unwrap();
      }
      onClose();
    } catch (err) {
      alert('Failed to save product: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900">
          {product ? 'Update Product' : 'Add New Product'}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Product Name"
          type="text"
          placeholder="e.g. Wireless Headphones"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <div className="w-full">
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Tell customers about your product..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] transition-all"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (₹)"
            type="number"
            placeholder="0.00"
            min="1"
            max="99999999.99"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <Input
            label="Initial Stock"
            type="number"
            placeholder="0"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            type="text"
            placeholder="e.g. Electronics"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <div className="w-full">
            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <Input
          label="Product Image URL"
          type="text"
          placeholder="https://example.com/image.jpg"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="px-8"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            className="px-8 shadow-lg shadow-blue-100"
            loading={loading}
          >
            {product ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorProductForm;
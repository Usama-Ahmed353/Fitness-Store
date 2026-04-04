import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Edit3, Trash2, Search, ChevronLeft, ChevronRight,
  X, Upload, Star, Eye, DollarSign, ShoppingBag, TrendingUp
} from 'lucide-react';
import {
  fetchAdminProducts, createProduct, updateProduct, deleteProduct
} from '../../app/slices/productSlice';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'supplements', 'equipment', 'clothing', 'accessories', 'footwear',
  'nutrition', 'recovery', 'cardio', 'strength', 'yoga', 'other'
];

const initialForm = {
  title: '', description: '', price: '', discount: '', category: 'supplements',
  brand: '', stock: '', sku: '', weight: '', tags: '', isFeatured: false,
  metaTitle: '', metaDescription: '', metaKeywords: ''
};

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { adminProducts, adminPagination, adminLoading } = useSelector((s) => s.products);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(() => {
    dispatch(fetchAdminProducts({ page, limit: 20, search }));
  }, [dispatch, page, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      discount: product.discount?.toString() || '0',
      category: product.category || 'supplements',
      brand: product.brand || '',
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      weight: product.weight?.toString() || '',
      tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured || false,
      metaTitle: product.seo?.metaTitle || product.metaTitle || '',
      metaDescription: product.seo?.metaDescription || product.metaDescription || '',
      metaKeywords: product.seo?.metaKeywords?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount) || 0,
      stock: parseInt(form.stock) || 0,
      weight: parseFloat(form.weight) || 0,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      seo: {
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords ? form.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : []
      }
    };
    delete data.metaTitle;
    delete data.metaDescription;
    delete data.metaKeywords;

    let result;
    if (editingProduct) {
      result = await dispatch(updateProduct({ id: editingProduct._id, data }));
    } else {
      result = await dispatch(createProduct(data));
    }

    if (!result.error) {
      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
      setShowModal(false);
      load();
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteProduct(id));
    if (!result.error) {
      toast.success('Product deleted');
      setDeleteConfirm(null);
      load();
    }
  };

  const totalPages = adminPagination?.pages || 1;

  // Stats
  const stats = [
    { label: 'Total Products', value: adminPagination?.total || 0, icon: Package, color: 'from-blue-500 to-blue-700' },
    { label: 'Featured', value: adminProducts?.filter(p => p.isFeatured).length || 0, icon: Star, color: 'from-yellow-500 to-yellow-700' },
    { label: 'Low Stock (< 10)', value: adminProducts?.filter(p => p.stock < 10).length || 0, icon: TrendingUp, color: 'from-red-500 to-red-700' },
    { label: 'Categories', value: new Set(adminProducts?.map(p => p.category)).size, icon: ShoppingBag, color: 'from-green-500 to-green-700' },
  ];

  return (
    <>
      <Helmet><title>Product Management | Admin</title></Helmet>
      <div className="min-h-screen bg-dark-navy text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Product Management</h1>
              <p className="text-gray-400 mt-1">Manage your store products and inventory</p>
            </div>
            <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium">
              <Plus className="w-5 h-5" /> Add Product
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..." className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              />
            </div>
          </form>

          {/* Table */}
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Price</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Stock</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rating</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminLoading ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading...</td></tr>
                  ) : adminProducts?.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found</td></tr>
                  ) : (
                    adminProducts?.map((product) => (
                      <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-gray-500 m-3" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.title}</p>
                              <p className="text-xs text-gray-500">{product.sku || 'No SKU'}</p>
                            </div>
                            {product.isFeatured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-white/10 rounded text-xs capitalize">{product.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium">${product.price?.toFixed(2)}</span>
                          {product.discount > 0 && <span className="ml-1 text-xs text-green-400">-{product.discount}%</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${product.stock < 10 ? 'text-red-400' : product.stock < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm">{product.ratings?.average?.toFixed(1) || '0.0'}</span>
                            <span className="text-xs text-gray-500">({product.ratings?.count || 0})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(product)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition" title="Edit">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteConfirm(product._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create / Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#16213E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Title *</label>
                      <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Price *</label>
                      <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Discount %</label>
                      <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Category</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#16213E]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Brand</label>
                      <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Stock *</label>
                      <input required type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">SKU</label>
                      <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                      <input type="number" step="0.01" min="0" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                      <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="fitness, gym, protein" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent" />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-accent" />
                      <label htmlFor="featured" className="text-sm">Featured Product</label>
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">SEO Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Meta Title</label>
                        <input value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Meta Description</label>
                        <textarea rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent resize-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Meta Keywords (comma separated)</label>
                        <input value={form.metaKeywords} onChange={e => setForm({ ...form, metaKeywords: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#16213E] rounded-xl p-6 max-w-sm w-full text-center">
                <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Delete Product?</h3>
                <p className="text-gray-400 mb-6 text-sm">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductsPage;

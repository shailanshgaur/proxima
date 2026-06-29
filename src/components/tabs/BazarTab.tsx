import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResidentProfile, Product } from '../../types';
import { productService } from '../../lib/productService';

const CATEGORIES = ['All', 'Furniture', 'Electronics', 'Kids', 'Appliances', 'Sports', 'Other'] as const;
type FilterCategory = typeof CATEGORIES[number];

const CONDITION_LABEL: Record<Product['condition'], string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
};

interface BazarTabProps { profile: ResidentProfile; }

export const BazarTab: React.FC<BazarTabProps> = ({ profile }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<FilterCategory>('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Other' as Product['category'],
    condition: 'good' as Product['condition'],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productService.getProducts(profile.society_id)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile.society_id]);

  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;
    setSubmitting(true);
    try {
      const newProduct = await productService.createProduct({
        seller_id: profile.user_id,
        society_id: profile.society_id,
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseInt(form.price),
        category: form.category,
        condition: form.condition,
        seller_flat: profile.flat_number,
      });
      setProducts(prev => [newProduct, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', price: '', category: 'Other', condition: 'good' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-proxima-text">
            Society Bazaar
          </h1>
          <p className="text-sm text-proxima-muted mt-1">
            High-trust neighbourhood marketplace — buy and sell within your verified community.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="shrink-0 px-4 py-2.5 bg-proxima-primary hover:brightness-110 glow-amber-active text-white text-sm font-semibold rounded-xl transition-all"
        >
          + Post a Listing
        </button>
      </div>

      {/* Search + Category filters */}
      <div className="space-y-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items for sale…"
          className="w-full px-4 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-primary/50 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-proxima-primary text-white'
                  : 'bg-proxima-base border border-proxima-border text-proxima-muted hover:text-proxima-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-proxima-card border border-proxima-border rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-proxima-active" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-proxima-active rounded w-2/3" />
                <div className="h-3 bg-proxima-active rounded w-full" />
                <div className="h-4 bg-proxima-active rounded w-1/3 mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-proxima-muted">
          <p className="text-sm">
            {search
              ? `No results for "${search}"`
              : category !== 'All'
              ? `No ${category} listings yet.`
              : 'No listings yet. Be the first to post!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="bg-proxima-card border border-proxima-border rounded-2xl overflow-hidden hover:border-proxima-primary/30 transition-all group"
            >
              {/* Photo area */}
              <div className="relative aspect-video bg-proxima-active overflow-hidden">
                {product.photo_url ? (
                  <img
                    src={product.photo_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-display font-black text-proxima-muted/30 select-none">
                      {product.category.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Category chip — top left overlay */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wide bg-black/50 backdrop-blur-md text-proxima-primary-light border border-proxima-primary/20">
                    {product.category}
                  </span>
                </div>

                {/* Flat + condition badges — bottom overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono bg-black/50 backdrop-blur-md text-proxima-subtle border border-white/10">
                    Flat {product.seller_flat}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono bg-black/50 backdrop-blur-md text-proxima-secondary-light border border-white/10">
                    {CONDITION_LABEL[product.condition]}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 space-y-1.5">
                <p className="text-sm font-semibold text-proxima-text line-clamp-1">
                  {product.title}
                </p>
                {product.description && (
                  <p className="text-xs text-proxima-muted line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
                <div className="flex items-end justify-between pt-1">
                  <p className="text-base font-black text-proxima-text font-mono">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-proxima-muted font-mono">
                    {new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-proxima-card border border-proxima-border rounded-2xl p-6 w-full max-w-md space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold text-proxima-text">Post a Listing</h2>
                  <p className="text-xs text-proxima-muted mt-0.5">Visible only to verified residents.</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-proxima-muted hover:text-proxima-text hover:bg-proxima-active transition-all text-lg leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Item title"
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-primary transition-colors"
                />
                <input
                  required
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="Price (₹)"
                  type="number"
                  min="0"
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-primary transition-colors"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as Product['category'] }))}
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white outline-none focus:border-proxima-primary transition-colors"
                  >
                    {(['Furniture', 'Electronics', 'Kids', 'Appliances', 'Sports', 'Other'] as const).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={form.condition}
                    onChange={e => setForm(f => ({ ...f, condition: e.target.value as Product['condition'] }))}
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white outline-none focus:border-proxima-primary transition-colors"
                  >
                    {(['new', 'like_new', 'good', 'fair'] as const).map(c => (
                      <option key={c} value={c}>{c.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description (optional)"
                  rows={3}
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-primary transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-proxima-primary hover:brightness-110 glow-amber-active text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting…' : 'Post Listing'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

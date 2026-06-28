import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Plus, Search, Tag, X } from 'lucide-react';
import { ResidentProfile, Product } from '../../types';
import { productService } from '../../lib/productService';

const CATEGORIES = ['All', 'Furniture', 'Electronics', 'Kids', 'Appliances', 'Sports', 'Other'] as const;
type FilterCategory = typeof CATEGORIES[number];

interface BazarTabProps { profile: ResidentProfile; }

export const BazarTab: React.FC<BazarTabProps> = ({ profile }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<FilterCategory>('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '',
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
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-proxima-text flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-proxima-primary" />
            Society Bazar
          </h1>
          <p className="text-sm text-proxima-muted mt-1">High-trust neighbourhood marketplace for verified residents.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-proxima-primary hover:bg-proxima-primary-dim text-white text-sm font-semibold rounded-xl transition-all">
          <Plus className="w-4 h-4" /> Post a Listing
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-proxima-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items for sale…"
            className="w-full pl-10 pr-4 py-2.5 bg-proxima-card border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-primary/50 transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === cat ? 'bg-proxima-primary text-white' : 'bg-proxima-card border border-proxima-border text-proxima-muted hover:text-proxima-text'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-proxima-card border border-proxima-border rounded-xl h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-proxima-muted">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? `No results for "${search}"` : 'No listings yet. Be the first to post!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-proxima-card border border-proxima-border rounded-xl overflow-hidden hover:border-proxima-primary/30 transition-all">
              <div className="h-32 bg-proxima-active flex items-center justify-center">
                {product.photo_url
                  ? <img src={product.photo_url} alt={product.title} className="w-full h-full object-cover" />
                  : <Tag className="w-8 h-8 text-proxima-muted opacity-40" />}
              </div>
              <div className="p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-proxima-primary/10 text-proxima-primary-light border border-proxima-primary/20 rounded uppercase">{product.category}</span>
                  <span className="text-[9px] text-proxima-muted font-mono">Flat {product.seller_flat}</span>
                </div>
                <p className="text-sm font-semibold text-proxima-text line-clamp-1">{product.title}</p>
                <p className="text-base font-black text-proxima-text font-mono">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-proxima-muted">{new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="bg-proxima-card border border-proxima-border rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-bold text-proxima-text">Post a Listing</h2>
                <button onClick={() => setShowForm(false)} className="text-proxima-muted hover:text-proxima-text transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Item title"
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-primary/50" />
                <input required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Price (₹)" type="number" min="0"
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-primary/50" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Product['category'] }))}
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-primary/50">
                    {(['Furniture','Electronics','Kids','Appliances','Sports','Other'] as const).map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as Product['condition'] }))}
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-primary/50">
                    {(['new','like_new','good','fair'] as const).map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                  </select>
                </div>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description (optional)" rows={2}
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-primary/50 resize-none" />
                <button type="submit" disabled={submitting}
                  className="w-full py-2.5 bg-proxima-primary hover:bg-proxima-primary-dim text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50">
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

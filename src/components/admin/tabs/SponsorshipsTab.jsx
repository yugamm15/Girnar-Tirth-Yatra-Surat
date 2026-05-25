import React, { useEffect, useState } from 'react';
import { sponsorshipSchemesDB } from '../../../lib/database.js';

const defaultForm = {
  title: '',
  description: '',
  amount: 0,
  sort_order: 0,
  is_active: true,
};

const SponsorshipsTab = ({ yatraDates = [] }) => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await sponsorshipSchemesDB.getAll();
      setSchemes(data);
    } catch (error) {
      console.error('Failed to load sponsorship schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const startEdit = (scheme) => {
    setEditingId(scheme.id);
    setFormData({
      title: scheme.title || '',
      description: scheme.description || '',
      amount: Number(scheme.amount || 0),
      sort_order: Number(scheme.sort_order || 0),
      is_active: scheme.is_active !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        amount: Number(formData.amount || 0),
        sort_order: Number(formData.sort_order || 0),
        is_active: formData.is_active,
      };

      if (editingId) {
        await sponsorshipSchemesDB.update(editingId, payload);
      } else {
        await sponsorshipSchemesDB.create(payload);
      }

      await loadSchemes();
      resetForm();
    } catch (error) {
      console.error('Failed to save sponsorship scheme:', error);
      alert('Failed to save sponsorship scheme.');
    } finally {
      setSaving(false);
    }
  };

  const deleteScheme = async (scheme) => {
    const confirmed = window.confirm(`Delete \"${scheme.title}\"? This will also remove all trip links.`);
    if (!confirmed) return;

    try {
      await sponsorshipSchemesDB.delete(scheme.id);
      await loadSchemes();
      if (editingId === scheme.id) resetForm();
    } catch (error) {
      console.error('Failed to delete sponsorship scheme:', error);
      alert('Failed to delete sponsorship scheme.');
    }
  };

  const filteredSchemes = schemes.filter((scheme) =>
    `${scheme.title || ''} ${scheme.description || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-headline text-gray-900 mb-2">Sponsorship Management</h2>
          <p className="text-gray-500 text-sm font-light">Manage labharthi schemes and attach them to one or more monthly trips.</p>
        </div>
        <div className="w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sponsorship schemes..."
            className="w-full bg-white border border-gray-200 rounded-sm px-4 py-3 text-sm focus:border-[#c5a059] outline-none transition-all h-[52px]"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-sm shadow-md p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-headline text-gray-900">{editingId ? 'Edit Sponsorship Scheme' : 'Add Sponsorship Scheme'}</h3>
            <p className="text-xs text-gray-400 mt-1">Each scheme can be linked to multiple trips.</p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Scheme Title</span>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
              placeholder="Full Yatra Sponsor"
            />
          </label>
          <label className="space-y-2">
            <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount (₹)</span>
            <input
              type="number"
              min="0"
              required
              value={formData.amount}
              onChange={(event) => setFormData((prev) => ({ ...prev, amount: Number(event.target.value) }))}
              className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Description</span>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors h-28 resize-none"
              placeholder="Short supporting note shown on the public page"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <label className="space-y-2">
            <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sort Order</span>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(event) => setFormData((prev) => ({ ...prev, sort_order: Number(event.target.value) }))}
              className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
            />
          </label>
          <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Active</h4>
              <p className="text-[10px] text-gray-400">Inactive schemes stay saved but will not appear publicly.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Scheme' : 'Create Scheme'}
          </button>
        </div>
      </form>

      <section className="bg-white border border-gray-100 rounded-sm shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Sponsorship Schemes</h3>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">{filteredSchemes.length} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Title</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Scope</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Status</th>
                <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-400 italic">Loading sponsorship schemes...</td>
                </tr>
              ) : filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => {
                return (
                  <tr key={scheme.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{scheme.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scheme.description || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{Number(scheme.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">Universal, applies to all future trips</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${scheme.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {scheme.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => startEdit(scheme)}
                        className="p-2 text-gray-400 hover:text-[#c5a059] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteScheme(scheme)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">No sponsorship schemes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SponsorshipsTab;

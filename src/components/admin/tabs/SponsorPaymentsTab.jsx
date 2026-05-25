import React, { useMemo, useState } from 'react';
import SponsorshipsTab from './SponsorshipsTab';

const SponsorPaymentsTab = ({ paymentIntents = [] }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSchemes, setShowSchemes] = useState(false);

  const filteredPayments = useMemo(() => {
    return paymentIntents.filter((intent) => {
      const searchable = [
        intent.payer_name,
        intent.phone,
        intent.email,
        intent.city,
        intent.gateway_payment_id,
        intent.gateway_order_id,
        intent.module_key,
        intent.reference_type,
        intent.refund_status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = searchable.includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || intent.status === statusFilter || intent.refund_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paymentIntents, search, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-headline text-gray-900 mb-2">Sponsor Payments</h2>
          <p className="text-gray-500 text-sm font-light">View actual sponsor submissions, payment IDs, contact details, and refund status.</p>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 md:items-center">
          <button
            type="button"
            onClick={() => setShowSchemes((prev) => !prev)}
            className="px-5 py-3 bg-[#c5a059] text-white text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-lg shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all h-[52px]"
          >
            {showSchemes ? 'Hide Sponsor Schemes' : 'See Sponsor Schemes'}
          </button>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, phone, payment ID..."
            className="w-full md:w-80 bg-white border border-gray-200 rounded-sm px-4 py-3 text-sm focus:border-[#c5a059] outline-none transition-all h-[52px]"
          />
        </div>
      </div>

      {showSchemes && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Sponsor Schemes</h3>
              <p className="text-xs text-gray-500 mt-1">Create, edit, and delete scheme records from the same page.</p>
            </div>
          </div>
          <SponsorshipsTab />
        </section>
      )}

      <div className="bg-white border border-gray-100 rounded-sm shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-700">Quick Filters</h3>
          <p className="text-[10px] text-gray-400 mt-1">Filter by payment or refund status.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {['all', 'paid', 'pending', 'failed', 'cancelled', 'requested', 'processed', 'not_requested'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm border transition-colors ${statusFilter === value ? 'bg-[#c5a059] text-white border-[#c5a059]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              {value.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white border border-gray-100 rounded-sm shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Payment Records</h3>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">{filteredPayments.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sponsor</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Contact</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Payment ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Refund</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? filteredPayments.map((intent) => (
                <tr key={intent.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{intent.payer_name || 'Unknown'}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{intent.module_key || 'payment'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{intent.phone || '-'}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{intent.email || '-'}</div>
                    <div className="text-[10px] text-gray-400">{intent.city || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">₹{Number(intent.amount || 0).toLocaleString('en-IN')}</div>
                    <div className={`mt-2 inline-flex px-3 py-1 text-[10px] font-bold rounded-full ${intent.status === 'paid' ? 'bg-green-100 text-green-700' : intent.status === 'failed' ? 'bg-red-100 text-red-700' : intent.status === 'cancelled' ? 'bg-gray-100 text-gray-500' : 'bg-yellow-100 text-yellow-700'}`}>
                      {intent.status || 'pending'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="break-all">{intent.gateway_payment_id || '-'}</div>
                    <div className="text-[10px] text-gray-400 mt-1 break-all">Order: {intent.gateway_order_id || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className={`inline-flex px-3 py-1 text-[10px] font-bold rounded-full ${intent.refund_status === 'processed' ? 'bg-blue-100 text-blue-700' : intent.refund_status === 'requested' ? 'bg-orange-100 text-orange-700' : intent.refund_status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                      {intent.refund_status || 'not_requested'}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Refund Txn: {intent.refund_transaction_id || '-'}</div>
                    <div className="text-[10px] text-gray-400">Refund Contact: {intent.refund_contact || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{intent.createdAtLabel || intent.created_at || '-'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">No sponsor payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SponsorPaymentsTab;

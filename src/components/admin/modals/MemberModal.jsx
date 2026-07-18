import React from 'react';
import { generateMemberCode } from '../../../utils/memberUtils';

const MemberModal = ({ 
  isMemberModalOpen, 
  resetMemberForm, 
  editingMemberId, 
  memberFormData, 
  setMemberFormData, 
  handleSaveMember,
  members
}) => {
  if (!isMemberModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto p-4">
      <div className="fixed inset-0 bg-black/80" onClick={resetMemberForm}></div>
      <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059] mx-auto my-12">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-headline text-gray-900">{editingMemberId ? 'Edit Member' : 'Add New Member'}</h3>
          <button onClick={resetMemberForm} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSaveMember} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Full Name</label>
              <input
                type="text"
                value={memberFormData.name}
                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                placeholder="Enter member's full name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Auto-Generated Code</label>
              <div className="w-full bg-gray-100 border border-gray-200 p-4 text-gray-500 text-sm font-mono font-bold select-none cursor-not-allowed">
                {memberFormData.code || generateMemberCode(memberFormData.name, members) || '---'}
              </div>
              <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">Format: Name(First 2) + GYG022</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Email Address</label>
              <input
                type="email"
                value={memberFormData.email}
                onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Password</label>
              <input
                type="text"
                value={memberFormData.password || ''}
                onChange={(e) => setMemberFormData({ ...memberFormData, password: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                placeholder={editingMemberId ? "Leave blank to keep current password" : "Enter custom password"}
                required={!editingMemberId}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Phone Number</label>
              <input
                type="tel"
                value={memberFormData.phone}
                onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                placeholder="e.g., +91 98765 43210"
              />
            </div>
            <div className="flex flex-col justify-center items-start">
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-3 font-bold">Member System Access</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMemberFormData({ ...memberFormData, hasAccess: !memberFormData.hasAccess })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${memberFormData.hasAccess ? 'bg-[#c5a059]' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${memberFormData.hasAccess ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${memberFormData.hasAccess ? 'text-[#c5a059]' : 'text-gray-400'}`}>
                  {memberFormData.hasAccess ? 'Access Enabled' : 'Access Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="flex-grow py-5 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
            >
              {editingMemberId ? 'Save Changes' : 'Confirm & Save Member'}
            </button>
            <button
              type="button"
              onClick={resetMemberForm}
              className="px-10 py-5 border border-gray-300 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;

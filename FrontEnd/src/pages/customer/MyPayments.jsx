import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function MyPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/api/customers/me/payments')
      .then(res => setPayments(res.data))
      .catch(err => console.error("Payment log fetch failed"));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-12">
      <h2 className="text-4xl font-black uppercase italic mb-8 border-b-4 border-emerald-500 pb-2">Financial Ledger</h2>
      <div className="grid gap-4">
        {payments.length === 0 ? (
          <p className="font-bold text-slate-400 uppercase tracking-widest">No transactions recorded.</p>
        ) : (
          payments.map(p => (
            <div key={p.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-md">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Ref: {p.razorpayPaymentId || 'PENDING'}</p>
                <p className={`text-xl font-black uppercase italic ${p.status === 'SUCCESS' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {p.status}
                </p>
                <p className="text-[10px] font-bold text-slate-300 uppercase">Order ID: #{p.orderId}</p>
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter italic">₹{p.amount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
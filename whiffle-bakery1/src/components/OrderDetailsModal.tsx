import { X, Package, Truck, User, Calendar, DollarSign, MapPin } from "lucide-react";
import { type BackendOrder } from "@/lib/api";
import { format } from "date-fns";

type OrderDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: BackendOrder | null;
};

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-chocolate/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
        {/* Header */}
        <div className="bg-chocolate p-8 text-cream flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold">Order Details</h2>
              <p className="text-cream/60 text-sm font-body">#{order.id.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Status Banner */}
          <div className="flex flex-wrap gap-4 items-center justify-between p-6 bg-secondary/10 rounded-[2rem] border border-border">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-heading font-bold text-chocolate uppercase tracking-widest">Status</p>
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tighter ${
                  order.status === 'delivered' ? 'bg-emerald-500 text-white' :
                  order.status === 'cancelled' ? 'bg-rose-500 text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="space-y-1">
                <p className="text-[10px] font-heading font-bold text-chocolate uppercase tracking-widest">Payment</p>
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tighter ${
                  order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-chocolate font-heading font-bold text-xl">
              <DollarSign size={20} className="text-emerald-500" />
              {Number(order.total_amount).toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-chocolate">
                <User size={18} />
                <h3 className="font-heading font-bold">Customer Information</h3>
              </div>
              <div className="bg-secondary/5 p-6 rounded-[2rem] border border-border space-y-3">
                <p className="font-body text-sm text-chocolate flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-bold">{order.shipping_address?.full_name || 'Guest'}</span>
                </p>
                <p className="font-body text-sm text-chocolate flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{order.shipping_address?.email || 'N/A'}</span>
                </p>
                <p className="font-body text-sm text-chocolate flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span>{format(new Date(order.created_at), 'PPP p')}</span>
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-chocolate">
                <MapPin size={18} />
                <h3 className="font-heading font-bold">Shipping Address</h3>
              </div>
              <div className="bg-secondary/5 p-6 rounded-[2rem] border border-border">
                <p className="font-body text-sm text-chocolate leading-relaxed">
                  {order.shipping_address?.address}<br />
                  {order.shipping_address?.city}, {order.shipping_address?.zip}
                </p>
                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-[10px] font-heading font-bold text-chocolate uppercase tracking-widest mb-1">Notes</p>
                    <p className="font-body text-xs italic text-muted-foreground">"{order.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-chocolate">
              <Package size={18} />
              <h3 className="font-heading font-bold">Ordered Items</h3>
            </div>
            <div className="bg-white rounded-[2rem] border border-border overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/10">
                    <th className="py-4 px-6 font-heading font-bold text-chocolate text-xs">Product</th>
                    <th className="py-4 px-6 font-heading font-bold text-chocolate text-xs">Qty</th>
                    <th className="py-4 px-6 font-heading font-bold text-chocolate text-xs">Price</th>
                    <th className="py-4 px-6 font-heading font-bold text-chocolate text-xs text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-6 font-body font-bold text-chocolate text-sm">{item.product_name}</td>
                      <td className="py-4 px-6 font-body text-sm">{item.quantity}</td>
                      <td className="py-4 px-6 font-body text-sm">${Number(item.unit_price).toFixed(2)}</td>
                      <td className="py-4 px-6 font-heading font-bold text-chocolate text-sm text-right">${Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { ShoppingBag } from "lucide-react";
export default OrderDetailsModal;

import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewModal from "@/components/ReviewModel"; // ✅ Modal එක Import කරන්න

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuth(); // Assuming useAuth provides the user object
  const navigate = useNavigate();

  // ✅ තෝරාගත් Order එකේ ID එක තබා ගැනීමට State එකක්
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching orders for User ID:", user.id); // DEBUG LOG
      fetchOrders();
    } else {
      console.log("No User ID found in MyOrders"); // DEBUG LOG
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/user/id/${user?.id}`); // Assuming existing API endpoint
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(`/orders/cancel/${orderId}`);
      fetchOrders(); // Refresh orders after cancellation
      // You might want to show a success message here
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 font-sans max-w-4xl animate-in slide-in-from-bottom-5">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 pl-0 hover:bg-transparent font-bold text-muted-foreground hover:text-primary transition-colors"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Order History</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">View and track your previous orders.</p>
        </div>
      </div>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-muted/50">
            <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-black uppercase text-muted-foreground tracking-widest text-xs">No orders placed yet</p>
          </div>
        ) : (
          orders.map((order) => (
            /* Main Order Card */
            <div key={order.id} className="bg-background border border-muted/20 shadow-sm rounded-[2.5rem] p-8 transition-all hover:shadow-xl group">

              {/* Top Row: Order Details & Status */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                    Order Identification
                  </p>
                  <p className="text-2xl font-black text-primary italic tracking-tight uppercase leading-none">
                    {order.id}
                  </p>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Purchase Date</p>
                    <div className="flex items-center justify-end gap-1.5 font-black text-sm italic">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`${order.orderStatus === 'Delivered'
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-100'
                    : order.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-600 hover:bg-red-100'
                      : 'bg-green-100 text-green-600 hover:bg-green-100'
                    } border-none font-black uppercase text-[9px] px-4 py-1.5 rounded-full tracking-widest shadow-none`}>
                    {order.orderStatus}
                  </Badge>
                </div>
              </div>

              {/* Items Preview - Rounded Cards */}
              <div className="flex flex-wrap gap-4 mb-8">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="h-20 w-16 relative flex-shrink-0 group/item">
                    <div className="h-full w-full rounded-xl overflow-hidden border-2 border-muted/50 shadow-md group-hover/item:border-primary/30 transition-all">
                      <img src={item.image} className="h-full w-full object-cover" alt={item.title} />
                    </div>
                    {/* Quantity Badge */}
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="mb-6 opacity-30 bg-muted-foreground/20" />

              {/* Bottom Row: Totals & Actions */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Investment</p>
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                    LKR {order.totalAmount.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.orderStatus === 'Pending' && (
                    <Button
                      className="gap-2 font-black uppercase text-[10px] tracking-widest bg-red-100 text-red-600 hover:bg-red-200 rounded-2xl h-12 px-8 shadow-none"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}

                  {order.orderStatus === 'Delivered' ? (
                    <Button
                      className="gap-2 font-black uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-blue-700 rounded-2xl h-12 px-8 shadow-xl shadow-blue-200 group/btn"
                      onClick={() => setSelectedOrderId(order.id)} // ✅ ක්ලික් කළ විට ID එක සෙට් කරන්න
                    >
                      <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" /> Rate & Review
                    </Button>
                  ) : order.orderStatus !== 'Cancelled' && (
                    <div className="flex items-center gap-3 bg-muted/40 px-6 py-3 rounded-2xl border border-dashed border-muted-foreground/30 transition-colors hover:bg-muted/60">
                      <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                        {order.orderStatus === 'Processing' ? 'Processing Order...' : 'Awaiting Delivery...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Review Modal එක සම්බන්ධ කිරීම */}
      <ReviewModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId || ""}
      />
    </div>
  );
};

export default MyOrders;
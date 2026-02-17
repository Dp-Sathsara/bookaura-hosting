import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Package, User, MapPin, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: {
    bookId: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders");
      // Sort by date desc
      const sortedOrders = response.data.sort((a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Filter orders by status
  const filteredOrders = orders.filter(order => {
    if (statusFilter === "all") return true;
    return order.orderStatus === statusFilter;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    console.log(`Updating status for ${orderId} to ${newStatus}`);
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus });

      setOrders(orders.map(order => {
        if (order.id === orderId) {
          console.log(`Updating local order ${orderId} status to ${newStatus}`);
          return { ...order, orderStatus: newStatus };
        }
        return order;
      }));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }

      toast({
        title: "Status Updated",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update order status.",
        variant: "destructive",
      });
    }
  };

  const getStatusStyles = (status: string) => {
    const baseStyles = "w-fit min-w-[120px] h-9 px-4 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300 shadow-sm border-none clickable-status";
    switch (status) {
      case "Pending":
        return `${baseStyles} bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400`;
      case "Processing":
        return `${baseStyles} bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950/30 dark:text-amber-400`;
      case "Shipped":
        return `${baseStyles} bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400`;
      case "Delivered":
        return `${baseStyles} bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400`;
      case "Rejected":
        return `${baseStyles} bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950/30 dark:text-rose-400`;
      default:
        return `${baseStyles} bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300`;
    }
  };

  return (
    <div className="p-8 space-y-10 min-h-screen bg-background text-foreground animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] shadow-sm border border-border">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Order <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm">Monitor and process customer orders in real-time</p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-[2rem] border border-border">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground leading-none mb-1">Total Orders</p>
            <p className="text-2xl font-black tabular-nums">{filteredOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex justify-end">
        <div className="w-full sm:w-[240px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 rounded-2xl bg-card border border-border shadow-sm font-bold hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="font-bold">All Statuses</SelectItem>
              <SelectItem value="Pending" className="font-bold">Pending</SelectItem>
              <SelectItem value="Processing" className="font-bold">Processing</SelectItem>
              <SelectItem value="Shipped" className="font-bold">Shipped</SelectItem>
              <SelectItem value="Delivered" className="font-bold">Delivered</SelectItem>
              <SelectItem value="Rejected" className="font-bold">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-200/10 bg-card overflow-hidden p-2">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-transparent border-none">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/70">Order ID</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/70">Customer</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/70">Date</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/70">Total</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/70 text-center">Status</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/70 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="group hover:bg-muted/30 transition-all duration-300 border-b border-border last:border-none">
                  <TableCell className="px-8 py-6">
                    <span className="font-black text-[11px] font-mono bg-muted px-3 py-1.5 rounded-lg text-muted-foreground group-hover:bg-background transition-colors">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-black text-sm text-primary">
                        {order.customerDetails.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground leading-tight mb-0.5">{order.customerDetails.name}</div>
                        <div className="text-[11px] text-muted-foreground font-medium">{order.customerDetails.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div>
                      <div className="font-bold text-sm text-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="font-black text-sm text-foreground tracking-tight">
                      <span className="text-[10px] text-muted-foreground mr-1">LKR</span>
                      {order.totalAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-center">
                    <Select
                      value={order.orderStatus}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className={getStatusStyles(order.orderStatus)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-border shadow-2xl p-2 bg-popover/95 backdrop-blur-md">
                        <SelectItem value="Pending" className="rounded-xl py-3 focus:bg-emerald-50 dark:focus:bg-emerald-950/50 focus:text-emerald-700 dark:focus:text-emerald-400 font-bold text-xs uppercase tracking-wider">Pending</SelectItem>
                        <SelectItem value="Processing" className="rounded-xl py-3 focus:bg-amber-50 dark:focus:bg-amber-950/50 focus:text-amber-700 dark:focus:text-amber-400 font-bold text-xs uppercase tracking-wider">Processing</SelectItem>
                        <SelectItem value="Shipped" className="rounded-xl py-3 focus:bg-indigo-50 dark:focus:bg-indigo-950/50 focus:text-indigo-700 dark:focus:text-indigo-400 font-bold text-xs uppercase tracking-wider">Shipped</SelectItem>
                        <SelectItem value="Delivered" className="rounded-xl py-3 focus:bg-emerald-50 dark:focus:bg-emerald-950/50 focus:text-emerald-700 dark:focus:text-emerald-400 font-bold text-xs uppercase tracking-wider">Delivered</SelectItem>
                        <SelectItem value="Rejected" className="rounded-xl py-3 focus:bg-rose-50 dark:focus:bg-rose-950/50 focus:text-rose-700 dark:focus:text-rose-400 font-bold text-xs uppercase tracking-wider">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-2xl h-10 px-5 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-black uppercase text-[10px] tracking-widest gap-2"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>


      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <Card className="rounded-2xl border-none shadow-md bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Customer Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-bold text-lg">{selectedOrder.customerDetails.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerDetails.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerDetails.phone}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-md bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-bold">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm font-bold text-primary">{selectedOrder.shippingAddress.country}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-md md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" /> Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0 border-dashed">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.title}
                          className="h-16 w-12 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-sm line-clamp-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.author}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="font-bold text-sm">LKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4">
                      <span className="font-black uppercase tracking-tight text-lg">Total Amount</span>
                      <span className="font-black text-xl text-primary">LKR {selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
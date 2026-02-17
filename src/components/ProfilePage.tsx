import { useState } from "react";
import { useCartStore } from "@/store/userCartStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User, Package, Clock, MapPin,
  Settings, Camera, Star, MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProfilePage = () => {
  const { orders } = useCartStore();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Profile data state
  const [userData, _setUserData] = useState({
    name: "User Name",
    email: "user@example.com",
    address: "Colombo, Sri Lanka",
    phone: "0759951458" // Example from image
  });

  return (
    <div className="container mx-auto px-4 py-10 font-sans max-w-6xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">My Account</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ✅ User Info Section with Edit Capability */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden group">
            <div className="bg-primary h-28 w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <CardContent className="relative pt-16 text-center">

              {/* Profile Image Click to Edit */}
              <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogTrigger asChild>
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 h-28 w-28 rounded-full border-[6px] border-background bg-muted flex items-center justify-center overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-transform group">
                    <User className="h-14 w-14 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[2rem] font-sans border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Edit Profile</DialogTitle>
                    <DialogDescription>Update your personal information and delivery details.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                      <Input defaultValue={userData.name} className="h-12 rounded-xl bg-muted/50 border-none font-bold" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                      <Input defaultValue={userData.phone} className="h-12 rounded-xl bg-muted/50 border-none font-bold" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shipping Address</Label>
                      <Input defaultValue={userData.address} className="h-12 rounded-xl bg-muted/50 border-none font-bold" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="w-full h-12 font-black uppercase tracking-widest rounded-xl shadow-lg" onClick={() => setIsEditProfileOpen(false)}>
                      Save Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <h3 className="text-2xl font-black uppercase italic tracking-tight">{userData.name}</h3>
              <p className="text-sm text-muted-foreground font-medium mb-6">{userData.email}</p>

              <Separator className="mb-6 opacity-50" />

              <div className="space-y-4 text-left px-2">
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                  <div className="bg-primary/10 p-2 rounded-lg"><MapPin className="h-4 w-4 text-primary" /></div>
                  <span className="line-clamp-1">{userData.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                  <div className="bg-primary/10 p-2 rounded-lg"><Package className="h-4 w-4 text-primary" /></div>
                  <span>{orders.length} Total Orders</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-8 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 h-11" onClick={() => setIsEditProfileOpen(true)}>
                <Settings className="mr-2 h-3 w-3" /> Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ✅ Order History Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 uppercase font-black italic text-xl tracking-tight">
                <Clock className="h-5 w-5 text-primary" /> Order History
              </CardTitle>
              <CardDescription className="font-medium text-muted-foreground italic">View and track your previous orders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 py-6">
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-10" />
                  <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No orders found yet</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.orderId} className="border-2 border-muted/30 rounded-[2rem] p-8 hover:border-primary/20 transition-all group overflow-hidden relative">

                    <div className="flex flex-wrap justify-between items-start gap-6 mb-8 relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Order ID</p>
                        <p className="text-xl font-black text-primary italic tracking-tight uppercase leading-none">{order.orderId}</p>
                      </div>
                      <div className="flex gap-8 items-center">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Purchase Date</p>
                          <p className="font-black text-sm text-foreground italic">{order.date}</p>
                        </div>
                        <Badge className={`${order.status === 'Delivered' ? 'bg-blue-500' : 'bg-green-500'} text-white border-none font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/10 animate-pulse`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Book Thumbnails with quantity badges */}
                    <div className="flex items-center gap-4 mb-8">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="h-20 w-16 relative group/img">
                          <img src={item.image} className="h-full w-full object-cover rounded-xl border-2 border-muted shadow-md group-hover/img:scale-105 transition-transform" alt="" />
                          <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                            {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="mb-6 opacity-30" />

                    <div className="flex justify-between items-end relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Investment</p>
                        <p className="text-3xl font-black text-foreground italic tracking-tighter leading-none uppercase">LKR {order.totalAmount.toLocaleString()}</p>
                      </div>

                      {/* ✅ Feedback Action - Based on Status */}
                      {order.status === 'Delivered' ? (
                        <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                          <DialogTrigger asChild>
                            <Button size="lg" className="gap-2 font-black uppercase text-[10px] tracking-[0.15em] bg-blue-600 hover:bg-blue-700 rounded-2xl px-8 h-12 shadow-xl shadow-blue-200 group">
                              <MessageSquare className="h-4 w-4 group-hover:rotate-12 transition-transform" /> Rate & Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md rounded-[2.5rem] font-sans text-center p-10">
                            <DialogHeader className="items-center">
                              <div className="bg-blue-100 p-4 rounded-full mb-4"><Star className="h-10 w-10 text-blue-600 fill-blue-600" /></div>
                              <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Share Your Thoughts!</DialogTitle>
                              <DialogDescription className="text-md font-medium">How was your experience with these books?</DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center gap-2 py-6">
                              {[...Array(5)].map((_, i) => <Star key={i} className="h-8 w-8 text-yellow-400 cursor-pointer hover:scale-110 transition-transform" />)}
                            </div>
                            <textarea className="w-full bg-muted/50 rounded-[1.5rem] p-4 text-sm font-medium border-none focus:ring-2 ring-primary h-32" placeholder="Write your review here..."></textarea>
                            <Button className="w-full mt-6 h-14 rounded-2xl font-black uppercase tracking-widest bg-blue-600" onClick={() => setIsFeedbackOpen(false)}>Submit Feedback</Button>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="flex items-center gap-3 bg-muted/50 px-6 py-3 rounded-2xl border border-dashed border-muted">
                          <Clock className="h-4 w-4 text-muted-foreground animate-spin-slow" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Awaiting Delivery...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
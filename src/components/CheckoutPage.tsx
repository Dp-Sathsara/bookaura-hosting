import { useState, useEffect } from "react";
import { useCartStore } from "@/store/userCartStore";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { Lock, CreditCard, MapPin, Truck, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import api from "@/services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const checkoutSchema = z.object({
  paymentMethod: z.enum(["cod", "card"]),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "card") {
    if (!data.cardNumber || !/^\d{4} \d{4} \d{4} \d{4}$/.test(data.cardNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card number must be 16 digits (0000 0000 0000 0000)",
        path: ["cardNumber"],
      });
    }
    if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiry must be MM/YY format",
        path: ["expiryDate"],
      });
    } else {
      const [month, year] = data.expiryDate.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Expiry date must be in the future",
          path: ["expiryDate"],
        });
      }
    }
    if (!data.cvv || !/^\d{3}$/.test(data.cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVC must be 3 digits",
        path: ["cvv"],
      });
    }
  }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");

  const totalPrice = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card",
      name: user?.username || "",
      email: user?.email || "",
      country: "Sri Lanka",
    },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (cart.length === 0 && !showSuccessModal) {
      navigate("/");
    }
  }, [cart, navigate, showSuccessModal]);

  const onPlaceOrder = async (data: CheckoutFormValues) => {
    if (data.paymentMethod === "card") {
      setIsVerifying(true);
      // Simulate Bank Verification / 3DSecure
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsVerifying(false);
    }

    setIsProcessing(true);

    const orderData = {
      customerDetails: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      shippingAddress: {
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
      },
      items: cart.map(item => ({
        bookId: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image
      })),
      totalAmount: totalPrice,
      paymentMethod: data.paymentMethod === 'cod' ? "Cash on Delivery" : "Credit Card",
      orderStatus: "Pending",
      paymentStatus: data.paymentMethod === 'card' ? "Paid" : "Pending",
      userId: user?.id
    };

    try {
      const response = await api.post("/orders", orderData);
      setOrderId(response.data.id || "#ORDER-" + Math.floor(Math.random() * 10000));
      setShowSuccessModal(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order Failed:", error);
      toast.error("Order Failed! Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto py-10 px-4">
        <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full text-center space-y-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-300 border border-white/20">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 ring-8 ring-green-50 shadow-inner">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black uppercase tracking-tight text-green-700">Order Placed!</h2>
            <p className="text-muted-foreground font-medium text-lg">Thank you for your purchase. We hope you enjoy your books!</p>
          </div>
          <div className="bg-muted/30 p-6 rounded-[2rem] border-2 border-dashed border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10"><Truck className="h-12 w-12" /></div>
            <p className="text-sm font-bold uppercase text-muted-foreground tracking-widest mb-1">Order ID</p>
            <p className="text-3xl font-black text-primary tracking-widest">{orderId}</p>
          </div>


          <Button onClick={() => navigate("/orders")} className="w-full h-14 rounded-2xl font-black text-xl uppercase tracking-wider shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
            View My Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Simulation Modal */}
      {isVerifying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl">
          <div className="bg-white p-10 rounded-[3rem] text-center space-y-6 shadow-2xl max-w-sm w-full mx-4 border border-primary/10 animate-in zoom-in-95">
            <div className="relative flex items-center justify-center mx-auto">
              <Loader2 className="h-20 w-20 text-primary animate-spin" />
              <CreditCard className="absolute h-8 w-8 text-primary/50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase">Verifying Payment</h3>
              <p className="text-muted-foreground font-medium">Please wait while we securely connect with your bank...</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-lg">Back</span>
      </button>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
        Checkout <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      </h1>

      <form onSubmit={handleSubmit(onPlaceOrder)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Shipping Form */}
          <Card className="rounded-[2.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase"><MapPin className="text-primary h-6 w-6" /> Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                  <Input {...register("name")} className={`rounded-2xl h-14 bg-white border-2 transition-all ${errors.name ? 'border-red-500 ring-red-100' : 'border-primary/5 focus:border-primary ring-primary/10'}`} placeholder="Enter your full name" />
                  {errors.name && <p className="text-red-500 text-xs font-bold ml-1">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <Input {...register("phone")} className={`rounded-2xl h-14 bg-white border-2 transition-all ${errors.phone ? 'border-red-500 ring-red-100' : 'border-primary/5 focus:border-primary ring-primary/10'}`} placeholder="07XXXXXXXX" maxLength={10} />
                  {errors.phone && <p className="text-red-500 text-xs font-bold ml-1">{errors.phone.message as string}</p>}
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                <Input {...register("email")} className={`rounded-2xl h-14 bg-white border-2 transition-all ${errors.email ? 'border-red-500 ring-red-100' : 'border-primary/5 focus:border-primary ring-primary/10'}`} placeholder="you@example.com" />
                {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message as string}</p>}
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Street Address</Label>
                <Input {...register("address")} className={`rounded-2xl h-14 bg-white border-2 transition-all ${errors.address ? 'border-red-500 ring-red-100' : 'border-primary/5 focus:border-primary ring-primary/10'}`} placeholder="House No, Street Name" />
                {errors.address && <p className="text-red-500 text-xs font-bold ml-1">{errors.address.message as string}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">City</Label>
                  <Input {...register("city")} className={`rounded-2xl h-14 bg-white border-2 transition-all ${errors.city ? 'border-red-500 ring-red-100' : 'border-primary/5 focus:border-primary ring-primary/10'}`} placeholder="City" />
                  {errors.city && <p className="text-red-500 text-xs font-bold ml-1">{errors.city.message as string}</p>}
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Country</Label>
                  <Input {...register("country")} className={`rounded-2xl h-14 bg-white border-2 transition-all ${errors.country ? 'border-red-500 ring-red-100' : 'border-primary/5 focus:border-primary ring-primary/10'}`} />
                  {errors.country && <p className="text-red-500 text-xs font-bold ml-1">{errors.country.message as string}</p>}
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Postal Code</Label>
                  <Input {...register("postalCode")} className={`rounded-2xl h-14 bg-white border-2 transition-all ${errors.postalCode ? 'border-red-500 ring-red-100' : 'border-primary/5 focus:border-primary ring-primary/10'}`} placeholder="Postal Code" />
                  {errors.postalCode && <p className="text-red-500 text-xs font-bold ml-1">{errors.postalCode.message as string}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method UI */}
          <Card className="rounded-[2.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase"><CreditCard className="text-primary h-6 w-6" /> Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) => setValue("paymentMethod", val as "cod" | "card")}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className={`group relative flex items-center space-x-4 border-2 p-6 rounded-[2rem] cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-inner' : 'border-muted hover:border-primary/20'}`}>
                  <RadioGroupItem value="card" id="card" className="border-2 border-primary" />
                  <Label htmlFor="card" className="font-black cursor-pointer flex items-center justify-between w-full text-lg uppercase tracking-tight">
                    <span className="flex items-center gap-2"><CreditCard className="h-6 w-6" /> Card Payment</span>
                  </Label>
                </div>
                <div className={`group relative flex items-center space-x-4 border-2 p-6 rounded-[2rem] cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-inner' : 'border-muted hover:border-primary/20'}`}>
                  <RadioGroupItem value="cod" id="cod" className="border-2 border-primary" />
                  <Label htmlFor="cod" className="font-black cursor-pointer flex items-center justify-between w-full text-lg uppercase tracking-tight">
                    <span className="flex items-center gap-2"><Truck className="h-6 w-6" /> Cash on Delivery</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="p-8 bg-muted/20 rounded-[2.5rem] space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Card Number</Label>
                    <div className="relative">
                      <Input
                        {...register("cardNumber", {
                          onChange: (e) => {
                            let val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
                            setValue("cardNumber", val, { shouldValidate: true });
                          }
                        })}
                        placeholder="0000 0000 0000 0000"
                        className={`rounded-2xl h-14 bg-white border-2 font-mono text-lg tracking-[0.2em] pl-12 transition-all ${errors.cardNumber ? 'border-red-500' : 'border-primary/5'}`}
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-xs font-bold ml-1">{errors.cardNumber.message as string}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Expiry (MM/YY)</Label>
                      <Input
                        {...register("expiryDate", {
                          onChange: (e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length >= 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                            setValue("expiryDate", val, { shouldValidate: true });
                          }
                        })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`rounded-2xl h-14 bg-white border-2 font-mono text-lg transition-all ${errors.expiryDate ? 'border-red-500' : 'border-primary/5'}`}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-xs font-bold ml-1">{errors.expiryDate.message as string}</p>}
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">CVV / CVC</Label>
                      <Input
                        {...register("cvv")}
                        type="password"
                        maxLength={3}
                        placeholder="123"
                        className={`rounded-2xl h-14 bg-white border-2 font-mono text-lg transition-all ${errors.cvv ? 'border-red-500' : 'border-primary/5'}`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs font-bold ml-1">{errors.cvv.message as string}</p>}
                    </div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your payment information is encrypted and securely processed. We do not store your full card details.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="rounded-[3rem] border-none shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] bg-primary text-white sticky top-12 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600 opacity-90" />
            <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 rotate-12 opacity-10 group-hover:rotate-45 transition-transform duration-1000">
              <Truck className="h-32 w-32" />
            </div>

            <div className="relative z-10 p-8 space-y-8">
              <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
                Review Order <span>({cart.length})</span>
              </CardTitle>

              <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar-white">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10">
                    <div className="h-16 w-12 min-w-[3rem] bg-white rounded-xl overflow-hidden shadow-lg">
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm line-clamp-1">{item.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs opacity-80">Qty: {item.quantity || 1}</span>
                        <span className="font-black text-sm">LKR {(item.price * (item.quantity || 1)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center opacity-80 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold">LKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center opacity-80 text-sm">
                  <span>Shipping</span>
                  <span className="font-bold uppercase">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-black uppercase">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black">LKR {totalPrice.toLocaleString()}</span>
                    <p className="text-[10px] opacity-60 uppercase font-bold text-right tracking-widest mt-1">Inclusive of Taxes</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing || isVerifying}
                className="w-full h-16 rounded-[2rem] bg-white text-primary hover:bg-white/90 font-black uppercase text-lg shadow-2xl shadow-black/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing || isVerifying ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> {isVerifying ? "Verifying..." : "Processing..."}</span>
                ) : (
                  <span className="flex items-center gap-2">Place Order <Lock className="h-5 w-5" /></span>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </form>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        
        .custom-scrollbar-white::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-white::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
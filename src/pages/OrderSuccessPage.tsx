import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full animate-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="h-20 w-20 text-green-500" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Order Placed!</h1>
                <p className="text-muted-foreground font-medium mb-8">
                    Thank you for your purchase. Your order has been successfully placed and is being processed.
                </p>
                <div className="space-y-3">
                    <Button
                        onClick={() => navigate("/orders")}
                        className="w-full h-12 rounded-xl font-bold uppercase tracking-widest bg-primary hover:bg-primary/90"
                    >
                        View My Orders
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="w-full h-12 rounded-xl font-bold uppercase tracking-widest"
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;

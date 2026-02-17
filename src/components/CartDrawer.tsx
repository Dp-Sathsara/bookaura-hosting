import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/userCartStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function CartDrawer() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, removeItemCompletely, totalPrice, toggleSelectItem, toggleSelectAll } = useCartStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const selectedCount = cart.filter(item => item.selected).length;
  const isAllSelected = cart.length > 0 && selectedCount === cart.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-white border border-background font-bold text-[8px]">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      {/* Drawer එකේ width එක වැඩි කළා (sm:max-w-lg) */}
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background font-sans">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight italic">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Cart
          </SheetTitle>

          {cart.length > 0 && (
            <div className="flex items-center gap-2 py-1">
              <Checkbox
                id="selectAll"
                checked={isAllSelected}
                onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                className="h-3 w-3"
              />
              <label htmlFor="selectAll" className="text-[10px] font-bold cursor-pointer text-muted-foreground uppercase tracking-widest">
                Select All ({cart.length})
              </label>
            </div>
          )}
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-hidden relative">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/20" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Empty Cart</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4 mt-2 -mr-4">
              <div className="pr-4 space-y-3">
                {cart.map((item) => (
                  /* ✅ Item එකේ උස අඩු කරලා (h-20) දිග වැඩි කළා */
                  <div key={item.id} className="group flex items-center gap-3 bg-muted/20 p-2 rounded-xl border border-transparent hover:border-primary/10 transition-all">
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                      className="h-3.5 w-3.5"
                    />

                    <div className="flex flex-1 gap-3 items-center">
                      {/* ✅ Image එක පොඩි කළා */}
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg border bg-background shadow-sm">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </div>

                      <div className="flex flex-1 items-center justify-between">
                        {/* Title & Author */}
                        <div className="space-y-0.5 max-w-[150px]">
                          <h4 className="font-bold line-clamp-1 text-[11px] uppercase tracking-tighter leading-none">{item.title}</h4>
                          <p className="text-[9px] text-muted-foreground italic truncate">by {item.author}</p>
                          <p className="font-black text-xs text-primary mt-1">
                            LKR {item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* ✅ Quantity Controls - Compact කළා */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg bg-background h-7">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-[10px] font-bold w-5 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addToCart(item)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeItemCompletely(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer section - ✅ Fonts & Button සයිස් අඩු කළා */}
        {cart.length > 0 && (
          <div className="mt-auto pt-4 border-t bg-background">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Selected ({selectedCount})</span>
              <div className="text-right">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase">Subtotal</span>
                <span className="text-xl font-black tracking-tighter text-primary italic leading-none">
                  LKR {totalPrice().toLocaleString()}
                </span>
              </div>
            </div>
            <SheetClose asChild>
              <Button
                className="w-full h-11 text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20"
                onClick={() => navigate("/checkout")}
                disabled={selectedCount === 0}
              >
                Checkout Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
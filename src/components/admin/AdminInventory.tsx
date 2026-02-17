import { useState, useRef, useEffect } from "react";
import { useBookStore } from "@/store/useBookStore";
import {
  Plus, Search, Edit2, Trash2,
  MoreHorizontal, Save, Upload, Image as ImageIcon,
  Check, ChevronsUpDown, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

// Existing Categories for suggestions
const SUGGESTED_CATEGORIES = [
  "Fiction", "Non-Fiction", "Science", "Technology",
  "History", "Biography", "Fantasy", "Mystery",
  "Romance", "Self-Help", "Productivity", "Children",
  "Novels"
];

const AdminInventory = () => {
  const { books, addBook, updateBook, deleteBook, fetchBooks } = useBookStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Extract unique categories from books
  const categories = Array.from(new Set(books.map(book => book.category))).sort();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "", author: "", price: "", originalPrice: "",
    image: "", category: "", stock: "10", discount: "0", isFeatured: false, description: ""
  });

  // "Smart Category" State
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredBooks = books.filter(book => {
    // Search filter
    const matchesSearch = search === "" ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (book: any | null = null) => {
    if (book) {
      setEditingBookId(book.id || book._id);
      setSelectedFile(null); // Reset file on edit
      const discount = book.originalPrice && book.price
        ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
        : 0;

      setFormData({
        title: book.title, author: book.author,
        price: book.price.toString(),
        originalPrice: book.originalPrice?.toString() || (book.price * 1.2).toFixed(0),
        image: book.image,
        category: book.category,
        stock: (book.stock || 20).toString(),
        discount: discount.toString(),
        isFeatured: book.isFeatured || false,
        description: book.description || ""
      });
    } else {
      setEditingBookId(null);
      setSelectedFile(null);
      setFormData({
        title: "", author: "", price: "", originalPrice: "",
        image: "", category: "", stock: "10", discount: "0", isFeatured: false, description: ""
      });
    }
    setIsModalOpen(true);
  };

  // Auto-calculate Price based on Original Price and Discount
  useEffect(() => {
    if (formData.originalPrice && formData.discount) {
      const original = parseFloat(formData.originalPrice);
      const discount = parseFloat(formData.discount);
      if (!isNaN(original) && !isNaN(discount)) {
        const newPrice = original - (original * (discount / 100));
        setFormData(prev => ({ ...prev, price: newPrice.toFixed(0) }));
      }
    }
  }, [formData.originalPrice, formData.discount]);

  const handleSave = async () => {
    // 1. Prepare JSON Data
    const bookDataObj = {
      title: formData.title,
      author: formData.author,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      // image: formData.image, // Backend will set this from Cloudinary URL
      category: formData.category || "Uncategorized",
      stock: Number(formData.stock),
      description: formData.description,
      rating: 4.5,
      soldCount: 0,
      isChoice: false,
      isFeatured: formData.isFeatured,
      keywords: [formData.title.toLowerCase(), formData.category.toLowerCase()]
    };

    if (editingBookId) {
      // For update, currently using JSON. If we want image update, we need similar logic.
      // But prompt asked for Add Book.
      // We can still pass image URL if not updating file.
      await updateBook(editingBookId, { ...bookDataObj, image: formData.image });
    } else {
      // 2. Prepare FormData for Add Book
      const data = new FormData();
      data.append("book", JSON.stringify(bookDataObj));
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      await addBook(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBook(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Inventory</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">Manage books, pricing and stock levels.</p>
        </div>
        <Button onClick={() => handleOpenModal(null)} className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest bg-primary">
          <Plus className="h-5 w-5 mr-2" /> Add Book
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-10 h-12 rounded-2xl bg-background border-none shadow-sm font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[220px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-12 rounded-2xl bg-background border-none shadow-sm font-bold">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="font-bold">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="font-bold">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-none">
                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6">Book</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Author</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Category</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Price</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Store/Stock</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id} className="hover:bg-muted/20 border-muted/10 transition-colors">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={book.image} alt="" className="h-12 w-9 rounded-md object-cover border shadow-sm" />
                      <p className="font-black text-xs uppercase tracking-tight max-w-[120px] truncate">{book.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-[11px] uppercase text-muted-foreground">{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-black uppercase text-[8px] px-3 py-1 rounded-full bg-primary/10 text-primary border-none">
                      {book.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-xs italic text-primary">LKR {book.price.toLocaleString()}</span>
                      {book.originalPrice && (
                        <span className="text-[9px] line-through text-muted-foreground">LKR {book.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${(book.stock || 20) > 5 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="font-bold text-[11px] uppercase">{book.stock || 20} units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-2xl p-2 shadow-2xl border-none">
                        <DropdownMenuItem onClick={() => handleOpenModal(book)} className="gap-3 font-bold uppercase text-[10px] py-3 rounded-xl cursor-pointer">
                          <Edit2 className="h-3.5 w-3.5 text-blue-500" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(book.id)} className="gap-3 font-bold uppercase text-[10px] py-3 rounded-xl text-destructive cursor-pointer">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ✅ Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] font-sans h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
              {editingBookId ? "Edit Inventory Item" : "Add New Inventory"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Image Preview & Upload */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-3xl bg-muted/20 gap-3">
              {formData.image ? (
                <img src={formData.image} className="h-32 w-24 object-cover rounded-xl shadow-lg" alt="Preview" />
              ) : (
                <div className="h-32 w-24 bg-muted rounded-xl flex items-center justify-center text-muted-foreground"><ImageIcon /></div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl font-bold uppercase text-[10px]">
                  <Upload className="h-3 w-3 mr-2" /> Upload File
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Author</Label>
                <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
              </div>

              {/* ✅ Smart Category Selection (Searchable Dropdown) */}
              <div className="space-y-1.5 relative">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Category</Label>
                <div className="relative">
                  <Input
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      setIsCategoryOpen(true);
                    }}
                    onFocus={() => setIsCategoryOpen(true)}
                    className="h-11 rounded-xl bg-muted/50 border-none font-bold pr-10"
                    placeholder="Select or type..."
                  />
                  <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {isCategoryOpen && (
                  <div className="absolute z-50 w-full bg-popover text-popover-foreground shadow-xl rounded-xl border mt-1 max-h-40 overflow-auto p-1 animate-in fade-in zoom-in-95">
                    {SUGGESTED_CATEGORIES.filter(c => c.toLowerCase().includes(formData.category.toLowerCase())).map(category => (
                      <div
                        key={category}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer text-sm font-bold"
                        onClick={() => {
                          setFormData({ ...formData, category: category });
                          setIsCategoryOpen(false);
                        }}
                      >
                        {formData.category === category && <Check className="h-3 w-3 text-primary" />}
                        {category}
                      </div>
                    ))}
                    {formData.category && !SUGGESTED_CATEGORIES.some(c => c.toLowerCase() === formData.category.toLowerCase()) && (
                      <div className="p-2 text-[10px] text-muted-foreground uppercase font-bold text-center">
                        Use "{formData.category}"
                      </div>
                    )}
                    {/* Close on outside check could be added, but minimal version here */}
                    <div
                      className="absolute top-0 right-0 p-1 cursor-pointer"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                    </div>
                  </div>
                )}
                {/* Overlay to close */}
                {isCategoryOpen && <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)}></div>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Original Price (LKR)</Label>
                <Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-none font-bold" placeholder="2500" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Discount %</Label>
                <Input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-none font-bold" placeholder="0" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[80px] rounded-xl bg-muted/50 border-none font-bold p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter book description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Selling Price (Auto)</Label>
                <Input type="number" value={formData.price} readOnly className="h-11 rounded-xl bg-muted/50 border-none font-bold text-primary" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Store / Stock</Label>
                <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isFeatured" className="text-sm font-bold uppercase tracking-wide cursor-pointer">Add to Featured Books</Label>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-primary shadow-lg shadow-primary/30">
              <Save className="mr-2 h-4 w-4" /> {editingBookId ? "Update Stock" : "Add to Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInventory;
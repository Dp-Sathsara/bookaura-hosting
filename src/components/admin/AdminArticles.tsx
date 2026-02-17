import { useState, useEffect } from "react";
import { ArticleService, type Article } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const AdminArticles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        imageUrl: "",
        author: "Admin", // Default author
        // status: "published" as "published" | "draft" // Status not in Article interface yet, removing for now or handling if backend adds it
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const data = await ArticleService.getAll();
            setArticles(data);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
            toast.error("Failed to fetch articles");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (article?: Article) => {
        if (article) {
            setEditingArticle(article);
            setFormData({
                title: article.title,
                content: article.content,
                imageUrl: article.imageUrl || "",
                author: article.author,
            });
        } else {
            setEditingArticle(null);
            setFormData({ title: "", content: "", imageUrl: "", author: "Admin" });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingArticle) {
                await ArticleService.update(editingArticle.id, formData);
                toast.success("Article updated");
            } else {
                await ArticleService.create(formData);
                toast.success("Article created");
            }
            setIsDialogOpen(false);
            fetchArticles();
        } catch (error) {
            console.error("Failed to save article:", error);
            toast.error("Failed to save article");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this article?")) {
            try {
                await ArticleService.delete(id);
                toast.success("Article deleted");
                fetchArticles();
            } catch (error) {
                console.error("Failed to delete article:", error);
                toast.error("Failed to delete article");
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tight">Articles</h1>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> New Article
                </Button>
            </div>

            <div className="bg-card rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                            </TableRow>
                        ) : articles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell>
                                    <div className="h-10 w-16 bg-muted rounded overflow-hidden">
                                        {article.imageUrl ? (
                                            <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground"><ImageIcon className="h-4 w-4" /></div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell>{article.author}</TableCell>
                                <TableCell>{article.publishedDate || article.createdAt || 'N/A'}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => handleOpenDialog(article)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(article.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!loading && articles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No articles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingArticle ? "Edit Article" : "Create Article"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Article Title"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Author</label>
                                <Input
                                    required
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Author Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URL</label>
                                <Input
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <Textarea
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your article here..."
                                className="min-h-[200px]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingArticle ? "Update" : "Publish"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminArticles;

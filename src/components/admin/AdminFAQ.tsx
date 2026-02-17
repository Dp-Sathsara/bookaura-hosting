import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { FAQService, type FAQ } from "@/services/api"; // Updated import

const AdminFAQ = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentFaq, setCurrentFaq] = useState<Partial<FAQ>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const data = await FAQService.getAll();
            setFaqs(data);
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!currentFaq.question || !currentFaq.answer) return;

        try {
            setLoading(true);
            if (currentFaq.id) {
                await FAQService.update(currentFaq.id, currentFaq as FAQ); // Cast to FAQ as id exists
            } else {
                await FAQService.create(currentFaq as Omit<FAQ, 'id'>); // Cast for creation
            }
            setIsDialogOpen(false);
            setCurrentFaq({});
            fetchFaqs();
        } catch (error) {
            console.error("Failed to save FAQ:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this FAQ?")) {
            try {
                setLoading(true);
                await FAQService.delete(id);
                fetchFaqs();
            } catch (error) {
                console.error("Failed to delete FAQ:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const openEdit = (faq: FAQ) => {
        setCurrentFaq(faq);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-[2rem] shadow-sm border border-border">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">FAQ Management</h2>
                    <p className="text-muted-foreground font-medium mt-1">Manage frequently asked questions</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl h-12 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:translate-y-0.5 transition-all" onClick={() => setCurrentFaq({})}>
                            <Plus className="mr-2 h-5 w-5" /> New Question
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none p-8 font-sans">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-center mb-4">
                                {currentFaq.id ? "Edit Question" : "New Question"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Input
                                    id="question"
                                    placeholder="Question"
                                    value={currentFaq.question || ""}
                                    onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                                    className="rounded-xl h-12 font-bold focus-visible:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    id="answer"
                                    placeholder="Answer"
                                    value={currentFaq.answer || ""}
                                    onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                                    className="rounded-xl min-h-[100px] font-medium focus-visible:ring-primary resize-none"
                                />
                            </div>
                            <Button onClick={handleSubmit} disabled={loading} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-lg shadow-lg hover:translate-y-0.5 transition-all">
                                {loading ? "Saving..." : "Save Answer"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-card">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6 w-1/3">Question</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest w-1/2">Answer</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && faqs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
                                </TableRow>
                            ) : faqs.map((faq) => (
                                <TableRow key={faq.id} className="hover:bg-muted/20 border-muted/10 transition-colors group">
                                    <TableCell className="pl-8 py-5 font-bold align-top">
                                        <div className="flex gap-3">
                                            <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            {faq.question}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 text-muted-foreground text-sm leading-relaxed align-top">
                                        {faq.answer}
                                    </TableCell>
                                    <TableCell className="text-right pr-8 align-top py-5">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(faq)} className="rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} className="rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && faqs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground font-medium italic">No FAQs found. Add one to get started.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminFAQ;

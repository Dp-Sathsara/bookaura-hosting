import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MessageSquare } from "lucide-react";
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
import { MessageService, type Message } from "@/services/api";

const AdminMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<Partial<Message>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await MessageService.getAll();
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!currentMessage.title || !currentMessage.content) return;

        try {
            setLoading(true);
            if (currentMessage.id) {
                await MessageService.update(currentMessage.id, currentMessage as Message); // Cast to Message as it must have an ID for update
            } else {
                await MessageService.create(currentMessage as Message); // Cast to Message as it must be complete for creation
            }
            setIsDialogOpen(false);
            setCurrentMessage({});
            fetchMessages();
        } catch (error) {
            console.error("Failed to save message:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                setLoading(true);
                await MessageService.delete(id);
                fetchMessages();
            } catch (error) {
                console.error("Failed to delete message:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const openEdit = (message: Message) => {
        setCurrentMessage(message);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-[2rem] shadow-sm border border-border">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">Announcements</h2>
                    <p className="text-muted-foreground font-medium mt-1">Manage system-wide messages</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl h-12 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:translate-y-0.5 transition-all" onClick={() => setCurrentMessage({})}>
                            <Plus className="mr-2 h-5 w-5" /> New Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none p-8 font-sans">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-center mb-4">
                                {currentMessage.id ? "Edit Announcement" : "New Announcement"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Input
                                    id="title"
                                    placeholder="Title / Headline"
                                    value={currentMessage.title || ""}
                                    onChange={(e) => setCurrentMessage({ ...currentMessage, title: e.target.value })}
                                    className="rounded-xl h-12 font-bold focus-visible:ring-primary text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    id="content"
                                    placeholder="Message content..."
                                    value={currentMessage.content || ""}
                                    onChange={(e) => setCurrentMessage({ ...currentMessage, content: e.target.value })}
                                    className="rounded-xl min-h-[150px] font-medium focus-visible:ring-primary resize-none p-4"
                                />
                            </div>
                            <Button onClick={handleSubmit} disabled={loading} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-lg shadow-lg hover:translate-y-0.5 transition-all">
                                {loading ? "Publishing..." : "Publish Message"}
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
                                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6 w-1/4">Title</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest w-1/2">Content</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Date</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
                                </TableRow>
                            ) : messages.map((msg) => (
                                <TableRow key={msg.id} className="hover:bg-muted/20 border-muted/10 transition-colors group">
                                    <TableCell className="pl-8 py-5 font-bold align-top">
                                        <div className="flex gap-3">
                                            <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
                                            <span className="text-lg leading-tight">{msg.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 text-muted-foreground text-sm leading-relaxed align-top">
                                        {msg.content.substring(0, 100)}...
                                    </TableCell>
                                    <TableCell className="py-5 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest align-top">
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right pr-8 align-top py-5">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(msg)} className="rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)} className="rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && messages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground font-medium italic">No announcements posted yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminMessages;

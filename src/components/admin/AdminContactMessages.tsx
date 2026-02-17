import { useState, useEffect } from "react";
import { ContactService, type ContactMessage } from "@/services/api";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MessageSquare, Reply, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const AdminContactMessages = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
    const [adminReply, setAdminReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await ContactService.getAllAdmin();
            // Sort by date descending
            setMessages(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error("Failed to fetch contact messages:", error);
            toast.error("Failed to fetch contact messages");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyingTo || !adminReply.trim()) return;

        try {
            setIsSubmitting(true);
            await ContactService.replyAdmin(replyingTo.id, adminReply);
            toast.success("Reply sent successfully", {
                description: `Email dispatched to ${replyingTo.email}`
            });
            setReplyingTo(null);
            setAdminReply("");
            fetchMessages();
        } catch (error) {
            console.error("Failed to send reply:", error);
            toast.error("Failed to send reply");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this inquiry?")) {
            try {
                await ContactService.deleteAdmin(id);
                toast.success("Message deleted permanently");
                fetchMessages();
            } catch (error) {
                console.error("Failed to delete message:", error);
                toast.error("Failed to delete message");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-card p-6 rounded-[2rem] shadow-sm border border-border">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">Inquiries</h2>
                    <p className="text-muted-foreground font-medium mt-1">Manage user messages and feedback</p>
                </div>
                <div className="flex gap-4">
                    <Card className="rounded-2xl border-none shadow-none bg-blue-50/50 px-4 py-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                            {messages.filter(m => m.status === 'PENDING').length} Pending
                        </span>
                    </Card>
                </div>
            </div>

            {/* Messages Table */}
            <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-card">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6">User / Date</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest">Inquiry Details</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Synchronizing...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : messages.map((msg) => (
                                <TableRow key={msg.id} className="hover:bg-muted/20 border-muted/10 transition-colors group">
                                    <TableCell className="pl-8 py-6 align-top">
                                        <div className="space-y-1">
                                            <div className="font-black uppercase text-xs tracking-tight">{msg.name}</div>
                                            <div className="text-muted-foreground text-xs font-medium flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {msg.email}
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 align-top max-w-md">
                                        <div className="space-y-2">
                                            <h4 className="font-black text-sm uppercase italic text-primary leading-tight">{msg.subject}</h4>
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-3">
                                                {msg.message}
                                            </p>
                                            {msg.adminReply && (
                                                <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 relative">
                                                    <span className="absolute -top-2 left-4 px-2 bg-background border border-primary/20 text-[8px] font-black uppercase tracking-widest text-primary rounded-full">Admin Reply</span>
                                                    <p className="text-xs font-bold text-foreground italic">"{msg.adminReply}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 text-center align-top">
                                        {msg.status === 'REPLIED' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 className="h-3 w-3" /> Replied
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest">
                                                <Clock className="h-3 w-3" /> Pending
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-8 align-top py-6">
                                        <div className="flex justify-end gap-2">
                                            {msg.status === 'PENDING' && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setReplyingTo(msg)}
                                                    className="rounded-xl font-black uppercase tracking-widest text-[10px] h-9 px-4 shadow-sm"
                                                >
                                                    <Reply className="mr-2 h-3.5 w-3.5" /> Reply
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(msg.id)}
                                                className="rounded-xl h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && messages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center">
                                                <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                            <p className="text-muted-foreground font-black uppercase text-xs tracking-widest">No Inbox Activity</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Reply Modal */}
            <Dialog open={!!replyingTo} onOpenChange={(open) => !open && setReplyingTo(null)}>
                <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none p-10 font-sans shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-center mb-6">
                            Compose <span className="text-primary italic">Reply</span>
                        </DialogTitle>
                    </DialogHeader>
                    {replyingTo && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-muted/30 border border-muted/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary">{replyingTo.name[0]}</div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-tight">{replyingTo.name}</h4>
                                            <p className="text-[10px] font-bold text-muted-foreground">{replyingTo.email}</p>
                                        </div>
                                    </div>
                                    <div className="bg-background/50 p-3 rounded-xl border border-muted/30 mt-3 font-medium text-sm italic text-muted-foreground leading-relaxed">
                                        "{replyingTo.message}"
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Response</label>
                                    <Textarea
                                        value={adminReply}
                                        onChange={(e) => setAdminReply(e.target.value)}
                                        placeholder="Address the user's inquiry here..."
                                        className="min-h-[200px] rounded-3xl p-6 bg-muted/10 border-muted/50 focus-visible:ring-primary/30 font-bold text-md resize-none shadow-inner"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleReply}
                                disabled={isSubmitting || !adminReply.trim()}
                                className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-md shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-3 border-t-white border-white/30 rounded-full animate-spin" />
                                        Mailing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Send className="h-5 w-5" />
                                        Send Message
                                    </div>
                                )}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Add Send icon since it's used in the modal button
import { Send } from "lucide-react";

export default AdminContactMessages;


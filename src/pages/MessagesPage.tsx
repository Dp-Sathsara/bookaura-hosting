import { useState, useEffect } from "react";
import { type Message, MessageService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const MessagesPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await MessageService.getAll();
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="container mx-auto px-4 py-16 font-sans min-h-screen">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground">
                        Latest News
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
                        Stay updated with announcements, events, and important information.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-muted-foreground py-10">Loading Updates...</div>
                ) : (
                    <div className="grid gap-6">
                        {messages.map((msg) => (
                            <Card
                                key={msg.id}
                                className="group border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card overflow-hidden rounded-[2rem]"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Date Column (Desktop) */}
                                    <div className="hidden md:flex flex-col items-center justify-center p-6 bg-primary/5 min-w-[120px] border-r border-primary/5">
                                        <span className="text-3xl font-black text-primary">{new Date(msg.createdAt).getDate()}</span>
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                            {new Date(msg.createdAt).toLocaleString('default', { month: 'short' })}
                                        </span>
                                    </div>

                                    <div className="flex-1 p-6 md:p-8">
                                        <div className="flex items-center gap-3 mb-3 md:hidden">
                                            <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </Badge>
                                        </div>

                                        <CardHeader className="p-0 mb-3">
                                            <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                                                {msg.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                {msg.content}
                                            </p>
                                        </CardContent>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && messages.length === 0 && (
                    <div className="text-center text-muted-foreground italic">No news updates at the moment.</div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;



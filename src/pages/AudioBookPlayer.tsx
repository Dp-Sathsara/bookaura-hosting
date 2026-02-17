import React, { useState } from "react";
import { Headphones, Upload, Play, Loader2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AudioBookPlayer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAudioUrl(null);
        }
    };

    const handleConvert = async () => {
        if (!file) {
            toast.error("Please select a PDF file first");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8080/api/audio/convert", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                toast.success("Audio conversion successful!");
            } else {
                const errorData = await response.text();
                console.error("Backend error:", errorData);
                toast.error(`Failed: ${errorData || "Check your API key or character limit"}`);
            }
        } catch (error) {
            console.error("Error converting audio:", error);
            toast.error("An error occurred during conversion. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <Headphones className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
                    Audio <span className="text-primary">Books</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Transform your PDF books into high-quality AI-generated speech using ElevenLabs technology.
                </p>
            </div>

            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Upload className="h-6 w-6 text-primary" />
                        Convert Your PDF
                    </CardTitle>
                    <CardDescription>
                        Upload a PDF file to generate an audio version of its content.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Input
                            id="pdf-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="bg-muted/30 border-2 border-dashed border-muted-foreground/20 h-24 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors rounded-2xl"
                        />
                        {file && (
                            <p className="text-sm font-medium text-primary flex items-center gap-2 mt-2">
                                <Play className="h-4 w-4" /> Selected: {file.name}
                            </p>
                        )}
                    </div>

                    <Button
                        onClick={handleConvert}
                        disabled={loading || !file}
                        className="w-full h-14 text-lg font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Converting...
                            </>
                        ) : (
                            <>
                                <Music className="mr-2 h-5 w-5" />
                                Generate Audio
                            </>
                        )}
                    </Button>

                    {audioUrl && (
                        <div className="mt-10 p-6 bg-primary/5 rounded-[1.5rem] border border-primary/10 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Play className="h-5 w-5 text-primary" />
                                Ready to Listen
                            </h3>
                            <audio controls className="w-full h-12 rounded-full shadow-inner">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Premium AI Voice", desc: "Experience lifelike narration with ElevenLabs' most advanced voices.", icon: Headphones },
                    { title: "Any PDF", desc: "Upload articles, short stories, or book chapters in PDF format.", icon: Upload },
                    { title: "Listen Anywhere", desc: "Download the generated audio or play directly in your browser.", icon: Music }
                ].map((feature, i) => (
                    <div key={i} className="p-6 bg-muted/20 rounded-[1.5rem] border border-border/50">
                        <feature.icon className="h-8 w-8 text-primary mb-3" />
                        <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AudioBookPlayer;

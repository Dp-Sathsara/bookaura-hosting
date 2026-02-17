import { useState, useEffect } from "react";
import { type FAQ, FAQService } from "@/services/api";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await FAQService.getAll();
                setFaqs(data);
            } catch (error) {
                console.error("Failed to fetch FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <div className="container mx-auto px-4 py-16 font-sans min-h-screen">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground">
                        Questions?
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
                        Everything you need to know about our books, shipping, and services.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-muted-foreground py-10">Loading FAQs...</div>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq) => (
                            <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                className="border border-muted/20 rounded-[1.5rem] px-6 py-2 shadow-sm bg-card hover:shadow-md transition-all duration-300"
                            >
                                <AccordionTrigger className="text-lg font-bold hover:no-underline text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                {!loading && faqs.length === 0 && (
                    <div className="text-center text-muted-foreground italic">No questions have been added yet.</div>
                )}
            </div>
        </div>
    );
};

export default FAQPage;

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authFetch, CHAT } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isError?: boolean;
}

interface AIChatProps {
    runId: string;
    className?: string;
}

export interface AIChatRef {
    sendMessage: (text: string) => void;
}

export const AIChat = forwardRef<AIChatRef, AIChatProps>(({ runId, className }, ref) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'ai',
            content: "Hello! I'm your AI Copilot. I've analyzed these logs. Ask me anything about the failure!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async (text: string) => {
        const messageText = text.trim();
        if (!messageText || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            // Prepare history for API
            // Use a functional update for messages to ensure we get the latest state
            // when preparing history, especially if sendMessage is called externally.
            let currentMessages: Message[] = [];
            setMessages(prev => {
                currentMessages = [...prev, userMsg]; // Include the new user message for history
                return currentMessages;
            });

            const history = currentMessages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await authFetch(CHAT.SEND, {
                method: 'POST',
                body: JSON.stringify({
                    runId,
                    message: userMsg.content,
                    history
                })
            });

            if (!res.ok) throw new Error('Failed to send message');

            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Sorry, I encountered an error extracting insights from the logs. Please try again.",
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        sendMessage
    }));

    const handleSend = () => {
        sendMessage(input);
        setInput("");
    };

    return (
        <Card className={cn("flex flex-col h-full border-l rounded-none", className)}>
            <CardHeader className="px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <div>
                        <CardTitle className="text-lg">AI Copilot</CardTitle>
                        <CardDescription className="text-xs">Powered by Gemini & RAG</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden relative bg-muted/20">
                <ScrollArea className="h-full px-4 py-4">
                    <div className="flex flex-col gap-4 min-h-0 pb-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <Avatar className="w-8 h-8 mt-0.5 border">
                                    {msg.role === 'user' ? (
                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                    ) : (
                                        <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                                    )}
                                </Avatar>

                                <div
                                    className={cn(
                                        "rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background border border-border text-foreground",
                                        msg.isError && "bg-destructive/10 border-destructive/50 text-destructive"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 mr-auto max-w-[85%] animate-fade-in">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarFallback className="bg-primary/10"><Bot className="w-4 h-4" /></AvatarFallback>
                                </Avatar>
                                <div className="bg-background border border-border rounded-lg p-3 flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-xs text-muted-foreground">Analyzing logs...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-3 border-t bg-background">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex w-full items-center gap-2"
                >
                    <Input
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
});

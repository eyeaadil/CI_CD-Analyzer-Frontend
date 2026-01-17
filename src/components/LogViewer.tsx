import { useState } from "react";
import {
    Sparkles,
    Copy,
    Terminal,
    Search,
    MoreVertical,
    Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LogChunk {
    id: number;
    index: number;
    stepName: string;
    content: string;
    hasErrors: boolean;
    startLine: number;
}

interface LogViewerProps {
    logs: LogChunk[];
    onAskAI: (text: string) => void;
    className?: string;
}

export function LogViewer({ logs, onAskAI, className }: LogViewerProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Flatten logs into lines for easier rendering/searching
    const allLines = logs.flatMap(chunk => {
        return chunk.content.split('\n').map((line, i) => ({
            chunkId: chunk.id,
            stepName: chunk.stepName,
            lineNumber: (chunk.startLine || 1) + i, // Safety fallback for startLine
            content: line,
            isError: chunk.hasErrors,
            raw: line
        }));
    });

    const filteredLines = searchTerm
        ? allLines.filter(l => l.content.toLowerCase().includes(searchTerm.toLowerCase()))
        : allLines;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className={cn("flex flex-col h-full bg-[#0a0a0a] border rounded-lg overflow-hidden font-mono text-sm", className)}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-medium">Build Logs</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-7 w-48 pl-8 bg-black/50 border-border/40 text-xs focus-visible:ring-1"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Logs Area */}
            <ScrollArea className="flex-1">
                <div className="min-w-full inline-block pb-4">
                    {filteredLines.length > 0 ? (
                        filteredLines.map((line, idx) => (
                            <div
                                key={`${line.chunkId}-${idx}`}
                                className={cn(
                                    "group flex hover:bg-white/5 transition-colors cursor-text min-h-[1.5em]",
                                    line.isError && "bg-destructive/5 hover:bg-destructive/10"
                                )}
                            >
                                {/* Line Number */}
                                <div className="w-12 shrink-0 text-right pr-3 select-none text-muted-foreground/50 text-[10px] py-0.5 border-r border-white/5 mr-2">
                                    {line.lineNumber}
                                </div>

                                {/* Content */}
                                <div className="flex-1 whitespace-pre-wrap break-all py-0.5 pr-2 relative text-gray-300">
                                    <span className={cn(line.isError && "text-red-400")}>
                                        {line.content || "\n"}
                                    </span>

                                    {/* Hover Actions */}
                                    <div className="absolute right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#0a0a0a] border border-border/40 rounded shadow-sm">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <MoreVertical className="w-3 h-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => onAskAI(`Can you explain this log line?\n\n\`\`\`\n${line.content}\n\`\`\``)}>
                                                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                                                    Ask AI
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleCopy(line.content)}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy Line
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem disabled>
                                                    Go to Step: {line.stepName}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground text-xs italic">
                            {logs.length === 0 ? "No logs available" : "No matches found"}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

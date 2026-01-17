import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAPI, RUNS } from "@/lib/api";
import { AppSidebar } from "@/components/AppSidebar";
import { AIChat, AIChatRef } from "@/components/AIChat";
import { LogViewer } from "@/components/LogViewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RunDetail {
    id: number;
    workflowName: string;
    status: string;
    branch: string;
    commitSha: string;
    repo: { fullName: string };
    analysis: {
        rootCause: string;
        suggestedFix: string;
        priority: number;
        failureType: string;
    } | null;
}

interface LogChunk {
    id: number;
    index: number;
    stepName: string;
    content: string;
    hasErrors: boolean;
    startLine: number;
}

export default function RunDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [run, setRun] = useState<RunDetail | null>(null);
    const [logs, setLogs] = useState<LogChunk[]>([]);
    const [loading, setLoading] = useState(true);
    const aiChatRef = useRef<AIChatRef>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch run details
                const runData: RunDetail = await fetchAPI(RUNS.GET(id));
                setRun(runData);

                // Fetch logs
                const logsData = await fetchAPI<{ chunks: LogChunk[] }>(RUNS.LOGS(id));
                setLogs(logsData.chunks);

            } catch (error) {
                console.error("Failed to load run details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAskAI = (text: string) => {
        if (aiChatRef.current) {
            aiChatRef.current.sendMessage(text);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-background text-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!run) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <h2 className="text-xl font-semibold">Run not found</h2>
                <Button onClick={() => navigate('/incidents')}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full bg-background overflow-hidden h-screen">
            <AppSidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="px-6 py-3 border-b border-border flex items-center justify-between shrink-0 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold flex items-center gap-2">
                                {run.workflowName}
                                <Badge variant={run.status === "failure" ? "destructive" : "outline"}>
                                    {run.status}
                                </Badge>
                            </h1>
                            <p className="text-xs text-muted-foreground flex gap-3">
                                <span className="font-mono">{run.repo.fullName}</span>
                                <span>•</span>
                                <span className="font-mono">{run.branch}</span>
                                <span>•</span>
                                <span className="font-mono">{run.commitSha.substring(0, 7)}</span>
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content - Split View */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left: Logs & Analysis */}
                    <div className="flex-1 flex flex-col overflow-hidden min-w-0 border-r border-border">

                        {/* Static Analysis Card (if available) */}
                        {run.analysis && (
                            <div className="p-4 bg-muted/10 border-b shrink-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1 text-destructive font-medium text-sm">
                                            <AlertTriangle className="w-4 h-4" /> Root Cause
                                        </div>
                                        <p className="text-sm opacity-90 line-clamp-2">{run.analysis.rootCause}</p>
                                    </div>
                                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1 text-success font-medium text-sm">
                                            <CheckCircle2 className="w-4 h-4" /> Suggested Fix
                                        </div>
                                        <p className="text-sm opacity-90 line-clamp-2">{run.analysis.suggestedFix}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Logs Viewer (Advanced) */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <LogViewer logs={logs} onAskAI={handleAskAI} />
                        </div>
                    </div>

                    {/* Right: AI Chat */}
                    <div className="w-[400px] shrink-0 h-full bg-card">
                        <AIChat ref={aiChatRef} runId={id!} />
                    </div>
                </div>
            </main>
        </div>
    );
}

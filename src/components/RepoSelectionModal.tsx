/**
 * RepoSelectionModal
 * 
 * Modal for selecting which GitHub repositories to import.
 * Shows a searchable list with checkboxes.
 * Shows "Connect GitHub" UI if user hasn't connected their GitHub account.
 */

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, FolderGit2, Lock, Globe, CheckCircle2, Github, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvailableRepo } from "@/hooks/useRepos";
import { AUTH } from "@/lib/api";

interface RepoSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    repos: AvailableRepo[];
    loading: boolean;
    onImport: (repos: AvailableRepo[]) => Promise<void>;
    onFetch: () => Promise<AvailableRepo[] | void>;
    githubConnected: boolean | null; // null = unknown, true = connected, false = not connected
}

export function RepoSelectionModal({
    open,
    onOpenChange,
    repos,
    loading,
    onImport,
    onFetch,
    githubConnected,
}: RepoSelectionModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
    const [importing, setImporting] = useState(false);

    // Fetch repos when modal opens
    useEffect(() => {
        if (open) {
            onFetch();
            setSelectedRepos(new Set());
            setSearchQuery("");
        }
    }, [open, onFetch]);

    // Filter repos based on search
    const filteredRepos = useMemo(() => {
        if (!searchQuery.trim()) return repos;
        const query = searchQuery.toLowerCase();
        return repos.filter(
            repo =>
                repo.name.toLowerCase().includes(query) ||
                repo.owner.toLowerCase().includes(query) ||
                repo.fullName.toLowerCase().includes(query)
        );
    }, [repos, searchQuery]);

    // Get only unsynced repos for selection
    const unsyncedRepos = filteredRepos.filter(r => !r.alreadySynced);
    const syncedRepos = filteredRepos.filter(r => r.alreadySynced);

    const toggleRepo = (githubId: string) => {
        const newSelected = new Set(selectedRepos);
        if (newSelected.has(githubId)) {
            newSelected.delete(githubId);
        } else {
            newSelected.add(githubId);
        }
        setSelectedRepos(newSelected);
    };

    const toggleAll = () => {
        if (selectedRepos.size === unsyncedRepos.length) {
            setSelectedRepos(new Set());
        } else {
            setSelectedRepos(new Set(unsyncedRepos.map(r => r.githubId)));
        }
    };

    const handleImport = async () => {
        if (selectedRepos.size === 0) return;

        setImporting(true);
        try {
            const reposToImport = repos.filter(r => selectedRepos.has(r.githubId));
            await onImport(reposToImport);
            onOpenChange(false);
        } catch (error) {
            console.error("Import failed:", error);
        } finally {
            setImporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5" />
                        {githubConnected === false ? "Connect GitHub" : "Select Repositories to Import"}
                    </DialogTitle>
                </DialogHeader>

                {/* Show Connect GitHub UI if not connected */}
                {githubConnected === false ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                            <Link2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            GitHub Connection Required
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md">
                            To import repositories, you need to connect your GitHub account.
                            This will link GitHub to your existing account.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => {
                                // Get token from localStorage and redirect to link endpoint
                                const token = localStorage.getItem('auth_token');
                                if (token) {
                                    window.location.href = `${AUTH.GITHUB_LINK}?token=${encodeURIComponent(token)}`;
                                } else {
                                    // Fallback to regular GitHub login if no token
                                    window.location.href = AUTH.GITHUB_LOGIN;
                                }
                            }}
                        >
                            <Github className="w-5 h-5 mr-2" />
                            Connect GitHub Account
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                            Your GitHub account will be linked to your current login.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search repositories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                        </div>

                        {/* Repo List */}
                        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[400px] border border-border rounded-lg">
                            {loading || githubConnected === null ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-2 text-muted-foreground">Loading repositories...</span>
                                </div>
                            ) : filteredRepos.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    {searchQuery ? "No repositories match your search" : "No repositories found"}
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {/* Select All Header */}
                                    {unsyncedRepos.length > 0 && (
                                        <div className="px-4 py-3 bg-card border-b border-border flex items-center justify-between sticky top-0 z-10">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="select-all"
                                                    checked={selectedRepos.size === unsyncedRepos.length && unsyncedRepos.length > 0}
                                                    onCheckedChange={toggleAll}
                                                />
                                                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                                    Select All ({unsyncedRepos.length} available)
                                                </label>
                                            </div>
                                            <Badge variant="secondary">{selectedRepos.size} selected</Badge>
                                        </div>
                                    )}

                                    {/* Unsynced Repos */}
                                    {unsyncedRepos.map((repo) => (
                                        <div
                                            key={repo.githubId}
                                            className={cn(
                                                "px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors cursor-pointer",
                                                selectedRepos.has(repo.githubId) && "bg-primary/5"
                                            )}
                                            onClick={() => toggleRepo(repo.githubId)}
                                        >
                                            <Checkbox
                                                checked={selectedRepos.has(repo.githubId)}
                                                onCheckedChange={() => toggleRepo(repo.githubId)}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground truncate">
                                                        {repo.name}
                                                    </span>
                                                    {repo.isPrivate ? (
                                                        <Lock className="w-3 h-3 text-warning flex-shrink-0" />
                                                    ) : (
                                                        <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {repo.owner}
                                                    {repo.description && ` · ${repo.description}`}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Already Synced Repos */}
                                    {syncedRepos.length > 0 && (
                                        <>
                                            <div className="px-4 py-2 bg-card border-b border-border text-xs text-muted-foreground font-medium sticky top-[52px] z-10">
                                                Already Imported ({syncedRepos.length})
                                            </div>
                                            {syncedRepos.map((repo) => (
                                                <div
                                                    key={repo.githubId}
                                                    className="px-4 py-3 flex items-center gap-3 opacity-60"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-foreground truncate">
                                                                {repo.name}
                                                            </span>
                                                            {repo.isPrivate ? (
                                                                <Lock className="w-3 h-3 text-warning flex-shrink-0" />
                                                            ) : (
                                                                <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {repo.owner}
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">Imported</Badge>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleImport}
                                disabled={selectedRepos.size === 0 || importing}
                            >
                                {importing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    `Import ${selectedRepos.size} ${selectedRepos.size === 1 ? 'Repository' : 'Repositories'}`
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default RepoSelectionModal;

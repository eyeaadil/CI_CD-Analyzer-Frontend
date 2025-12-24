import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    UserPlus,
    Mail,
    Shield,
    MoreVertical,
    Search,
    Crown,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: "owner" | "admin" | "member" | "viewer";
    avatar?: string;
    joinedAt: string;
    lastActive?: string;
}

// Current user's team members (would come from API)
const teamMembers: TeamMember[] = [
    {
        id: "1",
        name: "You",
        email: "you@example.com",
        role: "owner",
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
    },
];

const roleConfig = {
    owner: { label: "Owner", color: "bg-primary/20 text-primary", icon: Crown },
    admin: { label: "Admin", color: "bg-warning/20 text-warning", icon: Shield },
    member: { label: "Member", color: "bg-success/20 text-success", icon: Users },
    viewer: { label: "Viewer", color: "bg-muted text-muted-foreground", icon: Users },
};

function MemberCard({ member, delay }: { member: TeamMember; delay: number }) {
    const role = roleConfig[member.role];
    const RoleIcon = role.icon;

    return (
        <div
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300 animate-fade-in group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{member.name}</h4>
                            <Badge className={cn("text-[10px]", role.color)}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {role.label}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {member.email}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

const Team = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);

    const filteredMembers = teamMembers.filter(member => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            member.name.toLowerCase().includes(query) ||
            member.email.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-5 h-5 text-primary" />
                            <h1 className="text-xl font-bold text-foreground">Team</h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Manage your team members and their access permissions.
                        </p>
                    </div>
                    <Button onClick={() => setShowInviteModal(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Member
                    </Button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="stat-card animate-fade-in">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
                                    <p className="text-xs text-muted-foreground">Total Members</p>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: "100ms" }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-warning/10">
                                    <Shield className="w-5 h-5 text-warning" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {teamMembers.filter(m => m.role === "admin" || m.role === "owner").length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Admins</p>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-success/10">
                                    <Users className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {teamMembers.filter(m => m.role === "member").length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Members</p>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: "300ms" }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">0</p>
                                    <p className="text-xs text-muted-foreground">Pending Invites</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search team members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Team Members ({filteredMembers.length})
                        </h2>
                        {filteredMembers.length === 0 ? (
                            <div className="text-center py-16">
                                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">No members found</h3>
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery ? "Try adjusting your search query." : "Invite team members to get started."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredMembers.map((member, index) => (
                                    <MemberCard key={member.id} member={member} delay={index * 100} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Settings className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Team Features Coming Soon</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Team collaboration features are under development. Soon you'll be able to:
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Invite team members with email</li>
                                    <li>Set role-based permissions (Admin, Member, Viewer)</li>
                                    <li>Share repositories across the team</li>
                                    <li>Collaborate on incident resolution</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Invite Modal Placeholder */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full mx-4">
                        <h2 className="text-lg font-semibold mb-4">Invite Team Member</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Team invitations feature is coming soon. Stay tuned!
                        </p>
                        <Button onClick={() => setShowInviteModal(false)} className="w-full">
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;

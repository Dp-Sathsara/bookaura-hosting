import { useState, useEffect } from "react";
import { UserService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Trash2, ShieldCheck, UserMinus, UserCheck, Search, Mail, Calendar, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Define User interface locally to match API response if needed, 
// but using the one from API usually better.
// However, the component needs to handle the local state.

interface User {
  id: string;
  username?: string;
  email: string;
  role: string;
  provider?: string;
  // status is not in backend yet, so we might simulate or ignore it
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    try {
      await UserService.updateRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await UserService.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user =>
  (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans p-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">User Management</h1>
        <p className="text-muted-foreground font-medium text-sm">Oversee your customer base and administrative roles.</p>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 h-12 rounded-2xl bg-background border-none shadow-sm font-bold focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="font-black px-4 py-2 border-primary/20 text-primary uppercase tracking-widest text-xs hidden md:block">
          {users.length} Registered Users
        </Badge>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6">User Info</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Provider</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Role</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">Loading users...</TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No users found.</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/20 border-muted/10 transition-colors group border-b border-muted/20">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm border border-primary/5">
                          {(user.username || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black text-sm uppercase tracking-tight leading-none">
                            {user.username || "No Username"}
                            {currentUser?.id === user.id && (
                              <Badge variant="secondary" className="ml-2 text-[8px] h-4">YOU</Badge>
                            )}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {user.provider || "local"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge className={`${user.role === 'ADMIN' ? 'bg-purple-500 shadow-purple-200' : 'bg-blue-500 shadow-blue-200'} text-white border-none font-black uppercase text-[8px] px-3 py-1 rounded-full tracking-widest shadow-lg`}>
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 font-sans rounded-[1.5rem] p-2 border-none shadow-2xl animate-in zoom-in-95">
                          <div className="px-3 py-2 text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-50">Manage Access</div>

                          <DropdownMenuItem
                            onClick={() => handleRoleUpdate(user.id, user.role)}
                            disabled={currentUser?.id === user.id}
                            className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-primary/10"
                          >
                            <ShieldCheck className="h-4 w-4 text-primary" /> {user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-muted/50" />

                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={currentUser?.id === user.id}
                            className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" /> Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
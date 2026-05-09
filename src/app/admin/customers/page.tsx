"use client";

import { useEffect, useState, useMemo } from "react";
import { getCustomers, updateCustomer } from "@/lib/actions/admin";
import { Customer } from "@/lib/types/firestore";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Users } from "lucide-react";
import { toast } from "sonner";

type SortKey = "email" | "phone_number" | "role" | "business_id";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
  return dir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-primary" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-primary" />;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("email");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Customer["role"]>("customer");
  const [businessId, setBusinessId] = useState("");
  const [crmNotes, setCrmNotes] = useState("");

  useEffect(() => {
    getCustomers().then(data => {
      setCustomers(data as Customer[]);
      setLoading(false);
    });
  }, []);

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  function openCustomer(c: Customer) {
    setSelected(c);
    setEmail(c.email || "");
    setPhone(c.phone_number || "");
    setRole(c.role || "customer");
    setBusinessId(c.business_id || "");
    setCrmNotes(c.crm_notes || "");
  }

  const sorted = useMemo(() => {
    return [...customers].sort((a, b) => {
      const av = (String(a[sortBy] ?? "")).toLowerCase();
      const bv = (String(b[sortBy] ?? "")).toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [customers, sortBy, sortDir]);

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const res = await updateCustomer(selected.id, {
      email: email || undefined,
      phone_number: phone || undefined,
      role,
      business_id: businessId || undefined,
      crm_notes: crmNotes || undefined,
    });
    if (res.success) {
      toast.success("Customer updated");
      const updated = { ...selected, email, phone_number: phone, role, business_id: businessId, crm_notes: crmNotes };
      setCustomers(prev => prev.map(c => c.id === selected.id ? updated : c));
      setSelected(updated);
    } else {
      toast.error(res.error || "Failed to update customer");
    }
    setSaving(false);
  }

  const colBtn = "flex items-center font-bold hover:text-primary transition-colors whitespace-nowrap";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers (CRM)</h1>
        <p className="text-muted-foreground">Manage your registered customers, B2B clients, and internal notes.</p>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>
                <button className={colBtn} onClick={() => handleSort("email")}>
                  ID / Email <SortIcon active={sortBy === "email"} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead>
                <button className={colBtn} onClick={() => handleSort("phone_number")}>
                  Phone <SortIcon active={sortBy === "phone_number"} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead>
                <button className={colBtn} onClick={() => handleSort("role")}>
                  Role <SortIcon active={sortBy === "role"} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead>
                <button className={colBtn} onClick={() => handleSort("business_id")}>
                  Business ID <SortIcon active={sortBy === "business_id"} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="font-bold">CRM Notes</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No customers found.</TableCell>
              </TableRow>
            ) : (
              sorted.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium">{c.email || c.id}</TableCell>
                  <TableCell>{c.phone_number || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={c.role === "admin" ? "default" : c.role === "b2b_customer" ? "secondary" : "outline"}>
                      {c.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.business_id || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{c.crm_notes || "—"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="font-bold gap-1.5" onClick={() => openCustomer(c)}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  Edit Customer
                </SheetTitle>
                <p className="text-xs text-muted-foreground font-mono">{selected.id}</p>
              </SheetHeader>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Email</label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Phone Number</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+358…" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Role</label>
                  <Select value={role} onValueChange={v => setRole(v as Customer["role"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">customer</SelectItem>
                      <SelectItem value="b2b_customer">b2b_customer</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Business ID (Y-tunnus)</label>
                  <Input value={businessId} onChange={e => setBusinessId(e.target.value)} placeholder="1234567-8" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">CRM Notes</label>
                  <Textarea value={crmNotes} onChange={e => setCrmNotes(e.target.value)} placeholder="Internal notes…" rows={4} />
                </div>
                <Button className="w-full font-bold" onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

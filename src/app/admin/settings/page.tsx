"use client";

import { useEffect, useState } from "react";
import { getStoreSettings, updateStoreSettings } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Building2, Mail, Phone, Bell, AlertTriangle, Save } from "lucide-react";
import { toast } from "sonner";

interface StoreSettings {
  business_name?: string;
  business_id?: string;
  vat_number?: string;
  address_line1?: string;
  address_city?: string;
  address_postal_code?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  notification_email?: string;
  maintenance_mode?: boolean;
  maintenance_message?: string;
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({});

  useEffect(() => {
    getStoreSettings().then(data => {
      setSettings(data as StoreSettings);
      setLoading(false);
    });
  }, []);

  function set(key: keyof StoreSettings, value: unknown) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await updateStoreSettings(settings as Record<string, unknown>);
    if (res.success) {
      toast.success("Settings saved");
    } else {
      toast.error(res.error || "Failed to save settings");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
          <p className="text-muted-foreground mt-1">Configure business information and store behaviour.</p>
        </div>
        <Button className="font-bold gap-2 shadow-sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <Section icon={Building2} title="Business Information">
        <Field label="Business Name">
          <Input value={settings.business_name || ""} onChange={e => set("business_name", e.target.value)} placeholder="Eqilo Oy" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Business ID (Y-tunnus)">
            <Input value={settings.business_id || ""} onChange={e => set("business_id", e.target.value)} placeholder="1234567-8" />
          </Field>
          <Field label="VAT Number">
            <Input value={settings.vat_number || ""} onChange={e => set("vat_number", e.target.value)} placeholder="FI12345678" />
          </Field>
        </div>
        <Field label="Street Address">
          <Input value={settings.address_line1 || ""} onChange={e => set("address_line1", e.target.value)} placeholder="Esimerkkikatu 1" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Postal Code">
            <Input value={settings.address_postal_code || ""} onChange={e => set("address_postal_code", e.target.value)} placeholder="00100" />
          </Field>
          <Field label="City">
            <Input value={settings.address_city || ""} onChange={e => set("address_city", e.target.value)} placeholder="Helsinki" />
          </Field>
        </div>
      </Section>

      <Section icon={Phone} title="Contact Details">
        <Field label="Contact Email">
          <Input type="email" value={settings.contact_email || ""} onChange={e => set("contact_email", e.target.value)} placeholder="info@eqilo.fi" />
        </Field>
        <Field label="Phone Number">
          <Input value={settings.contact_phone || ""} onChange={e => set("contact_phone", e.target.value)} placeholder="+358 50 563 3097" />
        </Field>
        <Field label="WhatsApp Number (E.164 format)">
          <Input value={settings.whatsapp_number || ""} onChange={e => set("whatsapp_number", e.target.value)} placeholder="358505633097" />
        </Field>
      </Section>

      <Section icon={Bell} title="Order Notifications">
        <Field label="Notification Email">
          <Input type="email" value={settings.notification_email || ""} onChange={e => set("notification_email", e.target.value)} placeholder="orders@eqilo.fi" />
        </Field>
        <p className="text-xs text-muted-foreground">New order confirmations and status alerts are sent to this address.</p>
      </Section>

      <Section icon={AlertTriangle} title="Maintenance Mode">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Enable Maintenance Mode</p>
            <p className="text-xs text-muted-foreground">Visitors see a maintenance message instead of the storefront.</p>
          </div>
          <Switch
            checked={!!settings.maintenance_mode}
            onCheckedChange={v => set("maintenance_mode", v)}
            className="data-[state=checked]:bg-destructive"
          />
        </div>
        {settings.maintenance_mode && (
          <>
            <Separator />
            <Field label="Maintenance Message">
              <Textarea
                value={settings.maintenance_message || ""}
                onChange={e => set("maintenance_message", e.target.value)}
                placeholder="We're currently updating the store. Check back soon!"
                rows={3}
              />
            </Field>
          </>
        )}
      </Section>

      <div className="flex justify-end pb-8">
        <Button className="font-bold gap-2 shadow-sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  Boxes,
  Circle,
  CircleAlert,
  CircleCheck,
  Code,
  Compass,
  Copy,
  FileText,
  Info,
  Link as LinkIcon,
  Pencil,
  Pin,
  Plus,
  RotateCcw,
  Sparkles,
  SquareCheck,
  Wand,
  Zap,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { GlitchText } from "@/components/ui/GlitchText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

type SpecType = "same" | "different";
type RenewalStatus = "" | "yes" | "no";

type FormState = {
  hostName: string; plans: string; targets: string; locales: string;
  specType: SpecType; sameRam: string; sameCpu: string; sameDisk: string;
  tosLink: string; privacyLink: string; planLink: string; websiteLink: string;
  discordLink: string; otherLinks: string; renewalStatus: RenewalStatus;
  renewalDuration: string; coinsNeeded: string; notes: string;
  checkToS: boolean; checkPrivacy: boolean; checkRules: boolean;
};

type PlanSpec = { originalName: string; name: string; ram: string; cpu: string; disk: string };

const initialForm: FormState = {
  hostName: "", plans: "", targets: "", locales: "", specType: "same",
  sameRam: "", sameCpu: "", sameDisk: "", tosLink: "", privacyLink: "",
  planLink: "", websiteLink: "", discordLink: "", otherLinks: "",
  renewalStatus: "", renewalDuration: "", coinsNeeded: "", notes: "",
  checkToS: true, checkPrivacy: true, checkRules: false,
};

const emptyPreview = "Fill in the form to see the message preview here...";

function splitPlans(plans: string) {
  return plans.split(",").map((p) => p.trim()).filter(Boolean);
}

function renewalDisplay(status: RenewalStatus) {
  if (status === "yes") return "YES";
  if (status === "no") return "NO";
  return "[Select an option]";
}

function buildMessage(form: FormState, planSpecs: PlanSpec[], otherSpec: PlanSpec | null) {
  const lines: string[] = [];
  lines.push("Host Submission", "", "Host Name", form.hostName || "[Host Name]",
    "Plans", form.plans || "[Plans]", "Targets", form.targets || "[Targets]",
    "Locales / Languages", form.locales || "[Locales]",
    "------------------------------------------------------------", "", "Specifications");
  if (form.specType === "same") {
    if (form.sameRam || form.sameCpu || form.sameDisk) {
      if (form.sameRam) lines.push(`- RAM: ${form.sameRam}`);
      if (form.sameCpu) lines.push(`- CPU: ${form.sameCpu}`);
      if (form.sameDisk) lines.push(`- Disk: ${form.sameDisk}`);
    } else { lines.push("- [Specs will appear here]"); }
  } else {
    if (!planSpecs.length && !otherSpec) lines.push('- [Add plans using the "Add Plan" button above]');
    planSpecs.forEach((spec) => {
      lines.push(`${spec.name || spec.originalName}:`);
      if (spec.ram) lines.push(`- RAM: ${spec.ram}`);
      if (spec.cpu) lines.push(`- CPU: ${spec.cpu}`);
      if (spec.disk) lines.push(`- Disk: ${spec.disk}`);
    });
    if (otherSpec) {
      lines.push(`${otherSpec.name}:`);
      if (otherSpec.ram) lines.push(`- RAM: ${otherSpec.ram}`);
      if (otherSpec.cpu) lines.push(`- CPU: ${otherSpec.cpu}`);
      if (otherSpec.disk) lines.push(`- Disk: ${otherSpec.disk}`);
    }
  }
  lines.push("------------------------------------------------------------", "", "Links",
    `ToS: ${form.tosLink || "[ToS Link]"}`, `Privacy Policy: ${form.privacyLink || "[Privacy Policy Link]"}`);
  if (form.planLink) lines.push(`Plan Link: ${form.planLink}`);
  if (form.websiteLink) lines.push(`Website Link: ${form.websiteLink}`);
  if (form.discordLink) lines.push(`Discord Invite: ${form.discordLink}`);
  form.otherLinks.split("\n").map((l) => l.trim()).filter(Boolean).forEach((l) => lines.push(l));
  lines.push("------------------------------------------------------------", "", "Information",
    `- Renewal Required: ${renewalDisplay(form.renewalStatus)}`);
  if (form.renewalStatus === "yes") {
    if (form.renewalDuration) lines.push(`- Renewal Duration: ${form.renewalDuration}`);
    if (form.coinsNeeded) lines.push(`- Coins Needed: ${form.coinsNeeded}`);
  }
  if (form.notes) lines.push(`- Notes: ${form.notes}`);
  lines.push("------------------------------------------------------------", "", "Verification",
    `[${form.checkToS ? "x" : " "}] I have included the ToS`,
    `[${form.checkPrivacy ? "x" : " "}] I have included the Privacy Policy`,
    `[${form.checkRules ? "x" : " "}] I have read the Submission Rules`);
  return lines.join("\n");
}

export default function SubmitLayoutClient() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [planSpecs, setPlanSpecs] = useState<PlanSpec[]>([]);
  const [otherSpec, setOtherSpec] = useState<PlanSpec | null>(null);
  const [showRenewalDetails, setShowRenewalDetails] = useState(false);
  const [notification, setNotification] = useState<{ message: string; error: boolean } | null>(null);

  const allPlans = useMemo(() => splitPlans(form.plans), [form.plans]);
  const addedPlanNames = useMemo(() => new Set(planSpecs.map((s) => s.originalName)), [planSpecs]);
  const availablePlans = allPlans.filter((p) => !addedPlanNames.has(p));
  const otherPlans = allPlans.filter((p) => !addedPlanNames.has(p));

  const missingFields = useMemo(() => {
    const m: string[] = [];
    if (!form.hostName.trim()) m.push("Host Name");
    if (!form.plans.trim()) m.push("Plans");
    if (!form.targets.trim()) m.push("Targets");
    if (!form.locales.trim()) m.push("Locales");
    if (!form.tosLink.trim()) m.push("ToS Link");
    if (!form.privacyLink.trim()) m.push("Privacy Policy Link");
    if (!form.websiteLink.trim() && !form.discordLink.trim()) m.push("Website Link or Discord Invite (at least one required)");
    if (!form.renewalStatus) m.push("Renewal Required");
    if (form.renewalStatus === "yes") {
      if (!form.renewalDuration.trim()) m.push("Renewal Duration");
      if (!form.coinsNeeded.trim()) m.push("Coins Needed");
    }
    if (!form.checkRules) m.push("Submission Rules (must confirm you have read them)");
    return m;
  }, [form]);

  const canCopy = missingFields.length === 0;
  const rawMessage = useMemo(() => buildMessage(form, planSpecs, otherSpec), [form, planSpecs, otherSpec]);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((cur) => {
      const next = { ...cur, [key]: value };
      if (key === "specType" && value === "same") { setPlanSpecs([]); setOtherSpec(null); }
      if (key === "plans") {
        const nextPlans = new Set(splitPlans(String(value)));
        setPlanSpecs((specs) => specs.filter((s) => nextPlans.has(s.originalName)));
        setSelectedPlan("");
      }
      if (key === "renewalStatus" && value !== "yes") { next.renewalDuration = ""; next.coinsNeeded = ""; }
      return next;
    });
  };

  const addPlan = () => {
    if (!selectedPlan || addedPlanNames.has(selectedPlan)) return;
    setPlanSpecs((s) => [...s, { originalName: selectedPlan, name: selectedPlan, ram: "", cpu: "", disk: "" }]);
    setSelectedPlan("");
  };

  const updatePlanSpec = (name: string, patch: Partial<PlanSpec>) =>
    setPlanSpecs((s) => s.map((spec) => spec.originalName === name ? { ...spec, ...patch } : spec));

  const removePlan = (name: string) =>
    setPlanSpecs((s) => s.filter((spec) => spec.originalName !== name));

  const showMsg = (message: string, error = false) => {
    setNotification({ message, error });
    window.setTimeout(() => setNotification(null), 2500);
  };

  const copyMessage = async () => {
    if (!canCopy) { showMsg("Please fill in all required fields first!", true); return; }
    try { await navigator.clipboard.writeText(rawMessage); showMsg("Message copied to clipboard!"); }
    catch { showMsg("Failed to copy message", true); }
  };

  const resetForm = (e: FormEvent) => {
    e.preventDefault();
    setForm(initialForm); setSelectedPlan(""); setPlanSpecs([]); setOtherSpec(null); setShowRenewalDetails(false);
  };

  const renderSpecInputs = (spec: PlanSpec, onChange: (p: Partial<PlanSpec>) => void) => (
    <div className="grid grid-cols-3 gap-2">
      {(["ram", "cpu", "disk"] as const).map((field) => (
        <div key={field} className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase">{field}</Label>
          <Input
            value={spec[field]}
            placeholder={field === "ram" ? "e.g., 4GB" : field === "cpu" ? "e.g., 2 vCores" : "e.g., 40GB SSD"}
            onChange={(e) => onChange({ [field]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Wand className="size-7" />
              </div>
              <GlitchText variant="chromatic" as="h1" text="Submit Layout" />
              <p className="max-w-2xl text-muted-foreground body-large">
                Create Discord-formatted hosting layouts instantly, with a live preview and one-click copy.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                <span className="flex items-center gap-1.5 border-accent/50 text-accent border-rotate">
                  <Zap className="size-3.5" />
                  Instant Generation
                </span>
                <span className="flex items-center gap-1.5 border-accent/50 text-accent border-rotate">
                  <Copy className="size-3.5" />
                  One-Click Copy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2 reveal">
            <TiltCard maxTilt={4} glare={false} className="h-full">
              <Card className="h-full card-hover card-glow transition-all duration-300">
                <CardContent className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-secondary">
                      <Pencil className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-base">Build Your Layout</h2>
                      <p className="text-sm text-muted-foreground">Fill in the information below</p>
                    </div>
                  </div>

                  <form onReset={resetForm} className="flex flex-col gap-6">
                    {/* Basic Information */}
                    <FormSection icon={<Pin className="size-3.5" />} title="Basic Information">
                      <TInput label="Host Name" required value={form.hostName} onChange={(v) => updateForm("hostName", v)} placeholder="e.g., Example Host" />
                      <div className="flex flex-col gap-1.5">
                        <Label>
                          Plans <span className="text-destructive">*</span>
                        </Label>
                        <Input value={form.plans} placeholder="e.g., Nextjs, Javascript, Python, Node.js" onChange={(e) => updateForm("plans", e.target.value)} />
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Info className="size-3" />
                          Comma separated list of plan names
                        </p>
                      </div>
                      <TInput label="Targets" required value={form.targets} onChange={(v) => updateForm("targets", v)} placeholder="e.g., Coding, Gaming" />
                      <TInput label="Locales / Languages" required value={form.locales} onChange={(v) => updateForm("locales", v)} placeholder="e.g., en, es" />
                    </FormSection>

                    {/* Specifications */}
                    <FormSection icon={<Boxes className="size-3.5" />} title="Specifications">
                      <div className="flex flex-col gap-2">
                        <Label>
                          Spec Type <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup
                          value={form.specType}
                          onValueChange={(v) => updateForm("specType", v as SpecType)}
                          className="gap-2"
                        >
                          <label className="flex items-center gap-2 text-sm">
                            <RadioGroupItem value="same" /> Same specs for all plans
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <RadioGroupItem value="different" /> Different specs per target/plan
                          </label>
                        </RadioGroup>
                      </div>

                      {form.specType === "same" ? (
                        <div className="rounded-md border border-border p-3">
                          {renderSpecInputs(
                            { originalName: "", name: "", ram: form.sameRam, cpu: form.sameCpu, disk: form.sameDisk },
                            (p) => {
                              if (p.ram !== undefined) updateForm("sameRam", p.ram);
                              if (p.cpu !== undefined) updateForm("sameCpu", p.cpu);
                              if (p.disk !== undefined) updateForm("sameDisk", p.disk);
                            },
                          )}
                        </div>
                      ) : (
                        <>
                          <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={Boolean(otherSpec)}
                              onCheckedChange={(checked) =>
                                setOtherSpec(checked ? { originalName: "other", name: "All Other Plans", ram: "", cpu: "", disk: "" } : null)
                              }
                            />
                            All other plans not listed above share the same specs
                          </label>

                          <div className="flex gap-2">
                            <select
                              className="h-9 flex-1 rounded-md border border-border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                              value={selectedPlan}
                              onChange={(e) => setSelectedPlan(e.target.value)}
                            >
                              <option value="">Select a plan to add specs...</option>
                              {availablePlans.map((p) => (
                                <option value={p} key={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                            <Button type="button" variant="outline" className="gap-1.5" onClick={addPlan}>
                              <Plus className="size-3.5" />
                              Add Plan
                            </Button>
                          </div>

                          <div className="flex flex-col gap-3">
                            {planSpecs.map((spec) => (
                              <div key={spec.originalName} className="flex flex-col gap-2 rounded-md border border-border p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{spec.originalName}</span>
                                  <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-destructive hover:text-destructive" onClick={() => removePlan(spec.originalName)}>
                                    Remove
                                  </Button>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <Label className="text-xs text-muted-foreground">Display Name</Label>
                                  <Input value={spec.name} onChange={(e) => updatePlanSpec(spec.originalName, { name: e.target.value })} />
                                </div>
                                {renderSpecInputs(spec, (p) => updatePlanSpec(spec.originalName, p))}
                              </div>
                            ))}
                            {otherSpec && (
                              <div className="flex flex-col gap-2 rounded-md border border-accent/30 bg-accent/5 p-3">
                                <div>
                                  <span className="text-sm font-medium">All Other Plans</span>
                                  <p className="text-xs text-muted-foreground">
                                    {otherPlans.length > 0 ? otherPlans.join(", ") : "No unlisted plans yet"}
                                  </p>
                                </div>
                                {renderSpecInputs(otherSpec, (p) => setOtherSpec((c) => (c ? { ...c, ...p } : c)))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </FormSection>

                    {/* Links */}
                    <FormSection icon={<LinkIcon className="size-3.5" />} title="Links">
                      <TInput label="ToS Link" required value={form.tosLink} onChange={(v) => updateForm("tosLink", v)} placeholder="https://example.com/tos" />
                      <TInput label="Privacy Policy Link" required value={form.privacyLink} onChange={(v) => updateForm("privacyLink", v)} placeholder="https://example.com/privacy" />
                      <TInput label="Plan Link" value={form.planLink} onChange={(v) => updateForm("planLink", v)} placeholder="https://example.com/plan" />
                      <TInput label="Website Link" value={form.websiteLink} onChange={(v) => updateForm("websiteLink", v)} placeholder="https://example.com" required={!form.discordLink.trim()} />
                      <TInput label="Discord Invite" value={form.discordLink} onChange={(v) => updateForm("discordLink", v)} placeholder="https://discord.gg/invite" required={!form.websiteLink.trim()} />
                      <div className="flex flex-col gap-1.5">
                        <Label>Other Links</Label>
                        <Textarea
                          value={form.otherLinks}
                          placeholder={"One per line, e.g.:\nDocumentation: https://docs.example.com"}
                          onChange={(e) => updateForm("otherLinks", e.target.value)}
                        />
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Info className="size-3" />
                          Format: Label: URL, one per line
                        </p>
                      </div>
                    </FormSection>

                    {/* Information */}
                    <FormSection icon={<FileText className="size-3.5" />} title="Information">
                      <div className="flex flex-col gap-1.5">
                        <Label>
                          Renewal Required <span className="text-destructive">*</span>
                        </Label>
                        <select
                          className="h-9 rounded-md border border-border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          value={form.renewalStatus}
                          onChange={(e) => updateForm("renewalStatus", e.target.value as RenewalStatus)}
                        >
                          <option value="">Select an option</option>
                          <option value="yes">This host requires renewal</option>
                          <option value="no">This host does not require renewal</option>
                        </select>
                      </div>
                      {form.renewalStatus === "yes" && (
                        <div className="flex flex-col gap-4 rounded-md border border-border p-3">
                          <TInput label="Renewal Duration" required value={form.renewalDuration} onChange={(v) => updateForm("renewalDuration", v)} placeholder="e.g., 30 days" />
                          <TInput label="Coins Needed" required value={form.coinsNeeded} onChange={(v) => updateForm("coinsNeeded", v)} placeholder="e.g., 300 coins" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5">
                        <Label>Notes</Label>
                        <Textarea value={form.notes} placeholder="Add any important notes about the host" onChange={(e) => updateForm("notes", e.target.value)} />
                      </div>
                    </FormSection>

                    {/* Verification */}
                    <FormSection icon={<SquareCheck className="size-3.5" />} title="Verification">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.checkToS} onCheckedChange={(c) => updateForm("checkToS", Boolean(c))} />
                        I have included the ToS
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.checkPrivacy} onCheckedChange={(c) => updateForm("checkPrivacy", Boolean(c))} />
                        I have included the Privacy Policy
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.checkRules} onCheckedChange={(c) => updateForm("checkRules", Boolean(c))} />
                        <span>
                          I have read and agree to the{" "}
                          <a href="/submission-rules" target="_blank" rel="noopener noreferrer" className="underline">
                            Submission Rules
                          </a>{" "}
                          <span className="text-destructive">*</span>
                        </span>
                      </label>
                    </FormSection>

                    <div className="flex gap-2">
                      <Button type="reset" variant="outline" className="flex-1 gap-1.5">
                        <RotateCcw className="size-3.5" />
                        Reset Form
                      </Button>
                      <Button type="button" className="flex-1 gap-1.5" disabled={!canCopy} onClick={copyMessage}>
                        <Copy className="size-3.5" />
                        Copy Message
                      </Button>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Code className="size-3.5" />
                        Message Preview (Raw Text)
                      </div>
                      <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-secondary/30 p-3 font-mono text-xs text-muted-foreground">
                        {rawMessage.trim() ? rawMessage : emptyPreview}
                      </pre>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TiltCard>
            <TiltCard maxTilt={4} glare={false} className="h-full">
              <Card className="lg:sticky lg:top-20 lg:self-start h-full card-hover card-glow transition-all duration-300">
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-base">
                      <FontAwesomeIcon icon={faDiscord} className="size-4" />
                      Discord Message Preview
                    </h3>
                    <Badge variant="success" className="gap-1 animate-pulse">
                      <Circle className="size-2 fill-current" strokeWidth={0} />
                      Live
                    </Badge>
                  </div>
                  <DiscordPreview
                    form={form}
                    planSpecs={planSpecs}
                    otherSpec={otherSpec}
                    otherPlans={otherPlans}
                    missingFields={missingFields}
                    showRenewalDetails={showRenewalDetails}
                    setShowRenewalDetails={setShowRenewalDetails}
                  />
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </div>
      </section>

      {notification && (
        <div
          className={cn(
            "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border px-4 py-2.5 text-sm shadow-lg",
            notification.error
              ? "border-destructive/30 bg-destructive/10 text-destructive-text"
              : "border-accent/30 bg-accent/10 text-accent",
          )}
        >
          {notification.error ? <CircleAlert className="size-4" /> : <CircleCheck className="size-4" />}
          {notification.message}
        </div>
      )}
    </>
  );
}

function FormSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function TInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function DiscordPreview({
  form,
  planSpecs,
  otherSpec,
  otherPlans,
  missingFields,
  showRenewalDetails,
  setShowRenewalDetails,
}: {
  form: FormState;
  planSpecs: PlanSpec[];
  otherSpec: PlanSpec | null;
  otherPlans: string[];
  missingFields: string[];
  showRenewalDetails: boolean;
  setShowRenewalDetails: (v: boolean) => void;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    function fmt() {
      return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-md border border-border bg-secondary/20 p-4">
      <div className="flex gap-3">
        <Image src="/Src/icons/icon.png" alt="FreeHosts" width={36} height={36} className="size-9 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 text-sm leading-relaxed">
          <div className="flex items-baseline gap-2">
            <span className="font-medium">FreeHosts Bot</span>
            <span className="text-xs text-muted-foreground">Today at {time}</span>
          </div>

          <p className="mt-1 font-semibold">Host Submission</p>
          <br />
          <span className="font-semibold">Host Name</span>
          <BlockQuote>{form.hostName || "[Host Name]"}</BlockQuote>
          <span className="font-semibold">Plans</span>
          <BlockQuote>{form.plans || "[Plans]"}</BlockQuote>
          <span className="font-semibold">Targets</span>
          <BlockQuote>{form.targets || "[Targets]"}</BlockQuote>
          <span className="font-semibold">Locales / Languages</span>
          <BlockQuote>{form.locales || "[Locales]"}</BlockQuote>

          <Divider />
          <span className="font-semibold">Specifications</span>
          <br />
          <SpecPreview form={form} planSpecs={planSpecs} otherSpec={otherSpec} otherPlans={otherPlans} />

          <Divider />
          <br />
          <span className="font-semibold">Links</span>
          <br />
          <span className="font-semibold">ToS:</span> {form.tosLink || "[ToS Link]"}
          <br />
          <span className="font-semibold">Privacy Policy:</span> {form.privacyLink || "[Privacy Policy Link]"}
          <br />
          {form.planLink && (
            <>
              <span className="font-semibold">Plan Link:</span> {form.planLink}
              <br />
            </>
          )}
          {form.websiteLink && (
            <>
              <span className="font-semibold">Website Link:</span> {form.websiteLink}
              <br />
            </>
          )}
          {form.discordLink && (
            <>
              <span className="font-semibold">Discord Invite:</span> {form.discordLink}
              <br />
            </>
          )}
          {form.otherLinks
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l) => (
              <span key={l}>
                {l}
                <br />
              </span>
            ))}

          <Divider />
          <span className="font-semibold">Information</span>
          <br />- Renewal Required: {renewalDisplay(form.renewalStatus)}
          <br />
          {form.renewalStatus === "yes" && (
            <>
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={() => setShowRenewalDetails(!showRenewalDetails)}
              >
                {showRenewalDetails ? "[Click to hide renewal details]" : "[Click to show renewal details]"}
              </button>
              {showRenewalDetails && (
                <div className="mt-1 rounded border border-border bg-secondary/30 p-2 text-xs">
                  This host requires renewal
                  <br />
                  {form.renewalDuration && (
                    <>
                      - Renewal Duration: {form.renewalDuration}
                      <br />
                    </>
                  )}
                  {form.coinsNeeded && <>- Coins Needed: {form.coinsNeeded}</>}
                </div>
              )}
            </>
          )}
          {form.notes && (
            <>
              - Notes: {form.notes}
              <br />
            </>
          )}

          <Divider />
          <span className="font-semibold">Verification</span>
          <br />
          <VerificationLine checked={form.checkToS} label="I have included the ToS" />
          <VerificationLine checked={form.checkPrivacy} label="I have included the Privacy Policy" />
          <VerificationLine checked={form.checkRules} label="I have read the Submission Rules" />

          {missingFields.length > 0 && (
            <div className="mt-4 rounded border-l-2 border-l-amber-500 bg-amber-500/10 py-1.5 pl-3 text-xs text-amber-500">
              <span className="font-semibold">Missing required fields:</span> {missingFields.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlockQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-1 rounded-sm border-l-2 border-l-muted-foreground/40 bg-secondary/30 py-1 pl-2 text-muted-foreground">
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="my-2 border-border" />;
}

function VerificationLine({ checked, label }: { checked: boolean; label: string }) {
  return (
    <>
      <span className={cn("inline-block size-3.5 rounded-sm border border-border text-center text-[10px] leading-3.5", checked && "border-accent bg-accent/20 text-accent")}>
        {checked ? "x" : ""}
      </span>{" "}
      {label}
      <br />
    </>
  );
}

function SpecPreview({
  form,
  planSpecs,
  otherSpec,
  otherPlans,
}: {
  form: FormState;
  planSpecs: PlanSpec[];
  otherSpec: PlanSpec | null;
  otherPlans: string[];
}) {
  if (form.specType === "same") {
    if (!form.sameRam && !form.sameCpu && !form.sameDisk)
      return (
        <>
          - [Specs will appear here]
          <br />
        </>
      );
    return (
      <>
        {form.sameRam && (
          <>
            - RAM: {form.sameRam}
            <br />
          </>
        )}
        {form.sameCpu && (
          <>
            - CPU: {form.sameCpu}
            <br />
          </>
        )}
        {form.sameDisk && (
          <>
            - Disk: {form.sameDisk}
            <br />
          </>
        )}
      </>
    );
  }
  if (!planSpecs.length && !otherSpec)
    return (
      <>
        - [Add plans using the Add Plan button above]
        <br />
      </>
    );
  return (
    <>
      {planSpecs.map((spec) => (
        <span key={spec.originalName}>
          <span className="font-semibold">{spec.name || spec.originalName}:</span>
          <br />
          {spec.ram && (
            <>
              - RAM: {spec.ram}
              <br />
            </>
          )}
          {spec.cpu && (
            <>
              - CPU: {spec.cpu}
              <br />
            </>
          )}
          {spec.disk && (
            <>
              - Disk: {spec.disk}
              <br />
            </>
          )}
        </span>
      ))}
      {otherSpec && (
        <span>
          <span className="font-semibold">
            All Other Plans{otherPlans.length > 0 ? ` (${otherPlans.join(", ")})` : ""}:
          </span>
          <br />
          {otherSpec.ram && (
            <>
              - RAM: {otherSpec.ram}
              <br />
            </>
          )}
          {otherSpec.cpu && (
            <>
              - CPU: {otherSpec.cpu}
              <br />
            </>
          )}
          {otherSpec.disk && <>- Disk: {otherSpec.disk}</>}
        </span>
      )}
    </>
  );
}

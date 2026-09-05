"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Image from "next/image";
import {
  Boxes,
  Circle,
  Code,
  Copy,
  FileText,
  Info,
  Link as LinkIcon,
  Pencil,
  Pin,
  Plus,
  RotateCcw,
  SquareCheck,
  Wand,
  Zap,
} from "lucide-react";
import { DiscordIcon } from "@/components/BrandIcons";
import { showToast } from "@/lib/toast";

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

  const allPlans = useMemo(() => splitPlans(form.plans), [form.plans]);
  const addedPlanNames = useMemo(() => new Set(planSpecs.map((s) => s.originalName)), [planSpecs]);
  const availablePlans = allPlans.filter((p) => !addedPlanNames.has(p));

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

  const copyMessage = async () => {
    if (!canCopy) { showToast("Please fill in all required fields first!", "error"); return; }
    try { await navigator.clipboard.writeText(rawMessage); showToast("Message copied to clipboard!"); }
    catch { showToast("Failed to copy message", "error"); }
  };

  const resetForm = (e: FormEvent) => {
    e.preventDefault();
    setForm(initialForm); setSelectedPlan(""); setPlanSpecs([]); setOtherSpec(null);
  };

  const renderSpecInputs = (spec: PlanSpec, onChange: (p: Partial<PlanSpec>) => void) => (
    <div className="spec-grid">
      {(["ram", "cpu", "disk"] as const).map((field) => {
        const inputId = `${field}-${spec.originalName || "same"}`;
        return (
          <div className="form-group" key={field}>
            <label htmlFor={inputId} className="form-label">{field.toUpperCase()}</label>
            <input id={inputId} className="form-input" value={spec[field]}
              placeholder={field === "ram" ? "e.g., 4GB" : field === "cpu" ? "e.g., 2 vCores" : "e.g., 40GB SSD"}
              onChange={(e) => onChange({ [field]: e.target.value })} />
          </div>
        );
      })}
    </div>
  );

  return (
    <main>
      <div className="builder-container">
        <section className="builder-hero">
          <h1 className="builder-title">
            <Wand size={20} aria-hidden="true" /> Discord Layout Builder
          </h1>
          <p className="builder-subtitle">
            Create Discord-formatted hosting layouts instantly. Perfect formatting for Discord submissions with a live preview and one-click copy.
          </p>
          <div className="builder-stats">
            <div className="builder-stat"><Zap size={14} aria-hidden="true" /><span>Instant Generation</span></div>
            <div className="builder-stat"><Copy size={14} aria-hidden="true" /><span>One-Click Copy</span></div>
          </div>
        </section>

        <div className="builder-layout">
          <section className="form-card">
            <div className="form-header">
              <div className="form-icon"><Pencil size={20} aria-hidden="true" /></div>
              <div>
                <h2 className="form-title">Build Your Layout</h2>
                <p className="form-subtitle">Fill in the information below</p>
              </div>
            </div>

            <form id="layoutBuilderForm" onReset={resetForm}>
              <div className="form-section">
                <div className="section-label"><Pin size={14} aria-hidden="true" /><span>Basic Information</span></div>
                <TInput id="hostName" label="Host Name" required value={form.hostName} onChange={(v) => updateForm("hostName", v)} placeholder="e.g., Example Host" />
                <div className="form-group">
                  <label htmlFor="plans" className="form-label">Plans <span className="required">*</span></label>
                  <input id="plans" className="form-input" value={form.plans} placeholder="e.g., Nextjs, Javascript, Python, Node.js" onChange={(e) => updateForm("plans", e.target.value)} />
                  <div className="help-text"><Info size={12} aria-hidden="true" /><span>Comma separated list of plan names</span></div>
                </div>
                <TInput id="targets" label="Targets" required value={form.targets} onChange={(v) => updateForm("targets", v)} placeholder="e.g., Coding, Gaming" />
                <TInput id="locales" label="Locales / Languages" required value={form.locales} onChange={(v) => updateForm("locales", v)} placeholder="e.g., en, es" />
              </div>

              <div className="form-section">
                <div className="section-label"><Boxes size={14} aria-hidden="true" /><span>Specifications</span></div>
                <div className="form-group">
                  <label className="form-label">Spec Type <span className="required">*</span></label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="specType" value="same" checked={form.specType === "same"} onChange={() => updateForm("specType", "same")} />
                      <span>Same specs for all plans</span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="specType" value="different" checked={form.specType === "different"} onChange={() => updateForm("specType", "different")} />
                      <span>Different specs per target/plan</span>
                    </label>
                  </div>
                </div>
                {form.specType === "same" ? (
                  <div className="spec-plan-card">{renderSpecInputs({ originalName: "", name: "", ram: form.sameRam, cpu: form.sameCpu, disk: form.sameDisk }, (p) => { if (p.ram !== undefined) updateForm("sameRam", p.ram); if (p.cpu !== undefined) updateForm("sameCpu", p.cpu); if (p.disk !== undefined) updateForm("sameDisk", p.disk); })}</div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="checkbox-option">
                        <input type="checkbox" checked={Boolean(otherSpec)} onChange={(e) => setOtherSpec(e.target.checked ? { originalName: "other", name: "All Other Plans", ram: "", cpu: "", disk: "" } : null)} />
                        <span>All other plans not listed above share the same specs</span>
                      </label>
                    </div>
                    <div className="add-plan-container">
                      <label htmlFor="plan-select" className="sr-only">Select a plan to add specs</label>
                      <select id="plan-select" className="form-select" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                        <option value="">Select a plan to add specs...</option>
                        {availablePlans.map((p) => <option value={p} key={p}>{p}</option>)}
                      </select>
                      <button type="button" className="btn-add" onClick={addPlan}><Plus size={14} aria-hidden="true" /> Add Plan</button>
                    </div>
                    <div className="spec-plans">
                      {planSpecs.map((spec) => (
                        <div className="spec-plan-card" key={spec.originalName}>
                          <div className="spec-plan-header">
                            <div className="spec-plan-name">{spec.originalName}</div>
                            <button type="button" className="btn-remove" onClick={() => removePlan(spec.originalName)}>Remove</button>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Display Name</label>
                            <input className="form-input" value={spec.name} onChange={(e) => updatePlanSpec(spec.originalName, { name: e.target.value })} />
                          </div>
                          {renderSpecInputs(spec, (p) => updatePlanSpec(spec.originalName, p))}
                        </div>
                      ))}
                      {otherSpec && (
                        <div className="spec-plan-card other-plans-card">
                          <div className="spec-plan-header">
                            <div>
                              <div className="spec-plan-name">All Other Plans</div>
                              <div className="help-text">{availablePlans.length > 0 ? availablePlans.join(", ") : "No unlisted plans yet"}</div>
                            </div>
                          </div>
                          {renderSpecInputs(otherSpec, (p) => setOtherSpec((c) => c ? { ...c, ...p } : c))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="form-section">
                <div className="section-label"><LinkIcon size={14} aria-hidden="true" /><span>Links</span></div>
                <TInput id="tosLink" label="ToS Link" required value={form.tosLink} onChange={(v) => updateForm("tosLink", v)} placeholder="https://example.com/tos" />
                <TInput id="privacyLink" label="Privacy Policy Link" required value={form.privacyLink} onChange={(v) => updateForm("privacyLink", v)} placeholder="https://example.com/privacy" />
                <TInput id="planLink" label="Plan Link" value={form.planLink} onChange={(v) => updateForm("planLink", v)} placeholder="https://example.com/plan" />
                <TInput id="websiteLink" label="Website Link" value={form.websiteLink} onChange={(v) => updateForm("websiteLink", v)} placeholder="https://example.com" required={!form.discordLink.trim()} />
                <TInput id="discordLink" label="Discord Invite" value={form.discordLink} onChange={(v) => updateForm("discordLink", v)} placeholder="https://discord.gg/invite" required={!form.websiteLink.trim()} />
                <div className="form-group">
                  <label htmlFor="otherLinks" className="form-label">Other Links</label>
                  <textarea id="otherLinks" className="form-textarea" value={form.otherLinks} placeholder={"One per line, e.g.:\nDocumentation: https://docs.example.com"} onChange={(e) => updateForm("otherLinks", e.target.value)} />
                  <div className="help-text"><Info size={12} aria-hidden="true" /><span>Format: Label: URL, one per line</span></div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-label"><FileText size={14} aria-hidden="true" /><span>Information</span></div>
                <div className="form-group">
                  <label htmlFor="renewalStatus" className="form-label">Renewal Required <span className="required">*</span></label>
                  <select id="renewalStatus" className="form-select" value={form.renewalStatus} onChange={(e) => updateForm("renewalStatus", e.target.value as RenewalStatus)}>
                    <option value="">Select an option</option>
                    <option value="yes">This host requires renewal</option>
                    <option value="no">This host does not require renewal</option>
                  </select>
                </div>
                {form.renewalStatus === "yes" && (
                  <div className="conditional-fields">
                    <TInput id="renewalDuration" label="Renewal Duration" required value={form.renewalDuration} onChange={(v) => updateForm("renewalDuration", v)} placeholder="e.g., 30 days" />
                    <TInput id="coinsNeeded" label="Coins Needed" required value={form.coinsNeeded} onChange={(v) => updateForm("coinsNeeded", v)} placeholder="e.g., 300 coins" />
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea id="notes" className="form-textarea" value={form.notes} placeholder="Add any important notes about the host" onChange={(e) => updateForm("notes", e.target.value)} />
                </div>
              </div>

              <div className="form-section">
                <div className="section-label"><SquareCheck size={14} aria-hidden="true" /><span>Verification</span></div>
                <div className="checkbox-group">
                  <label className="checkbox-option">
                    <input type="checkbox" checked={form.checkToS} onChange={(e) => updateForm("checkToS", e.target.checked)} />
                    <span>I have included the ToS</span>
                  </label>
                  <label className="checkbox-option">
                    <input type="checkbox" checked={form.checkPrivacy} onChange={(e) => updateForm("checkPrivacy", e.target.checked)} />
                    <span>I have included the Privacy Policy</span>
                  </label>
                  <label className="checkbox-option">
                    <input type="checkbox" checked={form.checkRules} onChange={(e) => updateForm("checkRules", e.target.checked)} />
                    <span>
                      I have read and agree to the{" "}
                      <a href="/submission-rules" target="_blank" rel="noopener noreferrer" className="step-link" style={{ display: "inline" }}>
                        Submission Rules
                      </a>
                      {" "}<span className="required">*</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="reset" className="btn btn-reset"><RotateCcw size={14} aria-hidden="true" /> Reset Form</button>
                <button type="button" className="btn primary btn-generate" disabled={!canCopy} onClick={copyMessage} aria-describedby={missingFields.length > 0 ? "missing-fields" : undefined}>
                  <Copy size={14} aria-hidden="true" /> Copy Message
                </button>
              </div>

              <div className="preview-container">
                <div className="message-preview">
                  <div className="message-preview-title"><Code size={14} aria-hidden="true" /><span>Message Preview (Raw Text)</span></div>
                  <div className="message-preview-content" role="region" aria-label="Message preview" style={{ whiteSpace: "pre-wrap" }}>{rawMessage.trim() ? rawMessage : emptyPreview}</div>
                </div>
              </div>
            </form>
          </section>

          <section className="builder-preview-card">
            <div className="preview-header">
              <h3 className="preview-title">
                <DiscordIcon aria-hidden="true" /> Discord Message Preview
              </h3>
              <span className="preview-badge">
                <Circle size={8} aria-hidden="true" /> Live
              </span>
            </div>
            <DiscordPreview form={form} planSpecs={planSpecs} otherSpec={otherSpec} otherPlans={availablePlans} missingFields={missingFields} />
          </section>
        </div>
      </div>
    </main>
  );
}

function TInput({ id, label, value, onChange, placeholder, required = false }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label} {required && <span className="required">*</span>}</label>
      <input id={id} className="form-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function DiscordTimestamp() {
  // Current-time read deferred past the static shell via the Suspense
  // boundary at the usage site (Cache Components forbids it in prerender).
  return (
    <span className="discord-timestamp" suppressHydrationWarning>
      Today at {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
    </span>
  );
}

function DiscordPreview({ form, planSpecs, otherSpec, otherPlans, missingFields }: { form: FormState; planSpecs: PlanSpec[]; otherSpec: PlanSpec | null; otherPlans: string[]; missingFields: string[] }) {
  return (
    <div className="discord-preview">
      <div className="discord-message">
        <div className="discord-avatar">
          <Image src="/Src/icons/icon.png" alt="FreeHosts" width={40} height={40} loading="lazy" />
        </div>
        <div className="discord-message-content">
          <div className="discord-message-header">
            <span className="discord-username">FreeHosts Bot</span>
            <Suspense fallback={<span className="discord-timestamp">Today at --:--</span>}>
              <DiscordTimestamp />
            </Suspense>
          </div>
          <div className="discord-message-text">
            <span className="discord-bold">Host Submission</span><br /><br />
            <span className="discord-bold">Host Name</span>
            <div className="discord-blockquote">{form.hostName || "[Host Name]"}</div>
            <span className="discord-bold">Plans</span>
            <div className="discord-blockquote">{form.plans || "[Plans]"}</div>
            <span className="discord-bold">Targets</span>
            <div className="discord-blockquote">{form.targets || "[Targets]"}</div>
            <span className="discord-bold">Locales / Languages</span>
            <div className="discord-blockquote">{form.locales || "[Locales]"}</div>
            <div className="discord-divider" />
            <span className="discord-bold">Specifications</span><br />
            <SpecPreview form={form} planSpecs={planSpecs} otherSpec={otherSpec} otherPlans={otherPlans} />
            <div className="discord-divider" /><br />
            <span className="discord-bold">Links</span><br />
            <span className="discord-bold">ToS:</span> {form.tosLink || "[ToS Link]"}<br />
            <span className="discord-bold">Privacy Policy:</span> {form.privacyLink || "[Privacy Policy Link]"}<br />
            {form.planLink && <><span className="discord-bold">Plan Link:</span> {form.planLink}<br /></>}
            {form.websiteLink && <><span className="discord-bold">Website Link:</span> {form.websiteLink}<br /></>}
            {form.discordLink && <><span className="discord-bold">Discord Invite:</span> {form.discordLink}<br /></>}
            {form.otherLinks.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => <span key={l}>{l}<br /></span>)}
            <div className="discord-divider" />
            <span className="discord-bold">Information</span><br />
            - Renewal Required: {renewalDisplay(form.renewalStatus)}<br />
            {form.renewalStatus === "yes" && (
              <div className="discord-renewal-content">
                This host requires renewal<br />
                {form.renewalDuration && <>- Renewal Duration: {form.renewalDuration}<br /></>}
                {form.coinsNeeded && <>- Coins Needed: {form.coinsNeeded}<br /></>}
              </div>
            )}
            {form.notes && <>- Notes: {form.notes}<br /></>}
            <div className="discord-divider" />
            <span className="discord-bold">Verification</span><br />
            <span className={`discord-checkbox ${form.checkToS ? "checked" : ""}`}>{form.checkToS ? "x" : ""}</span> I have included the ToS<br />
            <span className={`discord-checkbox ${form.checkPrivacy ? "checked" : ""}`}>{form.checkPrivacy ? "x" : ""}</span> I have included the Privacy Policy<br />
            <span className={`discord-checkbox ${form.checkRules ? "checked" : ""}`}>{form.checkRules ? "x" : ""}</span> I have read the Submission Rules<br />
            {missingFields.length > 0 && (
              <div id="missing-fields" className="discord-blockquote" style={{ color: "#faa81a", marginTop: "16px" }}>
                <span className="discord-bold">Missing required fields:</span> {missingFields.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecPreview({ form, planSpecs, otherSpec, otherPlans }: { form: FormState; planSpecs: PlanSpec[]; otherSpec: PlanSpec | null; otherPlans: string[] }) {
  if (form.specType === "same") {
    if (!form.sameRam && !form.sameCpu && !form.sameDisk) return <>- [Specs will appear here]<br /></>;
    return <>{form.sameRam && <>- RAM: {form.sameRam}<br /></>}{form.sameCpu && <>- CPU: {form.sameCpu}<br /></>}{form.sameDisk && <>- Disk: {form.sameDisk}<br /></>}</>;
  }
  if (!planSpecs.length && !otherSpec) return <>- [Add plans using the Add Plan button above]<br /></>;
  return (
    <>
      {planSpecs.map((spec) => (
        <span key={spec.originalName}>
          <span className="discord-bold">{spec.name || spec.originalName}:</span><br />
          {spec.ram && <>- RAM: {spec.ram}<br /></>}
          {spec.cpu && <>- CPU: {spec.cpu}<br /></>}
          {spec.disk && <>- Disk: {spec.disk}<br /></>}
        </span>
      ))}
      {otherSpec && (
        <span>
          <span className="discord-bold">All Other Plans{otherPlans.length > 0 ? ` (${otherPlans.join(", ")})` : ""}:</span><br />
          {otherSpec.ram && <>- RAM: {otherSpec.ram}<br /></>}
          {otherSpec.cpu && <>- CPU: {otherSpec.cpu}<br /></>}
          {otherSpec.disk && <>- Disk: {otherSpec.disk}<br /></>}
        </span>
      )}
    </>
  );
}

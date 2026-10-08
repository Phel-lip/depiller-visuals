import { useEffect, useMemo, useState } from "react";
import { X, Check, ChevronLeft, MessageCircle, Info } from "lucide-react";
import { SALON, SERVICES, PERIODS, NO_PREF, fmtDate, todayLocal, buildMessage, waLink } from "@/lib/salon";

type StepId = "service" | "pro" | "prefs" | "summary";
const LABELS: Record<StepId, string> = { service: "Serviço", pro: "Profissional", prefs: "Preferências", summary: "Resumo" };

export function BookingModal({ open, initialService, onClose }: { open: boolean; initialService: string | null; onClose: () => void }) {
  const [step, setStep] = useState<StepId>("service");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [pro, setPro] = useState(NO_PREF);
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");
  const [notes, setNotes] = useState("");

  const service = SERVICES.find((s) => s.id === serviceId);
  const hasPros = (service?.pros.length ?? 0) > 0;
  const steps: StepId[] = ["service", ...(hasPros ? (["pro"] as StepId[]) : []), "prefs", "summary"];
  const idx = steps.indexOf(step);

  useEffect(() => {
    if (!open) return;
    const s = SERVICES.find((x) => x.id === initialService);
    setServiceId(s ? s.id : null);
    setStep(s ? (s.pros.length ? "pro" : "prefs") : "service");
    setPro(NO_PREF); setDate(""); setPeriod(""); setNotes("");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, initialService, onClose]);

  const pickService = (id: string) => {
    const s = SERVICES.find((x) => x.id === id)!;
    if (id !== serviceId && !s.pros.includes(pro)) setPro(NO_PREF);
    setServiceId(id);
    setStep(s.pros.length ? "pro" : "prefs");
  };

  const waUrl = useMemo(() => {
    if (!service) return "";
    return waLink(buildMessage({ service: service.title, pro: hasPros ? pro : undefined, date, period, notes }));
  }, [service, hasPros, pro, date, period, notes]);

  if (!open) return null;
  const today = todayLocal();
  const next = () => setStep(steps[idx + 1] ?? "summary");

  const rows: [string, string][] = service
    ? [["Serviço", service.title], ...(hasPros ? ([["Profissional", pro]] as [string, string][]) : []), ["Data preferida", fmtDate(date)], ["Período preferido", period || "A combinar"], ["Valor", "Sob consulta"], ...(notes.trim() ? ([["Observação", notes.trim()]] as [string, string][]) : [])]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-plum/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Solicitar horário">
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-soft sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            {idx > 0 && (
              <button onClick={() => setStep(steps[idx - 1] ?? "service")} aria-label="Voltar" className="rounded-full p-1.5 hover:bg-muted"><ChevronLeft className="h-5 w-5" /></button>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Solicitação de horário</p>
              <h3 className="font-display text-2xl">{LABELS[step]}</h3>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex gap-1.5 px-5 pt-4">
          {steps.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${i <= idx ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "service" && (
            <div className="grid gap-2">
              {SERVICES.map((s) => (
                <button key={s.id} onClick={() => pickService(s.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-2 text-left transition hover:border-primary ${serviceId === s.id ? "border-primary bg-secondary" : ""}`}>
                  <img src={s.img} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.category} · Valor sob consulta</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "pro" && service && (
            <div className="grid gap-2">
              {[NO_PREF, ...service.pros].map((p) => (
                <button key={p} onClick={() => setPro(p)} className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition hover:border-primary ${pro === p ? "border-primary bg-secondary" : ""}`}>
                  <span className="font-medium">{p}</span>
                  {pro === p && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          )}

          {step === "prefs" && (
            <div className="grid gap-5">
              <p className="text-sm text-muted-foreground">Para <strong className="text-foreground">{service?.title}</strong>. Todos os campos são opcionais: o que ficar em branco aparece como “A combinar”.</p>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Data preferida <span className="text-muted-foreground">(opcional)</span></span>
                <div className="flex gap-2">
                  <input type="date" min={today} value={date} onChange={(e) => { const v = e.target.value; setDate(v && v < today ? "" : v); }} className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3" />
                  {date && <button onClick={() => setDate("")} className="rounded-xl border px-3 text-sm hover:bg-muted">Limpar</button>}
                </div>
              </label>
              <div className="grid gap-1.5">
                <span className="text-sm font-medium">Período preferido <span className="text-muted-foreground">(opcional)</span></span>
                <div className="grid grid-cols-2 gap-2">
                  {PERIODS.map((p) => (
                    <button key={p} aria-pressed={period === p} onClick={() => setPeriod(period === p ? "" : p)} className={`rounded-xl border px-4 py-3 text-sm transition hover:border-primary ${period === p ? "border-primary bg-secondary font-medium" : ""}`}>{p}</button>
                  ))}
                </div>
              </div>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Observação <span className="text-muted-foreground">(opcional)</span></span>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: comprimento do cabelo, foto de referência que vai enviar…" className="rounded-xl border bg-background p-3 text-sm" />
              </label>
            </div>
          )}

          {step === "summary" && service && (
            <div className="grid gap-4">
              <dl className="divide-y rounded-2xl border" data-testid="summary">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex gap-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>Isto é uma solicitação, não um agendamento confirmado. A disponibilidade será confirmada pelo salão no WhatsApp.</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-5 py-4">
          {step === "pro" && <button onClick={next} className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground hover:opacity-90">Continuar</button>}
          {step === "prefs" && <button onClick={next} className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground hover:opacity-90">Ver resumo</button>}
          {step === "summary" && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" data-testid="wa-link" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand font-medium text-primary-foreground hover:opacity-90">
              <MessageCircle className="h-5 w-5" /> Enviar solicitação pelo WhatsApp
            </a>
          )}
          {step === "service" && <p className="text-center text-xs text-muted-foreground">Escolha um serviço para continuar · {SALON.shortName}</p>}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ArrowRight, Instagram, Star, ChevronDown, Menu, X, ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import { SALON, SERVICES, CATEGORIES, WA_GENERAL, WA_HELP } from "@/lib/salon";
import { BookingModal } from "@/components/BookingModal";
import before from "@/assets/hair-before.png";
import after from "@/assets/hair-after.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Depiller Salão de Beleza | Selagem, mechas e unhas" },
      { name: "description", content: "Veja os antes e depois de selagem, retoque de mechas e unhas do Depiller e solicite seu horário pelo WhatsApp." },
      { property: "og:title", content: "Depiller Salão de Beleza | Selagem, mechas e unhas" },
      { property: "og:description", content: "Antes e depois de selagem, mechas e unhas. Solicite seu horário pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [["Serviços", "#servicos"], ["Antes e depois", "#antes-depois"], ["Dúvidas", "#faq"], ["Contato", "#contato"]];

function Index() {
  const [modal, setModal] = useState<{ open: boolean; service: string | null }>({ open: false, service: null });
  const book = (service: string | null = null) => setModal({ open: true, service });
  const close = useCallback(() => setModal({ open: false, service: null }), []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header onBook={() => book()} />
      <Hero onBook={() => book()} />
      <ServiceMarquee />
      <Services onBook={book} />
      <BeforeAfter />
      <Reviews />
      <Faq />
      <Footer />
      <BookingModal open={modal.open} initialService={modal.service} onClose={close} />
    </div>
  );
}

function Logo() {
  return (
    <a href="#" className="flex flex-col leading-none" aria-label="Depiller Salão de Beleza">
      <span className="font-display text-2xl tracking-[0.12em]">DEPILLER</span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.32em] text-primary">Salão de beleza</span>
    </a>
  );
}

function Header({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {NAV.map(([l, h]) => <a key={h} href={h} className="text-muted-foreground transition hover:text-primary">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onBook} className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 sm:px-5">Solicitar horário</button>
          <button className="rounded-full p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {open && (
        <nav className="grid border-t px-5 py-2 md:hidden">
          {NAV.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-sm">{l}</a>)}
        </nav>
      )}
    </header>
  );
}

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blush blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Selagem · Mechas · Unhas
          </p>
          <h1 className="font-display text-5xl leading-[1] sm:text-6xl lg:text-7xl">
            Fios alinhados, <span className="text-brand">brilho de verdade.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            No Depiller, a selagem é a estrela dos antes e depois. Veja os resultados das nossas clientes e escolha o seu serviço.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onBook} className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-medium text-primary-foreground shadow-soft transition hover:opacity-90">
              Solicitar horário <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#servicos" className="rounded-full border bg-card px-7 py-3.5 font-medium transition hover:border-primary">Ver serviços</a>
          </div>
          <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
            <MessageCircle className="h-4 w-4" /> Falar com o salão
          </a>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-brand opacity-90" />
          <img src={SALON.heroImg} alt="Cabelo preto longo e alinhado após selagem no Depiller" className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft" />
          <div className="absolute -bottom-5 left-4 rounded-2xl bg-card px-4 py-3 shadow-soft">
            <p className="font-display text-lg leading-tight">Selagem</p>
            <p className="text-xs text-muted-foreground">Trabalho real do salão</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceMarquee() {
  const items = SERVICES.map((s) => s.title);
  return (
    <div className="overflow-hidden border-y border-primary-foreground/25 bg-primary py-3.5 text-primary-foreground md:py-[18px]" aria-label="Serviços Depiller">
      <div className="marquee-track flex w-max font-display text-xl uppercase tracking-[0.14em] sm:text-2xl">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-7 pr-7" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span key={item} className="flex shrink-0 items-center gap-7">
                <span>{item}</span>
                <span className="text-primary-foreground/80" aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-10 max-w-xl">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-tight sm:text-5xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Services({ onBook }: { onBook: (id: string) => void }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");
  const list = cat === "Todos" ? SERVICES : SERVICES.filter((s) => s.category === cat);
  return (
    <section id="servicos" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle eyebrow="Nossos serviços" title={<>Resultados <span className="text-brand">de quem já passou por aqui.</span></>} sub="Fotos reais de trabalhos publicados pelo Depiller." />
        <div className="-mx-5 mb-8 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
          {CATEGORIES.map((c) => (
            <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>{c}</button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <article key={s.id} className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={s.img} alt={s.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-medium">{s.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-2xl leading-tight">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.copy}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-primary">Valor sob consulta</p>
                <button onClick={() => onBook(s.id)} className="mt-3 rounded-full border border-primary px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground">{s.cta}</button>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Não sabe qual escolher?{" "}
          <a href={WA_HELP} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">Fale com o salão.</a>
        </p>
      </div>
    </section>
  );
}

function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <section id="antes-depois" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
        <SectionTitle eyebrow="Antes e depois" title={<>Arraste e veja <span className="text-brand">a diferença.</span></>} sub="Imagens ilustrativas." />
        <div className="relative aspect-square w-full select-none overflow-hidden rounded-3xl shadow-soft">
          <img src={after} alt="Depois (imagem ilustrativa)" className="absolute inset-0 h-full w-full object-cover" />
          <img src={before} alt="Antes (imagem ilustrativa)" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
          <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-card" style={{ left: `${pos}%` }}>
            <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-primary shadow-soft">⇆</div>
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-plum/80 px-3 py-1 text-xs text-plum-foreground">Antes</span>
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Depois</span>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Comparar antes e depois" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  { text: "Espaço para o depoimento de uma cliente sobre a selagem.", service: "Selagem" },
  { text: "Espaço para o depoimento de uma cliente sobre o retoque de mechas.", service: "Mechas" },
  { text: "Espaço para o depoimento de uma cliente sobre as unhas.", service: "Unhas" },
];

function Reviews() {
  return (
    <section id="avaliacoes" className="scroll-mt-20 bg-plum py-14 text-plum-foreground md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-blush">Exemplo de apresentação de avaliações</p>
        <h2 className="mb-8 font-display text-4xl leading-tight sm:text-5xl">O que as clientes dizem</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <figure key={i} className="rounded-3xl border border-plum-foreground/15 p-6">
              <div className="mb-4 flex text-blush">{[...Array(5)].map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}</div>
              <blockquote className="font-display text-xl leading-snug">“{r.text}”</blockquote>
              <figcaption className="mt-5 text-xs uppercase tracking-wider opacity-60">{r.service}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  ["A selagem é feita em loiras e cabelos com mechas?", "Nos antes e depois publicados pelo salão aparecem selagens em fios pretos, castanhos, loiros e acobreados. Para saber o que é indicado para o seu cabelo, fale com o salão pelo WhatsApp."],
  ["Quais serviços o Depiller oferece além do cabelo?", "Além de cabelos, o salão divulga depilação, design de sobrancelha e unhas. Pergunte pelo WhatsApp sobre o serviço que você procura."],
  ["Quanto custa cada serviço?", "Os valores são sob consulta e informados pelo salão no atendimento pelo WhatsApp."],
  ["Como solicito um horário?", "Você pode escolher o serviço e informar suas preferências em “Solicitar horário”, ou falar direto com o salão. A confirmação do horário acontece sempre pelo WhatsApp."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionTitle eyebrow="Dúvidas" title="Perguntas frequentes" />
        <div className="divide-y rounded-3xl border bg-card">
          {FAQ.map(([q, a], i) => (
            <div key={q}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium">
                {q}<ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-6 pb-5 text-sm text-muted-foreground">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contato" className="border-t bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">Cabelos, depilação, design de sobrancelha e unhas.</p>
        </div>
        <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-sm hover:text-primary">
          <MessageCircle className="h-4 w-4 shrink-0 text-primary" /> Falar com o salão · {SALON.phoneLabel}
        </a>
        <a href={SALON.instagram} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-sm hover:text-primary">
          <Instagram className="h-4 w-4 shrink-0 text-primary" />{SALON.instagramHandle} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <p className="border-t py-5 text-center text-xs text-muted-foreground">© {SALON.name}</p>
    </footer>
  );
}

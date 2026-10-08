import hero from "@/assets/dp-hero.jpg";
import loiro from "@/assets/dp-selagem-loiro.jpg";
import castanho from "@/assets/dp-selagem-castanho.jpg";
import acobreado from "@/assets/dp-selagem-acobreado.jpg";
import mechas from "@/assets/dp-mechas.jpg";
import unhas from "@/assets/dp-unhas.jpg";

export const SALON = {
  name: "Depiller Salão de Beleza",
  shortName: "Depiller",
  whatsapp: "5583988155042",
  phoneLabel: "(83) 98815-5042",
  instagram: "https://www.instagram.com/depillersalaodebeleza/",
  instagramHandle: "@depillersalaodebeleza",
  heroImg: hero,
};

export const waLink = (text: string) => `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(text)}`;
export const WA_GENERAL = waLink("Olá! Vim pelo site e gostaria de mais informações sobre os serviços.");
export const WA_HELP = waLink("Olá! Vi os trabalhos no site e gostaria de ajuda para escolher um serviço.");

export type Category = "Selagem" | "Mechas" | "Unhas";

export type Service = {
  id: string;
  title: string;
  category: Category;
  copy: string;
  cta: string;
  img: string;
  alt: string;
  pros: string[];
};

export const SERVICES: Service[] = [
  { id: "selagem-escuros", title: "Selagem em cabelos escuros", category: "Selagem", copy: "Fios pretos alinhados e com brilho intenso, como nos antes e depois do salão.", cta: "Quero horário para selagem", img: hero, alt: "Cabelo preto longo e alinhado após selagem no Depiller", pros: [] },
  { id: "selagem-castanhos", title: "Selagem em castanhos", category: "Selagem", copy: "Do volume ao cabelo liso e soltinho, preservando o tom natural castanho.", cta: "Quero horário para selagem em castanhos", img: castanho, alt: "Cabelo castanho longo e liso após selagem", pros: [] },
  { id: "selagem-loiras", title: "Selagem em loiras", category: "Selagem", copy: "Para quem tem fios claros e quer o loiro alinhado, com mais brilho.", cta: "Quero horário para selagem em loiro", img: loiro, alt: "Cabelo loiro liso após selagem", pros: [] },
  { id: "selagem-ruivos", title: "Selagem em ruivos e acobreados", category: "Selagem", copy: "Fios acobreados alinhados, com o reflexo da cor em evidência.", cta: "Quero horário para selagem em acobreado", img: acobreado, alt: "Cabelo acobreado liso após selagem", pros: [] },
  { id: "mechas", title: "Retoque de mechas", category: "Mechas", copy: "Manutenção das mechas para renovar o loiro e uniformizar a raiz.", cta: "Quero horário para retoque de mechas", img: mechas, alt: "Cabelo com mechas loiras após retoque", pros: [] },
  { id: "unhas", title: "Unhas decoradas", category: "Unhas", copy: "Manutenção com esmaltação e detalhes delicados de nail art.", cta: "Quero horário para unhas", img: unhas, alt: "Unhas em tons terrosos com detalhes dourados", pros: [] },
];

export const CATEGORIES: ("Todos" | Category)[] = ["Todos", "Selagem", "Mechas", "Unhas"];
export const PERIODS = ["Manhã", "Tarde"];
export const NO_PREF = "Sem preferência";

export function todayLocal(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fmtDate(d: string) {
  if (!d) return "A combinar";
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y}`;
}

export function buildMessage(o: { service: string; pro?: string | undefined; date: string; period: string; notes: string }) {
  return [
    `Olá, ${SALON.name}! Gostaria de solicitar um horário:`,
    ``,
    `• Serviço: ${o.service}`,
    ...(o.pro ? [`• Profissional: ${o.pro}`] : []),
    `• Data preferida: ${fmtDate(o.date)}`,
    `• Período preferido: ${o.period || "A combinar"}`,
    ...(o.notes.trim() ? [`• Observação: ${o.notes.trim()}`] : []),
    ``,
    `Aguardo a confirmação da disponibilidade.`,
  ].join("\n");
}

import { useEffect, useId, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import logo from "./assets/logo.png";
import eventPoster from "./assets/d1.png";
import heroLogo from "./assets/logo-l.png";
import star from "./assets/star.png";
import { programs, stats, partners, events, testimonials, faqs } from "./data";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  MoveUpRight,
  Dumbbell,
  Eye,
  Trophy,
  Building2,
  ContactRound,
  Zap,
} from "lucide-react";

const programIcons = [Dumbbell, Eye, Trophy];
const statIcons = [Building2, ContactRound, Zap];

const Arrow = ({ className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function Counter({ value, suffix, label, icon: Icon }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (reduced) {
          setCount(value);
          return;
        }
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / 1600, 1);
          setCount(Math.round(value * (1 - (1 - progress) ** 3)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reduced]);
  return (
    <div ref={ref} className="flex items-center gap-3 pt-5">
      {Icon && <Icon className="size-8 shrink-0 text-white" strokeWidth={1.5} aria-hidden="true" />}
      <div>
        <div
          className="font-display text-5xl sm:text-3xl text-brand"
          aria-hidden="true"
        >
          {count.toLocaleString("en-US")}
          {suffix}
        </div>
        <span className="sr-only">
          {value.toLocaleString("en-US")}
          {suffix}
        </span>
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          {label}
        </p>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    if (open) window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const links = [
    ["Events", "#events"],
    ["Dates", "#dates"],
    ["Roster Recruit", "#rr"],
    ["Hall of Fame", "#hof"],
    ["About", "#about"],
    ["Contact", "#contact"],
  ];
  return (
    <header className="site-header relative z-20 border-b border-white/15 bg-ink text-white">
      <div className="container flex min-h-20 items-center justify-between gap-6">
        <a
          className="flex items-center gap-2"
          href="#home"
          aria-label="D1 University home"
        >
          <img
            src={logo}
            alt="D1 University"
            className="h-10 w-[46px] object-contain"
          />

          <span className="text-white font-semibold text-base uppercase font-sans leading-[18.2px] tracking-[-0.px]">
            D1 University
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {links.map(([label, href]) => (
            <a
              className="nav-link font-medium text-base leading-[19.2px] text-[#DEDEDE] hover:text-brand"
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#events"
          className="bg-white rounded-lg p-1.5 text-sm font-semibold text-ink flex items-center gap-2"
        >
          Register
          <span className="rounded-lg p-1.5 bg-brand flex items-center justify-center">
            <ArrowUpRight className="w-3 h-3 text-white" />
          </span>
        </a>
        <button
          id="menu-toggle"
          className="p-3 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`menu-line ${open ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`menu-line mt-1.5 ${open ? "-translate-y-1 -rotate-45" : ""}`}
          />
        </button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        inert={!open}
        className={`mobile-menu md:hidden ${open ? "is-open" : ""}`}
      >
        <div className="overflow-hidden">
          <div className="container flex flex-col gap-5 pb-6">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a
              className="text-brand"
              href="#events"
              onClick={() => setOpen(false)}
            >
              Find your event ↗
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

function Marquee() {
  return (
    <div className="partners-section mt-20 border-white/10 pt-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="font-display text-[40px] text-center w-full text-brand ">
          Trusted Partners
        </p>
      </div>
      <div className="marquee" aria-label="Example university partners">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
              {partners.map((partner) => (
                <div className="partner" key={partner.src}>
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="partner-logo"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, open, onToggle, children, className = "" }) {
  const id = useId();
  return (
    <div className={`accordion ${open ? "is-open" : ""} ${className}`}>
      <h3>
        <button
          id={`${id}-trigger`}
          className="accordion-trigger"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
        >
          {title}
          <span className="plus" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="accordion-panel"
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        inert={!open}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function Events({ onInquire }) {
  const [active, setActive] = useState("convention");
  return (
    <section id="events" className="section bg-paper text-ink">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow text-brand">Show up. Stand out.</p>
            <h2>
              Upcoming
              <br />
              events.
            </h2>
          </div>
          <p className="section-intro">
            Different experiences. One shared ambition.
            <br />
            Find the next step in your journey.
          </p>
        </Reveal>
        <div className="mt-10 space-y-3">
          {events.map((event) => (
            <Accordion
              key={event.id}
              open={active === event.id}
              onToggle={() => setActive(active === event.id ? null : event.id)}
              className="event"
              title={
                <span className="flex items-center gap-5">
                  <span className="text-xs font-normal">{event.number}</span>
                  <span className="font-display text-3xl uppercase sm:text-4xl">
                    {event.title}
                  </span>
                </span>
              }
            >
              <div className="grid gap-7 bg-white p-5 sm:p-8 md:grid-cols-2">
                <div className="event-art" aria-hidden="true">
                  <span className="absolute left-5 top-5 text-xs uppercase tracking-widest">
                    D1 / Experiences
                  </span>
                  <span className="font-display text-[110px] italic leading-none text-brand sm:text-[150px]">
                    D1
                  </span>
                  <span className="font-display text-2xl uppercase">
                    {event.title}
                  </span>
                  <span className="absolute bottom-4 right-5 text-xs">
                    EST. FOR THE NEXT GENERATION ↗
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="eyebrow text-brand">{event.tag}</p>
                  <h3 className="font-display mt-3 text-3xl uppercase">
                    Make your next move.
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-600">
                    {event.description}
                  </p>
                  <ul className="my-5 flex flex-wrap gap-2">
                    {event.details.map((detail) => (
                      <li
                        className="border border-neutral-200 px-2 py-1 text-[10px] uppercase tracking-wide"
                        key={detail}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="button button-red self-start"
                    onClick={() => onInquire(event.title)}
                  >
                    Get event updates <Arrow />
                  </button>
                  <p className="mt-3 text-xs text-neutral-400">
                    Dates and locations to be announced.
                  </p>
                </div>
              </div>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reduced = useReducedMotion();
  const [ref, api] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: reduced ? 0 : 28,
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState([0, 1, 2]);
  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSelected(api.selectedScrollSnap());
      setVisible(api.slidesInView());
    };
    update();
    api.on("select", update).on("reInit", update).on("slidesInView", update);
    return () => {
      api
        .off("select", update)
        .off("reInit", update)
        .off("slidesInView", update);
    };
  }, [api]);
  return (
    <section id="community" className="section community text-white">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow text-brand">People make the difference</p>
            <h2>
              Trusted. Proven.
              <br />
              Connected.
            </h2>
          </div>
          <p className="section-intro text-neutral-400">
            Real connections make a lasting impact.
            <br />A few voices from the next generation.
            <span className="mt-2 block text-[10px] uppercase tracking-widest">
              Illustrative testimonials · sample content
            </span>
          </p>
        </Reveal>
        <div
          className="mt-10"
          role="region"
          aria-roledescription="carousel"
          aria-label="Community testimonials"
        >
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            ref={ref}
            tabIndex={0}
            aria-label="Use left and right arrows to browse testimonials"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                api?.scrollNext();
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                api?.scrollPrev();
              }
            }}
          >
            <div className="-ml-4 flex touch-pan-y">
              {testimonials.map((item, i) => (
                <div
                  key={item.name}
                  className="min-w-0 flex-[0_0_88%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333333%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${testimonials.length}`}
                  aria-hidden={!visible.includes(i)}
                >
                  <article className="flex h-full min-h-80 flex-col bg-paper p-7 text-ink">
                    <span
                      className="font-display text-5xl leading-none text-brand"
                      aria-hidden="true"
                    >
                      “
                    </span>
                    <blockquote className="mt-3 flex-1 text-lg font-medium leading-relaxed">
                      {item.quote}
                    </blockquote>
                    <div className="mt-8 flex items-center gap-3 border-t border-neutral-200 pt-5">
                      <span className="flex size-10 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold">
                        {item.initials}
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${selected === i ? "active" : ""}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={selected === i ? "true" : undefined}
                  onClick={() => api?.scrollTo(i)}
                />
              ))}
            </div>
            <span className="sr-only" aria-live="polite">
              Testimonial {selected + 1} of {testimonials.length}
            </span>
            <div className="flex gap-2">
              <button
                className="arrow-button"
                aria-label="Previous testimonial"
                onClick={() => api?.scrollPrev()}
              >
                <Arrow className="rotate-180" />
              </button>
              <button
                className="arrow-button"
                aria-label="Next testimonial"
                onClick={() => api?.scrollNext()}
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [active, setActive] = useState(0);
  return (
    <section id="faq" className="section bg-paper text-ink">
      <div className="container grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow text-brand">Let's clear things up</p>
          <h2>
            Everything
            <br />
            you need to know.
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-500">
            Big ambitions come with questions.
            <br />
            Start with the answers right here.
          </p>
        </Reveal>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <Accordion
              key={faq.question}
              className="faq"
              title={faq.question}
              open={active === i}
              onToggle={() => setActive(active === i ? null : i)}
            >
              <p className="px-5 pb-5 text-sm leading-7 text-neutral-600">
                {faq.answer}
              </p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquiryDialog({ inquiry, onClose }) {
  const ref = useRef(null);
  const [draft, setDraft] = useState("");
  useEffect(() => {
    if (inquiry) {
      setDraft("");
      ref.current.showModal();
    } else ref.current.close();
  }, [inquiry]);
  return (
    <dialog
      ref={ref}
      aria-label="Event inquiry"
      className="inquiry-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="p-6 sm:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-brand">Keep moving forward</p>
            <h2 className="mt-2 text-3xl!">{inquiry}</h2>
          </div>
          <button
            className="p-2 text-2xl"
            onClick={onClose}
            aria-label="Close inquiry"
          >
            ×
          </button>
        </div>
        <p className="my-5 text-sm leading-6 text-neutral-500">
          Prepare an inquiry for this experience. This demo creates a message
          locally; nothing is sent or stored.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setDraft(
              `Hello D1 University,\n\nI'd like to hear more about ${inquiry}.\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`,
            );
          }}
        >
          <label className="form-label">
            Your name
            <input
              autoComplete="name"
              name="name"
              required
              placeholder="Jordan Smith"
            />
          </label>
          <label className="form-label">
            Email address
            <input
              type="email"
              autoComplete="email"
              name="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <label className="form-label">
            Your question
            <textarea
              name="message"
              rows={3}
              placeholder="What would you like to know?"
            />
          </label>
          <button className="button button-red mt-2" type="submit">
            Prepare inquiry <Arrow />
          </button>
        </form>
        {draft && (
          <div className="mt-6 border-t border-neutral-200 pt-5" role="status">
            <p className="mb-2 text-sm font-bold">
              Your inquiry is ready to copy.
            </p>
            <textarea
              className="w-full border border-neutral-300 p-3 text-sm"
              aria-label="Prepared inquiry"
              readOnly
              value={draft}
              rows={7}
              onFocus={(e) => e.target.select()}
            />
            <p className="mt-2 text-xs text-neutral-500">
              Connect a registration service or contact address before launch.
            </p>
          </div>
        )}
      </div>
    </dialog>
  );
}

export default function App() {
  const [inquiry, setInquiry] = useState(null);
  const [yearsPaused, setYearsPaused] = useState(false);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section
          id="home"
          className="hero relative isolate overflow-hidden bg-ink text-white"
        >
          <div className="hero-art" aria-hidden="true" />
          <div className="hero-content container relative flex min-h-[640px] flex-col justify-between pt-[111px] md:min-h-[720px]">
            <div className="hero-top flex justify-between gap-8">
              <div className="hero-enter">
                <h1 className="max-w-xl font-display text-[64px] leading-[50px] uppercase text-white">
                  The PATHWAY TO
                  <br />
                  COLLEGIATE DANCE
                </h1>
              </div>
              <div className="hero-event bg-[#CA0F2F33] p-5 flex items-start gap-6 max-w-113.25 w-full h-fit backdrop-blur-2xl">
                <img
                  src={eventPoster}
                  className="max-w-44 w-full h-auto"
                  alt="d1"
                />
                <div>
                  <div>
                    <p className="text-white uppercase text-lg">NEXT EVENT</p>
                    <p className="text-white uppercase text-lg">
                      SUMMER CONVENTION
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 my-4">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="w-3.5 h-3.5 text-brand" />
                      <p className="text-white text-sm">JUL 31-AUG 2, 2026</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-brand" />
                      <p className="text-white text-sm">PARAMUS, NJ</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="underline font-semibold text-sm flex items-center gap-2.5"
                  >
                    Register <MoveUpRight className="w-3 h-3 text-white" />
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-brand hero-enter mt-16 flex items-center gap-8 pb-9">
              <img
                src={heroLogo}
                className="w-[198px] h-[167px] "
                alt="logo large"
              />
              <span className="font-sans font-bold text-[142px] leading-[162px] uppercase tracking-[-2.67px]">
                D1 University
              </span>
            </div>
          </div>
        </section>
        <button
          type="button"
          className={`years-marquee block w-full overflow-hidden bg-brand py-3 text-white ${yearsPaused ? "is-paused" : ""}`}
          aria-label="Pause 4 more years marquee"
          aria-pressed={yearsPaused}
          onClick={() => setYearsPaused(!yearsPaused)}
        >
          <span className="years-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span className="years-group" key={copy}>
                {Array.from({ length: 8 }, (_, i) => (
                  <span className="years-item" key={i}>
                    <span className="font-display text-[32px] uppercase font-normal tracking-[0.2em]">
                      4 MORE YEARS
                    </span>
                    <img src={star} alt="" />
                  </span>
                ))}
              </span>
            ))}
          </span>
        </button>
        <section id="about" className="section bg-ink text-white">
          <div className="container">
            <Reveal>
              <div className="about-intro flex items-start justify-between">
                <h2>
                  More than
                  <br />a Dance <br /> convention
                  <span className="text-brand">.</span>
                </h2>

                <p className="section-intro text-neutral-400 text-lg">
                  From collegiate partnerships to athlete success stories D1
                  University is building the next gen of dancers
                  <a
                    href="#events"
                    className="text-sm font-semibold text-white flex items-center gap-2"
                  >
                    Register
                    <ArrowUpRight className="w-3 h-3 text-brand" />
                  </a>
                </p>
              </div>
            </Reveal>
            <div className="program-grid mt-10 grid gap-4 md:grid-cols-3" tabIndex={0} aria-label="Program cards, scroll horizontally on mobile">
              {programs.map((program, i) => (
                <Reveal key={program.title}>
                  <article className="program-card group">
                    <span className="program-icon" aria-hidden="true">
                      {(() => {
                        const Icon = programIcons[i % programIcons.length];
                        return <Icon size={18} strokeWidth={1.5} />;
                      })()}
                    </span>
                    <span className="program-number font-display">
                      0{i + 1}
                    </span>
                    <div className="program-copy relative mt-6">
                      <p className="eyebrow text-brand">{program.label}</p>
                      <h3 className="font-display mt-2 text-3xl uppercase">
                        {program.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-300">
                        {program.text}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <div className="program-followup mt-3 flex items-center gap-3 sm:gap-5">
              <hr className="min-w-0 flex-1 border-0 border-t border-white/20" />
              <span className="shrink-0 text-[10px] leading-6 text-[#777777] sm:text-base">See where our dancers landed</span>
              <a href="#hof" className="inline-flex shrink-0 items-center gap-2 text-[9px] font-medium uppercase text-brand hover:text-white sm:gap-4 sm:text-xs">
                <Arrow className="size-4 sm:size-5" /> Hall of Fame
              </a>
            </div>
            <div className="about-stats mt-2 grid gap-8 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <Counter key={stat.label} {...stat} icon={statIcons[i % statIcons.length]} />
              ))}
            </div>

            <Marquee />
          </div>
        </section>
        <Events onInquire={setInquiry} />
        <Testimonials />
        <FAQ />
      </main>
      <footer className="overflow-hidden bg-ink pt-14 text-white">
        <div className="container">
          <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="eyebrow text-brand">The next chapter is yours</p>
              <h2 className="mt-3">
                Ready for
                <br />4 more years?
              </h2>
              <button
                className="button button-red mt-6"
                onClick={() => setInquiry("D1 University")}
              >
                Let's get started <Arrow />
              </button>
            </div>
            <div>
              <p className="eyebrow mb-5 text-neutral-500">Explore</p>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  ["Our purpose", "#about"],
                  ["Upcoming events", "#events"],
                  ["Our community", "#community"],
                  ["Common questions", "#faq"],
                ].map(([name, href]) => (
                  <a className="hover:text-brand" key={href} href={href}>
                    {name}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-5 text-neutral-500">Stay connected</p>
              <p className="max-w-xs text-sm leading-6 text-neutral-400">
                Your journey is just getting started.
                <br />
                Be part of what comes next.
              </p>
              <button
                className="mt-5 border-b border-brand pb-1 text-sm hover:text-brand"
                onClick={() => setInquiry("General inquiry")}
              >
                Get in touch ↗
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-3 py-6 text-[10px] uppercase tracking-widest text-neutral-500">
            <span>© {new Date().getFullYear()} D1 University</span>
            <span>Built for the next generation.</span>
            <a href="#home" className="hover:text-white">
              Back to top ↑
            </a>
          </div>
          <div className="footer-wordmark font-display" aria-hidden="true">
            D1 UNIVERSITY
          </div>
        </div>
      </footer>
      <InquiryDialog inquiry={inquiry} onClose={() => setInquiry(null)} />
    </>
  );
}

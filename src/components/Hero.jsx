export default function Hero({ title, subtitle, ctaLabel, onCta, secondaryLabel, onSecondary }) {
  return (
    <section className="bg-brand-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-100 md:text-xl">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={onCta}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
          >
            {ctaLabel}
          </button>
          {secondaryLabel && (
            <button
              onClick={onSecondary}
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

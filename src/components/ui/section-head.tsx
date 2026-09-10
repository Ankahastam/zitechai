/* Shared by the product landing pages (`/voice-agent`, `/chat`). */
export function SectionHead({
  id,
  kicker,
  lede,
  title,
}: {
  id: string;
  kicker: string;
  lede?: string;
  title: string;
}) {
  return (
    <header className="pg-head">
      <p className="text-label pg-head__kicker" dir="ltr" lang="en">
        {kicker}
      </p>
      <h2 className="text-h2 pg-head__title" id={id}>
        {title}
      </h2>
      {lede ? <p className="pg-head__lede">{lede}</p> : null}
    </header>
  );
}

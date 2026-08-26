type SectionHeaderProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ id, eyebrow, title, description }: SectionHeaderProps) {
  return (
    <header className="section-header">
      {eyebrow ? <p className="text-label text-muted">{eyebrow}</p> : null}
      <h2 className="text-h2" id={id}>{title}</h2>
      {description ? <p className="text-body-lg text-muted">{description}</p> : null}
    </header>
  );
}

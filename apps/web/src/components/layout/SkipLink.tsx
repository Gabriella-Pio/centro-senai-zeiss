import "./skip-link.css";

export function SkipLink({ label }: { label: string }) {
  return (
    <a href="#conteudo" className="skip-link">
      {label}
    </a>
  );
}

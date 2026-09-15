import { getGoogleMapsEmbedUrl } from "@/lib/location-links";
import "./map-embed.css";

export function MapEmbed({
  name,
  mapsQuery,
  title,
}: {
  name: string;
  mapsQuery: string;
  title: string;
}) {
  const embedUrl = getGoogleMapsEmbedUrl(mapsQuery);

  return (
    <div className="contact-map__frame">
      <iframe
        title={`${title} — ${name}`}
        src={embedUrl}
        className="contact-map__iframe"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

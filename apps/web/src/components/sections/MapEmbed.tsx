import { location } from "@/copy/site";
import { getGoogleMapsEmbedUrl } from "@/lib/location-links";
import "./map-embed.css";

export function MapEmbed() {
  const embedUrl = getGoogleMapsEmbedUrl(location.mapsQuery);

  return (
    <div className="contact-map__frame">
      <iframe
        title={`Mapa — ${location.name}`}
        src={embedUrl}
        className="contact-map__iframe"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

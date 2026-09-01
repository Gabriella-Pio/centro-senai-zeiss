import Link from "next/link";
import { MapPin } from "lucide-react";
import { footer, location } from "@/copy/site";
import { getGoogleMapsEmbedUrl, getLocationLinks } from "@/lib/location-links";

export function MapEmbed() {
  const embedUrl = getGoogleMapsEmbedUrl(location.mapsQuery);
  const { googleMaps } = getLocationLinks(location.mapsQuery);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-(--radius) border border-border bg-muted">
        <iframe
          title={`Mapa — ${location.name}`}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <Link
        href={googleMaps}
        target="_blank"
        rel="noopener noreferrer"
        className="type-link inline-flex w-fit items-center gap-2 font-medium text-primary hover:text-primary/80"
      >
        <MapPin size={16} strokeWidth={1.75} />
        {footer.mapsLinks.openInGoogleMaps}
      </Link>
    </div>
  );
}

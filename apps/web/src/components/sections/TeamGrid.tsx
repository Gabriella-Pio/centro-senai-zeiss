import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mediaPhotoCoverClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import type { SectionCopy, TeamMember } from "@/copy/types";
import "./team-grid.css";

interface TeamGridProps {
  heading: SectionCopy;
  members: TeamMember[];
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter((part) => !/^(de|da|do|dos|das|e)$/i.test(part));
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export function TeamGrid({ heading, members }: TeamGridProps) {
  return (
    <Section id="equipe" sectionKey="team" surface="white" pattern="none" ambient="diagonal">
      <Container className="flex flex-col gap-(--section-stack)">
        <SectionHeading align="left" {...heading} />

        <ul className="team-grid__list">
          {members.map((member) => (
            <li key={member.name} className="team-grid__item">
              <div className="team-grid__portrait">
                {member.image ? (
                  <Image
                    src={publicAsset(member.image)}
                    alt={member.imageAlt ?? member.name}
                    fill
                    quality={90}
                    className={
                      member.imageFit === "contain"
                        ? "object-contain p-1.5"
                        : mediaPhotoCoverClass
                    }
                    style={
                      member.imagePosition
                        ? { objectPosition: member.imagePosition }
                        : undefined
                    }
                    sizes="(min-width: 48rem) 22vw, 45vw"
                  />
                ) : (
                  <span className="team-grid__initials" aria-hidden>
                    {initials(member.name)}
                  </span>
                )}
              </div>
              <div className="team-grid__meta">
                <p className="team-grid__name">{member.name}</p>
                <p className="team-grid__role">{member.role}</p>
                {member.org ? <p className="team-grid__org">{member.org}</p> : null}
                {member.note ? <p className="team-grid__note">{member.note}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

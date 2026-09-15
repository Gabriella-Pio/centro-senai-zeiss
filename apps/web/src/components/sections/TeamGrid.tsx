import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { mediaPhotoCoverClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import type { SectionCopy, TeamGroup, TeamMember } from "@/copy/types";
import "./team-grid.css";

interface TeamGridProps {
  heading: SectionCopy;
  groups: TeamGroup[];
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter((part) => !/^(de|da|do|dos|das|e)$/i.test(part));
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function groupLayout(count: number) {
  if (count === 1) return "lead";
  if (count === 2) return "pair";
  return "quad";
}

export function TeamGrid({ heading, groups }: TeamGridProps) {
  return (
    <Section id="equipe" sectionKey="team" surface="white" pattern="none" ambient="diagonal">
      <Container className="team-grid">
        <SectionHeading align="left" {...heading} />

        <div className="team-grid__groups">
          {groups.map((group) => {
            const layout = groupLayout(group.members.length);
            return (
              <section key={group.label} className={`team-group team-group--${layout}`} aria-label={group.label}>
                <Eyebrow>{group.label}</Eyebrow>
                <ul className="team-group__list">
                  {group.members.map((member) => (
                    <TeamMemberCard key={member.name} member={member} groupLabel={group.label} layout={layout} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function TeamMemberCard({
  member,
  groupLabel,
  layout,
}: {
  member: TeamMember;
  groupLabel: string;
  layout: "lead" | "pair" | "quad";
}) {
  const showOrg = Boolean(member.org && member.org.toLowerCase() !== groupLabel.toLowerCase());
  const sizes =
    layout === "lead"
      ? "(min-width: 80rem) 18rem, (min-width: 48rem) 8.5rem, 5.75rem"
      : layout === "pair"
        ? "(min-width: 80rem) 16rem, (min-width: 48rem) 7rem, 5.75rem"
        : "(min-width: 80rem) 20vw, (min-width: 48rem) 7rem, 5.75rem";

  return (
    <li className="team-grid__item">
      <div className="team-grid__portrait">
        {member.image ? (
          <Image
            src={publicAsset(member.image)}
            alt={member.imageAlt ?? member.name}
            fill
            quality={90}
            className={
              member.imageFit === "contain" ? "object-contain p-1.5" : mediaPhotoCoverClass
            }
            style={member.imagePosition ? { objectPosition: member.imagePosition } : undefined}
            sizes={sizes}
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
        {showOrg ? <p className="team-grid__org">{member.org}</p> : null}
        {member.note ? <p className="team-grid__note">{member.note}</p> : null}
      </div>
    </li>
  );
}

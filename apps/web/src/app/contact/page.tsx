import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@cem/ui";

const contactInfo = [
  { icon: MapPin, title: "Endereço", value: "SENAI Ítalo Bologna, Goiânia — GO" },
  { icon: Phone, title: "Telefone", value: "(62) 0000-0000" },
  { icon: Mail, title: "E-mail", value: "metrologia@senaigo.com.br" },
  { icon: Clock, title: "Horário", value: "Seg. a Sex., 8h às 18h" },
];

export default function ContactPage() {
  return (
    <Section variant="default" className="!pt-16">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Contato"
          title="Fale com o laboratório"
          description="Prefere solicitar um orçamento formal? Use a página de Orçamento — aqui é para dúvidas gerais e visitas técnicas."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactInfo.map(({ icon: Icon, title, value }) => (
              <Card key={title} className="p-2">
                <CardHeader className="gap-3">
                  <div className="w-11 h-11 flex items-center justify-center bg-primary/10 text-accent">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* TODO: incorporar mapa real (ex: Google Maps embed) quando a
              chave de API/endereço definitivo estiverem disponíveis. */}
          <div className="w-full min-h-[280px] bg-card ring-1 ring-foreground/10 flex items-center justify-center text-muted-foreground text-sm">
            Mapa em breve
          </div>
        </div>
      </Container>
    </Section>
  );
}

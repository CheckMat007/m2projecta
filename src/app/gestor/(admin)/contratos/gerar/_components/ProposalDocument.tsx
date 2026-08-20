// src/app/gestor/(admin)/contratos/gerar/_components/ProposalDocument.tsx
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Identificadores regulatórios fixos da M2 Projecta como empresa — não variam por proposta.
const REGISTRO_ANAC = 'PP-129971657';
const CODIGO_OPERADOR_DECEA = 'BSQD';

export type ProposalDocumentData = {
  proposalDate: Date;
  proposalTitle: string;
  serviceDescription: string;
  captureLocations: string[];
  deliveryTerms: string;
  investmentDescription: string;
  generalTerms: string;
  contactName: string;
  contactPhone: string;
};

// Campos de texto longo são digitados como parágrafos separados por linha em branco.
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Campos de lista (endereços, condições gerais) são um item por linha.
function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111111',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  logo: {
    width: 100,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
  },
  dateWrap: {
    width: 100,
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
    marginTop: 14,
    marginBottom: 6,
  },
  subheading: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletMark: {
    width: 12,
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.4,
  },
  regRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  regLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  contactSection: {
    marginTop: 20,
  },
});

export function ProposalDocument({
  proposalDate,
  proposalTitle,
  serviceDescription,
  captureLocations,
  deliveryTerms,
  investmentDescription,
  generalTerms,
  contactName,
  contactPhone,
}: ProposalDocumentData) {
  const serviceParagraphs = splitParagraphs(serviceDescription);
  const deliveryParagraphs = splitParagraphs(deliveryTerms);
  const investmentParagraphs = splitParagraphs(investmentDescription);
  const generalTermsItems = splitLines(generalTerms);
  const locations = captureLocations.map((l) => l.trim()).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image aqui é do @react-pdf/renderer (não é <img> HTML e não tem prop alt) */}
          <Image src="/logo.png" style={styles.logo} />
          <View style={styles.titleWrap}>
            <Text style={styles.mainTitle}>PROPOSTA COMERCIAL</Text>
          </View>
          <View style={styles.dateWrap}>
            <Text style={styles.dateText}>{format(proposalDate, "d MMMM, yyyy", { locale: ptBR })}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Descrição dos Serviços</Text>
        {proposalTitle ? <Text style={styles.subheading}>{proposalTitle}</Text> : null}
        {serviceParagraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}
        {locations.length > 0 && (
          <>
            <Text style={styles.paragraph}>A captação ocorrerá nos seguintes endereços:</Text>
            {locations.map((location, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bulletMark}>•</Text>
                <Text style={styles.bulletText}>{location}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionHeading}>Entrega do Material</Text>
        {deliveryParagraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}

        <Text style={styles.sectionHeading}>Investimento</Text>
        {investmentParagraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}

        <Text style={styles.sectionHeading}>Condições Gerais</Text>
        {generalTermsItems.map((item, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletMark}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <View style={styles.regRow}>
          <Text><Text style={styles.regLabel}>Registro ANAC: </Text>{REGISTRO_ANAC}</Text>
          <Text><Text style={styles.regLabel}>Código Operador DECEA: </Text>{CODIGO_OPERADOR_DECEA}</Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.subheading}>Contato</Text>
          {contactName ? <Text>{contactName}</Text> : null}
          {contactPhone ? <Text>{contactPhone}</Text> : null}
        </View>
      </Page>
    </Document>
  );
}

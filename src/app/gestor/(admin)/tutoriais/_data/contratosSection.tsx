// src/app/gestor/(admin)/tutoriais/_data/contratosSection.tsx
import { FileText, Sparkles, UploadCloud } from 'lucide-react';
import { MockupFrame, MockCard, MockButton, MockBadge } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, TipBox, SubHeading } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function ContratosMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/contratos" activeMenuIndex={5}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Contratos</h1>
        <div className="flex gap-2">
          <MockButton variant="outline"><Sparkles size={11} /> Gerar Contrato</MockButton>
          <MockButton>Novo Contrato</MockButton>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: 'M2-2026-014', client: 'GAMT Eventos', value: 'R$ 4.750,00', status: 'green', statusLabel: 'Pago', generated: true },
          { num: 'M2-2026-013', client: 'Studio X', value: 'R$ 2.200,00', status: 'amber', statusLabel: 'Pendente', generated: false },
        ].map((c, i) => (
          <MockCard key={i} className="p-3">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[9px] font-mono text-muted-foreground bg-muted/60 px-1 rounded">#{c.num}</span>
              <div className="flex flex-col items-end gap-1">
                <MockBadge tone={c.status as 'green' | 'amber'}>{c.statusLabel}</MockBadge>
                {c.generated && <MockBadge tone="green"><Sparkles size={8} /> Gerado</MockBadge>}
              </div>
            </div>
            <span className="text-[11px] font-semibold block mb-1">{c.client}</span>
            <span className="text-sm font-bold">{c.value}</span>
          </MockCard>
        ))}
      </div>
    </MockupFrame>
  );
}

function GeneratorMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/contratos/gerar" activeMenuIndex={5}>
      <h1 className="text-sm font-bold mb-3 flex items-center gap-1.5"><Sparkles size={13} className="text-m2-green" /> Gerar Contrato</h1>
      <div className="grid grid-cols-2 gap-3">
        <MockCard className="p-3 space-y-2">
          <div className="h-2 bg-muted/50 rounded w-1/3" />
          <div className="h-6 bg-muted/40 rounded" />
          <div className="h-2 bg-muted/50 rounded w-1/2 mt-2" />
          <div className="h-10 bg-muted/40 rounded" />
          <div className="h-2 bg-muted/50 rounded w-1/3 mt-2" />
          <div className="h-6 bg-muted/40 rounded" />
          <div className="flex justify-end mt-2"><MockButton>Aprovar e Salvar</MockButton></div>
        </MockCard>
        <MockCard className="p-3">
          <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded h-full flex flex-col items-center justify-center gap-1 py-6">
            <FileText size={20} className="text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground">Preview do PDF ao vivo</span>
          </div>
        </MockCard>
      </div>
    </MockupFrame>
  );
}

export const contratosSection: TutorialSection = {
  id: 'contratos',
  label: 'Contratos',
  icon: FileText,
  permission: 'manage_contracts',
  content: (
    <div>
      <SectionIntro>
        Controle de contratos por cliente, com valor, status de pagamento e o PDF anexado. Existem{' '}
        <strong>duas formas</strong> de cadastrar um contrato — escolha a que fizer mais sentido em cada caso.
      </SectionIntro>
      <PermissionNote permission="manage_contracts" />
      <FeatureList
        items={[
          <>Listagem em cards: número do contrato (gerado sozinho, formato M2-AAAA-NNN), cliente, valor, status (Pendente / Pago-Ativo / Cancelado) e um selo <MockBadge tone="green"><Sparkles size={8}/> Gerado</MockBadge> nos contratos criados pelo gerador.</>,
          <><strong>Ver PDF</strong> — abre o documento anexado numa nova aba; se não tiver anexo, o botão fica desabilitado (“Sem Anexo”).</>,
          <>Editar (lápis) reabre o formulário de upload manual pra trocar valor, status, observações ou substituir o arquivo — funciona em qualquer contrato, mesmo os gerados.</>,
        ]}
      />

      <SubHeading><UploadCloud size={13} className="inline mr-1.5 -mt-0.5" />Opção 1 — “Novo Contrato” (upload manual)</SubHeading>
      <FeatureList
        items={[
          <>Você já tem o PDF pronto (feito fora do sistema) e só quer anexar.</>,
          <>Escolhe o cliente, digita o valor, escolhe o status, arrasta/seleciona o arquivo (PDF, DOC ou DOCX) e escreve observações opcionais.</>,
        ]}
      />

      <SubHeading><Sparkles size={13} className="inline mr-1.5 -mt-0.5 text-m2-green" />Opção 2 — “Gerar Contrato” (gerador de proposta)</SubHeading>
      <p className="text-sm text-muted-foreground mb-3">
        Preenche um formulário estruturado e o sistema monta o PDF sozinho, no mesmo modelo usado pela M2
        Projecta em propostas comerciais — com preview ao vivo do lado direito, atualizando conforme você digita.
      </p>
      <FeatureList
        items={[
          <>Escolhe o <strong>cliente</strong> — o título da proposta já vem sugerido com o nome dele (dá pra mudar).</>,
          <><strong>Descrição do Serviço</strong> (texto livre) e uma lista de <strong>Endereços de Captação</strong> (adiciona quantos precisar).</>,
          <><strong>Entrega do Material</strong> e <strong>Condições Gerais</strong> já vêm com o texto padrão da empresa pronto — raramente precisa mexer, mas pode editar à vontade.</>,
          <><strong>Valor Total</strong> e uma <strong>Descrição do Investimento</strong> (sugestão automática de frase que você pode reescrever).</>,
          <><strong>Nome e Telefone de Contato</strong> já vêm preenchidos com os seus dados de perfil.</>,
          <>O <strong>preview do PDF à direita atualiza sozinho</strong> conforme você edita os campos — é a mesma coisa que vai virar o anexo do contrato.</>,
          <>Quando estiver tudo certo, clique em <strong>“Aprovar e Salvar”</strong>: o PDF é gerado de verdade, anexado ao contrato, e você volta pra listagem.</>,
        ]}
      />
      <TipBox>
        Registro ANAC e Código Operador DECEA aparecem fixos no rodapé de toda proposta gerada — são dados da
        empresa, não mudam contrato a contrato.
      </TipBox>

      <ContratosMockup />
      <div className="mt-4">
        <GeneratorMockup />
      </div>
    </div>
  ),
};

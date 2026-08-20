// src/app/gestor/(admin)/contratos/gerar/_components/GenerateContractForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { toast } from 'sonner';
import { ChevronLeft, ChevronsUpDown, Check, Plus, Trash2, Loader2 } from 'lucide-react';
import { upsertContractAction } from '../../actions';
import { ProposalDocument, type ProposalDocumentData } from './ProposalDocument';

// PDFViewer usa APIs de navegador (window) internamente, então só pode carregar no cliente.
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
      Carregando visualização...
    </div>
  ),
});

const DEFAULT_DELIVERY_TERMS =
  'Todas as imagens/vídeos captados serão entregues sem edição, em formato digital, através de nuvem (Google Drive), em até 24 (vinte e quatro) horas após a conclusão do serviço.';

const DEFAULT_GENERAL_TERMS = [
  'Respeitamos e seguimos todas as regras e leis para o uso profissional de drones no Brasil.',
  'Possuímos todos os registros necessários conforme a legislação vigente.',
  'O contratante deverá fornecer e liberar o acesso ao local para realização do trabalho.',
  'A M2 Projecta realiza a emissão de Nota Fiscal (NF) referente ao serviço prestado.',
].join('\n');

// Mesmos helpers usados em ContractsClientPage.tsx
const formatInputCurrency = (value: number | string) => {
  const digits = value.toString().replace(/[^0-9]/g, '');
  const number = Number(digits) / 100;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
};

const parseCurrency = (value: string) => {
  const digits = value.toString().replace(/[^0-9]/g, '');
  return Number(digits) / 100;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

type ClientOption = { id: string; tradeName: string };

export function GenerateContractForm({
  clients,
  defaultContactName,
  defaultContactPhone,
}: {
  clients: ClientOption[];
  defaultContactName: string;
  defaultContactPhone: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [openCombobox, setOpenCombobox] = useState(false);

  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalTitleTouched, setProposalTitleTouched] = useState(false);
  const [proposalDate, setProposalDate] = useState(todayIso());
  const [serviceDescription, setServiceDescription] = useState('');
  const [locations, setLocations] = useState<string[]>(['']);
  const [deliveryTerms, setDeliveryTerms] = useState(DEFAULT_DELIVERY_TERMS);
  const [valueDisplay, setValueDisplay] = useState('');
  const [investmentDescription, setInvestmentDescription] = useState('');
  const [investmentTouched, setInvestmentTouched] = useState(false);
  const [generalTerms, setGeneralTerms] = useState(DEFAULT_GENERAL_TERMS);
  const [contactName, setContactName] = useState(defaultContactName);
  const [contactPhone, setContactPhone] = useState(defaultContactPhone);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Sugere o título da proposta ao escolher o cliente, sem sobrescrever se o gestor já editou
  useEffect(() => {
    if (selectedClient && !proposalTitleTouched) {
      setProposalTitle(`Proposta de Captação de Imagens – ${selectedClient.tradeName}`);
    }
  }, [selectedClient, proposalTitleTouched]);

  // Sugere uma frase simples de investimento com base no valor, sem sobrescrever edição manual
  useEffect(() => {
    if (!investmentTouched && valueDisplay) {
      setInvestmentDescription(`O investimento para a realização deste serviço é de ${valueDisplay}.`);
    }
  }, [valueDisplay, investmentTouched]);

  const documentData: ProposalDocumentData = {
    proposalDate: proposalDate ? new Date(`${proposalDate}T12:00:00`) : new Date(),
    proposalTitle,
    serviceDescription,
    captureLocations: locations,
    deliveryTerms,
    investmentDescription,
    generalTerms,
    contactName,
    contactPhone,
  };

  // Debounce simples para não recalcular o PDF inteiro a cada tecla digitada
  const [previewData, setPreviewData] = useState(documentData);
  useEffect(() => {
    const timeout = setTimeout(() => setPreviewData(documentData), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    proposalDate, proposalTitle, serviceDescription, locations,
    deliveryTerms, investmentDescription, generalTerms, contactName, contactPhone,
  ]);

  const handleLocationChange = (index: number, value: string) => {
    setLocations((prev) => prev.map((loc, i) => (i === index ? value : loc)));
  };
  const addLocation = () => setLocations((prev) => [...prev, '']);
  const removeLocation = (index: number) => setLocations((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedClientId) {
      toast.error('Selecione um cliente para continuar.');
      return;
    }
    if (!valueDisplay) {
      toast.error('Informe o valor do investimento.');
      return;
    }

    setIsSubmitting(true);
    try {
      const blob = await pdf(<ProposalDocument {...documentData} />).toBlob();
      const filename = `proposta-${selectedClient?.tradeName || 'contrato'}-${Date.now()}.pdf`.replace(/\s+/g, '-');

      const uploadResponse = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        body: blob,
      });
      if (!uploadResponse.ok) throw new Error('Falha no upload do PDF gerado.');
      const { url: fileUrl } = await uploadResponse.json();

      const formData = new FormData();
      formData.set('clientId', selectedClientId);
      formData.set('value', parseCurrency(valueDisplay).toString());
      formData.set('status', 'PENDING');
      formData.set('fileUrl', fileUrl);
      formData.set('isGenerated', 'true');
      formData.set('proposalDate', documentData.proposalDate.toISOString());
      formData.set('proposalTitle', proposalTitle);
      formData.set('serviceDescription', serviceDescription);
      formData.set('captureLocations', JSON.stringify(locations.map((l) => l.trim()).filter(Boolean)));
      formData.set('deliveryTerms', deliveryTerms);
      formData.set('investmentDescription', investmentDescription);
      formData.set('generalTerms', generalTerms);
      formData.set('contactName', contactName);
      formData.set('contactPhone', contactPhone);

      const result = await upsertContractAction(formData);
      if (result.success) {
        toast.success(result.message);
        router.push('/gestor/contratos');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao gerar ou salvar o contrato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/gestor/contratos"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerar Contrato</h1>
          <p className="text-sm text-muted-foreground">Preencha os dados da proposta e acompanhe o resultado em tempo real.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="space-y-5 bg-card border border-border rounded-lg p-6">
          <div className="grid gap-2">
            <Label>Cliente <span className="text-red-500">*</span></Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between bg-background border-input">
                  {selectedClient ? selectedClient.tradeName : 'Selecione o cliente...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar empresa..." />
                  <CommandList>
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    <CommandGroup>
                      {clients.map((client) => (
                        <CommandItem key={client.id} value={client.tradeName} onSelect={() => { setSelectedClientId(client.id); setOpenCombobox(false); }}>
                          <Check className={`mr-2 h-4 w-4 ${selectedClientId === client.id ? 'opacity-100' : 'opacity-0'}`} />
                          {client.tradeName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proposalTitle">Título da Proposta</Label>
            <Input
              id="proposalTitle"
              value={proposalTitle}
              onChange={(e) => { setProposalTitle(e.target.value); setProposalTitleTouched(true); }}
              placeholder="Proposta de Captação de Imagens – Nome do Cliente"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proposalDate">Data da Proposta</Label>
            <Input id="proposalDate" type="date" value={proposalDate} onChange={(e) => setProposalDate(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="serviceDescription">Descrição do Serviço</Label>
            <Textarea
              id="serviceDescription"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              rows={6}
              placeholder="Descreva o serviço a ser realizado. Use uma linha em branco para separar parágrafos."
            />
          </div>

          <div className="grid gap-2">
            <Label>Endereços de Captação</Label>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={location} onChange={(e) => handleLocationChange(index, e.target.value)} placeholder="Endereço completo" />
                  {locations.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLocation(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addLocation} className="w-fit">
              <Plus className="h-4 w-4 mr-1" /> Adicionar endereço
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deliveryTerms">Entrega do Material</Label>
            <Textarea id="deliveryTerms" value={deliveryTerms} onChange={(e) => setDeliveryTerms(e.target.value)} rows={4} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="valueDisplay">Valor Total <span className="text-red-500">*</span></Label>
            <Input
              id="valueDisplay"
              value={valueDisplay}
              onChange={(e) => setValueDisplay(formatInputCurrency(e.target.value))}
              placeholder="R$ 0,00"
              className="font-mono"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="investmentDescription">Descrição do Investimento</Label>
            <Textarea
              id="investmentDescription"
              value={investmentDescription}
              onChange={(e) => { setInvestmentDescription(e.target.value); setInvestmentTouched(true); }}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="generalTerms">Condições Gerais</Label>
            <Textarea id="generalTerms" value={generalTerms} onChange={(e) => setGeneralTerms(e.target.value)} rows={5} placeholder="Uma condição por linha." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactName">Nome de Contato</Label>
              <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Telefone de Contato</Label>
              <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" asChild>
              <Link href="/gestor/contratos">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[160px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aprovar e Salvar'}
            </Button>
          </div>
        </div>

        {/* COLUNA DIREITA: PREVIEW AO VIVO */}
        <div className="lg:sticky lg:top-6 border border-border rounded-lg overflow-hidden bg-muted/20 h-[80vh]">
          <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
            <ProposalDocument {...previewData} />
          </PDFViewer>
        </div>
      </form>
    </div>
  );
}

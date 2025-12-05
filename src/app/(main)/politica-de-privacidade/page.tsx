// src/app/(main)/politica-de-privacidade/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | M2 Projecta',
  description: 'Conheça nossa política de privacidade e como lidamos com as informações coletadas em nosso site.',
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="bg-black pt-28 md:pt-32">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <h1>Política de Privacidade</h1>
          {/* Atualizei a data para refletir as mudanças recentes */}
          <p className="text-sm text-gray-500">Última atualização: 05 de dezembro de 2025</p>
          
          <p>A sua privacidade é importante para nós. É política da M2 Projecta respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://www.m2projecta.com.br">https://www.m2projecta.com.br</a> e em outros sistemas que possuímos e operamos.</p>
          
          <h2>1. Informações que Coletamos</h2>
          <p>Coletamos informações de várias formas, dependendo de como você interage com nossos serviços:</p>
          <ul>
            <li><strong>Informações que você nos fornece diretamente:</strong>
              <ul>
                <li><strong>Formulário de Contato:</strong> Ao preencher nosso formulário de contato, coletamos seu nome, e-mail, telefone, cidade/região, tipo de serviço de interesse e a mensagem que você nos envia.</li>
                <li><strong>Área do Cliente:</strong> Para clientes cadastrados, armazenamos informações comerciais necessárias para a prestação de serviço, incluindo Razão Social, Nome Fantasia, CNPJ/CPF, Endereço completo e Telefone/WhatsApp. Também mantemos registros de contratos, status de projetos e arquivos disponibilizados para download.</li>
                <li><strong>Painel Gestor:</strong> Para administradores e colaboradores, coletamos credenciais de acesso, nome, e-mail e permissões de função.</li>
              </ul>
            </li>
            <li><strong>Informações coletadas automaticamente:</strong>
              <ul>
                <li><strong>Dados de Navegação:</strong> Utilizamos o Google Analytics para coletar informações anônimas sobre como os visitantes usam nosso site. Isso inclui páginas visitadas, tempo de permanência, tipo de dispositivo e navegador, e localização geográfica aproximada.</li>
                <li><strong>Cookies de Sessão e Preferências:</strong> Usamos cookies para manter a sessão de usuários autenticados (NextAuth.js) e para lembrar suas preferências de consentimento de cookies.</li>
                <li><strong>Interações no Blog:</strong> Ao interagir com nosso conteúdo (como votar em &quot;curtir&quot; ou &quot;não curtir&quot;), podemos armazenar um identificador anônimo em seu navegador (cookie) para computar seu voto e evitar duplicidade.</li>
              </ul>
            </li>
          </ul>

          <h2>2. Como Usamos Suas Informações</h2>
          <p>As informações que coletamos são usadas para os seguintes propósitos:</p>
          <ul>
            <li>Para responder às suas solicitações de orçamento e contato.</li>
            <li>Para administrar, operar e melhorar nosso site e serviços.</li>
            <li>Para fornecer acesso à <strong>Área do Cliente</strong>, permitindo que você visualize o andamento de projetos, acesse contratos e faça download de arquivos finais.</li>
            <li>Para gerenciar o acesso seguro ao nosso painel administrativo.</li>
            <li>Para analisar o desempenho do nosso site e entender as necessidades do nosso público.</li>
            <li>Para cumprir com obrigações legais e contratuais.</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. Suas informações podem ser compartilhadas com provedores de serviços terceirizados apenas para a infraestrutura necessária para operar nosso serviço:</p>
          <ul>
              <li><strong>Vercel:</strong> Hospedagem da aplicação e armazenamento de arquivos (Blob Storage).</li>
              <li><strong>Supabase:</strong> Banco de dados seguro.</li>
              <li><strong>Google:</strong> Serviços de análise (Analytics) e segurança (reCAPTCHA).</li>
          </ul>

          <h2>4. Segurança das Informações</h2>
          <p>Empregamos medidas de segurança robustas para proteger suas informações:</p>
          <ul>
            <li>Utilizamos criptografia forte (bcrypt) para armazenamento de senhas.</li>
            <li>Toda a comunicação com o site é protegida via SSL/TLS (HTTPS).</li>
            <li>Implementamos o <strong>Google reCAPTCHA</strong> em nossos formulários de login para proteger contra spam e acessos automatizados indevidos.</li>
            <li>O acesso aos arquivos de projetos na Área do Cliente é restrito apenas aos usuários autorizados vinculados ao contrato específico.</li>
          </ul>

          <h2>5. Seus Direitos</h2>
          <p>Você tem o direito de solicitar acesso, correção ou exclusão de suas informações pessoais que possuímos. Clientes com acesso à Área do Cliente podem visualizar seus dados cadastrais diretamente no perfil, devendo solicitar alterações ao gestor da conta por motivos de segurança contratual.</p>

          <h2>6. Contato</h2>
          <p>Se você tiver alguma dúvida sobre nossa política de privacidade, entre em contato conosco:
            <br />
            <strong>M2 Projecta</strong>
            <br />
            E-mail: contato@m2projecta.com.br
          </p>

        </article>
      </div>
    </div>
  );
}
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
          <p className="text-sm text-gray-500">Última atualização: 24 de outubro de 2025</p>
          
          <p>A sua privacidade é importante para nós. É política da M2 Projecta respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://www.m2projecta.com.br">https://www.m2projecta.com.br</a> e em outros sistemas que possuímos e operamos.</p>
          
          <h2>1. Informações que Coletamos</h2>
          <p>Coletamos informações de várias formas, dependendo de como você interage com nossos serviços:</p>
          <ul>
            <li><strong>Informações que você nos fornece diretamente:</strong>
              <ul>
                <li><strong>Formulário de Contato:</strong> Ao preencher nosso formulário de contato, coletamos seu nome, e-mail, telefone, cidade/região, tipo de serviço de interesse e a mensagem que você nos envia.</li>
                <li><strong>Painel Gestor e Área do Cliente:</strong> Para usuários autorizados do nosso painel gestor e da futura área do cliente, coletamos informações de cadastro como nome, e-mail, telefone e foto de perfil, bem como senhas criptografadas.</li>
              </ul>
            </li>
            <li><strong>Informações coletadas automaticamente:</strong>
              <ul>
                <li><strong>Dados de Navegação:</strong> Utilizamos o Google Analytics para coletar informações anônimas sobre como os visitantes usam nosso site. Isso inclui páginas visitadas, tempo de permanência, tipo de dispositivo e navegador, e localização geográfica aproximada.</li>
                <li><strong>Cookies:</strong> Usamos cookies para análise de tráfego (Google Analytics) e para manter a sessão de usuários autenticados no painel gestor (NextAuth.js).</li>
              </ul>
            </li>
          </ul>

          <h2>2. Como Usamos Suas Informações</h2>
          <p>As informações que coletamos são usadas para os seguintes propósitos:</p>
          <ul>
            <li>Para responder às suas solicitações de orçamento e contato.</li>
            <li>Para administrar, operar e melhorar nosso site e serviços.</li>
            <li>Para gerenciar o acesso seguro ao nosso painel gestor e à futura área do cliente.</li>
            <li>Para analisar o desempenho do nosso site e entender as necessidades do nosso público.</li>
            <li>Para cumprir com obrigações legais.</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. Suas informações podem ser compartilhadas com provedores de serviços terceirizados apenas para os fins descritos nesta política, como plataformas de hospedagem (Vercel) e banco de dados (Supabase).</p>

          <h2>4. Segurança das Informações</h2>
          <p>Empregamos medidas de segurança para proteger suas informações, incluindo o uso de criptografia (bcrypt.js) para senhas de usuário e a utilização de infraestrutura de nuvem segura.</p>

          <h2>5. Seus Direitos</h2>
          <p>Você tem o direito de solicitar acesso, correção ou exclusão de suas informações pessoais que possuímos. Para fazer tal solicitação, entre em contato conosco através dos canais listados abaixo.</p>

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
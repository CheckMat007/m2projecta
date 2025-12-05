// src/app/(main)/termos-e-condicoes/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos e Condições | M2 Projecta',
  description: 'Leia os termos e condições de uso do site e dos serviços da M2 Projecta.',
};

export default function TermosECondicoesPage() {
  return (
    <div className="bg-black pt-28 md:pt-32">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
       

        <article className="prose prose-invert lg:prose-xl mx-auto">
          <h1>Termos e Condições de Uso</h1>
          <p className="text-sm text-gray-500">Última atualização: 05 de dezembro de 2025</p>

          <p>Bem-vindo à M2 Projecta! Ao acessar e usar o site <a href="https://www.m2projecta.com.br">https://www.m2projecta.com.br</a>, bem como nossa Área do Cliente e Painel Gestor, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.</p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>Ao utilizar este site e nossos serviços digitais, você confirma que leu, entendeu e concorda com estes Termos e Condições e com nossa Política de Privacidade. Se você não concorda, por favor, não utilize nosso site ou as áreas restritas.</p>
          
          <h2>2. Propriedade Intelectual</h2>
          <p>Todo o conteúdo presente neste site, incluindo, mas não se limitando a, textos, gráficos, vídeos, fotografias, logotipos e códigos-fonte, é de propriedade exclusiva da M2 Projecta ou de seus licenciadores e está protegido por leis de direitos autorais e propriedade intelectual.</p>
          <ul>
            <li><strong>Uso Geral:</strong> É proibida a reprodução, distribuição ou uso de qualquer conteúdo público deste site para fins comerciais sem a permissão prévia e por escrito da M2 Projecta.</li>
            <li><strong>Entregáveis do Cliente:</strong> Os materiais (fotos, vídeos, relatórios) disponibilizados para download na <strong>Área do Cliente</strong> são regidos pelos contratos de prestação de serviço específicos firmados entre a M2 Projecta e o Cliente contratante.</li>
          </ul>

          <h2>3. Uso do Site e Conduta</h2>
          <p>Você concorda em usar este site apenas para fins legais. É estritamente proibido:</p>
          <ul>
            <li>Tentar violar a segurança do site, do Painel Gestor ou da Área do Cliente.</li>
            <li>Usar qualquer dispositivo, software ou rotina para interferir no funcionamento adequado do site.</li>
            <li>Tentar acessar dados que não são destinados a você.</li>
          </ul>

          <h2>4. Áreas Restritas (Gestor e Cliente)</h2>
          <p>O site oferece áreas de acesso restrito que exigem autenticação:</p>
          <ul>
            <li><strong>Credenciais:</strong> Se você receber credenciais de acesso (login e senha) para a Área do Cliente ou Painel Gestor, é sua total responsabilidade mantê-las confidenciais. Você não deve compartilhar sua conta com terceiros.</li>
            <li><strong>Responsabilidade:</strong> Você é responsável por todas as atividades que ocorrem sob sua conta. Se suspeitar de uso não autorizado, notifique a M2 Projecta imediatamente.</li>
            <li><strong>Dados do Cliente:</strong> Na Área do Cliente, você terá acesso a informações sobre seus contratos e projetos. Essas informações são confidenciais e destinadas exclusivamente ao contratante.</li>
          </ul>

          <h2>5. Blog e Interatividade</h2>
          <p>Nosso site possui uma seção de Blog que permite interação através de votos (&quot;curtir&quot;/&quot;não curtir&quot;). Ao interagir, você concorda em não utilizar sistemas automatizados (bots) para manipular contagens ou prejudicar a integridade da plataforma.</p>

          <h2>6. Links para Terceiros</h2>
          <p>Nosso site pode conter links para sites de terceiros (como YouTube, Instagram, WhatsApp, etc.). A M2 Projecta não tem controle e não assume responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites de terceiros.</p>

          <h2>7. Limitação de Responsabilidade</h2>
          <p>As informações neste site são fornecidas &quot;como estão&quot;. Embora nos esforcemos para manter as informações corretas e atualizadas, a M2 Projecta não garante que o site estará livre de erros, interrupções ou vírus. Não nos responsabilizamos por danos diretos ou indiretos decorrentes do uso ou impossibilidade de uso deste site.</p>

          <h2>8. Alterações nos Termos</h2>
          <p>A M2 Projecta reserva-se o direito de modificar estes termos a qualquer momento. Recomendamos que você revise esta página periodicamente. O uso continuado do site após quaisquer alterações constitui aceitação dos novos termos.</p>

          <h2>9. Legislação Aplicável</h2>
          <p>Estes termos e condições serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da comarca da sede da M2 Projecta para dirimir quaisquer dúvidas decorrentes deste documento.</p>

          <h2>10. Contato</h2>
          <p>Se você tiver alguma dúvida sobre estes termos, entre em contato conosco:
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
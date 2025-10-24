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
          <p className="text-sm text-gray-500">Última atualização: 24 de outubro de 2025</p>

          <p>Bem-vindo à M2 Projecta! Ao acessar e usar o site <a href="https://www.m2projecta.com.br">https://www.m2projecta.com.br</a>, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.</p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>Ao utilizar este site, você confirma que leu, entendeu e concorda com estes Termos e Condições e com nossa Política de Privacidade. Se você não concorda, por favor, não utilize nosso site.</p>
          
          <h2>2. Propriedade Intelectual</h2>
          <p>Todo o conteúdo presente neste site, incluindo, mas não se limitando a, textos, gráficos, vídeos, fotografias e logotipos (como o logo.png da M2 Projecta), é de propriedade exclusiva da M2 Projecta ou de seus licenciadores e está protegido por leis de direitos autorais.</p>
          <p>É proibida a reprodução, distribuição ou uso de qualquer conteúdo deste site para fins comerciais sem a permissão prévia e por escrito da M2 Projecta.</p>

          <h2>3. Uso do Site</h2>
          <p>Você concorda em usar este site apenas para fins legais e de maneira que não infrinja os direitos de terceiros.</p>

          <h2>4. Acesso a Áreas Restritas</h2>
          <p>O acesso a certas áreas do site, como o Painel Gestor (`/gestor`) e a futura Área do Cliente, é restrito a usuários autorizados. Se você receber credenciais de acesso, é sua responsabilidade mantê-las confidenciais.</p>

          <h2>5. Links para Terceiros</h2>
          <p>Nosso site pode conter links para sites de terceiros (como YouTube, Instagram, etc.). A M2 Projecta não tem controle e não assume responsabilidade pelo conteúdo ou práticas de quaisquer sites de terceiros.</p>

          <h2>6. Limitação de Responsabilidade</h2>
          <p>As informações neste site são fornecidas &quot;como estão&quot;. Embora nos esforcemos para manter as informações corretas, não fazemos garantias sobre a integridade ou precisão do conteúdo.</p>

          <h2>7. Legislação Aplicável</h2>
          <p>Estes termos e condições serão regidos e interpretados de acordo com as leis da República Federativa do Brasil.</p>

          <h2>8. Contato</h2>
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
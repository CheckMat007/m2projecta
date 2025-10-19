// src/app/(main)/sobre/page.tsx

import Image from "next/image";
import { Award, Target, Eye as VisionIcon } from "lucide-react"; // Renomeado para evitar conflito

export default function SobrePage() {
  return (
    <>
      {/* Seção de Título */}
      <section className="bg-m2-dark pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            Nossa <span className="text-m2-green">História</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Mais do que imagens, entregamos uma nova perspectiva para o seu negócio.
          </p>
        </div>
      </section>

      {/* Seção de Conteúdo Principal */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-white mb-4">De uma paixão a uma profissão</h2>
              <p className="text-gray-300 mb-4">
                A M2 Projecta nasceu da união entre a paixão por tecnologia e a arte da narrativa visual. O que começou como um hobby, explorando os céus com os primeiros drones, rapidamente se tornou uma missão: oferecer uma perspectiva única e cinematográfica para empresas e projetos.
              </p>
              <p className="text-gray-300">
                Com base em Taubaté, no coração do Vale do Paraíba, crescemos com a tecnologia, aprimorando nossas habilidades e equipamentos para garantir não apenas imagens espetaculares, mas também segurança, conformidade e um resultado que supera as expectativas.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image 
                src="/assets/about/historia.jpg" 
                alt="Fundadores da M2 Projecta com um drone"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Missão, Visão e Valores */}
      <section className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Missão */}
            <div className="space-y-3">
              <Target className="w-12 h-12 text-m2-green mx-auto" />
              <h3 className="text-2xl font-bold text-white">Nossa Missão</h3>
              <p className="text-gray-400">Elevar o padrão da comunicação visual de nossos clientes com imagens aéreas que informam, encantam e geram resultados mensuráveis.</p>
            </div>
            {/* Visão */}
            <div className="space-y-3">
              <VisionIcon className="w-12 h-12 text-m2-green mx-auto" />
              <h3 className="text-2xl font-bold text-white">Nossa Visão</h3>
              <p className="text-gray-400">Ser a referência em produções aéreas no Vale do Paraíba, reconhecida pela inovação, qualidade cinematográfica e excelência no atendimento.</p>
            </div>
            {/* Valores */}
            <div className="space-y-3">
              <Award className="w-12 h-12 text-m2-green mx-auto" />
              <h3 className="text-2xl font-bold text-white">Nossos Valores</h3>
              <p className="text-gray-400">Segurança em primeiro lugar, paixão pela inovação, compromisso com a qualidade e parceria genuína com cada cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção da Equipe */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold uppercase text-white">Nossa <span className="text-m2-green">Equipe</span></h2>
          <p className="text-gray-400 mt-2">Pilotos certificados e videomakers experientes prontos para o seu projeto.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            {/* Membro 1 */}
            <div className="bg-m2-dark p-6 rounded-lg border border-gray-800">
              <Image src="/assets/about/equipe-membro-1.png" alt="Foto de Matheus Castro" width={120} height={120} className="rounded-full mx-auto mb-4 border-2 border-m2-green" />
              <h3 className="text-xl font-bold text-white">Matheus Castro</h3>
              <p className="text-m2-green">Fundador & Piloto de Drone</p>
            </div>
            {/* Membro 2 */}
            <div className="bg-m2-dark p-6 rounded-lg border border-gray-800">
              <Image src="/assets/about/equipe-membro-2.png" alt="Foto de [Nome do Sócio]" width={120} height={120} className="rounded-full mx-auto mb-4 border-2 border-m2-green" />
              <h3 className="text-xl font-bold text-white">[Nome do Sócio]</h3>
              <p className="text-m2-green">Videomaker & Editor</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
// src/app/(main)/portfolio/[id]/page.tsx

import { allPortfolioItems } from "@/data/portfolio";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

// Esta função busca os dados do projeto. É um Componente de Servidor.
export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // Encontra o projeto no nosso array de dados com base no ID da URL
  const project = allPortfolioItems.find(item => item.id === params.id);

  // Se nenhum projeto for encontrado com esse ID, mostra a página 404
  if (!project) {
    notFound();
  }

  return (
    <>
      {/* Seção de Título */}
      <section className="bg-m2-dark pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="container mx-auto px-6">
          <p className="text-m2-green font-semibold mb-2">{project.category}</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Seção de Conteúdo do Projeto */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Imagem de Destaque */}
          <div className="mb-12">
            <Image
              src={project.image.replace('600x400', '1200x675')} // Pede uma imagem maior
              alt={`Imagem de destaque do projeto ${project.title}`}
              width={1200}
              height={675}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>

          {/* Descrição Longa */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Sobre o Projeto</h2>
            <p className="text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Link de volta */}
          <div className="mt-16 text-center">
            <Link href="/portfolio" className="text-m2-green font-bold hover:underline text-lg">
              &larr; Voltar para todos os projetos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
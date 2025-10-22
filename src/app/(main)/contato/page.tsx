// src/app/(main)/contato/page.tsx
'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';
import { FaInstagram, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaTiktok } from 'react-icons/fa';
import InputMask from 'react-input-mask';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ContatoPage() {
  const [messageLength, setMessageLength] = useState(0);
  const [service, setService] = useState(""); 

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setFormStatus({ submitted: true, success: true, message: 'Obrigado pelo contato! Sua mensagem foi enviada com sucesso.' });
        form.reset(); 
        setMessageLength(0);
        setService(""); // Limpa o estado do select
      } else {
        const responseData = await response.json();
        if (responseData.errors) {
            setFormStatus({ submitted: true, success: false, message: responseData.errors.map((error: { message: string }) => error.message).join(', ') });
        } else {
            setFormStatus({ submitted: true, success: false, message: 'Ocorreu um erro ao enviar o formulário. Tente novamente.' });
        }
      }
    } catch (error) {
      console.error("Erro de rede ao enviar formulário:", error);
      setFormStatus({ submitted: true, success: false, message: 'Ocorreu um erro de rede. Verifique sua conexão e tente novamente.' });
    }
  };

  return (
    <main>
      <Header />

      <div className="pt-28 md:pt-32 bg-black"> 
        <section id="contato" className="py-5 bg-black">
          <div className="container mx-auto px-6">
            <div className="bg-m2-dark rounded-lg shadow-lg p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
              
              <div className="text-center md:text-left flex flex-col h-full">
                <div>
                  <h2 className="text-3xl font-bold uppercase">Fale <span className="text-m2-green">Conosco</span></h2>
                  <p className="text-gray-400 mt-4 max-w-md">
                    Pronto para iniciar seu projeto? Preencha o formulário ao lado e vamos transformar sua ideia em realidade. Nossa equipe entrará em contato o mais breve possível.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <p className="text-gray-400 mb-4">
                    Ou se preferir, entre em contato através dos seguintes canais:
                  </p>
                  <div className="space-y-4">
                    <a href="mailto:contato@m2projecta.com.br" className="flex items-center group">
                      <FaEnvelope className="text-m2-green mr-3 h-5 w-5" />
                      <span className="relative text-gray-300 group-hover:text-m2-green transition-colors">
                        contato@m2projecta.com.br
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                    </a>
                    <a href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                      <FaWhatsapp className="text-m2-green mr-3 h-5 w-5" />
                      <span className="relative text-gray-300 group-hover:text-m2-green transition-colors">
                        (12) 99131-6774
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                    </a>
                    <a href="https://www.instagram.com/m2projecta/" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                      <FaInstagram className="text-m2-green mr-3 h-5 w-5" />
                      <span className="relative text-gray-300 group-hover:text-m2-green transition-colors">
                        @m2projecta
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                    </a>
                    <a href="https://tiktok.com/@m2.projecta" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                      <FaTiktok className="text-m2-green mr-3 h-5 w-5" />
                      <span className="relative text-gray-300 group-hover:text-m2-green transition-colors">
                        @m2.projecta
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                   <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Área de Atuação</h3>
                   <div className="flex flex-col items-center justify-center md:items-start">
                      <div className="flex items-center mb-4">
                          <FaMapMarkerAlt className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                          <p className="text-gray-300">Taubaté - SP e Região (Vale do Paraíba)</p>
                      </div>
                      <div className="w-full max-w-sm md:max-w-md mt-4 px-4 sm:px-0">
                          <Image
                              src="/assets/svg/mapa-sp-valeparaiba.png"
                              alt="Mapa do estado de São Paulo com o Vale do Paraíba destacado"
                              width={500}
                              height={400}
                              className="w-full h-auto"
                          />
                      </div>
                   </div>
                </div>
              </div>

              <div className="max-w-md mx-auto md:mx-0 w-full">
                <form 
                  action="https://formspree.io/f/xjkajkbq"
                  method="POST" 
                  className="space-y-6"
                  onSubmit={handleFormSubmit}
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                    <input type="text" id="name" name="name" placeholder="Seu nome completo" className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                    <input type="email" id="email" name="email" placeholder="seu.email@exemplo.com" className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefone / WhatsApp</label>
                    <InputMask
                      mask="(99) 99999-9999"
                      id="phone"
                      name="phone"
                      placeholder="(12) 91234-5678"
                      className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">Cidade / Região</label>
                    <input type="text" id="city" name="city" placeholder="Ex: Taubaté - SP" className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Serviço</Label>
                    <Select value={service} onValueChange={setService} name="service" required>
                      <SelectTrigger className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green h-auto">
                        <SelectValue placeholder="Selecione um serviço de interesse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marketing Imobiliário">Marketing Imobiliário</SelectItem>
                        <SelectItem value="Vídeos Corporativos">Vídeos Corporativos</SelectItem>
                        <SelectItem value="Cobertura de Evento">Cobertura de Evento</SelectItem>
                        <SelectItem value="Turismo e Hotelaria">Turismo e Hotelaria</SelectItem>
                        <SelectItem value="Acompanhamento de Obra">Acompanhamento de Obra</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensagem</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={4} 
                      placeholder="Conte-nos um pouco sobre o seu projeto..." 
                      maxLength={500}
                      className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" 
                      required
                      onChange={(e) => setMessageLength(e.target.value.length)}
                    ></textarea>
                    <p className="text-right text-sm text-gray-400 mt-1">
                      {messageLength} / 500
                    </p>
                  </div>
                  <div className="text-center pt-2">
                    <button type="submit" className="bg-m2-green text-black font-bold py-3 px-10 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 w-full">
                      Enviar Mensagem
                    </button>
                  </div>
                </form>
                {formStatus.submitted && (
                  <div className={`mt-4 text-center p-3 rounded-md ${formStatus.success ? 'bg-green-900/50 text-m2-green' : 'bg-red-900/50 text-red-400'}`}>
                    {formStatus.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
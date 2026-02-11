// src/app/(main)/contato/contact-client.tsx
'use client'; 

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FaInstagram, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaTiktok } from 'react-icons/fa';
import InputMask from 'react-input-mask';
import { Header } from '@/components/layout/Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Service } from '@prisma/client';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactClientPage({ services }: { services: Service[] }) {
  const [messageLength, setMessageLength] = useState(0);
  const [service, setService] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para o Captcha
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    // Anexa o token do ReCAPTCHA
    if (recaptchaToken) {
        data.append('g-recaptcha-response', recaptchaToken);
    }

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
        setService("");
        
        // Resetar Captcha
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      } else {
        const responseData = await response.json();
        
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);

        if (responseData.errors) {
            setFormStatus({ submitted: true, success: false, message: responseData.errors.map((error: { message: string }) => error.message).join(', ') });
        } else {
            setFormStatus({ submitted: true, success: false, message: 'Ocorreu um erro ao enviar o formulário. Tente novamente.' });
        }
      }
    } catch (error) {
      console.error("Erro de rede ao enviar formulário:", error);
      setFormStatus({ submitted: true, success: false, message: 'Ocorreu um erro de rede. Verifique sua conexão e tente novamente.' });
      
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-[100vw] overflow-x-hidden bg-[#050505] min-h-screen">
      <Header services={services} />

      {/* HERO SECTION DE CONTATO */}
      <section className="relative w-full pb-10 bg-black overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-28 md:pt-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-m2-green/10 blur-[120px] md:blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white leading-tight">
                  Fale <span className="text-m2-green">Conosco</span>
              </h1>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  Compartilhe sua ideia. Estamos prontos para estruturar a melhor solução audiovisual para o seu projeto.
              </p>
          </div>
      </section>

      <section id="contato" className="pb-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-start">
            
            {/* Lado Esquerdo: Infos */}
            <div className="text-center md:text-left flex flex-col h-full space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Canais de Atendimento</h3>
                  <div className="space-y-4">
                      <a href="mailto:contato@m2projecta.com.br" className="flex items-center justify-center md:justify-start group gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-m2-green/20 transition-colors">
                            <FaEnvelope className="text-m2-green h-5 w-5" />
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors">contato@m2projecta.com.br</span>
                      </a>
                      <a href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start group gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-m2-green/20 transition-colors">
                            <FaWhatsapp className="text-m2-green h-5 w-5" />
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors">(12) 99131-6774</span>
                      </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Siga a M2</h3>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                      <a href="https://www.instagram.com/m2projecta/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-m2-green hover:border-m2-green hover:bg-m2-green/10 transition-all">
                          <FaInstagram className="h-6 w-6" />
                      </a>
                      <a href="https://tiktok.com/@m2.projecta" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-m2-green hover:border-m2-green hover:bg-m2-green/10 transition-all">
                          <FaTiktok className="h-6 w-6" />
                      </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Localização</h3>
                  <div className="flex flex-col items-center md:items-start">
                      <div className="flex items-center mb-4 gap-3">
                          <FaMapMarkerAlt className="text-m2-green h-5 w-5 flex-shrink-0" />
                          <p className="text-gray-300">Taubaté - SP e Região (Vale do Paraíba)</p>
                      </div>
                      <div className="relative w-full max-w-[300px] h-[200px] rounded-xl overflow-hidden border border-white/10 opacity-80 hover:opacity-100 transition-opacity bg-[#050505]">
                          <Image
                              src="/assets/svg/mapa-sp-valeparaiba.png"
                              alt="Mapa Vale do Paraíba"
                              fill
                              className="object-contain p-2"
                          />
                      </div>
                  </div>
                </div>
            </div>

            {/* Lado Direito: Formulário */}
            <div className="w-full">
              <form 
                action="https://formspree.io/f/xjkajkbq"
                method="POST" 
                className="space-y-5"
                onSubmit={handleFormSubmit}
              >
                <div className="grid grid-cols-1 gap-5">
                  <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-400 mb-1 ml-1">Nome</label>
                      <input type="text" id="name" name="name" placeholder="Seu nome" className="block w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-transparent transition-all" required />
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-400 mb-1 ml-1">E-mail</label>
                      <input type="email" id="email" name="email" placeholder="seu@email.com" className="block w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-transparent transition-all" required />
                  </div>
                  <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-400 mb-1 ml-1">WhatsApp</label>
                      <InputMask mask="(99) 99999-9999" id="phone" name="phone" placeholder="(12) 99999-9999" className="block w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-transparent transition-all" required />
                  </div>
                  <div>
                      <label htmlFor="city" className="block text-sm font-bold text-gray-400 mb-1 ml-1">Cidade</label>
                      <input type="text" id="city" name="city" placeholder="Ex: Taubaté - SP" className="block w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-transparent transition-all" required />
                  </div>
                  
                  {/* SELECT DE INTERESSE ATUALIZADO */}
                  <div>
                      <Label htmlFor="service" className="block text-sm font-bold text-gray-400 mb-1 ml-1">Interesse</Label>
                      <Select value={service} onValueChange={setService} name="service" required>
                          <SelectTrigger className="w-full bg-black/50 border-white/10 rounded-xl py-3 px-4 text-white focus:ring-m2-green border-none h-auto">
                              <SelectValue placeholder="Selecione o serviço" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111] border-white/10 text-white">
                              {/* Mapeamento dinâmico dos serviços vindos do banco */}
                              {services.map((s) => (
                                <SelectItem 
                                  key={s.id} 
                                  value={s.name}
                                  className="focus:bg-m2-green/20 focus:text-m2-green cursor-pointer"
                                >
                                  {s.name}
                                </SelectItem>
                              ))}
                              
                              {/* Opção fixa 'Outro' */}
                              <SelectItem 
                                value="Outro"
                                className="focus:bg-m2-green/20 focus:text-m2-green cursor-pointer font-bold border-t border-white/10 mt-1"
                              >
                                Outro
                              </SelectItem>
                          </SelectContent>
                      </Select>
                  </div>

                  <div>
                      <label htmlFor="message" className="block text-sm font-bold text-gray-400 mb-1 ml-1">Mensagem</label>
                      <textarea 
                          id="message" name="message" rows={4} placeholder="Como podemos ajudar?" maxLength={500} 
                          className="block w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-transparent transition-all resize-none" 
                          required onChange={(e) => setMessageLength(e.target.value.length)}
                      ></textarea>
                      <p className="text-right text-xs text-gray-500 mt-1">{messageLength} / 500</p>
                  </div>
                </div>

                <div className="flex justify-center py-2">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(token) => setRecaptchaToken(token)}
                        theme="dark"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting || !recaptchaToken} 
                    className="w-full bg-m2-green text-black font-black uppercase tracking-wider py-4 rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>

              {formStatus.submitted && (
                <div className={`mt-4 text-center p-3 rounded-xl border ${formStatus.success ? 'bg-m2-green/10 border-m2-green/20 text-m2-green' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {formStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
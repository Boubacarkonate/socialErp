'use client';

import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  role: 'bot' | 'user';
  text: string;
  time: string;
};

const getTime = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const SUGGESTIONS = [
  "Voir les produits",
  "Mon panier",
  "Suivre ma commande",
  "Contacter l'équipe",
];

function getBotReply(input: string): string {
  const q = input.toLowerCase().trim();

  if (/(bonjour|salut|hello|hey|bonsoir|coucou)/.test(q))
    return "Bonjour ! Je suis l'assistant Social ERP. Je peux vous aider à trouver un produit, suivre une commande ou vous orienter dans l'application. Comment puis-je vous aider ?";

  if (/(produit|catalogue|article|acheter|achat|boutique)/.test(q))
    return "Notre catalogue propose des produits éco-responsables : gourdes inox, thermos, lunchbox, bocaux en verre et bien plus. Rendez-vous sur la page **Produits** pour tout parcourir et filtrer par catégorie.";

  if (/(panier|cart|commande|commander)/.test(q))
    return "Vous pouvez ajouter des articles à votre panier depuis le catalogue, puis finaliser votre achat via le bouton panier en haut à droite. Le paiement est sécurisé par Stripe.";

  if (/(livraison|délai|expédition|envoi)/.test(q))
    return "Nous livrons sous 3 à 5 jours ouvrés. Toutes nos livraisons sont éco-responsables avec un emballage recyclé. Vous recevrez un email de confirmation après votre commande.";

  if (/(stock|disponible|dispo|rupture)/.test(q))
    return "Le stock est affiché en temps réel sur chaque fiche produit. Un badge **Stock bas** apparaît quand il reste moins de 5 unités, et **Épuisé** quand le produit n'est plus disponible.";

  if (/(prix|tarif|coût|combien)/.test(q))
    return "Nos prix varient selon les produits. Vous pouvez trier le catalogue par prix croissant ou décroissant pour trouver ce qui correspond à votre budget.";

  if (/(compte|profil|mon compte|paramètre)/.test(q))
    return "Vous pouvez gérer votre profil (nom, photo, email) depuis la page **Profil**. Si vous avez besoin de modifier votre rôle, contactez un administrateur.";

  if (/(planning|calendrier|événement|réunion)/.test(q))
    return "Le planning collaboratif est accessible depuis le menu. Il permet de créer et suivre des événements d'équipe. Cliquez sur un événement pour le supprimer.";

  if (/(admin|administration|tableau de bord|dashboard)/.test(q))
    return "Le tableau de bord admin affiche les statistiques en temps réel : chiffre d'affaires, commandes récentes, produits les plus vendus et alertes de stock.";

  if (/(équipe|team|collaborat)/.test(q))
    return "L'espace Équipe permet de gérer les produits et le planning. Les membres de l'équipe peuvent modifier le catalogue et consulter le planning.";

  if (/(contact|aide|support|problème|bug)/.test(q))
    return "Pour toute assistance, vous pouvez contacter l'équipe via l'espace Planning ou envoyer un message à l'administrateur. Nous répondons sous 24h.";

  if (/(merci|super|parfait|génial|cool|nickel|top)/.test(q))
    return "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne navigation sur Social ERP !";

  if (/(au revoir|bye|à bientôt|bonne journée)/.test(q))
    return "À bientôt ! Bonne journée et merci d'utiliser Social ERP.";

  if (/(eco|écolo|responsable|environnement|durable|vert|bio)/.test(q))
    return "Tous nos produits sont sélectionnés pour leur impact environnemental réduit. Emballages recyclés, matériaux durables (inox, bambou, verre) et fabrication responsable sont nos priorités.";

  if (/(gourde|thermos|lunchbox|bocal|bouteille|pot)/.test(q))
    return "Ce produit fait partie de notre gamme éco-responsable. Retrouvez sa fiche complète avec photos, description et stock sur la page Produits. Vous pouvez l'ajouter directement au panier depuis la fiche.";

  return "Je ne suis pas sûr de comprendre votre demande. Vous pouvez me demander des infos sur les **produits**, le **panier**, les **commandes**, la **livraison** ou votre **compte**. Comment puis-je vous aider ?";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Bonjour ! Je suis l'assistant Social ERP. Comment puis-je vous aider aujourd'hui ?", time: getTime() }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    const userMsg: Message = { role: 'user', text: msg, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(msg);
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: getTime() }]);
    }, 800 + Math.random() * 500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatText = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-surface-700 border border-surface-600' : 'bg-brand-600 hover:bg-brand-500 shadow-brand'
        }`}
        aria-label="Assistant"
      >
        {open
          ? <X size={20} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
        {!open && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-accent-400 rounded-full border-2 border-surface-900" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-surface-700/60 bg-surface-900 animate-fade-in">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-800 border-b border-surface-700/50">
            <div className="relative">
              <div className="w-9 h-9 bg-brand-600/20 border border-brand-500/30 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-brand-400" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-400 rounded-full border-2 border-surface-800" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold leading-none">Assistant ERP</p>
              <p className="text-accent-400 text-xs mt-0.5">En ligne</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-surface-500 hover:text-white transition-colors">
              <Minimize2 size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'bot' ? 'bg-brand-600/20 border border-brand-500/30' : 'bg-surface-700 border border-surface-600'
                }`}>
                  {msg.role === 'bot'
                    ? <Bot size={13} className="text-brand-400" />
                    : <User size={13} className="text-surface-300" />
                  }
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'bot'
                      ? 'bg-surface-800 border border-surface-700/50 text-surface-200 rounded-tl-sm'
                      : 'bg-brand-600 text-white rounded-tr-sm'
                  }`}
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                  <span className="text-surface-600 text-[10px] px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0">
                  <Bot size={13} className="text-brand-400" />
                </div>
                <div className="px-3 py-3 bg-surface-800 border border-surface-700/50 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && !typing && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-2.5 py-1 bg-surface-800 hover:bg-brand-600/20 border border-surface-700 hover:border-brand-500/40 text-surface-400 hover:text-brand-300 rounded-full transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-surface-700/50 bg-surface-800/50 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez votre question…"
              className="flex-1 bg-surface-800 border border-surface-700 text-surface-200 placeholder-surface-600 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="w-9 h-9 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

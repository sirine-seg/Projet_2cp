import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const faqs = [
    { question: "Qu'est-ce que ESI TRACK ?", answer: "ESI TRACK est une plateforme de gestion de maintenance." },
    { question: "Qui peut utiliser ESI TRACK ?", answer: "Tous les étudiants et enseignants de l'ESI peuvent l'utiliser." },
    { question: "Comment signaler un problème d'équipement ?", answer: "Vous pouvez signaler un problème via l'application." },
    { question: "Mes données sont-elles sécurisées ?", answer: "Oui, toutes les données sont cryptées et sécurisées." },
    { question: "Puis-je suggérer des fonctionnalités ?", answer: "Oui, vous pouvez soumettre des suggestions via le formulaire." },
    { question: "Comment contacter l'équipe de support ?", answer: "L'équipe de support est joignable par email ou téléphone." },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto w-[1164px] bg-white shadow-md border border-black p-6">
      <div className="text-center text-blue-800 text-5xl font-bold">FAQ</div>
      <div className="text-center text-gray-600 text-xl opacity-70 mt-2">
        Trouvez la réponse à vos questions!
      </div>
      <div className="mt-10 space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300">
            <div
              className="flex justify-between items-center py-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-zinc-500 text-2xl font-medium">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-zinc-500 w-6 h-6" />
              ) : (
                <ChevronDown className="text-zinc-500 w-6 h-6" />
              )}
            </div>
            {openIndex === index && (
              <div className="text-gray-600 text-lg p-4 bg-gray-100 rounded transition-all duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

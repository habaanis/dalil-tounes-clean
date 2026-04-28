import React from 'react';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

const MentionsLegales: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title="Mentions Légales — Dalil Tounes"
        description="Mentions légales du site dalil-tounes.com : éditeur, hébergeur, responsabilité et protection des données."
      />

      <div className="pt-16 pb-10 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">
            Informations légales
          </span>
          <h1
            className="text-3xl md:text-4xl font-light text-gray-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mentions Légales
          </h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">

        {/* 1. Éditeur */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            1. Éditeur du site
          </h2>
          <p>
            Le présent site internet accessible à l'adresse{' '}
            <span className="font-medium">www.dalil-tounes.com</span> est édité par :
          </p>
          <ul className="mt-3 space-y-1 pl-4 border-l-2 border-[#D4AF37]">
            <li><span className="font-medium">Nom :</span> Anis Taieb HABA</li>
            <li><span className="font-medium">Statut :</span> Entrepreneur individuel</li>
            <li><span className="font-medium">SIRET :</span> 89217073900015</li>
            <li><span className="font-medium">Siège social :</span> 266, rue de l'école</li>
            <li>
              <span className="font-medium">Contact :</span>{' '}
              <a
                href="mailto:contact@dalil-tounes.com"
                className="text-[#D4AF37] hover:underline"
              >
                contact@dalil-tounes.com
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-500 italic">
            Le nom commercial <span className="font-medium not-italic">« Ste Dalil Tounes »</span> est
            réservé au Registre National des Entreprises (RNE) de Tunisie sous le numéro{' '}
            <span className="font-medium not-italic">2026134575186</span>. Toute utilisation non
            autorisée de ce nom constitue une atteinte aux droits de son titulaire et est susceptible
            d'engager la responsabilité civile et pénale de son auteur.
          </p>
        </section>

        {/* 2. Hébergeur */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            2. Hébergement
          </h2>
          <p>Le site est hébergé par :</p>
          <ul className="mt-3 space-y-1 pl-4 border-l-2 border-[#D4AF37]">
            <li><span className="font-medium">Société :</span> Namecheap, Inc.</li>
            <li>
              <span className="font-medium">Adresse :</span> 4600 East Washington Street,
              Suite 300, Phoenix, AZ 85034, États-Unis d'Amérique
            </li>
            <li>
              <span className="font-medium">Site :</span>{' '}
              <a
                href="https://www.namecheap.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline"
              >
                www.namecheap.com
              </a>
            </li>
          </ul>
        </section>

        {/* 3. Objet */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            3. Objet du site
          </h2>
          <p>
            Dalil Tounes est une plateforme d'annuaire en ligne à destination des professionnels et
            des particuliers en Tunisie. Elle a pour vocation de mettre en relation des utilisateurs
            avec des entreprises, prestataires de services et professionnels de santé référencés sur
            le territoire tunisien.
          </p>
        </section>

        {/* 4. Responsabilité – mise en relation */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            4. Limitation de responsabilité — Mise en relation
          </h2>
          <p>
            Dalil Tounes agit en qualité d'intermédiaire technique et ne saurait être tenu responsable
            des relations contractuelles, commerciales ou autres qui pourraient s'établir entre les
            utilisateurs et les entreprises ou professionnels référencés sur la plateforme.
          </p>
          <p className="mt-3">
            Les informations figurant sur les fiches professionnelles (coordonnées, horaires, tarifs,
            description des activités) sont fournies par les professionnels eux-mêmes ou collectées à
            partir de sources publiques. L'éditeur ne garantit pas l'exactitude, l'exhaustivité ni la
            mise à jour en temps réel de ces données.
          </p>
          <p className="mt-3">
            En conséquence, toute décision prise par un utilisateur sur la base des informations
            consultées sur la plateforme relève de sa seule appréciation. L'éditeur décline toute
            responsabilité quant aux dommages directs ou indirects pouvant résulter de l'utilisation
            de ces informations ou d'une mise en relation effectuée via la plateforme.
          </p>
        </section>

        {/* 5. Avertissement e-santé */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            5. Avertissement — Section e-santé
          </h2>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="font-medium text-amber-900 mb-2">
              Important : Les informations de la section santé ne constituent pas un avis médical.
            </p>
            <p className="text-amber-800">
              Les contenus publiés dans la rubrique « Santé » du site Dalil Tounes ont une vocation
              exclusivement informative et générale. Ils ne sauraient en aucun cas se substituer à une
              consultation médicale, à un diagnostic établi par un professionnel de santé qualifié, ni
              à un traitement prescrit par un médecin.
            </p>
            <p className="mt-2 text-amber-800">
              En cas de symptômes, de doute sur votre état de santé ou de situation d'urgence
              médicale, l'utilisateur est expressément invité à consulter un médecin ou à contacter
              les services d'urgence compétents. L'éditeur décline toute responsabilité en cas
              d'utilisation des informations de santé publiées sur la plateforme à des fins
              diagnostiques ou thérapeutiques.
            </p>
          </div>
        </section>

        {/* 6. Propriété intellectuelle */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            6. Propriété intellectuelle
          </h2>
          <p>
            L'ensemble des éléments composant le site Dalil Tounes (structure, textes, graphismes,
            logotype, icônes, images, code source) est protégé par les dispositions du Code de la
            propriété intellectuelle applicable en France. Toute reproduction, représentation,
            modification, publication ou adaptation, totale ou partielle, de ces éléments sans
            l'autorisation préalable et écrite de l'éditeur est strictement interdite et constitutive
            d'une contrefaçon.
          </p>
        </section>

        {/* 7. Données personnelles */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            7. Protection des données personnelles
          </h2>
          <p>
            Les données à caractère personnel collectées via le site sont traitées conformément au
            Règlement général sur la protection des données (RGPD — Règlement UE 2016/679) et à la
            législation française en vigueur.
          </p>
          <p className="mt-3">
            L'utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation
            du traitement et de portabilité de ses données. Il peut exercer ces droits en adressant
            une demande écrite à l'adresse :{' '}
            <a
              href="mailto:contact@dalil-tounes.com"
              className="text-[#D4AF37] hover:underline"
            >
              contact@dalil-tounes.com
            </a>.
          </p>
          <p className="mt-3">
            Pour plus d'informations, veuillez consulter notre{' '}
            <a href="/#/privacy-policy" className="text-[#D4AF37] hover:underline">
              Politique de confidentialité
            </a>.
          </p>
        </section>

        {/* 8. Droit applicable */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            8. Droit applicable et juridiction compétente
          </h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige
            relatif à l'interprétation ou à l'exécution des présentes, et à défaut de résolution
            amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

        {/* Mise à jour */}
        <p className="text-xs text-gray-400 pt-6 border-t border-gray-100">
          Dernière mise à jour : avril 2026
        </p>
      </div>
    </div>
  );
};

export default MentionsLegales;

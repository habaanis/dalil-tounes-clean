import React from 'react';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title="Politique de Confidentialité — Dalil Tounes"
        description="Politique de confidentialité et protection des données personnelles du site dalil-tounes.com, conformément au RGPD."
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
            Politique de Confidentialité
          </h1>
          <p className="mt-4 text-xs text-gray-400">Dernière mise à jour : 28 avril 2026</p>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            1. Collecte des données
          </h2>
          <p>
            Nous collectons des informations lorsque vous utilisez la plateforme{' '}
            <span className="font-medium">dalil-tounes.com</span>, notamment :
          </p>
          <ul className="mt-3 space-y-2 pl-4 border-l-2 border-[#D4AF37]">
            <li>
              <span className="font-medium">Données d'inscription :</span> nom, adresse
              e-mail, lorsque vous créez un compte ou remplissez un formulaire sur la plateforme.
            </li>
            <li>
              <span className="font-medium">Données de navigation :</span> adresse IP, type
              de navigateur et pages visitées, collectées via des cookies afin d'améliorer votre
              expérience utilisateur.
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            2. Utilisation des informations
          </h2>
          <p>
            Les informations que nous recueillons peuvent être utilisées aux fins suivantes :
          </p>
          <ul className="mt-3 space-y-2 pl-4 border-l-2 border-[#D4AF37]">
            <li>Personnaliser votre expérience sur dalil-tounes.com.</li>
            <li>
              Vous fournir des informations relatives aux services de santé, d'éducation ou de
              loisirs disponibles sur la plateforme.
            </li>
            <li>Améliorer notre site web et la qualité du support client.</li>
            <li>
              Vous contacter par e-mail dans le cadre de notre newsletter, uniquement si vous avez
              donné votre consentement explicite.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            3. Protection des données — RGPD
          </h2>
          <p>
            En tant qu'éditeur basé en France (Anis Taieb HABA), nous nous engageons à respecter le
            Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679). Vos
            données personnelles sont traitées de manière sécurisée et ne sont en aucun cas vendues,
            louées ou cédées à des tiers à des fins commerciales.
          </p>
          <p className="mt-3">
            <span className="font-medium">Hébergement des données :</span> Vos données sont stockées
            sur les serveurs de <span className="font-medium">Namecheap, Inc.</span> (4600 East
            Washington Street, Suite 300, Phoenix, AZ 85034, États-Unis), qui applique des mesures
            de sécurité techniques et organisationnelles conformes aux standards internationaux en
            vigueur. Ce transfert de données hors de l'Union européenne est encadré par les
            garanties appropriées prévues par le RGPD.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            4. Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants concernant vos données
            personnelles :
          </p>
          <ul className="mt-3 space-y-2 pl-4 border-l-2 border-[#D4AF37]">
            <li><span className="font-medium">Droit d'accès :</span> obtenir une copie des données vous concernant.</li>
            <li><span className="font-medium">Droit de rectification :</span> corriger toute information inexacte ou incomplète.</li>
            <li><span className="font-medium">Droit à l'effacement :</span> demander la suppression de vos données (« droit à l'oubli »).</li>
            <li><span className="font-medium">Droit à la limitation :</span> restreindre le traitement de vos données dans certains cas.</li>
            <li><span className="font-medium">Droit à la portabilité :</span> recevoir vos données dans un format structuré et lisible.</li>
          </ul>
          <p className="mt-4">
            Pour exercer l'un de ces droits, adressez votre demande par e-mail à :{' '}
            <a
              href="mailto:contact@dalil-tounes.com"
              className="text-[#D4AF37] hover:underline"
            >
              contact@dalil-tounes.com
            </a>. Nous nous engageons à répondre dans un délai d'un mois à compter de la réception
            de votre demande.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            5. Cookies
          </h2>
          <p>
            Nous utilisons des cookies afin d'améliorer l'accès à notre site et d'identifier les
            visiteurs réguliers. Les cookies sont de petits fichiers texte déposés sur votre
            appareil qui ne collectent aucune information personnelle identifiable.
          </p>
          <p className="mt-3">
            Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies ou être
            averti de leur dépôt. Le refus des cookies peut toutefois limiter certaines
            fonctionnalités du site.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            6. Consentement
          </h2>
          <p>
            En utilisant le site dalil-tounes.com, vous reconnaissez avoir pris connaissance de la
            présente Politique de Confidentialité et consentez au traitement de vos données
            personnelles conformément aux conditions décrites ci-dessus. Ce consentement est
            révocable à tout moment en adressant une demande à l'adresse :{' '}
            <a
              href="mailto:contact@dalil-tounes.com"
              className="text-[#D4AF37] hover:underline"
            >
              contact@dalil-tounes.com
            </a>.
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-6 border-t border-gray-100">
          Dernière mise à jour : 28 avril 2026
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

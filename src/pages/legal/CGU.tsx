import React from 'react';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

const CGU: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title="Conditions Générales d'Utilisation — Dalil Tounes"
        description="Conditions générales d'utilisation du site dalil-tounes.com : accès, services de mise en relation, responsabilité et droit applicable."
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
            Conditions Générales d'Utilisation
          </h1>
          <p className="mt-4 text-xs text-gray-400">Dernière mise à jour : 28 avril 2026</p>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            1. Objet
          </h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de
            définir les modalités d'accès et d'utilisation du site{' '}
            <span className="font-medium">dalil-tounes.com</span> (ci-après « le Site »). En
            naviguant sur le Site, l'utilisateur accepte sans réserve l'ensemble des présentes
            conditions. Si l'utilisateur n'accepte pas ces conditions, il lui appartient de ne pas
            utiliser le Site.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            2. Services de mise en relation
          </h2>
          <p>
            Dalil Tounes est une plateforme de référencement. Elle a pour vocation de faciliter la
            mise en relation entre les utilisateurs et des prestataires tiers (entreprises, médecins,
            commerces, etc.) référencés dans l'annuaire.
          </p>
          <ul className="mt-4 space-y-3 pl-4 border-l-2 border-[#D4AF37]">
            <li>
              <span className="font-medium">Indépendance :</span> Dalil Tounes n'est pas partie
              prenante des contrats, accords ou transactions conclus entre l'utilisateur et les
              prestataires référencés. La plateforme agit exclusivement en qualité d'intermédiaire
              technique.
            </li>
            <li>
              <span className="font-medium">Absence de garantie :</span> L'éditeur ne garantit pas
              la disponibilité, la qualité, la conformité, la licéité ni l'exactitude des services
              ou informations fournis par les tiers inscrits sur l'annuaire. Il appartient à
              l'utilisateur de procéder à toutes les vérifications qu'il juge nécessaires avant
              d'engager une relation commerciale ou contractuelle avec un prestataire.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            3. Avertissement spécifique — Section E-Santé
          </h2>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
            <p className="font-medium text-amber-900">
              Le contenu de la section « E-Santé » est fourni à titre informatif uniquement.
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Pas de conseil médical :</span> Dalil Tounes n'est pas
              un professionnel de santé. Les informations publiées sur la plateforme ne constituent
              en aucun cas un diagnostic médical, une prescription ou un avis thérapeutique. Elles
              ne sauraient se substituer à une consultation auprès d'un médecin ou d'un
              professionnel de santé qualifié.
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Urgence médicale :</span> En cas d'urgence médicale,
              l'utilisateur doit immédiatement contacter les services de secours officiels compétents
              (SAMU, pompiers ou services d'urgence locaux). L'éditeur décline toute responsabilité
              en cas d'utilisation des informations publiées à des fins diagnostiques ou
              thérapeutiques.
            </p>
          </div>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            4. Responsabilité de l'utilisateur
          </h2>
          <p>L'utilisateur s'engage à utiliser le Site de manière loyale et conforme aux lois et réglementations en vigueur. À ce titre, il s'interdit notamment :</p>
          <ul className="mt-3 space-y-2 pl-4 border-l-2 border-[#D4AF37]">
            <li>
              de publier des contenus illicites, injurieux, diffamatoires, obscènes, menaçants ou
              portant atteinte aux droits de tiers, notamment dans les avis ou commentaires ;
            </li>
            <li>
              d'utiliser le Site à des fins frauduleuses, commerciales non autorisées ou contraires
              à l'ordre public et aux bonnes mœurs ;
            </li>
            <li>
              de tenter de perturber ou d'altérer le fonctionnement technique de la plateforme.
            </li>
          </ul>
          <p className="mt-3">
            Tout manquement aux présentes obligations pourra entraîner la suppression des contenus
            concernés et, le cas échéant, l'engagement de la responsabilité civile et pénale de
            l'utilisateur fautif.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            5. Propriété intellectuelle
          </h2>
          <p>
            L'ensemble des éléments constitutifs du Site (textes, logotypes, design, images,
            structure, code source) sont la propriété exclusive d'Anis Taieb HABA et sont protégés
            par les lois relatives à la propriété intellectuelle et au droit d'auteur. Toute
            reproduction, représentation, utilisation ou adaptation, totale ou partielle, de ces
            éléments sans l'autorisation préalable et écrite de l'éditeur est strictement interdite
            et constitue une contrefaçon susceptible d'engager la responsabilité civile et pénale de
            son auteur.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">
            6. Modification des CGU et droit applicable
          </h2>
          <p>
            L'éditeur se réserve le droit de modifier les présentes CGU à tout moment, sans
            notification préalable. Les modifications prennent effet dès leur publication sur le
            Site. Il appartient à l'utilisateur de consulter régulièrement les CGU afin de prendre
            connaissance de toute évolution.
          </p>
          <p className="mt-3">
            Les présentes CGU sont régies par le droit français. En cas de litige relatif à leur
            interprétation ou à leur exécution, et à défaut de résolution amiable, les tribunaux
            français seront seuls compétents.
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-6 border-t border-gray-100">
          Dernière mise à jour : 28 avril 2026
        </p>
      </div>
    </div>
  );
};

export default CGU;

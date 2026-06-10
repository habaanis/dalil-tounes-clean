import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessCard } from '../components/BusinessCard';
import UnifiedBusinessCard from '../components/UnifiedBusinessCard';
import SeoBusinessCard from '../components/seo/SeoBusinessCard';
import MeilleursSection from '../components/MeilleursSection';

const TEST_BUSINESS = {
  id: 'preview-adea-001',
  nom: 'AdeA - German School',
  name: 'AdeA - German School',
  ville: 'Tunis',
  gouvernorat: 'Tunis',
  adresse: 'Rue du Lac Biwa, Les Berges du Lac',
  categorie: 'Centre de Langues',
  category: 'Centre de Langues',
  sous_categories: 'Centre de Langues',
  sous_categories_clean: 'Centre de Langues',
  description: 'Ecole allemande reconnue proposant des cours de langue allemande certifies, preparation aux examens Goethe et programmes culturels.',
  telephone: '+216 71 123 456',
  statut_abonnement: null,
  niveau_priorite_abonnement: null,
  image_url: null,
  imageUrl: null,
  logo_url: null,
  logoUrl: null,
  horaires_ok: 'Lundi: 08:00-17:00, Mardi: 08:00-17:00, Mercredi: 08:00-17:00, Jeudi: 08:00-17:00, Vendredi: 08:00-17:00',
  is_premium: false,
  statut_carte: null,
  'Note Google Globale': 4.7,
  'Compteur Avis Google': 23,
  note_google: 4.7,
  nombre_avis: 23,
  name_ar: null,
  description_ar: null,
  slug: 'adea-german-school',
};

function SectionLabel({ label, description }: { label: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
        {label}
      </h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

export default function CardPreview() {
  const navigate = useNavigate();
  const [showMeilleurs, setShowMeilleurs] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Comparaison des Cartes Entreprise
          </h1>
          <p className="text-gray-500">
            Meme entreprise test (AdeA - German School) affichee avec chaque composant de carte.
            Cette page est temporaire pour choisir le design a utiliser sur les pages Citoyens.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Donnees test :</strong> Note Google 4.7 | 23 avis | Centre de Langues | Tunis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. BusinessCard.tsx (Home) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <SectionLabel
              label="1. BusinessCard.tsx"
              description="Utilise sur la Home (via PremiumPartnersSection), Businesses, pages SEO. Composant principal avec detection de tier (gratuit/artisan/premium/elite)."
            />
            <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="max-w-sm">
                <BusinessCard
                  business={TEST_BUSINESS}
                  onClick={() => {}}
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Fichier : components/BusinessCard.tsx (793 lignes)
            </div>
          </div>

          {/* 2. UnifiedBusinessCard.tsx */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <SectionLabel
              label="2. UnifiedBusinessCard.tsx"
              description="Utilise sur CitizensAdmin, CitizensLeisure, CitizensTourism, EducationNew. Design alternatif pour pages Citizens."
            />
            <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="max-w-sm">
                <UnifiedBusinessCard
                  business={TEST_BUSINESS}
                  onClick={() => {}}
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Fichier : components/UnifiedBusinessCard.tsx (310 lignes)
            </div>
          </div>

          {/* 3. SeoBusinessCard.tsx */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <SectionLabel
              label="3. SeoBusinessCard.tsx"
              description="Utilise sur toutes les pages SEO (VillePage, MetierPage, GouvernoratPage). Optimise pour le referencement."
            />
            <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="max-w-sm">
                <SeoBusinessCard business={TEST_BUSINESS} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Fichier : components/seo/SeoBusinessCard.tsx (228 lignes)
            </div>
          </div>

          {/* 4. MeilleursSection internal card info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <SectionLabel
              label="4. MeilleursSection (carte interne)"
              description="Utilisee dans les sections 'Top 5 recommandes' sur Education, CitizensHealth, CitizensShops, CitizensServices. Carte compacte avec ranking."
            />
            <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="text-center py-6">
                <button
                  onClick={() => setShowMeilleurs(!showMeilleurs)}
                  className="px-5 py-2.5 bg-[#4A1D43] text-white rounded-xl text-sm font-medium hover:bg-[#3a1533] transition-colors"
                >
                  {showMeilleurs ? 'Masquer' : 'Afficher'} MeilleursSection (live)
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Charge les donnees en direct depuis la production.
                  <br />
                  Utilise listePage="éducation" (5 entreprises en production).
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Fichier : components/MeilleursSection.tsx lignes 60-152 (interne, non exportee)
            </div>
          </div>
        </div>

        {/* MeilleursSection live demo */}
        {showMeilleurs && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
            <SectionLabel
              label="MeilleursSection - Rendu live"
              description="Donnees production, filtre liste_pages='education'. Affiche le Top 5 qualifie (note >= 4 et >= 5 avis) puis la liste paginee."
            />
            <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <MeilleursSection
                secteurLabel="etablissements education"
                listePage="éducation"
                accentColor="#4A1D43"
                sectionTitle="Meilleurs etablissements education"
              />
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Si "Aucun professionnel reference" s'affiche, c'est parce que la requete
                demande la colonne <code>sous_categories</code> qui n'existe pas en production
                (la colonne s'appelle <code>sous_categories_clean</code>). Ce bug est identifie et en attente de validation.
              </p>
            </div>
          </div>
        )}

        {/* Summary table */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Resume : quelle carte pour quelle page ?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold">Page</th>
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold">Carte actuelle</th>
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 px-3 font-medium">Home</td>
                  <td className="py-2 px-3">BusinessCard.tsx</td>
                  <td className="py-2 px-3"><span className="text-green-600 font-medium">OK</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Education (Top 5)</td>
                  <td className="py-2 px-3">MeilleursSection interne</td>
                  <td className="py-2 px-3"><span className="text-red-600 font-medium">Bug colonne</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">CitizensHealth</td>
                  <td className="py-2 px-3">MeilleursSection interne</td>
                  <td className="py-2 px-3"><span className="text-amber-600 font-medium">A verifier</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">CitizensShops</td>
                  <td className="py-2 px-3">MeilleursSection interne</td>
                  <td className="py-2 px-3"><span className="text-amber-600 font-medium">A verifier</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">CitizensServices</td>
                  <td className="py-2 px-3">MeilleursSection interne</td>
                  <td className="py-2 px-3"><span className="text-amber-600 font-medium">A verifier</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Pages SEO</td>
                  <td className="py-2 px-3">SeoBusinessCard.tsx</td>
                  <td className="py-2 px-3"><span className="text-green-600 font-medium">OK</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">CitizensAdmin/Leisure/Tourism</td>
                  <td className="py-2 px-3">UnifiedBusinessCard.tsx</td>
                  <td className="py-2 px-3"><span className="text-green-600 font-medium">OK</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Retour a l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

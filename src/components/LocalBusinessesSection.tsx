import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { extractFrenchName } from '../lib/textNormalization';
import { BusinessCard } from './BusinessCard';

interface LocalBusiness {
  id: string;
  nom: string;
  ville: string | null;
  gouvernorat: string | null;
  image_url: string | null;
  logo_url: string | null;
  categorie: string | string[] | null;
  sous_categories_texte: string | null;
  statut_abonnement: string | null;
  horaires_ok: string | null;
  telephone: string | null;
  description: string | null;
  statut_carte: string | null;
  'Note Google Globale': string | number | null;
  'Compteur Avis Google': string | number | null;
  'page commerce local': boolean | null;
}

interface LocalBusinessesSectionProps {
  onCardClick: (id: string) => void;
}

function toCategoryLabel(value: string | string[] | null | undefined, fallback?: string | null): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return fallback || value || '';
}

export const LocalBusinessesSection = ({ onCardClick }: LocalBusinessesSectionProps) => {
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocalBusinesses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('entreprise')
          .select('id, nom, ville, gouvernorat, image_url, logo_url, categorie, sous_categories_texte, statut_abonnement, horaires_ok, telephone, description, statut_carte, "Note Google Globale", "Compteur Avis Google", "page commerce local"')
          .eq('"page commerce local"', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('[LocalBusinessesSection] Erreur requête:', error);
          setBusinesses([]);
        } else {
          setBusinesses((data || []).map((item: any) => ({
            ...item,
            nom: extractFrenchName(item.nom),
          })) as LocalBusiness[]);
        }
      } catch (err) {
        console.error('[LocalBusinessesSection] Erreur inattendue:', err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalBusinesses();
  }, []);

  if (!loading && businesses.length === 0) return null;

  return (
    <section className="py-4 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Store className="w-5 h-5 text-[#4A1D43]" />
            <h2 className="text-lg md:text-xl font-light text-gray-900">Commerces Locaux</h2>
          </div>
          <p className="text-gray-600 text-sm">Soutenez nos commerçants et artisans locaux</p>
        </div>

        <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:overflow-visible">
          {loading ? (
            <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex-shrink-0 w-[260px] md:w-auto">
                  <div className="h-[190px] rounded-2xl border border-gray-200 bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <div key={business.id} className="flex-shrink-0 w-[260px] md:w-auto h-full">
                  <BusinessCard
                    business={{
                      id: business.id,
                      name: business.nom,
                      category: toCategoryLabel(business.categorie, business.sous_categories_texte),
                      ville: business.ville,
                      gouvernorat: business.gouvernorat,
                      description: business.description,
                      telephone: business.telephone,
                      statut_abonnement: business.statut_abonnement,
                      imageUrl: business.image_url,
                      logoUrl: business.logo_url,
                      horaires_ok: business.horaires_ok,
                      statut_carte: business.statut_carte,
                      note_google: business['Note Google Globale'],
                      nombre_avis: business['Compteur Avis Google'],
                      'Note Google Globale': business['Note Google Globale'],
                      'Compteur Avis Google': business['Compteur Avis Google'],
                    }}
                    onClick={() => onCardClick(business.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && businesses.length >= 6 && (
          <div className="text-center mt-4">
            <a
              href="#/entreprises?commerce_local=true"
              className="inline-flex items-center gap-2 px-5 py-2 bg-white text-[#4A1D43] font-medium rounded-lg transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-105 border-2 border-[#4A1D43] text-sm"
            >
              <Store className="w-4 h-4" />
              Découvrir tous nos commerces locaux
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocalBusinessesSection;

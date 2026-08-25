import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import { buildEntrepriseUrl } from '../lib/slugify';

export function LegacyBusinessRedirect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    let cancelled = false;

    (async () => {
      const selectFields = 'id, id_airtable, nom, slug, ville';

      let { data, error } = await supabase
        .from(Tables.ENTREPRISE)
        .select(selectFields)
        .eq('id', id)
        .maybeSingle();

      if ((!data || error) && /^rec[a-z0-9]+$/i.test(id)) {
        const fallback = await supabase
          .from(Tables.ENTREPRISE)
          .select(selectFields)
          .eq('id_airtable', id)
          .maybeSingle();

        data = fallback.data;
        error = fallback.error;
      }

      if (cancelled) return;

      if (error || !data) {
        setNotFound(true);
        return;
      }

      const target = buildEntrepriseUrl({
        slug: data.slug,
        nom: data.nom,
        ville: data.ville,
        id: data.id,
      });
      navigate(target, { replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Entreprise introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="inline-block w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

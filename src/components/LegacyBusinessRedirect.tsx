import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import { generateBusinessUrl } from '../lib/slugify';
import { extractFrenchName } from '../lib/textNormalization';

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
      const { data, error } = await supabase
        .from(Tables.ENTREPRISE)
        .select('id, nom')
        .eq('id', id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setNotFound(true);
        return;
      }

      const name = extractFrenchName(data.nom) || data.nom || '';
      navigate(generateBusinessUrl(name, data.id), { replace: true });
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

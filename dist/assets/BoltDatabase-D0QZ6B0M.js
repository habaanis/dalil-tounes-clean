import{s as t}from"./index-B3t9zgA6.js";const u={url:"https://kmvjegbtroksjqaqliyv.supabase.co"},_=u.url;async function m(r){try{if(!r||r.length<2)return[];const{data:e,error:i}=await t.rpc("search_cities_fuzzy",{search_query:r,similarity_threshold:.3});if(!i&&e&&e.length>0)return console.log("✅ Villes trouvées (fuzzy):",e.length),e;const{data:s,error:o}=await t.rpc("search_cities_unaccent",{search_term:r});if(o){console.error("❌ Erreur searchCities:",o.message);const{data:c,error:n}=await t.from("cities").select(`
          name_fr,
          name_ar,
          governorates (
            name_fr
          )
        `).or(`name_fr.ilike.*${r}*,name_ar.ilike.*${r}*`).order("name_fr",{ascending:!0}).limit(10);if(n)return console.error("❌ Erreur fallback:",n.message),[];const l=c?.map(a=>({name_fr:a.name_fr,name_ar:a.name_ar,governorate_fr:a.governorates?.name_fr||""}))||[];return console.log("✅ Villes trouvées (fallback):",l.length),l}return console.log("✅ Villes trouvées:",s?.length||0),s||[]}catch(e){return console.error("❌ Erreur critique searchCities:",e.message),[]}}export{_ as S,m as s};

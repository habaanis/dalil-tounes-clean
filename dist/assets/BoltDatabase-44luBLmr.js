import{s as t}from"./index-Bzzz_upS.js";const i={url:"https://kmvjegbtroksjqaqliyv.supabase.co"},_=i.url;async function m(r){try{if(!r||r.length<2)return[];const{data:e,error:o}=await t.rpc("search_cities_fuzzy",{search_query:r,similarity_threshold:.3});if(!o&&e&&e.length>0)return e;const{data:s,error:l}=await t.rpc("search_cities_unaccent",{search_term:r});if(l){const{data:n,error:c}=await t.from("cities").select(`
          name_fr,
          name_ar,
          governorates (
            name_fr
          )
        `).or(`name_fr.ilike.*${r}*,name_ar.ilike.*${r}*`).order("name_fr",{ascending:!0}).limit(10);return c?[]:n?.map(a=>({name_fr:a.name_fr,name_ar:a.name_ar,governorate_fr:a.governorates?.name_fr||""}))||[]}return s||[]}catch{return[]}}export{_ as S,m as s};

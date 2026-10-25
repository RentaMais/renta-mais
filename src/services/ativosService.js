import ativosDados from "@/mocks/ativos.json";

export function buscarAtivo(id){
  const variavel = ativosDados.rendaVariavel.find(
    (item) => item.id === Number(id),
  );
  if(variavel){
    return{ tipo: "renda_variavel", ...variavel };
  }

  const fixa = ativosDados.rendaFixa.find((item) => item.id === Number(id));
  return {tipo: "renda_fixa",...fixa};
}
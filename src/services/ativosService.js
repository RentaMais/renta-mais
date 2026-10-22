export async function criarAtivo(ativo) {
  return { id: Date.now(), ...ativo };
}

export async function venderAtivo(venda){
  return {id: Date.now(),tipo: "venda",...venda};
}

export async function resgatarAtivo(resgate){
  return {id:Date.now(),tipo:"resgate",...resgate};
}
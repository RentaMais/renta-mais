export function dataParaBanco(texto) {
  const partes = texto.split("/");
  return partes[2] + "-" + partes[1] + "-" + partes[0];
}

export function dataParaBR(dataBanco) {
  const partes = dataBanco.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

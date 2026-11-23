export function dataParaBanco(texto) {
  const partes = texto.split("/");
  return partes[2] + "-" + partes[1] + "-" + partes[0];
}

export function dataParaBR(dataBanco) {
  const partes = dataBanco.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

//verificar se a data é valida
export function textoParaData(texto) {
  if (texto.length !== 10) {
    return null;
  }
  const partes = texto.split("/");
  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  const data = new Date(ano, mes - 1, dia);
  if (
    data.getDate() !== dia ||
    data.getMonth() !== mes - 1 ||
    data.getFullYear() !== ano
  ) {
    return null;
  }
  return data;
}

// Evita deslocamento de 1 dia por UTC ao ler datas "YYYY-MM-DD" (tratar valores da API)
export function parseDataLocal(dataStr) {
  const texto = String(dataStr || "").trim();
  const matchISO = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (matchISO) {
    return new Date(
      Number(matchISO[1]),
      Number(matchISO[2]) - 1,
      Number(matchISO[3]),
      12,
      0,
      0,
    );
  }
  return new Date(texto);
}

//buscar formatacao em YYYY-MM-DD
export function extrairDataYYYYMMDD(valor) {
  if (!valor) return null;

  //retorna formato funcao do banco timestamp do firestore
  if (typeof valor?.toDate === "function") {
    return valor.toDate().toISOString().split("T")[0];
  }
 //valor ja do tipo date
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor.toISOString().split("T")[0];
  }

  const texto = String(valor).trim();
  const matchISO = texto.match(/^(\d{4}-\d{2}-\d{2})/);
  if (matchISO) {
    return matchISO[1];
  }

  return null;
}
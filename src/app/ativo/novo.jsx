import {View, Text, ScrollView, Pressable} from "react-native";
import {useState} from "react";
import {useNavigation} from "expo-router";
import {ArrowLeftIcon, CaretDownIcon,CaretUpDownIcon, CaretUpIcon} from "phosphor-react-native";
import {CabecalhoTela} from "@/components/CabecalhoTela";
import {InputCustomer} from "@/components/InputCustomer";
import {AvisoCustomer} from "@/components/AvisoCustomer";
import {SeletorRenda} from "@/components/SeletorRenda";
import {cores} from "@/cores";
import { navigate } from "expo-router/build/global-state/router";

export default function AdicionarAtivoScreen(){
  const navigation = useNavigation();
  const [tipoRenda,setTipoRenda]=useState("Renda fixa");
  const [erro,setErro] = useState("");
  //Renda Fixa
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [indexador, setIndexador] = useState("Selic");
  const [indexadorAberto, setIndexadorAberto] = useState(false);
  const [taxa, setTaxa] = useState("");
  const [vencimento, setVencimento] = useState("");
  //Renda Variavel
  const [ticker, setTicker] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoMedio, setPrecoMedio] = useState("");
  const [dataCompra, setDataCompra] = useState("");

  const opcoesIndexador = ["Selic", "CDI", "IPCA", "Prefixado"];
  const valorNumero = Number(valor.replace(",",".")) || 0;
  const quantidadeNumero = Number(quantidade.replace(",", ".")) || 0;
  const precoNumero = Number(precoMedio.replace(",", ".")) || 0;
  const valorInvestido = quantidadeNumero * precoNumero;
  
  async function salvar(){
    if(tipoRenda === "Renda fixa"){
      if(!nome.trim() || !valor.trim() || !taxa.trim() || !vencimento.trim()){
        setErro("Preencha todos os campos");
        return;
      }
      if(valorNumero <= 0){
        setErro("O valor deve ser maior que zero");
        return;
      }
      await criarAtivo({
        tipo: "renda_fixa",
        nome: nome,
        valor: valorNumero,
        indexador: indexador,
        taxa: taxa,
        vencimento: vencimento,
      });
    }else{
      if(
        !ticker.trim() ||
        !quantidade.trim() ||
        !precoMedio.trim() ||
        !dataCompra.trim()
      ){
        setErro("Preencha todos os campos");
        return;
      }
      if(quantidadeNumero <= 0 || precoNumero <= 0){
        setErro("Quantidade e preço médio devem ser maiores que 0");
        return;
      }

      await criarAtivo({
        tipo: "renda_variavel",
        ticker: ticker,
        quantidade: quantidadeNumero,
        precoMedio: precoNumero,
        dataCompra: dataCompra,
      });
    }
    setErro("");
    navigate.goBack();
  }

  return (
    <View className="flex-1 items-center bg-fundo">
      <View className="w-[85vw] flex-1">
        <ScrollView 
          className="flex-1 bg-fundo"
          contentContainerStyle={{
            paddingTop:48,
            paddingBottom:40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={()=>navigation.goBack()}
            className="mb-4 flex-row items-center gap-2 self-start"
          >
            <ArrowLeftIcon size={16} weight="bold" color={cores.primaria}/>
            <Text className="font-corpo-bold text-sm text-primaria">Cancelar</Text>
          </Pressable>

          <View className="mb-6">
            <CabecalhoTela titulo="Novo ativo"/>
          </View>
          <View className="mb-6">
            <SeletorRenda 
            value={tipoRenda} 
            onChange={(tipo)=>{
              setTipoRenda(tipo);
              setErro("");
            }}
          />
          </View>

          {tipoRenda === "Renda fixa" && (
            <View className="gap-4">
              <InputCustomer
                titulo="Nome do título"
                placeholder="Ex: Tesouro Selic 2029"
                value={nome}
                onChangeText={setNome}
              />
              <InputCustomer
                titulo="Valor"
                placeholder="R$ 15.000,00"
                value={valor}
                onChangeText={setValor}
              />
              <View className="flex-row items-start gap-3">
                <View className="flex-1 gap-1">
                  <Text className="font-corpo-bold text-base text-texto">Indexador</Text>
                  <Pressable
                    onPress={()=>setIndexadorAberto(!indexadorAberto)}
                    className="h-12 flex-row items-center justify-between rounded-2xl border border-texto/20 bg-white px-4"
                  >
                    <Text className="font-corpo text-base text-texto">{indexador}</Text>
                    {indexadorAberto ? (
                      <CaretUpIcon size={18} color={cores.texto}/>
                    ):(
                      <CaretDownIcon size={18} color={cores.texto}/>
                    )}

                  </Pressable>
                  {indexadorAberto && opcoesIndexador.map((opcao)=>(
                    <Pressable
                      key={opcao}
                      onPress={()=>{
                        setIndexador(opcao);
                        setIndexadorAberto(false);
                      }}
                      className="bg-container border-texto/10 px-4 py-3 rounded-2xl"
                      >
                        <Text 
                          className={
                            opcao===indexador
                            ? "font-corpo-bold text-base text-texto"
                            : "font-corpo text-base text-texto"
                          }
                        >
                          {opcao}
                        </Text>
                      </Pressable>
                  ))}
                </View>
                <View className="flex-1">
                  <InputCustomer
                    titulo="Taxa"
                    placeholder="100 %"
                    value={taxa}
                    onChangeText={setTaxa}
                  />
                </View>
              </View>
              <InputCustomer 
                titulo="Data de vencimento"
                placeholder="dd/mm/aaaa"
                value={vencimento}
                onChangeText={setVencimento}
              />
            </View>
          )}
          {tipoRenda === "Renda variável" && (
            <View className="gap-4">
              <InputCustomer
                titulo="Ticker"
                placeholder="Ex: PETR4"
                value={ticker}
                onChangeText={setTicker}
              />
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <InputCustomer
                    titulo="Quantidade"
                    placeholder="120"
                    value={quantidade}
                    onChangeText={setQuantidade}
                  />
                </View>
                <View className="flex-1">
                  <InputCustomer
                    titulo="Preço médio"
                    placeholder="34,80"
                    value={precoMedio}
                    onChangeText={setPrecoMedio}
                  />
                </View>
              </View>
              <InputCustomer
                titulo="Data da compra"
                placeholder="dd/mm/aaaa"
                value={dataCompra}
                onChangeText={setDataCompra}
              />
              <AvisoCustomer
                mensagem={"Valor investido estimado: R$ "+ valorInvestido.toLocaleString("pt-BR",{
                  minimumFractionDigits: 2,
                  })
                }
              />
            </View>
          )}
          {erro !== "" && (
            <Text className="mt-4 font-corpo-medium text-sm text-erro">{erro}</Text>
          )}
          <Pressable
            onPress={salvar}
            className="mt-6 h-14 items-center justify-center rounded-2xl bg-texto"
          >
            <Text className="font-titulo text-xl text-container">Salvar ativo</Text>
          </Pressable>
        </ScrollView>
      </View>

    </View>
  );
}

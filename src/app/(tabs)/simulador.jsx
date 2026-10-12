import { useState } from "react";
import { Text, View, ScrollView, Pressable, TextInput } from "react-native";
import {Dot} from "phosphor-react-native"
import {cores} from "@/cores"
import { LineChart } from "react-native-chart-kit";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { UserButtonCustomer } from "@/components/UserButtonCustomer";
import { SwitchCustomer } from "@/components/SwitchCustomer";


export default function SimuladorScreen() {

  const [aporteInicial, setAporteInicial] = useState("");
  const [aporteMensal, setAporteMensal] = useState("");
  const [rentabilidade, setRentabilidade] = useState("");

  const[tempoSelecionado,setTempoSelecionado] = useState(10);
  const[descontarInflacao,setDescontarInflacao] = useState(true);

  const anosOpcoes = [10,20,30,40];
  const taxaIbovespa = 18.5;

  const tratarAporteInicial = (texto) => {
    const apenasNums = texto.replace(/\D/g, "");
    const valor = Number(apenasNums) || 0;
    if (valor > 10000000) {
      setAporteInicial("10000000"); // 
      return;
    }
    setAporteInicial(apenasNums);
  };

  const tratarAporteMensal = (texto) => {
    const apenasNums = texto.replace(/\D/g, "");
    const valor = Number(apenasNums) || 0;
    if (valor > 100000) {
      setAporteMensal("100000"); // 
      return;
    }
    setAporteMensal(apenasNums);
  };

  const tratarRentabilidade = (texto) => {
    const apenasNums = texto.replace(/\D/g, "");
    const valor = Number(apenasNums) || 0;
    if (valor > 50) {
      setRentabilidade("50"); 
      return;
    }
    setRentabilidade(apenasNums);
  };

  const camposSimulacao = [
    {
      id: "aporte-inicial",
      titulo: "Aporte inicial",
      placeholder: "R$ 10.000",
      value: aporteInicial,
      onChangeText: tratarAporteInicial,
    },
    {
      id: "aporte-mensal",
      titulo: "Aporte mensal",
      placeholder: "R$ 1.000",
      value: aporteMensal,
      onChangeText: tratarAporteMensal,
    },
    {
      id: "rentabilidade",
      titulo: "Rentabilidade da renda fixa (a.a.)",
      placeholder: "11,5%",
      value: rentabilidade,
      onChangeText: tratarRentabilidade,
    },
  ];


  function calcularPatrimonio(vi, vm, taxaAnualPct, anos, inflacaoAtiva) {
    const viNum = Number(vi)|| 0
    const vmNum = Number(vm)|| 0
    
    let taxa = taxaAnualPct/100;
    
    if (inflacaoAtiva) {
      taxa= (1 + taxa) / (1 + 0.04) - 1;
    }

    const iMensal = Math.pow(1 + taxa, 1 / 12) - 1;
    const tMeses = anos * 12;

    if (iMensal === 0) return viNum + (vmNum * tMeses);

    //FV(t) = VI * (1 + i)^t + VM * [((1 + i)^t - 1) / i]
    const parteVi = viNum * Math.pow(1 + iMensal, tMeses);
    const parteVm = vmNum * ((Math.pow(1 + iMensal, tMeses) - 1) / iMensal);

    return parteVi + parteVm;
  }

  function formatarMoeda(valor) {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(1).replace(".", ",")} mi`;
    } else if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(0)} mil`;
    }
    return `R$ ${valor.toFixed(0)}`;
  }

  function formatarEixo(v) {
    const n = Number(v);
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(1).replace(".", ",").replace(/,0$/, "")} mi`;
    }
    if (n >= 1000) return `${Math.round(n / 1000)} mil`;
    return String(Math.round(n));
  }

  const taxaRfNum = Number(rentabilidade.replace(",", ".")) || 0;
  const taxaArrojado = (0.7*taxaIbovespa)+(0.3*taxaRfNum);
  const taxaModerado = (0.5*taxaIbovespa)+(0.5*taxaRfNum);
  const taxaConservador = taxaRfNum;

  const perfisInvestimento = [
    {
      id: "arrojado",
      nome: "Arrojado",
      cor: cores.texto,
      descricao:`70% Ibovespa (${taxaIbovespa.toFixed(1)}%) + 30% Renda Fixa (${taxaConservador.toFixed(1)}%), resultante:(${taxaArrojado.toFixed(1)}%)`,
      valor: calcularPatrimonio(aporteInicial, aporteMensal,taxaArrojado, tempoSelecionado, descontarInflacao),
    },
    {
      id: "moderado",
      nome: "Moderado",
      cor: cores.primaria,
      descricao:`50% Ibovespa (${taxaIbovespa.toFixed(1)}%) + 50% Renda Fixa (${taxaConservador.toFixed(1)}%), resultante:(${taxaModerado.toFixed(1)}%)`,
      valor: calcularPatrimonio(aporteInicial, aporteMensal,taxaModerado, tempoSelecionado, descontarInflacao),
    },
    {
      id: "conservador",
      nome: "Conservador",
      cor: cores.positivo,
      descricao: `100% de renda fixa (${taxaConservador.toFixed(1)}%)`,
      valor: calcularPatrimonio(aporteInicial, aporteMensal,taxaConservador, tempoSelecionado, descontarInflacao),
    },
  ];


  return (
    <ScrollView className="flex-1 bg-fundo" contentContainerStyle={{paddingVertical:24,alignItems:"center"}}>
      <View className="w-[85vw] gap-5">
        
        <View className="w-full flex-row items-center justify-between ">
          <View className="flex-1">
            <CabecalhoTela titulo="Simule décadas"/>
          </View>
          <UserButtonCustomer onPress={()=>{}}/>
        </View>

        <View className="bg-container w-full rounded-2xl gap-5 p-5 ">
          {camposSimulacao.map((campo)=>(
            <View key={campo.id} className="w-full gap-1">
              <Text className="font-corpo-bold text-base text-texto">
                {campo.titulo}
              </Text>
              <View className="border-b border-dashed border-primaria/50 pb-1">
                <TextInput
                  placeholder={campo.placeholder}
                  placeholderTextColor={cores.placeholder}
                  value={campo.value}
                  onChangeText={campo.onChangeText}
                  keyboardType="numeric"
                  style={{ outlineStyle: "none" }}
                  className=" font-titulo-regular text-xl text-primaria"
                />
              </View>
            </View>
          ))}
          <View className="w-full gap-2 pt-1">
            <Text className="font-corpo-bold text-base text-texto">
              Tempo de investimento
            </Text>
            <View className="flex-row justify-between gap-2">
              {anosOpcoes.map((anos)=>(
                  <Pressable
                    key={anos}
                    onPress={()=>setTempoSelecionado(anos)}
                    className={`flex-1 h-11 items-center justify-center rounded-xl border ${tempoSelecionado === anos ?"bg-texto border-texto":"bg-container border-texto/30"}`}
                  >
                    <Text className={`font-corpo-bold text-sm ${tempoSelecionado === anos ? "text-fundo":"text-texto"}`}>
                      {anos} anos
                    </Text>
                  </Pressable>
              ))}
            </View>
          </View>
        </View>
        <View className="bg-container w-full flex-row rounded-2xl gap-1 p-5 items-center justify-between">
          <View className="flex-1 pr-4 gap-1">
            <Text className="font-corpo-bold text-base text-texto">
                Descontar inflação
            </Text>
            <Text className="font-corpo text-sm text-texto">
                Mostra os valores em poder de compra de hoje (IPCA projetado de 4% a.a.)
            </Text>
          </View>
          <SwitchCustomer 
          value={descontarInflacao} 
          onValueChange={setDescontarInflacao}
          />
        </View>
        <View className="bg-container w-full rounded-2xl gap-5 p-5">
          <Text className="font-corpo-bold text-xl text-texto">
              Patrimônio projetado
          </Text>

          {/* Espaço do Gráfico RASCUNHOO*/}
          <View className="h-28 w-full justify-between py-2 border-b border-texto/10 relative">
            <Text className="font-corpo text-[10px] text-subtexto">2,5 mi</Text>
            <Text className="font-corpo text-[10px] text-subtexto">1,25 mi</Text>
            <Text className="font-corpo text-[10px] text-subtexto">R$ 0</Text>
            
            <View className="absolute bottom-8 left-0 right-0 h-[1px] border-b border-dashed border-texto/10" />
            <View className="absolute bottom-16 left-0 right-0 h-[1px] border-b border-dashed border-texto/10" />
          </View>
          {/*RASCUNHO */}

          {perfisInvestimento.map((perfil) => (
            <View 
              key={perfil.id} 
              className="py-2 gap-1 not-last:border-b not-last:border-texto/10"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Dot size={24} color={perfil.cor} weight="fill" />
                  <Text className="font-corpo-bold text-base text-texto">{perfil.nome}</Text>
                </View>
                <Text className="font-titulo-regular text-lg text-texto">
                  {formatarMoeda(perfil.valor)}
                </Text>
              </View>
              <Text className="font-corpo text-xs text-subtexto pl-8">
                {perfil.descricao}
              </Text>
            </View>
          ))}
        </View>
        {descontarInflacao && (<Text className="font-corpo text-xs text-subtexto  text-center">Valores acima já descontam a inflação projetada. Desative a opção para ver os valores nominais.</Text>)}

      </View>
    </ScrollView>
  );
}

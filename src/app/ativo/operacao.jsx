import {useState} from "react";
import {View, Text, ScrollView, Pressable} from "react-native";
import {useNavigation, useLocalSearchParams} from "expo-router";
import {ArrowLeftIcon, InfoIcon} from "phosphor-react-native";
import {InputCustomer} from "@/components/InputCustomer";
import {CabecalhoAtivo} from "@/components/CabecalhoAtivo";
import {buscarAtivo, venderAtivo, resgatarAtivo} from "@/services/ativosService";
import {cores} from "@/cores";

export default function OperacaoAtivo(){
    const navigation = useNavigation();
    const {id} = useLocalSearchParams();
    const ativo = buscarAtivo(id);
    
    const hoje = new Date().toLocaleDateString("pt-BR");
    const [erro,setErro] = useState("");
   
    const [quantidadeVenda, setQuantidadeVenda]=useState("");
    const [precoVenda, setPrecoVenda] = useState("");
    const [dataVenda, setDataVenda] = useState(hoje);
   
    const [valorResgate, setValorResgate] = useState("");
    const [dataResgate, setDataResgate] = useState(hoje);    

    function reais(numero){
        return (
            "R$ " +
            numero.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    }

    const ehVariavel = ativo.tipo ==="renda_variavel";
    const quantidadeNumero = Number(quantidadeVenda.replace(",", ".")) || 0;
    const precoNumero = Number(precoVenda.replace(",", ".")) || 0;
    const valorResgateNumero = Number(valorResgate.replace(",", ".")) || 0;

    const valorVenda = quantidadeNumero*precoNumero;
    
    let lucro=0;
    if(ehVariavel && precoNumero>0){
        lucro=quantidade *(precoNumero-ativo.precoMedio);
    }
    let rendimento=0;
    if(!ehVariavel && valorResgateNumero>0){
        rendimento=valorResgateNumero - ativo.valorInicial;
    }
    function confirmar(){
        if(ehVariavel){
            if(!quantidadeVenda.trim() || !precoVenda.trim() || !dataVenda.trim()){
                setErro("Preencha todos os campos");
            return;
            }
            if(quantidadeNumero <= 0 || precoNumero <= 0){
                setErro("Quantidade e preço de venda devem ser maiores que 0");
                return;
            }
            if(quantidadeNumero > ativo.quantidade){
                setErro("Você possui apenas " + ativo.quantidade + " unidades deste ativo");
                return;
            }
        }else{
            if(!valorResgate.trim() || !dataResgate.trim()){
                setErro("Preencha todos os campos");
                return;
            }
            if(valorResgateNumero<=0){
                setErro("O valor deve ser maior que zero");
                return;
            }
        }
        setErro("");
        navigation.navigate("(tabs)");
    }
    return(
        <View className="flex-1 items-center bg-fundo">
            <View className="w-[85vw] flex-1">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingTop: 48, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Pressable
                        onPress={()=>navigation.goBack()}
                        className="mb-6 flex-row items-center gap-2 self-start"
                    >
                        <ArrowLeftIcon size={16} weight="bold" color={cores.primaria} />
                        <Text className="font-corpo-bold text-sm text-primaria">
                            Cancelar
                        </Text>
                    </Pressable>
                    <View className="mb-8">
                        <CabecalhoAtivo ativo={ativo}/>
                    </View>
                    {ehVariavel && (
                        <View className="gap-4">
                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <InputCustomer
                                        titulo="Quantidade a vender"
                                        placeholder="120"
                                        value={quantidadeVenda}
                                        onChangeText={setQuantidadeVenda}
                                    />
                                </View>
                                <View className="flex-1">
                                    <InputCustomer
                                        titulo="Preço de venda"
                                        placeholder="46,80"
                                        value={precoVenda}
                                        onChangeText={setPrecoVenda}
                                    />
                                </View>
                            </View>
                            <InputCustomer
                                titulo="Data da venda"
                                placeholder="dd/mm/aaaa"
                                value={dataVenda}
                                onChangeText={setDataVenda}
                            />
                            <View className="flex-row items-start gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4">
                                <InfoIcon size={22} color={cores.primaria}/>
                                <View className="flex-1 gap-1">
                                    <Text className="font-corpo-medium text-sm text-primaria">
                                        {"Valor da venda: "+reais(valorVenda)}
                                    </Text>
                                    <Text
                                        className={
                                            lucro>=0 ?
                                                "font-corpo-medium text-sm text-positivo"
                                                : "font-corpo-medium text-sm text-negativo"
                                        }
                                    >
                                        {"Lucro obtido: "+(lucro>=0 ? "+ ": "- ")+reais(lucro)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {!ehVariavel && (
                        <View className="gap-4">
                            <View className="w-1/2"> 
                                <InputCustomer 
                                    titulo="Valor a resgatar"
                                    placeholder="16850,00"
                                    value={valorResgate}
                                    onChangeText={setValorResgate}
                                />
                            </View>
                            <InputCustomer
                                titulo="Data do resgate"
                                placeholder="dd/mm/aaaa"
                                value={dataResgate}
                                onChangeText={setDataResgate}
                            />
                            <View className="flex-row items-start gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4">
                                <InfoIcon size={22} color={cores.primaria}/>
                                <View className="flex-1 gap-1">
                                    <Text className="font-corpo-medium text-sm text-primaria">
                                        {"Valor do resgate: "+reais(valorResgateNumero)}
                                    </Text>
                                    <Text
                                        className={
                                            rendimento>=0
                                            ? "font-corpo-medium text-sm text-positivo"
                                            : "font-corpo-medium text-sm text-negativo"
                                        }
                                    >
                                        {"Rendimento: " + (rendimento >=0 ? "+ ":"- ")+reais(rendimento)}
                                    </Text>
                                    <Text className="font-corpo-medium text-sm text-primaria">
                                        {"Valor inicial: "+reais(ativo.valorInicial)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {erro !== "" && (
                        <Text className="mt-4 font-corpo-medium text-sm text-erro">
                            {erro}
                        </Text>
                    )}
                    <Pressable
                        onPress={confirmar}
                        className="mt-8 h-14 items-center justify-center rounded-2xl bg-texto"
                    >
                        <Text className="font-titulo text-xl text-container">
                            {ehVariavel ? "Confirmar venda ": "Confirmar Resgate"}
                        </Text>
                    </Pressable>
                </ScrollView>
            </View>
        </View>
    );
}
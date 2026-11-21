import { useState, useEffect } from "react";
import { useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable, Image } from "react-native";
import {
  CaretUpIcon,
  CaretDownIcon,
  CaretRightIcon,
  PlusIcon,
} from "phosphor-react-native";

import { TelaCustomer } from "@/components/TelaCustomer";
import { CardCustomer } from "@/components/CardCustomer";
import { TituloCardCustomer } from "@/components/TituloCardCustomer";
import { CabecalhoPrincipal } from "@/components/CabecalhoPrincipal";
import { cores } from "@/cores";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { VariacaoCustomer } from "@/components/VariacaoCustomer";
import {
  listarAtivos,
  atualizarCotacoesCarteira,
} from "@/services/ativosService";
import { LogoAtivo } from "@/components/LogoAtivo";

export default function AtivoScreen() {
  const [variavelAberto, setVariavelAberto] = useState(true);
  const [fixaAberto, setFixaAberto] = useState(false);
  const [ativos, setAtivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  async function carregar() {
    try {
      const lista = await listarAtivos();
      setAtivos(lista);
      setErro("");
    } catch (e) {
      setErro("Não foi possível carregar os ativos.");
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
    const parar = navigation.addListener("focus", carregar);
    return parar;
  }, []);

  const variaveis = ativos.filter((ativo) => ativo.tipo === "renda_variavel");
  const fixos = ativos.filter((ativo) => ativo.tipo === "renda_fixa");

  let total = 0;
  for (let i = 0; i < ativos.length; i++) {
    total = total + ativos[i].totalInvestido;
  }

  return (
    <View className="flex-1">
      <TelaCustomer>
        <CabecalhoPrincipal
          subtitulo="Carteira completa"
          titulo="Meus ativos"
          descricao={"Total investido: " + formatarMoeda(total)}
        />

        {carregando && (
          <Text className="font-corpo text-base text-texto">
            {" "}
            Carregando...
          </Text>
        )}
        {erro !== "" && (
          <Text className="font-corpo-medium text-sm text-erro">{erro}</Text>
        )}

        {/* Renda Variável */}
        <CardCustomer className="px-5 overflow-hidden">
          <Pressable
            onPress={() => setVariavelAberto(!variavelAberto)}
            className="flex-row items-center justify-between"
          >
            <TituloCardCustomer titulo="Renda variável" />

            {variavelAberto ? (
              <CaretUpIcon size={20} weight="bold" color={cores.primaria} />
            ) : (
              <CaretDownIcon size={20} weight="bold" color={cores.primaria} />
            )}
          </Pressable>

          {variavelAberto && !carregando && variaveis.length === 0 && (
            <Text className="pt-3 font-corpo text-sm text-inativo">
              Nenhum ativo de renda variável
            </Text>
          )}
          {variavelAberto &&
            variaveis.map((ativo) => (
              <Pressable
                key={ativo.id}
                onPress={() =>
                  router.push({
                    pathname: "/ativos/[id]",
                    params: { id: ativo.id },
                  })
                }
                className="mt-3 flex-row items-center border-t border-texto/10 pt-3"
              >
                <LogoAtivo url={ativo.imagem} />

                <View className="ml-3 flex-1">
                  <Text className="font-corpo-bold text-base text-texto">
                    {ativo.ticker}
                  </Text>
                  <Text className="font-corpo text-xs text-inativo">
                    {ativo.quantidade +
                      " un - PM " +
                      formatarMoeda(ativo.precoMedio)}
                  </Text>
                </View>

                <View className="mr-2 items-end">
                  <Text className="font-corpo-bold text-base text-texto">
                    {formatarMoeda(ativo.totalInvestido)}
                  </Text>
                  <VariacaoCustomer valor={ativo.variacao} />
                </View>

                <CaretRightIcon
                  size={18}
                  weight="bold"
                  color={cores.primaria}
                />
              </Pressable>
            ))}
        </CardCustomer>

        {/* Renda Fixa */}
        <CardCustomer className="px-5 overflow-hidden">
          <Pressable
            onPress={() => setFixaAberto(!fixaAberto)}
            className="flex-row items-center justify-between"
          >
            <TituloCardCustomer titulo="Renda fixa" />

            {fixaAberto ? (
              <CaretUpIcon size={20} weight="bold" color={cores.primaria} />
            ) : (
              <CaretDownIcon size={20} weight="bold" color={cores.primaria} />
            )}
          </Pressable>

          {fixaAberto && !carregando && fixos.length === 0 && (
            <Text className="pt-3 font-corpo text-sm text-inativo">
              Nenhum título de renda fixa.
            </Text>
          )}
          {fixaAberto &&
            fixos.map((ativo) => (
              <Pressable
                key={ativo.id}
                onPress={() =>
                  router.push({
                    pathname: "/ativos/[id]",
                    params: { id: ativo.id },
                  })
                }
                className="mt-3 flex-row items-center border-t border-texto/10 pt-3"
              >
                <View className="flex-1">
                  <Text className="font-corpo-bold text-base text-texto">
                    {ativo.nome}
                  </Text>
                  <Text className="font-corpo text-xs text-inativo">
                    {ativo.taxa + " - vence " + ativo.vencimento}
                  </Text>
                </View>

                <View className="mr-2 items-end">
                  <Text className="font-corpo-bold text-base text-texto">
                    {ativo.valor}
                  </Text>
                  <Text className="font-corpo text-xs text-inativo">
                    investido
                  </Text>
                </View>

                <CaretRightIcon
                  size={18}
                  weight="bold"
                  color={cores.primaria}
                />
              </Pressable>
            ))}
        </CardCustomer>
      </TelaCustomer>

      <Pressable
        onPress={() => router.push("/ativos/novo")}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primaria"
      >
        <PlusIcon size={28} weight="bold" color={cores.container} />
      </Pressable>
    </View>
  );
}

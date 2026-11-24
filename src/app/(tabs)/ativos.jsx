import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
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
import { LogoAtivo } from "@/components/LogoAtivo";
import { VariacaoCustomer } from "@/components/VariacaoCustomer";
import { useCarteiraAtivos } from "@/hooks/useAtivos";
import { formatarMoeda } from "@/utils/formatadores";
import { cores } from "@/cores";

export default function AtivoScreen() {
  const [variavelAberto, setVariavelAberto] = useState(true);
  const [fixaAberto, setFixaAberto] = useState(false);
  const router = useRouter();
  const { variaveis, fixos, totalInvestido, carregando, erro } =
    useCarteiraAtivos();

  return (
    <View className="flex-1">
      <TelaCustomer>
        <CabecalhoPrincipal
          subtitulo="Carteira completa"
          titulo="Meus ativos"
          descricao={"Total investido: " + formatarMoeda(totalInvestido)}
        />

        {carregando && (
          <Text className="font-corpo text-base text-texto">Carregando...</Text>
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
                    {ativo.valor}
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
        className="w-16 h-16 rounded-full bg-primaria items-center justify-center absolute bottom-6 right-6"
      >
        <PlusIcon size={28} weight="bold" color={cores.fundo} />
      </Pressable>
    </View>
  );
}

import { useState } from "react";
import { useRouter } from "expo-router";
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
import ativosDados from "@/mocks/ativos.json";

import itauImg from "@/mocks/assets/itau.jpg";
import petrobrasImg from "@/mocks/assets/petrobras.jpg";
import valeImg from "@/mocks/assets/vale.jpg";

const imagensAtivos = {
  "itau.jpg": itauImg,
  "petrobras.jpg": petrobrasImg,
  "vale.jpg": valeImg,
};

export default function AtivoScreen() {
  const [variavelAberto, setVariavelAberto] = useState(true);
  const [fixaAberto, setFixaAberto] = useState(false);
  const router = useRouter();

  return (
    <View className="flex-1">
      <TelaCustomer>
        <CabecalhoPrincipal
          subtitulo="Carteira completa"
          titulo="Meus ativos"
          descricao={"Total investido: " + ativosDados.totalInvestido}
        />

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

          {variavelAberto && (
            <View className="divide-y divide-texto/10 gap-5">
              {ativosDados.rendaVariavel.map((ativo) => {
                const detalheFormatado = `${ativo.quantidade} un - PM ${formatarMoeda(ativo.precoMedio)}`;
                const ehPositivo = !ativo.variacao.startsWith("-");

                return (
                  <Pressable
                    key={ativo.id}
                    onPress={() =>
                      router.push({
                        pathname: "/ativos/[id]",
                        params: { id: ativo.id },
                      })
                    }
                    className="flex-row items-center pt-5"
                  >
                    <Image
                      source={imagensAtivos[ativo.imagem]}
                      style={{ width: 42, height: 42 }}
                      className="rounded-md bg-texto/10"
                      resizeMode="cover"
                    />

                    <View className="ml-3 flex-1">
                      <Text className="font-corpo-bold text-base text-texto">
                        {ativo.ticker}
                      </Text>
                      <Text className="font-corpo text-xs text-inativo">
                        {detalheFormatado}
                      </Text>
                    </View>

                    <View className="mr-2 items-end">
                      <Text className="font-corpo-bold text-base text-texto">
                        {ativo.valor}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        {ehPositivo ? (
                          <CaretUpIcon
                            size={10}
                            weight="fill"
                            color={cores.positivo}
                          />
                        ) : (
                          <CaretDownIcon
                            size={10}
                            weight="fill"
                            color={cores.negativo}
                          />
                        )}
                        <Text
                          className={`font-corpo-medium text-xs ${
                            ehPositivo ? "text-positivo" : "text-negativo"
                          }`}
                        >
                          {ativo.variacao}%
                        </Text>
                      </View>
                    </View>

                    <CaretRightIcon
                      size={18}
                      weight="bold"
                      color={cores.primaria}
                    />
                  </Pressable>
                );
              })}
            </View>
          )}
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

          {fixaAberto && (
            <View className="divide-y divide-texto/10 gap-5">
              {ativosDados.rendaFixa.map((ativo) => {
                const detalheFixa = `${ativo.taxa} - vence ${ativo.vencimento}`;

                return (
                  <Pressable
                    key={ativo.id}
                    onPress={() =>
                      router.push({
                        pathname: "/ativos/[id]",
                        params: { id: ativo.id },
                      })
                    }
                    className="flex-row items-center pt-5"
                  >
                    <View className="flex-1">
                      <Text className="font-corpo-bold text-base text-texto">
                        {ativo.nome}
                      </Text>
                      <Text className="font-corpo text-xs text-inativo">
                        {detalheFixa}
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
                );
              })}
            </View>
          )}
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

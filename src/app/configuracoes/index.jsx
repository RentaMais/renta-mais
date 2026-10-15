import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { User, CaretRight } from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { BotaoCustomer } from "@/components/BotaoCustomer";

import { cores } from "@/cores";

// Componente local para os títulos de seção
function TituloSecao({ titulo }) {
  return (
    <Text className="font-corpo-bold text-primaria text-sm pl-1 mb-2 mt-6">
      {titulo}
    </Text>
  );
}

// Componente local para cada linha do menu
function ItemMenu({ titulo, valor, onPress, temSeta = true }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4 active:opacity-60"
    >
      <Text className="font-titulo-regular font-bold text-texto text-base">
        {titulo}
      </Text>
      <View className="flex-row items-center gap-2">
        {valor && (
          <Text className="font-corpo text-sm text-subtexto">{valor}</Text>
        )}
        {temSeta && <CaretRight size={18} color={cores.subtexto} />}
      </View>
    </Pressable>
  );
}

export default function ConfiguracoesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <VoltarCustomer />

        <CabecalhoTela
          titulo="Configurações"
          descricao="Gerencie sua conta e preferências do app"
        />

        <View className="mt-6 flex-row items-center gap-4 rounded-2xl">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-texto">
            <User size={32} color={cores.fundo} weight="bold" />
          </View>
          <View>
            <Text className="font-titulo text-xl text-texto">João Pedro</Text>
            <Text className="font-corpo text-xs text-subtexto">
              joao.pedro10@gmail.com
            </Text>
          </View>
        </View>

        {/* Seção Conta */}
        <TituloSecao titulo="Conta" />
        <View className="bg-container px-4 rounded-xl border border-texto/10 divide-y divide-texto/10">
          <ItemMenu
            titulo="Editar perfil"
            onPress={() => router.push("/configuracoes/editar-perfil")}
          />
          <ItemMenu
            titulo="Alterar senha"
            onPress={() => router.push("/configuracoes/alterar-senha")}
          />
        </View>

        {/* Seção Sobre */}
        <TituloSecao titulo="Sobre" />
        <View className="bg-container px-4 rounded-xl border border-texto/10 divide-y divide-texto/10">
          <ItemMenu
            titulo="Central de ajuda"
            onPress={() => router.push("/configuracoes/central")}
          />
          <ItemMenu titulo="Versão do app" valor="0.1.0" temSeta={false} />
        </View>

        <View className="mt-[48] gap-3">
          <BotaoCustomer
            titulo="Sair da conta"
            className="bg-vermelho"
            onPress={() => router.push("/(auth)/login")}
          />
          <BotaoCustomer
            titulo="Excluir conta"
            className="bg-vermelho"
            onPress={() => router.push("/configuracoes/excluir-conta")}
          />
        </View>
      </View>
    </View>
  );
}

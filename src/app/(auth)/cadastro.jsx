import { Text, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";

export default function LoginScreen() {
  const [nome, setNome] = useState();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <VoltarCustomer />
        <CabecalhoTela subtitulo="Primeiros passos" titulo="Crie sua conta" />
        <InputCustomer
          titulo="Nome"
          placeholder="Como podemos te chamar"
          value={nome}
          onChangeText={() => {}}
          className="mt-[36]"
        />
        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu email"
          value={email}
          onChangeText={() => {}}
          className="mt-4"
        />
        <InputCustomer
          titulo="Senha"
          placeholder="Mínimo de 8 caracteres"
          value={senha}
          onChangeText={() => {}}
          className="mt-4"
        />
        <InputCustomer
          titulo="Senha"
          placeholder="Digite novamente"
          value={senha}
          onChangeText={() => {}}
          className="mt-4"
        />

        {/* TODO: Implementar validação para o cadastro */}
        <BotaoCustomer
          titulo="Criar conta"
          className="mt-[48]"
          onPress={() => router.push("/login")}
        />
        <Text className="text-xs text-subtexto font-corpo mt-5">
          Ao continuar, você concorda com os termos de uso e a política de
          privacidade
        </Text>
      </View>
    </View>
  );
}

import { Text, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";

export default function LoginScreen() {
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <CabecalhoTela
          subtitulo="Bem-vindo de volta"
          titulo="Acesse sua Carteira"
        />
        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu email"
          value={email}
          onChangeText={() => {}}
          className="mt-[48]"
        />
        <InputCustomer
          titulo="Senha"
          placeholder="*********"
          value={senha}
          onChangeText={() => {}}
          className="mt-4"
        />

        <Text
          className="text-right text-sm underline text-primaria font-corpo-bold mt-2"
          onPress={() => router.push("/esqueci-senha")}
        >
          Esqueci minha senha
        </Text>

        {/* TODO: Implementar autentição e validação para o login */}
        <BotaoCustomer
          titulo="Entrar"
          className="mt-[48]"
          onPress={() => router.push("/(tabs)")}
        />
        <View className="mt-4 items-center">
          <Text className="text-center text-sm text-texto font-corpo-bold">
            Ainda não tem conta?{" "}
            <Text
              className="text-primaria underline"
              onPress={() => router.push("/cadastro")}
            >
              Criar conta
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

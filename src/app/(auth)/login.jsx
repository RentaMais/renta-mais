import { Text, Image, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Eye, EyeSlash } from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { cores } from "@/cores";
import { TelaCustomer } from "@/components/TelaCustomer";

export default function LoginScreen() {
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [esconderSenha, setEsconderSenha] = useState(true);
  const router = useRouter();

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[180]">
        <Image
          source={require("../../../assets/logo.png")}
          style={{
            width: 42,
            height: 42,
            tintColor: cores.primaria,
            marginBottom: 12,
          }}
          resizeMode="contain"
        />

        <CabecalhoTela
          subtitulo="Bem-vindo de volta"
          titulo="Acesse sua Carteira"
        />
        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          className="mt-[48]"
        />
        <View className="relative w-full">
          <InputCustomer
            titulo="Senha"
            placeholder="Digite sua senha"
            value={senha}
            secureTextEntry={esconderSenha}
            onChangeText={setSenha}
            className="mt-4"
          />
          <Pressable
            onPress={() => setEsconderSenha(!esconderSenha)}
            className="absolute right-4 top-[58px]"
          >
            {esconderSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>
        <Text
          className="text-right text-sm underline text-primaria font-corpo-bold mt-2"
          onPress={() => router.push("/esqueci-senha")}
        >
          Esqueci minha senha
        </Text>
      </View>

      <View>
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
    </TelaCustomer>
  );
}

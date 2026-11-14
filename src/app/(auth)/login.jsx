import { Text, Image, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Eye, EyeSlash } from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { cores } from "@/cores";
import { TelaCustomer } from "@/components/TelaCustomer";
import { entrarComEmailESenha } from "@/services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [esconderSenha, setEsconderSenha] = useState(true);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);
      await entrarComEmailESenha({ email, password: senha });
      router.replace("/(tabs)");
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

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
          autoCapitalize="none"
          keyboardType="email-address"
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

        {erro ? (
          <Text className="text-erro font-corpo-medium text-sm mt-3">
            {erro}
          </Text>
        ) : null}

        <Text
          className="text-right text-sm underline text-primaria font-corpo-bold mt-2"
          onPress={() => router.push("/esqueci-senha")}
        >
          Esqueci minha senha
        </Text>
      </View>

      <View>
        <BotaoCustomer
          titulo={carregando ? "Entrando..." : "Entrar"}
          className="mt-[48]"
          onPress={handleLogin}
          disabled={carregando}
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

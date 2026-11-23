import { Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Eye, EyeSlash } from "phosphor-react-native";
import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { RequisitosSenha } from "@/components/RequisitosSenha";
import { useCadastro } from "@/hooks/useAuth";
import { cores } from "@/cores";

export default function CadastroScreen() {
  const [mostrarSenha, setMostrarSenha] = useState(true);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(true);
  const router = useRouter();
  const {
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha,
    estadoEmail,
    estadoSenha,
    estadoConfirmar,
    senhasDiferentes,
    erro,
    carregando,
    validarCadastro,
  } = useCadastro({
    onSucesso: () => router.replace("/(tabs)"),
  });

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[120]">
        <VoltarCustomer />
        <CabecalhoTela subtitulo="Primeiros passos" titulo="Crie sua conta" />
        <InputCustomer
          titulo="Nome"
          placeholder="Como podemos te chamar"
          value={nome}
          onChangeText={setNome}
          className="mt-[36]"
        />
        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          estado={estadoEmail}
          className="mt-4"
        />
        <View className="relative w-full">
          <InputCustomer
            titulo="Senha"
            placeholder="Mínimo de 8 caracteres"
            value={senha}
            onChangeText={setSenha}
            className="mt-4"
            secureTextEntry={mostrarSenha}
            estado={estadoSenha}
          />
          <Pressable
            onPress={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-4 top-[58px]"
          >
            {mostrarSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>
        <RequisitosSenha senha={senha} />

        <View className="relative w-full">
          <InputCustomer
            titulo="Confirmar senha"
            placeholder="Digite novamente"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            className="mt-4"
            secureTextEntry={mostrarConfirmarSenha}
            estado={estadoConfirmar}
          />
          <Pressable
            onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            className="absolute right-4 top-[58px]"
          >
            {mostrarConfirmarSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        {senhasDiferentes ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            As senhas ainda não coincidem.
          </Text>
        ) : null}

        {erro ? (
          <Text className="text-erro font-corpo-medium text-sm mt-3">
            {erro}
          </Text>
        ) : null}
      </View>

      <View>
        <BotaoCustomer
          titulo={carregando ? "Criando conta..." : "Criar conta"}
          className="mt-[48]"
          onPress={validarCadastro}
          disabled={carregando}
        />
        <Text className="text-xs text-subtexto font-corpo mt-5">
          Ao continuar, você concorda com os termos de uso e a política de
          privacidade
        </Text>
      </View>
    </TelaCustomer>
  );
}

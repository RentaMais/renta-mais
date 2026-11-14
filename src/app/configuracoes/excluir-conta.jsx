import { Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { WarningIcon, Eye, EyeSlash } from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { InputCustomer } from "@/components/InputCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { IconeCustomer } from "@/components/IconeCustomer";
import { excluirConta } from "@/services/authService";
import { cores } from "@/cores";

export default function ExcluirContaScreen() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaIncorreta, setSenhaIncorreta] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [esconderSenha, setEsconderSenha] = useState(true);
  const [esconderConfirmarSenha, setEsconderConfirmarSenha] = useState(true);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const estadoSenha =
    (tentouEnviar && !senha) || senhaIncorreta ? "erro" : "padrao";

  const estadoConfirmar =
    (confirmarSenha.length > 0 || tentouEnviar) &&
    (confirmarSenha.length === 0 || senha !== confirmarSenha)
      ? "erro"
      : confirmarSenha.length > 0 && senha === confirmarSenha
        ? "sucesso"
        : "padrao";

  async function handleExcluirConta() {
    setErro("");
    setSenhaIncorreta(false);
    setTentouEnviar(true);

    if (!senha || !confirmarSenha) {
      setErro("Digite e confirme sua senha.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);
      await excluirConta(senha);
      router.replace("/(auth)/login");
    } catch (e) {
      if (e.message.includes("incorreta")) {
        setSenhaIncorreta(true);
      }
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <VoltarCustomer />
        <IconeCustomer icone={WarningIcon} tipo="bold" className="mb-4" />

        <CabecalhoTela
          titulo="Confirmar exclusão de conta"
          descricao="Esta ação é irreversível. Digite sua senha para prosseguir."
        />

        <View className="relative w-full">
          <InputCustomer
            titulo="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              setSenhaIncorreta(false);
            }}
            secureTextEntry={esconderSenha}
            estado={estadoSenha}
            className="mt-6"
          />
          <Pressable
            onPress={() => setEsconderSenha(!esconderSenha)}
            className="absolute right-4 top-[68px]"
          >
            {esconderSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        <View className="relative w-full">
          <InputCustomer
            titulo="Confirmar senha"
            placeholder="Digite novamente"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={esconderConfirmarSenha}
            estado={estadoConfirmar}
            className="mt-4"
          />
          <Pressable
            onPress={() => setEsconderConfirmarSenha(!esconderConfirmarSenha)}
            className="absolute right-4 top-[58px]"
          >
            {esconderConfirmarSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        {confirmarSenha.length > 0 && senha !== confirmarSenha ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            As senhas ainda não coincidem.
          </Text>
        ) : null}

        {erro ? (
          <Text className="text-erro font-corpo-medium text-sm mt-3">
            {erro}
          </Text>
        ) : null}

        <AvisoCustomer
          mensagem="Ao excluir sua conta, todos os seus dados serão apagados permanentemente e não será possível reverter a exclusão."
          className="mt-6"
        />

        <BotaoCustomer
          titulo={carregando ? "Excluindo conta..." : "Excluir conta"}
          className="mt-[48] bg-negativo"
          onPress={handleExcluirConta}
          disabled={carregando}
        />
      </View>
    </View>
  );
}

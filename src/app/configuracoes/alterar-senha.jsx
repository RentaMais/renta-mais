import { Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Eye, EyeSlash } from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { RequisitosSenha } from "@/components/RequisitosSenha";
import { validarSenhaForte } from "@/utils/validacoes";
import { alterarSenha } from "@/services/authService";
import { cores } from "@/cores";

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaAtualIncorreta, setSenhaAtualIncorreta] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [esconderSenhaAtual, setEsconderSenhaAtual] = useState(true);
  const [esconderNovaSenha, setEsconderNovaSenha] = useState(true);
  const [esconderConfirmarNovaSenha, setEsconderConfirmarNovaSenha] =
    useState(true);

  const checkNovaSenha = validarSenhaForte(novaSenha);

  const estadoSenhaAtual =
    (tentouEnviar && !senhaAtual) || senhaAtualIncorreta ? "erro" : "padrao";

  const estadoNovaSenha =
    (novaSenha.length > 0 || tentouEnviar) && !checkNovaSenha.valida
      ? "erro"
      : checkNovaSenha.valida
        ? "sucesso"
        : "padrao";

  const estadoConfirmarSenha =
    (confirmarNovaSenha.length > 0 || tentouEnviar) &&
    (confirmarNovaSenha.length === 0 || novaSenha !== confirmarNovaSenha)
      ? "erro"
      : confirmarNovaSenha.length > 0 && novaSenha === confirmarNovaSenha
        ? "sucesso"
        : "padrao";

  async function handleAlterarSenha() {
    setErro("");
    setSucesso("");
    setSenhaAtualIncorreta(false);
    setTentouEnviar(true);

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (!checkNovaSenha.valida) {
      setErro(checkNovaSenha.erro);
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setErro("As novas senhas não coincidem.");
      return;
    }
    if (senhaAtual === novaSenha) {
      setErro("A nova senha deve ser diferente da senha atual.");
      return;
    }

    try {
      setCarregando(true);
      await alterarSenha({ senhaAtual, novaSenha });
      setSucesso("Senha alterada com sucesso.");
      setTimeout(() => router.back(), 1000);
    } catch (e) {
      if (e.message.includes("incorreta")) {
        setSenhaAtualIncorreta(true);
      }
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[120]">
        <VoltarCustomer />

        <CabecalhoTela
          titulo="Alterar senha"
          descricao="Escolha uma senha nova seguindo os requisitos de segurança"
        />
        <View className="relative w-full mt-[36]">
          <InputCustomer
            titulo="Senha atual"
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChangeText={(texto) => {
              setSenhaAtual(texto);
              setSenhaAtualIncorreta(false);
            }}
            secureTextEntry={esconderSenhaAtual}
            estado={estadoSenhaAtual}
          />
          <Pressable
            onPress={() => setEsconderSenhaAtual(!esconderSenhaAtual)}
            className="absolute right-4 top-[42px]"
          >
            {esconderSenhaAtual ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        <View className="relative w-full mt-4">
          <InputCustomer
            titulo="Nova senha"
            placeholder="Digite sua nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={esconderNovaSenha}
            estado={estadoNovaSenha}
          />
          <Pressable
            onPress={() => setEsconderNovaSenha(!esconderNovaSenha)}
            className="absolute right-4 top-[42px]"
          >
            {esconderNovaSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>
        <RequisitosSenha senha={novaSenha} />

        <View className="relative w-full mt-4">
          <InputCustomer
            titulo="Confirmar nova senha"
            placeholder="Digite novamente"
            value={confirmarNovaSenha}
            onChangeText={setConfirmarNovaSenha}
            secureTextEntry={esconderConfirmarNovaSenha}
            estado={estadoConfirmarSenha}
          />
          <Pressable
            onPress={() =>
              setEsconderConfirmarNovaSenha(!esconderConfirmarNovaSenha)
            }
            className="absolute right-4 top-[42px]"
          >
            {esconderConfirmarNovaSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        {confirmarNovaSenha.length > 0 && novaSenha !== confirmarNovaSenha ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            As novas senhas ainda não coincidem.
          </Text>
        ) : null}

        {erro ? (
          <Text className="text-erro font-corpo-medium text-sm mt-3">
            {erro}
          </Text>
        ) : null}

        {sucesso ? (
          <Text className="text-sucesso font-corpo-medium text-sm mt-3">
            {sucesso}
          </Text>
        ) : null}
      </View>

      <BotaoCustomer
        titulo={carregando ? "Salvando..." : "Salvar nova senha"}
        className="mt-[48]"
        onPress={handleAlterarSenha}
        disabled={carregando}
      />
    </TelaCustomer>
  );
}

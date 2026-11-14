import { Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { User, Eye, EyeSlash } from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { InputCustomer } from "@/components/InputCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { validarEmail } from "@/utils/validacoes";
import {
  alterarEmail,
  alterarNome,
  obterUsuarioAtual,
} from "@/services/authService";
import { cores } from "@/cores";

export default function EditarPerfilScreen() {
  const router = useRouter();
  const usuario = obterUsuarioAtual();

  const [nome, setNome] = useState(usuario?.displayName ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaAtualIncorreta, setSenhaAtualIncorreta] = useState(false);
  const [esconderSenha, setEsconderSenha] = useState(true);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const emailOriginal = (usuario?.email ?? "").toLowerCase();
  const emailAlterado = email.trim().toLowerCase() !== emailOriginal;

  const checkEmail = validarEmail(email);
  const estadoEmail = !checkEmail.valido
    ? "erro"
    : emailAlterado
      ? "sucesso"
      : "padrao";

  const estadoSenhaAtual =
    (tentouEnviar && emailAlterado && !senhaAtual) || senhaAtualIncorreta
      ? "erro"
      : "padrao";

  async function handleSalvarAlteracoes() {
    setErro("");
    setSucesso("");
    setSenhaAtualIncorreta(false);
    setTentouEnviar(true);

    if (!nome.trim()) {
      setErro("Informe seu nome.");
      return;
    }
    if (!checkEmail.valido) {
      setErro(checkEmail.erro);
      return;
    }
    if (emailAlterado && !senhaAtual) {
      setErro("Digite sua senha atual para confirmar a alteração de e-mail.");
      return;
    }

    try {
      setCarregando(true);

      if (emailAlterado) {
        await alterarEmail({ novoEmail: email, senhaAtual });
        setSenhaAtual("");
      }

      if (nome.trim() !== (usuario?.displayName ?? "")) {
        await alterarNome(nome);
      }

      setSucesso("Perfil atualizado com sucesso.");
      setTimeout(() => router.back(), 1000);
    } catch (e) {
      if (emailAlterado && e.message.includes("incorreta")) {
        setSenhaAtualIncorreta(true);
      }
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[80]">
        <VoltarCustomer />

        <CabecalhoTela
          titulo="Editar perfil"
          descricao="Atualize seus dados de identificação"
        />

        <View className="items-center">
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              marginVertical: 24,
            }}
            className="items-center justify-center bg-texto"
          >
            <User size={56} color={cores.container} weight="bold" />
          </View>
        </View>

        <InputCustomer
          titulo="Nome"
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            if (texto.trim().toLowerCase() === emailOriginal) {
              setSenhaAtual("");
              setSenhaAtualIncorreta(false);
            }
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          estado={estadoEmail}
          className="mt-4"
        />

        {emailAlterado ? (
          <View className="relative w-full mt-4">
            <InputCustomer
              titulo="Senha atual"
              placeholder="Confirme sua senha para trocar o e-mail"
              value={senhaAtual}
              onChangeText={(texto) => {
                setSenhaAtual(texto);
                setSenhaAtualIncorreta(false);
              }}
              secureTextEntry={esconderSenha}
              estado={estadoSenhaAtual}
            />
            <Pressable
              onPress={() => setEsconderSenha(!esconderSenha)}
              className="absolute right-4 top-[42px]"
            >
              {esconderSenha ? (
                <Eye size={20} color={cores.subtexto} />
              ) : (
                <EyeSlash size={20} color={cores.subtexto} />
              )}
            </Pressable>
          </View>
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

      <View>
        <AvisoCustomer
          mensagem="Alterar o e-mail exige confirmação com sua senha atual."
          className="mt-[36]"
        />
        <BotaoCustomer
          titulo={carregando ? "Salvando..." : "Salvar alterações"}
          className="mt-[36]"
          onPress={handleSalvarAlteracoes}
          disabled={carregando}
        />
      </View>
    </TelaCustomer>
  );
}

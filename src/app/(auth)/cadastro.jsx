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
import { cores } from "@/cores";

import { validarEmail, validarSenhaForte } from "@/utils/validacoes";
import { cadastrarUsuario } from "@/services/authService";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(true);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(true);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const checkEmail = validarEmail(email);
  const estadoEmail =
    (email.length > 0 || tentouEnviar) && !checkEmail.valido
      ? "erro"
      : checkEmail.valido
        ? "sucesso"
        : "padrao";

  const checkSenha = validarSenhaForte(senha);
  const estadoSenha =
    (senha.length > 0 || tentouEnviar) && !checkSenha.valida
      ? "erro"
      : checkSenha.valida
        ? "sucesso"
        : "padrao";

  const estadoConfirmar =
    (confirmarSenha.length > 0 || tentouEnviar) &&
    (confirmarSenha.length === 0 || senha !== confirmarSenha)
      ? "erro"
      : confirmarSenha.length > 0 && senha === confirmarSenha
        ? "sucesso"
        : "padrao";

  async function validarCadastro() {
    setErro("");
    setTentouEnviar(true);

    if (!nome.trim()) {
      setErro("Informe como você gostaria de ser chamado.");
      return;
    }
    if (!checkEmail.valido) {
      setErro(checkEmail.erro);
      return;
    }
    if (!checkSenha.valida) {
      setErro(checkSenha.erro);
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);
      await cadastrarUsuario({ name: nome, email, password: senha });
      router.replace("/(tabs)");
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

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
            onChangeText={setConfirmaSenha}
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

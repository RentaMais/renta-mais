import { Text, View } from "react-native";
import { useState } from "react";
import { LockSimpleIcon } from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { IconeCustomer } from "@/components/IconeCustomer";
import { enviarEmailRecuperacaoSenha } from "@/services/authService";

export default function EsqueciSenhaScreen() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleRecuperarSenha() {
    setErro("");
    setEnviado(false);

    if (!email.trim() || !email.includes("@")) {
      setErro("Informe um e-mail válido.");
      return;
    }

    try {
      setCarregando(true);
      await enviarEmailRecuperacaoSenha(email);
      setEnviado(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[180]">
        <VoltarCustomer />
        <IconeCustomer icone={LockSimpleIcon} tipo="bold" className="mb-4" />

        <CabecalhoTela
          subtitulo="Recuperar acesso"
          titulo="Esqueceu sua senha?"
          descricao="Informe o e-mail cadastrado e enviaremos um link para você criar uma nova senha"
        />
        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu email"
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            setEnviado(false);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          className="mt-[36]"
        />

        {erro ? (
          <Text className="text-erro font-corpo-medium text-sm mt-3">
            {erro}
          </Text>
        ) : null}
      </View>

      <View>
        <BotaoCustomer
          titulo={carregando ? "Enviando..." : "Enviar link de recuperação"}
          className="mt-[48]"
          onPress={handleRecuperarSenha}
          disabled={carregando}
        />
        {enviado ? (
          <AvisoCustomer
            mensagem={`Link enviado para ${email.trim()}.\nVerifique também a caixa de spam.`}
            className="mt-4"
          />
        ) : null}
      </View>
    </TelaCustomer>
  );
}

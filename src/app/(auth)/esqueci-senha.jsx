import { View } from "react-native";
import { useState } from "react";
import { LockSimpleIcon } from "phosphor-react-native";
import { useRouter } from "expo-router";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { IconeContainer } from "@/components/IconeContainer";

export default function EsqueciSenhaScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[180]">
        <VoltarCustomer />
        <IconeContainer icone={LockSimpleIcon} tipo="bold" className="mb-4" />

        <CabecalhoTela
          subtitulo="Recuperar acesso"
          titulo="Esqueceu sua senha?"
          descricao="Informe o e-mail cadastrado e enviaremos um link para você criar uma nova senha"
        />
        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          className="mt-[36]"
        />
      </View>
      <BotaoCustomer
        titulo="Enviar link de recuperação"
        className="mt-[48]"
        onPress={() => router.push("/redefinir-senha")}
      />
      {email ? (
        <AvisoCustomer
          mensagem={`Link enviado para ${email}.\nVerifique também a caixa de spam.`}
          className="mt-4"
        />
      ) : null}
    </TelaCustomer>
  );
}

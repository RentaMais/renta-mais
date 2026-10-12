import { View } from "react-native";
import { useState } from "react";
import { LockSimpleIcon } from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { IconeContainer } from "@/components/IconeContainer";

export default function LoginScreen() {
  const [email, setEmail] = useState("");

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
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
        <BotaoCustomer
          titulo="Enviar link de recuperação"
          className="mt-[48]"
        />
        {email ? (
          <AvisoCustomer
            mensagem={`Link enviado para ${email}.\nVerifique também a caixa de spam.`}
            className="mt-4"
          />
        ) : null}
      </View>
    </View>
  );
}

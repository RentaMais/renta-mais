import { View } from "react-native";
import { useState } from "react";
import { PasswordIcon } from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { IconeContainer } from "@/components/IconeContainer";

export default function LoginScreen() {
  const [senha, setSenha] = useState("");

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <VoltarCustomer />
        <IconeContainer icone={PasswordIcon} tipo="bold" className="mb-4" />

        <CabecalhoTela
          titulo="Redefinir senha"
          descricao="Escolha uma senha nova com pelo menos 8 caracteres"
        />
        <InputCustomer
          titulo="Senha"
          placeholder="Digite sua nova senha"
          value={senha}
          onChangeText={setSenha}
          className="mt-[36]"
        />
        <InputCustomer
          titulo="Confirmar senha"
          placeholder="Digite novamente"
          value={senha}
          onChangeText={setSenha}
          className="mt-4"
        />
        <BotaoCustomer titulo="Salvar nova senha" className="mt-[48]" />
      </View>
    </View>
  );
}

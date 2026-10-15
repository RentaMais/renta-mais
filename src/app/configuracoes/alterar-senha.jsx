import { View } from "react-native";
import { useState } from "react";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";

export default function LoginScreen() {
  const [senha, setSenha] = useState("");

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <VoltarCustomer />

        <CabecalhoTela
          titulo="Alterar senha"
          descricao="Escolha uma senha nova com pelo menos 8 caracteres"
        />
        <InputCustomer
          titulo="Senha atual"
          placeholder="Digite sua senha atual"
          value={senha}
          onChangeText={setSenha}
          className="mt-[36]"
        />
        <InputCustomer
          titulo="Nova senha"
          placeholder="Digite sua nova senha"
          value={senha}
          onChangeText={setSenha}
          className="mt-4"
        />
        <InputCustomer
          titulo="Confirmar nova senha"
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

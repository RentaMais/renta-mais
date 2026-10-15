import { View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { WarningIcon } from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { InputCustomer } from "@/components/InputCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { IconeContainer } from "@/components/IconeContainer";

export default function ExcluirContaScreen() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <VoltarCustomer />
        <IconeContainer icone={WarningIcon} tipo="bold" className="mb-4" />

        <CabecalhoTela
          titulo="Confirmar exclusão de conta"
          descricao="Esta ação é irreversível. Digite sua senha para prosseguir."
        />

        <InputCustomer
          titulo="Senha"
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          className="mt-6"
        />

        <InputCustomer
          titulo="Confirmar senha"
          placeholder="Digite novamente"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={true}
          className="mt-4"
        />

        <AvisoCustomer
          mensagem="Ao excluir sua conta, todos os seus dados serão apagados permanentemente. Você tem até 30 dias para entrar em contato e recuperar sua conta. Após esse prazo, não será possível reverter a exclusão"
          className="mt-6"
        />

        <BotaoCustomer
          titulo="Excluir conta"
          className="mt-[48] bg-vermelho"
          onPress={() =>
            // Lógica para exclusão da conta
            router.push("/(auth)/login")
          }
        />
      </View>
    </View>
  );
}

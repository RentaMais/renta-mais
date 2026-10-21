import { View } from "react-native";
import { useState } from "react";
import { User } from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { InputCustomer } from "@/components/InputCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { cores } from "@/cores";

export default function EditarPerfilScreen() {
  const [nome, setNome] = useState("João Pedro");
  const [email, setEmail] = useState("joao.pedro10@gmail.com");

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
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
          onChangeText={setEmail}
          className="mt-4"
        />

        <AvisoCustomer
          mensagem="Alterar o e-mail exige confirmação: enviaremos um link de verificação para o novo endereço."
          className="mt-[36]"
        />

        <BotaoCustomer
          titulo="Salvar alterações"
          className="mt-[36]"
          onPress={() => {
            // Lógica para salvar as alterações
          }}
        />
      </View>
    </View>
  );
}

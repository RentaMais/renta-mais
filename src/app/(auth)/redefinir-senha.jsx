import { View, Pressable } from "react-native";
import { useState } from "react";
import { PasswordIcon, Eye, EyeSlash } from "phosphor-react-native";
import { useRouter } from "expo-router";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { IconeCustomer } from "@/components/IconeCustomer";
import { cores } from "@/cores";

export default function RedefinirSenhaScreen() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [esconderSenha, setEsconderSenha] = useState(true);
  const [esconderConfirmarSenha, setEsconderConfirmarSenha] = useState(true);
  const router = useRouter();

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[180]">
        <VoltarCustomer />
        <IconeCustomer icone={PasswordIcon} tipo="bold" className="mb-4" />

        <CabecalhoTela
          titulo="Redefinir senha"
          descricao="Escolha uma senha nova com pelo menos 8 caracteres"
        />
        <View className="relative w-full">
          <InputCustomer
            titulo="Senha"
            placeholder="Digite sua nova senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={esconderSenha}
            className="mt-[36]"
          />
          <Pressable
            onPress={() => setEsconderSenha(!esconderSenha)}
            className="absolute right-4 top-[78px]"
          >
            {esconderSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>
        <View className="relative w-full">
          <InputCustomer
            titulo="Confirmar senha"
            placeholder="Digite novamente"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={esconderConfirmarSenha}
            className="mt-4"
          />
          <Pressable
            onPress={() => setEsconderConfirmarSenha(!esconderConfirmarSenha)}
            className="absolute right-4 top-[58px]"
          >
            {esconderConfirmarSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>
      </View>

      <BotaoCustomer
        titulo="Salvar nova senha"
        className="mt-[48]"
        onPress={() => router.push("/login")}
      />
    </TelaCustomer>
  );
}

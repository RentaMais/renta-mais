import { View, Pressable } from "react-native";
import { useState } from "react";
import { Eye, EyeSlash } from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { cores } from "@/cores";

export default function AlterarSenhaScreen() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [esconderSenhaAtual, setEsconderSenhaAtual] = useState(true);
  const [esconderNovaSenha, setEsconderNovaSenha] = useState(true);
  const [esconderConfirmarNovaSenha, setEsconderConfirmarNovaSenha] =
    useState(true);

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[120]">
        <VoltarCustomer />

        <CabecalhoTela
          titulo="Alterar senha"
          descricao="Escolha uma senha nova com pelo menos 8 caracteres"
        />
        <View className="relative w-full mt-[36]">
          <InputCustomer
            titulo="Senha atual"
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry={esconderSenhaAtual}
          />
          <Pressable
            onPress={() => setEsconderSenhaAtual(!esconderSenhaAtual)}
            className="absolute right-4 top-[42px]"
          >
            {esconderSenhaAtual ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        {/* Nova Senha */}
        <View className="relative w-full mt-4">
          <InputCustomer
            titulo="Nova senha"
            placeholder="Digite sua nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={esconderNovaSenha}
          />
          <Pressable
            onPress={() => setEsconderNovaSenha(!esconderNovaSenha)}
            className="absolute right-4 top-[42px]"
          >
            {esconderNovaSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        {/* Confirmar Nova Senha */}
        <View className="relative w-full mt-4">
          <InputCustomer
            titulo="Confirmar nova senha"
            placeholder="Digite novamente"
            value={confirmarNovaSenha}
            onChangeText={setConfirmarNovaSenha}
            secureTextEntry={esconderConfirmarNovaSenha}
          />
          <Pressable
            onPress={() =>
              setEsconderConfirmarNovaSenha(!esconderConfirmarNovaSenha)
            }
            className="absolute right-4 top-[42px]"
          >
            {esconderConfirmarNovaSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>
      </View>
      <BotaoCustomer titulo="Salvar nova senha" className="mt-[48]" />
    </TelaCustomer>
  );
}

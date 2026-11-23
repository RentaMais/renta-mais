import { Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Eye, EyeSlash } from "phosphor-react-native";
import { InputCustomer } from "@/components/InputCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { RequisitosSenha } from "@/components/RequisitosSenha";
import { useAlterarSenha } from "@/hooks/useConfiguracoes";
import { cores } from "@/cores";

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const [esconderSenhaAtual, setEsconderSenhaAtual] = useState(true);
  const [esconderNovaSenha, setEsconderNovaSenha] = useState(true);
  const [esconderConfirmarNovaSenha, setEsconderConfirmarNovaSenha] =
    useState(true);

  const {
    senhaAtual,
    alterarCampoSenhaAtual,
    estadoSenhaAtual,
    novaSenha,
    setNovaSenha,
    estadoNovaSenha,
    confirmarNovaSenha,
    setConfirmarNovaSenha,
    estadoConfirmarSenha,
    senhasDiferentes,
    erro,
    sucesso,
    carregando,
    handleAlterarSenha,
  } = useAlterarSenha({
    onSucesso: () => router.back(),
  });

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[120]">
        <VoltarCustomer />

        <CabecalhoTela
          titulo="Alterar senha"
          descricao="Escolha uma senha nova seguindo os requisitos de segurança"
        />
        <View className="relative w-full mt-[36]">
          <InputCustomer
            titulo="Senha atual"
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChangeText={alterarCampoSenhaAtual}
            secureTextEntry={esconderSenhaAtual}
            estado={estadoSenhaAtual}
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

        <View className="relative w-full mt-4">
          <InputCustomer
            titulo="Nova senha"
            placeholder="Digite sua nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={esconderNovaSenha}
            estado={estadoNovaSenha}
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
        <RequisitosSenha senha={novaSenha} />

        <View className="relative w-full mt-4">
          <InputCustomer
            titulo="Confirmar nova senha"
            placeholder="Digite novamente"
            value={confirmarNovaSenha}
            onChangeText={setConfirmarNovaSenha}
            secureTextEntry={esconderConfirmarNovaSenha}
            estado={estadoConfirmarSenha}
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

        {senhasDiferentes ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            As novas senhas ainda não coincidem.
          </Text>
        ) : null}

        {erro ? (
          <Text className="text-erro font-corpo-medium text-sm mt-3">
            {erro}
          </Text>
        ) : null}

        {sucesso ? (
          <Text className="text-sucesso font-corpo-medium text-sm mt-3">
            {sucesso}
          </Text>
        ) : null}
      </View>

      <BotaoCustomer
        titulo={carregando ? "Salvando..." : "Salvar nova senha"}
        className="mt-[48]"
        onPress={handleAlterarSenha}
        disabled={carregando}
      />
    </TelaCustomer>
  );
}

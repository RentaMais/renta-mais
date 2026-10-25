import { Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {Eye, EyeSlash} from "phosphor-react-native";

import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { cores } from "@/cores";

export default function CadastroScreen() {
  const [nome, setNome] = useState();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [confirmarSenha, setConfirmaSenha] = useState();
  const [mostrarSenha, setMostrarSenha] = useState(true);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(true);
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <View className="w-[85vw]">
        <VoltarCustomer />
        <CabecalhoTela subtitulo="Primeiros passos" titulo="Crie sua conta" />
        <InputCustomer
          titulo="Nome"
          placeholder="Como podemos te chamar"
          value={nome}
          onChangeText={setNome}
          className="mt-[36]"
        />
        <InputCustomer
          titulo="E-mail"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          className="mt-4"
        />
        <View className=" relative w-full ">
          <InputCustomer
            titulo="Senha"
            placeholder="Mínimo de 8 caracteres"
            value={senha}
            onChangeText={setSenha}
            className="mt-4"
            secureTextEntry={mostrarSenha}
          />
          <Pressable
            onPress={() =>setMostrarSenha(!mostrarSenha)}
            className="absolute right-4 top-[58px]"
          >
          {mostrarSenha ? (
            <Eye size={20} color={cores.subtexto}/>
          ):( 
            <EyeSlash size={20} color={cores.subtexto}/>
          )}
          </Pressable>
        </View>

        <View className=" relative w-full">
          <InputCustomer
            titulo="Confirmar senha"
            placeholder="Digite novamente"
            value={confirmarSenha}
            onChangeText={setConfirmaSenha}
            className="mt-4"
            secureTextEntry={mostrarConfirmarSenha}
          />
          <Pressable 
            onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} 
            className="absolute right-4 top-[58px]"
          >
            {mostrarConfirmarSenha ? (
              <Eye size={20} color={cores.subtexto} />
            ) : (
              <EyeSlash size={20} color={cores.subtexto} />
            )}
          </Pressable>
        </View>

        {/* TODO: Implementar validação para o cadastro */}
        <BotaoCustomer
          titulo="Criar conta"
          className="mt-[48]"
          onPress={() => router.push("/login")}
        />
        <Text className="text-xs text-subtexto font-corpo mt-5">
          Ao continuar, você concorda com os termos de uso e a política de
          privacidade
        </Text>
      </View>
    </View>
  );
}

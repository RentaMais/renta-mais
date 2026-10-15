import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import {
  MagnifyingGlass,
  CaretDown,
  CaretRight,
  Envelope,
} from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { cores } from "@/cores";

import faqs from "@/mocks/faq.json";

// Componente local para os títulos de seção
function TituloSecao({ titulo }) {
  return (
    <Text className="font-corpo-bold text-primaria text-sm pl-1 mb-2 mt-6">
      {titulo}
    </Text>
  );
}

export default function CentralScreen() {
  const [busca, setBusca] = useState("");
  // Estado para controlar qual pergunta do FAQ está aberta (index 0 aberta por padrão como no print)
  const [perguntaAberta, setPerguntaAberta] = useState(0);

  return (
    <ScrollView
      className="flex-1 bg-fundo"
      contentContainerStyle={{ alignItems: "center", paddingVertical: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="w-[85vw]">
        <VoltarCustomer />

        <CabecalhoTela
          titulo="Central de ajuda"
          descricao="Tire dúvidas ou fale com o suporte"
        />

        <View className="mt-6 flex-row items-center h-12 rounded-xl border border-texto/20 bg-container px-4 gap-3">
          <MagnifyingGlass size={20} color={cores.subtexto} />
          <TextInput
            placeholder="Buscar uma dúvida..."
            placeholderTextColor={cores.placeholder}
            value={busca}
            onChangeText={setBusca}
            className="flex-1 font-corpo text-sm text-texto"
          />
        </View>

        <TituloSecao titulo="Perguntas frequentes" />
        <View className="bg-container px-4 rounded-xl border border-texto/10 divide-y divide-texto/10">
          {faqs.map((faq, index) => {
            const estaAberta = perguntaAberta === index;

            return (
              <Pressable
                key={index}
                onPress={() => setPerguntaAberta(estaAberta ? null : index)}
                className="py-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-corpo-bold text-texto text-sm flex-1 pr-2">
                    {faq.pergunta}
                  </Text>
                  {estaAberta ? (
                    <CaretDown size={18} color={cores.subtexto} />
                  ) : (
                    <CaretRight size={18} color={cores.subtexto} />
                  )}
                </View>

                {estaAberta && faq.resposta && (
                  <Text className="font-corpo text-xs text-subtexto mt-3 leading-relaxed">
                    {faq.resposta}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        <TituloSecao titulo="Ainda precisa de ajuda?" />
        <View className="bg-container p-4 rounded-xl border border-texto/10 flex-row items-center gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-lg bg-primaria/20">
            <Envelope size={24} color={cores.primaria} weight="bold" />
          </View>
          <View className="flex-1">
            <Text className="font-titulo text-texto text-base">
              suporte@rentamais.com
            </Text>
            <Text className="font-corpo text-xs text-subtexto">
              Envie sua dúvida por e-mail
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

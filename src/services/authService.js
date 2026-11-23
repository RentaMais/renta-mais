import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/services/firebase";

const SUBCOLECOES_USUARIO = ["assets"];

function traduzirErroAuth(erro, { reautenticando = false } = {}) {
  switch (erro?.code) {
    case "auth/invalid-email":
      return "O formato do e-mail é inválido.";
    case "auth/user-disabled":
      return "Esta conta foi desativada.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return reautenticando
        ? "Senha incorreta."
        : "E-mail ou senha incorretos.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde.";
    case "auth/requires-recent-login":
      return "Por segurança, confirme sua senha atual para continuar.";
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements":
      return "A senha não atende aos requisitos mínimos de segurança.";
    default:
      return "Não foi possível concluir a operação. Tente novamente.";
  }
}

async function reautenticar(senhaAtual) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("Usuário não autenticado.");
  }

  const credencial = EmailAuthProvider.credential(user.email, senhaAtual);
  await reauthenticateWithCredential(user, credencial);
  return user;
}

export function observarEstadoAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function obterUsuarioAtual() {
  return auth.currentUser;
}

export async function cadastrarUsuario({ name, email, password }) {
  const emailLimpo = email.trim().toLowerCase();
  try {
    const credencial = await createUserWithEmailAndPassword(
      auth,
      emailLimpo,
      password,
    );
    const { user } = credencial;

    await updateProfile(user, { displayName: name.trim() });

    await setDoc(doc(db, "users", user.uid), {
      name: name.trim(),
      email: emailLimpo,
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (erro) {
    throw new Error(traduzirErroAuth(erro));
  }
}

export async function entrarComEmailESenha({ email, password }) {
  try {
    const credencial = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );
    return credencial.user;
  } catch (erro) {
    throw new Error(traduzirErroAuth(erro));
  }
}

export async function sairDaConta() {
  await signOut(auth);
}

export async function enviarEmailRecuperacaoSenha(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (erro) {
    throw new Error(traduzirErroAuth(erro));
  }
}

export async function alterarNome(novoNome) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  const nomeLimpo = novoNome.trim();
  await updateProfile(user, { displayName: nomeLimpo });
  await updateDoc(doc(db, "users", user.uid), { name: nomeLimpo });
}

export async function alterarEmail({ novoEmail, senhaAtual }) {
  try {
    const user = await reautenticar(senhaAtual);
    const emailLimpo = novoEmail.trim().toLowerCase();

    await updateEmail(user, emailLimpo);
    await updateDoc(doc(db, "users", user.uid), { email: emailLimpo });
  } catch (erro) {
    if (erro?.code === "auth/operation-not-allowed") {
      throw new Error(
        "Desative 'Email enumeration protection' nas configurações de Authentication do Firebase Console para alterar o e-mail diretamente.",
      );
    }
    throw new Error(traduzirErroAuth(erro, { reautenticando: true }));
  }
}

export async function alterarSenha({ senhaAtual, novaSenha }) {
  try {
    const user = await reautenticar(senhaAtual);
    await updatePassword(user, novaSenha);
  } catch (erro) {
    throw new Error(traduzirErroAuth(erro, { reautenticando: true }));
  }
}

export async function excluirConta(senhaAtual) {
  try {
    const user = await reautenticar(senhaAtual);
    const { uid } = user;

    for (const subcolecao of SUBCOLECOES_USUARIO) {
      const snapshot = await getDocs(collection(db, "users", uid, subcolecao));
      await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)));
    }

    await deleteDoc(doc(db, "users", uid));
    await deleteUser(user);
  } catch (erro) {
    throw new Error(traduzirErroAuth(erro, { reautenticando: true }));
  }
}

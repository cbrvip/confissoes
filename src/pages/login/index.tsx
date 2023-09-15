import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import toast from 'react-hot-toast';
import { Header } from '../../components/header';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório")
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  async function getUsernameFromDatabase(uid: string) {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);
  
    try {
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.username;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar nome de usuário:', error);
      return null;
    }
  }

  async function onSubmit(data: FormData) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    const username = await getUsernameFromDatabase(user.uid);

    toast.success('Logado com sucesso!', {
      position: 'bottom-right',
});
    

    if (username) {
      navigate(`/profile/${username}`, { replace: true });
    } else {

    }
  } catch (err) {
    toast.error("Erro ao fazer o login", {
      position: 'bottom-right',
  });
  }
}

  return (
    <>
      <Header />
      <Container>
        <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
          <Link to="/" className="mb-6 max-w-sm w-full">
            <img
              className="w-full"
              src={logoImg}
              alt="Logo do site"
            />
          </Link>
          <form
            className="bg-white max-w-xl w-full rounded-lg p-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-3">
              <Input
                type="email"
                placeholder="Digite seu email..."
                name="email"
                error={errors.email?.message}
                register={register}
              />
            </div>

            <div className="mb-3">
              <Input
                type="password"
                placeholder="Digite sua senha..."
                name="password"
                error={errors.password?.message}
                register={register}
              />
            </div>

            <button
              className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
              type="submit"
            >
              Acessar
            </button>
            <Link to="/lost">
            <h1 className="mt-3 text-sm">Esqueceu a sua senha ?</h1>
          </Link>
          </form>
          <Link to="/">
            Voltar para página inicial
          </Link>
        </div>
      </Container>
    </>
  );
}

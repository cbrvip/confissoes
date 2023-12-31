import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/input';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '../../services/firebaseConnection';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Header } from '../../components/header';

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").nonempty("O campo senha é obrigatório"),
  username: z.string().nonempty("O campo nome de usuário é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const { handleInfoUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  async function onSubmit(data: FormData) {
    try {
      // Transform the username
      const formattedUsername = data.username.toLowerCase().replace(/[^a-z0-9]/g, '');
  
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: data.name,
        photoURL: 'https://www.cornosvip.com/photo.png', // Set the default photo URL here
      });
  
      const userDocRef = doc(db, 'users', user.uid);
  
      await setDoc(userDocRef, {
        uid: user.uid,
        name: data.name,
        email: data.email,
        username: formattedUsername, // Use the formatted username
        photo: 'https://www.cornosvip.com/photo.png', // Set the default photo URL here as well
        admin: 0
      });
  
      handleInfoUser({
        uid: user.uid,
        name: data.name,
        email: data.email,
        username: formattedUsername, // Use the formatted username
        photo: 'https://www.cornosvip.com/photo.png', // Set the default photo URL here as well
        admin: 0
      });
  
      toast.success('Usuário cadastrado com sucesso!');
      navigate(`/profile/${formattedUsername}`, { replace: true });
    } catch (error) {
      toast.error('Erro ao cadastrar usuário!');
      console.log(error);
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
              type="text"
              placeholder="Digite um nome de exibição"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome de usuário..."
              name="username"
              error={errors.username?.message}
              register={register}
            />
          </div>
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
          >
            Acessar
          </button>
        </form>
      </div>
    </Container>
    </>
  )
}